/**
 * AUTOSURE — Auth Validators
 */

import { body } from 'express-validator';

export const registerValidator = [
  body('displayName')
    .trim()
    .notEmpty().withMessage('Display name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Name contains invalid characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email too long'),

  body('uid')
    .notEmpty().withMessage('UID is required')
    .isString().withMessage('UID must be a string'),

  body('role')
    .optional()
    .isIn(['customer']).withMessage('Invalid role — only "customer" can self-register'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be 8–128 characters'),
];
