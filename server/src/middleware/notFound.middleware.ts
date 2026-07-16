/**
 * AUTOSURE — 404 Not Found Middleware
 * Catch-all for unmatched routes.
 */

import type { Request, Response } from 'express';

export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
}
