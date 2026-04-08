<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
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
                    ],
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

        $courseData = $courses->map(function (Course $course) {
            return [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'description' => $course->description,
                'thumbnail' => $course->thumbnail,
                'mentor_name' => $course->mentor?->user?->name,
            ];
        })->values();

        return response()->json([
            'message' => 'Hasil pencarian berhasil diambil.',
            'data' => [
                'query' => $query,
                'courses' => $courseData,
            ],
            'meta' => [
                'courses_total' => $courseData->count(),
            ],
        ]);
    }
}
