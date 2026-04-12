<?php

use App\Http\Controllers\Web\Admin\AdminController;
use App\Http\Controllers\Web\Admin\CategoryController;
use App\Http\Controllers\Web\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Web\Admin\MemberController;
use App\Http\Controllers\Web\Admin\MentorController;
use App\Http\Controllers\Web\Admin\RoleController;
use App\Http\Controllers\Web\Member\CourseController;
use App\Http\Controllers\Web\EmailChangeVerificationController;
use App\Http\Controllers\Web\Member\SearchController;
use App\Http\Controllers\Web\WelcomeController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\MentorMiddleware;
use App\Http\Middleware\MemberMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', WelcomeController::class)->name('welcome');


Route::get('/search', [SearchController::class, 'index'])->name('search.index');

// Route Member
Route::middleware(['auth', MemberMiddleware::class])->prefix('member')->name('member.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('member/dashboard');
    })->name('dashboard');

    Route::get('courses', [CourseController::class, 'index'])->name('courses.index');
});

// Route Mentor
Route::middleware(['auth', MentorMiddleware::class])->prefix('mentor')->name('mentor.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('mentor/dashboard');
    })->name('dashboard');
});

// Route Admin
Route::middleware(['auth', AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::resource('/roles', RoleController::class)->except(['show']);
    Route::resource('/members', MemberController::class)->except(['show']);
    Route::resource('/mentors', MentorController::class)->except(['show']);
    Route::resource('/admins', AdminController::class)->except(['show']);
    Route::resource('/categories', CategoryController::class)->except(['show']);
    Route::resource('/courses', AdminCourseController::class)->except(['show']);
});

require __DIR__ . '/settings.php';
