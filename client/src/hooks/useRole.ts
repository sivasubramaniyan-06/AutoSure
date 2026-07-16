/**
 * AUTOSURE — useRole Hook
 * Provides permission helpers based on the authenticated user's role.
 */

import { useAuth } from './useAuth';
import type { UserRole } from '@/types/auth.types';

export function useRole() {
  const { user } = useAuth();
  
  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return {
    role: user?.role ?? null,
    isCustomer: hasRole('customer'),
    isOfficer: hasRole('officer'),
    isAdmin: hasRole('admin'),
    isOfficerOrAdmin: hasRole(['officer', 'admin']),
    can: hasRole,
  };
}
