<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\PasswordResetController;
use App\Models\User;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route ketika user belum verified tapi mencoba untuk membuka halaman lain
Route::get('/email/verify', function () {
    return response()->json([
        'message' => 'Your email is not verified yet. Please check your email.'
    ], 403);
})->name('api.verification.notice');

// Route untuk verifikasi email
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {

    $user = User::findOrFail($id);

    if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'Invalid verification link'], 403);
    }

    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email already verified']);
    }

    $user->markEmailAsVerified();

    $token = $user->createToken('auth-token')->plainTextToken;

    return response()->json([
        'message' => 'Email Verification Successfull',
        'token' => $token,
    ]);

})->middleware(['signed'])->name('api.verification.verify');


// Route untuk mengirim ulang email verifikasi
Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return response()->json([
        'message' => 'Verification link sent successfully.'
    ]);
})->middleware(['auth:sanctum', 'throttle:6,1'])->name('api.verification.send');


Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class);
Route::post('/logout', LogoutController::class)->middleware('auth:sanctum');
Route::post('/reset-password', [PasswordResetController::class, 'sendOtp']);
Route::post('/otp-check', [PasswordResetController::class, 'checkOtp']);
Route::post('/new-password', [PasswordResetController::class, 'resetPassword']);