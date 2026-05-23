<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Http\Resources\CurrentLearningModuleResource;
use App\Http\Resources\EventResource;
use App\Http\Resources\LearningCourseResource;
use App\Http\Resources\ModuleNavigationResource;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $events = Course::query()
            ->where('type', 'event')
            ->with('categories')
            ->withCount(['members'])
            ->orderBy('id', 'desc')
            ->cursorPaginate(6);

        return response()->json([
            'data' => EventResource::collection($events),
        ]);
    }

    public function show(Course $course): JsonResponse
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

        $course->modules->each(function ($module) {
            $module->assignments->each(function ($assignment) {
                $assignment->submission = $assignment->submissions->first();
                unset($assignment->submissions);
            });
        });

        return response()->json([
            'data' => (new EventResource($course))->resolve(),
            'isEnrolled' => $isEnrolled,
        ]);
    }

    public function enroll(Course $course): JsonResponse
    {
        abort_if($course->type !== 'event', 404);

        $user = Auth::user();
        $member = $user->member;

        if (!$member) {
            return response()->json([
                'message' => 'Profil member tidak ditemukan. Hubungi admin.',
            ], 404);
        }

        $firstAvailableSortOrder = $course->modules()
            ->whereDate('available_at', today())
            ->where('available_at', '<=', now())
            ->orderBy('sort_order')
            ->orderBy('id')
            ->value('sort_order');

        if ($member->courses()->where('course_id', $course->id)->exists()) {
            return response()->json([
                'message' => $firstAvailableSortOrder
                    ? 'Anda sudah terdaftar di event ini.'
                    : 'Anda sudah terdaftar. Sesi hari ini belum tersedia.',
                'firstAvailableSortOrder' => $firstAvailableSortOrder,
            ]);
        }

        $member->courses()->attach($course->id, ['enrolled_at' => now()]);

        return response()->json([
            'message' => $firstAvailableSortOrder
                ? 'Berhasil mendaftar ke event! Selamat belajar.'
                : 'Berhasil mendaftar ke event! Sesi hari ini belum tersedia.',
            'firstAvailableSortOrder' => $firstAvailableSortOrder,
        ], 201);
    }

    public function learning(Course $course, ?int $sort_order = null): JsonResponse
    {
        abort_if($course->type !== 'event', 404);

        $user = Auth::user();
        $member = $user?->member;

        $course->load([
            'categories',
            'modules' => fn($query) => $query
                ->whereDate('available_at', today())
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
            ? $course->modules->search(fn($module) => $module->id === $currentModule->id)
            : false;

        $previousModule = $moduleIndex !== false && $moduleIndex > 0
            ? $course->modules[$moduleIndex - 1]
            : null;

        $nextModule = $moduleIndex !== false && $moduleIndex < ($course->modules->count() - 1)
            ? $course->modules[$moduleIndex + 1]
            : null;

        return response()->json([
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
