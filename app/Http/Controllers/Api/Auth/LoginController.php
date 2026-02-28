<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string|min:8'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Login validation failed', [
                'errors' => $e->errors(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
            throw $e;
        }

        if (!auth()->attempt($credentials)){
            Log::warning('login failed', [
                'email' => $request->email,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
            return response()->json(['message' => 'Credentials are not valid'], 401);
        }

        $user = auth()->user();
        
        if (!$user->hasVerifiedEmail()) {
            auth()->logout();

            return response()->json([
                'message' => 'Email belum diverifikasi'
            ], 403);
        }

        return response()->json([
            'token' => $user->createToken('auth-token')->plainTextToken
        ]);
    }
} 
