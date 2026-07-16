/**
 * AUTOSURE — Client-side Validators
 * Lightweight validation helpers (not a replacement for server-side validation).
 */

import { z } from 'zod';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, MAX_IMAGE_SIZE_BYTES, ALLOWED_IMAGE_TYPES } from './constants';

// ─── Auth Schemas ─────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    .max(MAX_PASSWORD_LENGTH, 'Password is too long'),
});

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name is too long')
      .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .max(255, 'Email is too long'),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
      .max(MAX_PASSWORD_LENGTH, 'Password is too long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── Claim Schemas ────────────────────────────────────────────

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Vehicle make is required').max(50),
  model: z.string().min(1, 'Vehicle model is required').max(50),
  year: z
    .number()
    .int()
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear() + 1, 'Invalid year'),
  licensePlate: z
    .string()
    .min(1, 'License plate is required')
    .max(20, 'License plate is too long')
    .regex(/^[A-Z0-9\s-]+$/i, 'Invalid license plate format'),
  vin: z.string().length(17, 'VIN must be exactly 17 characters').optional().or(z.literal('')),
  color: z.string().max(30).optional(),
});

export const accidentSchema = z.object({
  dateOfAccident: z
    .string()
    .min(1, 'Date of accident is required')
    .refine((d) => !isNaN(Date.parse(d)), 'Invalid date')
    .refine((d) => new Date(d) <= new Date(), 'Date cannot be in the future'),
  location: z
    .string()
    .min(5, 'Location must be at least 5 characters')
    .max(500, 'Location is too long'),
  description: z
    .string()
    .min(20, 'Please provide at least 20 characters describing the accident')
    .max(2000, 'Description is too long'),
  policeReportNumber: z.string().max(50).optional().or(z.literal('')),
});

export const claimSubmissionSchema = z.object({
  vehicle: vehicleSchema,
  accident: accidentSchema,
  claimedAmount: z
    .number()
    .positive('Claimed amount must be positive')
    .max(10_000_000, 'Claimed amount seems too high'),
});

// ─── File Validators ──────────────────────────────────────────

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `File type "${file.type}" is not allowed. Use JPEG, PNG, WebP, or HEIC.`;
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `File is too large. Maximum size is 10 MB.`;
  }
  return null;
}

// ─── Inferred Types ───────────────────────────────────────────

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ClaimSubmissionFormData = z.infer<typeof claimSubmissionSchema>;
