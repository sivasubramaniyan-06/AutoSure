/**
 * AUTOSURE — Request Sanitization Middleware
 *
 * Applies two layers of sanitization:
 *  1. express-mongo-sanitize — strips $ and . from keys (NoSQL injection)
 *  2. xss-clean              — sanitizes string values against XSS
 */

import mongoSanitize from 'express-mongo-sanitize';
import xssClean from 'xss-clean';

/** NoSQL injection protection */
export const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: '_',           // Replace dangerous chars instead of removing
  onSanitize: ({ req, key }) => {
    // Log sanitization events for security monitoring
    console.warn(`[Sanitize] NoSQL injection attempt detected: key="${key}" ip="${req.ip}"`);
  },
});

/** XSS protection */
export const xssCleanMiddleware = xssClean();
