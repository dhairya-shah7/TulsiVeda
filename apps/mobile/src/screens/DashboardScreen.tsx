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
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition as CapSpeechRecognition } from '@capacitor-community/speech-recognition';
import { StorageService, StoredRecord } from '../services/storageService.ts';
import { t, useCurrentLanguage, LocalizationService } from '../services/localizationService.ts';
import { QueryResolverService, UnifiedQueryResponse } from '../services/queryResolverService.ts';
import { VoiceEngineService } from '../services/voiceEngineService.ts';
import { SafetyAnalysisResult } from '../services/safetyEngine.ts';
import { BotanicalSpecies, getLocalizedBotanicalName } from '../services/botanicalDatabase.ts';

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


const UI_TEXT: Record<string, {
  villageMode: string;
  citizenHealth: string;
  stopVoice: string;
  heroTitle: string;
  heroSub: string;
  listening: string;
  tapMicToSpeak: string;
  searchPlaceholder: string;
  loading: string;
  yourQuery: string;
  listen: string;
  pause: string;
  diagnosedCondition: string;
  tier1Badge: string;
  tier1Sub: string;
  genericSalt: string;
  subsidizedPrice: string;
  schedule: string;
  tier2Badge: string;
  tier2Sub: string;
  botanical: string;
  activeCompound: string;
  dosageMedium: string;
  tier3Badge: string;
  tier3Sub: string;
  preparation: string;
  mode: string;
  caution: string;
  hospitalWarning: string;
  herbDiscoveryBadge: string;
  multiHerbBadge: string;
  govtGenericEquiv: string;
  indication: string;
  govtPrice: string;
  usedFor: string;
  activeCompounds: string;
  metabolicPathway: string;
  clashDetected: string;
  safeToTake: string;
  confidence: string;
  evidence: string;
  caseSentToClinician: string;
  sendClashToClinician: string;
  rxBoxTitle: string;
  rxBoxPlaceholder: string;
  checkBtn: string;
  sentToDoctor: string;
  sendClashToDoctor: string;
  recordFullIntake: string;
  synergyTitle: string;
  precautionTitle: string;
}> = {
  en: {
    villageMode: '🌾 Village Mode',
    citizenHealth: '🏙️ Citizen Health',
    stopVoice: 'Stop Voice',
    heroTitle: 'Ask about any Symptom, Herb or Medicine',
    heroSub: 'Tap mic to speak in your language or type below:',
    listening: 'Listening... Speak now',
    tapMicToSpeak: 'Tap mic to speak',
    searchPlaceholder: 'e.g. knee pain, Tulsi, cough remedy, Shilajit, Triphala...',
    loading: 'Consulting National Clinical Records...',
    yourQuery: 'Your Query',
    listen: 'Listen',
    pause: 'Pause',
    diagnosedCondition: 'Diagnosed Condition',
    tier1Badge: 'Tier 1 • Official Govt Generic',
    tier1Sub: 'PMBJP Kendra',
    genericSalt: 'Generic Salt',
    subsidizedPrice: 'Govt Subsidized Price',
    schedule: 'Schedule',
    tier2Badge: 'Tier 2 • Official AYUSH Monograph',
    tier2Sub: 'API Pharmacopoeia',
    botanical: 'Botanical',
    activeCompound: 'Active Compound',
    dosageMedium: 'Dosage & Medium',
    tier3Badge: 'Tier 3 • Verified Kitchen First Aid',
    tier3Sub: 'Safe Home Recipe',
    preparation: 'Preparation',
    mode: 'Mode',
    caution: 'Caution',
    hospitalWarning: 'Seek immediate clinic care if:',
    herbDiscoveryBadge: '🌿 HERB DISCOVERY',
    multiHerbBadge: '🌿 MULTI-BOTANICAL SYNERGY',
    govtGenericEquiv: '💊 Govt Generic Equivalent (Jan Aushadhi):',
    indication: 'Indication',
    govtPrice: 'Govt Price',
    usedFor: 'Primary Uses',
    activeCompounds: 'Active Compounds',
    metabolicPathway: 'Metabolic Pathway',
    clashDetected: '⚠️ Herb-Drug Clash Detected',
    safeToTake: '✓ Safe to Take Together',
    confidence: 'Confidence',
    evidence: 'Evidence',
    caseSentToClinician: '✓ Case sent to Doctor / ASHA Worker',
    sendClashToClinician: '{ui.sendClashToDoctor} / ASHA Worker',
    rxBoxTitle: 'Taking any regular medicine? Check for Clashes',
    rxBoxPlaceholder: 'e.g. Warfarin, Amlodipine, Metformin, Aspirin',
    checkBtn: 'Check',
    sentToDoctor: '✓ Sent to Doctor',
    sendClashToDoctor: 'Send Clash Report to Doctor',
    recordFullIntake: 'Want to record full clinical case intake? Tap here',
    synergyTitle: 'Classical Ayurvedic Synergy',
    precautionTitle: 'Clinical Precaution',
  },
  hi: {
    villageMode: '🌾 ग्रामीण स्वास्थ्य मोड',
    citizenHealth: '🏙️ नागरिक स्वास्थ्य',
    stopVoice: 'आवाज़ रोकें',
    heroTitle: 'अपनी बीमारी या घरेलू नुस्खे के बारे में पूछें',
    heroSub: 'माइक दबाकर बोलें या नीचे लिखकर पूछें:',
    listening: 'सुन रहे हैं... बोलिए',
    tapMicToSpeak: 'बोलने के लिए माइक दबाएं',
    searchPlaceholder: 'उदा: घुटने का दर्द, तुलसी, त्रिफला, शिलाजीत...',
    loading: 'चिकित्सा अभिलेखों में खोज रहे हैं...',
    yourQuery: 'आपका प्रश्न',
    listen: 'सुनें',
    pause: 'रोकें',
    diagnosedCondition: 'पहचाना गया विकार',
    tier1Badge: 'टियर 1 • आधिकारिक सरकारी जेनरिक',
    tier1Sub: 'पीएमबीजेपी केंद्र',
    genericSalt: 'जेनेरिक साल्ट',
    subsidizedPrice: 'सरकारी रियायती मूल्य',
    schedule: 'खुराक अनुसूची',
    tier2Badge: 'टियर 2 • आधिकारिक आयुष मोनोग्राफ',
    tier2Sub: 'एपीआई फार्माकोपिया',
    botanical: 'वानस्पतिक स्रोत',
    activeCompound: 'सक्रिय घटक',
    dosageMedium: 'मात्रा व अनुपान',
    tier3Badge: 'टियर 3 • सुरक्षित घरेलू प्राथमिक उपचार',
    tier3Sub: 'रसोई नुस्खा',
    preparation: 'बनाने की विधि',
    mode: 'सेवन विधि',
    caution: 'सावधानी',
    hospitalWarning: 'तुरंत अस्पताल जाएं यदि:',
    herbDiscoveryBadge: '🌿 औषधि विवरण',
    multiHerbBadge: '🌿 बहु-औषधीय सम्मिश्रण एवं सामंजस्य',
    govtGenericEquiv: '💊 सरकारी जन औषधि समतुल्य दवा:',
    indication: 'उपचार',
    govtPrice: 'सरकारी मूल्य',
    usedFor: 'मुख्य उपयोग',
    activeCompounds: 'सक्रिय तत्व',
    metabolicPathway: 'चयापचय मार्ग',
    clashDetected: '⚠️ दवा और औषधि के बीच संभावित टकराव',
    safeToTake: '✓ दोनों साथ लेना सुरक्षित है',
    confidence: 'विश्वसनीयता',
    evidence: 'प्रमाण',
    caseSentToClinician: '✓ डॉक्टर / आशा कार्यकर्ता को केस भेजा गया',
    sendClashToClinician: 'डॉक्टर / आशा कार्यकर्ता को जांच हेतु भेजें',
    rxBoxTitle: 'क्या आप कोई नियमित गोली (बीपी, शुगर, खून पतला) लेते हैं?',
    rxBoxPlaceholder: 'उदा: Warfarin, Amlodipine, Metformin, Aspirin',
    checkBtn: 'जांचें',
    sentToDoctor: '✓ डॉक्टर को भेजा गया',
    sendClashToDoctor: 'डॉक्टर को रिपोर्ट भेजें',
    recordFullIntake: 'विस्तृत पर्चा या पौधा दर्ज करने के लिए यहाँ क्लिक करें',
    synergyTitle: 'शास्त्रीय आयुर्वेदिक सामंजस्य',
    precautionTitle: 'चिकित्सकीय सावधानी',
  },
  gu: {
    villageMode: '🌾 ગ્રામીણ આરોગ્ય સહાય',
    citizenHealth: '🏙️ નાગરિક આરોગ્ય',
    stopVoice: 'અવાજ બંધ કરો',
    heroTitle: 'તમારી બીમારી કે દેશી ઔષધિ વિશે પૂછો',
    heroSub: 'માઇક દબાવીને બોલો અથવા નીચે લખો:',
    listening: 'સાંભળી રહ્યા છીએ... બોલો',
    tapMicToSpeak: 'બોલવા માટે માઇક દબાવો',
    searchPlaceholder: 'દા.ત: ગોઠણનો દુખાવો, તુલસી, ત્રિફળા, શિલાજીત...',
    loading: 'દવા અને ઔષધિ ચકાસી રહ્યા છીએ...',
    yourQuery: 'તમારો પ્રશ્ન',
    listen: 'સાંભળો',
    pause: 'અટકાવો',
    diagnosedCondition: 'ઓળખાયેલ રોગ/લક્ષણ',
    tier1Badge: 'ટિયર 1 • સત્તાવાર સરકારી જેનરિક',
    tier1Sub: 'પીએમબીજેપી કેન્દ્ર',
    genericSalt: 'જેનરિક સોલ્ટ',
    subsidizedPrice: 'સરકારી રાહત કિંમત',
    schedule: 'લેવાનો સમય',
    tier2Badge: 'ટિયર 2 • અધિકૃત આયુષ મોનોગ્રાફ',
    tier2Sub: 'એપીઆઈ ફાર્માકોપિયા',
    botanical: 'વનસ્પતિ સ્ત્રોત',
    activeCompound: 'સક્રિય ઘટક',
    dosageMedium: 'માત્રા અને અનુપાન',
    tier3Badge: 'ટિયર 3 • સુરક્ષિત ઘરગથ્થુ પ્રાથમિક ઉપચાર',
    tier3Sub: 'રસોડા ઉપચાર',
    preparation: 'બનાવવાની રીત',
    mode: 'લેવાની રીત',
    caution: 'ચેતવણી',
    hospitalWarning: 'તરત દવાખાને જવું જો:',
    herbDiscoveryBadge: '🌿 ઔષધિ વિગતો',
    multiHerbBadge: '🌿 મિશ્ર ઔષધિ પૃથક્કરણ અને યોગ',
    govtGenericEquiv: '💊 સરકારી જન ઔષધિ સમતુલ્ય દવા:',
    indication: 'રોગ',
    govtPrice: 'સરકારી કિંમત',
    usedFor: 'મુખ્ય ઉપયોગ',
    activeCompounds: 'સક્રિય તત્વો',
    metabolicPathway: 'જૈવિક માર્ગ',
    clashDetected: '⚠️ દવા અને ઔષધિ વચ્ચે વિરોધાભાસ (જોખમ)',
    safeToTake: '✓ બંને સાથે લેવું સુરક્ષિત છે',
    confidence: 'વિશ્વાસનીયતા',
    evidence: 'તબીબી પુરાવા',
    caseSentToClinician: '✓ ડૉક્ટર / આશા દીદીને કેસ મોકલી દેવાયો છે',
    sendClashToClinician: 'આ કેસ ડૉક્ટર / આશા દીદીને મોકલો',
    rxBoxTitle: 'શું તમે કોઈ નિયમિત દવા (બીપી, સુગર, લોહી પાતળું) લો છો?',
    rxBoxPlaceholder: 'દા.ત: Warfarin, Amlodipine, Metformin, Aspirin',
    checkBtn: 'ચકાસો',
    sentToDoctor: '✓ ડૉક્ટરને મોકલાયું',
    sendClashToDoctor: 'ડૉક્ટરને રિપોર્ટ મોકલો',
    recordFullIntake: 'સંપૂર્ણ કેસ ફોર્મ ભરવા માટે અહીં ક્લિક કરો',
    synergyTitle: 'આયુર્વેદિક શાસ્ત્રીય યોગ',
    precautionTitle: 'તબીબી સાવચેતી',
  },
  pa: {
    villageMode: '🌾 ਪੇਂਡੂ ਸਿਹਤ ਸਹਾਇਤਾ',
    citizenHealth: '🏙️ ਨਾਗਰਿਕ ਸਿਹਤ',
    stopVoice: 'ਆਵਾਜ਼ ਰੋਕੋ',
    heroTitle: 'ਆਪਣੀ ਬਿਮਾਰੀ ਜਾਂ ਦੇਸੀ ਨੁਸਖੇ ਬਾਰੇ ਪੁੱਛੋ',
    heroSub: 'ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ ਜਾਂ ਹੇਠਾਂ ਲਿਖੋ:',
    listening: 'ਸੁਣ ਰਹੇ ਹਾਂ... ਬੋਲੋ',
    tapMicToSpeak: 'ਬੋਲਣ ਲਈ ਮਾਈਕ ਦਬਾਓ',
    searchPlaceholder: 'ਉਦਾ: ਗੋਡਿਆਂ ਦਾ ਦਰਦ, ਤੁਲਸੀ, ਸ਼ਿਲਾਜੀਤ...',
    loading: 'ਸਿਹਤ ਰਿਕਾਰਡਾਂ ਵਿੱਚ ਖੋਜ ਰਹੇ ਹਾਂ...',
    yourQuery: 'ਤੁਹਾਡਾ ਸਵਾਲ',
    listen: 'ਸੁਣੋ',
    pause: 'ਰੋਕੋ',
    diagnosedCondition: 'ਪਛਾਣਿਆ ਗਿਆ ਵਿਕਾਰ',
    tier1Badge: 'ਟੀਅਰ 1 • ਸਰਕਾਰੀ ਜਨ ਔਸ਼ਧੀ',
    tier1Sub: 'ਪੀਐਮਬੀਜੇਪੀ ਕੇਂਦਰ',
    genericSalt: 'ਜੈਨੇਰਿਕ ਸਾਲਟ',
    subsidizedPrice: 'ਸਰਕਾਰੀ ਮੁੱਲ',
    schedule: 'ਖੁਰਾਕ ਅਨੁਸੂਚੀ',
    tier2Badge: 'ਟੀਅਰ 2 • ਆਯੂਸ਼ ਨੁਸਖਾ',
    tier2Sub: 'ਏਪੀਆਈ ਫਾਰਮਾਕੋਪੀਆ',
    botanical: 'ਬੋਟੈਨੀਕਲ ਨਾਮ',
    activeCompound: 'ਮੁੱਖ ਘਟਕ',
    dosageMedium: 'ਖੁਰਾਕ ਤੇ ਅਨੁਪਾਨ',
    tier3Badge: 'ਟੀਅਰ 3 • ਸੁਰੱਖਿਅਤ ਘਰੇਲੂ ਉਪਚਾਰ',
    tier3Sub: 'ਰਸੋਈ ਨੁਸਖਾ',
    preparation: 'ਵਿਧੀ',
    mode: 'ਲੈਣ ਦਾ ਤਰੀਕਾ',
    caution: 'ਸਾਵਧਾਨੀ',
    hospitalWarning: 'ਤੁਰੰਤ ਹਸਪਤਾਲ ਜਾਓ ਜੇਕਰ:',
    herbDiscoveryBadge: '🌿 ਔਸ਼ਧੀ ਵੇਰਵਾ',
    multiHerbBadge: '🌿 ਬਹੁ-ਔਸ਼ਧੀ ਮਿਸ਼ਰਣ',
    govtGenericEquiv: '💊 ਸਰਕਾਰੀ ਜਨ ਔਸ਼ਧੀ ਦਵਾਈ:',
    indication: 'ਰੋਗ',
    govtPrice: 'ਸਰਕਾਰੀ ਮੁੱਲ',
    usedFor: 'ਮੁੱਖ ਉਪਯੋਗ',
    activeCompounds: 'ਮੁੱਖ ਘਟਕ',
    metabolicPathway: 'ਮੈਟਾਬੋਲਿਕ ਮਾਰਗ',
    clashDetected: '⚠️ ਦਵਾਈ ਅਤੇ ਔਸ਼ਧੀ ਵਿਚਕਾਰ ਟਕਰਾਅ',
    safeToTake: '✓ ਦੋਵੇਂ ਇਕੱਠੇ ਲੈਣਾ ਸੁਰੱਖਿਅਤ ਹੈ',
    confidence: 'ਭਰੋਸੇਯੋਗਤਾ',
    evidence: 'ਪ੍ਰਮਾਣ',
    caseSentToClinician: '✓ ਡਾਕਟਰ / ਆਸ਼ਾ ਵਰਕਰ ਨੂੰ ਭੇਜਿਆ ਗਿਆ',
    sendClashToClinician: 'ਡਾਕਟਰ / ਆਸ਼ਾ ਵਰਕਰ ਨੂੰ ਜਾਂਚ ਲਈ ਭੇਜੋ',
    rxBoxTitle: 'ਕੀ ਤੁਸੀਂ ਕੋਈ ਰੈਗੂਲਰ ਦਵਾਈ ਲੈਂਦੇ ਹੋ?',
    rxBoxPlaceholder: 'ਉਦਾ: Warfarin, Amlodipine, Metformin, Aspirin',
    checkBtn: 'ਜਾਂਚੋ',
    sentToDoctor: '✓ ਡਾਕਟਰ ਨੂੰ ਭੇਜਿਆ ਗਿਆ',
    sendClashToDoctor: 'ਡਾਕਟਰ ਨੂੰ ਰਿਪੋਰਟ ਭੇਜੋ',
    recordFullIntake: 'ਪੂਰਾ ਕੇਸ ਦਰਜ ਕਰਨ ਲਈ ਇੱਥੇ ਕਲਿੱਕ ਕਰੋ',
    synergyTitle: 'ਆਯੁਰਵੇਦਿਕ ਸਹਿਯੋਗ',
    precautionTitle: 'ਡਾਕਟਰੀ ਸਾਵਧਾਨੀ',
  },
};

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
  const ui = UI_TEXT[lang] || UI_TEXT.en;
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
  const [isListening, setIsListening] = useState(false);
  const [speechStatusText, setSpeechStatusText] = useState<string | null>(null);

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

  const BCP47_LANGUAGE_TAGS: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    gu: 'gu-IN',
    pa: 'pa-IN',
    mr: 'mr-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    bn: 'bn-IN',
    or: 'or-IN',
    as: 'as-IN',
  };

  const startVoiceCapture = async () => {
    if (isListening) {
      setIsListening(false);
      setSpeechStatusText(null);
      if (Capacitor.isNativePlatform()) {
        try { await CapSpeechRecognition.stop(); } catch (e) {}
      }
      return;
    }

    const bcp = BCP47_LANGUAGE_TAGS[lang] || 'en-IN';
    setIsListening(true);
    setSpeechStatusText(
      lang === 'hi' ? 'सुन रहे हैं... बोलिए' : lang === 'gu' ? 'સાંભળી રહ્યા છીએ... બોલો' : 'Listening... Speak now'
    );

    // 1. Android Native Execution
    if (Capacitor.isNativePlatform()) {
      try {
        const perm = await CapSpeechRecognition.checkPermissions();
        if (perm.speechRecognition !== 'granted') {
          const req = await CapSpeechRecognition.requestPermissions();
          if (req.speechRecognition !== 'granted') {
            setIsListening(false);
            setSpeechStatusText(null);
            alert('Microphone permission is required.');
            return;
          }
        }

        const avail = await CapSpeechRecognition.available();
        if (!avail.available) {
          setIsListening(false);
          setSpeechStatusText(null);
          alert('Voice recognition service is not available on this device.');
          return;
        }

        // Popup: true triggers Google's native speech dialog on Android (supports all Indian languages & English)
        const res = await CapSpeechRecognition.start({
          language: bcp,
          maxResults: 5,
          prompt: lang === 'hi' ? 'अपनी बीमारी या दवा बोलें...' : lang === 'gu' ? 'તમારી બીમારી કે દવા બોલો...' : 'Speak symptom or medicine...',
          popup: true,
          partialResults: false,
        });

        setIsListening(false);
        setSpeechStatusText(null);
        if (res?.matches && res.matches.length > 0) {
          const spoken = res.matches[0].trim();
          if (spoken) {
            setQueryInput(spoken);
            await handleExecuteQuery(spoken);
          }
        }
        return;
      } catch (err: any) {
        console.warn('[Native Speech Recognition Error]:', err);
        setIsListening(false);
        setSpeechStatusText(null);
      }
    }

    // 2. Web Browser Fallback (Chrome / Edge / Safari Web Speech API)
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const rec = new SpeechRec();
        rec.lang = bcp;
        rec.continuous = false;
        rec.interimResults = false;

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = async (event: any) => {
          setIsListening(false);
          setSpeechStatusText(null);
          let spoken = '';
          for (let i = 0; i < event.results.length; i++) {
            spoken += event.results[i][0].transcript;
          }
          spoken = spoken.trim();
          if (spoken) {
            setQueryInput(spoken);
            await handleExecuteQuery(spoken);
          }
        };

        rec.onerror = (e: any) => {
          console.warn('[Web Speech Error]:', e);
          setIsListening(false);
          setSpeechStatusText(null);
        };

        rec.onend = () => {
          setIsListening(false);
          setSpeechStatusText(null);
        };

        rec.start();
        return;
      } catch (webErr) {
        console.warn('[Web Speech API Failed]:', webErr);
        setIsListening(false);
        setSpeechStatusText(null);
      }
    } else {
      setIsListening(false);
      setSpeechStatusText(null);
      alert('Speech recognition is not available in this browser. Please type below.');
    }
  };

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
    { label: 'घुटनों में दर्द', text: 'मुझे घुटनों में दर्द है, क्या इस्तेमाल करें?' },
    { label: 'त्रिफला और हल्दी', text: 'त्रिफला और हल्दी' },
    { label: 'शिलाजीत + बीपी दवा', text: 'क्या मैं शिलाजीत और बीपी की दवा साथ ले सकता हूँ?' },
    { label: 'तुलसी + खांसी', text: 'तुलसी' },
  ] : lang === 'gu' ? [
    { label: 'ગોઠણનો દુખાવો', text: 'મને ગોઠણનો દુખાવો છે, શું વાપરવું?' },
    { label: 'ત્રિફળા અને હળદર', text: 'ત્રિફળા અને હળદર' },
    { label: 'શિલાજીત + બીપી દવા', text: 'શું હું શિલાજીત અને બીપીની દવા સાથે લઈ શકું?' },
    { label: 'તુલસી + ખાંસી', text: 'તુલસી' },
  ] : [
    { label: 'Knee Pain', text: 'I have pain in my knees what to use' },
    { label: 'Triphala + Turmeric', text: 'Triphala with turmeric' },
    { label: 'Shilajit + BP Medicine', text: 'Can I take Shilajit with BP medicine?' },
    { label: 'Tulsi Remedy', text: 'Tulsi' },
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
                : (currentMode === 'village' ? ui.villageMode : ui.citizenHealth)}
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
            <span>{ui.stopVoice}</span>
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
                  {ui.heroTitle}
                </h2>
                <p className="text-xs text-emerald-100/80 mt-1 font-medium">
                  {ui.heroSub}
                </p>
              </div>

              {/* EXACTLY ONE CENTRAL TACTILE MIC BUTTON */}
              <div className="flex flex-col items-center justify-center pt-1">
                <button
                  type="button"
                  onClick={startVoiceCapture}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl active:scale-95 ${
                    isListening 
                      ? 'bg-red-600 text-white ring-4 ring-red-400/50 animate-pulse' 
                      : 'bg-white text-emerald-900 hover:bg-emerald-50 shadow-emerald-950/40'
                  }`}
                  aria-label="Microphone"
                >
                  <Mic className={`w-9 h-9 stroke-[2.3] ${isListening ? 'text-white' : 'text-emerald-800'}`} />
                </button>

                <p className="text-xs font-bold mt-2.5 text-emerald-100">
                  {isListening ? (
                    <span className="text-red-300 flex items-center gap-1.5 animate-pulse font-extrabold">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      {speechStatusText || ui.listening}
                    </span>
                  ) : (
                    ui.tapMicToSpeak
                  )}
                </p>
              </div>

              {/* Clean Text Search Bar */}
              <div className="relative pt-1">
                <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-emerald-600/30">
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleExecuteQuery(queryInput)}
                    placeholder={ui.searchPlaceholder}
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
                {ui.loading}
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
                    {ui.yourQuery}
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
                    <span className="text-[11px]">{isSpeaking ? ui.pause : ui.listen}</span>
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
                      {ui.diagnosedCondition}
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
                  BRANCH 2A: MULTI-HERB FORMULATION & SYNERGY
                 ---------------------------------------------------- */}
              {activeResult.type === 'multi_herb_combination' && (
                <div className="p-5 rounded-3xl bg-white border-2 border-teal-500 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-700 text-white text-[10px] font-black uppercase tracking-wider">
                      {ui.multiHerbBadge}
                    </span>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      Classical Ayurvedic Blend
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">
                    🌿 {activeResult.detectedPlants ? activeResult.detectedPlants.map(p => getLocalizedBotanicalName(p, lang)).join(' + ') : activeResult.detectedHerbName}
                  </h3>

                  {/* Synergy Box */}
                  {activeResult.multiHerbSynergy && (
                    <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1.5">
                      <span className="font-black block text-teal-900 text-xs">
                        {ui.synergyTitle}:
                      </span>
                      <p className="text-[11px] leading-relaxed font-semibold">
                        {activeResult.multiHerbSynergy.synergyNotes}
                      </p>
                      <p className="text-[10px] font-bold text-teal-800 pt-0.5">
                        {activeResult.multiHerbSynergy.precautions}
                      </p>
                    </div>
                  )}

                  {/* Components */}
                  {activeResult.detectedPlants && (
                    <div className="space-y-2 pt-1">
                      {activeResult.detectedPlants.map((plant, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-0.5">
                          <p className="font-black text-slate-900">
                            {idx + 1}. {getLocalizedBotanicalName(plant, lang)} <span className="font-normal italic text-[10px] text-slate-500">({plant.scientificName})</span>
                          </p>
                          <p className="text-[11px] text-slate-600">
                            • <strong>{ui.usedFor}:</strong> {plant.traditionalUses.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ----------------------------------------------------
                  BRANCH 2B: 1 INGREDIENT / HERB -> VICE-VERSA DISCOVERY
                 ---------------------------------------------------- */}
              {activeResult.type === 'herb_vice_versa' && activeResult.detectedPlant && (
                <div className="p-5 rounded-3xl bg-white border-2 border-emerald-400 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider">
                      {ui.herbDiscoveryBadge}
                    </span>
                    <span className="text-[10px] italic font-semibold text-slate-500">
                      {activeResult.detectedPlant.scientificName}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">
                    🌿 {getLocalizedBotanicalName(activeResult.detectedPlant, lang)}
                  </h3>

                  {/* Vice Versa: Conditions it treats */}
                  {activeResult.viceVersaGenericMedicine && (
                    <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                      <span className="font-extrabold block text-blue-950 text-xs">
                        {ui.govtGenericEquiv}
                      </span>
                      <p className="font-bold text-sm text-blue-900">
                        {activeResult.viceVersaGenericMedicine.medicineName}
                      </p>
                      <p className="text-[11px] text-blue-700">
                        {ui.indication}: {activeResult.viceVersaGenericMedicine.conditionName} • {ui.govtPrice}: {activeResult.viceVersaGenericMedicine.price}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-slate-700 space-y-1">
                    <p>• <strong>{ui.usedFor}:</strong> {activeResult.detectedPlant.traditionalUses.slice(0, 3).join(', ')}</p>
                    <p>• <strong>{ui.activeCompounds}:</strong> {activeResult.detectedPlant.activeConstituents.join(', ')}</p>
                    <p>• <strong>{ui.metabolicPathway}:</strong> {activeResult.detectedPlant.metabolicEnzymes.join(', ')}</p>
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
                      {activeResult.safetyAnalysis.hasInteraction ? ui.clashDetected : ui.safeToTake}
                    </span>
                    <span className="text-[10px] font-mono font-bold">
                      {activeResult.safetyAnalysis.confidence} {ui.confidence}
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
                          <span>{ui.caseSentToClinician}</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleSendClashToDoctor}
                          className="w-full py-3 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                        >
                          <Send className="w-4 h-4" />
                          <span>{ui.sendClashToClinician}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ----------------------------------------------------
                  SEAMLESS IN-CARD PRESCRIPTION CROSS-CHECK DRAWER (WHITE THEME)
                 ---------------------------------------------------- */}
              {activeResult.type !== 'direct_safety_check' && (
                <div className="p-4 rounded-3xl bg-white text-slate-900 space-y-3 border-2 border-slate-200/90 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0" />
                    <h4 className="font-extrabold text-xs text-slate-900">
                      {ui.rxBoxTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rxInput}
                      onChange={(e) => setRxInput(e.target.value)}
                      placeholder={ui.rxBoxPlaceholder}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 text-slate-900 text-xs font-semibold placeholder-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => handleCheckPrescription()}
                      disabled={!rxInput.trim() || rxChecking}
                      className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-extrabold text-xs shrink-0 shadow-xs active:scale-95 transition-all"
                    >
                      {rxChecking ? '...' : ui.checkBtn}
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
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 border border-slate-200 transition-colors"
                      >
                        + {m}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Clash Result Box */}
                  {rxClashResult && (
                    <div className={`mt-2.5 p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                      rxClashResult.safetyResult?.confidence === 'High' && rxClashResult.safetyResult?.evidenceLevel === 'established'
                        ? 'bg-rose-50 border-rose-300 text-rose-950'
                        : rxClashResult.safetyResult?.hasInteraction
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    }`}>
                      <span className="font-black block text-xs">
                        {rxClashResult.safetyResult?.alertHeadline || 'Prescription Cross-Check Result'}
                      </span>
                      <p className="text-[11px] leading-relaxed font-semibold">
                        {rxClashResult.localizedNarrationText}
                      </p>

                      {/* Doctor Report Button inside drawer */}
                      {rxClashResult.safetyResult?.hasInteraction && (
                        <div className="pt-1.5">
                          {clashSent ? (
                            <span className="text-[10px] font-bold text-emerald-700">{ui.sentToDoctor}</span>
                          ) : (
                            <button
                              onClick={handleSendClashToDoctor}
                              className="px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-black text-[10px] shadow-xs active:scale-95 transition-all"
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
              {ui.recordFullIntake}
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
