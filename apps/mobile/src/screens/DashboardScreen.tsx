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
                ? '👨‍⚕️ Medical Officer Review Desk' 
                : currentRole === 'asha' 
                  ? '🩺 ASHA Community Health Portal' 
                  : (currentMode === 'village' ? '🌾 Village First • Audio Active' : '🏙️ Citizen Safety Portal')}
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
            ? 'Clinical Review Desk' 
            : currentRole === 'asha' 
              ? 'ASHA Health Post' 
              : t('welcome_title')}
        </h1>
        <p className="text-xs text-emerald-100/90 mt-1 font-medium leading-relaxed">
          {isCitizen 
            ? 'Follow the 3 simple steps below to verify if your home remedy is safe with your medicine.' 
            : 'Review citizen drug-herb interactions, verify causal graphs, and confirm safety decisions.'}
        </p>
      </div>

      {/* ========================================================
          ROLE 1: CITIZEN VIEW - 3-STEP GUIDED AUDIO / VISUAL FLOW
         ======================================================== */}
      {isCitizen && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>{t('step_guide_heading')}</span>
            </h2>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {t('guided_flow')}
            </span>
          </div>

          {/* STEP 1: RECORD BOTANICAL REMEDY */}
          <div className={`p-4 rounded-3xl border transition-all ${
            hasHerb 
              ? 'bg-emerald-50/60 border-emerald-300' 
              : 'bg-white border-slate-200 shadow-xs hover:border-emerald-500'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                  hasHerb ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {hasHerb ? '✓' : '1'}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {t('step1_title')}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {hasHerb 
                      ? `${t('added_label')}: ${activeDraft?.remedyNameLocal || activeDraft?.scientificName}` 
                      : t('step1_desc')}
                  </p>
                </div>
              </div>
              <AudioNarrator 
                textToNarrate={t('step1_desc')}
                className="shrink-0"
              />
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100">
              {hasHerb ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-100/70 rounded-2xl border border-emerald-300">
                  <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                    🌿 {activeDraft?.remedyNameLocal || activeDraft?.scientificName}
                  </span>
                  <button 
                    onClick={onStartRemedy}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-2.5 py-1 rounded-xl bg-white shadow-xs"
                  >
                    {t('change_btn')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={onStartRemedy}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-900 text-white shadow-md shadow-emerald-700/20 flex items-center justify-between transition-all active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                      <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <span className="block font-black text-sm text-white tracking-tight leading-snug">
                        {t('speak_or_type_herb')}
                      </span>
                      <span className="block text-[11px] text-emerald-100 font-medium mt-0.5">
                        {t('step1_desc')}
                      </span>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* STEP 2: ADD MODERN PRESCRIPTION MEDICINE */}
          <div className={`p-4 rounded-3xl border transition-all ${
            hasMedicine 
              ? 'bg-blue-50/60 border-blue-300' 
              : 'bg-white border-slate-200 shadow-xs hover:border-blue-500'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                  hasMedicine ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                }`}>
                  {hasMedicine ? '✓' : '2'}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {t('step2_title')}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {hasMedicine 
                      ? `${t('added_label')}: ${activeDraft?.confirmedMedicine?.brandName || activeDraft?.confirmedMedicine?.genericName}` 
                      : t('step2_desc')}
                  </p>
                </div>
              </div>
              <AudioNarrator 
                textToNarrate={t('step2_desc')}
                className="shrink-0"
              />
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100">
              {hasMedicine ? (
                <div className="flex items-center justify-between p-2.5 bg-blue-100/70 rounded-2xl border border-blue-300">
                  <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                    💊 {activeDraft?.confirmedMedicine?.brandName || activeDraft?.confirmedMedicine?.genericName}
                  </span>
                  <button 
                    onClick={onStartPrescription}
                    className="text-xs font-bold text-blue-800 hover:text-blue-950 px-2.5 py-1 rounded-xl bg-white shadow-xs"
                  >
                    {t('change_btn')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={onStartPrescription}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-700/20 flex items-center justify-between transition-all active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                      <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <span className="block font-black text-sm text-white tracking-tight leading-snug">
                        {t('add_rx_medicine_btn')}
                      </span>
                      <span className="block text-[11px] text-blue-100 font-medium mt-0.5">
                        {t('step2_desc')}
                      </span>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* STEP 3: SUBMIT FOR ASHA / DOCTOR REVIEW */}
          <div className={`p-4 rounded-3xl border transition-all ${
            readyToSubmit 
              ? 'bg-amber-50/70 border-amber-300 shadow-sm' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                  readyToSubmit ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  3
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {t('step3_title')}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {readyToSubmit 
                      ? t('step3_desc') 
                      : t('awaiting_details')}
                  </p>
                </div>
              </div>
              <AudioNarrator 
                textToNarrate={t('step3_desc')}
                className="shrink-0"
              />
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100">
              {readyToSubmit ? (
                <button
                  onClick={onSubmitReviewRequest}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 animate-pulse"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('send_for_review_btn')}</span>
                </button>
              ) : (
                <div className="text-[11px] text-slate-400 font-medium text-center py-1">
                  ⏳ {t('awaiting_details')}
                </div>
              )}
            </div>
          </div>
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
              {isCitizen ? 'My Submitted Reviews' : 'Recent Verified Cases'}
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
                Clear
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
                ? '🌿 Complete Step 1 & 2 above to check your first remedy safety.' 
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
                    {rec.status === 'completed' ? 'Verified Safe' : rec.status === 'pending_review' ? 'In Review' : 'Draft'}
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
