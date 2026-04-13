<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\PasswordResetController;
use App\Http\Controllers\Api\Auth\EmailVerificationController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\SearchController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class);
Route::post('/logout', LogoutController::class)->middleware('auth:sanctum');

Route::post('/email/verify-otp', [EmailVerificationController::class, 'verifyEmail'])->name('api.verification.verify')->middleware('auth:sanctum');
Route::post('/email/resend-otp', [EmailVerificationController::class, 'resendOtp'])->middleware('throttle:6,1','auth:sanctum')->name('api.verification.resend');

Route::post('/reset-password', [PasswordResetController::class, 'sendOtp']);
Route::post('/otp-check', [PasswordResetController::class, 'checkOtp'])->middleware('throttle:6,1');
Route::post('/new-password', [PasswordResetController::class, 'resetPassword']);    

Route::get('/search', [SearchController::class,'index']);

Route::get('/courses', [CourseController::class, 'index']);