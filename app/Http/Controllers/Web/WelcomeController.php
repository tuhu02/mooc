<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function __invoke()
    {
        $courses = Course::with('categories')
            ->where('is_active', 'active')
            ->latest()
            ->take(3)
            ->get()
            ->map(fn($course) => [
                'id'        => $course->id,
                'title'     => $course->title,
                'slug'      => $course->slug,
                'thumbnail' => $course->thumbnail,
                'categories' => $course->categories->map(fn($category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                ])->values(),
                'description' => $course->description,
            ]);

        return Inertia::render('welcome', [
            'canRegister' => app('router')->has('register'),
            'courses'     => $courses,
        ]);
    }
}
