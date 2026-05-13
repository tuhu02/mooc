<?php

namespace App\Http\Controllers\Web\Member;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AssignmentSubmissionController extends Controller
{
    public function store(Request $request, Assignment $assignment)
    {
        $request->validate([
            'file' => 'required|file|max:10240',
        ]);

        $member = $request->user()?->member;

        if (!$member) {
            throw ValidationException::withMessages([
                'file' => 'Profil member tidak ditemukan. Hubungi admin.',
            ]);
        }

        $assignment->loadMissing('module.course');
        $module = $assignment->module;

        if (!$module || !$module->course) {
            throw ValidationException::withMessages([
                'file' => 'Data tugas tidak valid.',
            ]);
        }

        $course = $module->course;
        $isEnrolled = $member->courses()->where('course_id', $course->id)->exists();

        if (!$isEnrolled) {
            throw ValidationException::withMessages([
                'file' => 'Anda belum terdaftar di kursus ini.',
            ]);
        }

        $existingSubmission = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->where('member_id', $member->id)
            ->first();

        $filePath = $request->file('file')->store('assignment-submissions', 'public');

        if ($existingSubmission && $existingSubmission->file) {
            Storage::disk('public')->delete($existingSubmission->file);
        }

        AssignmentSubmission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'member_id' => $member->id,
            ],
            [
                'file' => $filePath,
                'status' => 'submitted',
                'reviewed_at' => null,
            ],
        );

        return back()->with('success', 'Tugas berhasil dikirim!');
    }
}
