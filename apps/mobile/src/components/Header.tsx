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
                TulsiVeda <span className="text-emerald-700">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide">
                Bharat Health Engine
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right side: Hotline button, Language trigger, Alerts, Profile */}
      <div className="flex items-center gap-2">
        {/* Nokia / Feature Phone Hotline Simulator button */}
        <button
          onClick={onOpenIvr}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 text-xs font-bold active:scale-95 transition-all shadow-2xs"
          title="1800-TULSIVEDA Voice Hotline for Keypad/Rural Users"
        >
          <PhoneCall className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          <span className="hidden sm:inline">1800 IVR</span>
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
