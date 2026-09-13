import fs from 'fs';
import path from 'path';

export interface TranscriptionResult {
  rawText: string;
  language: string;
  confidence: number;
  durationSeconds: number;
  modelVersion: string;
}

export class AsrService {
  /**
   * Transcribe incoming audio recording (WAV/WebM) from ASHA field worker
   */
  public static async transcribeAudio(
    audioBuffer: Buffer,
    language: string = 'gu',
    mimeType: string = 'audio/webm',
    clientTranscript?: string
  ): Promise<TranscriptionResult> {
    const durationEstimate = Math.max(1.5, Math.round((audioBuffer.length / 32000) * 10) / 10);
    
    // If client device speech recognition already provided transcript, use it with high confidence
    if (clientTranscript && clientTranscript.trim().length > 0) {
      return {
        rawText: clientTranscript.trim(),
        language: language === 'gu' ? 'gu' : (language === 'hi' ? 'hi' : 'en'),
        confidence: 0.94,
        durationSeconds: durationEstimate,
        modelVersion: 'IndicSpeech-MobileEngine',
      };
    }

    // In production, invokes local or containerized IndicWhisper / Whisper ASR endpoint
    const asrEndpoint = process.env.INDIC_WHISPER_URL;
    if (asrEndpoint) {
      try {
        const res = await fetch(asrEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': mimeType, 'X-Language': language },
          body: audioBuffer,
        });
        if (res.ok) {
          const json = await res.json() as { text: string; confidence?: number };
          return {
            rawText: json.text,
            language,
            confidence: json.confidence || 0.89,
            durationSeconds: durationEstimate,
            modelVersion: 'IndicWhisper-v1-FineTuned',
          };
        }
      } catch (err) {
        console.warn('[ASR] Remote IndicWhisper error:', err);
      }
    }

    // If no external ASR service and no client transcript, return empty or generic prompt
    return {
      rawText: '',
      language: language === 'gu' ? 'gu' : 'en',
      confidence: 0.0,
      durationSeconds: durationEstimate,
      modelVersion: 'IndicWhisper-AwaitingInput',
    };
  }
}
