<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Mentor;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'q' => 'nullable|string|max:100',
        ]);

        $query = trim((string) $request->input('q', ''));

        if (!$query) {
            return response()->json([
                'message' => 'Silakan masukkan kata kunci.',
                'data' => [
                    'query' => $query,
                    'sections' => [
                        'courses' => [],
                        'mentors' => [],
                        'categories' => [],
                    ],
                ],
                'meta' => [
                    'courses_total' => 0,
                    'mentors_total' => 0,
                    'categories_total' => 0,
                ],
            ]);
        }

        $courses = Course::search($query)
            ->query(fn($builder) => $builder->with(['mentor.user:id,name']))
            ->take(6)
            ->get();

        $mentors = Mentor::search($query)
            ->query(fn($builder) => $builder->with(['user:id,name']))
            ->take(6)
            ->get();

        $categories = Category::search($query)
            ->take(6)
            ->get();

        $courseData = $courses->map(function (Course $course) {
            return [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'thumbnail' => $course->thumbnail,
                'mentor_name' => $course->mentor?->user?->name,
            ];
        })->values();

        $mentorData = $mentors->map(function (Mentor $mentor) {
            return [
                'id' => $mentor->id,
                'name' => $mentor->user?->name,
                'bio' => $mentor->bio,
                'avatar' => $mentor->avatar,
            ];
        })->values();

        $categoryData = $categories->map(function (Category $category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
            ];
        })->values();

        return response()->json([
            'message' => 'Hasil pencarian berhasil diambil.',
            'data' => [
                'query' => $query,
                'sections' => [
                    'courses' => $courseData,
                    'mentors' => $mentorData,
                    'categories' => $categoryData,
                ],
            ],
            'meta' => [
                'courses_total' => $courseData->count(),
                'mentors_total' => $mentorData->count(),
                'categories_total' => $categoryData->count(),
            ],
        ]);
    }
}
