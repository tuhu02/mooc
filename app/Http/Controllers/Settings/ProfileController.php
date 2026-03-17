<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user()->load('member');

        return Inertia::render('settings/profile', [
            'auth' => [
                'user' => $user
            ],
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $userData = [
            'name' => $request->validated()['name'],
            'email' => $request->validated()['email'],
        ];

        if (!empty($request->validated()['password'])) {
            $user['password'] = $request->validated()['password'];
        }

        $user->fill($userData);

        if ($user->isDirty('email')) {
            $user->email_verify_at = null;
        }

        $member = $user->member;

        if ($member) {
            $member->update([
                'institution' => $request->validated()['institution'],
                'gender' => $request->validated()['gender'],
                'date_of_birth' => $request->validated()['date_of_birth'],
                'address' => $request->validated()['address'],
            ]);
        }

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
