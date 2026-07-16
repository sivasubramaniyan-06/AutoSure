/**
 * AUTOSURE — Claim Types
 */

export type ClaimStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'ai_analyzed'
  | 'approved'
  | 'rejected'
  | 'pending_info';

export type DamageCategory =
  | 'minor'
  | 'moderate'
  | 'severe'
  | 'total_loss';

export type FraudRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
}

export interface AccidentDetails {
  dateOfAccident: string;       // ISO 8601
  location: string;
  description: string;
  policeReportNumber?: string;
  witnesses?: string[];
}

export interface DamageImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  fileName: string;
  fileSize: number;
}

export interface AIAnalysisResult {
  analyzedAt: string;
  damageCategory: DamageCategory;
  estimatedRepairCost: {
    min: number;
    max: number;
    currency: string;
  };
  damagedComponents: string[];
  confidenceScore: number;           // 0–1
  fraudRisk: {
    level: FraudRiskLevel;
    score: number;                   // 0–100
    flags: string[];
    explanation: string;
  };
  aiNotes: string;
  modelVersion: string;
}

export interface ClaimReview {
  officerId: string;
  officerName: string;
  reviewedAt: string;
  decision: 'approved' | 'rejected' | 'pending_info';
  notes: string;
  adjustedAmount?: number;
}

export interface Claim {
  id: string;
  claimNumber: string;              // e.g., "CLM-2025-000123"
  customerId: string;
  customerName: string;
  status: ClaimStatus;
  vehicle: VehicleInfo;
  accident: AccidentDetails;
  images: DamageImage[];
  aiAnalysis?: AIAnalysisResult;
  review?: ClaimReview;
  claimedAmount?: number;
  approvedAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimSubmission {
  vehicle: VehicleInfo;
  accident: AccidentDetails;
  claimedAmount: number;
}

export interface ClaimsFilter {
  status?: ClaimStatus;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
