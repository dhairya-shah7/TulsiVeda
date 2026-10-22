import React, { useEffect } from 'react';
import { 
  AlertOctagon, 
  PhoneCall, 
  X, 
  ShieldAlert, 
  Ban, 
  CheckCircle2, 
  Flame,
  Volume2
} from 'lucide-react';
import { EmergencyCase } from '../services/emergencyTriageService';
import { VoiceEngineService } from '../services/voiceEngineService';
import { useCurrentLanguage } from '../services/localizationService';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  emergencyCase?: EmergencyCase | null;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  emergencyCase
}) => {
  const currentLang = useCurrentLanguage();

  if (!isOpen) return null;

  const data = emergencyCase || {
    id: 'GENERIC_EMERG',
    category: 'CARDIAC',
    title: {
      en: '🚨 Medical Emergency - Immediate Hospital Care Required',
      hi: '🚨 चिकित्सकीय आपातकाल - तुरंत अस्पताल ले जाएं',
      gu: '🚨 તબીબી આપાતકાલ - તાત્કાલિક હોસ્પિટલ પહોંચો',
      pa: '🚨 ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ - ਤੁਰੰਤ ਹਸਪਤਾਲ ਜਾਓ',
      mr: '🚨 वैद्यकीय आणीबाणी - त्वरित रुग्णालयात जा',
      ta: '🚨 மருத்துவ அவசரநிலை - உடனடியாக மருத்துவமனைக்கு செல்லவும்',
      te: '🚨 వైద్య అత్యవసర పరిస్థితి - వెంటనే ఆసుపత్రికి వెళ్లండి',
      kn: '🚨 ವೈದ್ಯಕೀಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿ - ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ',
      ml: '🚨 അടിയന്തര ചികിത്സ ആവശ്യമാണ്',
      bn: '🚨 জরুরি চিকিৎসা প্রয়োজন',
      or: '🚨 ଜରୁରୀକାଳୀନ ଡାକ୍ତରୀ ଚିକିତ୍ସା ଆବଶ୍ୟକ',
      as: '🚨 জৰুৰীকালীন চিকিৎসাৰ প্ৰয়োজন',
    },
    severity: 'CRITICAL_IMMEDIATE',
    dangerSigns: {
      en: ['Loss of consciousness', 'Difficulty breathing or gasping', 'Severe acute pain'],
      hi: ['होश खो बैठना या बेहोशी', 'सांस लेने में भारी कठिनाई', 'असहनीय तीव्र दर्द'],
      gu: ['બેભાન થવું', 'શ્વાસ લેવામાં તકલીફ', 'અસહ્ય દુખાવો'],
      pa: ['ਬੇਹੋਸ਼ੀ', 'ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ', 'ਅਸਹਿਣਸ਼ੀਲ ਦਰਦ'],
      mr: ['बेशुद्ध पडणे', 'श्वास घेण्यास त्रास', 'असह्य वेदना'],
      ta: ['மயக்கம்', 'மூச்சுத்திணறல்', 'கடுமையான வலி'],
      te: ['స్పృహ కోల్పోవడం', 'శ్వాస తీసుకోవడంలో ఇబ్బంది', 'తీవ్రమైన నొప్పి'],
      kn: ['ಪ್ರಜ್ಞೆ ತಪ್ಪುವುದು', 'ಉಸಿರಾಟದ ತೊಂದರೆ', 'ತೀವ್ರ ನೋವು'],
      ml: ['അബോധാവസ്ഥ', 'ശ്വാസമെടുക്കാൻ ബുദ്ധിമുട്ട്', 'കഠിനമായ വേദന'],
      bn: ['অজ্ঞান হওয়া', 'শ্বাসকষ্ট', 'তীব্র ব্যথা'],
      or: ['ଅଚେତ ହେବା', 'ଶ୍ୱାସକ୍ରିୟାରେ କଷ୍ଟ', 'ତୀବ୍ର ଯନ୍ତ୍ରଣା'],
      as: ['অচেতন হোৱা', 'উশাহ লোৱাত কষ্ট', 'তীব্র বিষ'],
    },
    prohibitedActions: {
      en: [
        'DO NOT give any herbal medicines or oral fluids',
        'DO NOT allow patient to walk or strain',
      ],
      hi: [
        'रोगी को कोई भी घरेलू काढ़ा या तरल पदार्थ न दें',
        'रोगी को पैदल न चलने दें',
      ],
      gu: [
        'દર્દીને કોઈ દેશી દવા કે પ્રવાહી ન આપો',
        'દર્દીને ચાલવા ન દો',
      ],
      pa: [
        'ਕੋਈ ਦੇਸੀ ਦਵਾਈ ਜਾਂ ਪਾਣੀ ਨਾ ਦਿਓ',
        'ਮਰੀਜ਼ ਨੂੰ ਤੁਰਨ ਨਾ ਦਿਓ',
      ],
      mr: ['कोणतेही औषध किंवा पाणी देऊ नका', 'रुग्णाला चालू देऊ नका'],
      ta: ['மருந்தோ அல்லது திரவமோ கொடுக்க வேண்டாம்', 'நடக்க விடாதீர்கள்'],
      te: ['ఎలాంటి మందులు లేదా పానీయాలు ఇవ్వవద్దు', 'నడవనివ్వవద్దు'],
      kn: ['ಯಾವುದೇ ಔಷಧ ಅಥವಾ ದ್ರವ ನೀಡಬೇಡಿ', 'ನಡೆಯಲು ಬಿಡಬೇಡಿ'],
      ml: ['മരുന്നോ വെള്ളമോ നൽകരുത്', 'നടത്തരുത്'],
      bn: ['কোনো ওষুধ বা জল দেবেন না', 'হাঁটতে দেবেন না'],
      or: ['କୌଣସି ଔଷଧ ବା ପାଣି ଦିଅନ୍ତୁ ନାହିଁ', 'ଚାଲିବାକୁ ଦିଅନ୍ତୁ ନାହିଁ'],
      as: ['কোনো ঔষধ বা পানী নিদিব', 'খোজ কাঢ়িব নিদিব'],
    },
    firstAidSteps: {
      en: [
        '1. Immediately dial 108 for Emergency Ambulance',
        '2. Keep patient calm and loosen clothing',
        '3. Monitor breathing and pulse until ambulance arrives',
      ],
      hi: [
        '1. तुरंत 108 पर एम्बुलेंस के लिए कॉल करें',
        '2. मरीज को शांत रखें और कपड़े ढीले करें',
        '3. एम्बुलेंस आने तक सांस और नाड़ी की जांच करते रहें',
      ],
      gu: [
        '1. તાત્કાલિક 108 પર એમ્બ્યુલન્સ બોલાવો',
        '2. દર્દીને શાંત રાખો અને કપડાં ઢીલા કરો',
        '3. એમ્બ્યુલન્સ આવે ત્યાં સુધી શ્વાસ પર નજર રાખો',
      ],
      pa: [
        '1. ਤੁਰੰਤ 108 ਐਂਬੂਲੈਂਸ ਕਾਲ ਕਰੋ',
        '2. ਮਰੀਜ਼ ਨੂੰ ਸ਼ਾਂਤ ਰੱਖੋ ਅਤੇ ਕੱਪੜੇ ਢਿੱਲੇ ਕਰੋ',
        '3. ਸਾਹ ਦੀ ਨਿਗਰਾਨੀ ਰੱਖੋ',
      ],
      mr: ['1. लगेच १०८ वर रुग्णवाहिका बोलवा', '2. रुग्णाला शांत ठेवा', '3. श्वास तपासा'],
      ta: ['1. உடனே 108 ஆம்புலன்ஸை அழைக்கவும்', '2. அமைதியாக வைக்கவும்', '3. சுவாசம் கண்காணிக்கவும்'],
      te: ['1. వెంటనే 108 అంబులెన్స్‌కు కాల్ చేయండి', '2. ప్రశాంతంగా ఉంచండి', '3. శ్వాసను గమనించండి'],
      kn: ['1. ತಕ್ಷಣ 108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ', '2. ಶಾಂತವಾಗಿರಿಸಿ', '3. ಉಸಿರಾಟ ಗಮನಿಸಿ'],
      ml: ['1. ഉടൻ 108 ആംബുലൻസ് വിളിക്കുക', '2. ശാന്തമായി കിടത്തുക', '3. ശ്വാസമെടുപ്പ് നിരീക്ഷിക്കുക'],
      bn: ['1. অবিলম্বে ১০৮ এ কল করুন', '2. রোগীকে শান্ত রাখুন', '3. শ্বাস পর্যবেক্ষণ করুন'],
      or: ['1. ତୁରନ୍ତ ୧୦୮ କଲ କରନ୍ତୁ', '2. ଶାନ୍ତ ରଖନ୍ତୁ', '3. ଶ୍ୱାସକ୍ରିୟା ଦେଖନ୍ତୁ'],
      as: ['1. লগে লগে ১০৮ ত কল কৰক', '2. শান্তভাৱে ৰাখক', '3. উশাহ নিৰীক্ষণ কৰক'],
    },
    primaryEmergencyNumber: '108',
    secondaryEmergencyNumber: '112',
    poisonHelpline: '1800-116-117',
    voiceAlertText: {
      en: 'Medical Emergency. Do not administer any home remedy. Calling 108 ambulance now.',
      hi: 'चिकित्सकीय आपातकाल! कोई घरेलू नुस्खा न दें। तुरंत 108 एम्बुलेंस बुलाएं।',
      gu: 'તબીબી આપાતકાલ! કોઈ દેશી નુસખો ન આપો. તરત જ 108 એમ્બ્યુલન્સ બોલાવો.',
      pa: 'ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ! ਕੋਈ ਘਰੇਲੂ ਦਵਾਈ ਨਾ ਦਿਓ। ਤੁਰੰਤ 108 ਕਾਲ ਕਰੋ।',
      mr: 'वैद्यकीय आणीबाणी! कोणताही उपाय करू नका. १०८ वर त्वरित संपर्क करा.',
      ta: 'மருத்துவ அவசரநிலை! கஷாயம் கொடுக்க வேண்டாம். உடனே 108 அழைக்கவும்.',
      te: 'వైద్య అత్యవసర పరిస్థితి! ఎలాంటి మందులు ఇవ్వవద్దు. వెంటనే 108 కి కాల్ చేయండి.',
      kn: 'ವೈದ್ಯಕೀಯ ತುರ್ತುಸ್ಥಿತಿ! ಯಾವುದೇ ಉಪಶಮನ ನೀಡಬೇಡಿ. ತಕ್ಷಣ 108 ಕರೆ ಮಾಡಿ.',
      ml: 'അടിയന്തരാവസ്ഥ! വീട്ടുവൈദ്യം നൽകരുത്. ഉടൻ 108 വിളിക്കുക.',
      bn: 'জরুরি অবস্থা! কোনো ঘরোয়া দাওয়াই দেবেন না। অবিলম্বে ১০৮ ডাকুন।',
      or: 'ଜରୁରୀ ସ୍ଥିତି! କୌଣସି ଘରୋଇ ଉପଚାର ଦିଅନ୍ତୁ ନାହିଁ। ତୁରନ୍ତ ୧୦୮ ଡାକନ୍ତୁ।',
      as: 'জৰুৰী স্থিতি! কোনো ঘৰুৱা চিকিৎসা নকৰিব। লগে লগে ১০৮ মাতক।',
    },
  };

  const getLocalized = (obj: Record<string, any>, fallback: any) => {
    return obj[currentLang] || obj['hi'] || obj['en'] || fallback;
  };

  const titleText = getLocalized(data.title, 'Emergency');
  const dangerSigns = getLocalized(data.dangerSigns, []);
  const prohibited = getLocalized(data.prohibitedActions, []);
  const firstAid = getLocalized(data.firstAidSteps, []);
  const voiceText = getLocalized(data.voiceAlertText, '');

  const triggerCall = (phoneNum: string) => {
    window.location.href = `tel:${phoneNum}`;
  };

  const speakAlert = () => {
    if (voiceText) {
      VoiceEngineService.speakInLanguage(voiceText, currentLang as any);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-4 border-red-500 animate-scale-up flex flex-col max-h-[92vh]">
        
        {/* Pulsing Red Emergency Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 relative flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center animate-bounce">
              <AlertOctagon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-red-200 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-yellow-300 rounded-full animate-ping" />
                {currentLang === 'hi' ? 'आपातकालीन रेड-फ्लैग' : currentLang === 'gu' ? 'કટોકટી ચેતવણી' : currentLang === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਰੈੱਡ-ਫਲੈਗ' : 'Emergency Red-Flag'}
              </div>
              <h2 className="text-lg font-black leading-tight text-white mt-0.5">
                {titleText}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800">
          
          {/* BIG CALL 108 AMBULANCE BUTTON */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => triggerCall(data.primaryEmergencyNumber)}
              className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 text-white py-4 px-4 rounded-2xl font-black text-base shadow-lg shadow-red-500/30 flex items-center justify-center gap-2.5 border border-red-400 animate-pulse transition-all"
            >
              <PhoneCall className="w-6 h-6 animate-pulse" />
              <span>
                {currentLang === 'hi' ? 'तुरंत 108 एम्बुलेंस बुलाएं' : currentLang === 'gu' ? 'તરત જ 108 એમ્બ્યુલન્સ બોલાવો' : currentLang === 'pa' ? 'ਤੁਰੰਤ 108 ਐਂਬੂਲੈਂਸ ਕਾਲ ਕਰੋ' : 'CALL 108 AMBULANCE'}
              </span>
            </button>

            <button
              onClick={() => triggerCall(data.secondaryEmergencyNumber)}
              className="bg-slate-900 hover:bg-black active:scale-95 text-white py-4 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>
                {currentLang === 'hi' ? '112 पुलिस/सुरक्षा' : currentLang === 'gu' ? '112 આપાતકાલ' : '112 All-Emergency'}
              </span>
            </button>
          </div>

          {/* Poison Helpline if Poisoning/Snakebite */}
          {data.category === 'POISONING' && (
            <button
              onClick={() => triggerCall(data.poisonHelpline)}
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>
                {currentLang === 'hi' ? 'एम्स राष्ट्रीय विष सूचना केंद्र: 1800-116-117' : currentLang === 'gu' ? 'એઈમ્સ પોઈઝન હેલ્પલાઈન: 1800-116-117' : 'AIIMS Poison Helpline: 1800-116-117'}
              </span>
            </button>
          )}

          {/* CRITICAL PROHIBITED ACTIONS (DO NOT TAKE HERBS) */}
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-red-800 font-black text-sm mb-2">
              <Ban className="w-5 h-5 text-red-600" />
              <span>
                {currentLang === 'hi' ? 'सख्त मनाही (कदापि न करें):' : currentLang === 'gu' ? 'સખત મનાઈ (ક્યારેય ન કરવું):' : currentLang === 'pa' ? 'ਸਖਤ ਮਨਾਹੀ (ਬਿਲਕੁਲ ਨਾ ਕਰੋ):' : 'STRICTLY PROHIBITED (DO NOT DO):'}
              </span>
            </div>
            <ul className="space-y-1.5 text-xs font-bold text-red-900">
              {prohibited.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-600 font-extrabold">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FIRST AID STABILIZATION STEPS */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>
                  {currentLang === 'hi' ? 'प्राथमिक जीवन रक्षक उपचार (First Aid):' : currentLang === 'gu' ? 'પ્રાથમિક સારવાર (First Aid):' : currentLang === 'pa' ? 'ਮੁੱਢਲੀ ਸਹਾਇਤਾ (First Aid):' : 'Immediate First Aid Steps:'}
                </span>
              </div>
              <button 
                onClick={speakAlert}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-200/70 hover:bg-emerald-200 px-2 py-1 rounded-lg"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{currentLang === 'hi' ? 'सुनें' : currentLang === 'gu' ? 'સાંભળો' : 'Listen'}</span>
              </button>
            </div>
            <ul className="space-y-2 text-xs font-semibold text-emerald-950">
              {firstAid.map((step: string, idx: number) => (
                <li key={idx} className="leading-relaxed bg-white/70 p-2 rounded-xl border border-emerald-100">
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* DANGER WARNINGS */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700">
            <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>
                {currentLang === 'hi' ? 'खतरे के मुख्य संकेत:' : currentLang === 'gu' ? 'જોખમના મુખ્ય સંકેતો:' : 'Key Danger Indicators:'}
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              {dangerSigns.map((sign: string, idx: number) => (
                <li key={idx}>{sign}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500">
            {currentLang === 'hi' ? 'राष्ट्रीय स्वास्थ्य मिशन (NHM) प्रोटोकॉल' : 'NHM Emergency Protocol'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 active:scale-95 rounded-xl font-bold text-xs text-slate-700 transition-colors"
          >
            {currentLang === 'hi' ? 'बंद करें' : currentLang === 'gu' ? 'બંધ કરો' : 'Dismiss'}
          </button>
        </div>

      </div>
    </div>
  );
};
