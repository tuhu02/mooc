<?php

namespace App\Http\Middleware;

use App\Models\Course;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EventEnrolledMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Course|null $course */
        $course = $request->route('course');

        if (!$course instanceof Course) {
            return $next($request);
        }

        // Check if this is an event course
        if ($course->type !== 'event') {
            return response()->json([
                'message' => 'Resource tidak ditemukan.',
            ], 404);
        }

        $user = $request->user();
        $member = $user?->member;

        // Check if user is enrolled in this event
        $isEnrolled = $member
            ? $member->courses()->where('course_id', $course->id)->exists()
            : false;

        if (!$isEnrolled) {
            return response()->json([
                'message' => 'Anda belum terdaftar di event ini. Silakan enroll terlebih dahulu.',
                'status' => 'unenrolled',
            ], 403);
        }

        return $next($request);
    }
}
