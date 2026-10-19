import { Router } from 'express';
import multer from 'multer';
import { pool } from '../db/postgres.js';
import { PlantService } from '../services/plantService.js';
import { AuditService } from '../services/auditService.js';

export const plantRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

// POST /api/plants/resolve
// Ranked candidate resolution via Qdrant/CLIP (Screen 4)
plantRouter.post('/resolve', upload.single('image'), async (req, res) => {
  try {
    const vernacularName = req.body.vernacularName as string;
    const observationId = req.body.observationId as string;
    const file = req.file;

    const candidates = await PlantService.resolveCandidates(vernacularName, !!file?.buffer);

    // If observationId exists, persist candidate rows
    if (observationId) {
      for (const c of candidates) {
        await pool.query(
          `INSERT INTO candidate_species 
           (observation_id, scientific_name, similarity_score, rank_order, expert_status)
           VALUES ($1, $2, $3, $4, $5)`,
          [observationId, c.scientificName, c.confidenceScore, c.rank, c.expertStatus]
        );
      }
    }

    res.json({ candidates });
  } catch (err) {
    console.error('[PlantRoutes] Resolve error:', err);
    res.status(500).json({ error: 'Failed to resolve botanical candidates' });
  }
});

// POST /api/plants/confirm
// Expert confirmation of botanical identity
plantRouter.post('/confirm', async (req, res) => {
  try {
    const { observationId, scientificName, status, expertNotes, remedyId } = req.body;

    if (observationId && scientificName) {
      await pool.query(
        `UPDATE candidate_species 
         SET expert_status = $1, expert_notes = $2, verified_at = CURRENT_TIMESTAMP
         WHERE observation_id = $3 AND scientific_name = $4`,
        [status || 'confirmed', expertNotes || 'Confirmed by botanical expert review', observationId, scientificName]
      );
    }

    if (remedyId) {
      await pool.query(`UPDATE remedy_records SET status = 'identified' WHERE id = $1`, [remedyId]);
    }

    await AuditService.logEvent({
      eventType: 'BOTANICAL_CANDIDATE_VERIFIED',
      entityType: 'candidate_species',
      payload: { scientificName, status, expertNotes },
    });

    res.json({ success: true, confirmedSpecies: scientificName, status });
  } catch (err) {
    console.error('[PlantRoutes] Confirmation error:', err);
    res.status(500).json({ error: 'Failed to confirm botanical candidate' });
  }
});
