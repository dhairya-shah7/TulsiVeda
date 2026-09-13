import { Router } from 'express';
import { pool } from '../db/postgres.js';
import { SafetyEngine } from '../services/safetyEngine.js';
import { AuditService } from '../services/auditService.js';

export const safetyRouter = Router();

// POST /api/safety/analyze
// Screen 6: Evidence & Decision - Graph-RAG Safety Engine
safetyRouter.post('/analyze', async (req, res) => {
  try {
    const {
      plantSpecies,
      drugGenericName,
      isClinicianConfirmed,
      remedyId,
      medicineId,
      preparation,
      dose,
    } = req.body;

    // Strict safety invariant check
    if (!isClinicianConfirmed) {
      return res.status(400).json({
        error: 'E_MEDICINE_UNCONFIRMED',
        message: 'The safety engine strictly refuses to run until the medicine has been explicitly confirmed by a qualified clinician.',
      });
    }

    const analysis = await SafetyEngine.analyze({
      plantSpecies: plantSpecies || 'Curcuma longa',
      drugGenericName: drugGenericName || 'Aspirin',
      isClinicianConfirmed: true,
      preparation,
      dose,
    });

    // If remedyId and medicineId are present, persist clinical_alert row
    let alertId = null;
    if (remedyId) {
      const alertRes = await pool.query(
        `INSERT INTO clinical_alerts 
         (remedy_id, medicine_id, plant_scientific_name, drug_generic_name, interaction_type, evidence_level, confidence, graph_path_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          remedyId,
          medicineId || null,
          plantSpecies,
          drugGenericName,
          analysis.interactionType,
          analysis.evidenceLevel,
          analysis.confidence,
          JSON.stringify(analysis.graphPath),
        ]
      );
      alertId = alertRes.rows[0].id;
    }

    res.json({
      alertId,
      ...analysis,
    });
  } catch (err) {
    console.error('[SafetyRoutes] Analysis error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/safety/decision
// Clinician submits decision on Screen 6
safetyRouter.post('/decision', async (req, res) => {
  try {
    const { alertId, remedyId, decision, notes, clinicianId } = req.body;

    if (!decision) {
      return res.status(400).json({ error: 'Clinician decision selection is required' });
    }

    // 1. Insert into clinical_decisions
    const decisionRes = await pool.query(
      `INSERT INTO clinical_decisions 
       (alert_id, remedy_id, decision, notes, clinician_id, rule_version, model_version)
       VALUES ($1, $2, $3, $4, $5, 'RuleEngine-v1.0-deterministic', 'Qwen2.5-Extract-v1')
       RETURNING *`,
      [alertId || null, remedyId || null, decision, notes || null, clinicianId || null]
    );
    const savedDecision = decisionRes.rows[0];

    // 2. Mark remedy as completed in history
    if (remedyId) {
      await pool.query(`UPDATE remedy_records SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [remedyId]);
    }

    // 3. Log cryptographic audit event
    await AuditService.logEvent({
      eventType: 'CLINICAL_DECISION_RECORDED',
      entityType: 'clinical_decisions',
      entityId: savedDecision.id,
      payload: { decision, notes, remedyId, alertId },
    });

    res.json({
      success: true,
      decision: savedDecision,
      message: 'Decision submitted and permanently logged in audit ledger.',
    });
  } catch (err) {
    console.error('[SafetyRoutes] Decision recording error:', err);
    res.status(500).json({ error: 'Failed to record clinician decision' });
  }
});
