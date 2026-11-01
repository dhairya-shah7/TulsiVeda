import React from 'react';
import { Leaf, Bell, ChevronLeft, User, PhoneCall, Globe } from 'lucide-react';
import { useCurrentLanguage, SUPPORTED_LANGUAGES, t } from '../services/localizationService';
import tulsiLogo from '../assets/tulsi-logo.png';

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

  // Compact brand name based on language
  const brandName = 
    currentLang === 'hi' ? 'तुलसीवेद' : 
    currentLang === 'gu' ? 'તુલસીવેદ' : 
    currentLang === 'pa' ? 'ਤੁਲਸੀਵੇਦ' : 
    currentLang === 'ta' ? 'துளசிவேத்' : 
    currentLang === 'te' ? 'తులసివేద్' : 
    currentLang === 'bn' ? 'তুলসীবেদ' : 
    currentLang === 'mr' ? 'तुळशीवेद' : 
    'TulsiVeda';

  // Compact display for language button (e.g. "বাংলা", "हिन्दी", "English")
  const shortLangLabel = langObj.nativeName.split(' ')[0];

  return (
    <header className="flex items-center justify-between px-3.5 pt-[max(10px,env(safe-area-inset-top))] pb-2.5 bg-white border-b border-emerald-100/90 sticky top-0 z-40 shadow-xs">
      {/* Left side: Back or Clean Brand Lockup */}
      <div className="flex items-center gap-2 shrink-0 min-w-0">
        {!isMainHub && onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-700 active:scale-95 transition-all py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700 shrink-0" />
            <span className="truncate max-w-[120px]">{title || t('back')}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <img 
              src={tulsiLogo} 
              alt="TulsiVeda AI Logo" 
              className="w-8 h-8 rounded-xl object-contain shadow-xs shrink-0 ring-1 ring-emerald-200/80 drop-shadow-xs" 
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 font-heading font-black text-sm tracking-tight text-slate-900 leading-none">
                <span>{brandName}</span>
                <span className="text-[10px] px-1 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-extrabold uppercase tracking-wide">
                  AI
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right side: Sleek, uncrowded utility controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Persistent Emergency SOS 108 button - Compact, high contrast */}
        {onOpenEmergency && (
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[11px] font-black shadow-xs shadow-red-500/20 transition-all border border-red-500 shrink-0"
            title="108 Emergency Helpline"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping shrink-0" />
            <span className="tracking-tight whitespace-nowrap">🚨 108</span>
          </button>
        )}

        {/* 1-Tap Language selector chip - Clean, compact, truncated */}
        <button
          onClick={onOpenLanguagePicker || onOpenProfile}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold active:scale-95 transition-all shrink-0 max-w-[85px] sm:max-w-none"
          title="Change language"
        >
          <Globe className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="truncate">{shortLangLabel}</span>
        </button>

        {/* Helpline Button (Shown on tablets/desktops, available in profile on mobile) */}
        <button
          onClick={onOpenIvr}
          className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 text-[11px] font-bold active:scale-95 transition-all shrink-0"
          title="Helpline Hotline"
        >
          <PhoneCall className="w-3 h-3 text-amber-700" />
          <span>Hotline</span>
        </button>

        {/* Notifications (Shown on wider screens) */}
        <button 
          onClick={onOpenNotifications}
          className="hidden sm:flex relative p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors shrink-0"
          title="Safety alerts"
        >
          <Bell className="w-4 h-4 text-slate-700" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* User Profile / Menu Trigger */}
        <button
          onClick={onOpenProfile}
          className="w-7 h-7 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs active:scale-95 transition-transform shrink-0 ring-1 ring-emerald-600"
          title="Profile & Settings"
        >
          <User className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
