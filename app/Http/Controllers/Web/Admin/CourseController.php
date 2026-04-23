<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Mentor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::with(['mentor.user', 'categories'])->latest()->get();

        return Inertia::render('admin/courses/index', [
            'courses' => fn() => $courses,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/courses/create', [
            'mentors' => Mentor::with('user')->get(),
            'categories' => Category::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'mentor_id' => 'required|exists:mentors,id',
            'level' => 'required|in:Beginner,Intermediate,Advanced',
            'thumbnail' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096',
            'description' => 'required|string',
            'is_active' => 'required|boolean',
            'is_highlight' => 'required|boolean',
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $thumbnailPath = $request->file('thumbnail')->store('courses', 'public');

        $slug = Course::generateUniqueSlug(Str::slug($validated['title']));

        $course = Course::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'mentor_id' => $validated['mentor_id'],
            'level' => $validated['level'],
            'thumbnail' => $thumbnailPath,
            'description' => $validated['description'],
            'is_active' => $validated['is_active'],
            'is_highlight' => $validated['is_highlight'],
        ]);

        $course->categories()->sync($validated['category_ids']);

        return Redirect::route('admin.courses.index')
            ->with('success', 'Course Successfully Created!');
    }

    public function edit(Course $course)
    {
        $course->load(['mentor.user', 'categories']);

        return Inertia::render('admin/courses/edit', [
            'course' => $course,
            'mentors' => Mentor::with('user')->get(),
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'mentor_id' => 'required|exists:mentors,id',
            'level' => 'required|in:Beginner,Intermediate,Advanced',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'description' => 'required|string',
            'is_active' => 'required|boolean',
            'is_highlight' => 'required|boolean',
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($course->thumbnail) {
                Storage::disk('public')->delete($course->thumbnail);
            }

            $course->thumbnail = $request->file('thumbnail')->store('courses', 'public');
        }

        if ($course->title !== $validated['title']) {
            $course->slug = Course::generateUniqueSlug(
                Str::slug($validated['title']),
                $course->id
            );
        }

        $course->title = $validated['title'];
        $course->mentor_id = $validated['mentor_id'];
        $course->level = $validated['level'];
        $course->description = $validated['description'];
        $course->is_active = $validated['is_active'];
        $course->is_highlight = $validated['is_highlight'];
        $course->save();

        $course->categories()->sync($validated['category_ids']);

        return Redirect::route('admin.courses.index')
            ->with('success', 'Course Successfully updated!');
    }

    public function show(Course $course)
    {
        $course->load([
            'mentor.user',
            'categories',
            'modules' => fn($query) => $query->with('assignments')->orderBy('sort_order')->orderBy('id'),
        ]);

        return Inertia::render('admin/courses/show', [
            'course' => $course,
        ]);
    }

    public function destroy(Course $course)
    {
        if ($course->thumbnail) {
            Storage::disk('public')->delete($course->thumbnail);
        }

        $course->delete();

        return redirect()->back()->with('success', 'Course Successfully Deleted!');
    }
}
