import React, { useState } from 'react';
import { ChevronDown, Edit3, Sparkles } from 'lucide-react';
import { AudioWaveform } from '../components/AudioWaveform.tsx';

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

  // Extract botanical entities and clinical condition from spoken text
  const parseEntities = (text: string) => {
    if (!text) return;
    const lower = text.toLowerCase();

    // 1. Plant / Local Name
    let detectedName = '';
    if (/હળદર|हल्दी|haldi|turmeric|curcuma/i.test(text)) {
      detectedName = 'Haldi (હળદર / Turmeric)';
    } else if (/તુલસી|तुलसी|tulsi|basil|ocimum/i.test(text)) {
      detectedName = 'Tulsi (તુલસી / Holy Basil)';
    } else if (/લીમડો|नीम|neem|azadirachta/i.test(text)) {
      detectedName = 'Neem (લીમડો)';
    } else if (/અશ્વગંધા|अश्वगंधा|ashwagandha|withania/i.test(text)) {
      detectedName = 'Ashwagandha (અશ્વગંધા)';
    } else if (/ગિલોય|ગળો|गिलोय|giloy|guduchi|tinospora/i.test(text)) {
      detectedName = 'Giloy (ગિલોય / ગળો)';
    } else if (/આદુ|अदरक|आदू|ginger|aadu|sunthi|zingiber/i.test(text)) {
      detectedName = 'Ginger / Aadu (આદુ)';
    } else if (/આમળા|आंवला|amla|emblica/i.test(text)) {
      detectedName = 'Amla (આમળા)';
    } else if (/ફૂદીનો|પૂદીના|पुदीना|pudina|mint/i.test(text)) {
      detectedName = 'Pudina (ફૂદીનો)';
    }

    if (detectedName) {
      setRemedyNameLocal(detectedName);
    }

    // 2. Used For / Condition
    let detectedCondition = '';
    if (/સાંધા|દુખાવો|જોડો|जोड़ों|दर्द|joint|pain|arthritis|swelling|सूजन|સોજો/i.test(text)) {
      detectedCondition = 'Joint Pain & Swelling (સાંધાનો દુખાવો)';
    } else if (/ખાંસી|શરદી|ઉધરસ|કફ|खांसी|खाँसी|जुकाम|सर्दी|cough|cold/i.test(text)) {
      detectedCondition = 'Cough & Cold (શરદી-ઉધરસ)';
    } else if (/તાવ|તાવનો|बुखार|fever/i.test(text)) {
      detectedCondition = 'Fever (તાવ / बुखार)';
    } else if (/પાચન|પેટ|पाचन|पेट|digestion|stomach|acidity|gas/i.test(text)) {
      detectedCondition = 'Digestive Issues (પાચન સમસ્યા)';
    } else if (/ચામડી|ત્વચા|ખંજવાળ|त्वचा|खुजली|skin|rash|घाव/i.test(text)) {
      detectedCondition = 'Skin Irritation (ત્વચા રોગ)';
    }

    if (detectedCondition) {
      setUsedForCondition(detectedCondition);
    }

    // Defaults for regional field reporting
    if (!preparedBy) setPreparedBy('ASHA Field Worker');
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
      <div>
        <label className="form-label text-xs">Language</label>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-input appearance-none pr-9 text-sm font-medium bg-white cursor-pointer"
          >
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिन्दी)</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Quick Voice Demo Presets */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          Quick Voice Intake Samples (Tap to simulate / auto-fill)
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (language === 'Gujarati') {
                applyPreset('અમે સાંધાના દુખાવા માટે હળદરની ગાંઠ વાપરીએ છીએ. એક ચમચી હળદરનું ચૂર્ણ ગરમ દૂધમાં ઉકાળીને દર્દીને દિવસમાં બે વાર, સવારે અને સાંજે, સાત દિવસ આપીએ છીએ.');
              } else if (language === 'Hindi') {
                applyPreset('हम जोड़ों के दर्द के लिए हल्दी की गांठ का उपयोग करते हैं। एक चम्मच हल्दी का चूर्ण गर्म दूध में उबालकर मरीज को दिन में दो बार, सुबह और शाम, सात दिनों तक दिया जाता है।');
              } else {
                applyPreset('We use Haldi rhizome root for severe joint pain and swelling. One teaspoon turmeric powder boiled in warm milk, taken orally twice daily for 7 days.');
              }
            }}
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1"
          >
            <span>🌿</span> Haldi + Milk (Joint Pain)
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
          <button
            type="button"
            onClick={() => {
              if (language === 'Gujarati') {
                applyPreset('ત્વચા રોગ અને ખંજવાળ માટે અમે લીમડાના પાંદડા વાપરીએ છીએ. તેને વાટીને લીસી પેસ્ટ બનાવીએ છીએ. આ લેપ ચામડી પર રોજ એક વાર દસ દિવસ લગાવવાનો છે.');
              } else if (language === 'Hindi') {
                applyPreset('त्वचा रोग और खुजली के लिए हम नीम के पत्तों का लेप बनाते हैं। यह लेप त्वचा पर रोज एक बार दस दिन तक लगाना है।');
              } else {
                applyPreset('For skin rashes and eczema, we grind fresh Neem leaves into a smooth paste. Apply topically once daily for 10 days.');
              }
            }}
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1"
          >
            <span>🍃</span> Neem (Skin Rashes)
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
