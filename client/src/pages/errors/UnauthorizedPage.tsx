/**
 * AUTOSURE — 403 Unauthorized Page
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/utils/constants';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface px-4 text-center animate-fade-in">
      <div aria-hidden className="text-8xl">🚫</div>
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Access Denied</h1>
        <p className="mt-2 text-slate-400">
          You don&apos;t have permission to access this page.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button as={Link} to={ROUTES.DASHBOARD}>
          Dashboard
        </Button>
      </div>
    </div>
  );
}
