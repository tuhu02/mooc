<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Member;
use App\Models\Mentor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RegisterController extends Controller
{
    public function __invoke(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8|confirmed',
                'institution' => 'required|string|max:50',

                // dari radio button Member / Mentor
                'role' => 'required|string|in:member,mentor',
            ]);
        } catch (ValidationException $e) {
            Log::warning('Registration validation failed', [
                'errors' => $e->errors(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            throw $e;
        }

        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'institution' => $request->institution,
            ]);

            if ($request->role === 'member') {
                Member::create([
                    'user_id' => $user->id,
                    'institution' => $request->institution,
                    'gender' => $request->gender,
                    'date_of_birth' => $request->date_of_birth,
                ]);
            }

            if ($request->role === 'mentor') {
                Mentor::create([
                    'user_id' => $user->id,
                    'institution' => $request->institution,
                ]);
            }

            return $user;
        });

        $user->sendEmailVerificationNotification();

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful. Please check your email for the OTP code to verify your account.',
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }
}
