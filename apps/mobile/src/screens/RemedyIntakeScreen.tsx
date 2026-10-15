import React, { useState } from 'react';
import { ChevronDown, Edit3, Sparkles } from 'lucide-react';
import { AudioWaveform } from '../components/AudioWaveform.tsx';
import { BOTANICAL_DATABASE } from '../services/botanicalDatabase.ts';

interface RemedyIntakeScreenProps {
  onNext: (data: {
    language: string;
    audioBlob?: Blob;
    transcript?: string;
    remedyNameLocal: string;
    usedForCondition: string;
    preparedBy: string;
    placeRegion: string;
  }) => void;
  initialData?: {
    language?: string;
    remedyNameLocal?: string;
    usedForCondition?: string;
    preparedBy?: string;
    placeRegion?: string;
    transcript?: string;
  };
}

export const RemedyIntakeScreen: React.FC<RemedyIntakeScreenProps> = ({
  onNext,
  initialData,
}) => {
  const [language, setLanguage] = useState(initialData?.language || 'Gujarati');
  const [showTypeInstead, setShowTypeInstead] = useState(false);
  const [typedNotes, setTypedNotes] = useState(initialData?.transcript || '');
  
  const [remedyNameLocal, setRemedyNameLocal] = useState(initialData?.remedyNameLocal || '');
  const [usedForCondition, setUsedForCondition] = useState(initialData?.usedForCondition || '');
  const [preparedBy, setPreparedBy] = useState(initialData?.preparedBy || '');
  const [placeRegion, setPlaceRegion] = useState(initialData?.placeRegion || '');

  const [audioBlob, setAudioBlob] = useState<Blob | undefined>(undefined);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [capturedTranscript, setCapturedTranscript] = useState<string>(initialData?.transcript || '');

  // Extract botanical entities and clinical condition dynamically from spoken or typed text
  const parseEntities = (text: string) => {
    if (!text || !text.trim()) return;
    const lower = text.toLowerCase();

    // 1. Search full 50+ botanical database
    let detectedName = '';
    for (const plant of BOTANICAL_DATABASE) {
      if (lower.includes(plant.scientificName.toLowerCase())) {
        detectedName = `${plant.scientificName} (${plant.commonName.split('/')[0].trim()})`;
        break;
      }
      for (const alias of plant.vernacularAliases) {
        if (lower.includes(alias.toLowerCase())) {
          detectedName = `${alias} (${plant.scientificName})`;
          break;
        }
      }
      if (detectedName) break;
    }

    if (detectedName) {
      setRemedyNameLocal(detectedName);
    }

    // 2. Used For / Clinical Condition
    let detectedCondition = '';
    if (/સાંધા|દુખાવો|જોડો|जोड़ों|दर्द|सांधे|सूज|மூட்டு|வலி|కీళ్ల|నొప్పులు|ಕೀಲು|ನೋವು|സന്ധി|വേദന|বাতের|ব্যথা|ਜੋੜਾਂ|ਦਰਦ|joint|pain|arthritis|swelling|सूजन|સોજો|ગોઠણ/i.test(text)) {
      detectedCondition = 'Joint Pain & Swelling (સાંધાનો દુખાવો)';
    } else if (/ખાંસી|શરદી|ઉધરસ|કફ|खांसी|खाँसी|जुकाम|सर्दी|खोकला|சளி|இருமல்|దగ్గు|జలుబు|ಕೆಮ್ಮು|ನೆಗಡಿ|ചുമ|തണുപ്പ്|কাশি|সর্দি|ਖੰਘ|ਜ਼ੁਕਾਮ|cough|cold|bronchitis|દમ|અસ્થમા/i.test(text)) {
      detectedCondition = 'Respiratory Cough & Cold (શરદી-ઉધરસ)';
    } else if (/તાવ|તાવનો|મુદતીયો|बुखार|ताप|காய்ச்சல்|జ్వరం|ಜ್ವರ|പനി|জ্বর|ਬੁਖ਼ਾਰ|fever|pyrexia/i.test(text)) {
      detectedCondition = 'Acute Fever (તાવ / बुखार)';
    } else if (/ડાયાબિટીસ|ડાયાબિટિસ|સુગર|શુગર|मधुमेह|शुगर|साखर|நீரிழிவு|சர்க்கரை|మధుమేహం|ಸಕ್ಕರೆ|പ്രമേഹം|ডায়াবেটিস|ਸ਼ੂਗਰ|diabetes|glycemia|sugar/i.test(text)) {
      detectedCondition = 'Diabetes Mellitus Support (મધુપ્રમેહ / ડાયાબિટીસ)';
    } else if (/બ્લડ પ્રેશર|પ્રેશર|બીપી|રક્તચાપ|రక్తపోటు|இரத்த அழுத்தம்|hypertension|blood pressure|bp/i.test(text)) {
      detectedCondition = 'Hypertension / High BP (હાઈ બ્લડ પ્રેશર)';
    } else if (/પાચન|પેટ|પાચન|ગેસ|એસિડિટી|અપચો|पाचन|पेट|गैस|अपचन|செரிமானம்|జీర్ణక్రియ|ಜೀರ್ಣಕ್ರಿಯೆ|হজম|digestion|stomach|acidity|gas|dyspepsia/i.test(text)) {
      detectedCondition = 'Digestive Distress & Acidity (પાચન સમસ્યા / એસિડિટી)';
    } else if (/ચામડી|ત્વચા|ખંજવાળ|ફોડલી|ગુમડાં|त्वचा|खुजली|खाज|தோல்|துர்நாற்றம்|చర్మ|ತುರಿಕೆ|ചർമ്മം|চর্মরোগ|ਚਮੜੀ|skin|rash|eczema/i.test(text)) {
      detectedCondition = 'Dermatological Irritation (ત્વચા રોગ / ખંજવાળ)';
    } else if (/પથરી|કિડની|પેશાબ|मूत्र|மூத்திரக்காய்|stone|calculi|dysuria/i.test(text)) {
      detectedCondition = 'Renal Stones & Dysuria (પથરી / મૂત્ર સમસ્યા)';
    } else if (/ઊંઘ|અનિદ્રા|ટેન્શન|ચિંતા|अनिद्रा|तनाव|झोप|தூக்கமின்மை|மன அழுத்தம்|నిద్రలేమి|ನಿದ್ರಾಹೀನತೆ|ഉറക്കമില്ലായ്മ|ঘুম|অনিদ্রা|ਨੀਂਦ|insomnia|stress|anxiety|sleeplessness/i.test(text)) {
      detectedCondition = 'Anxiety & Sleep Support (અનિદ્રા / માનસિક તાણ)';
    }

    if (detectedCondition) {
      setUsedForCondition(detectedCondition);
    }

    // Default regional field worker credentials
    if (!preparedBy) setPreparedBy('Pooja Patel (ASHA Worker)');
    if (!placeRegion) setPlaceRegion('Anand, Gujarat');
  };

  const applyPreset = (presetText: string) => {
    setCapturedTranscript(presetText);
    setTypedNotes(presetText);
    setShowTypeInstead(true);
    parseEntities(presetText);
  };

  const handleRecordingComplete = async (blob: Blob, liveTranscript?: string) => {
    setAudioBlob(blob);
    setIsProcessingAudio(true);

    const spokenText = liveTranscript || '';
    if (spokenText) {
      setCapturedTranscript(spokenText);
      setTypedNotes(spokenText);
      setShowTypeInstead(true);
      parseEntities(spokenText);
    }

    try {
      const formData = new FormData();
      formData.append('audio', blob, 'field_recording.webm');
      formData.append('language', language === 'Gujarati' ? 'gu' : (language === 'Hindi' ? 'hi' : 'en'));
      if (spokenText) {
        formData.append('transcript', spokenText);
      }

      const res = await fetch('/api/remedies/voice', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.transcript && !spokenText) {
          setCapturedTranscript(data.transcript);
          setTypedNotes(data.transcript);
          parseEntities(data.transcript);
        }
      }
    } catch (err) {
      console.warn('[Intake] Voice API note:', err);
    } finally {
      setIsProcessingAudio(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      language,
      audioBlob,
      transcript: typedNotes || capturedTranscript,
      remedyNameLocal: remedyNameLocal.trim() || 'Haldi (હળદર / Turmeric)',
      usedForCondition: usedForCondition.trim() || 'Joint Pain & Swelling (સાંધાનો દુખાવો)',
      preparedBy: preparedBy.trim() || 'ASHA Field Worker',
      placeRegion: placeRegion.trim() || 'Anand, Gujarat',
    });
  };

  return (
    <div className="space-y-4">
      {/* Title & Subtitle */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">Record Local Remedy</h1>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
          Speak naturally in your language. Voice is recognized in real time.
        </p>
      </div>

      {/* Language Selector Dropdown */}
      {/* Language Selector Dropdown (Pan-Indic Multilingual) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="form-label text-xs mb-0">Voice & Regional Language</label>
          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            AI4Bharat IndicWhisper ASR
          </span>
        </div>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-input appearance-none pr-9 text-sm font-medium bg-white cursor-pointer"
          >
            <option value="Hindi">Hindi (हिन्दी)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            <option value="Malayalam">Malayalam (മലയാളം)</option>
            <option value="Bengali">Bengali (বাংলা)</option>
            <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
            <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
            <option value="Sanskrit">Sanskrit (संस्कृतम्)</option>
            <option value="English">Indian English</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Quick Voice Demo Presets */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          Test Remedy Voice Presets (Tap to test ASR & Safety Graph)
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (language === 'Hindi') {
                applyPreset('हम अनिद्रा और अत्यधिक मानसिक चिंता के लिए अश्वगंधा चूर्ण का उपयोग करते हैं। एक चम्मच जड़ का चूर्ण गर्म गाय के दूध के साथ रात को सोने से पहले सात दिनों तक दिया जाता है।');
              } else if (language === 'Gujarati') {
                applyPreset('અમે ઊંઘ ન આવવાની સમસ્યા અને માનસિક ચિંતા માટે અશ્વગંધા મૂળનું ચૂર્ણ વાપરીએ છીએ. એક ચમચી ચૂર્ણ રાત્રે ગરમ દૂધ સાથે સાત દિવસ આપીએ છીએ.');
              } else if (language === 'Marathi') {
                applyPreset('आम्ही निद्रानाश आणि मानसिक तणावासाठी अश्वगंधा चूर्ण वापरतो. एक चमचा मुळांची पूड रात्री झोपताना कोमट दुधासोबत सात दिवस देतो.');
              } else if (language === 'Tamil') {
                applyPreset('நாங்கள் தூக்கமின்மை மற்றும் மன அழுத்தத்திற்கு அஸ்வகந்தா வேர் தூளை பயன்படுத்துகிறோம். இரவு படுக்கும் முன் வெதுவெதுப்பான பாலில் ஒரு தேக்கரண்டி கொடுக்கிறோம்.');
              } else if (language === 'Bengali') {
                applyPreset('আমরা অনিদ্রা ও অতিরিক্ত মানসিক উদ্বেগের জন্য অশ্বগন্ধা চূর্ণ ব্যবহার করি। এক চামচ মূলের গুঁড়ো রাতে শোয়ার আগে গরম দুধের সাথে সাত দিন খেতে দিই।');
              } else {
                applyPreset('We use Ashwagandha root churna for severe chronic insomnia and anxiety. One teaspoon root powder taken with warm cow milk at bedtime for 7 days.');
              }
            }}
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 transition-colors flex items-center gap-1"
          >
            <span>🌾</span> Ashwagandha (Insomnia / Stress)
          </button>
          <button
            type="button"
            onClick={() => {
              if (language === 'Hindi') {
                applyPreset('पुराने बुखार और शुगर नियंत्रण के लिए हम गिलोय का काढ़ा बनाते हैं। गिलोय के तने को पानी में उबालकर आधा कर लेते हैं। दो चम्मच काढ़ा सुबह खाली पेट दस दिनों तक दिया जाता है।');
              } else if (language === 'Gujarati') {
                applyPreset('જુના તાવ અને ડાયાબિટીસ માટે અમે ગળોની વેલનો દેશી ઉકાળો બનાવીએ છીએ. સવારે ભૂખ્યા પેટે બે ચમચી ઉકાળો દર્દીને દસ દિવસ આપીએ છીએ.');
              } else if (language === 'Marathi') {
                applyPreset('वारंवार येणारा ताप आणि मधुमेहासाठी आम्ही गुळवेल काढा वापरतो. गुळवेलीचे खोड उकळून सकाळी उपाशीपोटी दोन चमचे दहा दिवस देतो.');
              } else if (language === 'Tamil') {
                applyPreset('நாள்பட்ட காய்ச்சல் மற்றும் சர்க்கரை நோய்க்கு நாங்கள் சீந்தில் கொடி கஷாயம் பயன்படுத்துகிறோம். காலை வெறும் வயிற்றில் இரண்டு கரண்டி கொடுக்கிறோம்.');
              } else {
                applyPreset('For chronic fever and blood sugar management, we prepare Giloy stem decoction. Two tablespoons taken orally on an empty stomach for 10 days.');
              }
            }}
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1"
          >
            <span>🌿</span> Giloy Kwath (Fever & Diabetes)
          </button>
          <button
            type="button"
            onClick={() => {
              if (language === 'Gujarati') {
                applyPreset('અમે સાંધાના દુખાવા માટે હળદરની ગાંઠ વાપરીએ છીએ. એક ચમચી હળદરનું ચૂર્ણ ગરમ દૂધમાં ઉકાળીને દર્દીને દિવસમાં બે વાર, સવારે અને સાંજે, સાત દિવસ આપીએ છીએ.');
              } else if (language === 'Hindi') {
                applyPreset('हम जोड़ों के दर्द के लिए हल्दी की गांठ का उपयोग करते हैं। एक चम्मच हल्दी का चूर्ण गर्म दूध में उबालकर मरीज को दिन में दो बार, सुबह और शाम, सात दिनों तक दिया जाता है।');
              } else if (language === 'Marathi') {
                applyPreset('आम्ही सांधेदुखी आणि सूज कमी करण्यासाठी हळद वापरतो. एक चमचा हळदीची पूड गरम दुधात उकळून दिवसातून दोन वेळा सात दिवस देतो.');
              } else if (language === 'Tamil') {
                applyPreset('நாங்கள் மூட்டு வலி மற்றும் வீக்கத்திற்கு மஞ்சள் கிழங்கு பயன்படுத்துகிறோம். ஒரு தேக்கரண்டி மஞ்சள் தூளை வெதுவெதுப்பான பாலில் கலந்து காலை மாலை இருவேளை கொடுக்கிறோம்.');
              } else {
                applyPreset('We use Haldi rhizome root for severe joint pain and swelling. One teaspoon turmeric powder boiled in warm milk, taken orally twice daily for 7 days.');
              }
            }}
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1"
          >
            <span>🟡</span> Haldi + Milk (Joint Pain)
          </button>
          <button
            type="button"
            onClick={() => {
              if (language === 'Gujarati') {
                applyPreset('ગંભીર શરદી અને ખાંસી માટે અમે તુલસીના પાંદડા અને આદુનો રસ વાપરીએ છીએ. પાણીમાં ઉકાળીને દેશી ઉકાળો બનાવીએ છીએ. બે ચમચી ઉકાળો દિવસમાં બે વાર, પાંચ દિવસ આપીએ છીએ.');
              } else if (language === 'Hindi') {
                applyPreset('खांसी और जुकाम के लिए हम तुलसी के पत्ते और अदरक का रस इस्तेमाल करते हैं। पानी में उबालकर काढ़ा तैयार करते हैं। दो चम्मच काढ़ा दिन में दो बार पांच दिनों तक देते हैं।');
              } else {
                applyPreset('For severe cough and cold, we use Tulsi leaves and ginger decoction. Two teaspoons orally twice daily for 5 days.');
              }
            }}
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors flex items-center gap-1"
          >
            <span>🍃</span> Tulsi (Cough & Cold)
          </button>
        </div>
      </div>

      {/* Audio Waveform & Big Circular Record Button */}
      <div className="surface-card bg-white py-3 shadow-sm">
        <AudioWaveform
          onRecordingComplete={handleRecordingComplete}
          language={language}
          isProcessing={isProcessingAudio}
        />

        {/* Live Extraction Confirmation Badge */}
        {(remedyNameLocal || usedForCondition) && (
          <div className="mx-2 mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
            <div className="flex items-center gap-1 font-bold text-[11px] text-emerald-800 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Voice Entities Detected:</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {remedyNameLocal && (
                <span><strong>Plant:</strong> {remedyNameLocal}</span>
              )}
              {usedForCondition && (
                <span><strong>Condition:</strong> {usedForCondition}</span>
              )}
            </div>
          </div>
        )}

        {/* OR Separator */}
        <div className="flex items-center my-3">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-[11px] font-semibold text-gray-400">OR</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Type / Edit Notes Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowTypeInstead(!showTypeInstead)}
            className="btn-outline w-full text-xs py-2 rounded-xl flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{showTypeInstead ? 'Hide Spoken Text' : 'Type or Review Spoken Text'}</span>
          </button>
        </div>

        {showTypeInstead && (
          <div className="mt-3 animate-fadeIn">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-gray-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Spoken / Typed Transcript
              </span>
              <span className="text-[10px] text-gray-400">Editable</span>
            </div>
            <textarea
              value={typedNotes}
              onChange={(e) => {
                setTypedNotes(e.target.value);
                parseEntities(e.target.value);
              }}
              placeholder="Describe the traditional remedy, preparation, and condition..."
              className="form-input text-xs h-24 resize-none leading-relaxed"
            />
          </div>
        )}
      </div>

      {/* Basic Details Form Grid */}
      <div className="surface-card space-y-3 shadow-sm">
        <h2 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
          Basic Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="form-label text-[11.5px]">Remedy Name (Local)</label>
            <input
              type="text"
              value={remedyNameLocal}
              onChange={(e) => setRemedyNameLocal(e.target.value)}
              placeholder="e.g. Tulsi, Neem, Giloy, Haldi"
              className="form-input text-xs"
            />
          </div>

          <div>
            <label className="form-label text-[11.5px]">Used For (Condition)</label>
            <input
              type="text"
              value={usedForCondition}
              onChange={(e) => setUsedForCondition(e.target.value)}
              placeholder="e.g. Cough, Joint pain, Fever"
              className="form-input text-xs"
            />
          </div>

          <div>
            <label className="form-label text-[11.5px]">Prepared By</label>
            <input
              type="text"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              placeholder="e.g. Local Healer, ASHA Worker"
              className="form-input text-xs"
            />
          </div>

          <div>
            <label className="form-label text-[11.5px]">Place / Region</label>
            <input
              type="text"
              value={placeRegion}
              onChange={(e) => setPlaceRegion(e.target.value)}
              placeholder="e.g. Anand, Gujarat"
              className="form-input text-xs"
            />
          </div>
        </div>
      </div>

      {/* Bottom Action: Next */}
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={handleFormSubmit}
          className="btn-primary px-8 text-sm py-2.5 rounded-xl shadow-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};
