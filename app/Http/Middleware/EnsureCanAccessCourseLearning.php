<?php

namespace App\Http\Middleware;

use App\Models\Course;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCanAccessCourseLearning
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Course|null $course */
        $course = $request->route('course');

        $sortOrder = $request->route('sort_order');

        if (!$course instanceof Course) {
            return $next($request);
        }

        $user = $request->user();
        $member = $user?->member;

        $isEnrolled = $member
            ? $member->courses()->where('course_id', $course->id)->exists()
            : false;

        $currentModule = null;

        if ($sortOrder !== null) {
            $currentModule = $course->modules()
                ->where('sort_order', $sortOrder)
                ->first();
        } else {
            $currentModule = $course->modules()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->first();
        }

        if (!$currentModule) {
            abort(404, 'Modul dengan urutan tersebut tidak ditemukan.');
        }

        if (!$currentModule->is_preview && !$isEnrolled) {
            return redirect()
                ->route('member.courses.show', $course->slug)
                ->with('error', 'Modul ini terkunci. Silakan login atau daftar kursus terlebih dahulu.');
        }

        return $next($request);
    }
}