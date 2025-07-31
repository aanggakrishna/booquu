<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PermissionController extends Controller
{
    /**
     * Display a listing of the permissions.
     */
    public function index(): Response
    {
        $permissions = Permission::all();
        
        return Inertia::render('admin/permissions/index', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Show the form for creating a new permission.
     */
    public function create(): Response
    {
        return Inertia::render('admin/permissions/create');
    }

    /**
     * Store a newly created permission in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
        ]);

        try {
            DB::beginTransaction();
            
            $permission = Permission::create(['name' => $request->name]);
            
            // Log aktivitas
            Log::info('Permission created', [
                'user_id' => auth()->id(),
                'permission_id' => $permission->id,
                'permission_name' => $permission->name
            ]);
            
            DB::commit();
            
            return redirect()->route('admin.permissions.index')
                ->with('message', 'Hak akses berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating permission', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage()
            ]);
            
            throw ValidationException::withMessages([
                'name' => 'Terjadi kesalahan saat membuat hak akses.'
            ]);
        }
    }

    /**
     * Show the form for editing the specified permission.
     */
    public function edit(Permission $permission): Response
    {
        return Inertia::render('admin/permissions/edit', [
            'permission' => $permission
        ]);
    }

    /**
     * Update the specified permission in storage.
     */
    public function update(Request $request, Permission $permission): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
        ]);

        try {
            DB::beginTransaction();
            
            $permission->update(['name' => $request->name]);
            
            // Log aktivitas
            Log::info('Permission updated', [
                'user_id' => auth()->id(),
                'permission_id' => $permission->id,
                'permission_name' => $permission->name
            ]);
            
            DB::commit();
            
            return redirect()->route('admin.permissions.index')
                ->with('message', 'Hak akses berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating permission', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage()
            ]);
            
            throw ValidationException::withMessages([
                'name' => 'Terjadi kesalahan saat memperbarui hak akses.'
            ]);
        }
    }

    /**
     * Remove the specified permission from storage.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        try {
            DB::beginTransaction();
            
            // Simpan nama untuk log
            $permissionName = $permission->name;
            $permissionId = $permission->id;
            
            $permission->delete();
            
            // Log aktivitas
            Log::info('Permission deleted', [
                'user_id' => auth()->id(),
                'permission_id' => $permissionId,
                'permission_name' => $permissionName
            ]);
            
            DB::commit();
            
            return redirect()->route('admin.permissions.index')
                ->with('message', 'Hak akses berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting permission', [
                'user_id' => auth()->id(),
                'permission_id' => $permission->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus hak akses.']);
        }
    }
}