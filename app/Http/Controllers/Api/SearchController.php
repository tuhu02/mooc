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

        $courses = Course::query()
            ->when($query !== '', function ($builder) use ($query) {
                $builder->where(function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                        ->orWhere('description', 'like', "%{$query}%")
                        ->orWhereHas('mentor.user', function ($q2) use ($query) {
                            $q2->where('name', 'like', "%{$query}%");
                        });
                });
            })
            ->with(['mentor.user:id,name'])
            ->cursorPaginate(9);

        $courseData = collect($courses->items())->map(function ($course) {
            return [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'description' => $course->description,
                'thumbnail' => $course->thumbnail,
                'mentor_name' => $course->mentor?->user?->name,
            ];
        });

        return response()->json([
            'message' => 'Hasil pencarian berhasil diambil.',
            'data' => [
                'query' => $query,
                'courses' => $courseData,
            ],
            'meta' => [
                'next_cursor' => $courses->nextCursor()?->encode(),
                'previous_cursor' => $courses->previousCursor()?->encode(),
                'has_more' => $courses->hasMorePages(),
            ],
        ]);
    }
}
