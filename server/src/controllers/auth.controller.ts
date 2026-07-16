/**
 * AUTOSURE — Auth Controller
 */

import type { Request, Response } from 'express';
import { sendSuccess, sendCreated } from '../utils/response';
import { AppError } from '../utils/AppError';
import type { AuthenticatedRequest } from '../types/express.types';
import { firebaseAdminService } from '../services/firebase-admin.service';
import { logger } from '../config/logger.config';

export const register = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const { displayName, email, role } = req.body;
  const uid = authReq.user.uid;

  // Security check: Only admins can assign roles other than 'customer'
  // In a real app, this endpoint might just hardcode 'customer' if it's a public sign-up.
  const assignedRole = role === 'customer' ? 'customer' : 'customer'; // Force customer for self-registration

  try {
    // 1. Set the custom claim on the Firebase Auth user
    await firebaseAdminService.setUserRole(uid, assignedRole);

    // 2. Create the user document in Firestore
    const userDocRef = firebaseAdminService.getDocRef('users', uid);
    await userDocRef.set({
      uid,
      name: displayName,
      email,
      role: assignedRole,
      createdAt: new Date().toISOString(),
    });

    logger.info(`[Auth] Initialized new user: uid="${uid}" role="${assignedRole}"`);

    sendCreated(res, 'User initialized successfully', {
      uid,
      role: assignedRole,
    });
  } catch (error) {
    logger.error(`[Auth] Failed to initialize user ${uid}`, { error });
    throw new AppError('Failed to initialize user', 500);
  }
};

export const getMe = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  
  // Return the user data populated by the authenticate middleware
  sendSuccess({
    res,
    message: 'User profile retrieved successfully',
    data: authReq.user,
  });
};
