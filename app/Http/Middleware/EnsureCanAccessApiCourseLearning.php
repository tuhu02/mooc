<?php

namespace App\Http\Middleware;

use App\Models\Course;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCanAccessApiCourseLearning
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Course|null $course */
        $course = $request->route('course');

        $sortOrder = $request->route('sort_order');

        if (!$course instanceof Course) {
            return $next($request);
        }

        $currentModule = $course->modules()
            ->where('sort_order', $sortOrder)
            ->first();

        if (!$currentModule) {
            return response()->json([
                'message' => 'Modul dengan urutan tersebut tidak ditemukan.',
            ], 404);
        }

        $user = $request->user();
        $member = $user?->member;

        $isEnrolled = $member
            ? $member->courses()->where('course_id', $course->id)->exists()
            : false;

        if (!$currentModule->is_preview && !$isEnrolled) {
            return response()->json([
                'message' => 'Modul ini terkunci. Silakan login dan daftar terlebih dahulu.',
            ], 403);
        }

        return $next($request);
    }
}