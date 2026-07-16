/**
 * AUTOSURE — useToast Hook
 * Thin wrapper around react-hot-toast for consistent styling.
 */

import toast from 'react-hot-toast';

export function useToast() {
  return {
    success: (message: string) =>
      toast.success(message, {
        duration: 4000,
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          border: '1px solid #334155',
          borderRadius: '0.75rem',
        },
      }),
    error: (message: string) =>
      toast.error(message, {
        duration: 5000,
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          border: '1px solid #ef4444',
          borderRadius: '0.75rem',
        },
      }),
    loading: (message: string) =>
      toast.loading(message, {
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          border: '1px solid #334155',
          borderRadius: '0.75rem',
        },
      }),
    dismiss: toast.dismiss,
    promise: toast.promise,
  };
}
