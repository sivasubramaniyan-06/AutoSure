/**
 * AUTOSURE — App Root
 * React Router v6 configuration with auth guards and role-based routing.
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

import { PrivateRoute } from '@/components/guards/PrivateRoute';
import { RoleRoute } from '@/components/guards/RoleRoute';
import { GuestRoute } from '@/components/guards/GuestRoute';
import { FullPageSpinner } from '@/components/ui/Spinner';

import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

import { ROUTES } from '@/utils/constants';

// ─── Lazy-loaded pages ────────────────────────────────────────
// Auth
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const LandingPage = lazy(() => import('@/pages/LandingPage'));

// Dashboard
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const CustomerDashboardPage = lazy(() => import('@/pages/dashboard/CustomerDashboardPage'));
const OfficerDashboardPage = lazy(() => import('@/pages/dashboard/OfficerDashboardPage'));
const AdminDashboardPage = lazy(() => import('@/pages/dashboard/AdminDashboardPage'));

// Claims
const ClaimsListPage = lazy(() => import('@/pages/claims/ClaimsListPage'));
const SubmitClaimPage = lazy(() => import('@/pages/claims/SubmitClaimPage'));
const ClaimDetailPage = lazy(() => import('@/pages/claims/ClaimDetailPage'));

// Errors
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/errors/UnauthorizedPage'));

// ─── App ──────────────────────────────────────────────────────

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<FullPageSpinner />}>
            <Routes>
              {/* Root landing page */}
              <Route path="/" element={<LandingPage />} />

              {/* ── Public Auth Routes (guests only) ── */}
              <Route element={<GuestRoute />}>
                <Route element={<AuthLayout />}>
                  <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                  <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                </Route>
              </Route>

              {/* ── Protected Routes ── */}
              <Route element={<PrivateRoute />}>
                <Route element={<DashboardLayout />}>

                  {/* Role-agnostic dashboard redirect */}
                  <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

                  {/* Customer-only routes */}
                  <Route element={<RoleRoute allowedRoles={['customer']} />}>
                    <Route path={ROUTES.CUSTOMER_DASHBOARD} element={<CustomerDashboardPage />} />
                    <Route path={ROUTES.CLAIM_SUBMIT} element={<SubmitClaimPage />} />
                  </Route>

                  {/* Officer-only routes */}
                  <Route element={<RoleRoute allowedRoles={['officer', 'admin']} />}>
                    <Route path={ROUTES.OFFICER_DASHBOARD} element={<OfficerDashboardPage />} />
                  </Route>

                  {/* Admin-only routes */}
                  <Route element={<RoleRoute allowedRoles={['admin']} />}>
                    <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
                  </Route>

                  {/* Shared protected routes */}
                  <Route element={<RoleRoute allowedRoles={['customer', 'officer', 'admin']} />}>
                    <Route path={ROUTES.CLAIMS} element={<ClaimsListPage />} />
                    <Route path={ROUTES.CLAIM_DETAIL} element={<ClaimDetailPage />} />
                  </Route>

                </Route>
              </Route>

              {/* Error pages */}
              <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>

          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
