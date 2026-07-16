/**
 * AUTOSURE — Admin Controller
 * Implements administrative reporting and user listing operations.
 */

import type { Request, Response } from 'express';
import { adminDb } from '../config/firebase.config';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';

export const listUsers = async (_req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());
    
    sendSuccess({
      res,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error: any) {
    throw new AppError('Failed to list users', 500);
  }
};

export const getStats = async (_req: Request, res: Response) => {
  try {
    const usersSnapshot = await adminDb.collection('users').get();
    const claimsSnapshot = await adminDb.collection('claims').get();

    const totalUsers = usersSnapshot.size;
    const totalClaims = claimsSnapshot.size;

    let fraudFlags = 0;
    let totalEstimatedRepairCost = 0;
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    claimsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.riskLevel === 'HIGH') {
        fraudFlags++;
      }
      totalEstimatedRepairCost += data.estimatedRepairCost || 0;
      
      if (data.status === 'Approved') {
        approvedCount++;
      } else if (data.status === 'Rejected') {
        rejectedCount++;
      } else {
        pendingCount++;
      }
    });

    sendSuccess({
      res,
      message: 'Platform statistics retrieved successfully',
      data: {
        totalUsers,
        totalClaims,
        fraudFlags,
        totalEstimatedRepairCost,
        pendingCount,
        approvedCount,
        rejectedCount,
      },
    });
  } catch (error: any) {
    throw new AppError('Failed to calculate stats', 500);
  }
};
