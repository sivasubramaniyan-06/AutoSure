/**
 * AUTOSURE — Badge Component
 */

import React from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-500/20 text-slate-300',
  success: 'bg-accent-500/20 text-accent-400',
  warning: 'bg-warning-500/20 text-warning-400',
  danger: 'bg-danger-500/20 text-danger-400',
  info: 'bg-blue-500/20 text-blue-400',
  purple: 'bg-purple-500/20 text-purple-400',
};

const dotClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-400',
  success: 'bg-accent-400',
  warning: 'bg-warning-400',
  danger: 'bg-danger-400',
  info: 'bg-blue-400',
  purple: 'bg-purple-400',
};

export function Badge({ children, variant = 'default', className, dot }: BadgeProps) {
  return (
    <span
      className={clsx(
        'status-badge',
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx('h-1.5 w-1.5 rounded-full', dotClasses[variant])}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}
