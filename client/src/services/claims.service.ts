/**
 * AUTOSURE — Claims Service
 * All operations are stubs — business logic implemented in Phase 2.
 */

import api from './api';
import type { Claim, ClaimSubmission, ClaimsFilter } from '@/types/claim.types';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

// ─── Claims CRUD ──────────────────────────────────────────────

export async function submitClaim(
  payload: FormData
): Promise<ApiResponse<Claim>> {
  const { data } = await api.post<ApiResponse<Claim>>('/claims', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

export async function getClaims(
  filters?: ClaimsFilter
): Promise<ApiResponse<Claim[]>> {
  const { data } = await api.get<ApiResponse<Claim[]>>('/claims', {
    params: filters,
  });
  return data;
}

export async function getClaimById(id: string): Promise<ApiResponse<Claim>> {
  const { data } = await api.get<ApiResponse<Claim>>(`/claims/${id}`);
  return data;
}

export async function updateClaimStatus(
  id: string,
  update: { status: string; notes?: string; adjustedAmount?: number }
): Promise<ApiResponse<Claim>> {
  const { data } = await api.patch<ApiResponse<Claim>>(`/claims/${id}`, update);
  return data;
}

export async function uploadClaimImages(
  _claimId: string,
  _files: File[]
): Promise<ApiResponse<{ urls: string[] }>> {
  throw new Error('Not implemented');
}
