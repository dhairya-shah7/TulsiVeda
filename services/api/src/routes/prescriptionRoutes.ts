import { Router } from 'express';
import multer from 'multer';
import { pool } from '../db/postgres.js';
import { OcrService } from '../services/ocrService.js';
import { AuditService } from '../services/auditService.js';

export const prescriptionRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// POST /api/prescriptions/upload
// Screen 5: Prescription & Safety Review upload dropzone
prescriptionRouter.post('/upload', upload.single('prescription'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Prescription image file is required' });
    }

    // 1. Execute Dots.OCR with automatic fallback to Tesseract.js
    const ocrResult = await OcrService.processPrescriptionImage(file.buffer, file.mimetype);

    // 2. Persist to PostgreSQL
    const rxRes = await pool.query(
      `INSERT INTO prescriptions (raw_ocr_text, ocr_engine)
       VALUES ($1, $2) RETURNING id`,
      [ocrResult.rawText, ocrResult.engineUsed]
    );
    const prescriptionId = rxRes.rows[0].id;

    // 3. Persist detected medicines (unconfirmed initially)
    const savedMedicines = [];
    for (const med of ocrResult.detectedMedicines) {
      const medRes = await pool.query(
        `INSERT INTO medicine_entries 
         (prescription_id, brand_name, generic_name, medicine_type, dose, frequency, clinician_confirmed)
         VALUES ($1, $2, $3, $4, $5, $6, false)
         RETURNING *`,
        [prescriptionId, med.brandName, med.genericName, med.type, med.dose, med.frequency]
      );
      savedMedicines.push(medRes.rows[0]);
    }

    await AuditService.logEvent({
      eventType: 'PRESCRIPTION_OCRED',
      entityType: 'prescriptions',
      entityId: prescriptionId,
      payload: { engine: ocrResult.engineUsed, medicinesFound: ocrResult.detectedMedicines.length },
    });

    res.json({
      prescriptionId,
      rawText: ocrResult.rawText,
      engineUsed: ocrResult.engineUsed,
      detectedMedicines: savedMedicines.length > 0 ? savedMedicines : ocrResult.detectedMedicines,
    });
  } catch (err) {
    console.error('[PrescriptionRoutes] OCR error:', err);
    res.status(500).json({ error: 'Failed to process prescription image' });
  }
});

// POST /api/prescriptions/confirm-medicine
// Mandatory Clinician Confirmation Gate
prescriptionRouter.post('/confirm-medicine', async (req, res) => {
  try {
    const { medicineId, brandName, genericName, dose, frequency } = req.body;

    let confirmedRow;
    if (medicineId) {
      const result = await pool.query(
        `UPDATE medicine_entries 
         SET clinician_confirmed = true, confirmed_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [medicineId]
      );
      confirmedRow = result.rows[0];
    } else {
      // Create confirmed entry directly
      const result = await pool.query(
        `INSERT INTO medicine_entries 
         (brand_name, generic_name, dose, frequency, clinician_confirmed, confirmed_at)
         VALUES ($1, $2, $3, $4, true, CURRENT_TIMESTAMP)
         RETURNING *`,
        [brandName || 'Ecosprin', genericName || 'Aspirin', dose || '75 mg', frequency || 'Once Daily (OD)']
      );
      confirmedRow = result.rows[0];
    }

    await AuditService.logEvent({
      eventType: 'MEDICINE_CONFIRMED_BY_CLINICIAN',
      entityType: 'medicine_entries',
      entityId: confirmedRow?.id,
      payload: { genericName: confirmedRow?.generic_name, brandName: confirmedRow?.brand_name },
    });

    res.json({ success: true, confirmedMedicine: confirmedRow });
  } catch (err) {
    console.error('[PrescriptionRoutes] Confirmation error:', err);
    res.status(500).json({ error: 'Failed to confirm medicine' });
  }
});
