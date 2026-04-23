<?php

namespace App\Http\Controllers\Web\Member;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AssignmentSubmissionController extends Controller
{
    public function store(Request $request, Assignment $assignment)
    {
        $member = $request->user()->member;
        abort_unless($member, 403);

        $course = $assignment->module->course;
        $isEnrolled = $member->courses()->where('course_id', $course->id)->exists();
        abort_unless($isEnrolled, 403);

        $request->validate([
            'file' => 'required|file|max:10240',
        ]);

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
            ],
        );

        return back()->with('success', 'Tugas berhasil dikirim!');
    }
}
