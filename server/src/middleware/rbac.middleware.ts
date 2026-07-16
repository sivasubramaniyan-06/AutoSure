/**
 * AUTOSURE — Role-Based Access Control Middleware
 *
 * Usage:
 *   router.get('/admin', authenticate, authorize('admin'), handler)
 *   router.get('/review', authenticate, authorize(['officer', 'admin']), handler)
 */

import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../config/logger.config';
import type { AuthenticatedRequest, UserRole } from '../types/express.types';

export function authorize(...allowedRoles: UserRole[] | [UserRole[]]) {
  // Flatten single array arg: authorize(['a','b']) or authorize('a','b')
  const roles = (
    allowedRoles.length === 1 && Array.isArray(allowedRoles[0])
      ? allowedRoles[0]
      : allowedRoles
  ) as UserRole[];

  return (req: Request, _res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
    }

    if (!roles.includes(authReq.user.role as UserRole)) {
      logger.warn(
        `[RBAC] Access denied: uid="${authReq.user.uid}" role="${authReq.user.role}" ` +
        `attempted to access route requiring [${roles.join(', ')}]`
      );
      return next(
        new AppError(
          `Access denied. Required role: ${roles.join(' or ')}`,
          403,
          'RBAC_FORBIDDEN'
        )
      );
    }

    next();
  };
}
