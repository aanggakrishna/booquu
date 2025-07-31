<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckActiveRolePermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!Auth::check()) {
            return redirect('login');
        }

        $user = Auth::user();
        
        if (!$user->activeRole) {
            return redirect()->route('switch.role.form')
                ->with('message', 'Silakan pilih role aktif terlebih dahulu.');
        }
        
        if ($user->hasActiveRolePermission($permission)) {
            return $next($request);
        }

        abort(403, 'Unauthorized action.');
    }
}