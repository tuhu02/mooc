<?php

namespace App\Http\Controllers\Web\Member;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Http\Resources\CurrentLearningModuleResource;
use App\Http\Resources\LearningCourseResource;
use App\Http\Resources\ModuleNavigationResource;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $events = Course::query()
            ->where('type', 'event')
            ->with('categories')
            ->withCount(['modules', 'members'])
            ->orderBy('id', 'desc')
            ->cursorPaginate(6)
            ->through(fn(Course $course) => (new CourseResource($course))->resolve())
            ->withQueryString();

        return Inertia::render('member/event/event', [
            'events' => $events,
        ]);
    }

    public function show(Course $course)
    {
        abort_if($course->type !== 'event', 404);

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

        return Inertia::render('member/event/event-detail', [
            'course' => (new CourseResource($course))->resolve(),
            'isEnrolled' => $isEnrolled,
        ]);
    }

    public function enroll(Course $course)
    {
        abort_if($course->type !== 'event', 404);

        $user = Auth::user();
        $member = $user->member;

        if (!$member) {
            return redirect()
                ->route('member.events.show', $course->slug)
                ->with('error', 'Profil member tidak ditemukan. Hubungi admin.');
        }

        if ($member->courses()->where('course_id', $course->id)->exists()) {
            $firstAvailableSortOrder = $course->modules()
                ->where(function ($q) {
                    $q->whereNull('available_at')
                        ->orWhere('available_at', '<=', now());
                })
                ->orderBy('sort_order')
                ->orderBy('id')
                ->value('sort_order');

            return redirect()->route('member.events.learning', [
                'course' => $course->slug,
                'sort_order' => $firstAvailableSortOrder,
            ])->with('info', 'Anda sudah terdaftar di event ini.');
        }

        $member->courses()->attach($course->id, ['enrolled_at' => now()]);

        $firstAvailableSortOrder = $course->modules()
            ->where(function ($q) {
                $q->whereNull('available_at')
                    ->orWhere('available_at', '<=', now());
            })
            ->orderBy('sort_order')
            ->orderBy('id')
            ->value('sort_order');

        return redirect()->route('member.events.learning', [
            'course' => $course->slug,
            'sort_order' => $firstAvailableSortOrder,
        ])->with('success', 'Berhasil mendaftar ke event! Selamat belajar.');
    }

    public function learning(Course $course, ?int $sort_order = null)
    {
        abort_if($course->type !== 'event', 404);

        $user = Auth::user();
        $member = $user?->member;

        $course->load([
            'categories',
            'modules' => fn($query) => $query
                ->with([
                    'assignments' => fn($q) => $q->with([
                        'submissions' => fn($s) => $member
                            ? $s->where('member_id', $member->id)->latest()->limit(1)
                            : $s->whereRaw('1 = 0'),
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

        $isEnrolled = $member
            ? $member->courses()->where('course_id', $course->id)->exists()
            : false;

        $firstModuleSortOrder = $course->modules->first()?->sort_order;
        $targetSortOrder = $sort_order ?? $firstModuleSortOrder;

        $currentModule = $targetSortOrder === null
            ? null
            : $course->modules->firstWhere('sort_order', $targetSortOrder);

        if ($targetSortOrder !== null && !$currentModule) {
            abort(404, 'Sesi dengan urutan tersebut tidak ditemukan.');
        }

        if ($currentModule?->available_at && now()->lt($currentModule->available_at)) {
            abort(403, 'Sesi ini belum tersedia.');
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

        return Inertia::render('member/event/event-learning', [
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
        ]);
    }
}