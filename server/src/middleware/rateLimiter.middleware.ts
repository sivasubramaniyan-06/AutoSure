/**
 * AUTOSURE — Rate Limiter Middleware
 *
 * Two limiters:
 *  1. General  — applies to all /api/v1 routes
 *  2. Auth     — stricter limit on /api/v1/auth to prevent brute-force
 */

import rateLimit from 'express-rate-limit';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';

const rateLimitHandler = (
  _req: import('express').Request,
  res: import('express').Response
) => {
  logger.warn(`[RateLimit] Limit exceeded from ${_req.ip}`);
  res.status(429).json({
    success: false,
    message: 'Too many requests. Please try again later.',
    statusCode: 429,
    timestamp: new Date().toISOString(),
  });
};

/** General rate limiter — 100 req / 15 min */
export const generalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,        // Return RateLimit-* headers
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: rateLimitHandler,
  keyGenerator: (req) => req.ip ?? 'unknown',
});

/** Auth rate limiter — 10 req / 15 min */
export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator: (req) => req.ip ?? 'unknown',
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait before trying again.',
    statusCode: 429,
    timestamp: new Date().toISOString(),
  },
});
