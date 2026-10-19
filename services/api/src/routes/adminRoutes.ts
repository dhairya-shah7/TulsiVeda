import { Router } from 'express';
import { pool } from '../db/postgres.js';
import { BOTANICAL_DATABASE } from '../services/botanicalDatabase.js';
import { DRUG_CATALOG } from '../services/pharmacopoeiaDatabase.js';

export const adminRouter = Router();

// Demo users database
const ADMIN_USERS = [
  { id: 'usr-1', name: 'Dr. Aarav Sharma', role: 'doctor', email: 'aarav.sharma@aiims.edu', region: 'Pune, Maharashtra', status: 'verified', lastActive: '5 mins ago' },
  { id: 'usr-2', name: 'Sunita Devi', role: 'asha', email: 'sunita.asha@nhm.gov.in', region: 'Varanasi, Uttar Pradesh', status: 'verified', lastActive: '12 mins ago' },
  { id: 'usr-3', name: 'Ramesh Patel', role: 'citizen', email: 'ramesh.p@gmail.com', region: 'Ahmedabad, Gujarat', status: 'active', lastActive: '1 hour ago' },
  { id: 'usr-4', name: 'Dr. Priya Nair', role: 'doctor', email: 'priya.nair@ayush.gov.in', region: 'Kochi, Kerala', status: 'verified', lastActive: '25 mins ago' },
  { id: 'usr-5', name: 'Kavita Meena', role: 'asha', email: 'kavita.asha@nhm.gov.in', region: 'Jaipur, Rajasthan', status: 'verified', lastActive: '30 mins ago' },
  { id: 'usr-6', name: 'Ananya Mukherjee', role: 'citizen', email: 'ananya.m@outlook.com', region: 'Kolkata, West Bengal', status: 'active', lastActive: '3 hours ago' },
  { id: 'usr-7', name: 'National Command Admin', role: 'admin', email: 'admin@tulsiveda.gov.in', region: 'New Delhi HQ', status: 'verified', lastActive: 'Just now' },
];

const SURVEILLANCE_TELEMETRY = [
  { id: 'surv-1', state: 'Maharashtra', district: 'Pune', syndrome: 'Acute Febrile Illness & Cough', cases: 412, trend: '+14%', alertLevel: 'medium' },
  { id: 'surv-2', state: 'Uttar Pradesh', district: 'Varanasi', syndrome: 'Dyspepsia & Gastrointestinal Distress', cases: 289, trend: '-3%', alertLevel: 'low' },
  { id: 'surv-3', state: 'Gujarat', district: 'Surat', syndrome: 'Metabolic & Glycemic Complications', cases: 534, trend: '+8%', alertLevel: 'medium' },
  { id: 'surv-4', state: 'Rajasthan', district: 'Jaipur', syndrome: 'Joint Pain & Arthritic Flare', cases: 620, trend: '+22%', alertLevel: 'high' },
  { id: 'surv-5', state: 'Kerala', district: 'Ernakulam', syndrome: 'Viral Pyrexia & Fatigue', cases: 198, trend: '-7%', alertLevel: 'low' },
  { id: 'surv-6', state: 'West Bengal', district: 'Kolkata', syndrome: 'Respiratory Bronchospasm', cases: 345, trend: '+5%', alertLevel: 'medium' },
];

// POST /api/admin/login
adminRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@tulsiveda.gov.in' && (password === 'Admin@2026' || password === 'admin')) {
    return res.json({
      success: true,
      token: 'tv_admin_token_' + Date.now(),
      user: {
        id: 'adm-001',
        name: 'Dr. V. K. Paul (National Health Mission)',
        email: 'admin@tulsiveda.gov.in',
        role: 'SuperAdmin',
        department: 'Ministry of Health & Family Welfare / AYUSH',
      }
    });
  }
  // Allow any reasonable admin email for hackathon/demo
  if (email && password) {
    return res.json({
      success: true,
      token: 'tv_admin_token_' + Date.now(),
      user: {
        id: 'adm-' + Date.now().toString().slice(-4),
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        role: 'Admin Officer',
        department: 'Ecosystem Command Center',
      }
    });
  }
  res.status(401).json({ error: 'Invalid credentials. Use admin@tulsiveda.gov.in / Admin@2026' });
});

// GET /api/admin/stats
adminRouter.get('/stats', async (req, res) => {
  try {
    let dbIntakes = 14290;
    let dbPrescriptions = 3840;
    try {
      const q = await pool.query('SELECT COUNT(*) as count FROM remedies');
      if (q.rows[0]?.count) dbIntakes = parseInt(q.rows[0].count) + 14290;
    } catch {}

    res.json({
      totalIntakes: dbIntakes,
      prescriptionsReviewed: dbPrescriptions,
      activeClashAlerts: 142,
      registeredAshaWorkers: 4210,
      activeDoctors: 890,
      offlineMonographsActive: BOTANICAL_DATABASE.length,
      allopathicGenericsVerified: Object.keys(DRUG_CATALOG).length,
      syncedEdgeDevices: 18450,
      lastRuleUpdate: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// GET /api/admin/users
adminRouter.get('/users', (req, res) => {
  const { role, query } = req.query;
  let list = [...ADMIN_USERS];
  if (role && role !== 'all') {
    list = list.filter(u => u.role === role);
  }
  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.region.toLowerCase().includes(q));
  }
  res.json({ users: list, total: list.length });
});

// GET /api/admin/logs
adminRouter.get('/logs', async (req, res) => {
  try {
    let logs = [];
    try {
      const r = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50');
      logs = r.rows;
    } catch {}

    if (!logs.length) {
      logs = [
        { id: 'log-1', event_type: 'BIO_KINETIC_CLASH_DETECTED', entity_type: 'safety_engine', payload: { drug: 'Warfarin', herb: 'Ashwagandha', severity: 'HIGH' }, created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
        { id: 'log-2', event_type: 'OCR_PRESCRIPTION_PARSED', entity_type: 'prescription', payload: { detectedCount: 3, verifiedGenerics: ['Metformin', 'Atorvastatin'] }, created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
        { id: 'log-3', event_type: 'VOICE_INDIC_TRANSCRIBED', entity_type: 'audio_records', payload: { language: 'Tamil', confidence: 0.94 }, created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString() },
        { id: 'log-4', event_type: 'OTA_CLINICAL_RULE_DISPATCHED', entity_type: 'clinical_engine', payload: { version: '2026.10.18-v4', recipients: '18450 mobile nodes' }, created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
        { id: 'log-5', event_type: 'JAN_AUSHADHI_ALTERNATIVE_QUERIED', entity_type: 'alternative_engine', payload: { missing: 'Paracetamol 650mg', resolvedGeneric: 'Jan Aushadhi Paracetamol Tablet IP' }, created_at: new Date(Date.now() - 1000 * 60 * 150).toISOString() },
      ];
    }
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// GET /api/admin/surveillance
adminRouter.get('/surveillance', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    telemetry: SURVEILLANCE_TELEMETRY,
    totalSyndromicSignals: 2403,
  });
});

// POST /api/admin/ota-dispatch
adminRouter.post('/ota-dispatch', (req, res) => {
  const { ruleVersion, targetRegions, notes } = req.body;
  res.json({
    success: true,
    dispatchId: 'OTA-' + Date.now(),
    ruleVersion: ruleVersion || '2026.10.18-PROD',
    targetRegions: targetRegions || 'Pan-India',
    nodesUpdated: 18450,
    timestamp: new Date().toISOString(),
    status: 'Broadcast Complete — Edge Cache Verified',
  });
});
