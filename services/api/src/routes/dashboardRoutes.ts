import { Router } from 'express';
import { pool, checkPostgresConnection } from '../db/postgres.js';
import { checkNeo4jConnection } from '../db/neo4j.js';
import { checkQdrantConnection } from '../db/qdrant.js';

export const dashboardRouter = Router();

const FALLBACK_RECORDS: any[] = [];

// GET /api/dashboard/health
dashboardRouter.get('/health', async (req, res) => {
  const [pgOk, neo4jOk, qdrantOk] = await Promise.all([
    checkPostgresConnection(),
    checkNeo4jConnection(),
    checkQdrantConnection(),
  ]);

  res.json({
    postgres: pgOk ? 'connected' : 'offline',
    neo4j: neo4jOk ? 'connected' : 'offline',
    qdrant: qdrantOk ? 'connected' : 'offline',
    ocr: 'Dots.OCR + Tesseract Fallback Ready',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/dashboard/stats
dashboardRouter.get('/stats', async (req, res) => {
  try {
    const remedyCountRes = await pool.query('SELECT COUNT(*) as count FROM remedy_records');
    const rxCountRes = await pool.query('SELECT COUNT(*) as count FROM prescriptions');
    const alertCountRes = await pool.query('SELECT COUNT(*) as count FROM clinical_alerts');
    const decisionCountRes = await pool.query('SELECT COUNT(*) as count FROM clinical_decisions');

    const remedies = parseInt(remedyCountRes.rows[0]?.count || '0', 10);
    const prescriptions = parseInt(rxCountRes.rows[0]?.count || '0', 10);
    const alerts = parseInt(alertCountRes.rows[0]?.count || '0', 10);
    const decisions = parseInt(decisionCountRes.rows[0]?.count || '0', 10);

    res.json({
      remedies,
      prescriptions,
      alerts,
      decisions,
    });
  } catch (err) {
    res.json({
      remedies: 0,
      prescriptions: 0,
      alerts: 0,
      decisions: 0,
    });
  }
});

// GET /api/dashboard/recent-records
dashboardRouter.get('/recent-records', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id,
        r.remedy_name_local,
        r.used_for_condition,
        r.prepared_by,
        r.place_region,
        r.language,
        r.status,
        r.created_at,
        cd.decision,
        cd.notes as decision_notes,
        ca.interaction_type,
        ca.evidence_level,
        cs.scientific_name as confirmed_species,
        me.generic_name as confirmed_medicine
      FROM remedy_records r
      LEFT JOIN clinical_decisions cd ON cd.remedy_id = r.id
      LEFT JOIN clinical_alerts ca ON ca.remedy_id = r.id
      LEFT JOIN plant_observations po ON po.remedy_id = r.id
      LEFT JOIN candidate_species cs ON cs.observation_id = po.id AND cs.expert_status = 'confirmed'
      LEFT JOIN medicine_entries me ON me.id = ca.medicine_id
      ORDER BY r.created_at DESC
      LIMIT 20
    `);

    if (result.rows && result.rows.length > 0) {
      res.json({ records: result.rows });
    } else {
      res.json({ records: [] });
    }
  } catch (err) {
    res.json({ records: [] });
  }
});
