import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

export function usePermission() {
  const { auth } = usePage<SharedData>().props;
  
  /**
   * Check if user has permission through active role
   */
  const can = (permission: string): boolean => {
    if (!auth.user || !auth.user.activeRole) {
      return false;
    }
    
    // Jika activeRole adalah admin, berikan semua izin
    if (auth.user.activeRole.name === 'admin') {
      return true;
    }
    
    // Periksa apakah role memiliki permission yang diminta
    return auth.user.activeRole.permissions?.some(
      (p: { name: string }) => p.name === permission
    ) ?? false;
  };
  
  /**
   * Check if user has active role
   */
  const hasRole = (roleName: string): boolean => {
    if (!auth.user) {
      return false;
    }
    
    // Jika user tidak memiliki activeRole, cek roles yang dimiliki user
    if (!auth.user.activeRole) {
      // Jika user memiliki property roles, cek apakah memiliki role yang diminta
      return auth.user.roles?.some((r: { name: string }) => r.name === roleName) ?? false;
    }
    
    return auth.user.activeRole.name === roleName;
  };
  
  return {
    can,
    hasRole
  };
}