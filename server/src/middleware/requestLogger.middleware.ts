/**
 * AUTOSURE — Request Logger Middleware
 * Uses Morgan with Winston as the stream target.
 */

import morgan from 'morgan';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';

// Skip health check from logs
const skip = (req: import('express').Request) =>
  req.path === '/api/v1/health';

const format =
  env.NODE_ENV === 'production'
    ? ':remote-addr :method :url :status :res[content-length] - :response-time ms'
    : ':method :url :status :response-time ms - :res[content-length]';

export const requestLoggerMiddleware = morgan(format, {
  stream: { write: (message) => logger.http(message.trimEnd()) },
  skip,
});
