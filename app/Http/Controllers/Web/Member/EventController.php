<?php

namespace App\Http\Controllers\Web\Member;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Course::query()
            ->with('categories')
            ->where('type', 'live')
            ->latest()
            ->cursorPaginate(9);

        $categories = Category::query()
            ->orderBy('name')
            ->get();

        return Inertia::render('member/event/index', [
            'events' => $events,
            'categories' => $categories,
        ]);
    }
}
