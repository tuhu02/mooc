<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use App\Models\ModuleAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ModuleController extends Controller
{
    public function create(Course $course)
    {
        return Inertia::render('admin/modules/create', [
            'course' => $course->only(['id', 'title', 'type']),
        ]);
    }

    public function edit(Module $module)
    {
        $module->load([
            'assignments',
            'attachments',
            'course:id,title,type',
        ]);

        return Inertia::render('admin/modules/edit', [
            'module' => $module,
            'course' => $module->course,
        ]);
    }

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
            'available_at' => 'nullable|date',
            'duration' => 'nullable|integer|min:0',
            'attachment' => 'nullable|file|max:10240',
            'attachment_name' => 'nullable|string|max:255',
            'attachments' => 'nullable|array',
            'attachments.*' => 'nullable|file|max:10240',
            'is_preview' => 'boolean',
            'assignments' => 'nullable|array',
            'assignments.*.title' => 'nullable|string|max:255',
            'assignments.*.description' => 'nullable|string',
            'assignments.*.type' => 'nullable|string|max:100',
        ]);

        $assignments = $validated['assignments'] ?? [];
        $attachments = $validated['attachments'] ?? [];
        unset($validated['assignments'], $validated['attachments']);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('modules', 'public');
        }

        // Keep old attachment logic for backward compatibility
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');

            $validated['attachment'] = $file->store('module-attachments', 'public');
            $validated['attachment_name'] = $validated['attachment_name'] ?: $file->getClientOriginalName();
        }

        $maxSortOrder = Module::where('course_id', $validated['course_id'])->max('sort_order') ?? 0;
        $validated['sort_order'] = $maxSortOrder + 1;

        $module = Module::create($validated);

        // Handle multiple attachments
        if (!empty($attachments)) {
            foreach ($attachments as $file) {
                if ($file instanceof \Illuminate\Http\UploadedFile) {
                    $filePath = $file->store('module-attachments', 'public');
                    
                    $module->attachments()->create([
                        'file_path' => $filePath,
                        'file_name' => $file->getClientOriginalName(),
                        'file_type' => $file->getClientMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }
        }

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
            'attachment_name' => 'nullable|string|max:255',
            'attachments' => 'nullable|array',
            'attachments.*' => 'nullable|file|max:10240',
            'deleted_attachment_ids' => 'nullable|array',
            'deleted_attachment_ids.*' => 'nullable|integer|exists:module_attachments,id',
            'updated_attachments' => 'nullable|array',
            'available_at' => 'nullable|date',
            'is_preview' => 'boolean',
            'assignments' => 'nullable|array',
            'assignments.*.title' => 'nullable|string|max:255',
            'assignments.*.description' => 'nullable|string',
            'assignments.*.type' => 'nullable|string|max:100',
        ]);

        $assignments = $validated['assignments'] ?? [];
        $attachments = $validated['attachments'] ?? [];
        $deletedAttachmentIds = $validated['deleted_attachment_ids'] ?? [];
        $updatedAttachments = $validated['updated_attachments'] ?? [];
        unset($validated['assignments'], $validated['attachments'], $validated['deleted_attachment_ids'], $validated['updated_attachments']);

        if ($request->hasFile('thumbnail')) {
            if ($module->thumbnail) {
                Storage::disk('public')->delete($module->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('modules', 'public');
        } else {
            unset($validated['thumbnail']);
        }

        if ($request->hasFile('attachment')) {
            if ($module->attachment && !str_contains($module->attachment, '://')) {
                Storage::disk('public')->delete($module->attachment);
            }

            $file = $request->file('attachment');

            $validated['attachment'] = $file->store('module-attachments', 'public');
            $validated['attachment_name'] = $validated['attachment_name'] ?: $file->getClientOriginalName();
        } else {
            unset($validated['attachment']);
            unset($validated['attachment_name']);
        }

        $module->update($validated);

        // Handle deleted attachments
        if (!empty($deletedAttachmentIds)) {
            foreach ($deletedAttachmentIds as $attachmentId) {
                $attachment = ModuleAttachment::where('id', $attachmentId)
                    ->where('module_id', $module->id)
                    ->first();

                if ($attachment) {
                    if ($attachment->file_path && !str_contains($attachment->file_path, '://')) {
                        Storage::disk('public')->delete($attachment->file_path);
                    }
                    $attachment->delete();
                }
            }
        }

        // Handle updated attachments (name and/or file)
        if (!empty($updatedAttachments)) {
            foreach ($updatedAttachments as $attachmentId => $updateData) {
                $attachment = ModuleAttachment::where('id', $attachmentId)
                    ->where('module_id', $module->id)
                    ->first();

                if (!$attachment) {
                    continue;
                }

                // Update name if provided
                if (isset($updateData['name']) && !empty($updateData['name'])) {
                    $attachment->file_name = $updateData['name'];
                }

                // Update file if provided
                if (isset($updateData['file']) && $updateData['file'] instanceof \Illuminate\Http\UploadedFile) {
                    // Delete old file
                    if ($attachment->file_path && !str_contains($attachment->file_path, '://')) {
                        Storage::disk('public')->delete($attachment->file_path);
                    }

                    // Store new file
                    $file = $updateData['file'];
                    $filePath = $file->store('module-attachments', 'public');
                    
                    $attachment->file_path = $filePath;
                    $attachment->file_type = $file->getClientMimeType();
                    $attachment->file_size = $file->getSize();
                }

                $attachment->save();
            }
        }

        // Handle multiple attachments - add new ones
        if (!empty($attachments)) {
            foreach ($attachments as $file) {
                if ($file instanceof \Illuminate\Http\UploadedFile) {
                    $filePath = $file->store('module-attachments', 'public');
                    
                    $module->attachments()->create([
                        'file_path' => $filePath,
                        'file_name' => $file->getClientOriginalName(),
                        'file_type' => $file->getClientMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }
        }

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

        return Redirect::route('admin.modules.edit', $module)
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

        // Delete all module attachments
        foreach ($module->attachments as $attachment) {
            if (!str_contains($attachment->file_path, '://')) {
                Storage::disk('public')->delete($attachment->file_path);
            }
        }

        $module->delete();

        return Redirect::route('admin.courses.show', $courseId)
            ->with('success', 'Modul berhasil dihapus!');
    }

    public function deleteAttachment(Module $module, ModuleAttachment $attachment)
    {
        if ($attachment->module_id !== $module->id) {
            abort(404);
        }

        if ($attachment->file_path && !str_contains($attachment->file_path, '://')) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $attachment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Attachment berhasil dihapus!',
        ]);
    }

    public function updateAttachment(Request $request, Module $module, ModuleAttachment $attachment)
    {
        if ($attachment->module_id !== $module->id) {
            abort(404);
        }

        $validated = $request->validate([
            'file_name' => 'nullable|string|max:255',
            'file' => 'nullable|file|max:10240',
        ]);

        // Update name if provided
        if (isset($validated['file_name']) && !empty($validated['file_name'])) {
            $attachment->file_name = $validated['file_name'];
        }

        // Update file if provided
        if ($request->hasFile('file')) {
            // Delete old file
            if ($attachment->file_path && !str_contains($attachment->file_path, '://')) {
                Storage::disk('public')->delete($attachment->file_path);
            }

            // Store new file
            $file = $request->file('file');
            $filePath = $file->store('module-attachments', 'public');
            
            $attachment->file_path = $filePath;
            $attachment->file_type = $file->getClientMimeType();
            $attachment->file_size = $file->getSize();
        }

        $attachment->save();

        return response()->json([
            'success' => true,
            'message' => 'Attachment berhasil diperbarui!',
            'attachment' => $attachment,
        ]);
    }
}
