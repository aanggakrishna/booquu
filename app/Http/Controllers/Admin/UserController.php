<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(): Response
    {
        $users = User::with('roles')->get();
        
        return Inertia::render('admin/users/index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        $roles = Role::all();
        
        return Inertia::render('admin/users/create', [
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        try {
            DB::beginTransaction();
            
            // Dalam method store
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            
            $roles = Role::whereIn('id', $request->roles)->get();
            $user->syncRoles($roles);
            
            DB::commit();
            
            return redirect()->route('admin.users.index')
                ->with('message', 'Pengguna berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'email' => 'Terjadi kesalahan saat membuat pengguna.'
            ]);
        }
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        $user->load('roles');
        $roles = Role::all();
        
        return Inertia::render('admin/users/edit', [
            'user' => $user,
            'roles' => $roles,
            'selectedRoles' => $user->roles->pluck('id')
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $user->id,
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        if ($request->filled('password')) {
            $request->validate([
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);
        }

        try {
            DB::beginTransaction();
            
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);
            
            if ($request->filled('password')) {
                $user->update([
                    'password' => Hash::make($request->password),
                ]);
            }
            
            // Dalam method update
            $roles = Role::whereIn('id', $request->roles)->get();
            $user->syncRoles($roles);
            
            DB::commit();
            
            return redirect()->route('admin.users.index')
                ->with('message', 'Pengguna berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'email' => 'Terjadi kesalahan saat memperbarui pengguna.'
            ]);
        }
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        // Prevent deleting your own account
        if ($user->id === auth()->id()) {
            return back()->withErrors(['message' => 'Anda tidak dapat menghapus akun Anda sendiri.']);
        }

        try {
            $user->delete();
            return redirect()->route('admin.users.index')
                ->with('message', 'Pengguna berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus pengguna.']);
        }
    }
}