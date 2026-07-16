/**
 * AUTOSURE — Dashboard Page
 * Role-aware landing page that redirects to the appropriate sub-dashboard.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { ROUTES } from '@/utils/constants';
import { FullPageSpinner } from '@/components/ui/Spinner';

export default function DashboardPage() {
  const { role, isCustomer, isOfficer, isAdmin } = useRole();

  if (!role) return <FullPageSpinner />;
  if (isCustomer) return <Navigate to={ROUTES.CUSTOMER_DASHBOARD} replace />;
  if (isOfficer) return <Navigate to={ROUTES.OFFICER_DASHBOARD} replace />;
  if (isAdmin) return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;

  return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
}
