<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Otp;
use Illuminate\Http\Request;

class PendingEmailVerificationController extends Controller
{
    public function verify(Request $request)
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
            ->where('expires_at', '>=', now())
            ->whereNull('used_at')
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'OTP salah atau sudah expired'
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

    public function resend(Request $request)
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

        return response()->json([
            'message' => 'OTP sudah dikirim ke email baru'
        ]);
    }
}
