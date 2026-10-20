import fs from 'fs';
import path from 'path';

export interface IndicTtsResult {
  audioBuffer: Buffer;
  contentType: string;
  durationEstimateSeconds: number;
}

export class IndicTtsService {
  /**
   * Synthesize speech using AI4Bharat Indic Parler-TTS or Svara-TTS endpoint.
   * If remote endpoint is not configured, provides a clean fallback audio or passes through.
   */
  public static async synthesizeSpeech(
    text: string,
    language: string = 'gu',
    bcp47: string = 'gu-IN'
  ): Promise<IndicTtsResult | null> {
    const ttsEndpoint = process.env.INDIC_TTS_URL;

    if (ttsEndpoint) {
      try {
        const res = await fetch(ttsEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            language,
            bcp47,
            voice_style: 'clinical_natural',
          }),
        });

        if (res.ok) {
          const arrayBuf = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuf);
          return {
            audioBuffer: buffer,
            contentType: res.headers.get('content-type') || 'audio/wav',
            durationEstimateSeconds: Math.max(1, text.length / 15),
          };
        }
      } catch (err) {
        console.warn('[IndicTtsService] Remote synthesis error:', err);
      }
    }

    return null;
  }
}
