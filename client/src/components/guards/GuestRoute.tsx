/**
 * AUTOSURE — GuestRoute Guard
 * Redirects already-authenticated users away from auth pages (login, register)
 * to the dashboard. Mirrors PrivateRoute but in reverse.
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/utils/constants';

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait for Firebase to resolve the initial auth state before deciding
  if (isLoading) return <FullPageSpinner />;

  // Already authenticated → send to dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
