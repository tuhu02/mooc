<?php

namespace App\Http\Controllers\Web\Member;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class CourseController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('q', ''));

        $courses = fn() => Course::query()
            ->with('categories')
            ->withCount(['modules', 'members'])
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
            ->orderBy('id', 'desc')
            ->cursorPaginate(6)
            ->withQueryString();

        return Inertia::render('member/course', [
            'categories' => fn() => Category::all(),
            'query' => fn() => $search,
            'courses' => $courses,
        ]);
    }

    public function show(Course $course)
    {
        $user = Auth::user();
        $member = $user?->member;
        $memberId = $member?->id;
        $isEnrolled = $member ? $member->courses()->where('course_id', $course->id)->exists() : false;

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
            'course' => $course,
            'isEnrolled' => $isEnrolled,
        ]);
    }


    public function enroll(Course $course)
    {
        $user = Auth::user();
        $member = $user->member;

        $firstPreviewSortOrder = $course->modules()
            ->where('is_preview', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->value('sort_order');

        $firstModuleSortOrder = $course->modules()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->value('sort_order');

        $targetSortOrder = $firstPreviewSortOrder ?? $firstModuleSortOrder;

        if ($member->courses()->where('course_id', $course->id)->exists()) {
            return redirect()->route('member.courses.learning', [
                'course' => $course->slug,
                'sort_order' => $targetSortOrder,
            ])->with('info', 'Anda sudah terdaftar di kursus ini.');
        }

        $member->courses()->attach($course->id, ['enrolled_at' => now()]);

        return redirect()->route('member.courses.learning', [
            'course' => $course->slug,
            'sort_order' => $targetSortOrder,
        ])->with('success', 'Berhasil mendaftar ke kursus! Mulai belajar sekarang.');
    }

    public function learning(Course $course, ?int $sort_order = null)
    {
        $user = Auth::user();
        $member = $user->member;

        if (!$member->courses()->where('course_id', $course->id)->exists()) {
            return redirect()->route('member.courses.show', $course->slug)
                ->with('error', 'Anda belum terdaftar di kursus ini. Silakan daftar terlebih dahulu.');
        }

        $course->load([
            'categories',
            'modules' => fn($query) => $query
                ->with([
                    'assignments' => fn($q) => $q->with([
                        'submissions' => fn($s) => $s
                            ->where('member_id', $member->id)
                            ->latest()
                            ->limit(1),
                    ]),
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
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'thumbnail' => $course->thumbnail,
                'description' => $course->description,
                'level' => $course->level,
                'is_active' => $course->is_active,
                'is_highlight' => $course->is_highlight,
                'categories' => $course->categories->map(fn($category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                ]),
                'modules_count' => $course->modules_count,
                'members_count' => $course->members_count,
            ],
            'initialModuleSortOrder' => $currentModule?->sort_order,
            'currentModule' => $currentModule ? [
                'id' => $currentModule->id,
                'sort_order' => $currentModule->sort_order,
                'title' => $currentModule->title,
                'thumbnail' => $currentModule->thumbnail,
                'video' => $currentModule->video,
                'description' => $currentModule->description,
                'duration' => $currentModule->duration,
                'attachment' => $currentModule->attachment,
                'is_preview' => $currentModule->is_preview,
                'assignments' => $currentModule->assignments,
            ] : null,
            'navigation' => [
                'previous' => $previousModule ? [
                    'sort_order' => $previousModule->sort_order,
                    'title' => $previousModule->title,
                ] : null,
                'next' => $nextModule ? [
                    'sort_order' => $nextModule->sort_order,
                    'title' => $nextModule->title,
                ] : null,
            ],
        ]);
    }
}
