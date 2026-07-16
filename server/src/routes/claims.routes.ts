/**
 * AUTOSURE — Claims Routes
 */

import { Router } from 'express';
import multer from 'multer';
import { submitClaim, listClaims, getClaimById, updateClaimStatus } from '../controllers/claims.controller';
import { claimIdValidator, claimsQueryValidator } from '../validators/claim.validator';
import { submitClaimSchema } from '../validators/claim.zod';
import { validateRequest, validateZod } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

const router = Router();

// Multer storage in memory for Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only jpg, jpeg, png, and webp images are allowed', 400));
    }
  },
});

// All claims routes require authentication
router.use(authenticate);

// Customer endpoints
// Multer must run BEFORE validateZod so that req.body is populated from the multipart request.
router.post(
  '/',
  authorize('customer'),
  upload.single('image'),
  (req, _res, next) => {
    if (!req.file) {
      return next(new AppError('Damaged vehicle image is required', 400));
    }
    next();
  },
  validateZod(submitClaimSchema),
  asyncHandler(submitClaim)
);

// Shared endpoints (customer views own; officer/admin views all)
router.get('/', claimsQueryValidator, validateRequest, asyncHandler(listClaims));
router.get('/:id', claimIdValidator, validateRequest, asyncHandler(getClaimById));

// Officer/Admin endpoints
router.patch('/:id', authorize('officer', 'admin'), claimIdValidator, validateRequest, asyncHandler(updateClaimStatus));

export default router;
