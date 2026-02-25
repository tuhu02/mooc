<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\PasswordOtp;
use Carbon\Carbon;


class PasswordResetController extends Controller
{
    public function sendOtp(Request $request){
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if(!$user){
            return response()->json(['message' => 'User not found'], 404);
        }

        PasswordOtp::where('user_id', $user->id)->delete();

        $otp = rand(100000, 999999);

        $passwordOtp = PasswordOtp::create([
            'user_id' => $user->id,
            'otp' => $otp,
            'expires_at' => Carbon::now()->addMinutes(5),
        ]);

        Mail::raw("Your OTP Code: $otp. Expired in 5 minutes", function ($message) use ($user){
            $message->to($user->email)->subject('OTP Reset Password');
        });

        return response()->json([
            'message' => 'OTP successfully send to email',
        ]);
    }
}
