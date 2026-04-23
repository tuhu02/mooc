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
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_users'      => User::count(),
                'total_members'    => Member::count(),
                'total_mentors'    => Mentor::count(),
                'total_courses'    => Course::count(),
                'total_modules'    => Module::count(),
                'total_categories' => Category::count(),
            ],  

            'recent_courses' => Inertia::defer(
                fn() => Course::with('mentor.user', 'categories')
                    ->withCount(['modules', 'members'])
                    ->latest()
                    ->limit(5)
                    ->get()
            ),

            'recent_modules' => Inertia::defer(
                fn() => Module::with('course')
                    ->latest()
                    ->limit(5)
                    ->get()
            ),

            'enrolled_members' => Inertia::defer(
                fn() => DB::table('member_course')
                    ->join('courses', 'courses.id', '=', 'member_course.course_id')
                    ->selectRaw('courses.title as course_title, COUNT(DISTINCT member_id) as member_count')
                    ->groupBy('member_course.course_id', 'courses.title')
                    ->orderByDesc('member_count')
                    ->limit(5)
                    ->get()
            ),
        ]);
    }
}
