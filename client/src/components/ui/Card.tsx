/**
 * AUTOSURE — Card Component
 */

import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className, hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={clsx(
        hover ? 'glass-card-hover' : 'glass-card',
        paddingClasses[padding],
        'animate-fade-in',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

Card.Header = function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('mb-4 flex items-center justify-between', className)}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={clsx('text-lg font-semibold text-slate-100', className)}>
      {children}
    </h3>
  );
};

Card.Footer = function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'mt-4 flex items-center justify-end gap-3 border-t border-white/10 pt-4',
        className
      )}
    >
      {children}
    </div>
  );
};
