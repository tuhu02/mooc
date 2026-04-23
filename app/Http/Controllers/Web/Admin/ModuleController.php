<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ModuleController extends Controller
{
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'module_ids' => 'required|array|min:1',
            'module_ids.*' => 'required|integer|exists:modules,id',
        ]);

        $moduleIds = collect($validated['module_ids'])->values();

        $courseModuleIds = Module::where('course_id', $validated['course_id'])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->pluck('id')
            ->values();

        if (
            $moduleIds->count() !== $courseModuleIds->count()
            || $moduleIds->diff($courseModuleIds)->isNotEmpty()
        ) {
            throw ValidationException::withMessages([
                'module_ids' => 'Data urutan modul tidak valid.',
            ]);
        }

        DB::transaction(function () use ($moduleIds) {
            foreach ($moduleIds as $index => $moduleId) {
                Module::whereKey($moduleId)->update([
                    'sort_order' => $index + 1,
                ]);
            }
        });

        if ($request->input('from') === 'course-show') {
            return Redirect::route('admin.courses.show', $validated['course_id'])
                ->with('success', 'Urutan modul berhasil diperbarui!');
        }

        return Redirect::back()->with('success', 'Urutan modul berhasil diperbarui!');
    }

    public function index(Request $request)
    {
        $courseId = $request->integer('course_id');

        $modules = fn() => Module::with('course')
            ->when($request->filled('course_id'), function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->orderBy('course_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->cursorPaginate(10)
            ->withQueryString();

        return Inertia::render('admin/modules/index', [
            'modules' =>  $modules,
            'courses' => fn() => Course::orderBy('title')->get(['id', 'title']),
            'filters' => [
                'course_id' => $request->input('course_id', ''),
            ],
        ]);
    }

    public function create(Request $request)
    {
        $courseId = $request->integer('course_id');

        return Inertia::render('admin/modules/create', [
            'courses' => Course::orderBy('title')->get(['id', 'title']),
            'selectedCourseId' => $courseId ?: null,
            'from' => $request->query('from'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'video' => 'nullable|url|max:2048',
            'description' => 'nullable|string',
            'duration' => 'nullable|integer|min:0',
            'attachment' => 'nullable|file|max:10240',
            'is_preview' => 'boolean',
            'assignment_title' => 'nullable|string|max:255',
            'assignment_instruction' => 'nullable|string',
            'assignment_type' => 'nullable|string|max:100',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('modules', 'public');
        }

        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('module-attachments', 'public');
        }

        $maxSortOrder = Module::where('course_id', $validated['course_id'])->max('sort_order') ?? 0;
        $validated['sort_order'] = $maxSortOrder + 1;

        $assignmentPayload = [
            'title' => $validated['assignment_title'] ?? null,
            'description' => $validated['assignment_instruction'] ?? null,
            'type' => $validated['assignment_type'] ?? null,
        ];

        unset($validated['assignment_title'], $validated['assignment_instruction'], $validated['assignment_type']);

        $module = Module::create($validated);

        if (
            !blank($assignmentPayload['title'])
            || !blank($assignmentPayload['description'])
            || !blank($assignmentPayload['type'])
        ) {
            Assignment::create([
                'module_id' => $module->id,
                'title' => $assignmentPayload['title'] ?: 'Tugas Modul',
                'description' => $assignmentPayload['description'],
                'type' => $assignmentPayload['type'],
            ]);
        }

        if ($request->input('from') === 'course-show') {
            return Redirect::route('admin.courses.show', $module->course_id)
                ->with('success', 'Module Successfully Created!');
        }

        return Redirect::route('admin.modules.index', [
            'course_id' => $module->course_id,
        ])->with('success', 'Module Successfully Created!');
    }

    public function edit(Request $request, Module $module)
    {
        $module->load('course');

        return Inertia::render('admin/modules/edit', [
            'module' => $module,
            'courses' => Course::orderBy('title')->get(['id', 'title']),
            'filters' => [
                'course_id' => $request->query('course_id', ''),
            ],
            'from' => $request->query('from'),
        ]);
    }

    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'video' => 'nullable|url|max:2048',
            'description' => 'nullable|string',
            'duration' => 'nullable|integer|min:0',
            'attachment' => 'nullable|file|max:10240',
            'is_preview' => 'boolean', 
            'assignment_title' => 'nullable|string|max:255',
            'assignment_instruction' => 'nullable|string',
            'assignment_type' => 'nullable|string|max:100',
        ]);

        $assignmentPayload = [
            'title' => $validated['assignment_title'] ?? null,
            'description' => $validated['assignment_instruction'] ?? null,
            'type' => $validated['assignment_type'] ?? null,
        ];

        unset($validated['assignment_title'], $validated['assignment_instruction'], $validated['assignment_type']);

        if ($request->hasFile('thumbnail')) {
            if ($module->thumbnail) {
                Storage::disk('public')->delete($module->thumbnail);
            }

            $validated['thumbnail'] = $request->file('thumbnail')->store('modules', 'public');
        }

        if ($request->hasFile('attachment')) {
            if ($module->attachment && !str_contains($module->attachment, '://')) {
                Storage::disk('public')->delete($module->attachment);
            }

            $validated['attachment'] = $request->file('attachment')->store('module-attachments', 'public');
        } else {
            unset($validated['attachment']);
        }

        $module->update($validated);

        $existingAssignment = $module->assignments()->orderBy('id')->first();

        if (
            blank($assignmentPayload['title'])
            && blank($assignmentPayload['description'])
            && blank($assignmentPayload['type'])
        ) {
            if ($existingAssignment) {
                $existingAssignment->delete();
            }
        } elseif ($existingAssignment) {
            $existingAssignment->update([
                'title' => $assignmentPayload['title'] ?: $existingAssignment->title,
                'description' => $assignmentPayload['description'],
                'type' => $assignmentPayload['type'],
            ]);
        } else {
            $module->assignments()->create([
                'title' => $assignmentPayload['title'] ?: 'Tugas Modul',
                'description' => $assignmentPayload['description'],
                'type' => $assignmentPayload['type'],
            ]);
        }

        if ($request->input('from') === 'course-show') {
            return Redirect::route('admin.courses.show', $module->course_id)
                ->with('success', 'Module Successfully Updated!');
        }

        $filterCourseId = $request->query('course_id', $module->course_id);

        return Redirect::route('admin.modules.index', [
            'course_id' => $filterCourseId !== null && $filterCourseId !== '' ? $filterCourseId : null,
        ])->with('success', 'Module Successfully Updated!');
    }

    public function destroy(Request $request, Module $module)
    {
        $courseId = $module->course_id;

        if ($module->thumbnail) {
            Storage::disk('public')->delete($module->thumbnail);
        }

        if ($module->attachment && !str_contains($module->attachment, '://')) {
            Storage::disk('public')->delete($module->attachment);
        }

        $module->delete();

        if ($request->input('from') === 'course-show') {
            return Redirect::route('admin.courses.show', $courseId)
                ->with('success', 'Module Successfully Deleted!');
        }

        return redirect()->back()->with('success', 'Module Successfully Deleted!');
    }
}
