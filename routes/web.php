<?php

use App\Http\Controllers\Web\Admin\AdminController;
use App\Http\Controllers\Web\Admin\CategoryController;
use App\Http\Controllers\Web\Admin\CourseController;
use App\Http\Controllers\Web\Admin\MemberController;
use App\Http\Controllers\Web\Admin\MentorController;
use App\Http\Controllers\Web\Admin\RoleController;
use App\Http\Controllers\Web\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', WelcomeController::class)->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'can:manage.roles'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::resource('/roles', RoleController::class)->except(['show']);
    Route::resource('/members', MemberController::class)->except(['show']);
    Route::resource('/mentors', MentorController::class)->except(['show']);
    Route::resource('/admins', AdminController::class)->except(['show']);
    Route::resource('/categories', CategoryController::class)->except(['show']);
    Route::resource('/courses', CourseController::class)->except(['show']);
});

require __DIR__ . '/settings.php';
