<?php

use App\Http\Controllers\Web\Admin\AdminController;
use App\Http\Controllers\Web\Admin\CategoryController;
use App\Http\Controllers\Web\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Web\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Web\Admin\MemberController;
use App\Http\Controllers\Web\Admin\MentorController;
use App\Http\Controllers\Web\Admin\ModuleController;
use App\Http\Controllers\Web\Admin\RoleController;
use App\Http\Controllers\Web\Member\AssignmentSubmissionController;
use App\Http\Controllers\Web\Member\CourseController;
use App\Http\Controllers\Web\WelcomeController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\MentorMiddleware;
use App\Http\Middleware\MemberMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', WelcomeController::class)->name('welcome');


// Route Member
Route::prefix('member')->name('member.')->group(function () {
    Route::get('courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('courses/{course:slug}', [CourseController::class, 'show'])->name('courses.show');

    Route::get('courses/{course:slug}/modules/{sort_order?}', [CourseController::class, 'learning'])
        ->name('courses.learning');

    Route::middleware(['auth', MemberMiddleware::class])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('member/dashboard');
        })->name('dashboard');

        Route::post('courses/{course:slug}/enroll', [CourseController::class, 'enroll'])->name('courses.enroll');
        Route::post('assignments/{assignment}/submissions', [AssignmentSubmissionController::class, 'store'])->name('assignments.submissions.store');
        Route::delete('assignments/{assignment}/submissions/{submission}', [AssignmentSubmissionController::class, 'destroy'])->name('assignments.submissions.destroy');
    });
});

// Route Mentor
Route::middleware(['auth', MentorMiddleware::class])->prefix('mentor')->name('mentor.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('mentor/dashboard');
    })->name('dashboard');
});

// Route Admin
Route::middleware(['auth', AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::resource('/roles', RoleController::class)->except(['show']);
    Route::resource('/members', MemberController::class)->except(['show']);
    Route::resource('/mentors', MentorController::class)->except(['show']);
    Route::resource('/admins', AdminController::class)->except(['show']);
    Route::resource('/categories', CategoryController::class)->except(['show']);
    Route::resource('/courses', AdminCourseController::class);
    Route::post('/modules/reorder', [ModuleController::class, 'reorder'])->name('modules.reorder');
    Route::resource('/modules', ModuleController::class)->except(['show']);
});

require __DIR__ . '/settings.php';
