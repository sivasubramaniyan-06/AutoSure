/**
 * AUTOSURE — Validation Middleware
 *
 * Runs express-validator checks and returns a structured 422 response
 * if any validation fails. Placed after schema validators in route definitions.
 */

import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { z } from 'zod';

export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : err.type,
        message: err.msg,
        value: err.type === 'field' ? err.value : undefined,
      })),
      statusCode: 422,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
}

export const validateZod = (schema: z.ZodSchema) => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
      statusCode: 422,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  req.body = result.data;
  next();
};
