import React from 'react';
import { X, Globe, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage, LocalizationService, useCurrentLanguage, t } from '../services/localizationService';
import { playNativeTTS } from './AudioNarrator';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WELCOME_GREETINGS: Record<SupportedLanguage, string> = {
  kn: 'ತುಳಸಿವೇದ AI ಗೆ ಸುಸ್ವಾಗತ. ನೀವು ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ.',
  hi: 'तुलसीवेद एआई में आपका स्वागत है। आपने हिन्दी भाषा चुनी है।',
  gu: 'તુલસીવેદ એઆઈમાં આપનું સ્વાગત છે. આપે ગુજરાતી ભાષા પસંદ કરી છે.',
  pa: 'ਤੁਲਸੀਵੇਦ ਏਆਈ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਤੁਸੀਂ ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਚੁਣੀ ਹੈ।',
  mr: 'तुलसीवेद एआय मध्ये आपले स्वागत आहे. आपण मराठी भाषा निवडली आहे.',
  ta: 'துளசிவேத் AI-க்கு உங்களை வரவேற்கிறோம். நீங்கள் தமிழ் மொழியைத் தேர்ந்தெடுத்துள்ளீர்கள்.',
  te: 'తులసివేద్ AI కి స్వాగతం. మీరు తెలుగు భాషను ఎంచుకున్నారు.',
  ml: 'തുളസിവേദ് AI-ലേക്ക് സ്വാഗതം. നിങ്ങൾ മലയാളം തിരഞ്ഞെടുത്തു.',
  bn: 'তুলসীবেদ এআই-তে আপনাকে স্বাগতম। আপনি বাংলা ভাষা বেছে নিয়েছেন।',
  or: 'ତୁଳସୀବେଦ AI କୁ ସ୍ୱାଗତ। ଆପଣ ଓଡ଼ିଆ ଭାଷା ବାଛିଛନ୍ତି।',
  as: 'তুলসীবেদ এআইলৈ স্বাগতম। আপুনি অসমীয়া ভাষা বাছি লৈছে।',
  en: 'Welcome to TulsiVeda AI. You have selected Indian English.',
};

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const currentLang = useCurrentLanguage();

  if (!isOpen) return null;

  const handleSelect = (code: SupportedLanguage) => {
    LocalizationService.setLanguage(code);
    const greeting = WELCOME_GREETINGS[code] || WELCOME_GREETINGS.hi;
    playNativeTTS(greeting, code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] overflow-hidden shadow-2xl border border-emerald-100 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                {t('profile_title') || 'Select Language'}
              </h2>
              <p className="text-[11px] text-emerald-100 font-medium">
                1-Tap Pan-India Language Switch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 12 Language Grid */}
        <div className="p-3.5 grid grid-cols-2 gap-2 overflow-y-auto max-h-[70vh]">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-95 relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500 shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:bg-emerald-50/40 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900 leading-tight">
                    {lang.nativeName}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">
                  {lang.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
