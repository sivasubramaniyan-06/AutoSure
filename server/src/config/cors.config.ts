/**
 * AUTOSURE — CORS Configuration
 */

import type { CorsOptions } from 'cors';
import { env } from './env.config';

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow server-to-server requests (no origin) in development only
    if (!origin && env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    if (origin && env.CORS_ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin "${origin}" is not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86_400, // 24h preflight cache
};
