import React, { useEffect, useState } from 'react';
import { 
  Leaf, 
  ClipboardList, 
  Inbox, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Search,
  X,
  ShieldAlert,
  FileText,
  MapPin,
  User,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { StorageService, StoredRecord } from '../services/storageService.ts';

interface DashboardScreenProps {
  onStartRemedy: () => void;
  onStartPrescription: () => void;
  onSelectRecord?: (record: StoredRecord) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onStartRemedy,
  onStartPrescription,
  onSelectRecord,
}) => {
  const [stats, setStats] = useState({ remedies: 0, prescriptions: 0, alerts: 0, decisions: 0 });
  const [recentRecords, setRecentRecords] = useState<StoredRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'draft'>('all');
  
  // Selected record modal
  const [inspectRecord, setInspectRecord] = useState<StoredRecord | null>(null);

  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await StorageService.fetchDashboardData();
      setRecentRecords(data.records);
      setStats(data.stats);
    } catch (err) {
      console.warn('[Dashboard] Could not fetch live backend stats, using local storage:', err);
      const localRecs = StorageService.getLocalRecords();
      setRecentRecords(localRecs);
      setStats(StorageService.getLocalStats());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecordClick = (rec: StoredRecord) => {
    setInspectRecord(rec);
    if (onSelectRecord) {
      onSelectRecord(rec);
    }
  };

  // Filter records
  const filteredRecords = recentRecords.filter((rec) => {
    const matchesStatus = 
      statusFilter === 'all' ? true : 
      statusFilter === 'completed' ? rec.status === 'completed' : 
      rec.status !== 'completed';

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;

    const matchesSearch = 
      (rec.remedy_name_local || '').toLowerCase().includes(q) ||
      (rec.used_for_condition || '').toLowerCase().includes(q) ||
      (rec.confirmed_species || '').toLowerCase().includes(q) ||
      (rec.confirmed_medicine || '').toLowerCase().includes(q) ||
      (rec.place_region || '').toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recent';
    }
  };

  const handleClearAll = () => {
    StorageService.clearAllRecords();
    setRecentRecords([]);
    setStats({ remedies: 0, prescriptions: 0, alerts: 0, decisions: 0 });
    setInspectRecord(null);
  };

  return (
    <div className="space-y-5">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">Welcome</h1>
          <p className="text-xs text-gray-500 mt-0.5">TulsiVeda AI • Hyperlocal Remedy & Safety Ledger</p>
        </div>
        <div className="flex items-center gap-2">
          {recentRecords.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-600 text-xs font-semibold transition-colors"
              title="Clear all records (Reset for clean demo)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
          <button
            onClick={() => loadData(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 text-xs font-semibold transition-colors disabled:opacity-50"
            title="Refresh recent records"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{refreshing ? 'Refreshing' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 text-center">
          <div className="text-lg font-bold text-emerald-800">{stats.remedies}</div>
          <div className="text-[10px] font-medium text-emerald-600">Remedies</div>
        </div>
        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2.5 text-center">
          <div className="text-lg font-bold text-blue-800">{stats.prescriptions}</div>
          <div className="text-[10px] font-medium text-blue-600">Reviewed</div>
        </div>
        <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2.5 text-center">
          <div className="text-lg font-bold text-amber-800">{stats.alerts}</div>
          <div className="text-[10px] font-medium text-amber-600">Alerts</div>
        </div>
        <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-2.5 text-center">
          <div className="text-lg font-bold text-purple-800">{stats.decisions}</div>
          <div className="text-[10px] font-medium text-purple-600">Decisions</div>
        </div>
      </div>

      {/* Two Primary Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Card 1: New Remedy Record */}
        <div className="surface-card flex flex-col justify-between hover:border-emerald-300 transition-all group">
          <div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 fill-emerald-600 text-emerald-600" />
            </div>
            <h2 className="font-heading font-bold text-base text-gray-900">New Remedy Record</h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Capture vernacular remedy voice & botany
            </p>
          </div>
          <button
            onClick={onStartRemedy}
            className="btn-primary mt-4 w-full text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5"
          >
            <span>+ Start New</span>
          </button>
        </div>

        {/* Card 2: New Prescription Review */}
        <div className="surface-card flex flex-col justify-between hover:border-emerald-300 transition-all group">
          <div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="font-heading font-bold text-base text-gray-900">New Prescription Review</h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Upload prescription for safety review
            </p>
          </div>
          <button
            onClick={onStartPrescription}
            className="btn-primary mt-4 w-full text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5"
          >
            <span>+ Start New</span>
          </button>
        </div>
      </div>

      {/* Recent Records Section Header & Filters */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-base text-gray-900">Recent Records</h2>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {recentRecords.length} recorded
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-gray-100 p-0.5 rounded-lg text-[11px]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'completed'
                  ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'draft'
                  ? 'bg-white text-amber-700 shadow-sm font-semibold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search recent records, plants, drugs, or conditions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Blank State (0 records) */}
        {filteredRecords.length === 0 ? (
          <div className="surface-card border-dashed border-gray-300 py-10 px-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 mb-2.5 shadow-inner">
              <Inbox className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-sm font-semibold text-gray-700">No matching records found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              {searchQuery ? 'Try clearing your search query.' : 'All entered records will appear here.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs text-emerald-700 font-semibold underline"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          /* Populated State */
          <div className="space-y-2.5">
            {filteredRecords.map((rec) => {
              const isCompleted = rec.status === 'completed' || !!rec.decision;
              return (
                <div
                  key={rec.id}
                  onClick={() => handleRecordClick(rec)}
                  className="surface-card p-3.5 hover:shadow-md hover:border-emerald-200 transition-all flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs mt-0.5 ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">
                          {rec.remedy_name_local || 'Remedy Observation'}
                        </h4>
                        {rec.confirmed_species && (
                          <span className="text-[10px] italic text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {rec.confirmed_species}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {rec.used_for_condition || 'Condition unspecified'} • {rec.place_region || 'Gujarat'}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {rec.interaction_type && (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                            <span className="truncate max-w-[180px]">{rec.interaction_type.split(':')[0]}</span>
                          </span>
                        )}
                        {rec.confirmed_medicine && (
                          <span className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                            Rx: {rec.confirmed_medicine.split('(')[0]}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {formatDate(rec.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {rec.status || 'draft'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Record Inspection Modal */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  inspectRecord.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {inspectRecord.status} Record
                </span>
                <h3 className="font-heading font-bold text-base text-gray-900 mt-1">
                  {inspectRecord.remedy_name_local}
                </h3>
                {inspectRecord.confirmed_species && (
                  <p className="text-xs text-emerald-700 italic">
                    Taxonomy: {inspectRecord.confirmed_species}
                  </p>
                )}
              </div>
              <button
                onClick={() => setInspectRecord(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-gray-700">
                  <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Condition:</span>
                  <span>{inspectRecord.used_for_condition}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Region:</span>
                  <span>{inspectRecord.place_region || 'Gujarat'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Recorder:</span>
                  <span>{inspectRecord.prepared_by || 'ASHA Field Worker'}</span>
                </div>
              </div>

              {inspectRecord.interaction_type && (
                <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Herb-Drug Interaction Alert</span>
                  </div>
                  <p className="text-amber-800 font-medium">{inspectRecord.interaction_type}</p>
                  {inspectRecord.confirmed_medicine && (
                    <p className="text-[11px] text-amber-700">
                      Evaluated Drug: <strong>{inspectRecord.confirmed_medicine}</strong>
                    </p>
                  )}
                  {inspectRecord.evidence_level && (
                    <span className="inline-block bg-white text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[10px] mt-1 font-semibold">
                      Evidence Level: {inspectRecord.evidence_level}
                    </span>
                  )}
                </div>
              )}

              {inspectRecord.decision && (
                <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Clinician Action & Decision</span>
                  </div>
                  <p className="text-emerald-800 font-semibold capitalize">
                    {inspectRecord.decision.replace(/_/g, ' ')}
                  </p>
                  {inspectRecord.decision_notes && (
                    <p className="text-gray-600 text-[11px] mt-1 italic">
                      "{inspectRecord.decision_notes}"
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectRecord(null)}
                className="btn-primary w-full py-2 text-xs rounded-xl"
              >
                Close Record Details
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-[11px] text-gray-400 text-center pt-2">
        All field records, plant identifications, and clinician decisions are preserved offline in device storage.
      </p>
    </div>
  );
};
