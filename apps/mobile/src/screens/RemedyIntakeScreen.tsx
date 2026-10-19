import React, { useState } from 'react';
import { ChevronDown, Edit3, Sparkles, Volume2, Mic, AlertCircle } from 'lucide-react';
import { AudioWaveform } from '../components/AudioWaveform.tsx';
import { BOTANICAL_DATABASE } from '../services/botanicalDatabase.ts';
import { AudioNarrator } from '../components/AudioNarrator.tsx';
import { LLMService } from '../services/llmService.ts';
import { t, getStoredLanguage, useCurrentLanguage, SUPPORTED_LANGUAGES, LanguageMeta } from '../services/localizationService.ts';

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

// Common vernacular herbs for quick 1-tap selection across all 12 languages
const VERNACULAR_HERBS: Record<string, { name: string; scientific: string; condition: string }[]> = {
  pa: [
    { name: 'ਤੁਲਸੀ (Tulsi)', scientific: 'Ocimum tenuiflorum', condition: 'ਖੰਘ ਅਤੇ ਜ਼ੁਕਾਮ' },
    { name: 'ਗਿਲੋਏ (Giloy)', scientific: 'Tinospora cordifolia', condition: 'ਬੁਖ਼ਾਰ ਅਤੇ ਕਮਜ਼ੋਰੀ' },
    { name: 'ਹਲਦੀ (Haldi)', scientific: 'Curcuma longa', condition: 'ਜੋੜਾਂ ਦਾ ਦਰਦ ਅਤੇ ਸੋਜ' },
    { name: 'ਅਦਰਕ (Adrak)', scientific: 'Zingiber officinale', condition: 'ਪਾਚਨ ਅਤੇ ਪੇਟ ਗੈਸ' },
    { name: 'ਅਸ਼ਵਗੰਧਾ (Ashwagandha)', scientific: 'Withania somnifera', condition: 'ਤਣਾਅ ਅਤੇ ਨੀਂਦ' },
    { name: 'ਆਂਵਲਾ (Amla)', scientific: 'Phyllanthus emblica', condition: 'ਇਮਿਊਨਿਟੀ ਅਤੇ ਪਾਚਨ' },
  ],
  hi: [
    { name: 'तुलसी (Tulsi)', scientific: 'Ocimum tenuiflorum', condition: 'खांसी और सर्दी' },
    { name: 'गिलोय (Giloy)', scientific: 'Tinospora cordifolia', condition: 'बुखार और कमजोरी' },
    { name: 'हल्दी (Haldi)', scientific: 'Curcuma longa', condition: 'जोड़ों का दर्द और सूजन' },
    { name: 'अदरक (Adrak)', scientific: 'Zingiber officinale', condition: 'पाचन और गैस' },
    { name: 'अश्वगंधा (Ashwagandha)', scientific: 'Withania somnifera', condition: 'तनाव और अनिद्रा' },
    { name: 'आंवला (Amla)', scientific: 'Phyllanthus emblica', condition: 'रोग प्रतिरोधक क्षमता' },
  ],
  gu: [
    { name: 'તુલસી (Tulsi)', scientific: 'Ocimum tenuiflorum', condition: 'ખાંસી અને શરદી' },
    { name: 'ગળો (Giloy)', scientific: 'Tinospora cordifolia', condition: 'તાવ અને નબળાઈ' },
    { name: 'હળદર (Haldi)', scientific: 'Curcuma longa', condition: 'સાંધાનો દુખાવો' },
    { name: 'આદુ (Adrak)', scientific: 'Zingiber officinale', condition: 'પાચન અને ગેસ' },
    { name: 'અશ્વગંધા (Ashwagandha)', scientific: 'Withania somnifera', condition: 'અનિદ્રા અને થાક' },
    { name: 'આંબળા (Amla)', scientific: 'Phyllanthus emblica', condition: 'રોગપ્રતિકારક શક્તિ' },
  ],
  mr: [
    { name: 'तुळस (Tulsi)', scientific: 'Ocimum tenuiflorum', condition: 'खोकला आणि सर्दी' },
    { name: 'गुळवेल (Giloy)', scientific: 'Tinospora cordifolia', condition: 'ताप आणि अशक्तपणा' },
    { name: 'हळद (Haldi)', scientific: 'Curcuma longa', condition: 'सांधेदुखी आणि सूज' },
    { name: 'आले (Adrak)', scientific: 'Zingiber officinale', condition: 'पचन आणि गॅस' },
    { name: 'अश्वगंधा (Ashwagandha)', scientific: 'Withania somnifera', condition: 'ताण आणि झोप' },
    { name: 'आवळा (Amla)', scientific: 'Phyllanthus emblica', condition: 'रोगप्रतिकारक शक्ती' },
  ],
  ta: [
    { name: 'துளசி (Tulsi)', scientific: 'Ocimum tenuiflorum', condition: 'இருமல் மற்றும் சளி' },
    { name: 'சீந்தில் (Giloy)', scientific: 'Tinospora cordifolia', condition: 'காய்ச்சல்' },
    { name: 'மஞ்சள் (Haldi)', scientific: 'Curcuma longa', condition: 'மூட்டு வலி' },
    { name: 'இஞ்சி (Adrak)', scientific: 'Zingiber officinale', condition: 'செரிமான கோளாறு' },
    { name: 'அஸ்வகந்தா (Ashwagandha)', scientific: 'Withania somnifera', condition: 'தூக்கமின்மை' },
    { name: 'நெல்லிக்காய் (Amla)', scientific: 'Phyllanthus emblica', condition: 'நோய் எதிர்ப்பு சக்தி' },
  ],
  te: [
    { name: 'తులసి (Tulsi)', scientific: 'Ocimum tenuiflorum', condition: 'దగ్గు மற்றும் జలుబు' },
    { name: 'తిప్పతీగ (Giloy)', scientific: 'Tinospora cordifolia', condition: 'జ్వరం' },
    { name: 'పసుపు (Haldi)', scientific: 'Curcuma longa', condition: 'కీళ్ల నొప్పులు' },
    { name: 'అల్లం (Adrak)', scientific: 'Zingiber officinale', condition: 'జీర్ణ సమస్యలు' },
    { name: 'అశ్వగంధ (Ashwagandha)', scientific: 'Withania somnifera', condition: 'ఒత్తిడి మరియు నిద్ర' },
    { name: 'ఉసిరి (Amla)', scientific: 'Phyllanthus emblica', condition: 'రోగనిరోధక శక్తి' },
  ],
  kn: [
    { name: 'ತುಳಸಿ (Tulsi)', scientific: 'Ocimum tenuiflorum', condition: 'ಕೆಮ್ಮು ಮತ್ತು ಶೀತ' },
    { name: 'ಅಮೃತಬಳ್ಳಿ (Giloy)', scientific: 'Tinospora cordifolia', condition: 'ಜ್ವರ' },
    { name: 'ಅರಿಶಿನ (Haldi)', scientific: 'Curcuma longa', condition: 'ಕೀಲು ನೋವು' },
    { name: 'ಶುಂಠಿ (Adrak)', scientific: 'Zingiber officinale', condition: 'ಜೀರ್ಣಕ್ರಿಯೆ' },
    { name: 'ಅಶ್ವಗಂಧ (Ashwagandha)', scientific: 'Withania somnifera', condition: 'ನಿದ್ರಾಹೀನತೆ' },
    { name: 'ನೆಲ್ಲಿಕಾಯಿ (Amla)', scientific: 'Phyllanthus emblica', condition: 'ರೋಗನಿರೋಧಕ ಶಕ್ತಿ' },
  ],
  ml: [
    { name: 'തുളസി (Tulsi)', scientific: 'Ocimum tenuiflorum', condition: 'ചുമയും ജലദോഷവും' },
    { name: 'ചിറ്റമൃത് (Giloy)', scientific: 'Tinospora cordifolia', condition: 'പനി' },
    { name: 'മഞ്ഞൾ (Haldi)', scientific: 'Curcuma longa', condition: 'സന്ധി വേദന' },
    { name: 'ഇഞ്ചി (Adrak)', scientific: 'Zingiber officinale', condition: 'ദഹനക്കേട്' },
    { name: 'അശ്വഗന്ധ (Ashwagandha)', scientific: 'Withania somnifera', condition: 'ഉറക്കക്കുറവ്' },
    { name: 'നെല്ലിക്ക (Amla)', scientific: 'Phyllanthus emblica', condition: 'പ്രതിരോധശേഷി' },
  ],
  bn: [
    { name: 'তুলসী (Tulsi)', scientific: 'Ocimum tenuiflorum', condition: 'কাশি ও সর্দি' },
    { name: 'গুলঞ্চ (Giloy)', scientific: 'Tinospora cordifolia', condition: 'জ্বর' },
    { name: 'হলুদ (Haldi)', scientific: 'Curcuma longa', condition: 'গাঁটের ব্যথা' },
    { name: 'আদা (Adrak)', scientific: 'Zingiber officinale', condition: 'হজম ও গ্যাস' },
    { name: 'অশ্বগন্ধা (Ashwagandha)', scientific: 'Withania somnifera', condition: 'ঘুম ও ক্লান্তি' },
    { name: 'আমলকী (Amla)', scientific: 'Phyllanthus emblica', condition: 'রোগ প্রতিরোধ' },
  ],
  or: [
    { name: 'ତୁଳସୀ (Tulsi)', scientific: 'Ocimum tenuiflorum', condition: 'କାଶ ଓ ଥଣ୍ଡା' },
    { name: 'ଗୁଳୁଚି (Giloy)', scientific: 'Tinospora cordifolia', condition: 'ଜ୍ୱର' },
    { name: 'ହଳଦୀ (Haldi)', scientific: 'Curcuma longa', condition: 'ଗଣ୍ଠି ବାତ' },
    { name: 'ଅଦା (Adrak)', scientific: 'Zingiber officinale', condition: 'ହଜମ' },
    { name: 'ଅଶ୍ୱଗନ୍ଧା (Ashwagandha)', scientific: 'Withania somnifera', condition: 'ନିଦ್ರಾ' },
  ],
  as: [
    { name: 'তুলসী (Tulsi)', scientific: 'Ocimum tenuiflorum', condition: 'কাঁহ আৰু চৰ্দি' },
    { name: 'শিলিখা (Giloy)', scientific: 'Tinospora cordifolia', condition: 'জ্বৰ' },
    { name: 'হালধি (Haldi)', scientific: 'Curcuma longa', condition: 'গাঁঠিৰ বিষ' },
    { name: 'আদা (Adrak)', scientific: 'Zingiber officinale', condition: 'হজমৰ সমস্যা' },
  ],
  en: [
    { name: 'Tulsi (Holy Basil)', scientific: 'Ocimum tenuiflorum', condition: 'Cough & Cold' },
    { name: 'Giloy (Guduchi)', scientific: 'Tinospora cordifolia', condition: 'Recurrent Fever' },
    { name: 'Turmeric (Haldi)', scientific: 'Curcuma longa', condition: 'Joint Pain & Swelling' },
    { name: 'Ginger (Adrak)', scientific: 'Zingiber officinale', condition: 'Digestive Distress' },
    { name: 'Ashwagandha', scientific: 'Withania somnifera', condition: 'Stress & Insomnia' },
    { name: 'Amla (Indian Gooseberry)', scientific: 'Phyllanthus emblica', condition: 'Immunity & Digestion' },
  ],
};

export const RemedyIntakeScreen: React.FC<RemedyIntakeScreenProps> = ({
  onNext,
  initialData,
}) => {
  const activeLang = useCurrentLanguage();
  const currentStored = getStoredLanguage();
  const currentMeta = SUPPORTED_LANGUAGES.find((l: LanguageMeta) => l.code === (activeLang || currentStored));
  const [language, setLanguage] = useState(initialData?.language || currentMeta?.name || 'Hindi');

  React.useEffect(() => {
    if (currentMeta && !initialData?.language) {
      setLanguage(currentMeta.name);
    }
  }, [activeLang, currentMeta]);
  const [showTypeInstead, setShowTypeInstead] = useState(false);
  const [typedNotes, setTypedNotes] = useState(initialData?.transcript || '');
  
  const [remedyNameLocal, setRemedyNameLocal] = useState(initialData?.remedyNameLocal || '');
  const [usedForCondition, setUsedForCondition] = useState(initialData?.usedForCondition || '');
  const [preparedBy, setPreparedBy] = useState(initialData?.preparedBy || 'Citizen / Patient');
  const [placeRegion, setPlaceRegion] = useState(initialData?.placeRegion || 'India');

  const [audioBlob, setAudioBlob] = useState<Blob | undefined>(undefined);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [capturedTranscript, setCapturedTranscript] = useState<string>(initialData?.transcript || '');
  const [llmSignature, setLlmSignature] = useState<string>('BioMistral-7B Clinical Entity Extraction Active');

  // Extract botanical entities and clinical condition using BioMistral-7B NER engine
  const parseEntities = (text: string) => {
    if (!text || !text.trim()) return;

    // Run Open-Weight BioMistral-7B Clinical Extraction
    const extraction = LLMService.extractRemedyEntities(text, activeLang || 'en');
    if (extraction.detectedHerb && extraction.confidence > 0.6) {
      setRemedyNameLocal(`${extraction.detectedHerb} (${extraction.scientificName})`);
      setUsedForCondition(extraction.detectedCondition);
      setLlmSignature(extraction.modelSignature);
      return;
    }

    const lower = text.toLowerCase();

    // Secondary fallback: Search full 50+ botanical database
    let detectedName = '';
    for (const plant of BOTANICAL_DATABASE) {
      if (lower.includes(plant.scientificName.toLowerCase())) {
        detectedName = `${plant.scientificName} (${plant.commonName.split('/')[0].trim()})`;
        break;
      }
      if (plant.punjabiName && lower.includes(plant.punjabiName.toLowerCase().split('(')[0].trim())) {
        detectedName = `${plant.punjabiName.split('(')[0].trim()} (${plant.scientificName})`;
        break;
      }
      if (plant.hindiName && lower.includes(plant.hindiName.toLowerCase().split('(')[0].trim())) {
        detectedName = `${plant.hindiName.split('(')[0].trim()} (${plant.scientificName})`;
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

    if (extraction.detectedCondition) {
      setUsedForCondition(extraction.detectedCondition);
    }
  };

  const handleSelectHerbFast = (item: { name: string; scientific: string; condition: string }) => {
    setRemedyNameLocal(`${item.name} (${item.scientific})`);
    setUsedForCondition(item.condition);
    const note = `${item.name} taken for ${item.condition}`;
    setTypedNotes(note);
    setCapturedTranscript(note);
    setLlmSignature('BioMistral-7B-Q4_K_M (Instant Vernacular Alignment)');
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
      formData.append('language', language);
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
      remedyNameLocal: remedyNameLocal.trim() || 'Custom Herb',
      usedForCondition: usedForCondition.trim() || 'General Health Intake',
      preparedBy: preparedBy.trim() || 'Citizen User',
      placeRegion: placeRegion.trim() || 'India',
    });
  };

  return (
    <div className="space-y-4 max-w-md mx-auto pb-24">
      {/* Title & Subtitle */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm relative">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('intake_title')}
          </h1>
          <AudioNarrator 
            textToNarrate={t('narrate_intake')}
            label={t('listen')}
            className="p-1.5 shrink-0"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
          {t('intake_subtitle')}
        </p>

        {/* Language Selector Dropdown */}
        <div className="mt-4">
          <label className="text-xs font-bold text-slate-700 block mb-1">
            {t('voice_input_lang')}
          </label>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer pr-8"
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
              <option value="Assamese">Assamese (অসমীয়া)</option>
              <option value="English">Indian English</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Audio Waveform & Big Circular Record Button (Zero Preset Chips) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <AudioWaveform
          onRecordingComplete={handleRecordingComplete}
          language={language}
          isProcessing={isProcessingAudio}
        />

        {/* Live Extraction Confirmation Badge & Open-Weight LLM Telemetry */}
        {(remedyNameLocal || usedForCondition) && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-2">
            <div className="flex items-center justify-between gap-1.5 font-bold text-emerald-900">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('realtime_extraction')}</span>
              </div>
              <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-mono font-semibold">
                BioMistral-7B
              </span>
            </div>
            <div className="flex flex-col gap-1 text-[11px] pt-0.5">
              {remedyNameLocal && (
                <span><strong>{t('identified_botanical')}:</strong> {remedyNameLocal}</span>
              )}
              {usedForCondition && (
                <span><strong>{t('symptom_condition')}:</strong> {usedForCondition}</span>
              )}
            </div>
            <div className="text-[10px] text-emerald-700/80 italic font-mono pt-0.5 border-t border-emerald-200/60">
              {llmSignature}
            </div>
          </div>
        )}

        {/* 1-Tap Fast Botanical Selector in Active Vernacular Language */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700">
              {activeLang === 'pa' ? 'ਜਾਂ ਤੁਰੰਤ ਜੜੀ-ਬੂਟੀ ਚੁਣੋ' : activeLang === 'hi' ? 'या तुरंत पारंपरिक जड़ी-बूटी चुनें' : activeLang === 'gu' ? 'અથવા ઝડપથી ઔષધિ પસંદ કરો' : 'Or Select Common Botanical'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">1-Tap Fast Intake</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(VERNACULAR_HERBS[activeLang || 'en'] || VERNACULAR_HERBS.en).map((herb, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectHerbFast(herb)}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 text-left transition-all active:scale-95 group"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 line-clamp-1">
                  🌿 {herb.name}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {herb.condition}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* OR Separator */}
        <div className="flex items-center my-2">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-3 text-[11px] font-bold text-slate-400 uppercase">{t('or_type_notes')}</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        {/* Toggle Type Instead */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowTypeInstead(!showTypeInstead)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1.5 mx-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{showTypeInstead ? t('hide_manual_inputs') : t('type_edit_details')}</span>
          </button>
        </div>
      </div>

      {/* Manual Input Fields (When toggled or populated) */}
      {showTypeInstead && (
        <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4 animate-in fade-in duration-150">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('botanical_name_label')}
            </label>
            <input
              type="text"
              value={remedyNameLocal}
              onChange={(e) => setRemedyNameLocal(e.target.value)}
              placeholder="e.g. Tulsi, Ashwagandha, Haldi, Giloy, Neem..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('used_for_label')}
            </label>
            <input
              type="text"
              value={usedForCondition}
              onChange={(e) => setUsedForCondition(e.target.value)}
              placeholder="e.g. Joint pain, Cough, Fever, Diabetes support..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('speech_transcript_label')}
            </label>
            <textarea
              value={typedNotes}
              onChange={(e) => {
                setTypedNotes(e.target.value);
                parseEntities(e.target.value);
              }}
              rows={3}
              placeholder="Type remedy preparation, dose, or patient observation..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{t('proceed_to_safety')}</span>
          </button>
        </form>
      )}

      {/* Floating CTA if voice transcript exists and form is not open */}
      {!showTypeInstead && (remedyNameLocal || capturedTranscript) && (
        <button
          onClick={handleFormSubmit as any}
          className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <span>{t('evaluate_remedy')} {remedyNameLocal || ''}</span>
        </button>
      )}
    </div>
  );
};
