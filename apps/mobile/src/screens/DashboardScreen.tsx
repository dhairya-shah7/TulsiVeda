import React, { useEffect, useState } from 'react';
import { 
  Leaf, 
  ClipboardList, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Search,
  X,
  PhoneCall,
  BookOpen,
  Pill,
  Send,
  Stethoscope,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { StorageService, StoredRecord } from '../services/storageService.ts';
import { AudioNarrator } from '../components/AudioNarrator.tsx';
import { t, useCurrentLanguage } from '../services/localizationService.ts';

interface DashboardScreenProps {
  onStartRemedy: () => void;
  onStartPrescription: () => void;
  onOpenKnowledge: () => void;
  onOpenAlternatives: () => void;
  onOpenIvr: () => void;
  onSelectRecord?: (record: StoredRecord) => void;
  currentMode: 'village' | 'city';
  currentRole: 'citizen' | 'asha' | 'doctor';
  activeDraft?: {
    remedyId?: string;
    remedyNameLocal?: string;
    scientificName?: string;
    confirmedMedicine?: any;
    usedForCondition?: string;
  };
  onSubmitReviewRequest?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onStartRemedy,
  onStartPrescription,
  onOpenKnowledge,
  onOpenAlternatives,
  onOpenIvr,
  onSelectRecord,
  currentMode,
  currentRole = 'citizen',
  activeDraft,
  onSubmitReviewRequest
}) => {
  useCurrentLanguage();
  const [stats, setStats] = useState({ remedies: 0, prescriptions: 0, alerts: 0, decisions: 0 });
  const [recentRecords, setRecentRecords] = useState<StoredRecord[]>([]);
  const [pendingRequests, setPendingRequests] = useState<StoredRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inspectRecord, setInspectRecord] = useState<StoredRecord | null>(null);

  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await StorageService.fetchDashboardData();
      setRecentRecords(data.records);
      setStats(data.stats);
      setPendingRequests(StorageService.getPendingReviewRequests());
    } catch (err) {
      console.warn('[Dashboard] Error reading local data:', err);
      const localRecs = StorageService.getLocalRecords();
      setRecentRecords(localRecs);
      setStats(StorageService.getLocalStats());
      setPendingRequests(StorageService.getPendingReviewRequests());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentRole]);

  const handleRecordClick = (rec: StoredRecord) => {
    if (onSelectRecord) {
      onSelectRecord(rec);
    } else {
      setInspectRecord(rec);
    }
  };

  const handleClearAll = () => {
    StorageService.clearAllRecords();
    setRecentRecords([]);
    setPendingRequests(StorageService.getPendingReviewRequests());
    setInspectRecord(null);
  };

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

  const isCitizen = currentRole === 'citizen';
  const hasHerb = !!(activeDraft?.remedyNameLocal || activeDraft?.scientificName);
  const hasMedicine = !!(activeDraft?.confirmedMedicine);
  const readyToSubmit = hasHerb && hasMedicine;

  return (
    <div className="space-y-4 max-w-md mx-auto pb-24">
      {/* Welcome & Ecosystem Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-emerald-200 border border-white/15">
            <span>
              {currentRole === 'doctor' 
                ? `👨‍⚕️ ${t('doctor_desk')}` 
                : currentRole === 'asha' 
                  ? `🩺 ${t('asha_portal')}` 
                  : (currentMode === 'village' ? `🌾 ${t('village_mode_label')}` : `🏙️ ${t('citizen_portal')}`)}
            </span>
          </div>
          <AudioNarrator 
            textToNarrate={t('narrate_dashboard')}
            label={t('listen_native')}
            className="bg-white/15 border-white/20 text-white"
          />
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight mt-2 text-white">
          {currentRole === 'doctor' 
            ? t('doctor_desk') 
            : currentRole === 'asha' 
              ? t('asha_portal') 
              : t('welcome_title')}
        </h1>
        <p className="text-xs text-emerald-100/90 mt-1 font-medium leading-relaxed">
          {isCitizen 
            ? t('welcome_subtitle') 
            : t('welcome_subtitle')}
        </p>
      </div>

      {/* ========================================================
          ROLE 1: CITIZEN VIEW - CLEAN, TOUCH-FRIENDLY ACTION CARDS
         ======================================================== */}
      {isCitizen && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <span>{t('step_guide_heading')}</span>
            </h2>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {t('guided_flow')}
            </span>
          </div>

          {/* STEP 1: RECORD BOTANICAL REMEDY */}
          {hasHerb ? (
            <div className="p-4 rounded-3xl bg-emerald-50/80 border-2 border-emerald-400 shadow-sm transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-xs">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                      {t('step')} 1 • {t('added_label')}
                    </span>
                  </div>
                  <h3 className="font-black text-sm text-emerald-950 mt-0.5">
                    🌿 {activeDraft?.remedyNameLocal || activeDraft?.scientificName}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onStartRemedy}
                  className="text-xs font-bold text-emerald-900 hover:text-emerald-950 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 shadow-xs active:scale-95 transition-all"
                >
                  {t('change_btn')}
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={onStartRemedy}
              className="p-4 rounded-3xl bg-white border-2 border-slate-200/90 hover:border-emerald-500 shadow-sm transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200/80 group-hover:scale-105 transition-transform">
                    <Leaf className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div className="text-left">
                    <div className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 uppercase tracking-wider">
                      <span>{t('step')} 1</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {t('step1_title')}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                      {t('speak_or_type_herb')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div onClick={(e) => e.stopPropagation()}>
                    <AudioNarrator 
                      textToNarrate={t('step1_desc')}
                      className="p-2"
                    />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ADD MODERN PRESCRIPTION MEDICINE */}
          {hasMedicine ? (
            <div className="p-4 rounded-3xl bg-blue-50/80 border-2 border-blue-400 shadow-sm transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-xs">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">
                      {t('step')} 2 • {t('added_label')}
                    </span>
                  </div>
                  <h3 className="font-black text-sm text-blue-950 mt-0.5">
                    💊 {activeDraft?.confirmedMedicine?.brandName || activeDraft?.confirmedMedicine?.genericName}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onStartPrescription}
                  className="text-xs font-bold text-blue-900 hover:text-blue-950 px-3 py-1.5 rounded-xl bg-white border border-blue-300 shadow-xs active:scale-95 transition-all"
                >
                  {t('change_btn')}
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={onStartPrescription}
              className="p-4 rounded-3xl bg-white border-2 border-slate-200/90 hover:border-blue-500 shadow-sm transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 border border-blue-200/80 group-hover:scale-105 transition-transform">
                    <Pill className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="text-left">
                    <div className="inline-flex items-center gap-1 text-[10px] font-black text-blue-700 uppercase tracking-wider">
                      <span>{t('step')} 2</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-800 transition-colors">
                      {t('step2_title')}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                      {t('add_rx_medicine_btn')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div onClick={(e) => e.stopPropagation()}>
                    <AudioNarrator 
                      textToNarrate={t('step2_desc')}
                      className="p-2"
                    />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: RUN SAFETY AUDIT / REVIEW */}
          {readyToSubmit ? (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-black text-xs text-white">
                    3
                  </span>
                  <span className="font-black text-sm tracking-tight text-white">
                    {t('step3_title')}
                  </span>
                </div>
                <AudioNarrator 
                  textToNarrate={t('step3_desc')}
                  className="bg-white/20 text-white border-white/30"
                />
              </div>
              <p className="text-xs text-amber-100 font-medium mb-3">
                {t('step3_desc')}
              </p>
              <button
                onClick={onSubmitReviewRequest}
                className="w-full py-3.5 rounded-2xl bg-white text-slate-900 font-black text-sm shadow-md flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t('run_clash_check')}</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-3xl bg-slate-50 border border-dashed border-slate-200 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-200/80 text-slate-500 flex items-center justify-center font-black text-sm shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-600">
                    {t('step3_title')}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    ⏳ {t('awaiting_details')}
                  </p>
                </div>
              </div>
              <AudioNarrator 
                textToNarrate={t('awaiting_details')}
                className="shrink-0"
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          ROLE 2: DOCTOR / ASHA WORKER VIEW - REVIEW REQUESTS QUEUE
         ======================================================== */}
      {!isCitizen && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-emerald-700" />
                <span>{t('citizen_review_requests')}</span>
              </h2>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                {pendingRequests.length} {t('pending_badge')}
              </span>
            </div>
            <button
              onClick={() => loadData(true)}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 px-1 leading-relaxed">
            {t('welcome_subtitle')}
          </p>

          <div className="space-y-2.5">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => handleRecordClick(req)}
                className="bg-white p-4 rounded-3xl border border-slate-200/90 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {req.patient_name ? req.patient_name.charAt(0) : 'P'}
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block leading-tight">
                        {req.patient_name || 'Citizen'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {req.place_region || 'Rural Health Post'} • {formatDate(req.created_at)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{t('pending_badge')}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[10px] text-emerald-700 font-bold block">{t('botanical_herb_label')}</span>
                    <span className="font-extrabold text-slate-900 truncate block mt-0.5">
                      🌿 {req.remedy_name_local}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100">
                    <span className="text-[10px] text-blue-700 font-bold block">{t('modern_medicine_label')}</span>
                    <span className="font-extrabold text-slate-900 truncate block mt-0.5">
                      💊 {req.confirmed_medicine || 'Prescription Drug'}
                    </span>
                  </div>
                </div>

                {req.interaction_type && (
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{req.interaction_type}</span>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{t('open_case_signoff')}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* History & Case Log Feed */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-sm text-slate-900">
              {isCitizen ? t('my_cases_heading') : t('recent_cases_heading')}
            </h2>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {recentRecords.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {recentRecords.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] font-semibold text-slate-400 hover:text-red-600 transition-colors"
              >
                {t('clear_btn')}
              </button>
            )}
            <button
              onClick={() => loadData(true)}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {recentRecords.length === 0 ? (
          <div className="text-center py-4 px-3 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-500">
              {isCitizen 
                ? `🌿 ${t('awaiting_details')}` 
                : '🛡️ Incoming patient requests will appear here for clinical sign-off.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentRecords.slice(0, 4).map(rec => (
              <div
                key={rec.id}
                onClick={() => handleRecordClick(rec)}
                className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      {rec.remedy_name_local || 'Local Botanical'}
                    </span>
                    {rec.confirmed_medicine && (
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 font-medium">
                        + {rec.confirmed_medicine}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {rec.used_for_condition || 'General health wellness'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rec.status === 'completed' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : rec.status === 'pending_review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {rec.status === 'completed' ? t('verified_safe') : rec.status === 'pending_review' ? t('in_review') : t('draft_label')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {formatDate(rec.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspect Modal if record clicked by citizen */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Case Audit Details</h3>
              <button onClick={() => setInspectRecord(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="text-xs space-y-2 text-slate-700">
              <p><strong>Remedy:</strong> {inspectRecord.remedy_name_local}</p>
              <p><strong>Condition:</strong> {inspectRecord.used_for_condition}</p>
              <p><strong>Medicine:</strong> {inspectRecord.confirmed_medicine || 'None'}</p>
              <p><strong>Status:</strong> {inspectRecord.status}</p>
              <p><strong>Region:</strong> {inspectRecord.place_region || 'India'}</p>
              {inspectRecord.decision_notes && (
                <p className="p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <strong>Clinician Guidance:</strong> {inspectRecord.decision_notes}
                </p>
              )}
            </div>
            <button
              onClick={() => setInspectRecord(null)}
              className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-xs text-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
