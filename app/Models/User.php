<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Role;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'active_role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    /**
     * Get the active role of the user.
     */
    public function activeRole()
    {
        return $this->belongsTo(Role::class, 'active_role_id');
    }
    
    /**
     * Set the active role for the user.
     *
     * @param int $roleId
     * @return bool
     */
    public function setActiveRole($roleId)
    {
        // Pastikan user memiliki role tersebut
        $role = Role::findById($roleId);
        if (!$this->hasRole($role)) {
            return false;
        }
        
        return $this->update(['active_role_id' => $roleId]);
    }
    
    /**
     * Check if user has permission through active role.
     *
     * @param string $permission
     * @return bool
     */
    public function hasActiveRolePermission($permission)
    {
        if (!$this->activeRole) {
            return false;
        }
        
        return $this->activeRole->hasPermissionTo($permission);
    }
}
