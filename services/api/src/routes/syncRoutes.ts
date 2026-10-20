import { Router, Request, Response } from 'express';
import { pool } from '../db/postgres.js';
import { AuditService } from '../services/auditService.js';
import { SafetyEngine } from '../services/safetyEngine.js';

export const syncRouter = Router();

export interface OfflineSyncItem {
  clientRecordId: string;
  patientName?: string;
  remedyNameLocal: string;
  scientificName?: string;
  usedForCondition?: string;
  confirmedMedicine?: string;
  preparation?: string;
  dose?: string;
  frequency?: string;
  duration?: string;
  placeRegion?: string;
  notes?: string;
  recordedAt: string;
  syncTimestamp: string;
  reporterRole?: 'citizen' | 'asha' | 'doctor';
}

/**
 * POST /api/sync/batch
 * Ingests offline records collected by ASHA workers or rural citizens.
 * Automatically analyzes herb-drug safety, logs audits, and persists to Postgres.
 */
syncRouter.post('/batch', async (req: Request, res: Response) => {
  try {
    const { items, deviceId, reporterId } = req.body as {
      items: OfflineSyncItem[];
      deviceId?: string;
      reporterId?: string;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Sync batch requires a non-empty items array' });
    }

    const syncedResults: any[] = [];
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (const item of items) {
        // 1. Analyze clash if both herb and modern medicine are present
        let safetyAnalysis: any = null;
        let interactionType: string | null = null;
        let isSafe = true;

        if (item.remedyNameLocal && item.confirmedMedicine) {
          try {
            safetyAnalysis = await SafetyEngine.analyze({
              plantSpecies: item.scientificName || item.remedyNameLocal,
              drugGenericName: item.confirmedMedicine,
              isClinicianConfirmed: true,
              preparation: item.preparation,
              dose: item.dose,
            });
            interactionType = safetyAnalysis.interactionType || null;
            isSafe = !safetyAnalysis.hasClash;
          } catch (e) {
            console.warn('[Sync Engine] Safety check warning for item:', item.clientRecordId, e);
          }
        }

        // 2. Insert into remedies table
        const remedyRes = await client.query(
          `INSERT INTO remedies 
           (local_name, parts_used, preparation, dose, frequency, duration, route, used_for_condition, notes, requires_review, confidence)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING id, created_at`,
          [
            item.remedyNameLocal,
            'Not Extracted',
            item.preparation || 'Traditional preparation',
            item.dose || 'Standard intake',
            item.frequency || 'Daily',
            item.duration || 'Short-term',
            'Oral',
            item.usedForCondition || 'General health wellness',
            item.notes || `Offline sync from device: ${deviceId || 'mobile-client'}`,
            !isSafe,
            0.95,
          ]
        );

        const serverRemedyId = remedyRes.rows[0].id;

        // 3. Insert into clinical alerts if interaction found
        let alertId: string | null = null;
        if (safetyAnalysis && safetyAnalysis.hasClash) {
          const alertRes = await client.query(
            `INSERT INTO clinical_alerts 
             (remedy_id, plant_scientific_name, drug_generic_name, interaction_type, evidence_level, confidence, graph_path_json)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id`,
            [
              serverRemedyId,
              item.scientificName || item.remedyNameLocal,
              item.confirmedMedicine,
              safetyAnalysis.interactionType,
              safetyAnalysis.evidenceLevel || 'Level-2 Clinical Cohort',
              safetyAnalysis.confidence || 0.9,
              JSON.stringify(safetyAnalysis.graphPath || []),
            ]
          );
          alertId = alertRes.rows[0].id;
        }

        // 4. Log Audit Event
        await AuditService.logEvent({
          eventType: 'OFFLINE_RECORD_SYNCED',
          entityType: 'remedies',
          entityId: serverRemedyId,
          payload: {
            clientRecordId: item.clientRecordId,
            deviceId,
            reporterId,
            reporterRole: item.reporterRole || 'asha',
            hasClash: !isSafe,
            alertId,
          },
        });

        syncedResults.push({
          clientRecordId: item.clientRecordId,
          serverId: serverRemedyId,
          status: 'synced',
          isSafe,
          interactionType,
          alertId,
          timestamp: new Date().toISOString(),
        });
      }

      await client.query('COMMIT');
    } catch (txErr) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }

    return res.json({
      success: true,
      count: syncedResults.length,
      syncedRecords: syncedResults,
      serverTimestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Sync Router] Batch sync failure:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * GET /api/sync/status
 * Health and queue metrics
 */
syncRouter.get('/status', async (_req: Request, res: Response) => {
  try {
    const countRes = await pool.query('SELECT COUNT(*) FROM remedies');
    const alertRes = await pool.query('SELECT COUNT(*) FROM clinical_alerts WHERE is_resolved = false');

    res.json({
      status: 'active',
      totalRemediesSynced: parseInt(countRes.rows[0].count, 10),
      unresolvedAlerts: parseInt(alertRes.rows[0].count, 10),
      gatewayTime: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
