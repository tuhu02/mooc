<?php

namespace App\Http\Controllers\Web\Member;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:100',
        ]);

        $search = trim((string) $request->input('search', ''));

        $courses = Course::query()
            ->with(['categories:id,name', 'mentor.user:id,name'])
            ->where('is_active', 1)
            ->when($search !== '', function ($query) use ($search) {
                $query->whereIn('id', Course::search($search)->keys());
            })
            ->latest()
            ->cursorPaginate(9)
            ->withQueryString()
            ->through(function (Course $course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'thumbnail' => $course->thumbnail,
                    'description' => $course->description,
                    'mentor_name' => $course->mentor?->user?->name,
                    'categories' => $course->categories->map(fn($category) => [
                        'id' => $category->id,
                        'name' => $category->name,
                    ])->values(),
                ];
            });

        return Inertia::render('member.course', [
            'canRegister' => app('router')->has('register'),
            'filters' => [
                'search' => $search,
            ],
            'courses' => $courses,
        ]);
    }
}
