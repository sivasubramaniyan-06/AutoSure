/**
 * AUTOSURE — Winston Logger Configuration
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { env } from './env.config';

const { combine, timestamp, colorize, printf, json, errors } = winston.format;

// ─── Custom format for console ────────────────────────────────
const consoleFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack ?? message}`;
});

// ─── Transports ───────────────────────────────────────────────
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'HH:mm:ss' }),
      errors({ stack: true }),
      consoleFormat
    ),
  }),
];

// Add file rotation in non-test environments
if (env.NODE_ENV !== 'test') {
  transports.push(
    new DailyRotateFile({
      dirname: path.resolve(env.LOG_DIR),
      filename: 'autosure-%DATE%-combined.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
    new DailyRotateFile({
      dirname: path.resolve(env.LOG_DIR),
      filename: 'autosure-%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d',
      format: combine(timestamp(), errors({ stack: true }), json()),
    })
  );
}

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  transports,
  exitOnError: false,
});
