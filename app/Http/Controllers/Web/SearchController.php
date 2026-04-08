<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'q' => 'nullable|string|max:100',
        ]);

        $query = trim((string) $request->input('q', ''));

        if ($query === '') {
            return Inertia::render('search', [
                'canRegister' => app('router')->has('register'),
                'query' => '',
                'sections' => [
                    'courses' => [],
                ],
                'meta' => [
                    'courses_total' => 0,
                ],
            ]);
        }

        $courses = Course::search($query)
            ->query(fn($builder) => $builder->with(['mentor.user:id,name']))
            ->take(6)
            ->get();

        return Inertia::render('search', [
            'canRegister' => app('router')->has('register'),
            'query' => $query,
            'sections' => [
                'courses' => $courses->map(fn(Course $course) => [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'description' => $course->description,
                    'thumbnail' => $course->thumbnail,
                    'mentor_name' => $course->mentor?->user?->name,
                ])->values(),
            ],
            'meta' => [
                'courses_total' => $courses->count(),
            ],
        ]);
    }
}
