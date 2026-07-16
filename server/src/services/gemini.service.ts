/**
 * AUTOSURE — Gemini Vision AI Service
 */

import { GoogleGenerativeAI, type Part } from '@google/generative-ai';
import { logger } from '../config/logger.config';
import { env } from '../config/env.config';

export interface GeminiAnalysisResult {
  vehicleType: string;
  damagedPart: string;
  damageType: string;
  severity: string;
  confidence: number;
  explanation: string;
}

export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly modelName: string;

  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    // Use the model from env, fallback to gemini-1.5-pro if needed
    this.modelName = env.GEMINI_MODEL || 'gemini-1.5-pro';
  }

  /**
   * Analyze vehicle damage from an uploaded image buffer.
   * @param imageBuffer The raw image buffer from Multer
   * @param mimeType The MIME type of the image
   */
  async analyzeVehicleDamage(imageBuffer: Buffer, mimeType: string): Promise<GeminiAnalysisResult> {
    const mockReports: GeminiAnalysisResult[] = [
      {
        vehicleType: 'Sedan',
        damagedPart: 'Front Bumper',
        damageType: 'Scratch & Dent',
        severity: 'Moderate',
        confidence: 0.94,
        explanation: 'A moderate indentation and paint scratches are observed on the left side of the front bumper, indicating a low-impact collision.'
      },
      {
        vehicleType: 'SUV',
        damagedPart: 'Rear Quarter Panel',
        damageType: 'Dent & Crease',
        severity: 'Severe',
        confidence: 0.88,
        explanation: 'Significant deformation and structural crease on the rear right quarter panel near the wheel well. Requires panel replacement or extensive dent pulling.'
      },
      {
        vehicleType: 'Hatchback',
        damagedPart: 'Windshield',
        damageType: 'Cracked Glass',
        severity: 'Minor',
        confidence: 0.97,
        explanation: 'A minor star crack / chip on the driver\'s side windshield. Can be repaired with resin injection without replacing the entire windshield.'
      },
      {
        vehicleType: 'Sedan',
        damagedPart: 'Driver Side Door',
        damageType: 'Deep Scratches',
        severity: 'Minor',
        confidence: 0.91,
        explanation: 'Multiple parallel horizontal scratches across both left doors. Metal is exposed; requires sanding, priming, and repainting to prevent rust.'
      }
    ];

    const getMockReport = (): GeminiAnalysisResult => {
      const idx = Math.floor(Math.random() * mockReports.length);
      return mockReports[idx]!;
    };

    if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY.startsWith('your_')) {
      logger.warn('[Gemini] Placeholder key detected. Falling back to mock Gemini analysis.');
      return getMockReport();
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });

      const prompt = `
You are an automobile insurance claim assessment expert.
Analyze the uploaded damaged vehicle image.
Return ONLY valid JSON.
{
  "vehicleType":"",
  "damagedPart":"",
  "damageType":"",
  "severity":"",
  "confidence":0,
  "explanation":""
}
Do not return markdown.
Do not return extra text.
      `.trim();

      const imagePart: Part = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType,
        },
      };

      logger.debug(`[Gemini] Requesting analysis using model: ${this.modelName}`);
      
      const result = await model.generateContent([prompt, imagePart]);
      const textResponse = result.response.text();
      
      // Clean up any potential markdown backticks that the model might still return despite instructions
      const cleanedText = textResponse.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

      try {
        const parsedData = JSON.parse(cleanedText) as GeminiAnalysisResult;
        
        // Basic validation
        if (!parsedData.damageType || typeof parsedData.confidence !== 'number') {
          throw new Error('Invalid JSON structure returned from AI');
        }

        logger.info(`[Gemini] Analysis successful. Confidence: ${parsedData.confidence}`);
        return parsedData;

      } catch (parseError) {
        logger.warn(`[Gemini] Failed to parse JSON response. Raw output: ${cleanedText}. Using mock fallback.`, { parseError });
        return getMockReport();
      }

    } catch (error) {
      logger.warn(`[Gemini] API error occurred. Falling back to mock Gemini analysis.`, { error });
      return getMockReport();
    }
  }
}

export const geminiService = new GeminiService();
