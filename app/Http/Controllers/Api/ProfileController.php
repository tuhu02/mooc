<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Notifications\PendingEmailVerificationNotification;
use Illuminate\Support\Facades\Notification;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load('member');
        return response()->json([
            'message' => 'Berhasil mengambil data profil',
            'data' => $user,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $data = $request->all();

        $currentPasswordRules = $request->filled('password')
            ? ['required', 'current_password']
            : ['nullable'];

        $validator = Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email,' . $user->id,
                'unique:users,pending_email,' . $user->id,
            ],
            'gender' => ['nullable', 'string', 'max:50'],
            'institution' => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date', 'before_or_equal:today'],
            'address' => ['nullable', 'string', 'max:1000'],

            'current_password' => $currentPasswordRules,
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        $emailChanged = $validated['email'] !== $user->email;

        $user->name = $validated['name'];

        if ($emailChanged) {
            $user->pending_email = $validated['email'];
        } else {
            $user->pending_email = null;
        }

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        if ($emailChanged) {
            Notification::route('mail', $user->pending_email)
                ->notify(new PendingEmailVerificationNotification($user));
        }

        if ($user->member) {
            $user->member->update([
                'institution' => $validated['institution'] ?? $user->member->institution,
                'gender' => $validated['gender'] ?? $user->member->gender,
                'date_of_birth' => $validated['date_of_birth'] ?? $user->member->date_of_birth,
                'address' => $validated['address'] ?? $user->member->address,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => $emailChanged
                ? 'Profil diperbarui. Silakan cek email untuk verifikasi ulang.'
                : 'Profil berhasil diperbarui.',
            'data' => $user->fresh('member'),
        ]);
    }
}
