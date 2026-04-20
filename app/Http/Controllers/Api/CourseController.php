<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'q' => 'nullable|string|max:100',
            'level' => 'nullable|string|max:50',
            'category_id' => 'nullable|integer|exists:categories,id',
        ]);

        $search = trim((string) $request->input('q', ''));

        $courses = Course::query()
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
                $query->where('level', $request->string('level'));
            })
            ->when($request->filled('category_id'), function ($query) use ($request) {
                $query->whereHas('categories', function ($categoryQuery) use ($request) {
                    $categoryQuery->where('categories.id', $request->integer('category_id'));
                });
            })
            ->orderBy('id', 'desc')
            ->cursorPaginate(6);

        return response()->json([
            'message' => 'Data Course Berhasil Diambil',

            'courses' => CourseResource::collection($courses->items()),

            'meta' => [
                'next_cursor' => $courses->nextCursor()?->encode(),
                'previous_cursor' => $courses->previousCursor()?->encode(),
                'has_more' => $courses->hasMorePages(),
            ],
        ]);
    }

    public function show(Request $request, Course $course)
    {
        $course->load([
            'categories',
            'mentor.user',
            'modules' => fn($query) => $query->orderBy('sort_order')->orderBy('id'),
        ])->loadCount(['modules', 'members']);

        $member = $request->user()?->member;
        $isEnrolled = $member
            ? $member->courses()->where('course_id', $course->id)->exists()
            : false;

        return response()->json([
            'message' => 'Detail course berhasil diambil.',
            'course' => new CourseResource($course),
            'is_enrolled' => $isEnrolled,
        ]);
    }

    public function enroll(Request $request, Course $course)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Anda harus login terlebih dahulu.',
            ], 401);
        }

        $member = $user?->member;

        if (!$member) {
            return response()->json([
                'message' => 'Profil member tidak ditemukan.',
            ], 404);
        }

        $isEnrolled = $member->courses()->where('course_id', $course->id)->exists();

        if ($isEnrolled) {
            return response()->json([
                'message' => 'Anda sudah terdaftar di kursus ini.',
                'is_enrolled' => true,
            ]);
        }

        $member->courses()->attach($course->id, ['enrolled_at' => now()]);

        return response()->json([
            'message' => 'Berhasil mendaftar ke kursus! Mulai belajar sekarang.',
            'is_enrolled' => true,
        ], 201);
    }

    public function learning(Request $request, Course $course)
    {
        $user = $request->user();
        $member = $user?->member;

        if (!$member) {
            return response()->json([
                'message' => 'Profil member tidak ditemukan.',
            ], 404);
        }

        if (!$member->courses()->where('course_id', $course->id)->exists()) {
            return response()->json([
                'message' => 'Anda belum terdaftar di kursus ini. Silakan daftar terlebih dahulu.',
            ], 403);
        }

        $course->load([
            'categories',
            'mentor.user',
            'modules' => fn($query) => $query->orderBy('sort_order')->orderBy('id'),
        ])->loadCount(['modules', 'members']);

        return response()->json([
            'message' => 'Data pembelajaran course berhasil diambil.',
            'course' => new CourseResource($course),
        ]);
    }
}