<?php

namespace App\Http\Controllers\Web\Member;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CourseController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::all();
        $search = trim((string) $request->input('q', ''));

        $courses = Course::query()
            ->with('categories')
            ->withCount(['modules', 'members'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('mentor.user', function ($q2) use ($search) {
                            $q2->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->filled('level'), function ($query) use ($request) {
                $query->where('level', $request->level);
            })
            ->when($request->filled('category_id'), function ($query) use ($request) {
                $query->whereHas('categories', function ($categoryQuery) use ($request) {
                    $categoryQuery->where('categories.id', $request->category_id);
                });
            })
            ->orderBy('id', 'desc')
            ->cursorPaginate(6)
            ->withQueryString();

        return Inertia::render('member/course', [
            'categories' => $categories,
            'query' => $search,
            'courses' => $courses,
        ]);
    }
}
