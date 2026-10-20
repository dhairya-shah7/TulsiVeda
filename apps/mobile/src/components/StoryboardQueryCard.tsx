import React from 'react';
import { Mic, MessageSquare, Camera, Sparkles, Volume2 } from 'lucide-react';
import { useCurrentLanguage, LocalizationService } from '../services/localizationService';
import { VoiceEngineService } from '../services/voiceEngineService';

interface StoryboardQueryCardProps {
  onOpenVoice: () => void;
  onOpenText: () => void;
  onOpenImage: () => void;
  onOpenPlantSelection: () => void;
}

export const StoryboardQueryCard: React.FC<StoryboardQueryCardProps> = ({
  onOpenVoice,
  onOpenText,
  onOpenImage,
  onOpenPlantSelection,
}) => {
  const lang = useCurrentLanguage();

  // Localized sample speech bubble questions from real storyboard
  const speechBubbleQuestions: Record<string, string> = {
    hi: 'क्या मैं तुलसी का काढ़ा अपनी ब्लड प्रेशर की दवा के साथ ले सकती हूँ?',
    gu: 'શું હું બીપીની દવા સાથે તુલસીનો ઉકાળો લઈ શકું?',
    pa: 'ਕੀ ਮੈਂ ਤੁਲસી ਦਾ ਕਾੜ੍ਹਾ ਆਪਣੀ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਦੀ ਦਵਾਈ ਨਾਲ ਲੈ ਸਕਦੀ ਹਾਂ?',
    ta: 'என் ரத்த அழுத்த மாத்திரையுடன் துளசி கஷாயம் குடிக்கலாமா?',
    te: 'నేను నా రక్తపోటు మందులతో తులసి కషాయం తీసుకోవచ్చా?',
    kn: 'ನನ್ನ ರಕ್ತದೊತ್ತಡದ ಔಷಧಿಯೊಂದಿಗೆ ತುಳಸಿ ಕಷಾಯವನ್ನು ತೆಗೆದುಕೊಳ್ಳಬಹುದೇ?',
    ml: 'എന്റെ രക്തസമ്മർദ്ദ മരുന്നിനൊപ്പം തുളസി കഷായം കഴിക്കാമോ?',
    mr: 'मी माझ्या रक्तदाबाच्या औषधासोबत तुळशीचा काढा घेऊ शकते का?',
    bn: 'আমি কি আমার রক্তচাপের ওষুধের সাথে তুলসী পাতার কাড়া খেতে পারি?',
    en: 'Can I take Tulsi decoction with my blood pressure medicine?',
  };

  const activeQuestion = speechBubbleQuestions[lang] || speechBubbleQuestions.en;

  const handleSpeakSample = (e: React.MouseEvent) => {
    e.stopPropagation();
    VoiceEngineService.speakInLanguage(activeQuestion, lang as any);
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-white to-emerald-50/60 p-5 border-2 border-emerald-500/25 shadow-md shadow-emerald-950/5">
      {/* Top Header Badge - Exact match to Storyboard Step 1 */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700 text-white shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
          <span className="text-[11px] font-black tracking-wide uppercase">
            1 • {lang === 'hi' ? 'वास्तविक प्रश्न' : lang === 'gu' ? 'વાસ્તવિક પ્રશ્ન' : 'Real-World Query'}
          </span>
        </div>
        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300/60">
          AI4Bharat + BioMistral
        </span>
      </div>

      <p className="text-xs font-semibold text-slate-600 leading-snug mb-3">
        {lang === 'hi' 
          ? 'अपनी भाषा में बोलकर, लिखकर या फोटो खींचकर पूछें:'
          : lang === 'gu'
          ? 'તમારી પોતાની ભાષામાં બોલીને, લખીને અથવા ફોટો પાડીને પૂછો:'
          : 'User asks in their own language using voice, text, or image:'}
      </p>

      {/* Central Storyboard Speech Bubble */}
      <div className="relative mb-4 bg-emerald-800 text-white rounded-2xl p-4 shadow-sm border border-emerald-600/50">
        <div className="flex items-start justify-between gap-2.5">
          <p className="text-sm font-extrabold leading-snug tracking-tight">
            "{activeQuestion}"
          </p>
          <button
            onClick={handleSpeakSample}
            title="Listen sample question"
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white shrink-0 active:scale-95 transition-transform"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Triangle Tail */}
        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-emerald-800 transform rotate-45 border-r border-b border-emerald-600/50" />
      </div>

      {/* The 4 Action Pillars matching the Storyboard */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {/* Pillar 1: Voice in 12 Languages */}
        <button
          onClick={onOpenVoice}
          className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-xs hover:shadow-md active:scale-98 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight min-w-0">
            <span className="block font-black text-xs">
              {lang === 'hi' ? 'बोलकर पूछें' : lang === 'gu' ? 'બોલીને પૂછો' : 'Voice Input'}
            </span>
            <span className="block text-[9px] text-emerald-100 font-semibold truncate">
              12 Indian Languages
            </span>
          </div>
        </button>

        {/* Pillar 2: Text Query */}
        <button
          onClick={onOpenText}
          className="flex items-center gap-2.5 p-3 rounded-2xl bg-white text-slate-800 border border-slate-200/90 font-bold text-xs shadow-xs hover:bg-slate-50 active:scale-98 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="leading-tight min-w-0">
            <span className="block font-black text-xs">
              {lang === 'hi' ? 'लिखकर पूछें' : lang === 'gu' ? 'લખીને પૂછો' : 'Text Query'}
            </span>
            <span className="block text-[9px] text-slate-500 font-semibold truncate">
              Type symptom / Rx
            </span>
          </div>
        </button>

        {/* Pillar 3: Image / OCR */}
        <button
          onClick={onOpenImage}
          className="flex items-center gap-2.5 p-3 rounded-2xl bg-white text-slate-800 border border-slate-200/90 font-bold text-xs shadow-xs hover:bg-slate-50 active:scale-98 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Camera className="w-4 h-4" />
          </div>
          <div className="leading-tight min-w-0">
            <span className="block font-black text-xs">
              {lang === 'hi' ? 'फोटो खींचें' : lang === 'gu' ? 'ફોટો પાડો' : 'Image Scan'}
            </span>
            <span className="block text-[9px] text-slate-500 font-semibold truncate">
              Plant / Prescription
            </span>
          </div>
        </button>

        {/* Pillar 4: Plant Selection */}
        <button
          onClick={onOpenPlantSelection}
          className="flex items-center gap-2.5 p-3 rounded-2xl bg-white text-slate-800 border border-slate-200/90 font-bold text-xs shadow-xs hover:bg-slate-50 active:scale-98 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <span className="text-sm">🌿</span>
          </div>
          <div className="leading-tight min-w-0">
            <span className="block font-black text-xs">
              {lang === 'hi' ? 'पौधा चुनें' : lang === 'gu' ? 'વનસ્પતિ પસંદ કરો' : 'Plant Selection'}
            </span>
            <span className="block text-[9px] text-slate-500 font-semibold truncate">
              50+ AYUSH Species
            </span>
          </div>
        </button>
      </div>

      {/* Dynamic Hint Line */}
      <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-900/80 bg-emerald-100/40 px-3 py-1.5 rounded-xl border border-emerald-200/50">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="truncate">
          {lang === 'hi' 
            ? 'उदा: "घुटनों में दर्द है क्या लें?" या "तुलसी और बीपी की दवा"' 
            : lang === 'gu'
            ? 'દા.ત: "ગોઠણમાં દુખાવો છે શું વાપરવું?" અથવા "તુલસી અને બીપી"'
            : 'Try: "I have pain in my knees what to use" or "Tulsi with BP medicine"'}
        </span>
      </div>
    </div>
  );
};
