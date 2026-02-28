<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RegisterController extends Controller
{
    public function __invoke(Request $request){
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8|confirmed'
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
        ]);

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Register berhasil. Silakan cek email untuk verifikasi terlebih dahulu.'
        ], 201);
    }
}