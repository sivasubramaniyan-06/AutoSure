/**
 * AUTOSURE — 404 Not Found Page
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/utils/constants';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface px-4 text-center animate-fade-in">
      <div aria-hidden className="text-8xl font-black gradient-text">404</div>
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Page not found</h1>
        <p className="mt-2 text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Button as={Link} to={ROUTES.DASHBOARD}>
        Back to Dashboard
      </Button>
    </div>
  );
}
