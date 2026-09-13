export interface StoredRecord {
  id: string;
  remedy_name_local: string;
  used_for_condition: string;
  prepared_by?: string;
  place_region?: string;
  language?: string;
  status: 'draft' | 'extracted' | 'identified' | 'reviewed' | 'completed';
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
}

export interface DashboardStats {
  remedies: number;
  prescriptions: number;
  alerts: number;
  decisions: number;
}

const STORAGE_KEY = 'tulsiveda_recent_records_v2';
const OLD_STORAGE_KEY = 'tulsiveda_recent_records';

export class StorageService {
  /**
   * Retrieves all records stored locally.
   * Starts with 0 records (blank slate for clean demo).
   */
  static getLocalRecords(): StoredRecord[] {
    try {
      // Clear legacy seeded storage if present
      if (localStorage.getItem(OLD_STORAGE_KEY)) {
        localStorage.removeItem(OLD_STORAGE_KEY);
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out any leftover seed records just in case
        return parsed.filter((r) => !r.id?.startsWith('rec_seed_'));
      }
      return [];
    } catch (e) {
      console.warn('[StorageService] Error reading localStorage:', e);
      return [];
    }
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
