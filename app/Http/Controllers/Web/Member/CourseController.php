<?php

namespace App\Http\Controllers\Web\Member;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Http\Resources\CurrentLearningModuleResource;
use App\Http\Resources\LearningCourseResource;
use App\Http\Resources\ModuleNavigationResource;
use App\Models\Category;
use App\Models\Course;
use App\Models\ModuleProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('q', ''));
        $memberId = Auth::user()?->member?->id;

        $courses = fn() => Course::query()
            ->with('categories')
            ->withCount(['modules', 'members'])
            ->where('type', 'default')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('mentor.user', function ($q2) use ($search) {
                            $q2->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->filled('level'), function ($query) use ($request) {
                $query->where('level', $request->level);
            })
            ->when($request->filled('category_id'), function ($query) use ($request) {
                $query->whereHas('categories', function ($categoryQuery) use ($request) {
                    $categoryQuery->where('categories.id', $request->category_id);
                });
            })
            ->when($request->filled('enrolled') && Auth::check(), function ($query) use ($request) {
                $memberId = Auth::user()?->member?->id;
                if (!$memberId) return;

                if ($request->enrolled === '1') {
                    $query->whereHas('members', fn($q) => $q->where('member_id', $memberId));
                } elseif ($request->enrolled === '0') {
                    $query->whereDoesntHave('members', fn($q) => $q->where('member_id', $memberId));
                }
            })
            ->orderBy('id', 'desc')
            ->cursorPaginate(6)
            ->through(fn(Course $course) => (new CourseResource($course, $memberId))->resolve())
            ->withQueryString();

        return Inertia::render('member/course', [
            'categories' => fn() => Category::all(),
            'query' => $search,
            'courses' => $courses,
        ]);
    }

    public function show(Course $course)
    {
        $user = Auth::user();
        $member = $user?->member;
        $memberId = $member?->id;

        $isEnrolled = $member
            ? $member->courses()->where('course_id', $course->id)->exists()
            : false;

        $course->load([
            'categories',
            'mentor.user',
            'modules' => fn($query) => $query
                ->where('is_preview', true)
                ->with([
                    'assignments' => fn($assignmentQuery) => $assignmentQuery->with([
                        'submissions' => fn($submissionQuery) => $submissionQuery
                            ->when(
                                $memberId,
                                fn($q) => $q->where('member_id', $memberId),
                                fn($q) => $q->whereRaw('1 = 0'),
                            )
                            ->latest()
                            ->limit(1),
                    ]),
                ])
                ->orderBy('sort_order')
                ->orderBy('id'),
        ])->loadCount(['modules', 'members']);

        $course->modules->each(function ($module) {
            $module->assignments->each(function ($assignment) {
                $assignment->submission = $assignment->submissions->first();
                unset($assignment->submissions);
            });
        });

        return Inertia::render('member/course-detail', [
            'course' => (new CourseResource($course))->resolve(),
            'isEnrolled' => $isEnrolled,
        ]);
    }

    public function enroll(Course $course)
    {
        $user = Auth::user();
        $member = $user?->member;

        if (!$member) {
            return redirect()
                ->route('member.courses.show', $course->slug)
                ->with('error', 'Profil member tidak ditemukan. Hubungi admin.');
        }

        $firstPreviewSortOrder = $course->modules()
            ->where('is_preview', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->value('sort_order');

        $targetSortOrder = $firstPreviewSortOrder;

        if ($member->courses()->where('course_id', $course->id)->exists()) {
            return redirect()->route('member.courses.learning', [
                'course' => $course->slug,
                'sort_order' => $targetSortOrder,
            ])->with('info', 'Anda sudah terdaftar di kursus ini.');
        }

        $member->courses()->attach($course->id, [
            'enrolled_at' => now(),
        ]);

        return redirect()->route('member.courses.learning', [
            'course' => $course->slug,
            'sort_order' => $targetSortOrder,
        ])->with('success', 'Berhasil mendaftar ke kursus! Mulai belajar sekarang.');
    }

    public function learning(Course $course, ?int $sort_order = null)
    {
        $user = Auth::user();
        $member = $user?->member;

        $isEnrolled = $member
            ? $member->courses()->where('course_id', $course->id)->exists()
            : false;

        $course->load([
            'categories',
            'modules' => fn($query) => $query
                ->with([
                    'assignments' => fn($q) => $q->with([
                        'submissions' => fn($s) => $s
                            ->when(
                                $member,
                                fn($q) => $q->where('member_id', $member->id),
                                fn($q) => $q->whereRaw('1 = 0'),
                            )
                            ->latest()
                            ->limit(1),
                    ]),
                    'attachments' => fn($q) => $q->orderBy('id'),
                ])
                ->orderBy('sort_order')
                ->orderBy('id'),
        ])->loadCount(['modules', 'members']);

        foreach ($course->modules as $module) {
            foreach ($module->assignments as $assignment) {
                $assignment->submission = $assignment->submissions->first();
                unset($assignment->submissions);
            }
        }

        $firstModuleSortOrder = $course->modules->first()?->sort_order;
        $targetSortOrder = $sort_order ?? $firstModuleSortOrder;

        $currentModule = $targetSortOrder === null
            ? null
            : $course->modules->firstWhere('sort_order', $targetSortOrder);

        if ($targetSortOrder !== null && !$currentModule) {
            abort(404, 'Modul dengan urutan tersebut tidak ditemukan.');
        }

        if ($currentModule && !$currentModule->is_preview && !$isEnrolled) {
            abort(403, 'Modul ini terkunci. Silakan login dan daftar terlebih dahulu.');
        }

        if ($currentModule && $member && $isEnrolled) {
            ModuleProgress::updateOrCreate(
                [
                    'member_id' => $member->id,
                    'module_id' => $currentModule->id,
                ],
                [
                    'course_id' => $course->id,
                    'completed_at' => now(),
                ]
            );
        }

        $completedIds = $member
            ? ModuleProgress::where('member_id', $member->id)
            ->where('course_id', $course->id)
            ->whereNotNull('completed_at')
            ->pluck('module_id')
            : collect();

        $totalModules = $course->modules->count();
        $completedCount = $completedIds->count();

        $progressPercentage = $totalModules > 0
            ? round(($completedCount / $totalModules) * 100)
            : 0;

        $moduleIndex = $currentModule
            ? $course->modules->search(fn($module) => $module->id === $currentModule->id)
            : false;

        $previousModule = $moduleIndex !== false && $moduleIndex > 0
            ? $course->modules[$moduleIndex - 1]
            : null;

        $nextModule = $moduleIndex !== false && $moduleIndex < ($course->modules->count() - 1)
            ? $course->modules[$moduleIndex + 1]
            : null;

        return Inertia::render('member/course-learning', [
            'isEnrolled' => $isEnrolled,

            'course' => (new LearningCourseResource($course, $isEnrolled))->resolve(),

            'initialModuleSortOrder' => $currentModule?->sort_order,

            'currentModule' => $currentModule
                ? (new CurrentLearningModuleResource($currentModule, $isEnrolled))->resolve()
                : null,

            'navigation' => [
                'previous' => $previousModule
                    ? (new ModuleNavigationResource($previousModule, $isEnrolled))->resolve()
                    : null,

                'next' => $nextModule
                    ? (new ModuleNavigationResource($nextModule, $isEnrolled))->resolve()
                    : null,
            ],

            'progress' => [
                'completed' => $completedCount,
                'total' => $totalModules,
                'percentage' => $progressPercentage,
            ],

            'completedModuleIds' => $completedIds->values(),
        ]);
    }

    public function completion(Course $course)
    {
        $user = Auth::user();
        $member = $user?->member;

        if (!$member) {
            return redirect()->route('member.courses.show', $course->slug);
        }

        $isEnrolled = $member->courses()->where('course_id', $course->id)->exists();

        if (!$isEnrolled) {
            return redirect()->route('member.courses.show', $course->slug);
        }

        $course->load([
            'modules' => fn($query) => $query
                ->orderBy('sort_order')
                ->orderBy('id'),
        ])->loadCount(['modules', 'members']);

        $completedIds = ModuleProgress::where('member_id', $member->id)
            ->where('course_id', $course->id)
            ->whereNotNull('completed_at')
            ->pluck('module_id');

        $totalModules = $course->modules->count();
        $completedCount = $completedIds->count();

        $progressPercentage = $totalModules > 0
            ? round(($completedCount / $totalModules) * 100)
            : 0;

        return Inertia::render('member/course-completion', [
            'course' => (new LearningCourseResource($course, $isEnrolled))->resolve(),
            'progress' => [
                'completed' => $completedCount,
                'total' => $totalModules,
                'percentage' => $progressPercentage,
            ],
        ]);
    }
}
