/**
 * AUTOSURE — CORS Configuration
 */

import type { CorsOptions } from 'cors';
import { env } from './env.config';

const isAllowedOrigin = (origin: string) => {
  if (env.CORS_ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  try {
    const { hostname, protocol } = new URL(origin);

    if (protocol !== 'https:' && protocol !== 'http:') {
      return false;
    }

    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.vercel.app') ||
      hostname.endsWith('.onrender.com')
    );
  } catch {
    return false;
  }
};

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow server-to-server requests (no origin) in development only
    if (!origin && env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    if (origin && isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin "${origin}" is not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86_400, // 24h preflight cache
};
