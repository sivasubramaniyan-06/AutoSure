/**
 * AUTOSURE — Alert Component
 */

import React from 'react';
import { clsx } from 'clsx';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}

const config: Record<AlertVariant, { wrapper: string; icon: string; titleColor: string }> = {
  info: {
    wrapper: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    icon: 'ℹ',
    titleColor: 'text-blue-200',
  },
  success: {
    wrapper: 'bg-accent-500/10 border-accent-500/30 text-accent-300',
    icon: '✓',
    titleColor: 'text-accent-200',
  },
  warning: {
    wrapper: 'bg-warning-500/10 border-warning-500/30 text-warning-300',
    icon: '⚠',
    titleColor: 'text-warning-200',
  },
  error: {
    wrapper: 'bg-danger-500/10 border-danger-500/30 text-danger-300',
    icon: '✕',
    titleColor: 'text-danger-200',
  },
};

export function Alert({ variant = 'info', title, children, className, onDismiss }: AlertProps) {
  const { wrapper, icon, titleColor } = config[variant];

  return (
    <div
      role="alert"
      className={clsx(
        'flex gap-3 rounded-xl border p-4 text-sm animate-slide-down',
        wrapper,
        className
      )}
    >
      <span className="shrink-0 font-bold" aria-hidden>{icon}</span>
      <div className="flex-1">
        {title && <p className={clsx('font-semibold mb-1', titleColor)}>{title}</p>}
        <div>{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
}
