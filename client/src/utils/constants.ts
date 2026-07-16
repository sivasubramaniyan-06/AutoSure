/**
 * AUTOSURE — Application Constants
 */

// ─── API ──────────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
export const API_VERSION = 'v1';
export const API_TIMEOUT_MS = 30_000;

// ─── Auth ─────────────────────────────────────────────────────
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const TOKEN_STORAGE_KEY = 'autosure_token';
export const USER_STORAGE_KEY = 'autosure_user';

// ─── Claim ────────────────────────────────────────────────────
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
export const MAX_IMAGES_PER_CLAIM = 10;

export const CLAIM_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  ai_analyzed: 'AI Analyzed',
  approved: 'Approved',
  rejected: 'Rejected',
  pending_info: 'Pending Info',
};

export const CLAIM_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-500/20 text-slate-400',
  submitted: 'bg-blue-500/20 text-blue-400',
  under_review: 'bg-yellow-500/20 text-yellow-400',
  ai_analyzed: 'bg-purple-500/20 text-purple-400',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
  pending_info: 'bg-orange-500/20 text-orange-400',
};

export const FRAUD_RISK_COLORS: Record<string, string> = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

// ─── Pagination ───────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50];

// ─── Routes ───────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  DASHBOARD: '/dashboard',
  CUSTOMER_DASHBOARD: '/dashboard/customer',
  OFFICER_DASHBOARD: '/dashboard/officer',
  ADMIN_DASHBOARD: '/dashboard/admin',
  CLAIMS: '/claims',
  CLAIM_SUBMIT: '/claims/submit',
  CLAIM_DETAIL: '/claims/:id',
  PROFILE: '/profile',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
} as const;

// ─── Roles ────────────────────────────────────────────────────
export const ROLES = {
  CUSTOMER: 'customer',
  OFFICER: 'officer',
  ADMIN: 'admin',
} as const;
