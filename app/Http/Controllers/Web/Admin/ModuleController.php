<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

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

        return Redirect::route('admin.courses.show', $validated['course_id'])
            ->with('success', 'Urutan modul berhasil diperbarui!');
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
            'assignments' => 'nullable|array',
            'assignments.*.title' => 'nullable|string|max:255',
            'assignments.*.description' => 'nullable|string',
            'assignments.*.type' => 'nullable|string|max:100',
        ]);

        $assignments = $validated['assignments'] ?? [];
        unset($validated['assignments']);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('modules', 'public');
        }

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');

            $validated['attachment'] = $file->store('module-attachments', 'public');
            $validated['attachment_name'] = $validated['attachment_name'] ?: $file->getClientOriginalName();
        }

        $maxSortOrder = Module::where('course_id', $validated['course_id'])->max('sort_order') ?? 0;
        $validated['sort_order'] = $maxSortOrder + 1;

        $module = Module::create($validated);

        foreach ($assignments as $assignment) {
            if (
                blank($assignment['title'] ?? null)
                && blank($assignment['description'] ?? null)
                && blank($assignment['type'] ?? null)
            ) {
                continue;
            }

            $module->assignments()->create([
                'title' => $assignment['title'] ?: 'Tugas Modul',
                'description' => $assignment['description'] ?? null,
                'type' => $assignment['type'] ?? null,
            ]);
        }

        return Redirect::route('admin.courses.show', $module->course_id)
            ->with('success', 'Modul berhasil ditambahkan!');
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
            'assignments' => 'nullable|array',
            'assignments.*.title' => 'nullable|string|max:255',
            'assignments.*.description' => 'nullable|string',
            'assignments.*.type' => 'nullable|string|max:100',
        ]);

        $assignments = $validated['assignments'] ?? [];
        unset($validated['assignments']);

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

            $file = $request->file('attachment');

            $validated['attachment'] = $file->store('module-attachments', 'public');
            $validated['attachment_name'] = $validated['attachment_name'] ?: $file->getClientOriginalName();
        }

        $module->update($validated);

        $module->assignments()->delete();

        foreach ($assignments as $assignment) {
            if (
                blank($assignment['title'] ?? null)
                && blank($assignment['description'] ?? null)
                && blank($assignment['type'] ?? null)
            ) {
                continue;
            }

            $module->assignments()->create([
                'title' => $assignment['title'] ?: 'Tugas Modul',
                'description' => $assignment['description'] ?? null,
                'type' => $assignment['type'] ?? null,
            ]);
        }

        return Redirect::route('admin.courses.show', $module->course_id)
            ->with('success', 'Modul berhasil diperbarui!');
    }

    public function destroy(Module $module)
    {
        $courseId = $module->course_id;

        if ($module->thumbnail) {
            Storage::disk('public')->delete($module->thumbnail);
        }

        if ($module->attachment && !str_contains($module->attachment, '://')) {
            Storage::disk('public')->delete($module->attachment);
        }

        $module->delete();

        return Redirect::route('admin.courses.show', $courseId)
            ->with('success', 'Modul berhasil dihapus!');
    }
}
