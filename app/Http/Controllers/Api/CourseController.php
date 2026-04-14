<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Course;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::query()
            ->with('categories')
            ->withCount(['modules', 'members'])
            ->orderBy('id', 'desc')
            ->cursorPaginate(6);

        return response()->json([
            'message' => 'Data Course Berhasil Diambil',

            'courses' => CourseResource::collection($courses->items()),

            'meta' => [
                'next_cursor' => $courses->nextCursor()?->encode(),
                'previous_cursor' => $courses->previousCursor()?->encode(),
                'has_more' => $courses->hasMorePages(),
            ],
        ]);
    }
}
