<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\UserResource;

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
            ]);
        } catch (ValidationException $e) {
            Log::warning('Registration validation failed', [
                'errors' => $e->errors(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
            throw $e;
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'institution' => $request->institution,
        ]);

        $user->sendEmailVerificationNotification();

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful. Please check your email for the OTP code to verify your account.',
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }
}
