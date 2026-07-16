/**
 * AUTOSURE — Server Bootstrap
 * Wires up Express with all security middleware, routers, and error handlers.
 */

import express from 'express';
import { env } from './config/env.config';
import { logger } from './config/logger.config';

// Middleware
import { helmetMiddleware } from './middleware/helmet.middleware';
import { corsMiddleware } from './middleware/cors.middleware';
import { generalRateLimiter } from './middleware/rateLimiter.middleware';
import { mongoSanitizeMiddleware, xssCleanMiddleware } from './middleware/sanitize.middleware';
import { requestLoggerMiddleware } from './middleware/requestLogger.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';
import { notFoundMiddleware } from './middleware/notFound.middleware';

// Routes
import appRouter from './routes';

const app = express();

// ─── Trust Proxy ──────────────────────────────────────────────
// Required if running behind a reverse proxy (e.g., Render, Vercel, Nginx)
// to correctly resolve client IP for rate limiting.
if (env.TRUST_PROXY) {
  app.set('trust proxy', 1);
}

// ─── Global Middleware ────────────────────────────────────────

// 1. Security Headers
app.use(helmetMiddleware);

// 2. CORS
app.use(corsMiddleware);

// 3. Body Parsing
app.use(express.json({ limit: '10kb' })); // Restrict payload size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Sanitization (NoSQL Injection & XSS)
app.use(mongoSanitizeMiddleware);
app.use(xssCleanMiddleware);

// 5. Rate Limiting (General)
app.use('/api/v1', generalRateLimiter);

// 6. Request Logging
app.use(requestLoggerMiddleware);

// ─── Routing ──────────────────────────────────────────────────
app.use('/api/v1', appRouter);

// ─── Error Handling ───────────────────────────────────────────
// 404 Catch-all
app.use(notFoundMiddleware);

// Centralized Error Handler (must be last)
app.use(errorHandler);

// ─── Server Startup ───────────────────────────────────────────
const server = app.listen(env.PORT, () => {
  logger.info(
    `[Server] AUTOSURE API running on port ${env.PORT} in ${env.NODE_ENV} mode`
  );
});

// ─── Graceful Shutdown ────────────────────────────────────────
const shutdown = (signal: string) => {
  logger.info(`\n[Server] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('[Server] HTTP server closed.');
    process.exit(0);
  });

  // Force close after 10s
  setTimeout(() => {
    logger.error('[Server] Forcing shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default app;
