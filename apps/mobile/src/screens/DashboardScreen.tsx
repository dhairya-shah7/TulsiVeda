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
  onOpenEmergency?: () => void;
  onTriggerEmergency?: (emergencyCase: any) => void;
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
  mr: {
    villageMode: '🌾 ग्रामीण आरोग्य मोड',
    citizenHealth: '🏙️ नागरिक आरोग्य',
    stopVoice: 'आवाज थांबवा',
    heroTitle: 'तुमचा आजार किंवा घरगुती उपचाराबद्दल विचारा',
    heroSub: 'माइक दाबून बोला किंवा खाली टाईप करा:',
    listening: 'ऐकत आहे... बोला',
    tapMicToSpeak: 'बोलण्यासाठी माइक दाबा',
    searchPlaceholder: 'उदा: गुडघेदुखी, तुळस, सर्दी खोकला, शिलाजीत...',
    loading: 'वैद्यकीय नोंदी शोधत आहोत...',
    yourQuery: 'तुमचा प्रश्न',
    listen: 'ऐका',
    pause: 'थांबवा',
    diagnosedCondition: 'निदान झालेला आजार',
    tier1Badge: 'टियर १ • अधिकृत सरकारी जेनेरिक',
    tier1Sub: 'पीएमबीजेपी केंद्र',
    genericSalt: 'जेनेरिक सॉल्ट',
    subsidizedPrice: 'शासकीय सवलत दर',
    schedule: 'डोस वेळ',
    tier2Badge: 'टियर २ • अधिकृत आयुष मोनोग्राफ',
    tier2Sub: 'एपीआय फार्माकोपिया',
    botanical: 'वनस्पती स्रोत',
    activeCompound: 'सक्रिय घटक',
    dosageMedium: 'मात्रा व अनुपान',
    tier3Badge: 'टियर ३ • सुरक्षित घरगुती प्रथमोपचार',
    tier3Sub: 'स्वयंपाकघर उपाय',
    preparation: 'बनवण्याची पद्धत',
    mode: 'सेवन पद्धत',
    caution: 'सावधगिरी',
    hospitalWarning: 'तातडीने दवाखान्यात जा जर:',
    herbDiscoveryBadge: '🌿 औषधी माहिती',
    multiHerbBadge: '🌿 बहु-औषधी वनस्पती योग',
    govtGenericEquiv: '💊 सरकारी जन औषधी समतुल्य औषध:',
    indication: 'उपचार',
    govtPrice: 'शासकीय किंमत',
    usedFor: 'मुख्य उपयोग',
    activeCompounds: 'सक्रिय घटक',
    metabolicPathway: 'चयापचय मार्ग',
    clashDetected: '⚠️ औषध आणि वनस्पतीमध्ये संभाव्य धोका',
    safeToTake: '✓ दोन्ही एकत्र घेणे सुरक्षित आहे',
    confidence: 'विश्वसनीयता',
    evidence: 'वैद्यकीय पुरावा',
    caseSentToClinician: '✓ केस डॉक्टर / आशा कार्यकर्तीकडे पाठवली',
    sendClashToClinician: 'केस डॉक्टर / आशा कार्यकर्तीकडे पाठवा',
    rxBoxTitle: 'तुम्ही कोणती नियमित गोळी घेता का?',
    rxBoxPlaceholder: 'उदा: Warfarin, Amlodipine, Metformin, Aspirin',
    checkBtn: 'तपासा',
    sentToDoctor: '✓ डॉक्टरांना पाठवले',
    sendClashToDoctor: 'डॉक्टरांना अहवाल पाठवा',
    recordFullIntake: 'सविस्तर नोंद करण्यासाठी येथे क्लिक करा',
    synergyTitle: 'आयुर्वेदिक समन्वय',
    precautionTitle: 'वैद्यकीय खबरदारी',
  },
  ta: {
    villageMode: '🌾 கிராமப்புற சுகாதார பயன்முறை',
    citizenHealth: '🏙️ குடிமக்கள் சுகாதாரம்',
    stopVoice: 'குரலை நிறுத்து',
    heroTitle: 'நோய் அல்லது மூலிகை மருந்து பற்றி கேளுங்கள்',
    heroSub: 'மைக் அழுத்தி பேசவும் அல்லது கீழே தட்டச்சு செய்யவும்:',
    listening: 'கேட்கிறது... பேசுங்கள்',
    tapMicToSpeak: 'பேச மைக் தட்டவும்',
    searchPlaceholder: 'எ.கா: மூட்டு வலி, துளசி, சளி, நிலவேம்பு...',
    loading: 'மருத்துவ ஆவணங்களில் தேடுகிறது...',
    yourQuery: 'உங்கள் கேள்வி',
    listen: 'கேளுங்கள்',
    pause: 'நிறுத்து',
    diagnosedCondition: 'கண்டறியப்பட்ட நிலை',
    tier1Badge: 'அடுக்கு 1 • மக்கள் மருந்தக ஜெனரிக்',
    tier1Sub: 'பிஎம்பிஜேபி மையம்',
    genericSalt: 'ஜெனரிக் உப்பு',
    subsidizedPrice: 'அரசு மானிய விலை',
    schedule: 'மருந்து அளவு',
    tier2Badge: 'அடுக்கு 2 • அதிகாரப்பூர்வ ஆயுஷ் மூலிகை',
    tier2Sub: 'ஏபிஐ பார்மகோபியா',
    botanical: 'தாவரவியல் பெயர்',
    activeCompound: 'செயலில் உள்ள கூறு',
    dosageMedium: 'அளவு & உட்கொள்ளும் முறை',
    tier3Badge: 'அடுக்கு 3 • வீட்டு முதலுதவி',
    tier3Sub: 'பாட்டி வைத்தியம்',
    preparation: 'செய்முறை',
    mode: 'பயன்படுத்தும் முறை',
    caution: 'எச்சரிக்கை',
    hospitalWarning: 'உடனடியாக மருத்துவமனைக்கு செல்லவும்:',
    herbDiscoveryBadge: '🌿 மூலிகை விளக்கம்',
    multiHerbBadge: '🌿 கூட்டு மூலிகை கலவை',
    govtGenericEquiv: '💊 அரசு மக்கள் மருந்தக மருந்து:',
    indication: 'குணப்படுத்தும் நோய்',
    govtPrice: 'அரசு விலை',
    usedFor: 'முக்கிய பயன்கள்',
    activeCompounds: 'செயலில் உள்ள கூறுகள்',
    metabolicPathway: 'வளர்சிதை மாற்ற பாதை',
    clashDetected: '⚠️ மருந்து - மூலிகை முரண்பாடு',
    safeToTake: '✓ இரண்டும் ஒன்றாக எடுப்பது பாதுகாப்பானது',
    confidence: 'நம்பகத்தன்மை',
    evidence: 'ஆதாரம்',
    caseSentToClinician: '✓ மருத்துவரிடம் வழக்கு அனுப்பப்பட்டது',
    sendClashToClinician: 'மருத்துவர் பார்வைக்கு அனுப்பு',
    rxBoxTitle: 'தொடர்ந்து ஏதேனும் மாத்திரை சாப்பிடுகிறீர்களா?',
    rxBoxPlaceholder: 'எ.கா: Warfarin, Amlodipine, Metformin, Aspirin',
    checkBtn: 'சரிபார்',
    sentToDoctor: '✓ மருத்துவருக்கு அனுப்பப்பட்டது',
    sendClashToDoctor: 'மருத்துவருக்கு அறிக்கை அனுப்பு',
    recordFullIntake: 'முழு விவரம் பதிவு செய்ய கிளிக் செய்யவும்',
    synergyTitle: 'ஆயுர்வேத கூட்டுத்திறன்',
    precautionTitle: 'மருத்துவ முன்னெச்சரிக்கை',
  },
  te: {
    villageMode: '🌾 గ్రామీణ ఆరోగ్య సహాయం',
    citizenHealth: '🏙️ పౌర ఆరోగ్యం',
    stopVoice: 'వాయిస్ ఆపు',
    heroTitle: 'మీ వ్యాధి లేదా ఆయుర్వేద ఔషధం గురించి అడగండి',
    heroSub: 'మైక్ నొక్కి మాట్లాడండి లేదా టైప్ చేయండి:',
    listening: 'వింటున్నాము... మాట్లాడండి',
    tapMicToSpeak: 'మాట్లాడటానికి మైక్ నొక్కండి',
    searchPlaceholder: 'ఉదా: మోకాళ్ళ నొప్పులు, తులసి, జ్వరం, తిప్పతీగ...',
    loading: 'వైద్య రికార్డులను పరిశీలిస్తున్నాము...',
    yourQuery: 'మీ ప్రశ్న',
    listen: 'వినండి',
    pause: 'ఆపండి',
    diagnosedCondition: 'గుర్తించబడిన వ్యాధి',
    tier1Badge: 'టైర్ 1 • ప్రభుత్వ జన ఔషధి',
    tier1Sub: 'పీఎంబీజేపీ కేంద్రం',
    genericSalt: 'జెనెరిక్ సాల్ట్',
    subsidizedPrice: 'ప్రభుత్వ రాయితీ ధర',
    schedule: 'మోతాదు సమయం',
    tier2Badge: 'టైర్ 2 • ప్రామాణిక ఆయుష్ చికిత్స',
    tier2Sub: 'ఏపీఐ ఫార్మకోపియా',
    botanical: 'వృక్షశాస్త్ర నామం',
    activeCompound: 'క్రియాశీల సమ్మేళనం',
    dosageMedium: 'మోతాదు & అనుపానం',
    tier3Badge: 'టైర్ 3 • సురక్షిత ఇంటి చిట్కా',
    tier3Sub: 'ఇంటి వైద్యం',
    preparation: 'తయారీ విధానం',
    mode: 'వాడే విధానం',
    caution: 'జాగ్రత్త',
    hospitalWarning: 'వెంటనే ఆసుపత్రికి వెళ్ళండి:',
    herbDiscoveryBadge: '🌿 మూలికా వివరాలు',
    multiHerbBadge: '🌿 బహుళ మూలికా సమ్మేళనం',
    govtGenericEquiv: '💊 ప్రభుత్వ జన ఔషధి సమతుల్య ఔషధం:',
    indication: 'చికిత్స',
    govtPrice: 'ప్రభుత్వ ధర',
    usedFor: 'ప్రధాన ఉపయోగాలు',
    activeCompounds: 'క్రియాశీల అంశాలు',
    metabolicPathway: 'మెటబాలిక్ మార్గం',
    clashDetected: '⚠️ ఔషధం మరియు మూలిక మధ్య ప్రమాదం',
    safeToTake: '✓ రెండూ కలిపి తీసుకోవడం సురక్షితం',
    confidence: 'విశ్వసనీయత',
    evidence: 'వైద్య ఆధారాలు',
    caseSentToClinician: '✓ వైద్యుడికి నివేదిక పంపబడింది',
    sendClashToClinician: 'వైద్యుడి సమీక్షకు పంపండి',
    rxBoxTitle: 'మీరు రోజూ ఏదైనా మందులు వేసుకుంటున్నారా?',
    rxBoxPlaceholder: 'ఉదా: Warfarin, Amlodipine, Metformin, Aspirin',
    checkBtn: 'తనిఖీ చేయి',
    sentToDoctor: '✓ డాక్టర్‌కు పంపబడింది',
    sendClashToDoctor: 'డాక్టర్‌కు నివేదిక పంపు',
    recordFullIntake: 'పూర్తి వివరాలు నమోదు చేయడానికి ఇక్కడ క్లిక్ చేయండి',
    synergyTitle: 'ఆయుర్వేద సమన్వయం',
    precautionTitle: 'వైద్య జాగ్రత్త',
  },
  kn: {
    villageMode: '🌾 ಗ್ರಾಮೀಣ ಆರೋಗ್ಯ ಮೋಡ್',
    citizenHealth: '🏙️ ನಾಗರಿಕ ಆರೋಗ್ಯ',
    stopVoice: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
    heroTitle: 'ನಿಮ್ಮ ಕಾಯಿಲೆ ಅಥವಾ ಮನೆಮದ್ದಿನ ಬಗ್ಗೆ ಕೇಳಿ',
    heroSub: 'ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ ಅಥವಾ ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ:',
    listening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ... ಮಾತನಾಡಿ',
    tapMicToSpeak: 'ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ',
    searchPlaceholder: 'ಉದಾ: ಕೀಲು ನೋವು, ತುಳಸಿ, ಕೆಮ್ಮು, ಅಮೃತಬಳ್ಳಿ...',
    loading: 'ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳಲ್ಲಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    yourQuery: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ',
    listen: 'ಕೇಳಿ',
    pause: 'ವಿರಾಮ',
    diagnosedCondition: 'ಗುರುತಿಸಲಾದ ಕಾಯಿಲೆ',
    tier1Badge: 'ಶ್ರೇಣಿ 1 • ಜನೌಷಧಿ ಜೆನೆರಿಕ್',
    tier1Sub: 'ಪಿಎಂಬಿಜೆಪಿ ಕೇಂದ್ರ',
    genericSalt: 'ಜೆನೆರಿಕ್ ಸಾಲ್ಟ್',
    subsidizedPrice: 'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ದರ',
    schedule: 'ಸೇವನೆಯ ಸಮಯ',
    tier2Badge: 'ಶ್ರೇಣಿ 2 • ಅಧಿಕೃತ ಆಯುಷ್ ಸೂತ್ರೀಕರಣ',
    tier2Sub: 'ಎಪಿಐ ಫಾರ್ಮಾಕೋಪಿಯಾ',
    botanical: 'ಸಸ್ಯಶಾಸ್ತ್ರೀಯ ಹೆಸರು',
    activeCompound: 'ಸಕ್ರಿಯ ಸಂಯುಕ್ತ',
    dosageMedium: 'ಪ್ರಮಾಣ ಮತ್ತು ಅನುಪಾನ',
    tier3Badge: 'ಶ್ರೇಣಿ 3 • ಸುರಕ್ಷಿತ ಮನೆಮದ್ದು',
    tier3Sub: 'ಅಡುಗೆಮನೆ ಮದ್ದು',
    preparation: 'ಸಿದ್ಧಪಡಿಸುವ ವಿಧಾನ',
    mode: 'ಬಳಸುವ ವಿಧಾನ',
    caution: 'ಎಚ್ಚರಿಕೆ',
    hospitalWarning: 'ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ:',
    herbDiscoveryBadge: '🌿 ಗಿಡಮೂಲಿಕೆ ವಿವರ',
    multiHerbBadge: '🌿 ಬಹು ಗಿಡಮೂಲಿಕೆ ಸಂಯೋಜನೆ',
    govtGenericEquiv: '💊 ಸರ್ಕಾರಿ ಜನೌಷಧಿ ಸಮಾನ ಔಷಧಿ:',
    indication: 'ಚಿಕಿತ್ಸೆ',
    govtPrice: 'ಸರ್ಕಾರಿ ಬೆಲೆ',
    usedFor: 'ಮುಖ್ಯ ಉಪಯೋಗಗಳು',
    activeCompounds: 'ಸಕ್ರಿಯ ಘಟಕಗಳು',
    metabolicPathway: 'ಜೀವಕ್ರಿಯೆಯ ಮಾರ್ಗ',
    clashDetected: '⚠️ ಔಷಧ ಮತ್ತು ಗಿಡಮೂಲಿಕೆ ನಡುವೆ ಅಪಾಯ',
    safeToTake: '✓ ಎರಡನ್ನೂ ಒಟ್ಟಿಗೆ ತೆಗೆದುಕೊಳ್ಳುವುದು ಸುರಕ್ಷಿತ',
    confidence: 'ವಿಶ್ವಾಸಾರ್ಹತೆ',
    evidence: 'ವೈದ್ಯಕೀಯ ಪುರಾವೆ',
    caseSentToClinician: '✓ ವೈದ್ಯರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ',
    sendClashToClinician: 'ವೈದ್ಯರ ಪರಿಶೀಲನೆಗೆ ಕಳುಹಿಸಿ',
    rxBoxTitle: 'ನೀವು ನಿಯಮಿತವಾಗಿ ಯಾವುದೇ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?',
    rxBoxPlaceholder: 'ಉದಾ: Warfarin, Amlodipine, Metformin, Aspirin',
    checkBtn: 'ಪರಿಶೀಲಿಸಿ',
    sentToDoctor: '✓ ವೈದ್ಯರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ',
    sendClashToDoctor: 'ವೈದ್ಯರಿಗೆ ವರದಿ ಕಳುಹಿಸಿ',
    recordFullIntake: 'ಸಂಪೂರ್ಣ ಮಾಹಿತಿ ದಾಖಲಿಸಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ',
    synergyTitle: 'ಆಯುರ್ವೇದ ಸಮ್ಮಿಶ್ರಣ',
    precautionTitle: 'ವೈದ್ಯಕೀಯ ಮುನ್ನೆಚ್ಚರಿಕೆ',
  },
  ml: {
    villageMode: '🌾 ഗ്രാമീണ ആരോഗ്യ സേവനം',
    citizenHealth: '🏙️ പൗര ആരോഗ്യം',
    stopVoice: 'ശബ്ദം നിർത്തുക',
    heroTitle: 'രോഗലക്ഷണങ്ങളോ നാട്ടുവൈദ്യമോ ചോദിക്കുക',
    heroSub: 'മൈക്ക് അമർത്തി സംസാരിക്കുക അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക:',
    listening: 'കേൾക്കുന്നു... സംസാരിക്കൂ',
    tapMicToSpeak: 'സംസാരിക്കാൻ മൈക്ക് അമർത്തുക',
    searchPlaceholder: 'ഉദാ: മുട്ടുവേദന, തുളസി, ചുമ, ചിറ്റമൃത്...',
    loading: 'രേഖകൾ പരിശോധിക്കുന്നു...',
    yourQuery: 'നിങ്ങളുടെ ചോദ്യം',
    listen: 'കേൾക്കുക',
    pause: 'നിർത്തുക',
    diagnosedCondition: 'കണ്ടെത്തിയ രോഗാവസ്ഥ',
    tier1Badge: 'ടയർ 1 • ജൻ ഔഷധി ജനറിക്',
    tier1Sub: 'പിഎംബിജെപി കേന്ദ്രം',
    genericSalt: 'ജനറിക് സാൾട്ട്',
    subsidizedPrice: 'സർക്കാർ സബ്‌സിഡി നിരക്ക്',
    schedule: 'കഴിക്കേണ്ട സമയം',
    tier2Badge: 'ടയർ 2 • ആയുഷ് ഫാർമക്കോപ്പിയ',
    tier2Sub: 'എപിഐ ഫാർമക്കോപ്പിയ',
    botanical: 'സസ്യനാമം',
    activeCompound: 'പ്രധാന ഘടകം',
    dosageMedium: 'അളവും കഴിക്കേണ്ട രീതിയും',
    tier3Badge: 'ടയർ 3 • വീട്ടുവൈദ്യം',
    tier3Sub: 'സുരക്ഷിത പ്രഥമശുശ്രൂഷ',
    preparation: 'തയ്യാറാക്കുന്ന വിധം',
    mode: 'ഉപയോഗിക്കേണ്ട വിധം',
    caution: 'മുന്നറിയിപ്പ്',
    hospitalWarning: 'ഉടൻ ആശുപത്രിയിൽ പോകുക:',
    herbDiscoveryBadge: '🌿 ഔഷധ വിവരങ്ങൾ',
    multiHerbBadge: '🌿 സംയുക്ത ഔഷധ യോഗം',
    govtGenericEquiv: '💊 സർക്കാർ ജൻ ഔഷധി മരുന്ന്:',
    indication: 'ചികിത്സ',
    govtPrice: 'സർക്കാർ വില',
    usedFor: 'പ്രധാന ഉപയോഗങ്ങൾ',
    activeCompounds: 'പ്രധാന ഘടകങ്ങൾ',
    metabolicPathway: 'ഉപാപചയ വഴി',
    clashDetected: '⚠️ മരുന്നും ഔഷധവും തമ്മിലുള്ള പ്രതിപ്രവർത്തനം',
    safeToTake: '✓ രണ്ടും ഒരുമിച്ച് കഴിക്കുന്നത് സുരക്ഷിതമാണ്',
    confidence: 'വിശ്വാസ്യത',
    evidence: 'തെളിവ്',
    caseSentToClinician: '✓ ഡോക്ടർക്ക് അയച്ചു',
    sendClashToClinician: 'ഡോക്ടറുടെ പരിശോധനയ്ക്ക് അയക്കുക',
    rxBoxTitle: 'സ്ഥിരമായി എന്തെങ്കിലും മരുന്ന് കഴിക്കുന്നുണ്ടോ?',
    rxBoxPlaceholder: 'ഉദാ: Warfarin, Amlodipine, Metformin, Aspirin',
    checkBtn: 'പരിശോധിക്കുക',
    sentToDoctor: '✓ ഡോക്ടർക്ക് അയച്ചു',
    sendClashToDoctor: 'ഡോക്ടർക്ക് റിപ്പോർട്ട് അയക്കുക',
    recordFullIntake: 'പൂർണ്ണ വിവരങ്ങൾ രേഖപ്പെടുത്താൻ ക്ലിക്ക് ചെയ്യുക',
    synergyTitle: 'ആയുർവേദ സംയോജനം',
    precautionTitle: 'വൈദ്യശാസ്ത്ര ജാഗ്രത',
  },
  bn: {
    villageMode: '🌾 গ্রামীণ স্বাস্থ্য সেবা',
    citizenHealth: '🏙️ নাগরিক স্বাস্থ্য',
    stopVoice: 'ভয়েস বন্ধ করুন',
    heroTitle: 'আপনার রোগ বা ঘরোয়া দাওয়াই সম্পর্কে জানুন',
    heroSub: 'মাইক চেপে কথা বলুন বা নিচে লিখুন:',
    listening: 'শুনছি... বলুন',
    tapMicToSpeak: 'কথা বলতে মাইকে চাপ দিন',
    searchPlaceholder: 'উদা: হাঁটুর ব্যথা, তুলসী, কাশি, গুলঞ্চ...',
    loading: 'চিকিৎসা নথি অনুসন্ধান করা হচ্ছে...',
    yourQuery: 'আপনার প্রশ্ন',
    listen: 'শুনুন',
    pause: 'থামান',
    diagnosedCondition: 'শনাক্তকৃত রোগ',
    tier1Badge: 'টিয়ার ১ • জন ঔষধি জেনেরিক',
    tier1Sub: 'পিএমবিজেপি কেন্দ্র',
    genericSalt: 'জেনেরিক সল্ট',
    subsidizedPrice: 'সরকারি ভর্তুকি মূল্য',
    schedule: 'সেবন বিধি',
    tier2Badge: 'টিয়ার ২ • আয়ুশ ভেষজ প্রতিকার',
    tier2Sub: 'এপিআই ফার্মাকোপিয়া',
    botanical: 'ভেষজ নাম',
    activeCompound: 'সক্রিয় উপাদান',
    dosageMedium: 'মাত্রা ও অনুপান',
    tier3Badge: 'টিয়ার ৩ • নিরাপদ ঘরোয়া চিকিৎসা',
    tier3Sub: 'রান্নাঘরের টোটকা',
    preparation: 'প্রস্তুত প্রণালী',
    mode: 'ব্যবহার বিধি',
    caution: 'সতর্কতা',
    hospitalWarning: 'অবিলম্বে হাসপাতালে যান যদি:',
    herbDiscoveryBadge: '🌿 ভেষজ বিবরণ',
    multiHerbBadge: '🌿 বহুমুখী ভেষজ সংমিশ্রণ',
    govtGenericEquiv: '💊 সরকারি জন ঔষধি সমতুল্য ওষুধ:',
    indication: 'চিকিৎসা',
    govtPrice: 'সরকারি মূল্য',
    usedFor: 'প্রধান ব্যবহার',
    activeCompounds: 'সক্রিয় উপাদান',
    metabolicPathway: 'মেটাবলিক পাথওয়ে',
    clashDetected: '⚠️ ওষুধ ও ভেষজের মধ্যে সম্ভাব্য সংঘাত',
    safeToTake: '✓ দুটি একসাথে নেওয়া নিরাপদ',
    confidence: 'নির্ভরযোগ্যতা',
    evidence: 'প্রমাণ',
    caseSentToClinician: '✓ ডাক্তারের কাছে পাঠানো হয়েছে',
    sendClashToClinician: 'ডাক্তারের পর্যালোচনার জন্য পাঠান',
    rxBoxTitle: 'নিয়মিত কোনো ওষুধ খাচ্ছেন কি?',
    rxBoxPlaceholder: 'উদা: Warfarin, Amlodipine, Metformin, Aspirin',
    checkBtn: 'যাচাই করুন',
    sentToDoctor: '✓ ডাক্তারকে পাঠানো হয়েছে',
    sendClashToDoctor: 'ডাক্তারকে রিপোর্ট পাঠান',
    recordFullIntake: 'সম্পূর্ণ কেস ফর্ম পূরণের জন্য এখানে ক্লিক করুন',
    synergyTitle: 'আয়ুর্বেদিক সমন্বয়',
    precautionTitle: 'চিকিৎসা সতর্কতা',
  },
  or: {
    villageMode: '🌾 ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟ ସେବା',
    citizenHealth: '🏙️ ନାଗରିକ ସ୍ୱାସ୍ଥ୍ୟ',
    stopVoice: 'ସ୍ୱର ବନ୍ଦ କରନ୍ତୁ',
    heroTitle: 'ରୋଗ କିମ୍ବା ଘରୋଇ ଉପଚାର ବିଷୟରେ ପଚାରନ୍ତୁ',
    heroSub: 'ମାଇକ୍ ଦବାଇ କୁହନ୍ତୁ କିମ୍ବା ଲେଖନ୍ତୁ:',
    listening: 'ଶୁଣୁଛୁ... କୁହନ୍ତୁ',
    tapMicToSpeak: 'କୁହିବା ପାଇଁ ମାଇକ୍ ଦବାନ୍ତୁ',
    searchPlaceholder: 'ଯଥା: ଆଣ୍ଠୁ ଗଣ୍ଠି ବାତ, ତୁଳସୀ, କାଶ, ଗୁଳୁଚି...',
    loading: 'ଚିକିତ୍ସା ତଥ୍ୟ ଖୋଜା ଚାଲିଛି...',
    yourQuery: 'ଆପଣଙ୍କ ପ୍ରଶ୍ନ',
    listen: 'ଶୁଣନ୍ତୁ',
    pause: 'ଅଟକାନ୍ତୁ',
    diagnosedCondition: 'ଚିହ୍ନଟ ରୋଗ',
    tier1Badge: 'ଟିୟର ୧ • ଜନ ଔଷଧି ଜେନେରିକ୍',
    tier1Sub: 'ପିଏମ୍‌ବିଜେପି କେନ୍ଦ୍ର',
    genericSalt: 'ଜେନେରିକ୍ ସଲ୍ଟ',
    subsidizedPrice: 'ସରକାରୀ ରିହାତି ମୂଲ୍ୟ',
    schedule: 'ସେବନ ସମୟ',
    tier2Badge: 'ଟିୟର ୨ • ଆୟୁଷ ଔଷଧୀୟ ବିଧି',
    tier2Sub: 'ଏପିଆଇ ଫାର୍ମାକୋପିଆ',
    botanical: 'ଉଦ୍ଭିଦ ନାମ',
    activeCompound: 'ସକ୍ରିୟ ଉପାଦାନ',
    dosageMedium: 'ମାତ୍ରା ଓ ଅନୁପାନ',
    tier3Badge: 'ଟିୟର ୩ • ସୁରକ୍ଷିତ ଘରୋଇ ଉପଚାର',
    tier3Sub: 'ରୋଷେଇ ଘର ଚିକିତ୍ସା',
    preparation: 'ପ୍ରସ୍ତୁତି ପ୍ରଣାଳୀ',
    mode: 'ବ୍ୟବହାର ବିଧି',
    caution: 'ଚେତାବନୀ',
    hospitalWarning: 'ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ ଯଦି:',
    herbDiscoveryBadge: '🌿 ବନୌଷଧି ବିବରଣୀ',
    multiHerbBadge: '🌿 ମିଶ୍ରିତ ବନୌଷଧି ଯୋଗ',
    govtGenericEquiv: '💊 ସରକାରୀ ଜନ ଔଷଧି ଔଷଧ:',
    indication: 'ଚିକିତ୍ସା',
    govtPrice: 'ସରକାରୀ ମୂଲ୍ୟ',
    usedFor: 'ପ୍ରମୁଖ ବ୍ୟବହାର',
    activeCompounds: 'ସକ୍ରିୟ ଉପାଦାନ',
    metabolicPathway: 'ଜୈବିକ ମାର୍ଗ',
    clashDetected: '⚠️ ଔଷଧ ଓ ଚେରମୂଳି ମଧ୍ୟରେ ବିବାଦ',
    safeToTake: '✓ ଉଭୟ ଏକାଠି ନେବା ସୁରକ୍ଷିତ',
    confidence: 'ବିଶ୍ୱାସନୀୟତା',
    evidence: 'ଡାକ୍ତରୀ ପ୍ରମାଣ',
    caseSentToClinician: '✓ ଡାକ୍ତରଙ୍କୁ ପଠାଗଲା',
    sendClashToClinician: 'ଡାକ୍ତରଙ୍କ ସମୀକ୍ଷା ପାଇଁ ପଠାନ୍ତୁ',
    rxBoxTitle: 'ଆପଣ ନିୟମିତ କୌଣସି ଔଷଧ ଖାଉଛନ୍ତି କି?',
    rxBoxPlaceholder: 'ଯଥା: Warfarin, Amlodipine, Metformin, Aspirin',
    checkBtn: 'ଯାଞ୍ଚ କରନ୍ତୁ',
    sentToDoctor: '✓ ଡାକ୍ତରଙ୍କୁ ପଠାଗଲା',
    sendClashToDoctor: 'ଡାକ୍ତରଙ୍କୁ ରିପୋର୍ଟ ପଠାନ୍ତୁ',
    recordFullIntake: 'ସମ୍ପୂର୍ଣ୍ଣ ବିବରଣୀ ଲେଖିବା ପାଇଁ ଏଠାରେ କ୍ଲିକ୍ କରନ୍ତୁ',
    synergyTitle: 'ଆୟୁର୍ବେଦିକ ସହଯୋଗ',
    precautionTitle: 'ଡାକ୍ତରୀ ସତର୍କତା',
  },
  as: {
    villageMode: '🌾 গ্ৰাম্য স্বাস্থ্য সেৱা',
    citizenHealth: '🏙️ নাগৰিক স্বাস্থ্য',
    stopVoice: 'কণ্ঠস্বৰ বন্ধ কৰক',
    heroTitle: 'আপোনাৰ ৰোগ বা ঘৰুৱা নিদানৰ বিষয়ে সোধক',
    heroSub: 'মাইক টিপি কওক বা তলত লিখক:',
    listening: 'শুনি আছো... কওক',
    tapMicToSpeak: 'ক’বলৈ মাইকত টিপক',
    searchPlaceholder: 'যেনে: আঁঠুৰ বিষ, তুলসী, চৰ্দী-কাহ...',
    loading: 'চিকিৎসা নথি সন্ধান কৰা হৈছে...',
    yourQuery: 'আপোনাৰ প্ৰশ্ন',
    listen: 'শুনক',
    pause: 'ৰখাৱক',
    diagnosedCondition: 'শনাক্ত কৰা ৰোগ',
    tier1Badge: 'টিয়াৰ ১ • জন ঔষধি জেনেৰিক',
    tier1Sub: 'পিএমবিজিপি কেন্দ্ৰ',
    genericSalt: 'জেনেৰিক ছল্ট',
    subsidizedPrice: 'চৰকাৰী ৰেহাই মূল্য',
    schedule: 'খোৱাৰ সময়',
    tier2Badge: 'টিয়াৰ ২ • আয়ুষ বনৌষধি নিদান',
    tier2Sub: 'এপিআই ফাৰ্মাকোপিয়া',
    botanical: 'উদ্ভিদৰ নাম',
    activeCompound: 'সক্ৰিয় উপাদান',
    dosageMedium: 'মাত্ৰা আৰু নিয়ম',
    tier3Badge: 'টিয়াৰ ৩ • সুৰক্ষিত ঘৰুৱা চিকিৎসা',
    tier3Sub: 'ৰান্ধনিঘৰৰ নিদান',
    preparation: 'প্ৰস্তুত প্ৰণালী',
    mode: 'ব্যৱহাৰৰ নিয়ম',
    caution: 'সতৰ্কবাণী',
    hospitalWarning: 'তৎক্ষণাৎ চিকিৎসালয়লৈ যাওক যদি:',
    herbDiscoveryBadge: '🌿 বনৌষধি বিৱৰণ',
    multiHerbBadge: '🌿 মিশ্ৰিত বনৌষধি যোগ',
    govtGenericEquiv: '💊 চৰকাৰী জন ঔষধি ঔষধ:',
    indication: 'চিকিৎসা',
    govtPrice: 'চৰকাৰী মূল্য',
    usedFor: 'প্ৰধান ব্যৱহাৰ',
    activeCompounds: 'সক্ৰিয় উপাদান',
    metabolicPathway: 'মেটাবলিক পথ',
    clashDetected: '⚠️ ঔষধ আৰু বনৌষধিৰ মাজত সম্ভাব্য বিপদ',
    safeToTake: '✓ দুয়োটা একেলগে খোৱা সুৰক্ষিত',
    confidence: 'বিশ্বাসযোগ্যতা',
    evidence: 'চিকিৎসাজনিত প্ৰমাণ',
    caseSentToClinician: '✓ চিকিৎসকৰ ওচৰলৈ প্ৰেৰণ কৰা হ’ল',
    sendClashToClinician: 'চিকিৎসকৰ নিৰীক্ষণৰ বাবে প্ৰেৰণ কৰক',
    rxBoxTitle: 'আপুনি নিয়মিত কোনো ঔষধ খাই আছে নেকি?',
    rxBoxPlaceholder: 'যেনে: Warfarin, Amlodipine, Metformin, Aspirin',
    checkBtn: 'পৰীক্ষা কৰক',
    sentToDoctor: '✓ চিকিৎসকক প্ৰেৰণ কৰা হ’ল',
    sendClashToDoctor: 'চিকিৎসকক প্ৰতিবেদন প্ৰেৰণ কৰক',
    recordFullIntake: 'সম্পূৰ্ণ কেছ নথিভুক্ত কৰিবলৈ ইয়াত ক্লিক কৰক',
    synergyTitle: 'আয়ুৰ্বেদিক সমন্বয়',
    precautionTitle: 'চিকিৎসা সতৰ্কতা',
  },
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onStartRemedy,
  onStartPrescription,
  onOpenKnowledge,
  onOpenAlternatives,
  onOpenIvr,
  onOpenEmergency,
  onTriggerEmergency,
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

      // Handle Immediate Life-Threatening Emergency Red-Flags
      if (response.type === 'emergency_red_flag') {
        if (onTriggerEmergency) {
          onTriggerEmergency(response.emergencyCase);
        }
        if (response.localizedNarrationText) {
          VoiceEngineService.speakInLanguage(response.localizedNarrationText, lang as any);
        }
        return;
      }

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
                    {activeResult.isDynamicResearch ? (
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-violet-700 text-white text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-xs">
                          <Sparkles className="w-3 h-3 text-yellow-300" />
                          {lang === 'hi' ? '🌐 लाइव शोध व AI विश्लेषण' : lang === 'gu' ? '🌐 લાઈવ સંશોધન (AI)' : lang === 'pa' ? '🌐 ਲਾਈਵ ਖੋਜ (AI)' : '🌐 Dynamic Medical Research'}
                        </span>
                        {activeResult.researchCitation && (
                          <span className="text-[10px] font-bold text-violet-800 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200 truncate max-w-[240px]">
                            {activeResult.researchCitation}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                        {ui.diagnosedCondition}
                      </span>
                    )}
                    <h3 className="text-base font-black text-slate-900">
                      {activeResult.conditionRecord.conditionName}
                    </h3>
                  </div>

                  {/* 3-Tier Tabs Switcher */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-2xl">
                    {[
                      { id: 'tier1', label: ui.tier1Badge.split('•')[0] || 'Tier 1', sub: ui.tier1Sub, icon: Pill },
                      { id: 'tier2', label: ui.tier2Badge.split('•')[0] || 'Tier 2', sub: ui.tier2Sub, icon: Leaf },
                      { id: 'tier3', label: ui.tier3Badge.split('•')[0] || 'Tier 3', sub: ui.tier3Sub, icon: HomeIcon },
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
                          {ui.tier1Badge}
                        </span>
                        <span className="text-[10px] font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-300">
                          {ui.tier1Sub}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-blue-950">
                        {activeResult.conditionRecord.officialGeneric.medicineName}
                      </h4>
                      <div className="text-xs font-semibold text-blue-900/90 space-y-1">
                        <p>• <strong>{ui.genericSalt}:</strong> {activeResult.conditionRecord.officialGeneric.genericSalt}</p>
                        <p>• <strong>{ui.subsidizedPrice}:</strong> {activeResult.conditionRecord.officialGeneric.pmbjpPriceINR}</p>
                        <p>• <strong>{ui.schedule}:</strong> {activeResult.conditionRecord.officialGeneric.standardDosageSchedule}</p>
                      </div>
                    </div>
                  )}

                  {/* Tier 2: AYUSH Monograph */}
                  {activeTierTab === 'tier2' && (
                    <div className="p-4 rounded-3xl bg-emerald-50/90 border-2 border-emerald-400 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider">
                          {ui.tier2Badge}
                        </span>
                        <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          {ui.tier2Sub}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-emerald-950">
                        {activeResult.conditionRecord.ayushClassicalFormulation.formulationName}
                      </h4>
                      <div className="text-xs font-semibold text-emerald-900/90 space-y-1">
                        <p>• <strong>{ui.botanical}:</strong> <em>{activeResult.conditionRecord.ayushClassicalFormulation.scientificBotanical}</em></p>
                        <p>• <strong>{ui.activeCompound}:</strong> {activeResult.conditionRecord.ayushClassicalFormulation.activePhytochemical}</p>
                        <p>• <strong>{ui.dosageMedium}:</strong> {activeResult.conditionRecord.ayushClassicalFormulation.ayushDosage} with {activeResult.conditionRecord.ayushClassicalFormulation.anupanaDietaryMedium}</p>
                      </div>
                    </div>
                  )}

                  {/* Tier 3: Kitchen Safe Remedy */}
                  {activeTierTab === 'tier3' && (
                    <div className="p-4 rounded-3xl bg-amber-50/90 border-2 border-amber-400 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider">
                          {ui.tier3Badge}
                        </span>
                        <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          {ui.tier3Sub}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-amber-950">
                        {activeResult.conditionRecord.verifiedHomeRemedy.kitchenItem}
                      </h4>
                      <div className="text-xs font-semibold text-amber-950/90 space-y-1">
                        <p>• <strong>{ui.preparation}:</strong> {activeResult.conditionRecord.verifiedHomeRemedy.preparationMethod}</p>
                        <p>• <strong>{ui.mode}:</strong> {activeResult.conditionRecord.verifiedHomeRemedy.modeOfAdministration}</p>
                        <p className="text-red-700 font-bold">• <strong>{ui.caution}:</strong> {activeResult.conditionRecord.verifiedHomeRemedy.contraindicationWarning}</p>
                      </div>
                    </div>
                  )}

                  {/* Hospital Warning */}
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{ui.hospitalWarning} <strong>{activeResult.conditionRecord.escalationProtocol.dangerSigns[0]}</strong>.</span>
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
                  BRANCH 4: UNRECOGNIZED / UNLISTED CLINICAL QUERY
                 ---------------------------------------------------- */}
              {activeResult.type === 'unrecognized' && (
                <div className="p-5 rounded-3xl bg-amber-50/90 border-2 border-amber-300 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-700 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Protocol Not in National Ledger
                    </span>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                      Safety Abstention Active
                    </span>
                  </div>

                  <h3 className="text-base font-black text-amber-950 leading-snug">
                    No Verified Clinical Protocol Found for "{activeResult.queryText}"
                  </h3>

                  <p className="text-xs font-medium text-amber-900/90 leading-relaxed">
                    {activeResult.localizedNarrationText}
                  </p>

                  <div className="p-3 bg-white/80 rounded-2xl border border-amber-200/80 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-800 block">
                      Common Verified National Health Protocols:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {[
                        { label: 'Back Pain (कमर दर्द)', query: 'back pain' },
                        { label: 'Dengue (डेंगू)', query: 'dengue' },
                        { label: 'Fever (बुखार)', query: 'fever' },
                        { label: 'Diabetes (शुगर)', query: 'diabetes' },
                        { label: 'High BP (रक्तचाप)', query: 'high bp' },
                        { label: 'Acidity (गैस/जलन)', query: 'acidity' },
                        { label: 'Cough & Cold (खांसी)', query: 'cough' },
                        { label: 'Asthma (दमा)', query: 'asthma' },
                        { label: 'Kidney Stone (पथरी)', query: 'kidney stone' },
                        { label: 'Migraine (सिरदर्द)', query: 'migraine' },
                        { label: 'Diarrhea (दस्त)', query: 'diarrhea' },
                        { label: 'UTI (पेशाब जलन)', query: 'uti' },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setQueryInput(item.query);
                            handleExecuteQuery(item.query);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 text-[11px] font-bold border border-slate-200 transition"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={onStartRemedy}
                      className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
                    >
                      <Leaf className="w-3.5 h-3.5" />
                      <span>Log as Community Remedy Intake</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  SEAMLESS IN-CARD PRESCRIPTION CROSS-CHECK DRAWER (WHITE THEME)
                 ---------------------------------------------------- */}
              {activeResult.type !== 'direct_safety_check' && activeResult.type !== 'unrecognized' && (
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
