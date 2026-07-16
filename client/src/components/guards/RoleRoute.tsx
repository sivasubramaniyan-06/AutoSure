/**
 * AUTOSURE — RoleRoute Guard
 * Redirects users who don't have the required role to Unauthorized.
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/utils/constants';
import type { UserRole } from '@/types/auth.types';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { isLoading } = useAuth();
  const { can: hasRole } = useRole();

  if (isLoading) return <FullPageSpinner />;

  if (!hasRole(allowedRoles)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
}
