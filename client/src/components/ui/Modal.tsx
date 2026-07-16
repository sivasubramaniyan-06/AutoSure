/**
 * AUTOSURE — Modal Component
 * Uses the native <dialog> element for proper accessibility.
 */

import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md', footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // Close on backdrop click
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleDialogClick}
      onClose={onClose}
      className={clsx(
        'w-full rounded-2xl bg-surface-50 border border-white/10 shadow-glass-lg',
        'text-slate-100 backdrop:bg-black/60 backdrop:backdrop-blur-sm',
        'p-0 m-auto animate-scale-in',
        sizeClasses[size]
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
          ✕
        </Button>
      </div>

      {/* Body */}
      <div className="px-6 py-5">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          {footer}
        </div>
      )}
    </dialog>
  );
}
