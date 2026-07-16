/**
 * AUTOSURE — Claims Controller
 */

import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../types/express.types';
import { adminDb } from '../config/firebase.config';
import { cloudinaryService } from '../services/cloudinary.service';
import { geminiService } from '../services/gemini.service';
import { repairCostService } from '../services/repair-cost.service';
import { fraudService } from '../services/fraud.service';
import { AppError } from '../utils/AppError';
import { sendCreated, sendSuccess } from '../utils/response';
import { logger } from '../config/logger.config';

export const submitClaim = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const file = authReq.file;
  if (!file) {
    throw new AppError('Image file is required', 400);
  }

  const { vehicleNumber, vehicleModel, policyNumber, accidentDate } = authReq.body;
  const userId = authReq.user.uid;

  logger.info(`[Claims] Processing new claim submission for user="${userId}"`);

  // 1. Upload image to Cloudinary
  const cloudinaryResult = await cloudinaryService.uploadImageBuffer(file.buffer);

  // 2. Pass image buffer to Gemini Vision for analysis
  const damageAnalysis = await geminiService.analyzeVehicleDamage(file.buffer, file.mimetype);

  // 3. Estimate repair cost
  const estimatedRepairCost = repairCostService.estimateRepairCost(damageAnalysis);

  // 4. Evaluate fraud risk
  const fraudAnalysis = fraudService.evaluateClaimRisk(damageAnalysis, authReq.body);

  // 5. Save all claim data to Firestore
  const claimData = {
    userId,
    vehicleNumber,
    vehicleModel,
    policyNumber,
    accidentDate,
    imageUrl: cloudinaryResult.url,
    cloudinaryPublicId: cloudinaryResult.publicId,
    damageAnalysis,
    estimatedRepairCost,
    fraudScore: fraudAnalysis.fraudScore,
    riskLevel: fraudAnalysis.riskLevel,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await adminDb.collection('claims').add(claimData);
    logger.info(`[Claims] Claim created successfully in Firestore: id="${docRef.id}"`);

    sendCreated(res, 'Claim submitted successfully', {
      id: docRef.id,
      ...claimData,
    });
  } catch (error) {
    logger.error('[Claims] Failed to write claim to Firestore', { error });
    throw new AppError('Failed to save claim data', 500);
  }
};

export const listClaims = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const { role, uid } = authReq.user;
  let query: FirebaseFirestore.Query = adminDb.collection('claims');

  // Enforce access control: customers can only view their own claims
  if (role === 'customer') {
    query = query.where('userId', '==', uid);
  }

  // Parse pagination & filters
  const status = authReq.query.status as string;
  if (status) {
    query = query.where('status', '==', status);
  }

  try {
    const snapshot = await query.get();
    const claims = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    sendSuccess({
      res,
      message: 'Claims retrieved successfully',
      data: claims,
    });
  } catch (error) {
    logger.error('[Claims] Failed to list claims from Firestore', { error });
    throw new AppError('Failed to retrieve claims', 500);
  }
};

export const getClaimById = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const { id } = authReq.params;
  const { role, uid } = authReq.user;

  try {
    const doc = await adminDb.collection('claims').doc(id).get();
    if (!doc.exists) {
      throw new AppError('Claim not found', 404);
    }

    const claim = doc.data();

    // Enforce access control: customer can only get their own claim
    if (role === 'customer' && claim?.userId !== uid) {
      throw new AppError('Forbidden: Access denied to this claim', 403);
    }

    sendSuccess({
      res,
      message: 'Claim retrieved successfully',
      data: { id: doc.id, ...claim },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    logger.error(`[Claims] Failed to retrieve claim id="${id}"`, { error });
    throw new AppError('Failed to retrieve claim details', 500);
  }
};

export const updateClaimStatus = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const { id } = authReq.params;
  const { status } = authReq.body;

  if (!status || !['Pending', 'Approved', 'Rejected', 'Under Review'].includes(status)) {
    throw new AppError('Invalid or missing claim status', 400);
  }

  try {
    const docRef = adminDb.collection('claims').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new AppError('Claim not found', 404);
    }

    await docRef.update({
      status,
      updatedAt: new Date().toISOString(),
    });

    logger.info(`[Claims] Claim status updated: id="${id}" status="${status}"`);

    sendSuccess({
      res,
      message: 'Claim status updated successfully',
      data: { id, status },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    logger.error(`[Claims] Failed to update claim status id="${id}"`, { error });
    throw new AppError('Failed to update claim status', 500);
  }
};
