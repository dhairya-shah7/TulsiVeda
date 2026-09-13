import { createWorker } from 'tesseract.js';
import { config } from '../config/index.js';

export interface ExtractedMedicine {
  brandName: string;
  genericName: string;
  type: string;
  dose: string;
  frequency: string;
  confidence: number;
}

export interface OcrResult {
  rawText: string;
  engineUsed: 'Dots.OCR' | 'Tesseract.js';
  detectedMedicines: ExtractedMedicine[];
}

// Common Indian prescription brand-to-generic mappings
const BRAND_DICTIONARY: Record<string, { generic: string; defaultDose: string; type: string }> = {
  ecosprin: { generic: 'Aspirin', defaultDose: '75 mg', type: 'Tablet' },
  aspirin: { generic: 'Aspirin', defaultDose: '75 mg', type: 'Tablet' },
  dolo: { generic: 'Paracetamol', defaultDose: '650 mg', type: 'Tablet' },
  dolo650: { generic: 'Paracetamol', defaultDose: '650 mg', type: 'Tablet' },
  crocin: { generic: 'Paracetamol', defaultDose: '500 mg', type: 'Tablet' },
  paracetamol: { generic: 'Paracetamol', defaultDose: '500 mg', type: 'Tablet' },
  glycomet: { generic: 'Metformin', defaultDose: '500 mg', type: 'Tablet' },
  metformin: { generic: 'Metformin', defaultDose: '500 mg', type: 'Tablet' },
  warfarin: { generic: 'Warfarin', defaultDose: '5 mg', type: 'Tablet' },
  coumadin: { generic: 'Warfarin', defaultDose: '5 mg', type: 'Tablet' },
  plavix: { generic: 'Clopidogrel', defaultDose: '75 mg', type: 'Tablet' },
  clopilet: { generic: 'Clopidogrel', defaultDose: '75 mg', type: 'Tablet' },
  alprax: { generic: 'Alprazolam', defaultDose: '0.25 mg', type: 'Tablet' },
  alprazolam: { generic: 'Alprazolam', defaultDose: '0.25 mg', type: 'Tablet' },
  augmentin: { generic: 'Amoxicillin + Clavulanic Acid', defaultDose: '625 mg', type: 'Tablet' },
  pan40: { generic: 'Pantoprazole', defaultDose: '40 mg', type: 'Tablet' },
  pantocid: { generic: 'Pantoprazole', defaultDose: '40 mg', type: 'Tablet' },
};

export class OcrService {
  /**
   * Primary OCR with Dots.OCR and automatic fallback to Tesseract.js
   */
  public static async processPrescriptionImage(imageBuffer: Buffer, mimeType: string): Promise<OcrResult> {
    // 1. Try Dots.OCR first
    try {
      const dotsResult = await this.tryDotsOcr(imageBuffer, mimeType);
      if (dotsResult && dotsResult.text.trim().length > 5) {
        console.log('[OCR] Dots.OCR processed successfully');
        const medicines = this.parsePrescriptionText(dotsResult.text);
        return {
          rawText: dotsResult.text,
          engineUsed: 'Dots.OCR',
          detectedMedicines: medicines,
        };
      }
    } catch (err) {
      console.warn('[OCR] Dots.OCR unreachable or failed, falling back to Tesseract OCR:', (err as Error).message);
    }

    // 2. Fallback to local Tesseract.js
    console.log('[OCR] Running Tesseract OCR fallback...');
    const tesseractText = await this.runTesseract(imageBuffer);
    const medicines = this.parsePrescriptionText(tesseractText);

    return {
      rawText: tesseractText,
      engineUsed: 'Tesseract.js',
      detectedMedicines: medicines,
    };
  }

  private static async tryDotsOcr(imageBuffer: Buffer, mimeType: string): Promise<{ text: string } | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.dotsOcr.timeoutMs);

    try {
      const response = await fetch(config.dotsOcr.url, {
        method: 'POST',
        headers: { 'Content-Type': mimeType },
        body: imageBuffer,
        signal: controller.signal,
      });

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as { text?: string };
      return data.text ? { text: data.text } : null;
    } finally {
      clearTimeout(timeout);
    }
  }

  private static async runTesseract(imageBuffer: Buffer): Promise<string> {
    const worker = await createWorker('eng');
    try {
      const ret = await worker.recognize(imageBuffer);
      return ret.data.text || '';
    } finally {
      await worker.terminate();
    }
  }

  public static parsePrescriptionText(text: string): ExtractedMedicine[] {
    const detected: ExtractedMedicine[] = [];
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

    for (const line of lines) {
      const lowerLine = line.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
      const words = lowerLine.split(/\s+/);

      for (const word of words) {
        if (BRAND_DICTIONARY[word]) {
          const entry = BRAND_DICTIONARY[word];
          
          // Regex extract dose if present in line
          const doseMatch = line.match(/(\d+(\.\d+)?\s*(mg|ml|mcg|gm|iu))/i);
          const dose = doseMatch ? doseMatch[0] : entry.defaultDose;

          // Frequency detection: OD, BD, TDS, QDS, 1-0-1, etc.
          let frequency = 'Once Daily (OD)';
          if (/(bd|bid|twice|1-0-1|0-1-1|1-1-0)/i.test(line)) frequency = 'Twice Daily (BD)';
          if (/(tds|tid|thrice|1-1-1)/i.test(line)) frequency = 'Thrice Daily (TDS)';
          if (/(hs|bedtime|0-0-1)/i.test(line)) frequency = 'At Bedtime (HS)';

          const brandTitle = word.charAt(0).toUpperCase() + word.slice(1);

          // Avoid duplicates
          if (!detected.some((m) => m.genericName.toLowerCase() === entry.generic.toLowerCase())) {
            detected.push({
              brandName: brandTitle,
              genericName: entry.generic,
              type: entry.type,
              dose: dose,
              frequency: frequency,
              confidence: 0.92,
            });
          }
        }
      }
    }

    // Default fallback if text was recognized but no specific brand matched
    if (detected.length === 0 && text.trim().length > 0) {
      // Check for generic aspirin/ecosprin patterns
      if (/aspirin|ecosprin/i.test(text)) {
        detected.push({
          brandName: 'Ecosprin',
          genericName: 'Aspirin',
          type: 'Tablet',
          dose: '75 mg',
          frequency: 'Once Daily (OD)',
          confidence: 0.88,
        });
      }
    }

    return detected;
  }
}
