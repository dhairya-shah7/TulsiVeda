import React, { useEffect, useState } from 'react';
import { 
  Leaf, 
  Search, 
  X, 
  Pill, 
  Send, 
  Stethoscope, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert,
  AlertTriangle,
  Volume2,
  VolumeX,
  RotateCw,
  Home as HomeIcon,
  CheckCircle2,
  Mic,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { StorageService, StoredRecord } from '../services/storageService.ts';
import { AudioWaveform } from '../components/AudioWaveform.tsx';
import { t, useCurrentLanguage, LocalizationService } from '../services/localizationService.ts';
import { QueryResolverService, UnifiedQueryResponse } from '../services/queryResolverService.ts';
import { VoiceEngineService } from '../services/voiceEngineService.ts';
import { SafetyAnalysisResult } from '../services/safetyEngine.ts';
import { BotanicalSpecies } from '../services/botanicalDatabase.ts';

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
  const lang = useCurrentLanguage();
  const [stats, setStats] = useState({ remedies: 0, prescriptions: 0, alerts: 0, decisions: 0 });
  const [recentRecords, setRecentRecords] = useState<StoredRecord[]>([]);
  const [pendingRequests, setPendingRequests] = useState<StoredRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inspectRecord, setInspectRecord] = useState<StoredRecord | null>(null);

  // Home Voice & Text Consultation State
  const [queryInput, setQueryInput] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);
  const [activeResult, setActiveResult] = useState<UnifiedQueryResponse | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // In-card Prescription Cross-Check State
  const [rxInput, setRxInput] = useState('');
  const [rxClashResult, setRxClashResult] = useState<{
    drugEntity: { brandOrGenericName: string; genericName: string } | null;
    plantEntity: BotanicalSpecies | null;
    safetyResult: SafetyAnalysisResult | null;
    localizedNarrationText: string;
  } | null>(null);
  const [rxChecking, setRxChecking] = useState(false);
  const [activeTierTab, setActiveTierTab] = useState<'tier1' | 'tier2' | 'tier3'>('tier1');
  const [clashSent, setClashSent] = useState(false);

  // Audio Speech Control State
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsub = VoiceEngineService.addSpeechListener((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsub();
  }, []);

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

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('tulsiveda_user_name') || 
      (currentRole === 'doctor' ? 'Dr. Sharma' : currentRole === 'asha' ? 'Sunita Didi' : 'Aarav');
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('tulsiveda_user_name');
      if (stored) {
        setUserName(stored);
      } else {
        setUserName(currentRole === 'doctor' ? 'Dr. Sharma' : currentRole === 'asha' ? 'Sunita Didi' : 'Aarav');
      }
    };
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentRole]);

  const handleRecordClick = (rec: StoredRecord) => {
    if (onSelectRecord) {
      onSelectRecord(rec);
    } else {
      setInspectRecord(rec);
    }
  };

  // Execute Dynamic Clinical Resolution
  const handleExecuteQuery = async (queryText: string) => {
    const q = (queryText || '').trim();
    if (!q) return;

    setQueryLoading(true);
    setRxClashResult(null);
    setClashSent(false);

    try {
      const response = await QueryResolverService.resolveQuery(q, lang);
      setActiveResult(response);

      // ONLY auto-play TalkBack speech if current mode is village!
      if (currentMode === 'village' && response.localizedNarrationText) {
        VoiceEngineService.speakInLanguage(response.localizedNarrationText, lang as any);
      }
    } catch (err) {
      console.error('[Dashboard] Error resolving query:', err);
    } finally {
      setQueryLoading(false);
    }
  };

  // Cross-check prescription tablet against the recommended remedy
  const handleCheckPrescription = async (overrideMedicine?: string) => {
    const medicineToTest = overrideMedicine || rxInput;
    if (!medicineToTest.trim() || !activeResult) return;

    setRxChecking(true);
    try {
      const targetHerb = activeResult.suggestedPrescriptionCheckHerb || 
                         activeResult.detectedHerbName || 
                         (activeResult.conditionRecord?.ayushClassicalFormulation.scientificBotanical) || 
                         'Curcuma longa';

      const clash = await QueryResolverService.verifyPrescriptionClash(targetHerb, medicineToTest, lang);
      setRxClashResult(clash);

      // In village mode, auto-play clash verdict audio
      if (currentMode === 'village' && clash.localizedNarrationText) {
        VoiceEngineService.speakInLanguage(clash.localizedNarrationText, lang as any);
      }
    } catch (err) {
      console.error('[Dashboard] Error checking prescription clash:', err);
    } finally {
      setRxChecking(false);
    }
  };

  // Send Clash Report to Doctor / ASHA Worker
  const handleSendClashToDoctor = () => {
    if (!activeResult) return;
    const remedyName = activeResult.detectedHerbName || activeResult.detectedPlant?.commonName || 'Botanical Remedy';
    const medicineName = rxClashResult?.drugEntity?.brandOrGenericName || activeResult.detectedDrugName || 'Prescription Drug';
    const condition = activeResult.conditionRecord?.conditionName || 'Herb-Drug Clash Consultation';

    StorageService.saveRecord({
      id: 'clash_' + Date.now(),
      remedy_name_local: remedyName,
      confirmed_species: activeResult.detectedPlant?.scientificName || remedyName,
      confirmed_medicine: medicineName,
      used_for_condition: condition,
      prepared_by: userName || 'Citizen',
      place_region: currentMode === 'village' ? 'Village Health Post' : 'Urban Community',
      language: lang,
      status: 'pending_review',
      decision_notes: rxClashResult?.safetyResult?.alertHeadline || activeResult.safetyAnalysis?.alertHeadline || 'Severe herb-drug interaction flagged by patient.',
    });

    setClashSent(true);
    loadData();
    if (onSubmitReviewRequest) onSubmitReviewRequest();
  };

  const handleToggleAudio = () => {
    if (isSpeaking) {
      VoiceEngineService.stopSpeech();
    } else {
      const text = rxClashResult?.localizedNarrationText || activeResult?.localizedNarrationText;
      if (text) {
        VoiceEngineService.speakInLanguage(text, lang as any);
      }
    }
  };

  const isCitizen = currentRole === 'citizen';

  // Quick 1-tap localized prompts
  const quickPrompts = lang === 'hi' ? [
    { label: 'घुटनों में दर्द (Knee Pain)', text: 'मुझे घुटनों में दर्द है, क्या इस्तेमाल करें?' },
    { label: 'तुलसी (Tulsi)', text: 'तुलसी' },
    { label: 'खांसी व जुकाम (Cough)', text: 'खांसी और जुकाम के लिए नुस्खा' },
    { label: 'तुलसी + बीपी की दवा (Clash Check)', text: 'क्या मैं तुलसी और बीपी की दवा साथ ले सकती हूँ?' },
  ] : lang === 'gu' ? [
    { label: 'ગોઠણનો દુખાવો (Knee Pain)', text: 'મને ગોઠણનો દુખાવો છે, શું વાપરવું?' },
    { label: 'તુલસી (Tulsi)', text: 'તુલસી' },
    { label: 'શરદી અને ખાંસી (Cough)', text: 'શરદી અને ખાંસી માટે દવા' },
    { label: 'તુલસી + બીપી દવા (Clash Check)', text: 'શું હું બીપીની દવા સાથે તુલસીનો ઉકાળો લઈ શકું?' },
  ] : [
    { label: 'Knee Pain', text: 'I have pain in my knees what to use' },
    { label: 'Tulsi', text: 'Tulsi' },
    { label: 'Cough & Cold', text: 'Cough and cold remedy' },
    { label: 'Tulsi + BP Medicine (Clash)', text: 'Can I take Tulsi with BP medicine?' },
  ];

  return (
    <div className="space-y-4 max-w-md mx-auto pb-24">
      
      {/* ========================================================
          CLEAN PATIENT HEADER (No AI clutter, authentic greeting)
         ======================================================== */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {currentRole === 'doctor' 
              ? '👨‍⚕️ Medical Officer' 
              : currentRole === 'asha' 
                ? '🩺 ASHA Community Desk' 
                : (currentMode === 'village' ? '🌾 Village Mode (આરોગ્ય સહાય)' : '🏙️ Citizen Health')}
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {t('namaste') || '🙏'} {userName}
          </h1>
        </div>

        {/* Global Speech Pause/Stop Pill (Appears when audio is playing) */}
        {isSpeaking && (
          <button
            onClick={() => VoiceEngineService.stopSpeech()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-white font-black text-xs shadow-md animate-pulse active:scale-95 transition-all"
          >
            <VolumeX className="w-4 h-4" />
            <span>{lang === 'hi' ? 'आवाज़ रोकें' : lang === 'gu' ? 'અવાજ બંધ કરો' : 'Stop Voice'}</span>
          </button>
        )}
      </div>

      {/* ========================================================
          ROLE: CITIZEN VIEW - UNIFIED VOICE & QUERY HERO
         ======================================================== */}
      {isCitizen && (
        <div className="space-y-4">
          
          {/* Main Hero Card: Tap Mic or Type */}
          <div className="rounded-[32px] bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 p-6 text-white shadow-xl border border-emerald-700/50 relative overflow-hidden">
            <Leaf className="absolute -right-8 -bottom-10 w-44 h-44 text-emerald-400/10 pointer-events-none transform -rotate-12" />

            <div className="relative z-10 text-center space-y-4">
              <div>
                <h2 className="text-lg font-black tracking-tight leading-tight">
                  {lang === 'hi' 
                    ? 'अपनी बीमारी या घरेलू नुस्खे के बारे में पूछें' 
                    : lang === 'gu' 
                    ? 'તમારી બીમારી કે દેશી ઔષધિ વિશે પૂછો' 
                    : 'Ask about any Symptom, Herb or Medicine'}
                </h2>
                <p className="text-xs text-emerald-100/80 mt-1 font-medium">
                  {lang === 'hi' 
                    ? 'माइक दबाकर बोलें या नीचे लिखकर पूछें:' 
                    : lang === 'gu' 
                    ? 'માઇક દબાવીને બોલો અથવા નીચે લખો:' 
                    : 'Tap mic to speak in your language or type below:'}
                </p>
              </div>

              {/* Big Central Tactile Mic Button */}
              <div className="flex justify-center pt-1">
                <button
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl active:scale-95 ${
                    isVoiceActive 
                      ? 'bg-red-600 text-white ring-4 ring-red-400/50 animate-pulse' 
                      : 'bg-white text-emerald-900 hover:bg-emerald-50 shadow-emerald-950/40'
                  }`}
                  aria-label="Microphone"
                >
                  <Mic className={`w-9 h-9 stroke-[2.3] ${isVoiceActive ? 'text-white' : 'text-emerald-800'}`} />
                </button>
              </div>

              {/* Embedded Voice Waveform & Live Transcription */}
              {isVoiceActive && (
                <div className="p-3 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 animate-fade-in">
                  <AudioWaveform
                    language={lang}
                    isProcessing={queryLoading}
                    onRecordingComplete={async (blob: Blob, liveTranscript?: string) => {
                      setIsVoiceActive(false);
                      const textToRun = (liveTranscript || '').trim();
                      if (textToRun) {
                        setQueryInput(textToRun);
                        await handleExecuteQuery(textToRun);
                      }
                    }}
                  />
                </div>
              )}

              {/* Clean Text Search Bar */}
              <div className="relative pt-1">
                <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-emerald-600/30">
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleExecuteQuery(queryInput)}
                    placeholder={
                      lang === 'hi' 
                        ? 'उदा: घुटने का दर्द, तुलसी, या बीपी की दवा...' 
                        : lang === 'gu' 
                        ? 'દા.ત: ગોઠણનો દુખાવો, તુલસી, બીપી દવા...' 
                        : 'e.g. knee pain, Tulsi, cough remedy...'
                    }
                    className="flex-1 px-3 py-2 text-slate-900 text-xs font-semibold placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                  <button
                    onClick={() => handleExecuteQuery(queryInput)}
                    disabled={!queryInput.trim() || queryLoading}
                    className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white shadow-xs shrink-0 active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Quick 1-Tap Chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQueryInput(p.text);
                      handleExecuteQuery(p.text);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-[10px] font-bold text-emerald-100 border border-white/20 transition-all text-left truncate max-w-[170px]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          {queryLoading && (
            <div className="p-6 text-center space-y-2 bg-white rounded-3xl border border-slate-200 shadow-sm animate-pulse">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">
                {lang === 'hi' ? 'चिकित्सा अभिलेखों में खोज रहे हैं...' : lang === 'gu' ? 'દવા અને ઔષધિ ચકાસી રહ્યા છીએ...' : 'Consulting National Clinical Records...'}
              </p>
            </div>
          )}

          {/* ========================================================
              DYNAMIC CLINICAL ANSWER CONTAINER
             ======================================================== */}
          {activeResult && !queryLoading && (
            <div className="space-y-3 animate-fade-in">
              
              {/* Context Bar: You Asked + Audio Controls */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    {lang === 'hi' ? 'आपका प्रश्न' : lang === 'gu' ? 'તમારો પ્રશ્ન' : 'Your Query'}
                  </span>
                  <p className="text-xs font-black text-slate-900 truncate">
                    "{activeResult.queryText}"
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleToggleAudio}
                    title="Listen answer"
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                      isSpeaking 
                        ? 'bg-amber-100 border-amber-300 text-amber-900' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-700" /> : <Volume2 className="w-4 h-4 text-slate-700" />}
                    <span className="text-[11px]">{isSpeaking ? 'Pause' : 'Listen'}</span>
                  </button>

                  <button
                    onClick={() => setActiveResult(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ----------------------------------------------------
                  BRANCH 1: 1 DISEASE / SYMPTOM -> 3-TIER TREATMENT
                 ---------------------------------------------------- */}
              {activeResult.type === 'symptom_3tier' && activeResult.conditionRecord && (
                <div className="space-y-3">
                  
                  {/* Identified Disease Title */}
                  <div className="px-1">
                    <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                      {lang === 'hi' ? 'पहचाना गया विकार' : lang === 'gu' ? 'ઓળખાયેલ રોગ/લક્ષણ' : 'Diagnosed Condition'}
                    </span>
                    <h3 className="text-base font-black text-slate-900">
                      {activeResult.conditionRecord.conditionName}
                    </h3>
                  </div>

                  {/* 3-Tier Tabs Switcher */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-2xl">
                    {[
                      { id: 'tier1', label: 'Tier 1', sub: 'Jan Aushadhi', icon: Pill },
                      { id: 'tier2', label: 'Tier 2', sub: 'AYUSH', icon: Leaf },
                      { id: 'tier3', label: 'Tier 3', sub: 'Kitchen', icon: HomeIcon },
                    ].map(tab => {
                      const Icon = tab.icon;
                      const active = activeTierTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTierTab(tab.id as any)}
                          className={`py-2 px-1 rounded-xl text-center transition-all ${
                            active 
                              ? 'bg-white text-emerald-950 font-black shadow-xs' 
                              : 'text-slate-600 font-bold hover:text-slate-900'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 mx-auto mb-0.5" />
                          <span className="block text-[11px] leading-tight">{tab.label}</span>
                          <span className="block text-[9px] opacity-75 truncate">{tab.sub}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tier 1: Jan Aushadhi Generic */}
                  {activeTierTab === 'tier1' && (
                    <div className="p-4 rounded-3xl bg-blue-50/90 border-2 border-blue-400 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider">
                          Tier 1 • Official Govt Generic
                        </span>
                        <span className="text-[10px] font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-300">
                          PMBJP Kendra
                        </span>
                      </div>
                      <h4 className="text-base font-black text-blue-950">
                        {activeResult.conditionRecord.officialGeneric.medicineName}
                      </h4>
                      <div className="text-xs font-semibold text-blue-900/90 space-y-1">
                        <p>• <strong>Generic Salt:</strong> {activeResult.conditionRecord.officialGeneric.genericSalt}</p>
                        <p>• <strong>Govt Subsidized Price:</strong> {activeResult.conditionRecord.officialGeneric.pmbjpPriceINR}</p>
                        <p>• <strong>Schedule:</strong> {activeResult.conditionRecord.officialGeneric.standardDosageSchedule}</p>
                      </div>
                    </div>
                  )}

                  {/* Tier 2: AYUSH Monograph */}
                  {activeTierTab === 'tier2' && (
                    <div className="p-4 rounded-3xl bg-emerald-50/90 border-2 border-emerald-400 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider">
                          Tier 2 • Official AYUSH Monograph
                        </span>
                        <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          API Pharmacopoeia
                        </span>
                      </div>
                      <h4 className="text-base font-black text-emerald-950">
                        {activeResult.conditionRecord.ayushClassicalFormulation.formulationName}
                      </h4>
                      <div className="text-xs font-semibold text-emerald-900/90 space-y-1">
                        <p>• <strong>Botanical:</strong> <em>{activeResult.conditionRecord.ayushClassicalFormulation.scientificBotanical}</em></p>
                        <p>• <strong>Active Compound:</strong> {activeResult.conditionRecord.ayushClassicalFormulation.activePhytochemical}</p>
                        <p>• <strong>Dosage & Anupana:</strong> {activeResult.conditionRecord.ayushClassicalFormulation.ayushDosage} with {activeResult.conditionRecord.ayushClassicalFormulation.anupanaDietaryMedium}</p>
                      </div>
                    </div>
                  )}

                  {/* Tier 3: Kitchen Safe Remedy */}
                  {activeTierTab === 'tier3' && (
                    <div className="p-4 rounded-3xl bg-amber-50/90 border-2 border-amber-400 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider">
                          Tier 3 • Verified Kitchen First Aid
                        </span>
                        <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          Safe Home Recipe
                        </span>
                      </div>
                      <h4 className="text-base font-black text-amber-950">
                        {activeResult.conditionRecord.verifiedHomeRemedy.kitchenItem}
                      </h4>
                      <div className="text-xs font-semibold text-amber-950/90 space-y-1">
                        <p>• <strong>Preparation:</strong> {activeResult.conditionRecord.verifiedHomeRemedy.preparationMethod}</p>
                        <p>• <strong>Mode:</strong> {activeResult.conditionRecord.verifiedHomeRemedy.modeOfAdministration}</p>
                        <p className="text-red-700 font-bold">• <strong>Caution:</strong> {activeResult.conditionRecord.verifiedHomeRemedy.contraindicationWarning}</p>
                      </div>
                    </div>
                  )}

                  {/* Hospital Warning */}
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Seek immediate clinic care if: <strong>{activeResult.conditionRecord.escalationProtocol.dangerSigns[0]}</strong>.</span>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  BRANCH 2: 1 INGREDIENT / HERB -> VICE-VERSA DISCOVERY
                 ---------------------------------------------------- */}
              {activeResult.type === 'herb_vice_versa' && activeResult.detectedPlant && (
                <div className="p-5 rounded-3xl bg-white border-2 border-emerald-400 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider">
                      🌿 ઔષધિ વિગતો (Herb Discovery)
                    </span>
                    <span className="text-[10px] italic font-semibold text-slate-500">
                      {activeResult.detectedPlant.scientificName}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">
                    🌿 {activeResult.detectedPlant.commonName}
                  </h3>

                  {/* Vice Versa: Conditions it treats */}
                  {activeResult.viceVersaGenericMedicine && (
                    <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                      <span className="font-extrabold block text-blue-950 text-xs">
                        💊 સમાન સરકારી જન ઔષધિ દવા (Govt Generic Equivalent):
                      </span>
                      <p className="font-bold text-sm text-blue-900">
                        {activeResult.viceVersaGenericMedicine.medicineName}
                      </p>
                      <p className="text-[11px] text-blue-700">
                        રોગ: {activeResult.viceVersaGenericMedicine.conditionName} • સરકારી કિંમત: {activeResult.viceVersaGenericMedicine.price}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-slate-700 space-y-1">
                    <p>• <strong>મુખ્ય ઉપયોગ (Used For):</strong> {activeResult.detectedPlant.traditionalUses.slice(0, 3).join(', ')}</p>
                    <p>• <strong>સક્રિય તત્વો (Active Compounds):</strong> {activeResult.detectedPlant.activeConstituents.join(', ')}</p>
                    <p>• <strong>જૈવિક માર્ગ:</strong> {activeResult.detectedPlant.metabolicEnzymes.join(', ')}</p>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  BRANCH 3: 2 INGREDIENTS -> CLASH ANALYSIS & DOCTOR REPORT
                 ---------------------------------------------------- */}
              {activeResult.type === 'direct_safety_check' && activeResult.safetyAnalysis && (
                <div className={`p-5 rounded-3xl border-2 shadow-xs space-y-3 ${
                  activeResult.safetyAnalysis.confidence === 'High' && activeResult.safetyAnalysis.evidenceLevel === 'established'
                    ? 'bg-rose-50 border-rose-500 text-rose-950'
                    : activeResult.safetyAnalysis.hasInteraction
                    ? 'bg-amber-50 border-amber-500 text-amber-950'
                    : 'bg-emerald-50 border-emerald-500 text-emerald-950'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-white text-[10px] font-black uppercase tracking-wider ${
                      activeResult.safetyAnalysis.confidence === 'High' && activeResult.safetyAnalysis.evidenceLevel === 'established'
                        ? 'bg-rose-700'
                        : activeResult.safetyAnalysis.hasInteraction
                        ? 'bg-amber-700'
                        : 'bg-emerald-700'
                    }`}>
                      {activeResult.safetyAnalysis.hasInteraction ? '⚠️ દવા અને ઔષધિ વચ્ચે વિરોધાભાસ (Clash Detected)' : '✓ બંને સાથે લેવું સુરક્ષિત છે (Safe)'}
                    </span>
                    <span className="text-[10px] font-mono font-bold">
                      {activeResult.safetyAnalysis.confidence} Confidence
                    </span>
                  </div>

                  <h3 className="text-base font-black leading-snug">
                    {activeResult.safetyAnalysis.alertHeadline}
                  </h3>

                  <p className="text-xs font-semibold leading-relaxed">
                    {activeResult.localizedNarrationText}
                  </p>

                  {/* PubMed Evidence citation */}
                  {activeResult.safetyAnalysis.evidenceSummary?.pmidOrId && (
                    <p className="text-[10px] font-mono opacity-80 pt-1">
                      Evidence: {activeResult.safetyAnalysis.evidenceSummary.pmidOrId} • {activeResult.safetyAnalysis.evidenceSummary.publication}
                    </p>
                  )}

                  {/* Send Clash Report to Doctor / ASHA Worker Button */}
                  {activeResult.safetyAnalysis.hasInteraction && (
                    <div className="pt-2">
                      {clashSent ? (
                        <div className="p-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>✓ ડોક્ટર / આશા દીદીને કેસ મોકલી દેવાયો છે (Sent to Clinician)</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleSendClashToDoctor}
                          className="w-full py-3 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                        >
                          <Send className="w-4 h-4" />
                          <span>{lang === 'hi' ? 'डॉक्टर / आशा दीदी को जांच हेतु भेजें' : lang === 'gu' ? 'આ કેસ ડોક્ટર / આશા દીદીને મોકલો' : 'Send Clash Report to Doctor / ASHA Worker'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ----------------------------------------------------
                  SEAMLESS IN-CARD PRESCRIPTION CROSS-CHECK DRAWER
                 ---------------------------------------------------- */}
              {activeResult.type !== 'direct_safety_check' && (
                <div className="p-4 rounded-3xl bg-slate-900 text-white space-y-2.5 shadow-md">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                    <h4 className="font-extrabold text-xs text-slate-100">
                      {lang === 'hi' 
                        ? 'क्या आप कोई नियमित गोली (बीपी, शुगर, खून पतला) लेते हैं?' 
                        : lang === 'gu' 
                        ? 'શું તમે કોઈ નિયમિત દવા (બીપી, સુગર, લોહી પાતળું) લો છો?' 
                        : 'Taking any regular medicine? Check for Clashes'}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rxInput}
                      onChange={(e) => setRxInput(e.target.value)}
                      placeholder="e.g. Warfarin, Amlodipine, Metformin, Aspirin"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                    <button
                      onClick={() => handleCheckPrescription()}
                      disabled={!rxInput.trim() || rxChecking}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-extrabold text-xs shrink-0 shadow-xs transition-all"
                    >
                      {rxChecking ? '...' : (lang === 'hi' ? 'जांचें' : lang === 'gu' ? 'ચકાસો' : 'Check')}
                    </button>
                  </div>

                  {/* 1-Tap Medicine Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {['Warfarin', 'Amlodipine', 'Aspirin', 'Metformin'].map(m => (
                      <button
                        key={m}
                        onClick={() => {
                          setRxInput(m);
                          handleCheckPrescription(m);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 border border-slate-700"
                      >
                        + {m}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Clash Result Box */}
                  {rxClashResult && (
                    <div className={`mt-2.5 p-3 rounded-2xl border text-xs space-y-1.5 ${
                      rxClashResult.safetyResult?.confidence === 'High' && rxClashResult.safetyResult?.evidenceLevel === 'established'
                        ? 'bg-rose-950/90 border-rose-500 text-rose-100'
                        : rxClashResult.safetyResult?.hasInteraction
                        ? 'bg-amber-950/90 border-amber-500 text-amber-100'
                        : 'bg-emerald-950/90 border-emerald-500 text-emerald-100'
                    }`}>
                      <span className="font-black block text-xs">
                        {rxClashResult.safetyResult?.alertHeadline || 'Prescription Cross-Check Result'}
                      </span>
                      <p className="text-[11px] leading-relaxed opacity-90">
                        {rxClashResult.localizedNarrationText}
                      </p>

                      {/* Doctor Report Button inside drawer */}
                      {rxClashResult.safetyResult?.hasInteraction && (
                        <div className="pt-1">
                          {clashSent ? (
                            <span className="text-[10px] font-bold text-emerald-300">✓ Sent to Doctor</span>
                          ) : (
                            <button
                              onClick={handleSendClashToDoctor}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px]"
                            >
                              Send Clash Report to Doctor
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* Subtle link for full case intake if needed */}
          <div className="pt-2 text-center">
            <button
              onClick={onStartRemedy}
              className="text-xs font-semibold text-slate-500 hover:text-emerald-800 underline transition-colors"
            >
              {lang === 'hi' ? 'विस्तृत पर्चा या पौधा दर्ज करने के लिए यहाँ क्लिक करें' : lang === 'gu' ? 'સંપૂર્ણ કેસ ફોર્મ ભરવા માટે અહીં ક્લિક કરો' : 'Want to record full clinical case intake? Tap here'}
            </button>
          </div>

        </div>
      )}

      {/* ========================================================
          ROLE: ASHA / DOCTOR REVIEW DESK
         ======================================================== */}
      {!isCitizen && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-md">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>Pending Clinical Consultations ({pendingRequests.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Review flagged herb-drug clashes and provide prescription guidance.
            </p>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-500">
              No pending patient cases. All records clear!
            </div>
          ) : (
            <div className="space-y-2">
              {pendingRequests.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => handleRecordClick(rec)}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 cursor-pointer shadow-xs transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      🌿 {rec.remedy_name_local} {rec.confirmed_medicine ? `+ 💊 ${rec.confirmed_medicine}` : ''}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Patient: {rec.prepared_by} • {rec.used_for_condition}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Inspect Modal if record clicked */}
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
