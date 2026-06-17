    <?php

    use App\Http\Controllers\Web\Admin\AdminController;
    use App\Http\Controllers\Web\Admin\AssignmentSubmissionReviewController;
    use App\Http\Controllers\Web\Admin\CategoryController;
    use App\Http\Controllers\Web\Admin\CourseController as AdminCourseController;
    use App\Http\Controllers\Web\Admin\DashboardController as AdminDashboardController;
    use App\Http\Controllers\Web\Admin\MemberController;
    use App\Http\Controllers\Web\Admin\MentorController;
    use App\Http\Controllers\Web\Admin\ModuleController;
    use App\Http\Controllers\Web\Admin\RoleController;
    use App\Http\Controllers\Web\Member\AssignmentSubmissionController;
    use App\Http\Controllers\Web\Member\CourseController;
    use App\Http\Controllers\Web\Member\EventController;
    use App\Http\Controllers\Web\Member\DashboardController as MemberDashboardController;
    use App\Http\Controllers\Web\WelcomeController;
    use App\Http\Middleware\AdminMiddleware;
    use App\Http\Middleware\MentorMiddleware;
    use App\Http\Middleware\MemberMiddleware;
    use Illuminate\Support\Facades\Route;
    use Inertia\Inertia;

    Route::get('/', WelcomeController::class)->name('welcome');

    Route::get('/about', function () {
        return Inertia::render('member/about');
    });

    // Route Member
    Route::prefix('member')->name('member.')->group(function () {
        Route::get('courses', [CourseController::class, 'index'])->name('courses.index');
        Route::get('courses/{course:slug}', [CourseController::class, 'show'])->name('courses.show');

        Route::get('events', [EventController::class, 'index'])->name('events.index');
        Route::get('events/{course:slug}', [EventController::class, 'show'])->name('events.show');

        Route::get('courses/{course:slug}/modules/{sort_order?}', [CourseController::class, 'learning'])
            ->middleware('course.learning.access')
            ->name('courses.learning');

        Route::get('courses/{course:slug}/completion', [CourseController::class, 'completion'])
            ->middleware(['auth', MemberMiddleware::class])
            ->name('courses.completion');

        Route::get('events/{course:slug}/modules/{sort_order?}', [EventController::class, 'learning'])
            ->middleware('event.learning.access')
            ->name('events.learning');

        Route::middleware(['auth', MemberMiddleware::class])->group(function () {
            Route::get('dashboard', [MemberDashboardController::class, 'index'])->middleware('verified')->name('dashboard');
            Route::get('my-courses', [CourseController::class, 'myCourses'])->name('courses.my');
            Route::post('courses/{course:slug}/enroll', [CourseController::class, 'enroll'])->middleware('verified')->name('courses.enroll');
            Route::post('events/{course:slug}/enroll', [EventController::class, 'enroll'])->name('events.enroll');
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
        Route::put('/modules/{module}/attachments/{attachment}', [ModuleController::class, 'updateAttachment'])->name('modules.update-attachment');
        Route::delete('/modules/{module}/attachments/{attachment}', [ModuleController::class, 'deleteAttachment'])->name('modules.delete-attachment');
        Route::resource('/modules', ModuleController::class)->except(['show']);

        Route::get('/submissions', [AssignmentSubmissionReviewController::class, 'index'])
            ->name('submissions.index');

        Route::put('/submissions/{submission}/review', [AssignmentSubmissionReviewController::class, 'review'])
            ->name('submissions.review');
    });

    require __DIR__ . '/settings.php';
