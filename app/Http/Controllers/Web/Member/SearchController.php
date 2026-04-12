<?php

namespace App\Http\Controllers\Web\Member;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = trim($request->input('q'));

        $courses = Course::query()
            ->when($query, function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->orWhereHas('mentor', function ($q2) use ($query) {
                        $q2->where('name', 'like', "%{$query}%");
                    });
            })
            ->with(['mentor', 'categories'])
            ->cursorPaginate(9);

        return Inertia::render('member/search', [
            'query' => $query,
            'courses' => $courses,
        ]);
    }
}
