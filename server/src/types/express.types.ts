/**
 * AUTOSURE — Express Type Augmentation
 * Adds typed user property to Express Request.
 */

import type { Request } from 'express';

export type UserRole = 'customer' | 'officer' | 'admin';

export interface RequestUser {
  uid: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

export interface AuthenticatedRequest extends Request {
  user: RequestUser;
}
