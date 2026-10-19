import React, { useState } from 'react';
import { Check, Globe, Sparkles, ArrowRight, Volume2 } from 'lucide-react';
import { 
  SUPPORTED_LANGUAGES, 
  SupportedLanguage, 
  setStoredLanguage 
} from '../services/localizationService';
import { playNativeTTS } from '../components/AudioNarrator';

interface LanguageOnboardingScreenProps {
  onComplete: () => void;
}

export const LanguageOnboardingScreen: React.FC<LanguageOnboardingScreenProps> = ({ onComplete }) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('hi');

  const WELCOME_GREETINGS: Record<SupportedLanguage, string> = {
    hi: 'तुलसीवेद एआई में आपका स्वागत है। आपने हिन्दी भाषा चुनी है।',
    gu: 'તુલસીવેદ એઆઈમાં આપનું સ્વાગત છે. આપે ગુજરાતી ભાષા પસંદ કરી છે.',
    pa: 'ਤੁਲਸੀਵੇਦ ਏਆਈ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਤੁਸੀਂ ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਚੁਣੀ ਹੈ।',
    mr: 'तुलसीवेद एआय मध्ये आपले स्वागत आहे. आपण मराठी भाषा निवडली आहे.',
    ta: 'துளசிவேத் AI-க்கு உங்களை வரவேற்கிறோம். நீங்கள் தமிழ் மொழியைத் தேர்ந்தெடுத்துள்ளீர்கள்.',
    te: 'తులసివేద్ AI కి స్వాగతం. మీరు తెలుగు భాషను ఎంచుకున్నారు.',
    kn: 'ತುಳಸಿವೇದ್ AI ಗೆ ಸುಸ್ವಾಗತ. ನೀವು ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ.',
    ml: 'തുളസിവേദ് AI-ലേക്ക് സ്വാഗതം. നിങ്ങൾ മലയാളം തിരഞ്ഞെടുത്തു.',
    bn: 'তুলসীবেদ এআই-তে আপনাকে স্বাগতম। আপনি বাংলা ভাষা বেছে নিয়েছেন।',
    or: 'ତୁଳସୀବେଦ AI କୁ ସ୍ୱାଗତ। ଆପଣ ଓଡ଼ିଆ ଭାଷା ବାଛିଛନ୍ତି।',
    as: 'তুলসীবেদ এআইলৈ স্বাগতম। আপুনি অসমীয়া ভাষা বাছি লৈছে।',
    en: 'Welcome to TulsiVeda AI. You have selected Indian English.',
  };

  const handleSelect = (code: SupportedLanguage) => {
    setSelectedLang(code);
    const greeting = WELCOME_GREETINGS[code] || WELCOME_GREETINGS.hi;
    playNativeTTS(greeting, code);
  };

  const handleContinue = () => {
    setStoredLanguage(selectedLang);
    localStorage.setItem('tulsiveda_onboarding_done', 'true');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-800 via-teal-900 to-slate-900 text-white flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="pt-6 text-center space-y-3 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-semibold">
          <Globe className="w-3.5 h-3.5 text-emerald-300" />
          <span>Pan-India Multilingual Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          अपनी भाषा चुनें
        </h1>
        <p className="text-emerald-100/90 text-sm font-medium">
          Choose your native Indian language for voice guidance & health decisions
        </p>
      </div>

      {/* Language Grid */}
      <div className="py-6 grid grid-cols-2 gap-3 z-10 max-h-[58vh] overflow-y-auto pr-1">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLang === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-white text-slate-900 border-white shadow-xl scale-[1.02] ring-2 ring-emerald-400'
                  : 'bg-white/10 text-white border-white/15 hover:bg-white/15'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-lg font-bold ${isSelected ? 'text-emerald-800' : 'text-white'}`}>
                  {lang.nativeName}
                </span>
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">
                    {lang.code}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs font-medium">
                <span className={isSelected ? 'text-slate-500' : 'text-emerald-200/70'}>
                  {lang.name}
                </span>
                <Volume2 className={`w-3.5 h-3.5 opacity-60 ${isSelected ? 'text-emerald-700' : 'text-white/60'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="pb-4 pt-2 z-10 space-y-3">
        <button
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-extrabold text-base shadow-lg hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>आगे बढ़ें / Get Started</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
        <p className="text-[11px] text-center text-emerald-200/60 font-medium">
          Zero Hardcoding • Bio-Kinetic Causal Engine • 100% Free for Bharat
        </p>
      </div>
    </div>
  );
};
