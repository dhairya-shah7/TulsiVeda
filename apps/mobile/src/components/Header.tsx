import React from 'react';
import { Leaf, Bell, ChevronLeft, User, PhoneCall, Globe } from 'lucide-react';
import { useCurrentLanguage, SUPPORTED_LANGUAGES, t } from '../services/localizationService';

interface HeaderProps {
  currentScreen: string;
  onBack?: () => void;
  title?: string;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenIvr: () => void;
  onOpenEmergency?: () => void;
  onOpenLanguagePicker?: () => void;
  unreadAlertsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentScreen, 
  onBack, 
  title,
  onOpenProfile,
  onOpenNotifications,
  onOpenIvr,
  onOpenEmergency,
  onOpenLanguagePicker,
  unreadAlertsCount = 0
}) => {
  const currentLang = useCurrentLanguage();
  const langObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const isMainHub = ['home', 'dashboard'].includes(currentScreen);

  return (
    <header className="flex items-center justify-between px-4 pt-[max(12px,env(safe-area-inset-top))] pb-3 bg-white border-b border-emerald-100/80 sticky top-0 z-40 shadow-xs">
      {/* Left side: Back or Logo */}
      <div className="flex items-center gap-2.5">
        {!isMainHub && onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 active:scale-95 transition-all py-1 px-2 rounded-xl bg-slate-50 border border-slate-200"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
            <span className="truncate max-w-[120px]">{title || t('back')}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-100">
              <Leaf className="w-5 h-5 fill-white/20 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base tracking-tight text-slate-900 leading-tight">
                {currentLang === 'hi' ? 'तुलसीवेद' : currentLang === 'gu' ? 'તુલસીવેદ' : currentLang === 'pa' ? 'ਤੁਲਸੀਵੇਦ' : currentLang === 'ta' ? 'துளசிவேத்' : currentLang === 'te' ? 'తులసివేద్' : currentLang === 'bn' ? 'তুলসীবেদ' : currentLang === 'mr' ? 'तुळशीवेद' : 'TulsiVeda'} <span className="text-emerald-700">{currentLang === 'hi' || currentLang === 'mr' ? 'एआई' : currentLang === 'gu' ? 'એઆઈ' : currentLang === 'pa' ? 'ਏਆਈ' : currentLang === 'ta' ? 'ஏஐ' : currentLang === 'te' ? 'ఏఐ' : currentLang === 'bn' ? 'এআই' : 'AI'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide">
                {currentLang === 'hi' ? 'स्वास्थ्य सारथी' : currentLang === 'gu' ? 'આરોગ્ય માર્ગદર્શક' : currentLang === 'pa' ? 'ਸਿਹਤ ਸਲਾਹਕਾਰ' : currentLang === 'ta' ? 'மருத்துவ வழிகாட்டி' : currentLang === 'te' ? 'ఆరోగ్య మార్గదర్శి' : currentLang === 'bn' ? 'স্বাস্থ্য নির্দেশিকা' : currentLang === 'mr' ? 'आरोग्य मित्र' : 'Health Advisory'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right side: Emergency SOS, Hotline button, Language trigger, Alerts, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Persistent Emergency SOS 108 button */}
        {onOpenEmergency && (
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-black shadow-sm shadow-red-500/20 transition-all border border-red-500"
            title="108"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
            <span className="tracking-tight">
              {currentLang === 'hi' ? '🚨 १०८ आपातकाल' : currentLang === 'gu' ? '🚨 ૧૦૮ ઇમરજન્સી' : currentLang === 'pa' ? '🚨 ੧੦੮ ਐਮਰਜੈਂਸੀ' : currentLang === 'ta' ? '🚨 108 அவசரம்' : currentLang === 'te' ? '🚨 108 అత్యవసరం' : currentLang === 'bn' ? '🚨 ১০৮ জরুরি' : currentLang === 'mr' ? '🚨 १०८ आपत्कालीन' : '🚨 108 SOS'}
            </span>
          </button>
        )}

        {/* Helpline simulator button */}
        <button
          onClick={onOpenIvr}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 text-xs font-bold active:scale-95 transition-all shadow-2xs"
          title="Helpline"
        >
          <PhoneCall className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          <span className="hidden sm:inline">
            {currentLang === 'hi' ? 'हेल्पलाइन' : currentLang === 'gu' ? 'હેલ્પલાઇન' : currentLang === 'pa' ? 'ਹੈਲਪਲਾਈਨ' : currentLang === 'ta' ? 'உதவி எண்' : currentLang === 'te' ? 'హెల్ప్‌లైన్' : currentLang === 'bn' ? 'হেল্পলাইন' : currentLang === 'mr' ? 'हेल्पलाइन' : 'Hotline'}
          </span>
        </button>

        {/* 1-Tap Language selector chip */}
        <button
          onClick={onOpenLanguagePicker || onOpenProfile}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-extrabold hover:bg-emerald-100 active:scale-95 transition-all shadow-2xs"
          title="Change native Indian language (1-Tap)"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-700" />
          <span className="text-xs font-black">{langObj.nativeName}</span>
        </button>

        {/* Notifications */}
        <button 
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          title="Active safety alerts & surveillance"
        >
          <Bell className="w-4 h-4 text-slate-700" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-ping" />
          )}
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* User Profile */}
        <button
          onClick={onOpenProfile}
          className="w-8 h-8 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center font-semibold text-xs shadow-sm active:scale-95 transition-transform"
          title="Profile & Settings"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
