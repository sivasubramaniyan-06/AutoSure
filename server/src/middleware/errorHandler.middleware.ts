/**
 * AUTOSURE — Central Error Handler Middleware
 *
 * MUST be the last middleware registered in Express.
 * Converts all errors to consistent JSON responses.
 * Never leaks stack traces in production.
 */

import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../config/logger.config';
import { env } from '../config/env.config';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req,
  res,
  _next
) => {
  // ── AppError (our own typed errors) ──────────────────────────
  if (err instanceof AppError) {
    logger.warn(`[Error] ${err.statusCode} ${err.code}: ${err.message}`, {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // ── CORS errors ───────────────────────────────────────────────
  // The `cors` package throws a plain Error (not AppError) when an origin
  // is rejected. Return 403 Forbidden so Render / clients get the right
  // status code instead of a misleading 500.
  const error = err as Error;
  if (error.message?.startsWith('CORS:')) {
    logger.warn(`[CORS] Blocked request: ${error.message}`, {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });

    res.status(403).json({
      success: false,
      message: error.message,
      code: 'CORS_FORBIDDEN',
      statusCode: 403,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // ── Unknown errors ────────────────────────────────────────────
  logger.error(`[Error] Unhandled exception: ${error.message}`, {
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    statusCode: 500,
    // Only expose stack in development
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
    timestamp: new Date().toISOString(),
  });
};
