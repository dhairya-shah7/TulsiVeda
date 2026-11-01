export interface StoredRecord {
  id: string;
  remedy_name_local: string;
  used_for_condition: string;
  prepared_by?: string;
  referred_by_asha?: string;
  escalated_to_doctor?: boolean;
  asha_notes?: string;
  place_region?: string;
  language?: string;
  status: 'draft' | 'extracted' | 'identified' | 'reviewed' | 'completed' | 'pending_review';
  created_at: string;
  updated_at?: string;
  decision?: string;
  decision_notes?: string;
  interaction_type?: string;
  evidence_level?: string;
  confirmed_species?: string;
  confirmed_medicine?: string;
  transcript?: string;
  extracted_details?: any;
  confidence?: string;
  patient_name?: string;
  submitted_by_role?: 'citizen' | 'asha' | 'doctor' | 'admin';
  reviewed_by_role?: 'asha' | 'doctor';
}

export interface DashboardStats {
  remedies: number;
  prescriptions: number;
  alerts: number;
  decisions: number;
}

const STORAGE_KEY = 'tulsiveda_recent_records_v2';
const OLD_STORAGE_KEY = 'tulsiveda_recent_records';

/**
 * Verified cases referred and escalated strictly by ASHA field workers for doctor evaluation.
 * In public health PHC systems, doctors only review cases screened and sent by ASHA workers.
 */
const DEMO_DOCTOR_REVIEW_REQUESTS: StoredRecord[] = [
  {
    id: 'req_asha_ref_01',
    patient_name: 'Gurpreet Singh (62y/M)',
    remedy_name_local: 'Tulsi Leaves Decoction (Ocimum sanctum)',
    confirmed_species: 'Ocimum sanctum',
    confirmed_medicine: 'Warfarin 5mg (Coumadin)',
    used_for_condition: 'Chest tightness & Blood Thinner',
    prepared_by: 'Sunita Didi (ASHA Worker - Sangamner PHC)',
    referred_by_asha: 'ASHA Worker Sunita Didi',
    place_region: 'Sangamner Village, Maharashtra',
    language: 'Hindi',
    status: 'pending_review',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    interaction_type: 'High Clash Risk: CYP2C9 Enzyme Competitive Inhibition',
    evidence_level: 'Mechanistic',
    submitted_by_role: 'asha',
    escalated_to_doctor: true,
    asha_notes: 'Patient reports mild forearm petechiae/bruising. Taking concentrated fresh Tulsi kadha twice daily while on Warfarin. Escalated to Medical Officer for INR monitoring.',
  },
  {
    id: 'req_asha_ref_02',
    patient_name: 'Pooja Devi (45y/F)',
    remedy_name_local: 'Ashwagandha Churna (Withania somnifera)',
    confirmed_species: 'Withania somnifera',
    confirmed_medicine: 'Clonazepam 0.5mg',
    used_for_condition: 'Insomnia & Restlessness',
    prepared_by: 'Kamla Devi (ASHA Worker - Madhubani Sub-Center)',
    referred_by_asha: 'ASHA Worker Kamla Devi',
    place_region: 'Madhubani Ward 4, Bihar',
    language: 'Hindi',
    status: 'pending_review',
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    interaction_type: 'Moderate Interaction: GABA receptor additive sedation',
    evidence_level: 'Clinical In Vivo',
    submitted_by_role: 'asha',
    escalated_to_doctor: true,
    asha_notes: 'Marked daytime somnolence and unsteadiness observed during field visit. Patient taking 5g Churna alongside night sedative.',
  },
  {
    id: 'req_asha_ref_03',
    patient_name: 'K. Balakrishnan (58y/M)',
    remedy_name_local: 'Karela Juice (Momordica charantia)',
    confirmed_species: 'Momordica charantia',
    confirmed_medicine: 'Glimepiride 2mg + Metformin 500mg',
    used_for_condition: 'Type 2 Diabetes',
    prepared_by: 'Mary Joseph (ASHA Worker - Palakkad Arogyakendra)',
    referred_by_asha: 'ASHA Worker Mary Joseph',
    place_region: 'Palakkad Gram Panchayat, Kerala',
    language: 'Malayalam',
    status: 'pending_review',
    created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    interaction_type: 'Synergistic: Potential hypoglycemic shock hazard',
    evidence_level: 'Systematic Review',
    submitted_by_role: 'asha',
    escalated_to_doctor: true,
    asha_notes: 'Fasting blood glucose measured at 56 mg/dL in village health post. Patient drank fresh Karela juice with morning antidiabetic.',
  }
];

/**
 * Community village citizen submissions awaiting ASHA field triage.
 */
const DEMO_ASHA_REVIEW_REQUESTS: StoredRecord[] = [
  {
    id: 'req_asha_triage_01',
    patient_name: 'Ramesh Patel (54y/M)',
    remedy_name_local: 'Ajwain & Ginger Decoction',
    confirmed_species: 'Trachyspermum ammi',
    confirmed_medicine: 'Aspirin 75mg',
    used_for_condition: 'Gastric discomfort & Post-MI protection',
    prepared_by: 'Citizen Ramesh (Self-Intake)',
    place_region: 'Mehsana Village, Gujarat',
    language: 'Gujarati',
    status: 'pending_review',
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    interaction_type: 'Antiplatelet synergism evaluation',
    evidence_level: 'Empirical',
    submitted_by_role: 'citizen',
    escalated_to_doctor: false,
    asha_notes: 'Awaiting ASHA home visit triage.',
  },
  {
    id: 'req_asha_triage_02',
    patient_name: 'Ananya Sen (29y/F)',
    remedy_name_local: 'Neem Leaf Decoction (Azadirachta indica)',
    confirmed_species: 'Azadirachta indica',
    confirmed_medicine: 'Paracetamol 650mg',
    used_for_condition: 'Seasonal Viral Fever',
    prepared_by: 'Citizen Ananya (Self-Intake)',
    place_region: 'Bolpur Ward, West Bengal',
    language: 'Bengali',
    status: 'pending_review',
    created_at: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    interaction_type: 'Hepatic load screening',
    evidence_level: 'Pharmacopoeial',
    submitted_by_role: 'citizen',
    escalated_to_doctor: false,
    asha_notes: 'Awaiting ASHA home visit triage.',
  }
];

const DEMO_REVIEW_REQUESTS: StoredRecord[] = DEMO_DOCTOR_REVIEW_REQUESTS;

export class StorageService {
  /**
   * Retrieves all records stored locally.
   */
  static getLocalRecords(): StoredRecord[] {
    try {
      if (localStorage.getItem(OLD_STORAGE_KEY)) {
        localStorage.removeItem(OLD_STORAGE_KEY);
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((r) => !r.id?.startsWith('rec_seed_'));
      }
      return [];
    } catch (e) {
      console.warn('[StorageService] Error reading localStorage:', e);
      return [];
    }
  }

  /**
   * Retrieves pending review requests tailored to the active role.
   * STRICT CLINICAL RULE: Doctors ONLY see cases that were evaluated, prepared, or escalated by ASHA frontline workers.
   * ASHA workers see community village intakes requiring field triage or escalation.
   */
  static getPendingReviewRequests(role?: 'citizen' | 'asha' | 'doctor' | 'admin'): StoredRecord[] {
    const records = this.getLocalRecords();
    const userPending = records.filter(r => r.status === 'pending_review' || (!r.decision && (r.confirmed_species || r.remedy_name_local)));

    if (role === 'doctor') {
      // DOCTOR ONLY SEES WHAT ASHA WORKERS SEND!
      const doctorPending = userPending.filter(r => 
        r.submitted_by_role === 'asha' || 
        r.escalated_to_doctor === true ||
        (r.prepared_by && /asha/i.test(r.prepared_by)) ||
        (r.referred_by_asha && /asha/i.test(r.referred_by_asha))
      );
      if (doctorPending.length > 0) {
        return doctorPending;
      }
      return DEMO_DOCTOR_REVIEW_REQUESTS;
    }

    if (role === 'asha') {
      // ASHA Field Desk: Sees citizen intakes awaiting home visit triage or escalation to Medical Officer
      if (userPending.length > 0) {
        return userPending;
      }
      return DEMO_ASHA_REVIEW_REQUESTS;
    }

    if (userPending.length > 0) {
      return userPending;
    }
    return DEMO_REVIEW_REQUESTS;
  }

  /**
   * ASHA frontline action: Escalate a citizen case to the Medical Doctor.
   * Once escalated by ASHA, it becomes visible in the Doctor's Clinical Review queue.
   */
  static escalateToDoctor(id: string, ashaName: string, notes?: string): StoredRecord | null {
    const records = this.getLocalRecords();
    const existingIndex = records.findIndex(r => r.id === id);
    if (existingIndex >= 0) {
      records[existingIndex] = {
        ...records[existingIndex],
        status: 'pending_review',
        submitted_by_role: 'asha',
        escalated_to_doctor: true,
        referred_by_asha: ashaName,
        asha_notes: notes || 'Verified by ASHA field worker. Escalated to Medical Officer for clinical review.',
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return records[existingIndex];
    }
    return null;
  }

  /**
   * Clears all local records (resets to 0 for a brand new demo video).
   */
  static clearAllRecords(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(OLD_STORAGE_KEY);
      localStorage.removeItem('tulsiveda_dashboard_stats');
    } catch (e) {
      console.warn('[StorageService] Failed to clear records:', e);
    }
  }

  /**
   * Saves or updates a single record in local storage.
   */
  static saveRecord(record: Partial<StoredRecord> & { id: string }): StoredRecord {
    const current = this.getLocalRecords();
    const existingIndex = current.findIndex((r) => r.id === record.id);

    let updatedRecord: StoredRecord;
    if (existingIndex >= 0) {
      updatedRecord = {
        ...current[existingIndex],
        ...record,
        updated_at: new Date().toISOString(),
      };
      current[existingIndex] = updatedRecord;
    } else {
      updatedRecord = {
        remedy_name_local: record.remedy_name_local || 'Remedy Observation',
        used_for_condition: record.used_for_condition || 'Unspecified Condition',
        prepared_by: record.prepared_by || 'ASHA Field Worker',
        place_region: record.place_region || 'Gujarat',
        language: record.language || 'Gujarati',
        status: record.status || 'draft',
        created_at: record.created_at || new Date().toISOString(),
        ...record,
        id: record.id,
      };
      // Prepend so newest appears first
      current.unshift(updatedRecord);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('[StorageService] Failed to save record to localStorage:', e);
    }

    return updatedRecord;
  }

  /**
   * Computes dashboard statistics directly from stored records.
   * Accurate 0 values when no records exist.
   */
  static getLocalStats(): DashboardStats {
    const records = this.getLocalRecords();
    const remedies = records.length;
    const decisions = records.filter((r) => !!r.decision).length;
    const alerts = records.filter((r) => !!r.interaction_type).length;
    const prescriptions = records.filter((r) => !!r.confirmed_medicine).length;

    return {
      remedies,
      prescriptions,
      alerts,
      decisions,
    };
  }

  /**
   * Fetches live backend records if available, otherwise returns local records.
   */
  static async fetchDashboardData(): Promise<{ records: StoredRecord[]; stats: DashboardStats }> {
    const localRecords = this.getLocalRecords();
    const localStats = this.getLocalStats();

    // Check if we can reach backend with a fast timeout (1200ms)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const [recordsRes, statsRes] = await Promise.all([
        fetch('/api/dashboard/recent-records', { signal: controller.signal }).catch(() => null),
        fetch('/api/dashboard/stats', { signal: controller.signal }).catch(() => null),
      ]);
      clearTimeout(timeoutId);

      let serverRecords: StoredRecord[] = [];
      if (recordsRes && recordsRes.ok) {
        const json = await recordsRes.json();
        if (Array.isArray(json.records)) {
          serverRecords = json.records.filter((r: any) => !r.id?.startsWith('rec_seed_'));
        }
      }

      let serverStats = null;
      if (statsRes && statsRes.ok) {
        serverStats = await statsRes.json();
      }

      if (serverRecords.length > 0) {
        const idMap = new Map<string, StoredRecord>();
        serverRecords.forEach((r) => idMap.set(r.id, r));
        localRecords.forEach((r) => idMap.set(r.id, { ...(idMap.get(r.id) || {}), ...r }));
        const merged = Array.from(idMap.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return {
          records: merged,
          stats: serverStats || this.getLocalStats(),
        };
      }
    } catch (e) {
      console.log('[StorageService] Operating in local offline mode.');
    }

    return {
      records: localRecords,
      stats: localStats,
    };
  }

  /**
   * Syncs un-uploaded offline records to the backend sync queue
   */
  static async syncOfflineRecordsToServer(): Promise<number> {
    const records = this.getLocalRecords();
    const unSynced = records.filter(r => !r.id.startsWith('server_') && r.status !== 'completed');
    if (unSynced.length === 0) return 0;

    try {
      const payload = {
        items: unSynced.map(r => ({
          clientRecordId: r.id,
          patientName: r.patient_name || 'Village Citizen',
          remedyNameLocal: r.remedy_name_local,
          scientificName: r.confirmed_species,
          usedForCondition: r.used_for_condition,
          confirmedMedicine: r.confirmed_medicine,
          placeRegion: r.place_region || 'Rural Health Post',
          recordedAt: r.created_at,
          syncTimestamp: new Date().toISOString(),
          reporterRole: r.submitted_by_role || 'citizen',
        })),
        deviceId: 'tulsiveda-field-client',
      };

      const res = await fetch('/api/sync/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        return result.count || unSynced.length;
      }
    } catch (err) {
      console.warn('[StorageService] Offline sync queue deferred until network reconnects:', err);
    }
    return 0;
  }

  /**
   * Dynamic Clinical Research Records Cache
   */
  static getDynamicClinicalRecords(): any[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem('tulsiveda_dynamic_clinical_records');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static saveDynamicClinicalRecord(record: any): void {
    try {
      if (typeof localStorage === 'undefined') return;
      const list = this.getDynamicClinicalRecords();
      const existingIdx = list.findIndex((c: any) => c.id === record.id || c.conditionName === record.conditionName);
      if (existingIdx >= 0) {
        list[existingIdx] = record;
      } else {
        list.unshift(record);
      }
      localStorage.setItem('tulsiveda_dynamic_clinical_records', JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.warn('[StorageService] Failed to cache dynamic record:', e);
    }
  }
}
