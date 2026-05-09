<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\AssignmentSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignmentSubmissionReviewController extends Controller
{
    public function index(Request $request)
    {
        $submissions = fn() => AssignmentSubmission::query()
            ->with([
                'member.user',
                'assignment.module.course',
            ])
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->string('status'));
            })
            ->latest()
            ->cursorPaginate(10)
            ->withQueryString();

        return Inertia::render('admin/submissions/index', [
            'submissions' => $submissions,
            'filters' => [
                'status' => $request->input('status'),
            ],
        ]);
    }

    public function review(Request $request, AssignmentSubmission $submission)
    {
        $validated = $request->validate([
            'feedback' => ['nullable', 'string'],
            'status' => ['required', 'in:submitted,reviewed,revision_required'],
        ]);

        $submission->update([
            'feedback' => $validated['feedback'] ?? null,
            'status' => $validated['status'],
            'reviewed_at' => $validated['status'] === 'submitted' ? null : now(),
        ]);

        return redirect()
            ->route('admin.submissions.index')
            ->with('success', 'Submission berhasil dikoreksi.');
    }
}
