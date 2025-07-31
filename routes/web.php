<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SwitchRoleController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Switch Role Routes
    Route::get('/switch-role', [SwitchRoleController::class, 'index'])->name('switch.role.form');
    Route::post('/switch-role', [SwitchRoleController::class, 'switch'])->name('switch.role');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
