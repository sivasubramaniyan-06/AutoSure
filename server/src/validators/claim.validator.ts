/**
 * AUTOSURE — Claim Validators
 */

import { body, param, query } from 'express-validator';

const currentYear = new Date().getFullYear();

export const submitClaimValidator = [
  // Vehicle
  body('vehicle.make')
    .trim().notEmpty().withMessage('Vehicle make is required')
    .isLength({ max: 50 }).withMessage('Make too long'),
  body('vehicle.model')
    .trim().notEmpty().withMessage('Vehicle model is required')
    .isLength({ max: 50 }).withMessage('Model too long'),
  body('vehicle.year')
    .isInt({ min: 1900, max: currentYear + 1 }).withMessage(`Year must be between 1900 and ${currentYear + 1}`),
  body('vehicle.licensePlate')
    .trim().notEmpty().withMessage('License plate is required')
    .isLength({ max: 20 }).withMessage('License plate too long')
    .matches(/^[A-Z0-9\s-]+$/i).withMessage('Invalid license plate format'),
  body('vehicle.vin')
    .optional({ values: 'falsy' })
    .isLength({ min: 17, max: 17 }).withMessage('VIN must be exactly 17 characters'),

  // Accident
  body('accident.dateOfAccident')
    .notEmpty().withMessage('Date of accident is required')
    .isISO8601().withMessage('Invalid date format (use ISO 8601)')
    .custom((v: string) => new Date(v) <= new Date()).withMessage('Date cannot be in the future'),
  body('accident.location')
    .trim().notEmpty().withMessage('Location is required')
    .isLength({ min: 5, max: 500 }).withMessage('Location must be 5–500 characters'),
  body('accident.description')
    .trim().notEmpty().withMessage('Description is required')
    .isLength({ min: 20, max: 2000 }).withMessage('Description must be 20–2000 characters'),
  body('accident.policeReportNumber')
    .optional({ values: 'falsy' })
    .isLength({ max: 50 }).withMessage('Police report number too long'),

  // Amount
  body('claimedAmount')
    .isFloat({ min: 0.01, max: 10_000_000 }).withMessage('Claimed amount must be between $0.01 and $10,000,000'),
];

export const claimIdValidator = [
  param('id')
    .notEmpty().withMessage('Claim ID is required')
    .isString().withMessage('Claim ID must be a string')
    .isLength({ max: 128 }).withMessage('Claim ID too long'),
];

export const claimsQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100')
    .toInt(),
  query('status')
    .optional()
    .isIn([
      'draft', 'submitted', 'under_review', 'ai_analyzed',
      'approved', 'rejected', 'pending_info'
    ]).withMessage('Invalid status filter'),
];
