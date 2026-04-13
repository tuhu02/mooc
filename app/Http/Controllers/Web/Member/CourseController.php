<?php

namespace App\Http\Controllers\Web\Member;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::orderBy('id', 'desc')->cursorPaginate(6);
        
        return Inertia::render('member/course', [
            'courses' => $courses,
        ]);
    }
}
