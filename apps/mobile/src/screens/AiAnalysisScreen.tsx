import React, { useEffect, useState } from 'react';
import { AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { BOTANICAL_DATABASE } from '../services/botanicalDatabase.ts';

interface AiAnalysisScreenProps {
  remedyData: {
    remedyNameLocal?: string;
    usedForCondition?: string;
    preparedBy?: string;
    placeRegion?: string;
    language?: string;
    transcript?: string;
  };
  onNext: (extractedData: any) => void;
}

export const AiAnalysisScreen: React.FC<AiAnalysisScreenProps> = ({
  remedyData,
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState<'transcription' | 'extracted'>('transcription');
  const [transcript, setTranscript] = useState(
    remedyData.transcript || 
    (remedyData.remedyNameLocal 
      ? remedyData.remedyNameLocal + (remedyData.usedForCondition ? ' for ' + remedyData.usedForCondition : '')
      : '')
  );

  const [extractedDetails, setExtractedDetails] = useState({
    localName: remedyData.remedyNameLocal || 'Not Extracted',
    partsUsed: 'Not Extracted',
    preparation: 'Not Extracted',
    dose: 'Not Extracted',
    frequency: 'Not Extracted',
    duration: 'Not Extracted',
    route: 'Oral',
    usedForCondition: remedyData.usedForCondition || 'Not Extracted',
    notes: 'Field intake record.',
  });

  const [missingList, setMissingList] = useState<string[]>([]);

  const analyzeText = (text: string, hintName?: string, hintCondition?: string) => {
    const lower = (text || '').toLowerCase();

    // 1. Local Name
    let localName = hintName || 'Not Extracted';
    if (localName === 'Not Extracted' || !localName) {
      for (const plant of BOTANICAL_DATABASE) {
        if (lower.includes(plant.scientificName.toLowerCase())) {
          localName = `${plant.scientificName} (${plant.commonName.split('/')[0].trim()})`;
          break;
        }
        for (const alias of plant.vernacularAliases) {
          if (lower.includes(alias.toLowerCase())) {
            localName = `${alias} (${plant.scientificName})`;
            break;
          }
        }
        if (localName !== 'Not Extracted' && localName) break;
      }
      if ((localName === 'Not Extracted' || !localName) && text.trim()) {
        localName = text.split(' ')[0];
      }
    }

    // 2. Parts Used
    let partsUsed = 'Not Extracted';
    if (/ગાંઠ|મૂળ|જડ|गांठ|जड़|मूल|मूळ|வேர்|వేరు|ಬೇರು|വേര്|শিকড়|ਜੜ੍ਹ|rhizome|root|roots/i.test(text)) partsUsed = 'Rhizome & Root (મૂળ / जड़ / Root)';
    else if (/પાન|પાંદડા|पत्ता|पत्ते|पत्तियां|पत्तियाँ|पान|இலை|ఆకులు|ಎಲೆ|ഇല|পাতা|ਪੱਤੇ|leaf|leaves/i.test(text)) partsUsed = 'Leaves (પાંદડા / Leaves)';
    else if (/છાલ|छाल|साल|பட்டை|bark/i.test(text)) partsUsed = 'Bark (છાલ / Bark)';
    else if (/બીજ|બી|बीज|दाने|बिया|seed|seeds/i.test(text)) partsUsed = 'Seeds (બીજ / Seeds)';
    else if (/કાંડ|દાંડી|તના|तना|stem|stalk/i.test(text)) partsUsed = 'Stem (કાંડ / Stem)';

    // 3. Preparation
    let preparation = 'Not Extracted';
    if (/દૂધ|दूध|दुधात|பால்|పాలు|ಹಾಲು|പാൽ|দুধ|ਦੁੱਧ|milk|warm milk/i.test(text)) preparation = 'Boiled with warm milk (દૂધ સાથે ઉકાળો / दूध के साथ)';
    else if (/ઉકાળો|કાઢો|काढ़ा|काढा|கஷாயம்|కషాయం|decoction|boiled/i.test(text)) preparation = 'Boiled Herbal Decoction (ઉકાળો / काढ़ा)';
    else if (/રસ|સ્વરસ|रस|स्वरस|சாறு|రసం|fresh juice|juice/i.test(text)) preparation = 'Fresh juice (સ્વરસ / रस)';
    else if (/ચૂર્ણ|चूर्ण|पूड|தூள்|పొడి|ಪುಡಿ|গুঁড়ো|powder|churna/i.test(text)) preparation = 'Powder / Churna (ચૂર્ણ / चूर्ण) with warm milk/water';
    else if (/લેપ|પેસ્ટ|लेप|paste|topical|ointment/i.test(text)) preparation = 'Topical Paste for external application (લેપ)';

    // 4. Dose
    let dose = 'Not Extracted';
    const doseMatch = text.match(/(\d+|one|two|half|એક|બે|एक|दो)\s*(ચમચી|ચમચ|spoon|teaspoon|tsp|चम्मच|gm|gram|ml|mg|પાન|leaves|पत्ते|drops|ટીપાં|बूंद)/i);
    if (doseMatch) {
      dose = doseMatch[0];
    } else if (/one teaspoon|one spoon|1 teaspoon|1 spoon/i.test(text)) {
      dose = '1 teaspoon (5 gm)';
    } else if (/two teaspoons|two spoons|2 teaspoons|2 spoons/i.test(text)) {
      dose = '2 teaspoons (10 gm)';
    }

    // 5. Frequency
    let frequency = 'Not Extracted';
    if (/રાત્રે|रात|रात्री|இரவு|రాత్రి|bedtime|night/i.test(text)) {
      frequency = 'Once Daily at Bedtime (રાત્રે સૂતી વખતે / रात को सोते समय)';
    } else if (/સવારે અને સાંજે|સવાર સાંજ|દિવસમાં બે વાર|બે વાર|सुबह और शाम|सुबह शाम|दिन में दो बार|दो बार|दोन वेळा|இருவேளை|రెండుసార్లు|twice|morning and evening/i.test(text)) {
      frequency = 'Twice Daily (સવારે અને સાંજે / सुबह-शाम)';
    } else if (/રોજ|એક વાર|દિવસે એક વાર|दिन में एक बार|रोज|once|daily/i.test(text)) {
      frequency = 'Once Daily (રોજ એક વાર / दिन में एक बार)';
    } else if (/ત્રણ વાર|तीन बार|thrice/i.test(text)) {
      frequency = 'Thrice Daily (દિવસમાં ત્રણ વાર)';
    }

    // 6. Duration
    let duration = 'Not Extracted';
    const durMatch = text.match(/(\d+|one|two|three|five|seven|ten|સાત|પાંચ|બે|એક|દસ|सात|पांच|दो|एक|दस|दहा|ஏழு|ஐந்து|ഏഴ്)\s*(દિવસ|દહાડા|મહિના|અઠવાડિયા|दिन|दिवस|நாட்கள்|రోజులు|दिन|days?|weeks?|months?)/i);
    if (durMatch) {
      duration = durMatch[0];
    } else if (/7 days|seven days|સાત દિવસ|सात दिन|सात दिवस/i.test(text)) {
      duration = '7 days (સાત દિવસ)';
    } else if (/5 days|five days|પાંચ દિવસ|पांच दिन/i.test(text)) {
      duration = '5 days (પાંચ દિવસ)';
    } else if (/10 days|ten days|દસ દિવસ|दस दिन|दहा दिवस/i.test(text)) {
      duration = '10 days (દસ દિવસ)';
    }

    // 7. Route
    let route = 'Oral';
    if (/ચામડી|ત્વચા|ખંજવાળ|લગાવ|લેપ|त्वचा|लगाना|लेप|skin|apply|topical|external|rub/i.test(text)) {
      route = 'Topical (બાહ્ય લેપ / त्वचा पर)';
    } else {
      route = 'Oral (મુખ વાટે / मौखिक)';
    }

    // 8. Used For Condition
    let usedFor = hintCondition || 'Not Extracted';
    if (usedFor === 'Not Extracted' || !usedFor) {
      if (/સાંધા|દુખાવો|જોડો|जोड़ों|दर्द|joint|pain|arthritis|swelling|सूजन|સોજો/i.test(text)) {
        usedFor = 'Joint Pain & Swelling (સાંધાનો દુખાવો)';
      } else if (/ખાંસી|શરદી|ઉધરસ|કફ|खांसी|खाँसी|जुकाम|सर्दी|cough|cold/i.test(text)) {
        usedFor = 'Cough & Cold (શરદી-ઉધરસ)';
      } else if (/તાવ|તાવનો|बुखार|ताप|fever/i.test(text)) {
        usedFor = 'Fever (તાવ / बुखार)';
      } else if (/ઊંઘ|અનિદ્રા|ટેન્શન|ચિંતા|अनिद्रा|तनाव|झोप|insomnia|stress|anxiety/i.test(text)) {
        usedFor = 'Anxiety & Sleep Support (અનિદ્રા / માનસિક તાણ)';
      } else if (/ડાયાબિટીસ|સુગર|मधुमेह|शुगर|diabetes|sugar/i.test(text)) {
        usedFor = 'Diabetes Mellitus Support (ડાયાબિટીસ)';
      } else if (/પાચન|પેટ|पाचन|पेट|digestion|stomach|acidity|gas/i.test(text)) {
        usedFor = 'Digestive Issues (પાચન સમસ્યા)';
      } else if (/ચામડી|ત્વચા|ખંજવાળ|त्वचा|खुजली|skin|rash|घाव/i.test(text)) {
        usedFor = 'Skin Irritation (ત્વચા રોગ)';
      }
    }

    const missing: string[] = [];
    if (localName === 'Not Extracted') missing.push('Remedy Name');
    if (dose === 'Not Extracted') missing.push('Dose');
    if (duration === 'Not Extracted') missing.push('Duration');
    if (partsUsed === 'Not Extracted') missing.push('Parts Used');
    if (preparation === 'Not Extracted') missing.push('Preparation');

    setMissingList(missing);
    setExtractedDetails({
      localName,
      partsUsed,
      preparation,
      dose,
      frequency,
      duration,
      route,
      usedForCondition: usedFor,
      notes: text ? 'Captured via ASHA vernacular voice stream.' : 'Manual entry.',
    });
  };

  useEffect(() => {
    analyzeText(transcript, remedyData.remedyNameLocal, remedyData.usedForCondition);

    const runExtraction = async () => {
      if (!transcript) return;
      try {
        const res = await fetch('/api/remedies/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript,
            remedyNameHint: remedyData.remedyNameLocal,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.extractedDetails) {
            setExtractedDetails((prev) => ({
              ...prev,
              ...data.extractedDetails,
            }));
            if (data.extractedDetails.missingInformation) {
              setMissingList(data.extractedDetails.missingInformation);
            }
          }
        }
      } catch (err) {}
    };

    runExtraction();
  }, [transcript]);

  const handleNext = () => {
    onNext({
      transcript,
      ...extractedDetails,
    });
  };

  const rows = [
    { label: 'Local Name', value: extractedDetails.localName },
    { label: 'Parts Used', value: extractedDetails.partsUsed },
    { label: 'Preparation', value: extractedDetails.preparation },
    { label: 'Dose', value: extractedDetails.dose },
    { label: 'Frequency', value: extractedDetails.frequency },
    { label: 'Duration', value: extractedDetails.duration },
    { label: 'Route', value: extractedDetails.route },
    { label: 'Used For (Condition)', value: extractedDetails.usedForCondition },
    { label: 'Notes', value: extractedDetails.notes },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">AI Analysis</h1>
        <p className="text-xs text-gray-500 mt-0.5">Speech transcription and 9-field clinical extraction.</p>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('transcription')}
          className={'flex-1 py-2 text-xs font-bold rounded-lg transition-all ' + (activeTab === 'transcription' ? 'bg-emerald-700 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900')}
        >
          Transcription
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('extracted')}
          className={'flex-1 py-2 text-xs font-bold rounded-lg transition-all ' + (activeTab === 'extracted' ? 'bg-emerald-700 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900')}
        >
          Extracted Details
        </button>
      </div>

      {activeTab === 'transcription' && (
        <div className="surface-card bg-white space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="form-label text-xs mb-0">Vernacular Audio Transcript</label>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
              Indic Engine
            </span>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={4}
            className="form-input text-xs leading-relaxed bg-gray-50/50"
            placeholder="Speak or type your remedy note to see transcription..."
          />
          <p className="text-[10px] text-gray-400 italic">
            You can edit this transcript at any time to update extracted fields.
          </p>
        </div>
      )}

      <div className="surface-card space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Extracted Details</span>
          </h2>
          <span className="text-[10px] text-gray-400 font-mono">Structured NLP</span>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {rows.map((row) => {
            const isNotExtracted = row.value === 'Not Extracted' || !row.value;
            return (
              <div key={row.label} className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-gray-500 font-medium">{row.label}</span>
                <span
                  className={'text-right font-semibold truncate max-w-[200px] ' + (isNotExtracted ? 'text-amber-600 italic font-normal' : 'text-gray-900')}
                >
                  {isNotExtracted ? 'Not Extracted' : row.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {missingList.length > 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 shadow-sm animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-900">Missing Information Flagged</h4>
            <p className="text-[11px] text-amber-700 mt-0.5 leading-snug">
              The following fields were not mentioned: <span className="font-semibold">{missingList.join(', ')}</span>.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All required clinical fields extracted successfully.</span>
        </div>
      )}

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={handleNext}
          className="btn-primary px-8 text-sm py-2.5 rounded-xl shadow-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};
