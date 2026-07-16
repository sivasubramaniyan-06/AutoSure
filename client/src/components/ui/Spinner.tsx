/**
 * AUTOSURE — Spinner Component
 */

import React from 'react';
import { clsx } from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-2',
  xl: 'h-12 w-12 border-[3px]',
};

export function Spinner({ size = 'md', className, label = 'Loading...' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={clsx(
        'inline-block animate-spin rounded-full border-brand-500 border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-sm text-slate-400 animate-pulse">Loading AUTOSURE...</p>
      </div>
    </div>
  );
}
