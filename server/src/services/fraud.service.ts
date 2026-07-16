/**
 * AUTOSURE — Fraud Detection Engine
 * A lightweight rule-based engine to evaluate claim risk.
 */

import { logger } from '../config/logger.config';
import type { GeminiAnalysisResult } from './gemini.service';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface FraudAnalysis {
  fraudScore: number;
  riskLevel: RiskLevel;
}

export class FraudService {
  /**
   * Evaluate fraud risk based on metadata and AI analysis
   */
  evaluateClaimRisk(analysis: GeminiAnalysisResult, _metadata: any): FraudAnalysis {
    let score = 0;

    // 1. Suspicious Confidence Check
    if (analysis.confidence < 0.5) {
      score += 40; // High chance the image isn't a clear vehicle damage
    } else if (analysis.confidence < 0.7) {
      score += 20;
    }

    // 2. Metadata / Anomaly Checks (Placeholder for future rules)
    // Example: multiple claims within short period, invalid EXIF data, etc.
    // For this lightweight version, we will just simulate a rule.
    
    // Cap score at 100
    score = Math.min(score, 100);

    let riskLevel: RiskLevel = 'LOW';
    if (score >= 60) {
      riskLevel = 'HIGH';
    } else if (score >= 30) {
      riskLevel = 'MEDIUM';
    }

    logger.debug(`[FraudEngine] Risk evaluated: Score=${score}, Level=${riskLevel}`);

    return {
      fraudScore: score,
      riskLevel,
    };
  }
}

export const fraudService = new FraudService();
