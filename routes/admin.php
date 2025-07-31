<?php

use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\AuditController;
use App\Http\Controllers\Admin\LogController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'active.role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    // User management
    Route::resource('users', UserController::class);

    // Role management
    Route::resource('roles', RoleController::class);
    
    // Permission management (Manajemen Hak Akses)
    Route::resource('permissions', PermissionController::class);
    
    // Audit management
    Route::get('audits', [AuditController::class, 'index'])->name('audits.index');
    Route::get('audits/{audit}', [AuditController::class, 'show'])->name('audits.show');
    
    // Log management
    Route::get('logs', [LogController::class, 'index'])->name('logs.index');
});