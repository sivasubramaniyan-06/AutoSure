/**
 * AUTOSURE — Formatting Utilities
 */

import { CLAIM_STATUS_LABELS, CLAIM_STATUS_COLORS, FRAUD_RISK_COLORS } from './constants';
import type { ClaimStatus, FraudRiskLevel } from '@/types/claim.types';

// ─── Date & Time ──────────────────────────────────────────────

export function formatDate(isoString: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(new Date(isoString));
}

export function formatDateTime(isoString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
}

export function formatRelativeTime(isoString: string): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diffMs = new Date(isoString).getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, 'hour');
  return rtf.format(diffDay, 'day');
}

// ─── Currency ─────────────────────────────────────────────────

export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyRange(min: number, max: number, currency = 'USD'): string {
  return `${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}`;
}

// ─── Claim ────────────────────────────────────────────────────

export function getClaimStatusLabel(status: ClaimStatus): string {
  return CLAIM_STATUS_LABELS[status] ?? status;
}

export function getClaimStatusClass(status: ClaimStatus): string {
  return CLAIM_STATUS_COLORS[status] ?? 'bg-slate-500/20 text-slate-400';
}

export function getFraudRiskClass(level: FraudRiskLevel): string {
  return FRAUD_RISK_COLORS[level] ?? 'text-slate-400';
}

// ─── File Size ────────────────────────────────────────────────

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

// ─── Text ─────────────────────────────────────────────────────

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── Numbers ──────────────────────────────────────────────────

export function formatPercentage(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
