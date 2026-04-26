<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AssignmentSubmissionController extends Controller
{
    public function store(Request $request, Assignment $assignment)
    {
        $member = $request->user()?->member;

        if (!$member) {
            return response()->json([
                'message' => 'Profil member tidak ditemukan.',
            ], 404);
        }

        $course = $assignment->module->course;

        $isEnrolled = $member->courses()
            ->where('course_id', $course->id)
            ->exists();

        if (!$isEnrolled) {
            return response()->json([
                'message' => 'Anda belum terdaftar di kursus ini.',
            ], 403);
        }

        $validated = $request->validate([
            'file' => 'required|file|max:10240',
        ]);

        $existingSubmission = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->where('member_id', $member->id)
            ->first();

        $filePath = $request->file('file')->store('assignment-submissions', 'public');

        if ($existingSubmission && $existingSubmission->file) {
            Storage::disk('public')->delete($existingSubmission->file);
        }

        $submission = AssignmentSubmission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'member_id' => $member->id,
            ],
            [
                'file' => $filePath,
            ],
        );

        return response()->json([
            'message' => 'Tugas berhasil dikirim!',
            'submission' => $submission,
        ]);
    }

    public function destroy(Assignment $assignment, AssignmentSubmission $submission)
    {
        $user = request()->user();
        $member = $user?->member;

        if (!$member) {
            return response()->json([
                'message' => 'Profil member tidak ditemukan.',
            ], 404);
        }

        if (
            $submission->assignment_id !== $assignment->id ||
            $submission->member_id !== $member->id
        ) {
            return response()->json([
                'message' => 'Submission tidak ditemukan.',
            ], 404);
        }

        if ($submission->file) {
            Storage::disk('public')->delete($submission->file);
        }

        $submission->delete();

        return response()->json([
            'message' => 'Submission berhasil dihapus.',
        ]);
    }
}
