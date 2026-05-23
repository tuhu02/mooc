<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

        $now = now(config('app.timezone'));

        $course->load([
            'categories',
            'modules' => fn($query) => $query
                ->whereNotNull('available_at')
                ->whereDate('available_at', $now->toDateString())
                ->where('available_at', '<=', $now)
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
        ])->loadCount(['members']);

        $course->modules_count = $course->modules->count();

        foreach ($course->modules as $module) {
            foreach ($module->assignments as $assignment) {
                $assignment->submission = $assignment->submissions->first();
                unset($assignment->submissions);
            }
        }

        $isEnrolled = $member
            ? $member->courses()->where('course_id', $course->id)->exists()
            : false;

        $targetModule = $sort_order === null
            ? $course->modules->first()
            : $course->modules->firstWhere('sort_order', $sort_order);

        $currentModule = null;
        $emptyState = null;

        if ($course->modules->isEmpty()) {
            $emptyState = 'Sesi belum tersedia. Silakan cek kembali sesuai jadwal.';
        } elseif (!$targetModule) {
            $emptyState = 'Sesi yang dipilih belum tersedia.';
        } else {
            $currentModule = $targetModule;
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
