/**
 * AUTOSURE — Repair Cost Engine
 * A simple rule-based engine to estimate repair costs in INR (₹).
 */

import { logger } from '../config/logger.config';
import type { GeminiAnalysisResult } from './gemini.service';

export class RepairCostService {
  /**
   * Estimate repair cost based on AI analysis
   */
  estimateRepairCost(analysis: GeminiAnalysisResult): number {
    const { damageType, severity } = analysis;
    const type = damageType.toLowerCase();
    const sev = severity.toLowerCase();

    let baseCost = 0;

    // Base cost by damage type
    if (type.includes('scratch')) {
      baseCost = 3000;
    } else if (type.includes('dent')) {
      baseCost = 8000;
    } else if (type.includes('headlight') || type.includes('light')) {
      baseCost = 12000;
    } else if (type.includes('bumper')) {
      baseCost = 15000;
    } else if (type.includes('heavy') || type.includes('structural')) {
      baseCost = 35000;
    } else {
      baseCost = 10000; // Default unknown damage base
    }

    // Multiplier by severity
    let multiplier = 1;
    if (sev.includes('minor') || sev.includes('low')) {
      multiplier = 1;
    } else if (sev.includes('moderate') || sev.includes('medium')) {
      multiplier = 1.5;
    } else if (sev.includes('severe') || sev.includes('high')) {
      multiplier = 2.5;
    } else if (sev.includes('total') || sev.includes('extreme')) {
      multiplier = 5;
    }

    const estimatedCost = Math.round(baseCost * multiplier);
    
    logger.debug(`[RepairCostEngine] Estimated ₹${estimatedCost} (Base: ${baseCost}, Multiplier: ${multiplier})`);
    
    return estimatedCost;
  }
}

export const repairCostService = new RepairCostService();
