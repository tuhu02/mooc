<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\ModuleProgress;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $member = Member::where('user_id', $user->id)->first();

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Member not found',
            ], 404);
        }

        $enrolledCourses = $member->courses()
            ->with(['mentor.user', 'categories'])
            ->withCount('modules')
            ->get()
            ->map(function ($course) use ($member) {
                $totalModules = $course->modules_count;
                $completedModules = ModuleProgress::where('member_id', $member->id)
                    ->where('course_id', $course->id)
                    ->whereNotNull('completed_at')
                    ->count();

                $progress = $totalModules > 0 ? round(($completedModules / $totalModules) * 100) : 0;

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'thumbnail' => $course->thumbnail ? asset('storage/' . $course->thumbnail) : null,
                    'mentor' => $course->mentor?->user?->name ?? 'N/A',
                    'progress' => $progress,
                    'lessons' => $completedModules . ' of ' . $totalModules,
                    'category' => $course->categories->first()?->name ?? 'General',
                ];
            });

        // Get recent activities
        $activities = ModuleProgress::where('member_id', $member->id)
            ->whereNotNull('completed_at')
            ->with('module', 'course')
            ->latest('completed_at')
            ->take(5)
            ->get()
            ->map(function ($progress) {
                return [
                    'type' => 'completed',
                    'text' => 'Completed "' . ($progress->module?->title ?? 'Module') . '"',
                    'subtext' => $progress->course?->title ?? 'Course',
                    'time' => $progress->completed_at->diffForHumans(),
                    'icon' => 'CheckCircle2',
                ];
            });

        $totalEnrolled = $member->courses()->count();
        $totalCompleted = ModuleProgress::where('member_id', $member->id)
            ->whereNotNull('completed_at')
            ->distinct('course_id')
            ->count();
        $totalLessons = ModuleProgress::where('member_id', $member->id)
            ->count();
        $completedLessons = ModuleProgress::where('member_id', $member->id)
            ->whereNotNull('completed_at')
            ->count();

        $stats = [
            [
                'label' => 'Enrolled Courses',
                'value' => $totalEnrolled,
                'icon' => 'BookOpen',
                'color' => 'bg-blue-100',
            ],
            [
                'label' => 'Completed',
                'value' => $totalCompleted,
                'icon' => 'CheckCircle2',
                'color' => 'bg-green-100',
            ],
            [
                'label' => 'Learning Time',
                'value' => '-- h',
                'icon' => 'TimerIcon',
                'color' => 'bg-purple-100',
            ],
            [
                'label' => 'Progress',
                'value' => $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) . '%' : '0%',
                'icon' => 'TrendingUp',
                'color' => 'bg-yellow-100',
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'learningCourses' => $enrolledCourses,
                'activities' => $activities,
                'stats' => $stats,
            ],
        ]);
    }
}
