<?php

namespace App\Http\Controllers\Web\Member;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class CourseController extends Controller
{
    public function index(Request $request)
    {
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
            'categories' => Category::all(),
            'query' => fn() => $search,
            'courses' => fn() => $courses,
        ]);
    }

    public function show(Course $course)
    {
        $user = Auth::user();
        $member = $user->member;
        $isEnrolled = $member ? $member->courses()->where('course_id', $course->id)->exists() : false;

        $course->load([
            'categories',
            'mentor.user',
            'modules' => fn($query) => $query->orderBy('sort_order')->orderBy('id'),
        ])->loadCount(['modules', 'members']);

        return Inertia::render('member/course-detail', [
            'course' => fn() => $course,
            'isEnrolled' => $isEnrolled,
        ]);
    }

    public function enroll(Course $course)
    {
        $user = Auth::user();
        $member = $user->member;

        if (!$member) {
            return back()->with('error', 'Member profile not found.');
        }

        if ($member->courses()->where('course_id', $course->id)->exists()) {
            return redirect()->route('member.courses.learning', $course->slug)
                ->with('info', 'Anda sudah terdaftar di kursus ini.');
        }

        $member->courses()->attach($course->id, ['enrolled_at' => now()]);

        return redirect()->route('member.courses.learning', $course->slug)
            ->with('success', 'Berhasil mendaftar ke kursus! Mulai belajar sekarang.');
    }

    public function learning(Course $course)
    {
        $user = Auth::user();
        $member = $user->member;

        if (!$member->courses()->where('course_id', $course->id)->exists()) {
            return redirect()->route('member.courses.show', $course->slug)
                ->with('error', 'Anda belum terdaftar di kursus ini. Silakan daftar terlebih dahulu.');
        }

        $course->load([
            'categories',
            'mentor.user',
            'modules' => fn($query) => $query->orderBy('sort_order')->orderBy('id'),
        ])->loadCount(['modules', 'members']);

        return Inertia::render('member/course-learning', [
            'course' => fn() => $course,
        ]);
    }
}
