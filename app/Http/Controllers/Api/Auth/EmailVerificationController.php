<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Otp;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\UserResource;

class EmailVerificationController extends Controller
{
    public function verifyEmail(Request $request)
    {
        $request->validate([
            'otp' => 'required|string|size:6',
        ]);

        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified'
            ], 400);
        }

        $otp = Otp::where('user_id', $user->id)
            ->where('otp', $request->otp)
            ->where('type', 'email_verification')
            ->where('expires_at', '>=', Carbon::now())
            ->whereNull('used_at')
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'Invalid or expired OTP code'
            ], 400);
        }

        $user->markEmailAsVerified();

        $otp->used_at = Carbon::now();
        $otp->save();


        Log::info('Email verified successfully', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);

        return response()->json([
            'message' => 'Email verified successfully',
            'user' => new UserResource($user),
        ]);
    }

    public function resendOtp(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified'
            ], 400);
        }

        $user->otps()->where('type', 'email_verification')->whereNull('used_at')->delete();

        $user->sendEmailVerificationNotification();

        Log::info('Email verification OTP resent', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);

        return response()->json([
            'message' => 'OTP code has been sent to your email'
        ]);
    }

    public function verifyPendingEmail(Request $request)
    {
        $request->validate([
            'otp' => 'required|string|size:6',
        ]);

        $user = $request->user();

        if (!$user->pending_email) {
            return response()->json([
                'message' => 'Tidak ada email baru yang perlu diverifikasi'
            ], 400);
        }

        $otp = Otp::where('user_id', $user->id)
            ->where('otp', $request->otp)
            ->where('type', 'pending_email_verification')
            ->where('expires_at', '>=', Carbon::now())
            ->whereNull('used_at')
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'Invalid or expired OTP code'
            ], 400);
        }

        $user->email = $user->pending_email;
        $user->pending_email = null;
        $user->email_verified_at = now();
        $user->save();

        $otp->used_at = now();
        $otp->save();

        return response()->json([
            'message' => 'Email baru berhasil diverifikasi',
            'user' => new UserResource($user->fresh()),
        ]);
    }


    public function resendPendingEmailOtp(Request $request)
    {
        $user = $request->user();

        if (!$user->pending_email) {
            return response()->json([
                'message' => 'Tidak ada email baru yang perlu diverifikasi'
            ], 400);
        }

        $user->otps()
            ->where('type', 'pending_email_verification')
            ->whereNull('used_at')
            ->delete();

        $user->sendPendingEmailVerificationNotification();

        Log::info('Pending email verification OTP resent', [
            'user_id' => $user->id,
            'pending_email' => $user->pending_email,
        ]);

        return response()->json([
            'message' => 'OTP code has been sent to your new email'
        ]);
    }
}
