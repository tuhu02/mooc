<?php

namespace App\Http\Controllers\Web\Admin;

use App\Events\EmailChanged;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mentor;
use App\Notifications\PendingEmailChangeVerificationNotification;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class MentorController extends Controller
{
    public function index()
    {
        $mentors = Mentor::with('user')->cursorPaginate(10);

        return Inertia::render('admin/mentors/index', [
            'mentors' =>  $mentors
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/mentors/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'bio' => 'nullable|string|max:1000',
            'password' => 'required|string|min:8|confirmed',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'type' => 'mentor',
            ]);

            $avatarPath = $request->hasFile('avatar')
                ? $request->file('avatar')->store('avatars', 'public')
                : null;

            Mentor::create([
                'user_id' => $user->id,
                'avatar' => $avatarPath,
                'bio' => $validated['bio'] ?? null,
            ]);
        });

        return Redirect::route('admin.mentors.index')
            ->with('success', 'Mentor Successfully Created!');
    }

    public function edit(Mentor $mentor)
    {
        $mentor->load('user');

        return Inertia::render('admin/mentors/edit', [
            'mentor' => $mentor
        ]);
    }

    public function update(Request $request, Mentor $mentor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $mentor->user_id . '|unique:users,pending_email,' . $mentor->user_id,
            'bio' => 'nullable|string|max:1000',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        DB::transaction(function () use ($validated, $request, $mentor) {
            $user = $mentor->user;

            $newEmail = $validated['email'];
            $emailChanged = $newEmail !== $user->email;

            $user->name = $validated['name'];

            if (!empty($validated['password'])) {
                $user->password = $validated['password'];
            }

            if ($emailChanged) {
                $user->pending_email = $newEmail;
            }

            $user->save();

            if ($emailChanged) {
                Notification::route('mail', $newEmail)
                    ->notify(new PendingEmailChangeVerificationNotification($user));

                event(new EmailChanged($user->id, $newEmail, $user->type));
            }

            if ($request->hasFile('avatar')) {
                if ($mentor->avatar) {
                    Storage::disk('public')->delete($mentor->avatar);
                }

                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $mentor->avatar = $avatarPath;
            }

            $mentor->save();
        });

        return Redirect::route('admin.mentors.index')
            ->with('success', 'Mentor Successfully Updated!');
    }

    public function destroy(Mentor $mentor)
    {
        $mentor->user->delete();

        return redirect()->back()->with('success', 'Mentor Successfully Deleted!');;
    }
}
