<?php

namespace App\Http\Middleware;

use App\Models\Course;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCanAccessEventLearning
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

        if (!$isEnrolled) {
            return redirect()
                ->route('member.events.show', $course->slug)
                ->with('error', 'Silakan daftar event terlebih dahulu.');
        }

        $currentModule = $sortOrder !== null
            ? $course->modules()->where('sort_order', $sortOrder)->first()
            : $course->modules()->orderBy('sort_order')->orderBy('id')->first();

        if (!$currentModule) {
            abort(404, 'Sesi tidak ditemukan.');
        }

        if ($currentModule->available_at && now()->lt($currentModule->available_at)) {
            return redirect()
                ->route('member.events.show', $course->slug)
                ->with('error', 'Sesi ini belum tersedia. Silakan tunggu jadwal tayang.');
        }

        return $next($request);
    }
}