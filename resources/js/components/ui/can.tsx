import { ReactNode } from 'react';
import { usePermission } from '@/hooks/usePermission';

interface CanProps {
  permission?: string;
  role?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({ permission, role, children, fallback = null }: CanProps) {
  const { can, hasRole } = usePermission();
  // Jika permission dan role keduanya tidak ada, tampilkan children
  if (!permission && !role) {
    return <>{children}</>;
  }
  
  // Jika permission ada dan user memiliki permission tersebut
  if (permission && can(permission)) {
    return <>{children}</>;
  }
  
  // Jika role ada dan user memiliki role tersebut
  console.log('hasRole(\''+role+'\'):', role ? hasRole(role) : false);
  if (role && hasRole(role)) {
    return <>{children}</>;
  }
  
  // Jika tidak memenuhi kondisi di atas, tampilkan fallback
  return <>{fallback}</>;
}