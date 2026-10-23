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
  govtMedicineBadge: string;
  govtMedicineSub: string;
  genericSalt: string;
  subsidizedPrice: string;
  schedule: string;
  herbalBadge: string;
  herbalSub: string;
  botanical: string;
  activeCompound: string;
  dosageMedium: string;
  homeCareBadge: string;
  homeCareSub: string;
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
    villageMode: 'Village Care',
    citizenHealth: 'Citizen Health',
    stopVoice: 'Stop Voice',
    heroTitle: 'Ask about any Symptom, Herb or Medicine',
    heroSub: 'Tap mic to speak or type below:',
    listening: 'Listening... Speak now',
    tapMicToSpeak: 'Tap mic to speak',
    searchPlaceholder: 'e.g. knee pain, cough, fever, Tulsi...',
    loading: 'Checking medical advisory...',
    yourQuery: 'Your Query',
    listen: 'Listen',
    pause: 'Pause',
    diagnosedCondition: 'Identified Condition',
    govtMedicineBadge: 'Government Generic Medicine',
    govtMedicineSub: 'Subsidized Medicine',
    genericSalt: 'Generic Salt',
    subsidizedPrice: 'Government Price',
    schedule: 'How to Take',
    herbalBadge: 'Ayurvedic & Home Care',
    herbalSub: 'Natural Remedy',
    botanical: 'Plant Name',
    activeCompound: 'Active Element',
    dosageMedium: 'Dosage & Medium',
    homeCareBadge: 'Kitchen Safe Remedy',
    homeCareSub: 'Safe Home Care',
    preparation: 'Preparation',
    mode: 'Usage',
    caution: 'Precaution',
    hospitalWarning: 'Visit hospital immediately if:',
    herbDiscoveryBadge: 'Herbal Knowledge',
    multiHerbBadge: 'Herbal Combination',
    govtGenericEquiv: 'Government Generic Medicine:',
    indication: 'Used For',
    govtPrice: 'Price',
    usedFor: 'Primary Benefits',
    activeCompounds: 'Key Elements',
    metabolicPathway: 'Body Action',
    clashDetected: 'Medicine Interaction Warning',
    safeToTake: 'Safe to Take Together',
    confidence: 'Confidence',
    evidence: 'Medical Basis',
    caseSentToClinician: 'Sent to Doctor',
    sendClashToClinician: 'Send Report to Doctor',
    rxBoxTitle: 'Taking any daily medicine? Check for clashes:',
    rxBoxPlaceholder: 'e.g. Blood pressure or diabetes medicine',
    checkBtn: 'Check',
    sentToDoctor: 'Sent to Doctor',
    sendClashToDoctor: 'Send Report to Doctor',
    recordFullIntake: 'Record full case details here',
    synergyTitle: 'Herbal Synergy',
    precautionTitle: 'Safety Warning',
  },
  hi: {
    villageMode: 'ग्रामीण स्वास्थ्य',
    citizenHealth: 'नागरिक स्वास्थ्य',
    stopVoice: 'आवाज रोकें',
    heroTitle: 'किसी भी बीमारी, लक्षण या दवा के बारे में पूछें',
    heroSub: 'माइक दबाकर बोलें या नीचे लिखें:',
    listening: 'सुन रहे हैं... बोलिए',
    tapMicToSpeak: 'बोलने के लिए माइक दबाएं',
    searchPlaceholder: 'जैसे घुटने का दर्द, खांसी, बुखार, तुलसी...',
    loading: 'चिकित्सा सलाह खोजी जा रही है...',
    yourQuery: 'आपका सवाल',
    listen: 'सुनें',
    pause: 'रोकें',
    diagnosedCondition: 'पहचाना गया विकार',
    govtMedicineBadge: 'सरकारी सस्ती दवा',
    govtMedicineSub: 'सस्ती जन औषधि',
    genericSalt: 'दवा का साल्ट',
    subsidizedPrice: 'सरकारी मूल्य',
    schedule: 'लेने का समय व तरीका',
    herbalBadge: 'घरेलू व आयुर्वेदिक नुस्खा',
    herbalSub: 'प्राकृतिक उपचार',
    botanical: 'पौधे का नाम',
    activeCompound: 'मुख्य तत्व',
    dosageMedium: 'मात्रा व अनुपान',
    homeCareBadge: 'रसोई का सुरक्षित नुस्खा',
    homeCareSub: 'घरेलू देखरेख',
    preparation: 'बनाने की विधि',
    mode: 'इस्तेमाल का तरीका',
    caution: 'सावधानी व परहेज',
    hospitalWarning: 'तुरंत अस्पताल जाएं यदि:',
    herbDiscoveryBadge: 'औषधीय जड़ी-बूटी',
    multiHerbBadge: 'मिश्रित आयुर्वेदिक योग',
    govtGenericEquiv: 'सरकारी जन औषधि दवा:',
    indication: 'रोग उपचार',
    govtPrice: 'सरकारी दर',
    usedFor: 'मुख्य लाभ',
    activeCompounds: 'सक्रिय घटक',
    metabolicPathway: 'शारीरिक प्रभाव',
    clashDetected: 'दवा टकराव की चेतावनी',
    safeToTake: 'दोनों साथ लेना पूरी तरह सुरक्षित है',
    confidence: 'सटीकता',
    evidence: 'चिकित्सा प्रमाण',
    caseSentToClinician: 'डॉक्टर को भेजा गया',
    sendClashToClinician: 'डॉक्टर को रिपोर्ट भेजें',
    rxBoxTitle: 'क्या आप कोई नियमित अंग्रेजी दवा ले रहे हैं?',
    rxBoxPlaceholder: 'जैसे बीपी, शुगर या खून पतला करने की गोली',
    checkBtn: 'जांचें',
    sentToDoctor: 'डॉक्टर को भेजा गया',
    sendClashToDoctor: 'डॉक्टर को रिपोर्ट भेजें',
    recordFullIntake: 'पूरा विवरण दर्ज करने के लिए यहां दबाएं',
    synergyTitle: 'पारस्परिक प्रभाव',
    precautionTitle: 'चिकित्सीय सावधानी',
  },
  gu: {
    villageMode: 'ગ્રામીણ આરોગ્ય',
    citizenHealth: 'નાગરિક આરોગ્ય',
    stopVoice: 'અવાજ બંધ કરો',
    heroTitle: 'કોઈપણ રોગ, લક્ષણ અથવા દવા વિશે પૂછો',
    heroSub: 'માઈક દબાવીને બોલો અથવા નીચે લખો:',
    listening: 'સાંભળી રહ્યા છીએ... બોલો',
    tapMicToSpeak: 'બોલવા માટે માઈક દબાવો',
    searchPlaceholder: 'જેમ કે ગોઠણનો દુખાવો, ખાંસી, તાવ, તુલસી...',
    loading: 'તબીબી સલાહ શોધાઈ રહી છે...',
    yourQuery: 'તમારો પ્રશ્ન',
    listen: 'સાંભળો',
    pause: 'અટકાવો',
    diagnosedCondition: 'ઓળખાયેલ તકલીફ',
    govtMedicineBadge: 'સરકારી સસ્તી દવા',
    govtMedicineSub: 'જન ઔષધિ દવા',
    genericSalt: 'દવાનો સાલ્ટ',
    subsidizedPrice: 'સરકારી ભાવ',
    schedule: 'લેવાનો સમય અને રીત',
    herbalBadge: 'ઘરગથ્થુ તથા આયુર્વેદિક ઉપચાર',
    herbalSub: 'કુદરતી સારવાર',
    botanical: 'વનસ્પતિનું નામ',
    activeCompound: 'મુખ્ય ઘટક',
    dosageMedium: 'માત્રા અને લેવાની રીત',
    homeCareBadge: 'રસોડાનો સુરક્ષિત નુસખો',
    homeCareSub: 'ઘરેલું ઉપચાર',
    preparation: 'બનાવવાની રીત',
    mode: 'વાપરવાની રીત',
    caution: 'સાવચેતી અને પરહેજી',
    hospitalWarning: 'તરત જ દવાખાને જવું જો:',
    herbDiscoveryBadge: 'ઔષધીય વનસ્પતિ',
    multiHerbBadge: 'આયુર્વેદિક મિશ્રણ',
    govtGenericEquiv: 'સરકારી જન ઔષધિ દવા:',
    indication: 'સારવાર',
    govtPrice: 'સરકારી ભાવ',
    usedFor: 'મુખ્ય ફાયદા',
    activeCompounds: 'સક્રિય તત્વો',
    metabolicPathway: 'શરીર પર અસર',
    clashDetected: 'દવાઓની આડઅસરની ચેતવણી',
    safeToTake: 'બંને સાથે લેવું એકદમ સુરક્ષિત છે',
    confidence: 'વિશ્વાસપાત્રતા',
    evidence: 'તબીબી પુરાવા',
    caseSentToClinician: 'ડૉક્ટરને મોકલાયેલ છે',
    sendClashToClinician: 'ડૉક્ટરને જાણ કરો',
    rxBoxTitle: 'શું તમે કોઈ નિયમિત દવા લઈ રહ્યા છો?',
    rxBoxPlaceholder: 'જેમ કે બીપી, ડાયાબિટીસ કે લોહી પાતળું કરવાની ગોળી',
    checkBtn: 'તપાસો',
    sentToDoctor: 'ડૉક્ટરને મોકલાયેલ છે',
    sendClashToDoctor: 'ડૉક્ટરને રિપોર્ટ મોકલો',
    recordFullIntake: 'સંપૂર્ણ વિગત નોંધવા માટે અહીં દબાવો',
    synergyTitle: 'આયુર્વેદિક મેળ',
    precautionTitle: 'તબીબી સાવચેતી',
  },
  pa: {
    villageMode: 'ਪੇਂਡੂ ਸਿਹਤ',
    citizenHealth: 'ਨਾਗਰਿਕ ਸਿਹਤ',
    stopVoice: 'ਆਵਾਜ਼ ਬੰਦ ਕਰੋ',
    heroTitle: 'ਕਿਸੇ ਵੀ ਬਿਮਾਰੀ, ਲੱਛਣ ਜਾਂ ਦਵਾਈ ਬਾਰੇ ਪੁੱਛੋ',
    heroSub: 'ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ ਜਾਂ ਹੇਠਾਂ ਲਿਖੋ:',
    listening: 'ਸੁਣ ਰਹੇ ਹਾਂ... ਬੋਲੋ ਜੀ',
    tapMicToSpeak: 'ਬੋਲਣ ਲਈ ਮਾਈਕ ਦਬਾਓ',
    searchPlaceholder: 'ਜਿਵੇਂ ਗੋਡੇ ਦਾ ਦਰਦ, ਖੰਘ, ਬੁਖਾਰ, ਤੁਲਸੀ...',
    loading: 'ਸਿਹਤ ਸਲਾਹ ਲੱਭੀ ਜਾ ਰਹੀ ਹੈ...',
    yourQuery: 'ਤੁਹਾਡਾ ਸਵਾਲ',
    listen: 'ਸੁਣੋ',
    pause: 'ਰੋਕੋ',
    diagnosedCondition: 'ਪਛਾਣੀ ਗਈ ਬਿਮਾਰੀ',
    govtMedicineBadge: 'ਸਰਕਾਰੀ ਸਸਤੀ ਦਵਾਈ',
    govtMedicineSub: 'ਜਨ ਔਸ਼ਧੀ ਕੇਂਦਰ',
    genericSalt: 'ਦਵਾਈ ਦਾ ਸਾਲਟ',
    subsidizedPrice: 'ਸਰਕਾਰੀ ਮੁੱਲ',
    schedule: 'ਲੈਣ ਦਾ ਤਰੀਕਾ ਅਤੇ ਸਮਾਂ',
    herbalBadge: 'ਘਰੇਲੂ ਅਤੇ ਆਯੁਰਵੈਦਿਕ ਨੁਸਖ਼ਾ',
    herbalSub: 'ਕੁਦਰਤੀ ਇਲਾਜ',
    botanical: 'ਬੂਟੇ ਦਾ ਨਾਮ',
    activeCompound: 'ਮੁੱਖ ਤੱਤ',
    dosageMedium: 'ਖੁਰਾਕ ਅਤੇ ਪਰਹੇਜ਼',
    homeCareBadge: 'ਰਸੋਈ ਦਾ ਦੇਸੀ ਨੁਸਖ਼ਾ',
    homeCareSub: 'ਘਰੇਲੂ ਦੇਖਭਾਲ',
    preparation: 'ਬਣਾਉਣ ਦਾ ਤਰੀਕਾ',
    mode: 'ਵਰਤੋਂ ਦਾ ਤਰੀਕਾ',
    caution: 'ਜ਼ਰੂਰੀ ਸਾਵਧਾਨੀ',
    hospitalWarning: 'ਤੁਰੰਤ ਹਸਪਤਾਲ ਜਾਓ ਜੇਕਰ:',
    herbDiscoveryBadge: 'ਦੇਸੀ ਜੜੀ-ਬੂਟੀ',
    multiHerbBadge: 'ਕੁਦਰਤੀ ਮਿਸ਼ਰਣ',
    govtGenericEquiv: 'ਸਰਕਾਰੀ ਜਨ ਔਸ਼ਧੀ ਦਵਾਈ:',
    indication: 'ਇਲਾਜ',
    govtPrice: 'ਸਰਕਾਰੀ ਰੇਟ',
    usedFor: 'ਮੁੱਖ ਫਾਇਦੇ',
    activeCompounds: 'ਅਸਰਦਾਰ ਤੱਤ',
    metabolicPathway: 'ਸਰੀਰਕ ਪ੍ਰਭਾਵ',
    clashDetected: 'ਦਵਾਈਆਂ ਦੇ ਆਪਸੀ ਨੁਕਸਾਨ ਦੀ ਚੇਤਾਵਨੀ',
    safeToTake: 'ਦੋਵੇਂ ਇਕੱਠੇ ਲੈਣਾ ਬਿਲਕੁਲ ਸੁਰੱਖਿਅਤ ਹੈ',
    confidence: 'ਭਰੋਸੇਯੋਗਤਾ',
    evidence: 'ਡਾਕਟਰੀ ਸਬੂਤ',
    caseSentToClinician: 'ਡਾਕਟਰ ਨੂੰ ਭੇਜਿਆ ਗਿਆ',
    sendClashToClinician: 'ਡਾਕਟਰ ਨੂੰ ਰਿਪੋਰਟ ਭੇਜੋ',
    rxBoxTitle: 'ਕੀ ਤੁਸੀਂ ਰੋਜ਼ਾਨਾ ਕੋਈ ਦਵਾਈ ਲੈਂਦੇ ਹੋ?',
    rxBoxPlaceholder: 'ਜਿਵੇਂ ਬੀਪੀ ਜਾਂ ਸ਼ੂਗਰ ਦੀ ਗੋਲੀ',
    checkBtn: 'ਜਾਂਚੋ',
    sentToDoctor: 'ਡਾਕਟਰ ਨੂੰ ਭੇਜਿਆ ਗਿਆ',
    sendClashToDoctor: 'ਡਾਕਟਰ ਨੂੰ ਰਿਪੋਰਟ ਭੇਜੋ',
    recordFullIntake: 'ਪੂਰਾ ਵੇਰਵਾ ਭਰਨ ਲਈ ਇੱਥੇ ਦਬਾਓ',
    synergyTitle: 'ਕੁਦਰਤੀ ਅਸਰ',
    precautionTitle: 'ਡਾਕਟਰੀ ਪਰਹੇਜ਼',
  },
  mr: {
    villageMode: 'ग्रामीण आरोग्य',
    citizenHealth: 'नागरिक आरोग्य',
    stopVoice: 'आवाज थांबवा',
    heroTitle: 'कोणत्याही आजार, लक्षण किंवा औषधाबद्दल विचारा',
    heroSub: 'माईक दाबून बोला किंवा खाली लिहा:',
    listening: 'ऐकत आहे... बोला',
    tapMicToSpeak: 'बोलण्यासाठी माईक दाबा',
    searchPlaceholder: 'जसे गुडघेदुखी, खोकला, ताप, तुळस...',
    loading: 'वैद्यकीय सल्ला शोधत आहे...',
    yourQuery: 'तुमचा प्रश्न',
    listen: 'ऐका',
    pause: 'थांबवा',
    diagnosedCondition: 'निदान झालेला त्रास',
    govtMedicineBadge: 'सरकारी स्वस्त औषध',
    govtMedicineSub: 'जन औषधी केंद्र',
    genericSalt: 'औषधाचा घटक',
    subsidizedPrice: 'सरकारी किंमत',
    schedule: 'घेण्याची वेळ व पद्धत',
    herbalBadge: 'घरगुती व आयुर्वेदिक उपचार',
    herbalSub: 'नैसर्गिक उपाय',
    botanical: 'वनस्पतीचे नाव',
    activeCompound: 'मुख्य घटक',
    dosageMedium: 'प्रमाण आणि अनुपान',
    homeCareBadge: 'स्वयंपाकघरातील सुरक्षित उपाय',
    homeCareSub: 'घरगुती काळजी',
    preparation: 'तयार करण्याची पद्धत',
    mode: 'वापरण्याची पद्धत',
    caution: 'काळजी आणि पथ्य',
    hospitalWarning: 'लगेच रुग्णालयात जा जर:',
    herbDiscoveryBadge: 'औषधी वनस्पती',
    multiHerbBadge: 'आयुर्वेदिक मिश्रण',
    govtGenericEquiv: 'सरकारी जन औषधी औषध:',
    indication: 'उपचार',
    govtPrice: 'सरकारी दर',
    usedFor: 'मुख्य उपयोग',
    activeCompounds: 'सक्रिय घटक',
    metabolicPathway: 'शरीरावर होणारा परिणाम',
    clashDetected: 'औषधांच्या दुष्परिणामाचा इशारा',
    safeToTake: 'दोन्ही एकत्र घेणे सुरक्षित आहे',
    confidence: 'अचूकता',
    evidence: 'वैद्यकीय पुरावा',
    caseSentToClinician: 'डॉक्टरांकडे पाठवले',
    sendClashToClinician: 'डॉक्टरांना रिपोर्ट पाठवा',
    rxBoxTitle: 'तुम्ही रोजची कोणती गोळी घेता का?',
    rxBoxPlaceholder: 'उदा. बीपी, शुगर किंवा रक्त पातळ करण्याची गोळी',
    checkBtn: 'तपासा',
    sentToDoctor: 'डॉक्टरांकडे पाठवले',
    sendClashToDoctor: 'डॉक्टरांना रिपोर्ट पाठवा',
    recordFullIntake: 'संपूर्ण माहिती नोंदवण्यासाठी येथे दाबा',
    synergyTitle: 'आयुर्वेदिक प्रभाव',
    precautionTitle: 'वैद्यकीय काळजी',
  },
  ta: {
    villageMode: 'கிராமப்புற மருத்துவம்',
    citizenHealth: 'பொதுமக்கள் நல்வாழ்வு',
    stopVoice: 'குரலை நிறுத்து',
    heroTitle: 'நோய் அறிகுறிகள் அல்லது மருந்துகள் பற்றி கேட்கவும்',
    heroSub: 'பேச மைக் பொத்தானை அழுத்தவும் அல்லது தட்டச்சு செய்யவும்:',
    listening: 'கேட்கிறது... பேசுங்கள்',
    tapMicToSpeak: 'பேச மைக் அழுத்தவும்',
    searchPlaceholder: 'எ.கா: மூட்டு வலி, இருமல், காய்ச்சல், துளசி...',
    loading: 'மருத்துவ தகவல் தேடப்படுகிறது...',
    yourQuery: 'உங்கள் கேள்வி',
    listen: 'கேளுங்கள்',
    pause: 'நிறுத்து',
    diagnosedCondition: 'கண்டறியப்பட்ட பாதிப்பு',
    govtMedicineBadge: 'அரசு மானிய மருந்து',
    govtMedicineSub: 'மக்கள் மருந்தகம்',
    genericSalt: 'மருந்து மூலப்பொருள்',
    subsidizedPrice: 'அரசு மானிய விலை',
    schedule: 'சாப்பிடும் முறை',
    herbalBadge: 'பாரம்பரிய வீட்டு மருத்துவம்',
    herbalSub: 'இயற்கை வைத்தியம்',
    botanical: 'தாவரப் பெயர்',
    activeCompound: 'முக்கிய மூலக்கூறு',
    dosageMedium: 'அளவு மற்றும் வழிமுறை',
    homeCareBadge: 'பாதுகாப்பான கைவைத்தியம்',
    homeCareSub: 'வீட்டுப் பராமரிப்பு',
    preparation: 'தயாரிக்கும் முறை',
    mode: 'பயன்படுத்தும் முறை',
    caution: 'முன்னெச்சரிக்கை',
    hospitalWarning: 'உடனடியாக மருத்துவமனை செல்ல வேண்டிய அறிகுறிகள்:',
    herbDiscoveryBadge: 'மூலிகை விவரம்',
    multiHerbBadge: 'கூட்டு மூலிகை யோகம்',
    govtGenericEquiv: 'அரசு மக்கள் மருந்தக மருந்து:',
    indication: 'சிகிச்சை',
    govtPrice: 'அரசு விலை',
    usedFor: 'முக்கிய நன்மைகள்',
    activeCompounds: 'செயல்பாட்டு கூறுகள்',
    metabolicPathway: 'உடலில் செயல்படும் விதம்',
    clashDetected: 'மருந்து எதிர்வினை எச்சரிக்கை',
    safeToTake: 'இரண்டையும் ஒன்றாக உட்கொள்வது பாதுகாப்பானது',
    confidence: 'துல்லியம்',
    evidence: 'மருத்துவ ஆதாரம்',
    caseSentToClinician: 'மருத்துவருக்கு அனுப்பப்பட்டது',
    sendClashToClinician: 'மருத்துவருக்கு அறிக்கை அனுப்பவும்',
    rxBoxTitle: 'வழக்கமாக ஏதேனும் மாத்திரை சாப்பிடுகிறீர்களா?',
    rxBoxPlaceholder: 'எ.கா: ரத்த அழுத்தம் அல்லது சர்க்கரை மாத்திரை',
    checkBtn: 'சரிபார்',
    sentToDoctor: 'மருத்துவருக்கு அனுப்பப்பட்டது',
    sendClashToDoctor: 'மருத்துவருக்கு அறிக்கை அனுப்பவும்',
    recordFullIntake: 'முழு விவரங்களை பதிவு செய்ய இங்கே தொடவும்',
    synergyTitle: 'இயற்கை கூட்டுப் பலன்',
    precautionTitle: 'மருத்துவ எச்சரிக்கை',
  },
  te: {
    villageMode: 'గ్రామీణ ఆరోగ్య సేవ',
    citizenHealth: 'ప్రజా ఆరోగ్యం',
    stopVoice: 'వాయిస్ ఆపండి',
    heroTitle: 'ఏదైనా వ్యాధి, లక్షణం లేదా మందు గురించి అడగండి',
    heroSub: 'మైక్ నొక్కి మాట్లాడండి లేదా కింద టైప్ చేయండి:',
    listening: 'వింటున్నాము... మాట్లాడండి',
    tapMicToSpeak: 'మాట్లాడటానికి మైక్ నొక్కండి',
    searchPlaceholder: 'ఉదా: కీళ్ల నొప్పులు, దగ్గు, జ్వరం, తులసి...',
    loading: 'వైద్య సలహా వెతుకుతోంది...',
    yourQuery: 'మీ ప్రశ్న',
    listen: 'వినండి',
    pause: 'ఆపండి',
    diagnosedCondition: 'గుర్తించిన అనారోగ్యం',
    govtMedicineBadge: 'ప్రభుత్వ జన ఔషధి మందు',
    govtMedicineSub: 'రాయితీ మందులు',
    genericSalt: 'జనరిక్ సాల్ట్',
    subsidizedPrice: 'ప్రభుత్వ ధర',
    schedule: 'వాడే సమయం మరియు విధానం',
    herbalBadge: 'ఇంటి చిట్కాలు మరియు ఆయుర్వేదం',
    herbalSub: 'సహజ వైద్యం',
    botanical: 'మొక్క పేరు',
    activeCompound: 'ప్రధాన మూలకం',
    dosageMedium: 'మోతాదు మరియు వాడే విధానం',
    homeCareBadge: 'వంటగది సురక్షిత చిట్కా',
    homeCareSub: 'ఇంటి సంరక్షణ',
    preparation: 'తయారుచేసే విధానం',
    mode: 'వాడే పద్ధతి',
    caution: 'జాగ్రత్తలు మరియు పత్యం',
    hospitalWarning: 'వెంటనే ఆసుపత్రికి వెళ్ళవలసిన పరిస్థితులు:',
    herbDiscoveryBadge: 'ఔషధ మూలిక',
    multiHerbBadge: 'ఆయుర్వేద మిశ్రమం',
    govtGenericEquiv: 'ప్రభుత్వ జన ఔషధి సమాన మందు:',
    indication: 'చికిత్స',
    govtPrice: 'ప్రభుత్వ ధర',
    usedFor: 'ప్రధాన ఉపయోగాలు',
    activeCompounds: 'చురుకైన భాగాలు',
    metabolicPathway: 'శరీరంలో పనితీరు',
    clashDetected: 'మందుల మధ్య విరుద్ధ చర్య హెచ్చరిక',
    safeToTake: 'రెండూ కలిసి వాడటం పూర్తిగా సురక్షితం',
    confidence: 'ఖచ్చితత్వం',
    evidence: 'వైద్య ఆధారాలు',
    caseSentToClinician: 'వైద్యునికి పంపబడింది',
    sendClashToClinician: 'వైద్యునికి నివేదిక పంపండి',
    rxBoxTitle: 'మీరు రోజూ ఏదైనా మందు వాడుతున్నారా?',
    rxBoxPlaceholder: 'ఉదా: బీపీ లేదా షుగర్ మాత్రలు',
    checkBtn: 'పరిశీలించండి',
    sentToDoctor: 'వైద్యునికి పంపబడింది',
    sendClashToDoctor: 'వైద్యునికి నివేదిక పంపండి',
    recordFullIntake: 'పూర్తి వివరాలు నమోదు చేయడానికి ఇక్కడ నొక్కండి',
    synergyTitle: 'సహజ మిశ్రమ ప్రభావం',
    precautionTitle: 'వైద్యపరమైన జాగ్రత్త',
  },
  bn: {
    villageMode: 'গ্রামীণ স্বাস্থ্যসেবা',
    citizenHealth: 'নাগরিক স্বাস্থ্য',
    stopVoice: 'ভয়েস বন্ধ করুন',
    heroTitle: 'যেকোনো রোগ, লক্ষণ বা ওষুধ সম্পর্কে জানুন',
    heroSub: 'মাইক চেপে কথা বলুন অথবা নিচে লিখুন:',
    listening: 'শুনছি... বলুন',
    tapMicToSpeak: 'কথা বলতে মাইক চাপুন',
    searchPlaceholder: 'যেমন হাঁটুর ব্যথা, কাশি, জ্বর, তুলসী...',
    loading: 'চিকিৎসা পরামর্শ খোঁজা হচ্ছে...',
    yourQuery: 'আপনার প্রশ্ন',
    listen: 'শুনুন',
    pause: 'থামান',
    diagnosedCondition: 'শনাক্তকৃত স্বাস্থ্য সমস্যা',
    govtMedicineBadge: 'সরকারি জেনেরিক ওষুধ',
    govtMedicineSub: 'জন ঔষধি কেন্দ্র',
    genericSalt: 'ওষুধের উপাদান',
    subsidizedPrice: 'সরকারি ভর্তুকিযুক্ত মূল্য',
    schedule: 'খাওয়ার নিয়ম ও সময়',
    herbalBadge: 'ঘরোয়া ও আয়ুর্বেদিক প্রতিকার',
    herbalSub: 'ভেষজ চিকিৎসা',
    botanical: 'গাছের নাম',
    activeCompound: 'প্রধান উপাদান',
    dosageMedium: 'পরিমাণ ও সেবন পদ্ধতি',
    homeCareBadge: 'রান্নাঘরের নিরাপদ ঘরোয়া দাওয়াই',
    homeCareSub: 'ঘরোয়া যত্ন',
    preparation: 'বানানোর নিয়ম',
    mode: 'ব্যবহারের পদ্ধতি',
    caution: 'জরুরি সতর্কতা',
    hospitalWarning: 'অবিলম্বে হাসপাতালে যান যদি:',
    herbDiscoveryBadge: 'ভেষজ উদ্ভিদ পরিচিতি',
    multiHerbBadge: 'আয়ুর্বেদিক ভেষজ মিশ্রণ',
    govtGenericEquiv: 'সরকারি জন ঔষধি বিকল্প:',
    indication: 'চিকিৎসা',
    govtPrice: 'সরকারি দাম',
    usedFor: 'প্রধান উপকারিতা',
    activeCompounds: 'সক্রিয় উপাদান',
    metabolicPathway: 'শারীরিক ক্রিয়া',
    clashDetected: 'ওষুধের ক্ষতিকর প্রতিক্রিয়ার সতর্কতা',
    safeToTake: 'দুটো একসাথে খাওয়া সম্পূর্ণ নিরাপদ',
    confidence: 'নির্ভরযোগ্যতা',
    evidence: 'চিকিৎসা প্রমাণ',
    caseSentToClinician: 'ডাক্তারকে পাঠানো হয়েছে',
    sendClashToClinician: 'ডাক্তারের কাছে রিপোর্ট পাঠান',
    rxBoxTitle: 'আপনি কি নিয়মিত কোনো ওষুধ খান?',
    rxBoxPlaceholder: 'যেমন প্রেশার বা সুগারের ওষুধ',
    checkBtn: 'যাচাই করুন',
    sentToDoctor: 'ডাক্তারকে পাঠানো হয়েছে',
    sendClashToDoctor: 'ডাক্তারের কাছে রিপোর্ট পাঠান',
    recordFullIntake: 'সম্পূর্ণ তথ্য রেকর্ড করতে এখানে চাপুন',
    synergyTitle: 'ভেষজ যৌথ প্রভাব',
    precautionTitle: 'চিকিৎসা সতর্কতা',
  },
  kn: {
    villageMode: 'ಗ್ರಾಮೀಣ ಆರೋಗ್ಯ ಸೇವೆ',
    citizenHealth: 'ನಾಗರಿಕ ಆರೋಗ್ಯ',
    stopVoice: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
    heroTitle: 'ಯಾವುದೇ ಕಾಯಿಲೆ, ರೋಗಲಕ್ಷಣ ಅಥವಾ ಔಷಧದ ಬಗ್ಗೆ ಕೇಳಿ',
    heroSub: 'ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ ಅಥವಾ ಕೆಳಗೆ ಬರೆಯಿರಿ:',
    listening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ... ಮಾತನಾಡಿ',
    tapMicToSpeak: 'ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ',
    searchPlaceholder: 'ಉದಾ: ಮೊಣಕಾಲು ನೋವು, ಕೆಮ್ಮು, ಜ್ವರ, ತುಳಸಿ...',
    loading: 'ವೈದ್ಯಕೀಯ ಸಲಹೆ ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    yourQuery: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ',
    listen: 'ಕೇಳಿ',
    pause: 'ನಿಲ್ಲಿಸಿ',
    diagnosedCondition: 'ಗುರುತಿಸಲಾದ ಕಾಯಿಲೆ',
    govtMedicineBadge: 'ಸರ್ಕಾರಿ ಜನೌಷಧಿ ಔಷಧಿ',
    govtMedicineSub: 'ರಿಯಾಯಿತಿ ಔಷಧಿ',
    genericSalt: 'ಔಷಧಿಯ ಸಾಲ್ಟ್',
    subsidizedPrice: 'ಸರ್ಕಾರಿ ದರ',
    schedule: 'ಸೇವಿಸುವ ವಿಧಾನ ಮತ್ತು ಸಮಯ',
    herbalBadge: 'ಮನೆಮದ್ದು ಮತ್ತು ಆಯುರ್ವೇದ',
    herbalSub: 'ನೈಸರ್ಗಿಕ ಚಿಕಿತ್ಸೆ',
    botanical: 'ಸಸ್ಯದ ಹೆಸರು',
    activeCompound: 'ಪ್ರಮುಖ ಅಂಶ',
    dosageMedium: 'ಪ್ರಮಾಣ ಮತ್ತು ಅನುಪಾನ',
    homeCareBadge: 'ಅಡುಗೆಮನೆಯ ಸುರಕ್ಷಿತ ಮದ್ದು',
    homeCareSub: 'ಮನೆಯಲ್ಲೇ ಆರೈಕೆ',
    preparation: 'ತಯಾರಿಸುವ ವಿಧಾನ',
    mode: 'ಬಳಕೆಯ ವಿಧಾನ',
    caution: 'ಮುನ್ನೆಚ್ಚರಿಕೆ',
    hospitalWarning: 'ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ:',
    herbDiscoveryBadge: 'ಗಿಡಮೂಲಿಕೆ ವಿವರ',
    multiHerbBadge: 'ಆಯುರ್ವೇದ ಸಂಯೋಜನೆ',
    govtGenericEquiv: 'ಸರ್ಕಾರಿ ಜನೌಷಧಿ ಔಷಧಿ:',
    indication: 'ಚಿಕಿತ್ಸೆ',
    govtPrice: 'ಸರ್ಕಾರಿ ಬೆಲೆ',
    usedFor: 'ಮುಖ್ಯ ಉಪಯೋಗಗಳು',
    activeCompounds: 'ಸಕ್ರಿಯ ಘಟಕಗಳು',
    metabolicPathway: 'ಶರೀರದ ಮೇಲಿನ ಪ್ರಭಾವ',
    clashDetected: 'ಔಷಧಿಗಳ ನಡುವೆ ಅಡ್ಡಪರಿಣಾಮದ ಎಚ್ಚರಿಕೆ',
    safeToTake: 'ಎರಡನ್ನೂ ಒಟ್ಟಿಗೆ ತೆಗೆದುಕೊಳ್ಳುವುದು ಸುರಕ್ಷಿತ',
    confidence: 'ವಿಶ್ವಾಸಾರ್ಹತೆ',
    evidence: 'ವೈದ್ಯಕೀಯ ಪುರಾವೆ',
    caseSentToClinician: 'ವೈದ್ಯರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ',
    sendClashToClinician: 'ವೈದ್ಯರಿಗೆ ವರದಿ ಕಳುಹಿಸಿ',
    rxBoxTitle: 'ನೀವು ಪ್ರತಿದಿನ ಯಾವುದೇ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?',
    rxBoxPlaceholder: 'ಉದಾ: ರಕ್ತದೊತ್ತಡ ಅಥವಾ ಸಕ್ಕರೆ ಕಾಯಿಲೆಯ ಮಾತ್ರೆ',
    checkBtn: 'ಪರಿಶೀಲಿಸಿ',
    sentToDoctor: 'ವೈದ್ಯರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ',
    sendClashToDoctor: 'ವೈದ್ಯರಿಗೆ ವರದಿ ಕಳುಹಿಸಿ',
    recordFullIntake: 'ಸಂಪೂರ್ಣ ಮಾಹಿತಿ ದಾಖಲಿಸಲು ಇಲ್ಲಿ ಒತ್ತಿ',
    synergyTitle: 'ನೈಸರ್ಗಿಕ ಸಮ್ಮಿಶ್ರಣ',
    precautionTitle: 'ವೈದ್ಯಕೀಯ ಎಚ್ಚರಿಕೆ',
  },
  ml: {
    villageMode: 'ഗ്രാമീണ ആരോഗ്യ സേവനം',
    citizenHealth: 'പൗര ആരോഗ്യം',
    stopVoice: 'ശബ്ദം നിർത്തുക',
    heroTitle: 'രോഗലക്ഷണങ്ങളോ മരുന്നുകളോ ചോദിക്കുക',
    heroSub: 'മൈക്ക് അമർത്തി സംസാരിക്കുക അല്ലെങ്കിൽ താഴെ എഴുതുക:',
    listening: 'കേൾക്കുന്നു... സംസാരിക്കൂ',
    tapMicToSpeak: 'സംസാരിക്കാൻ മൈക്ക് അമർത്തുക',
    searchPlaceholder: 'ഉദാ: മുട്ടുവേദന, ചുമ, പനി, തുളസി...',
    loading: 'വൈദ്യോപദേശം പരിശോധിക്കുന്നു...',
    yourQuery: 'നിങ്ങളുടെ ചോദ്യം',
    listen: 'കേൾക്കുക',
    pause: 'നിർത്തുക',
    diagnosedCondition: 'കണ്ടെത്തിയ രോഗാവസ്ഥ',
    govtMedicineBadge: 'സർക്കാർ ജൻ ഔഷധി മരുന്ന്',
    govtMedicineSub: 'സബ്‌സിഡി നിരക്കിലുള്ള മരുന്ന്',
    genericSalt: 'ജനറിക് സാൾട്ട്',
    subsidizedPrice: 'സർക്കാർ സബ്‌സിഡി നിരക്ക്',
    schedule: 'കഴിക്കേണ്ട രീതിയും സമയവും',
    herbalBadge: 'ആയുർവേദവും വീട്ടുവൈദ്യവും',
    herbalSub: 'പ്രകൃതിദത്ത ചികിത്സ',
    botanical: 'സസ്യനാമം',
    activeCompound: 'പ്രധാന ഘടകം',
    dosageMedium: 'അളവും കഴിക്കേണ്ട രീതിയും',
    homeCareBadge: 'അടുക്കളയിലെ സുരക്ഷിത പ്രഥമശുശ്രൂഷ',
    homeCareSub: 'വീട്ടിലെ പരിചരണം',
    preparation: 'തയ്യാറാക്കുന്ന വിധം',
    mode: 'ഉപയോഗിക്കേണ്ട വിധം',
    caution: 'ജാഗ്രതയും പഥ്യവും',
    hospitalWarning: 'ഉടൻ ആശുപത്രിയിൽ പോകേണ്ട സാഹചര്യങ്ങൾ:',
    herbDiscoveryBadge: 'ഔഷധ വിവരങ്ങൾ',
    multiHerbBadge: 'സംയുക്ത ഔഷധ യോഗം',
    govtGenericEquiv: 'സർക്കാർ ജൻ ഔഷധി മരുന്ന്:',
    indication: 'ചികിത്സ',
    govtPrice: 'സർക്കാർ വില',
    usedFor: 'പ്രധാന ഉപയോഗങ്ങൾ',
    activeCompounds: 'പ്രധാന ഘടകങ്ങൾ',
    metabolicPathway: 'ശരീരത്തിലെ പ്രവർത്തനം',
    clashDetected: 'മരുന്നുകൾ തമ്മിലുള്ള പ്രതിപ്രവർത്തന മുന്നറിയിപ്പ്',
    safeToTake: 'രണ്ടും ഒരുമിച്ച് കഴിക്കുന്നത് സുരക്ഷിതമാണ്',
    confidence: 'വിശ്വാസ്യത',
    evidence: 'തെളിവ്',
    caseSentToClinician: 'ഡോക്ടർക്ക് അയച്ചു',
    sendClashToClinician: 'ഡോക്ടർക്ക് റിപ്പോർട്ട് അയക്കുക',
    rxBoxTitle: 'സ്ഥിരമായി എന്തെങ്കിലും മരുന്ന് കഴിക്കുന്നുണ്ടോ?',
    rxBoxPlaceholder: 'ഉദാ: പ്രഷറോ ഷുഗറോ മരുന്ന്',
    checkBtn: 'പരിശോധിക്കുക',
    sentToDoctor: 'ഡോക്ടർക്ക് അയച്ചു',
    sendClashToDoctor: 'ഡോക്ടർക്ക് റിപ്പോർട്ട് അയക്കുക',
    recordFullIntake: 'പൂർണ്ണ വിവരങ്ങൾ രേഖപ്പെടുത്താൻ ഇവിടെ അമർത്തുക',
    synergyTitle: 'ഔഷധ കൂട്ടായ്മ',
    precautionTitle: 'മുൻകരുതൽ',
  },
  or: {
    villageMode: 'ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟସେବା',
    citizenHealth: 'ନାଗରିକ ସ୍ୱାସ୍ଥ୍ୟ',
    stopVoice: 'ଶବ୍ଦ ବନ୍ଦ କରନ୍ତୁ',
    heroTitle: 'ଯେକୌଣସି ରୋଗ, ଲକ୍ଷଣ ବା ଔଷଧ ବିଷୟରେ ପଚାରନ୍ତୁ',
    heroSub: 'ମାଇକ୍ ଦବାଇ କୁହନ୍ତୁ କିମ୍ବା ତଳେ ଲେଖନ୍ତୁ:',
    listening: 'ଶୁଣୁଛୁ... କୁହନ୍ତୁ',
    tapMicToSpeak: 'କହିବା ପାଇଁ ମାଇକ୍ ଦବାନ୍ତୁ',
    searchPlaceholder: 'ଯେପରି ଆଣ୍ଠୁ ବିନ୍ଧା, କାଶ, ଜ୍ୱର, ତୁଳସୀ...',
    loading: 'ଡାକ୍ତରୀ ପରାମର୍ଶ ଖୋଜା ଚାଲିଛି...',
    yourQuery: 'ଆପଣଙ୍କ ପ୍ରଶ୍ନ',
    listen: 'ଶୁଣନ୍ତୁ',
    pause: 'ଅଟକାନ୍ତୁ',
    diagnosedCondition: 'ଚିହ୍ନଟ ହୋଇଥିବା ରୋଗ',
    govtMedicineBadge: 'ସରକାରୀ ଜନ ଔଷଧି',
    govtMedicineSub: 'ରିହାତି ଦର ଔଷଧ',
    genericSalt: 'ଜେନେରିକ୍ ସାଲ୍ଟ',
    subsidizedPrice: 'ସରକାରୀ ମୂଲ୍ୟ',
    schedule: 'ଖାଇବା ନିୟମ ଓ ସମୟ',
    herbalBadge: 'ଘରୋଇ ତଥା ଆୟୁର୍ବେଦିକ ଉପଚାର',
    herbalSub: 'ପ୍ରାକୃତିକ ଚିକିତ୍ସା',
    botanical: 'ଗଛର ନାମ',
    activeCompound: 'ମୁଖ୍ୟ ଉପାଦାନ',
    dosageMedium: 'ମାତ୍ରା ଓ ସେବନ ପଦ୍ଧତି',
    homeCareBadge: 'ରୋଷେଇ ଘରର ସୁରକ୍ଷିତ ଉପଚାର',
    homeCareSub: 'ଘରୋଇ ଯତ୍ନ',
    preparation: 'ପ୍ରସ୍ତୁତି ପ୍ରଣାଳୀ',
    mode: 'ବ୍ୟବହାର ବିଧି',
    caution: 'ସାବଧାନତା ଓ ନିୟମ',
    hospitalWarning: 'ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ ଯଦି:',
    herbDiscoveryBadge: 'ଔଷଧୀୟ ବୃକ୍ଷ',
    multiHerbBadge: 'ଆୟୁର୍ବେଦିକ ମିଶ୍ରଣ',
    govtGenericEquiv: 'ସରକାରୀ ଜନ ଔଷଧି ବିକଳ୍ପ:',
    indication: 'ରୋଗ ନିବାରଣ',
    govtPrice: 'ସରକାରୀ ଦର',
    usedFor: 'ମୁଖ୍ୟ ଉପକାରିତା',
    activeCompounds: 'ସକ୍ରିୟ ଉପାଦାନ',
    metabolicPathway: 'ଶରୀର ଉପରେ ପ୍ରଭାବ',
    clashDetected: 'ଔଷଧ ପାରସ୍ପରିକ କ୍ଷତି ଚେତାବନୀ',
    safeToTake: 'ଉଭୟ ଏକାଠି ଖାଇବା ସମ୍ପୂର୍ଣ୍ଣ ସୁରକ୍ଷିତ',
    confidence: 'ସଠିକତା',
    evidence: 'ଚିକିତ୍ସା ପ୍ରମାଣ',
    caseSentToClinician: 'ଡାକ୍ତରଙ୍କୁ ପଠାଗଲା',
    sendClashToClinician: 'ଡାକ୍ତରଙ୍କୁ ରିପୋର୍ଟ ପଠାନ୍ତୁ',
    rxBoxTitle: 'ଆପଣ ନିୟମିତ କୌଣସି ଔଷଧ ଖାଉଛନ୍ତି କି?',
    rxBoxPlaceholder: 'ଯେପରି ପ୍ରେସର ବା ଡାଇବେଟିସ ବଟିକା',
    checkBtn: 'ଯାଞ୍ଚ କରନ୍ତୁ',
    sentToDoctor: 'ଡାକ୍ତਰଙ୍କୁ ପଠାଗଲା',
    sendClashToDoctor: 'ଡାକ୍ତରଙ୍କୁ ରିପୋର୍ଟ ପଠାନ୍ତୁ',
    recordFullIntake: 'ସମ୍ପୂର୍ଣ୍ଣ ବିବରଣୀ ଲେଖିବା ପାଇଁ ଏଠାରେ ଦବାନ୍ତୁ',
    synergyTitle: 'ମିଶ୍ରିତ ଉପକାର',
    precautionTitle: 'ଡାକ୍ତରୀ ସତର୍କତା',
  },
  as: {
    villageMode: 'গ্ৰাম্য স্বাস্থ্যসেৱা',
    citizenHealth: 'নাগৰিক স্বাস্থ্য',
    stopVoice: 'মাত বন্ধ কৰক',
    heroTitle: 'যিকোনো ৰোগ, লক্ষণ বা ঔষধৰ বিষয়ে সোধক',
    heroSub: 'মাইক টিপি কথা কওক অথবা তলত লিখক:',
    listening: 'শুনি আছোঁ... কওক',
    tapMicToSpeak: 'কথা ক\'বলৈ মাইক টিপক',
    searchPlaceholder: 'যেনে আঁঠুৰ বিষ, কাহ, জ্বৰ, তুলসী...',
    loading: 'স্বাস্থ্য পৰামৰ্শ বিচাৰি থকা হৈছে...',
    yourQuery: 'আপোনাৰ প্ৰশ্ন',
    listen: 'শুনক',
    pause: 'ৰখাওক',
    diagnosedCondition: 'চিনাক্ত ৰোগৰ অৱস্থা',
    govtMedicineBadge: 'চৰকাৰী জেনেৰিক ঔষধ',
    govtMedicineSub: 'জন ঔষধি কেন্দ্ৰ',
    genericSalt: 'ঔষধৰ উপাদান',
    subsidizedPrice: 'চৰকাৰী ৰেহাই মূল্য',
    schedule: 'খোৱাৰ সময় আৰু নিয়ম',
    herbalBadge: 'ঘৰুৱা আৰু আয়ুৰ্বেদিক বিধান',
    herbalSub: 'প্ৰাকৃতিক চিকিৎসা',
    botanical: 'উদ্ভিদৰ নাম',
    activeCompound: 'প্ৰধান উপাদান',
    dosageMedium: 'পৰিমাণ আৰু ব্যৱহাৰৰ নিয়ম',
    homeCareBadge: 'ৰান্ধনিশালৰ নিৰাপদ বিধান',
    homeCareSub: 'ঘৰুৱা যত্ন',
    preparation: 'প্ৰস্তুত কৰাৰ নিয়ম',
    mode: 'ব্যৱহাৰৰ পদ্ধতি',
    caution: 'সাৱধানতা আৰু পথ্য',
    hospitalWarning: 'ততালিকে চিকিৎসালয়লৈ যাওক যদিহে:',
    herbDiscoveryBadge: 'ঔষধি উদ্ভিদ পৰিচিতি',
    multiHerbBadge: 'আয়ুৰ্বেদিক মিশ্ৰণ',
    govtGenericEquiv: 'চৰকাৰী জন ঔষধি ঔষধ:',
    indication: 'চিকিৎসা',
    govtPrice: 'চৰকাৰী মূল্য',
    usedFor: 'প্ৰধান উপকাৰিতা',
    activeCompounds: 'সক্ৰিয় উপাদান',
    metabolicPathway: 'শৰীৰত ক্ৰিয়া',
    clashDetected: 'ঔষধৰ পাৰস্পৰিক বিষক্ৰিয়াৰ সকীয়নি',
    safeToTake: 'দুয়োটা একেলগে খোৱাটো সম্পূৰ্ণ নিৰাপদ',
    confidence: 'নিৰ্ভৰযোগ্যতা',
    evidence: 'চিকিৎসা প্ৰমাণ',
    caseSentToClinician: 'চিকিৎসকক প্ৰেৰণ কৰা হৈছে',
    sendClashToClinician: 'চিকিৎসকলৈ প্ৰতিবেদন পঠিয়াওক',
    rxBoxTitle: 'আপুনি নিয়মীয়াকৈ কিবা ঔষধ খাই আছে নেকি?',
    rxBoxPlaceholder: 'যেনে প্ৰেছাৰ বা ডায়েবেটিচৰ টেবলেট',
    checkBtn: 'পৰীক্ষা কৰক',
    sentToDoctor: 'চিকিৎসকক প্ৰেৰণ কৰা হৈছে',
    sendClashToDoctor: 'চিকিৎসকলৈ প্ৰতিবেদন পঠিয়াওক',
    recordFullIntake: 'সম্পূৰ্ণ তথ্য লিপিবদ্ধ কৰিবলৈ ইয়াত টিপক',
    synergyTitle: 'প্ৰাকৃতিক সমন্বয়',
    precautionTitle: 'চিকিৎসা সাৱধানতা',
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

                  {/* CLEAN SINGLE-LANGUAGE HEALTH CARDS (NO TIER BOXES) */}
                  <div className="space-y-3 pt-1">
                    
                    {/* Card 1: Government Generic Medicine */}
                    <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                          <Pill className="w-4 h-4 text-blue-700" />
                          {ui.govtMedicineBadge}
                        </span>
                        <span className="text-[10px] font-bold text-blue-800 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                          {ui.govtMedicineSub}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-blue-950">
                        {activeResult.conditionRecord.officialGeneric.medicineName}
                      </h4>
                      <div className="text-xs text-blue-950/90 space-y-1 font-medium">
                        <p>• <strong>{ui.genericSalt}:</strong> {activeResult.conditionRecord.officialGeneric.genericSalt}</p>
                        <p>• <strong>{ui.subsidizedPrice}:</strong> {activeResult.conditionRecord.officialGeneric.pmbjpPriceINR}</p>
                        <p>• <strong>{ui.schedule}:</strong> {activeResult.conditionRecord.officialGeneric.standardDosageSchedule}</p>
                      </div>
                    </div>

                    {/* Card 2: Safe Herbal & Home Remedy */}
                    <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                          <Leaf className="w-4 h-4 text-emerald-700" />
                          {ui.herbalBadge}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                          {ui.herbalSub}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-emerald-950">
                        {activeResult.conditionRecord.ayushClassicalFormulation.formulationName}
                      </h4>
                      <div className="text-xs text-emerald-950/90 space-y-1 font-medium">
                        <p>• <strong>{ui.botanical}:</strong> <em>{activeResult.conditionRecord.ayushClassicalFormulation.scientificBotanical}</em></p>
                        <p>• <strong>{ui.activeCompound}:</strong> {activeResult.conditionRecord.ayushClassicalFormulation.activePhytochemical}</p>
                        <p>• <strong>{ui.dosageMedium}:</strong> {activeResult.conditionRecord.ayushClassicalFormulation.ayushDosage} ({activeResult.conditionRecord.ayushClassicalFormulation.anupanaDietaryMedium})</p>
                      </div>

                      {/* Kitchen Preparation */}
                      {activeResult.conditionRecord.verifiedHomeRemedy && activeResult.conditionRecord.verifiedHomeRemedy.kitchenItem && (
                        <div className="mt-2 pt-2 border-t border-emerald-200/80 text-xs space-y-1">
                          <p className="font-bold text-emerald-900">• {activeResult.conditionRecord.verifiedHomeRemedy.kitchenItem}</p>
                          <p className="text-[11px] text-emerald-800">• <strong>{ui.preparation}:</strong> {activeResult.conditionRecord.verifiedHomeRemedy.preparationMethod}</p>
                          {activeResult.conditionRecord.verifiedHomeRemedy.contraindicationWarning && (
                            <p className="text-[11px] text-amber-900 font-semibold">• <strong>{ui.caution}:</strong> {activeResult.conditionRecord.verifiedHomeRemedy.contraindicationWarning}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card 3: Hospital & Doctor Warning */}
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-start gap-2.5 shadow-2xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <strong className="font-black text-rose-900 block">{ui.hospitalWarning}</strong>
                        <span className="font-semibold text-rose-900/90">{activeResult.conditionRecord.escalationProtocol.dangerSigns[0]}</span>
                      </div>
                    </div>
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
                      चिकित्सीय परामर्श
                    </span>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                      
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
                        { 
                          label: lang === 'hi' ? 'कमर दर्द' : lang === 'gu' ? 'કમરનો દુખાવો' : lang === 'pa' ? 'ਲੱਕ ਦਰਦ' : lang === 'ta' ? 'இடுப்பு வலி' : lang === 'te' ? 'నడుము నొప్పి' : lang === 'bn' ? 'কোমর ব্যথা' : lang === 'mr' ? 'कंबरदुखी' : 'Back Pain', 
                          query: 'back pain' 
                        },
                        { 
                          label: lang === 'hi' ? 'डेंगू' : lang === 'gu' ? 'ડેન્ગ્યુ' : lang === 'pa' ? 'ਡੇਂਗੂ' : lang === 'ta' ? 'டெங்கு' : lang === 'te' ? 'డెంగ్యూ' : lang === 'bn' ? 'ডেঙ্গু' : lang === 'mr' ? 'डेंग्यू' : 'Dengue', 
                          query: 'dengue' 
                        },
                        { 
                          label: lang === 'hi' ? 'बुखार' : lang === 'gu' ? 'તાવ' : lang === 'pa' ? 'ਬੁਖਾਰ' : lang === 'ta' ? 'காய்ச்சல்' : lang === 'te' ? 'జ్వరం' : lang === 'bn' ? 'জ্বর' : lang === 'mr' ? 'ताप' : 'Fever', 
                          query: 'fever' 
                        },
                        { 
                          label: lang === 'hi' ? 'मधुमेह' : lang === 'gu' ? 'ડાયાબિટીસ' : lang === 'pa' ? 'ਸ਼ੂਗਰ' : lang === 'ta' ? 'நீரிழிவு' : lang === 'te' ? 'మధుమేహం' : lang === 'bn' ? 'ডায়াবেটিস' : lang === 'mr' ? 'मधुमेह' : 'Diabetes', 
                          query: 'diabetes' 
                        },
                        { 
                          label: lang === 'hi' ? 'उच्च रक्तचाप' : lang === 'gu' ? 'હાઈ બ્લડ પ્રેશર' : lang === 'pa' ? 'ਹਾਈ ਬੀਪੀ' : lang === 'ta' ? 'உயர் ரத்த அழுத்தம்' : lang === 'te' ? 'అధిక రక్తపోటు' : lang === 'bn' ? 'উচ্চ রক্তচাপ' : lang === 'mr' ? 'उच्च रक्तदाब' : 'High BP', 
                          query: 'high bp' 
                        },
                        { 
                          label: lang === 'hi' ? 'एसिडिटी' : lang === 'gu' ? 'એસિડિટી' : lang === 'pa' ? 'ਤੇਜ਼ਾਬ ਬਣਨਾ' : lang === 'ta' ? 'அமிலத்தன்மை' : lang === 'te' ? 'ఎసిడిటీ' : lang === 'bn' ? 'অম্বল' : lang === 'mr' ? 'पित्त' : 'Acidity', 
                          query: 'acidity' 
                        },
                        { 
                          label: lang === 'hi' ? 'खांसी व जुकाम' : lang === 'gu' ? 'ખાંસી અને શરદી' : lang === 'pa' ? 'ਖੰਘ ਤੇ ਜ਼ੁਕਾਮ' : lang === 'ta' ? 'இருமல் மற்றும் சளி' : lang === 'te' ? 'దగ్గు మరియు జలుబు' : lang === 'bn' ? 'কাশি ও সর্দি' : lang === 'mr' ? 'खोकला व सर्दी' : 'Cough & Cold', 
                          query: 'cough' 
                        },
                        { 
                          label: lang === 'hi' ? 'दमा' : lang === 'gu' ? 'દમ' : lang === 'pa' ? 'ਦਮਾ' : lang === 'ta' ? 'ஆஸ்துமா' : lang === 'te' ? 'ఉబ్బసం' : lang === 'bn' ? 'হাঁপানি' : lang === 'mr' ? 'दमा' : 'Asthma', 
                          query: 'asthma' 
                        },
                        { 
                          label: lang === 'hi' ? 'पथरी' : lang === 'gu' ? 'પથરી' : lang === 'pa' ? 'ਪੱਥਰੀ' : lang === 'ta' ? 'சிறுநீரகக் கல்' : lang === 'te' ? 'మూత్రపిండాల్లో రాళ్ళు' : lang === 'bn' ? 'কিডনির পাথর' : lang === 'mr' ? 'खडा' : 'Kidney Stone', 
                          query: 'kidney stone' 
                        },
                        { 
                          label: lang === 'hi' ? 'सिरदर्द' : lang === 'gu' ? 'માથાનો દુખાવો' : lang === 'pa' ? 'ਸਿਰਦਰਦ' : lang === 'ta' ? 'தலைவலி' : lang === 'te' ? 'తలనొప్పి' : lang === 'bn' ? 'মাথাব্যথা' : lang === 'mr' ? 'डोकेदुखी' : 'Headache', 
                          query: 'headache' 
                        },
                        { 
                          label: lang === 'hi' ? 'दस्त' : lang === 'gu' ? 'ઝાડા' : lang === 'pa' ? 'ਦਸਤ' : lang === 'ta' ? 'வயிற்றுப்போக்கு' : lang === 'te' ? 'విరేచనాలు' : lang === 'bn' ? 'ডায়রিয়া' : lang === 'mr' ? 'जुलाब' : 'Diarrhea', 
                          query: 'diarrhea' 
                        },
                        { 
                          label: lang === 'hi' ? 'पेशाब में जलन' : lang === 'gu' ? 'પેશાબમાં બળતરા' : lang === 'pa' ? 'ਪਿਸ਼ਾਬ ਦੀ ਜਲਣ' : lang === 'ta' ? 'சிறுநீர் எரிச்சல்' : lang === 'te' ? 'మూత్రంలో మంట' : lang === 'bn' ? 'প্রস্রাবে জ্বালাপোড়া' : lang === 'mr' ? 'लघवीची जळजळ' : 'UTI Burning', 
                          query: 'uti' 
                        }
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
