<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    // ... existing code ...

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array<string, class-string|string>
     */
    protected $middlewareAliases = [
        // ... existing middleware ...
        'role' => \App\Http\Middleware\CheckRole::class,
        'active.permission' => \App\Http\Middleware\CheckActiveRolePermission::class,
    ];
}