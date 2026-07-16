/**
 * AUTOSURE — Main Router
 */

import { Router, type Request, type Response } from 'express';
import authRoutes from './auth.routes';
import claimsRoutes from './claims.routes';
import usersRoutes from './users.routes';
import adminRoutes from './admin.routes';
import { sendSuccess } from '../utils/response';

const router = Router();

// Health check endpoint (public)
router.get('/health', (_req: Request, res: Response) => {
  sendSuccess({ res, message: 'AUTOSURE API is healthy' });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/claims', claimsRoutes);
router.use('/users', usersRoutes);
router.use('/admin', adminRoutes);

export default router;
