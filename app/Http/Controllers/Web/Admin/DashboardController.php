<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Member;
use App\Models\Mentor;
use App\Models\Course;
use App\Models\Module;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalMembers = Member::count();
        $totalMentors = Mentor::count();
        $totalCourses = Course::count();
        $totalModules = Module::count();
        $totalCategories = Category::count();

        $recentCourses = Course::with('mentor.user', 'categories')
            ->withCount(['modules', 'members'])
            ->latest()
            ->limit(5)
            ->get();

        $recentModules = Module::with('course')
            ->latest()
            ->limit(5)
            ->get();

        $enrolledMembers = DB::table('member_course')
            ->selectRaw('course_id, COUNT(DISTINCT member_id) as member_count')
            ->groupBy('course_id')
            ->orderByDesc('member_count')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                $course = Course::find($item->course_id);
                return [
                    'course_title' => $course?->title ?? 'Unknown',
                    'member_count' => $item->member_count,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => fn() => [
                'total_users' => $totalUsers,
                'total_members' => $totalMembers,
                'total_mentors' => $totalMentors,
                'total_courses' => $totalCourses,
                'total_modules' => $totalModules,
                'total_categories' => $totalCategories,
            ],
            'recent_courses' => fn() => $recentCourses,
            'recent_modules' => fn() => $recentModules,
            'enrolled_members' => fn() => $enrolledMembers,
        ]);
    }
}
