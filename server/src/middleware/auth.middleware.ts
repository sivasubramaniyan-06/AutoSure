/**
 * AUTOSURE — Authentication Middleware
 *
 * Verifies Firebase ID tokens on every protected route.
 * Attaches the decoded token payload to req.user.
 */

import type { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../config/firebase.config';
import { AppError } from '../utils/AppError';
import { logger } from '../config/logger.config';
import type { AuthenticatedRequest } from '../types/express.types';

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Missing or invalid Authorization header', 401, 'AUTH_MISSING_TOKEN');
    }

    const idToken = authHeader.split(' ')[1];

    if (!idToken) {
      throw new AppError('No token provided', 401, 'AUTH_NO_TOKEN');
    }

    // Verify with Firebase Admin — throws if token is invalid/expired
    const decodedToken = await adminAuth.verifyIdToken(idToken, /* checkRevoked */ true);

    // Attach decoded user to request
    (req as AuthenticatedRequest).user = {
      uid: decodedToken.uid,
      email: decodedToken.email ?? '',
      role: (decodedToken['role'] as string) ?? 'customer',
      emailVerified: decodedToken.email_verified ?? false,
    };

    next();
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return next(error);
    }

    // Firebase token errors
    const firebaseError = error as { code?: string; message?: string };
    logger.warn(`[Auth] Token verification failed: ${firebaseError.message ?? 'Unknown error'}`);

    if (firebaseError.code === 'auth/id-token-expired') {
      return next(new AppError('Token has expired', 401, 'AUTH_TOKEN_EXPIRED'));
    }
    if (firebaseError.code === 'auth/id-token-revoked') {
      return next(new AppError('Token has been revoked', 401, 'AUTH_TOKEN_REVOKED'));
    }

    next(new AppError('Authentication failed', 401, 'AUTH_FAILED'));
  }
}
