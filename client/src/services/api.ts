/**
 * AUTOSURE — Axios API Client
 *
 * Configures a base Axios instance with:
 *  - Base URL from environment
 *  - Authorization header injection (Firebase ID token)
 *  - Centralized error normalization
 *  - Automatic token refresh on 401
 */

import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';
import { auth } from './firebase';
import { API_BASE_URL, API_TIMEOUT_MS } from '@/utils/constants';
import type { ApiError } from '@/types/api.types';

// ─── Instance ─────────────────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// ─── Request Interceptor ──────────────────────────────────────

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(/* forceRefresh */ false);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const status = error.response?.status;

    // Token expired — force refresh and retry once
    if (status === 401 && auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken(/* forceRefresh */ true);
        if (error.config) {
          error.config.headers.Authorization = `Bearer ${token}`;
          return api.request(error.config);
        }
      } catch {
        // Refresh failed — the auth context will handle sign-out
      }
    }

    return Promise.reject(error);
  }
);

export default api;
