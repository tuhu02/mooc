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

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::with(['mentor.user', 'categories'])->latest()->get();

        return Inertia::render('admin/courses/index', [
            'courses' => $courses,
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
            'thumbnail' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096',
            'description' => 'required|string',
            'is_active' => 'required|in:active,not_active',
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $thumbnailPath = $request->file('thumbnail')->store('courses', 'public');

        $course = Course::create([
            'title' => $validated['title'],
            'mentor_id' => $validated['mentor_id'],
            'thumbnail' => $thumbnailPath,
            'description' => $validated['description'],
            'is_active' => $validated['is_active'],
        ]);

        $course->categories()->sync($validated['category_ids']);

        return Redirect::route('admin.courses.index')
            ->with('success', 'Course berhasil ditambahkan!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        $course->load(['mentor.user', 'categories']);

        return Inertia::render('admin/courses/edit', [
            'course' => $course,
            'mentors' => Mentor::with('user')->get(),
            'categories' => Category::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'mentor_id' => 'required|exists:mentors,id',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'description' => 'required|string',
            'is_active' => 'required|in:active,not_active',
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($course->thumbnail) {
                Storage::disk('public')->delete($course->thumbnail);
            }

            $course->thumbnail = $request->file('thumbnail')->store('courses', 'public');
        }

        $course->title = $validated['title'];
        $course->mentor_id = $validated['mentor_id'];
        $course->description = $validated['description'];
        $course->is_active = $validated['is_active'];
        $course->save();

        $course->categories()->sync($validated['category_ids']);

        return Redirect::route('admin.courses.index')
            ->with('success', 'Course berhasil diupdate!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        if ($course->thumbnail) {
            Storage::disk('public')->delete($course->thumbnail);
        }

        $course->delete();

        return redirect()->back()->with('success', 'Course berhasil dihapus!');
    }
}
