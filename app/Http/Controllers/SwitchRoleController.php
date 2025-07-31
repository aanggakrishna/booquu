<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Spatie\Permission\PermissionRegistrar;

class SwitchRoleController extends Controller
{
    /**
     * Show the form for switching active role.
     */
    public function index(): Response
    {
        $user = Auth::user();
        $userRoles = $user->roles;
        $activeRoleId = $user->active_role_id;
        
        return Inertia::render('switch-role', [
            'userRoles' => $userRoles,
            'activeRoleId' => $activeRoleId
        ]);
    }
    
    /**
     * Switch the active role.
     */
    public function switch(Request $request): RedirectResponse
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);
        
        $user = Auth::user();
        
        try {
            // Pastikan user memiliki role tersebut
            $role = Role::findById($request->role_id);
            if (!$user->hasRole($role)) {
                return back()->withErrors(['message' => 'Anda tidak memiliki role tersebut.']);
            }
            
            // Set role aktif
            $success = $user->setActiveRole($request->role_id);
            
            if ($success) {
                // Bersihkan cache permission
                app()[PermissionRegistrar::class]->forgetCachedPermissions();
                
                Log::info('User switched active role', [
                    'user_id' => $user->id,
                    'role_id' => $request->role_id,
                    'role_name' => $role->name
                ]);
                // dd(session()); // Hapus atau komentari baris ini
                return redirect()->route('dashboard')
                    ->with('message', 'Role aktif berhasil diubah menjadi ' . $role->name);
            } else {
                return back()->withErrors(['message' => 'Gagal mengubah role aktif.']);
            }
        } catch (\Exception $e) {
            Log::error('Error switching active role', [
                'user_id' => $user->id,
                'role_id' => $request->role_id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors(['message' => 'Terjadi kesalahan saat mengubah role aktif.']);
        }
    }
}
