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

            Member::create([
                'user_id' => $user->id,
                'institution' => $request->institution,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
            ]);

            return $user;
        });

        $user->sendEmailVerificationNotification();

        $token = $user->createToken('auth-token')->plainTextToken;

        $user->load('member');

        return response()->json([
            'message' => 'Registrasi berhasil. Silakan cek email Anda untuk kode OTP verifikasi akun.',
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }
}
