/**
 * AUTOSURE — Auth Routes
 */

import { Router } from 'express';
import { register, getMe } from '../controllers/auth.controller';
import { registerValidator } from '../validators/auth.validator';
import { validateRequest } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Protected routes
router.use(authenticate);

// We require auth for register because the client must first create the user in Firebase Auth,
// then send the valid Firebase token to the backend to initialize the custom claims and Firestore document.
router.post('/register', authRateLimiter, registerValidator, validateRequest, asyncHandler(register));

router.get('/me', asyncHandler(getMe));

export default router;
