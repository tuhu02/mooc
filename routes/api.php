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

Route::get('/email/verify/{id}/{hash}', function(EmailVerificationRequest $request){
    $request->fulfill();

    $user = User::findOrFail($request->route('id'));
    $token = $user->createToken('auth-token')->plainTextToken;
    
    return response()->json([
        'message' => 'Email is verified',
        'token' => $token,
    ]);
})->middleware('signed')->name('verification.verify');

Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class);
Route::post('/logout', LogoutController::class)->middleware('auth:sanctum');
Route::post('/reset-password', [PasswordResetController::class, 'sendOtp']);
Route::post('/otp-check', [PasswordResetController::class, 'checkOtp']);
Route::post('/new-password', [PasswordResetController::class, 'resetPassword']);