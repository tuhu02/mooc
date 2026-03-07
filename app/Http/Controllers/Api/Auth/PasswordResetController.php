<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Otp;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;


class PasswordResetController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Delete old unused OTPs for this user
        Otp::where('user_id', $user->id)->where('type', 'forgot_password')->whereNull('used_at')->delete();

        $otpCode = rand(100000, 999999);

        $otp = Otp::create([
            'user_id' => $user->id,
            'otp' => $otpCode,
            'type' => 'forgot_password',
            'expires_at' => Carbon::now()->addMinutes(5),
        ]);

        Mail::raw("Your OTP Code: $otpCode. Expired in 5 minutes", function ($message) use ($user) {
            $message->to($user->email)->subject('OTP Reset Password');
        });

        return response()->json([
            'message' => 'OTP successfully send to email',
        ]);
    }

    public function checkOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|string|size:6',
        ]);

        $otp = Otp::where('otp', $request->otp)
            ->where('expires_at', '>=', Carbon::now())
            ->where('type', 'forgot_password')
            ->whereNull('used_at')
            ->first();

        if (!$otp) {
            return response()->json(['message' => 'OTP is not valid or has expired'], 400);
        }

        if (!$otp->token) {
            $otp->token = Str::random(60);
            $otp->save();
        }

        return response()->json([
            'message' => 'OTP verified successfully.',
            'reset-token' => $otp->token
        ]);
    }

    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'reset_token' => 'required',
                'password' => 'required|min:8|confirmed',
            ]);
        } catch (ValidationException $e) {
            Log::warning('Password reset validation failed', [
                'errors' => $e->errors(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
            throw $e;
        }

        $otp = Otp::where('token', $request->reset_token)
            ->where('type', 'forgot_password')
            ->where('expires_at', '>=', Carbon::now())
            ->whereNull('used_at')
            ->first();

        if (!$otp) {
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        $user = User::find($otp->user_id);
        $user->password = bcrypt($request->password);
        $user->save();

        $otp->used_at = Carbon::now();
        $otp->save();

        return response()->json([
            'message' => 'Password has been successfully reset.',
        ]);
    }
}
