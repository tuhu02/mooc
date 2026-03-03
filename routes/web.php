<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Web\admin\RoleController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');

    Route::get('/users/users-index', function(){
        return Inertia::render('admin/users/users-index');
    });
    
    Route::get('roles/roles-index', [RoleController::class, 'index'])->name('admin.roles.index');
    Route::get('/roles/roles-add', [RoleController::class, 'add'])->name('admin.roles.add');
    Route::post('/roles/roles-store', [RoleController::class, 'store'])->name('admin.roles.store');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('admin.roles.edit');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('admin.roles.update');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('admin.roles.destroy');

});
                                                                                                                                                                    
require __DIR__.'/settings.php';