<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\PasswordOtp;
use Carbon\Carbon;
use Illuminate\Support\Str;


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

    public function checkOtp(Request $request){
        $request->validate([
            'otp' => 'required',
        ]);
        
        $passwordOtp = PasswordOtp::where('otp' , $request->otp)->where('expires_at', '>=', Carbon::now())->first();

        if(!$passwordOtp){
            return respon()->json(['message' => 'OTP is not valid']);
        }

        $passwordOtp->token = Str::random(60);
        $passwordOtp->save();

        return response()->json([
            'message' => 'OTP VALID',
            'reset-token' => $passwordOtp->token
        ]);
    }

    public function resetPassword(Request $request){
        $request->validate([
            'reset_token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $passwordOtp = PasswordOtp::where('token', $request->reset_token)->where('expires_at', '>=', Carbon::now())->first();

        if(!$passwordOtp){
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        $user = User::find($passwordOtp->user_id);
        $user->password = bcrypt($request->password);
        $user->save();

        $passwordOtp->delete();

        return response()->json([
            'message' => 'Password has been successfully reset.',
        ], 200);
    }
}
