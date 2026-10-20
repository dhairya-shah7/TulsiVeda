import express, { Request, Response } from 'express';
import multer from 'multer';
import { AsrService } from '../services/asrService';
import { IndicTtsService } from '../services/indicTtsService';

const upload = multer({ limits: { fileSize: 15 * 1024 * 1024 } });
const router = express.Router();

/**
 * POST /api/voice/transcribe
 * Voice Extraction powered by AI4Bharat Indic-Transcribe / IndicConformer
 */
router.post('/transcribe', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    const language = (req.body.language || 'gu').toString();
    const clientTranscript = req.body.clientTranscript?.toString();
    const buffer = req.file?.buffer || Buffer.alloc(0);
    const mimeType = req.file?.mimetype || 'audio/webm';

    const result = await AsrService.transcribeAudio(buffer, language, mimeType, clientTranscript);
    return res.json({
      text: result.rawText,
      language: result.language,
      confidence: result.confidence,
      modelVersion: result.modelVersion,
    });
  } catch (error) {
    console.error('[Voice Routes] Transcription error:', error);
    return res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

/**
 * POST /api/voice/synthesize
 * TalkBack powered by AI4Bharat Indic Parler-TTS / Svara-TTS
 */
router.post('/synthesize', async (req: Request, res: Response) => {
  try {
    const { text, language = 'gu', bcp47 = 'gu-IN' } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for TTS synthesis' });
    }

    const ttsResult = await IndicTtsService.synthesizeSpeech(text, language, bcp47);
    if (ttsResult) {
      res.setHeader('Content-Type', ttsResult.contentType);
      return res.send(ttsResult.audioBuffer);
    }

    // If no external model available, notify client to use native Android TTS
    return res.status(204).end();
  } catch (error) {
    console.error('[Voice Routes] TTS error:', error);
    return res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

export default router;
