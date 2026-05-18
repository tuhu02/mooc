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
        $events = fn() => Course::query()
            ->where('type', 'event')
            ->with('categories')
            ->withCount(['modules', 'members'])
            ->orderBy('id', 'desc')
            ->cursorPaginate(6)
            ->through(fn (Course $course) => (new CourseResource($course))->resolve())
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

        $isEnrolled = $member
            ? $member->courses()->where('course_id', $course->id)->exists()
            : false;

        $course->load([
            'categories',
            'mentor.user',
            'modules' => fn ($query) => $query
                ->with([
                    'assignments' => fn ($q) => $q->with([
                        'submissions' => fn ($s) => $member
                            ? $s->where('member_id', $member->id)->latest()->limit(1)
                            : $s->whereRaw('1 = 0'),
                    ]),
                    'attachments' => fn ($q) => $q->orderBy('id'),
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

        $firstAvailableSortOrder = $course->modules()
            ->whereDate('available_at', today())
            ->where('available_at', '<=', now())
            ->orderBy('sort_order')
            ->orderBy('id')
            ->value('sort_order');

        if ($member->courses()->where('course_id', $course->id)->exists()) {
            if (!$firstAvailableSortOrder) {
                return redirect()
                    ->route('member.events.learning', [
                        'course' => $course->slug,
                    ])
                    ->with('info', 'Anda sudah terdaftar. Sesi hari ini belum tersedia.');
            }

            return redirect()
                ->route('member.events.learning', [
                    'course' => $course->slug,
                    'sort_order' => $firstAvailableSortOrder,
                ])
                ->with('info', 'Anda sudah terdaftar di event ini.');
        }

        $member->courses()->attach($course->id, ['enrolled_at' => now()]);

        if (!$firstAvailableSortOrder) {
            return redirect()
                ->route('member.events.learning', [
                    'course' => $course->slug,
                ])
                ->with('success', 'Berhasil mendaftar ke event! Sesi hari ini belum tersedia.');
        }

        return redirect()
            ->route('member.events.learning', [
                'course' => $course->slug,
                'sort_order' => $firstAvailableSortOrder,
            ])
            ->with('success', 'Berhasil mendaftar ke event! Selamat belajar.');
    }

    public function learning(Course $course, ?int $sort_order = null)
    {
        abort_if($course->type !== 'event', 404);

        $user = Auth::user();
        $member = $user?->member;

        $course->load([
            'categories',
            'modules' => fn ($query) => $query
                ->whereDate('available_at', today())
                ->with([
                    'assignments' => fn ($q) => $q->with([
                        'submissions' => fn ($s) => $member
                            ? $s->where('member_id', $member->id)->latest()->limit(1)
                            : $s->whereRaw('1 = 0'),
                    ]),
                    'attachments' => fn ($q) => $q->orderBy('id'),
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

        $availableModules = $course->modules->filter(function ($module) {
            return $module->available_at && now()->greaterThanOrEqualTo($module->available_at);
        })->values();

        $firstAvailableModule = $availableModules->first();

        $targetSortOrder = $sort_order ?? $firstAvailableModule?->sort_order;

        $targetModule = $targetSortOrder === null
            ? null
            : $course->modules->firstWhere('sort_order', $targetSortOrder);

        $currentModule = null;
        $emptyState = null;

        if ($course->modules->isEmpty()) {
            $emptyState = 'Belum ada sesi yang dijadwalkan untuk hari ini.';
        } elseif (!$targetModule) {
            $emptyState = 'Sesi yang dipilih tidak tersedia hari ini.';
        } elseif ($targetModule->available_at && now()->lt($targetModule->available_at)) {
            $emptyState = 'Sesi ini belum tersedia. Silakan cek kembali sesuai jadwal.';
        } else {
            $currentModule = $targetModule;
        }

        if (!$currentModule && !$emptyState) {
            $emptyState = 'Sesi belum tersedia.';
        }

        $moduleIndex = $currentModule
            ? $course->modules->search(fn ($module) => $module->id === $currentModule->id)
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
            'emptyState' => $emptyState,
        ]);
    }
}