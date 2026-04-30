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
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\LevelController;
use App\Http\Controllers\Api\AssignmentSubmissionController;
use App\Http\Controllers\Api\Auth\PendingEmailVerificationController;
use App\Http\Controllers\Api\ProfileController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class);
Route::post('/logout', LogoutController::class)->middleware('auth:sanctum');

Route::post('/email/verify-otp', [EmailVerificationController::class, 'verifyEmail'])
    ->name('api.verification.verify')
    ->middleware('auth:sanctum');

Route::post('/email/resend-otp', [EmailVerificationController::class, 'resendOtp'])
    ->middleware(['throttle:6,1', 'auth:sanctum'])
    ->name('api.verification.resend');

Route::post('/email/verify-pending-otp', [PendingEmailVerificationController::class, 'verify'])
    ->middleware('auth:sanctum');

Route::post('/email/resend-pending-otp', [PendingEmailVerificationController::class, 'resend'])
    ->middleware(['throttle:6,1', 'auth:sanctum']);

Route::post('/reset-password', [PasswordResetController::class, 'sendOtp']);
Route::post('/otp-check', [PasswordResetController::class, 'checkOtp'])->middleware('throttle:6,1');
Route::post('/new-password', [PasswordResetController::class, 'resetPassword']);

Route::get('/search', [SearchController::class, 'index']);

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{course:slug}', [CourseController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::post('/courses/{course:slug}/enroll', [CourseController::class, 'enroll']);
    Route::get('/courses/{course:slug}/modules/{sort_order}', [CourseController::class, 'learning']);

    Route::post('/assignments/{assignment}/submissions', [AssignmentSubmissionController::class, 'store']);
    Route::delete('/assignments/{assignment}/submissions/{submission}', [AssignmentSubmissionController::class, 'destroy']);
});

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/level', [LevelController::class, 'index']);
