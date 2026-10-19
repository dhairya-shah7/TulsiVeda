export interface StoredRecord {
  id: string;
  remedy_name_local: string;
  used_for_condition: string;
  prepared_by?: string;
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
  submitted_by_role?: 'citizen' | 'asha' | 'doctor';
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

const DEMO_REVIEW_REQUESTS: StoredRecord[] = [
  {
    id: 'req_demo_01',
    patient_name: 'Gurpreet Singh',
    remedy_name_local: 'Tulsi Leaves Decoction (Ocimum sanctum)',
    confirmed_species: 'Ocimum sanctum',
    confirmed_medicine: 'Warfarin 5mg (Coumadin)',
    used_for_condition: 'Chest tightness & Blood Thinner',
    prepared_by: 'Citizen Gurpreet (Self-Intake)',
    place_region: 'Amritsar, Punjab',
    language: 'Punjabi',
    status: 'pending_review',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    interaction_type: 'High Clash Risk: CYP2C9 Enzyme Competitive Inhibition',
    evidence_level: 'Mechanistic',
    submitted_by_role: 'citizen',
  },
  {
    id: 'req_demo_02',
    patient_name: 'Pooja Devi',
    remedy_name_local: 'Ashwagandha Churna (Withania somnifera)',
    confirmed_species: 'Withania somnifera',
    confirmed_medicine: 'Clonazepam 0.5mg',
    used_for_condition: 'Insomnia & Restlessness',
    prepared_by: 'Citizen Pooja (Self-Intake)',
    place_region: 'Madhubani, Bihar',
    language: 'Hindi',
    status: 'pending_review',
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    interaction_type: 'Moderate Interaction: GABA receptor additive sedation',
    evidence_level: 'Clinical In Vivo',
    submitted_by_role: 'citizen',
  },
  {
    id: 'req_demo_03',
    patient_name: 'K. Balakrishnan',
    remedy_name_local: 'Turmeric Milk (Curcuma longa)',
    confirmed_species: 'Curcuma longa',
    confirmed_medicine: 'Metformin 500mg',
    used_for_condition: 'Type 2 Diabetes',
    prepared_by: 'Citizen Balakrishnan',
    place_region: 'Palakkad, Kerala',
    language: 'Malayalam',
    status: 'pending_review',
    created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    interaction_type: 'Synergistic: Potential hypoglycemic augmentation',
    evidence_level: 'Systematic Review',
    submitted_by_role: 'citizen',
  }
];

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
   * Retrieves pending review requests for Doctors and ASHA workers.
   * If user has created pending requests, returns those; otherwise provides realistic demo requests.
   */
  static getPendingReviewRequests(): StoredRecord[] {
    const records = this.getLocalRecords();
    const userPending = records.filter(r => r.status === 'pending_review' || (!r.decision && (r.confirmed_species || r.remedy_name_local)));
    if (userPending.length > 0) {
      return userPending;
    }
    return DEMO_REVIEW_REQUESTS;
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
}
