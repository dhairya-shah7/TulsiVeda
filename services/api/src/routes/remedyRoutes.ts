import { Router } from 'express';
import multer from 'multer';
import { pool } from '../db/postgres.js';
import { AsrService } from '../services/asrService.js';
import { ExtractionService } from '../services/extractionService.js';
import { AuditService } from '../services/auditService.js';

export const remedyRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// POST /api/remedies/voice
// Ingests live audio recording from mobile microphone
remedyRouter.post('/voice', upload.single('audio'), async (req, res) => {
  try {
    const file = req.file;
    const language = (req.body.language as string) || 'gu';

    if (!file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const clientTranscript = req.body.transcript as string | undefined;

    // 1. Run IndicWhisper ASR
    const asrResult = await AsrService.transcribeAudio(file.buffer, language, file.mimetype, clientTranscript);

    // 2. Persist audio and transcript to PostgreSQL
    const audioRes = await pool.query(
      `INSERT INTO audio_records (file_name, file_size_bytes, mime_type, duration_seconds)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [file.originalname || 'mic_recording.webm', file.size, file.mimetype, asrResult.durationSeconds]
    );
    const audioId = audioRes.rows[0].id;

    const transcriptRes = await pool.query(
      `INSERT INTO transcripts (audio_id, language, raw_text, confidence, model_version)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [audioId, asrResult.language, asrResult.rawText, asrResult.confidence, asrResult.modelVersion]
    );
    const transcriptId = transcriptRes.rows[0].id;

    // 3. Log audit
    await AuditService.logEvent({
      eventType: 'AUDIO_RECORDED_AND_TRANSCRIBED',
      entityType: 'audio_records',
      entityId: audioId,
      payload: { language, duration: asrResult.durationSeconds, confidence: asrResult.confidence },
    });

    res.json({
      audioId,
      transcriptId,
      transcript: asrResult.rawText,
      confidence: asrResult.confidence,
      language: asrResult.language,
    });
  } catch (err) {
    console.error('[RemedyRoutes] Voice transcription error:', err);
    res.status(500).json({ error: 'Failed to process audio recording' });
  }
});

// POST /api/remedies/basic-details
// Saves basic details from Screen 2 (Remedy Intake)
remedyRouter.post('/basic-details', async (req, res) => {
  try {
    const { remedyNameLocal, usedForCondition, preparedBy, placeRegion, language, audioId, transcriptId } = req.body;

    const result = await pool.query(
      `INSERT INTO remedy_records 
       (remedy_name_local, used_for_condition, prepared_by, place_region, language, audio_id, transcript_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft')
       RETURNING *`,
      [
        remedyNameLocal || null,
        usedForCondition || null,
        preparedBy || null,
        placeRegion || null,
        language || 'Gujarati',
        audioId || null,
        transcriptId || null,
      ]
    );

    const remedy = result.rows[0];

    await AuditService.logEvent({
      eventType: 'REMEDY_DRAFT_CREATED',
      entityType: 'remedy_records',
      entityId: remedy.id,
      payload: { remedyNameLocal, usedForCondition, placeRegion },
    });

    res.json({ remedy });
  } catch (err) {
    console.error('[RemedyRoutes] Save basic details error:', err);
    res.status(500).json({ error: 'Failed to save remedy basic details' });
  }
});

// POST /api/remedies/extract
// Structured 9-field extraction (Screen 3)
remedyRouter.post('/extract', async (req, res) => {
  try {
    const { remedyId, transcript, remedyNameHint } = req.body;

    const extracted = await ExtractionService.extractRemedyFields(transcript || '', remedyNameHint);

    // If remedyId provided, persist to plant_observations table
    let observationId = null;
    if (remedyId) {
      const obsRes = await pool.query(
        `INSERT INTO plant_observations 
         (remedy_id, vernacular_name, plant_part, preparation, dose, frequency, duration, route, claimed_use, notes, extraction_confidence, requires_review, raw_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING id`,
        [
          remedyId,
          extracted.localName,
          extracted.partsUsed,
          extracted.preparation,
          extracted.dose,
          extracted.frequency,
          extracted.duration,
          extracted.route,
          extracted.usedForCondition,
          extracted.notes,
          extracted.confidence,
          extracted.requiresReview,
          extracted,
        ]
      );
      observationId = obsRes.rows[0].id;

      await pool.query(`UPDATE remedy_records SET status = 'extracted' WHERE id = $1`, [remedyId]);
    }

    res.json({
      observationId,
      extractedDetails: extracted,
    });
  } catch (err) {
    console.error('[RemedyRoutes] Extraction error:', err);
    res.status(500).json({ error: 'Failed to extract structured remedy fields' });
  }
});
