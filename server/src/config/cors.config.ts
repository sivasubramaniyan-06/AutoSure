/**
 * AUTOSURE — CORS Configuration
 *
 * Allowed origins:
 *  - No origin at all  → always pass (health checks, curl, Postman, server-to-server)
 *  - Explicit list     → CORS_ALLOWED_ORIGINS env var (comma-separated) + hardcoded prod URLs
 *  - Everything else   → 403 Forbidden (handled in errorHandler as a CORS error)
 */

import type { CorsOptions } from 'cors';
import { env } from './env.config';

/**
 * Origins that are ALWAYS allowed regardless of the env var.
 * Add your production frontend URL here so it works even if the
 * CORS_ALLOWED_ORIGINS env var is not set on Render.
 */
const HARDCODED_ALLOWED_ORIGINS: readonly string[] = [
  'http://localhost:5173',          // Local Vite dev server
  'https://auto-sure.vercel.app',   // Production frontend on Vercel
];

/**
 * Returns true if the given origin is in the explicit allowlist.
 * Does NOT do wildcard matching — every allowed origin must be listed
 * explicitly to prevent subdomain-takeover abuse.
 */
const isAllowedOrigin = (origin: string): boolean => {
  // Check the hardcoded list first (always present)
  if (HARDCODED_ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  // Then check the runtime env var (supports comma-separated extra origins)
  if (env.CORS_ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  return false;
};

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // ① No Origin header → allow.
    //   Covers: Render health checks, curl, Postman, server-to-server calls.
    //   The `cors` package passes `undefined` (JS value) here, so this guard
    //   is the canonical fix for the "Origin undefined is not allowed" error.
    if (!origin) {
      return callback(null, true);
    }

    // ② Origin is in the explicit allowlist → allow.
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    // ③ Anything else → reject.
    //   The errorHandler catches this Error and returns HTTP 403 (not 500).
    return callback(new Error(`CORS: Origin "${origin}" is not allowed`));
  },

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86_400, // 24 h preflight cache
};
