/**
 * AUTOSURE — useApi Hook
 * Returns a pre-configured Axios instance. Useful for components that
 * want to trigger requests with local loading/error state.
 */

import { useState, useCallback } from 'react';
import type { AxiosRequestConfig } from 'axios';
import api from '@/services/api';
import type { RequestStatus } from '@/types/api.types';

interface UseApiReturn<T> {
  data: T | null;
  status: RequestStatus;
  error: string | null;
  execute: (config?: AxiosRequestConfig) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = unknown>(
  defaultConfig?: AxiosRequestConfig
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (overrideConfig?: AxiosRequestConfig): Promise<T | null> => {
      setStatus('loading');
      setError(null);
      try {
        const response = await api.request<T>({
          ...defaultConfig,
          ...overrideConfig,
        });
        setData(response.data);
        setStatus('success');
        return response.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
        setStatus('error');
        return null;
      }
    },
    [defaultConfig]
  );

  const reset = useCallback(() => {
    setData(null);
    setStatus('idle');
    setError(null);
  }, []);

  return { data, status, error, execute, reset };
}
