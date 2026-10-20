import React, { useState } from 'react';
import { 
  X, Mic, Send, Camera, AlertTriangle, CheckCircle2, 
  ShieldAlert, Volume2, Pill, Leaf, Home as HomeIcon, 
  Sparkles, ArrowRight, ShieldCheck, FileText, ChevronDown 
} from 'lucide-react';
import { 
  QueryResolverService, 
  UnifiedQueryResponse 
} from '../services/queryResolverService';
import { VoiceEngineService } from '../services/voiceEngineService';
import { AudioWaveform } from './AudioWaveform';
import { BOTANICAL_DATABASE, BotanicalSpecies } from '../services/botanicalDatabase';
import { useCurrentLanguage, t } from '../services/localizationService';
import { SafetyAnalysisResult } from '../services/safetyEngine';
import { OcrService } from '../services/ocrService';

interface RealWorldQueryModalProps {
  isOpen: boolean;
  initialMode?: 'voice' | 'text' | 'image' | 'plant';
  onClose: () => void;
  onSelectHerb?: (herbName: string, scientificName: string) => void;
}

export const RealWorldQueryModal: React.FC<RealWorldQueryModalProps> = ({
  isOpen,
  initialMode = 'voice',
  onClose,
  onSelectHerb,
}) => {
  const lang = useCurrentLanguage();
  const [activeMode, setActiveMode] = useState<'voice' | 'text' | 'image' | 'plant'>(initialMode);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UnifiedQueryResponse | null>(null);

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

  React.useEffect(() => {
    setActiveMode(initialMode);
    setResult(null);
    setRxClashResult(null);
    setTextInput('');
    setRxInput('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Process query through Unified Dynamic Medical Resolver
  const handleExecuteQuery = async (queryToRun: string) => {
    const q = (queryToRun || '').trim();
    if (!q) return;

    setLoading(true);
    setRxClashResult(null);
    try {
      const response = await QueryResolverService.resolveQuery(q, lang);
      setResult(response);

      // Auto-narrate response in user's selected language
      if (response.localizedNarrationText) {
        VoiceEngineService.speakInLanguage(response.localizedNarrationText, lang as any);
      }
    } catch (err) {
      console.error('[QueryModal] Error resolving query:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cross-check prescription medicine against recommended remedy
  const handleCheckPrescription = async (overrideRx?: string) => {
    const medicineToTest = overrideRx || rxInput;
    if (!medicineToTest.trim() || !result) return;

    setRxChecking(true);
    try {
      const targetHerb = result.suggestedPrescriptionCheckHerb || 
                         result.detectedHerbName || 
                         (result.conditionRecord?.ayushClassicalFormulation.scientificBotanical) || 
                         'Curcuma longa';

      const clash = await QueryResolverService.verifyPrescriptionClash(targetHerb, medicineToTest, lang);
      setRxClashResult(clash);

      if (clash.localizedNarrationText) {
        VoiceEngineService.speakInLanguage(clash.localizedNarrationText, lang as any);
      }
    } catch (err) {
      console.error('[QueryModal] Error checking prescription:', err);
    } finally {
      setRxChecking(false);
    }
  };

  // Handle OCR for Prescription or Herb leaf
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const scanResult = await OcrService.processImage(file);
      const textToQuery = scanResult.detectedMedicines.length > 0
        ? scanResult.detectedMedicines.map(m => `${m.brandName} ${m.genericName}`).join(' ')
        : scanResult.rawExtractedLines.join(' ');

      if (textToQuery) {
        setTextInput(textToQuery);
        await handleExecuteQuery(textToQuery);
      }
    } catch (err) {
      console.error('[QueryModal] OCR error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakNarration = () => {
    if (rxClashResult?.localizedNarrationText) {
      VoiceEngineService.speakInLanguage(rxClashResult.localizedNarrationText, lang as any);
    } else if (result?.localizedNarrationText) {
      VoiceEngineService.speakInLanguage(result.localizedNarrationText, lang as any);
    }
  };

  // Sample real-world queries in user's language
  const samplePrompts = lang === 'hi' ? [
    'मुझे घुटनों में दर्द है, क्या इस्तेमाल करें?',
    'क्या मैं तुलसी का काढ़ा अपनी बीपी की दवा के साथ ले सकती हूँ?',
    'खांसी और जुकाम के लिए घरेलू नुस्खा',
    'डायबिटीज और शुगर कम करने के उपाय'
  ] : lang === 'gu' ? [
    'મને ગોઠણનો દુખાવો છે, શું વાપરવું?',
    'શું હું બીપીની દવા સાથે તુલસીનો ઉકાળો લઈ શકું?',
    'શરદી અને ખાંસી માટે ઘરગથ્થુ ઉપચાર',
    'ડાયાબિટીસ માટે જન ઔષધિ અને દેશી દવા'
  ] : lang === 'pa' ? [
    'ਮੈਨੂੰ ਗੋਡਿਆਂ ਦਾ ਦਰਦ ਹੈ, ਕੀ ਵਰਤਿਆ ਜਾਵੇ?',
    'ਕੀ ਮੈਂ ਤੁਲਸੀ ਦਾ ਕਾੜ੍ਹਾ ਬੀਪੀ ਦੀ ਦਵਾਈ ਨਾਲ ਲੈ ਸਕਦੀ ਹਾਂ?',
    'ਖੰਘ ਅਤੇ ਜ਼ੁਕਾਮ ਲਈ ਘਰੇਲੂ ਉਪਚਾਰ'
  ] : [
    'I have pain in my knees what to use',
    'Can I take Tulsi decoction with my blood pressure medicine?',
    'Remedy for acute cough and cold',
    'Metformin generic and herbal alternatives for diabetes'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg max-h-[92vh] flex flex-col bg-slate-50 rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base font-black tracking-tight">
              {lang === 'hi' ? 'वास्तविक स्वास्थ्य परामर्श' : lang === 'gu' ? 'વાસ્તવિક આરોગ્ય પરામર્શ' : 'Real-World Health Query'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {(result || rxClashResult) && (
              <button
                onClick={handleSpeakNarration}
                title="TalkBack Voice Output"
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input Mode Selector Bar */}
        <div className="flex border-b border-slate-200 bg-white px-2 pt-2 gap-1 overflow-x-auto">
          {[
            { id: 'voice', label: lang === 'hi' ? 'बोलें' : lang === 'gu' ? 'બોલો' : 'Voice', icon: Mic },
            { id: 'text', label: lang === 'hi' ? 'लिखें' : lang === 'gu' ? 'લખો' : 'Text', icon: Send },
            { id: 'image', label: lang === 'hi' ? 'फोटो' : lang === 'gu' ? 'ફોટો' : 'Image/OCR', icon: Camera },
            { id: 'plant', label: lang === 'hi' ? 'पौधा' : lang === 'gu' ? 'વનસ્પતિ' : 'Plants', icon: Leaf },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id as any)}
                className={`flex-1 min-w-[70px] py-2.5 text-xs font-black flex items-center justify-center gap-1.5 rounded-t-xl transition-all ${
                  active 
                    ? 'bg-slate-50 text-emerald-800 border-t-2 border-emerald-600 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* ================= MODE: VOICE ================= */}
          {activeMode === 'voice' && !result && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {lang === 'hi' ? 'अपनी भाषा में बोलें' : lang === 'gu' ? 'તમારી ભાષામાં બોલો' : 'Speak in your language'}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  AI4Bharat IndicConformer / Project Vaani Native Speech Recognition
                </p>
              </div>

              <AudioWaveform
                language={lang}
                isProcessing={loading}
                onRecordingComplete={async (blob: Blob, liveTranscript?: string) => {
                  try {
                    setLoading(true);
                    const res = await VoiceEngineService.transcribeAudio(blob, lang as any, liveTranscript);
                    if (res.text) {
                      setTextInput(res.text);
                      await handleExecuteQuery(res.text);
                    }
                  } catch (err) {
                    console.error('[QueryModal] Transcription error:', err);
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            </div>
          )}

          {/* ================= MODE: TEXT ================= */}
          {activeMode === 'text' && !result && (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={
                    lang === 'hi' 
                      ? 'उदा: मुझे घुटनों में दर्द है क्या लें? या क्या मैं तुलसी और बीपी की दवा साथ ले सकती हूँ?'
                      : lang === 'gu'
                      ? 'દા.ત: મને ગોઠણનો દુખાવો છે, શું વાપરવું? અથવા શું હું બીપીની દવા સાથે તુલસી લઈ શકું?'
                      : 'Ask symptom (e.g. knee pain, cough) or drug interaction (e.g. Tulsi with BP medicine)...'
                  }
                  rows={3}
                  className="w-full p-3.5 rounded-2xl bg-white border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs resize-none"
                />
                <button
                  onClick={() => handleExecuteQuery(textInput)}
                  disabled={!textInput.trim() || loading}
                  className="mt-2 w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Analyzing Clinical Records...' : (lang === 'hi' ? 'उत्तर प्राप्त करें' : lang === 'gu' ? 'જવાબ મેળવો' : 'Resolve Query')}</span>
                </button>
              </div>

              {/* Sample 1-Tap Chips */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : lang === 'gu' ? 'વારંવાર પૂછાતા પ્રશ્નો' : 'Sample Real Queries'}
                </span>
                <div className="flex flex-col gap-1.5">
                  {samplePrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setTextInput(prompt);
                        handleExecuteQuery(prompt);
                      }}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-900 font-bold text-xs text-left shadow-xs transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">"{prompt}"</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= MODE: IMAGE / OCR ================= */}
          {activeMode === 'image' && !result && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">
                  {lang === 'hi' ? 'पर्चा या पौधे की फोटो खींचें' : lang === 'gu' ? 'દવાની ચબરખી અથવા વનસ્પતિનો ફોટો' : 'Scan Prescription or Plant Leaf'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Client-side Tesseract OCR extracts doctor's drug salts and CDSCO names instantly.
                </p>
              </div>

              <label className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs cursor-pointer shadow-md">
                <Camera className="w-4 h-4" />
                <span>{lang === 'hi' ? 'कैमरा खोलें / फोटो चुनें' : lang === 'gu' ? 'કેમેરા ખોલો / ફોટો પસંદ કરો' : 'Take Photo / Upload'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </label>
            </div>
          )}

          {/* ================= MODE: PLANT CATALOG ================= */}
          {activeMode === 'plant' && !result && (
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Official AYUSH Botanical Database (50+ Species)
              </span>
              <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
                {BOTANICAL_DATABASE.slice(0, 16).map((plant, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (onSelectHerb) {
                        onSelectHerb(plant.commonName, plant.scientificName);
                        onClose();
                      } else {
                        handleExecuteQuery(plant.commonName);
                      }
                    }}
                    className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 text-left shadow-xs transition-all hover:bg-emerald-50/40"
                  >
                    <span className="text-base block mb-1">🌿</span>
                    <span className="text-xs font-black text-slate-900 block truncate">
                      {plant.commonName}
                    </span>
                    <span className="text-[10px] italic text-slate-500 block truncate">
                      {plant.scientificName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= LOADING SPINNER ================= */}
          {loading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">
                Searching National Clinical Records & Cytochrome P450 Pathways...
              </p>
            </div>
          )}

          {/* ========================================================
              CASE 1: SYMPTOM QUERY -> 3-TIER RECOMMENDATION CARD
             ======================================================== */}
          {result && result.type === 'symptom_3tier' && result.conditionRecord && (
            <div className="space-y-4">
              {/* Query Context Header */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    {lang === 'hi' ? 'पहचाना गया विकार' : lang === 'gu' ? 'ઓળખાયેલ રોગ/લક્ષણ' : 'Diagnosed Condition'}
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {result.conditionRecord.conditionName}
                  </span>
                </div>
                <button
                  onClick={() => setResult(null)}
                  className="text-xs font-extrabold text-emerald-700 hover:underline"
                >
                  {lang === 'hi' ? 'नया प्रश्न' : lang === 'gu' ? 'નવો પ્રશ્ન' : 'Ask another'}
                </button>
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

              {/* TIER 1 CONTENT: JAN AUSHADHI */}
              {activeTierTab === 'tier1' && (
                <div className="p-4 rounded-3xl bg-blue-50/80 border-2 border-blue-400 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                      Tier 1 • Official Govt Generic
                    </span>
                    <span className="text-[10px] font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                      CDSCO NLEM Listed
                    </span>
                  </div>

                  <h3 className="text-base font-black text-blue-950">
                    {result.conditionRecord.officialGeneric.medicineName}
                  </h3>
                  <div className="text-xs font-semibold text-blue-800/90 space-y-1">
                    <p>• <strong>Active Salt:</strong> {result.conditionRecord.officialGeneric.genericSalt}</p>
                    <p>• <strong>Subsidized Price:</strong> {result.conditionRecord.officialGeneric.pmbjpPriceINR}</p>
                    <p>• <strong>Schedule:</strong> {result.conditionRecord.officialGeneric.standardDosageSchedule}</p>
                  </div>
                </div>
              )}

              {/* TIER 2 CONTENT: AYUSH CLASSICAL MONOGRAPH */}
              {activeTierTab === 'tier2' && (
                <div className="p-4 rounded-3xl bg-emerald-50/80 border-2 border-emerald-400 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider">
                      Tier 2 • Official AYUSH Monograph
                    </span>
                    <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      Ayurvedic Pharmacopoeia
                    </span>
                  </div>

                  <h3 className="text-base font-black text-emerald-950">
                    {result.conditionRecord.ayushClassicalFormulation.formulationName}
                  </h3>
                  <div className="text-xs font-semibold text-emerald-800/90 space-y-1">
                    <p>• <strong>Botanical:</strong> <em>{result.conditionRecord.ayushClassicalFormulation.scientificBotanical}</em></p>
                    <p>• <strong>Active Phytochemical:</strong> {result.conditionRecord.ayushClassicalFormulation.activePhytochemical}</p>
                    <p>• <strong>Dosage & Anupana:</strong> {result.conditionRecord.ayushClassicalFormulation.ayushDosage} with {result.conditionRecord.ayushClassicalFormulation.anupanaDietaryMedium}</p>
                  </div>
                </div>
              )}

              {/* TIER 3 CONTENT: VERIFIED KITCHEN REMEDY */}
              {activeTierTab === 'tier3' && (
                <div className="p-4 rounded-3xl bg-amber-50/80 border-2 border-amber-400 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider">
                      Tier 3 • Verified Kitchen First Aid
                    </span>
                    <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      Home Preparation
                    </span>
                  </div>

                  <h3 className="text-base font-black text-amber-950">
                    {result.conditionRecord.verifiedHomeRemedy.kitchenItem}
                  </h3>
                  <div className="text-xs font-semibold text-amber-900/90 space-y-1">
                    <p>• <strong>Preparation:</strong> {result.conditionRecord.verifiedHomeRemedy.preparationMethod}</p>
                    <p>• <strong>Administration:</strong> {result.conditionRecord.verifiedHomeRemedy.modeOfAdministration}</p>
                    <p className="text-red-700 font-bold">• <strong>Caution:</strong> {result.conditionRecord.verifiedHomeRemedy.contraindicationWarning}</p>
                  </div>
                </div>
              )}

              {/* Emergency Danger Signs Protocol */}
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900">
                  <span className="font-black block uppercase text-[10px] tracking-wider text-rose-700">
                    Hospital Escalation Alert
                  </span>
                  <span>Seek urgent doctor consultation if: <strong>{result.conditionRecord.escalationProtocol.dangerSigns[0]}</strong>. Max wait: {result.conditionRecord.escalationProtocol.maxWaitHoursBeforeHospital} hours.</span>
                </div>
              </div>

              {/* ========================================================
                  SEAMLESS IN-CARD PRESCRIPTION CROSS-CHECK SECTION
                 ======================================================== */}
              <div className="p-4 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="font-extrabold text-xs tracking-tight text-slate-100">
                    {lang === 'hi' 
                      ? 'क्या आप कोई अन्य दवा ले रहे हैं? (बीपी, शुगर, खून पतला)' 
                      : lang === 'gu'
                      ? 'શું તમે કોઈ અન્ય દવા લો છો? (બીપી, સુગર, લોહી પાતળું)'
                      : 'Taking any daily prescription medicine? Check for Clashes'}
                  </h4>
                </div>

                <p className="text-[11px] text-slate-300">
                  {lang === 'hi' 
                    ? 'अपनी मौजूदा दवा का नाम लिखें या बोलें ताकि दोनों के बीच का रिएक्शन तुरंत चेक हो सके:' 
                    : lang === 'gu'
                    ? 'તમારી ચાલુ દવાનું નામ લખો અથવા બોલો જેથી બંને વચ્ચેનું જોખમ ચકાસી શકાય:'
                    : 'Enter your daily medicine (e.g. Warfarin, Amlodipine, Metformin, Aspirin) to check safety:'}
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={rxInput}
                    onChange={(e) => setRxInput(e.target.value)}
                    placeholder="e.g. Warfarin, Amlodipine, Metformin"
                    className="flex-1 px-3 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                  <button
                    onClick={() => handleCheckPrescription()}
                    disabled={!rxInput.trim() || rxChecking}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs shrink-0 shadow-sm transition-all"
                  >
                    {rxChecking ? 'Checking...' : (lang === 'hi' ? 'जांचें' : lang === 'gu' ? 'ચકાસો' : 'Check Clash')}
                  </button>
                </div>

                {/* Quick 1-Tap Medicine Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Warfarin', 'Amlodipine', 'Aspirin', 'Metformin', 'Atorvastatin'].map(med => (
                    <button
                      key={med}
                      onClick={() => {
                        setRxInput(med);
                        handleCheckPrescription(med);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 border border-slate-700"
                    >
                      + {med}
                    </button>
                  ))}
                </div>

                {/* Dynamic Clash Result Box */}
                {rxClashResult && (
                  <div className={`mt-3 p-3.5 rounded-2xl border transition-all ${
                    rxClashResult.safetyResult?.confidence === 'High' && rxClashResult.safetyResult?.evidenceLevel === 'established'
                      ? 'bg-red-950/80 border-red-500 text-red-100'
                      : rxClashResult.safetyResult?.hasInteraction
                      ? 'bg-amber-950/80 border-amber-500 text-amber-100'
                      : 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      {rxClashResult.safetyResult?.confidence === 'High' && rxClashResult.safetyResult?.evidenceLevel === 'established' ? (
                        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      ) : rxClashResult.safetyResult?.hasInteraction ? (
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      )}

                      <div className="space-y-1 text-xs">
                        <span className="font-black text-xs block">
                          {rxClashResult.safetyResult?.alertHeadline || 'Prescription Cross-Check Verdict'}
                        </span>
                        <p className="text-[11px] leading-relaxed opacity-90">
                          {rxClashResult.localizedNarrationText}
                        </p>
                        {rxClashResult.safetyResult?.evidenceSummary?.pmidOrId && (
                          <span className="inline-block text-[9px] font-mono text-emerald-300 bg-black/40 px-2 py-0.5 rounded mt-1">
                            Evidence: {rxClashResult.safetyResult.evidenceSummary.pmidOrId} • {rxClashResult.safetyResult.evidenceSummary.publication}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              CASE 2: DIRECT HERB + DRUG CLASH RESULT (Storyboard Query)
             ======================================================== */}
          {result && result.type === 'direct_safety_check' && result.safetyAnalysis && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Direct Herb-Drug Safety Analysis
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    🌿 {result.detectedHerbName} + 💊 {result.detectedDrugName}
                  </span>
                </div>
                <button
                  onClick={() => setResult(null)}
                  className="text-xs font-extrabold text-emerald-700 hover:underline"
                >
                  {lang === 'hi' ? 'नया प्रश्न' : lang === 'gu' ? 'નવો પ્રશ્ન' : 'Ask another'}
                </button>
              </div>

              {/* Clash Severity Banner */}
              <div className={`p-4 rounded-3xl border-2 shadow-xs space-y-2.5 ${
                result.safetyAnalysis.confidence === 'High' && result.safetyAnalysis.evidenceLevel === 'established'
                  ? 'bg-rose-50 border-rose-500 text-rose-950'
                  : result.safetyAnalysis.hasInteraction
                  ? 'bg-amber-50 border-amber-500 text-amber-950'
                  : 'bg-emerald-50 border-emerald-500 text-emerald-950'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-white text-[10px] font-black uppercase tracking-wider ${
                    result.safetyAnalysis.confidence === 'High' && result.safetyAnalysis.evidenceLevel === 'established'
                      ? 'bg-rose-700'
                      : result.safetyAnalysis.hasInteraction
                      ? 'bg-amber-700'
                      : 'bg-emerald-700'
                  }`}>
                    {result.safetyAnalysis.hasInteraction ? 'Clinical Interaction Detected' : 'Safe to Administer'}
                  </span>
                  <span className="text-[10px] font-mono font-bold">
                    {result.safetyAnalysis.confidence} Confidence
                  </span>
                </div>

                <h3 className="text-base font-black leading-snug">
                  {result.safetyAnalysis.alertHeadline}
                </h3>
                
                <p className="text-xs font-medium leading-relaxed">
                  {result.localizedNarrationText}
                </p>

                {/* Biological Pathway Graph */}
                {result.safetyAnalysis.graphPath && result.safetyAnalysis.graphPath.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                      BioKinetic Pathway:
                    </span>
                    <div className="space-y-1 text-[11px] font-semibold text-slate-700">
                      {result.safetyAnalysis.graphPath.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span><strong>{step.label}:</strong> {step.details}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              CASE 3: BOTANICAL PROFILE RESULT
             ======================================================== */}
          {result && (result.type === 'herb_vice_versa' as any) && result.detectedPlant && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider">
                    Official Botanical Profile
                  </span>
                  <button
                    onClick={() => setResult(null)}
                    className="text-xs font-extrabold text-emerald-700 hover:underline"
                  >
                    Ask another
                  </button>
                </div>

                <h3 className="text-base font-black text-slate-900">
                  🌿 {result.detectedPlant.commonName} (<em>{result.detectedPlant.scientificName}</em>)
                </h3>

                <div className="text-xs text-slate-700 space-y-1.5">
                  <p>• <strong>Family:</strong> {result.detectedPlant.family}</p>
                  <p>• <strong>Active Constituents:</strong> {result.detectedPlant.activeConstituents.join(', ')}</p>
                  <p>• <strong>Traditional AYUSH Uses:</strong> {result.detectedPlant.traditionalUses.join(', ')}</p>
                  <p>• <strong>Metabolic Pathways:</strong> {result.detectedPlant.metabolicEnzymes.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
