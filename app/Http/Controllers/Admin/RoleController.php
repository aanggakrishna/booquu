<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RoleController extends Controller
{
    /**
     * Display a listing of the roles.
     */
    public function index(): Response
    {
        $roles = Role::with('permissions')->get();
        
        return Inertia::render('admin/roles/index', [
            'roles' => $roles
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create(): Response
    {
        $permissions = Permission::all();
        
        return Inertia::render('admin/roles/create', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        try {
            DB::beginTransaction();
            
            $role = Role::create(['name' => $request->name]);
            $permissions = Permission::whereIn('id', $request->permissions)->get();
            $role->syncPermissions($permissions);
            
            DB::commit();
            
            return redirect()->route('admin.roles.index')
                ->with('message', 'Role berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'name' => 'Terjadi kesalahan saat membuat role.'
            ]);
        }
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role): Response
    {
        $role->load('permissions');
        $permissions = Permission::all();
        
        return Inertia::render('admin/roles/edit', [
            'role' => $role,
            'permissions' => $permissions,
            'selectedPermissions' => $role->permissions->pluck('id')
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, Role $role): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        try {
            DB::beginTransaction();
            
            $role->update(['name' => $request->name]);
            $permissions = Permission::whereIn('id', $request->permissions)->get();
            $role->syncPermissions($permissions);
            
            DB::commit();
            
            return redirect()->route('admin.roles.index')
                ->with('message', 'Role berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'name' => 'Terjadi kesalahan saat memperbarui role.'
            ]);
        }
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        if ($role->name === 'admin') {
            return back()->withErrors(['message' => 'Role admin tidak dapat dihapus.']);
        }

        try {
            $role->delete();
            return redirect()->route('admin.roles.index')
                ->with('message', 'Role berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus role.']);
        }
    }
}