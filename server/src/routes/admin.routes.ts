/**
 * AUTOSURE — Admin Routes
 */

import { Router } from 'express';
import { listUsers, getStats } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Strict admin-only access
router.use(authenticate, authorize('admin'));

router.get('/users', asyncHandler(listUsers));
router.get('/stats', asyncHandler(getStats));

export default router;
