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

        $courses = fn() => Course::query()
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
            'categories' => fn() => Category::all(),
            'query' => fn() => $search,
            'courses' => $courses,
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
            'modules' => fn($query) => $query
                ->where('is_preview', true)
                ->with([
                    'assignments' => fn($assignmentQuery) => $assignmentQuery->with([
                        'submissions' => fn($submissionQuery) => $submissionQuery
                            ->where('member_id', $member->id)
                            ->latest()
                            ->limit(1),
                    ]),
                ])
                ->orderBy('sort_order')
                ->orderBy('id'),
        ])->loadCount(['modules', 'members']);

        $course->modules->each(function ($module) {
            $module->assignments->each(function ($assignment) {
                $assignment->submission = $assignment->submissions->first();
                unset($assignment->submissions);
            });
        });

        return Inertia::render('member/course-detail', [
            'course' => $course,
            'isEnrolled' => $isEnrolled,
        ]);
    }


    public function enroll(Course $course)
    {
        $user = Auth::user();
        $member = $user->member;

        $firstModuleSortOrder = $course->modules()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->value('sort_order');

        $targetSortOrder = $firstPreviewSortOrder ?? $firstModuleSortOrder;

        if ($member->courses()->where('course_id', $course->id)->exists()) {
            return redirect()->route('member.courses.learning', [
                'course' => $course->slug,
                'sort_order' => $targetSortOrder,
            ])->with('info', 'Anda sudah terdaftar di kursus ini.');
        }

        $member->courses()->attach($course->id, ['enrolled_at' => now()]);

        return redirect()->route('member.courses.learning', [
            'course' => $course->slug,
            'sort_order' => $targetSortOrder,
        ])->with('success', 'Berhasil mendaftar ke kursus! Mulai belajar sekarang.');
    }

    public function learning(Course $course, ?int $sort_order = null)
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
            'modules' => fn($query) => $query
                ->with([
                    'assignments' => fn($q) => $q->with([
                        'submissions' => fn($s) => $s
                            ->where('member_id', $member->id)
                            ->latest()
                            ->limit(1),
                    ]),
                ])
                ->orderBy('sort_order')
                ->orderBy('id'),
        ])->loadCount(['modules', 'members']);

        $course->modules->each(function ($module) {
            $module->assignments->each(function ($assignment) {
                $assignment->submission = $assignment->submissions->first();
                unset($assignment->submissions);
            });
        });

        return Inertia::render('member/course-learning', [
            'course' => fn() => $course,
            'initialModuleSortOrder' => $sort_order,
        ]);
    }
}
