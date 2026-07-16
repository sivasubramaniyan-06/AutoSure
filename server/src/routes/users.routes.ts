/**
 * AUTOSURE — Users Routes
 */

import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/profile', asyncHandler(getProfile));
router.patch('/profile', asyncHandler(updateProfile));

export default router;
