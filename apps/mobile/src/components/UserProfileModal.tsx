import React, { useState, useEffect } from 'react';
import { 
  X, User, Shield, Stethoscope, HeartHandshake, Globe, MapPin, 
  Smartphone, Award, CheckCircle2, RefreshCw, Volume2 
} from 'lucide-react';
import { 
  getStoredLanguage, 
  setStoredLanguage, 
  t, 
  SUPPORTED_LANGUAGES, 
  SupportedLanguage 
} from '../services/localizationService';
import { playNativeTTS } from './AudioNarrator';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: 'citizen' | 'asha' | 'doctor';
  onRoleChange: (role: 'citizen' | 'asha' | 'doctor') => void;
  currentMode: 'village' | 'city';
  onModeChange: (mode: 'village' | 'city') => void;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange,
  currentMode,
  onModeChange,
  onLanguageChange
}) => {
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(getStoredLanguage());
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('tulsiveda_user_name') || 'Aarav Sharma');
  const [location, setLocation] = useState<string>(() => localStorage.getItem('tulsiveda_location') || 'Pune, Maharashtra');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    setActiveLang(getStoredLanguage());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLanguageSelect = (code: SupportedLanguage) => {
    setActiveLang(code);
    setStoredLanguage(code);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (langObj) {
      playNativeTTS(t('language_selected'), code);
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem('tulsiveda_user_name', userName);
    localStorage.setItem('tulsiveda_location', location);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-emerald-100 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-t-3xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{t('profile_title')}</h2>
              <p className="text-xs text-emerald-100 font-medium">Bharat Health Identity & Ecosystem Role</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Identity Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Personal Information
            </h3>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Full Name / नागरिक का नाम</label>
              <div className="relative">
                <input 
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 text-sm font-medium"
                  placeholder="Enter name..."
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Location / District / राज्य व जिला</label>
              <div className="relative">
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 text-sm font-medium"
                  placeholder="e.g. Pune, Maharashtra / Sitapur, UP"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>
          </div>

          {/* User Role Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Operating Role / भूमिका
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold uppercase">
                Active: {currentRole}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'citizen', label: 'Citizen', sub: 'Patient / नागरिक', icon: User, color: 'border-blue-500 bg-blue-50/50 text-blue-900' },
                { id: 'asha', label: 'ASHA Worker', sub: 'Field / संगिनी', icon: HeartHandshake, color: 'border-emerald-500 bg-emerald-50/50 text-emerald-900' },
                { id: 'doctor', label: 'Doctor', sub: 'Clinician / चिकित्सक', icon: Stethoscope, color: 'border-purple-500 bg-purple-50/50 text-purple-900' }
              ].map(role => {
                const Icon = role.icon;
                const isSelected = currentRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      onRoleChange(role.id as any);
                      localStorage.setItem('tulsiveda_user_role', role.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      isSelected 
                        ? `${role.color} border-2 shadow-sm scale-[1.02]` 
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                      <span className="font-bold text-xs">{role.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-tight">{role.sub}</p>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute top-2 right-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Operating Context Switcher (Village vs City) */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Ecosystem Interface Mode
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onModeChange('village');
                  localStorage.setItem('tulsiveda_env_mode', 'village');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  currentMode === 'village'
                    ? 'border-emerald-600 bg-emerald-50/80 border-2 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                  <span className="text-base">🌾</span>
                  <span>{t('mode_village')}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight">
                  Audio-first guidance, large tap targets, high contrast, offline sync.
                </p>
              </button>

              <button
                onClick={() => {
                  onModeChange('city');
                  localStorage.setItem('tulsiveda_env_mode', 'city');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  currentMode === 'city'
                    ? 'border-emerald-600 bg-emerald-50/80 border-2 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                  <span className="text-base">🏙️</span>
                  <span>{t('mode_city')}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight">
                  Advanced pharmacopeia, multi-tier generic substitutions, dense analytical data.
                </p>
              </button>
            </div>
          </div>

          {/* Pan-India 12 Languages Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Pan-India Language ({SUPPORTED_LANGUAGES.length} Languages)
              </h3>
              <Globe className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {SUPPORTED_LANGUAGES.map(lang => {
                const isSelected = activeLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{lang.nativeName}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {lang.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex items-center justify-between">
          <button
            onClick={() => {
              // Quick reset
              localStorage.clear();
              window.location.reload();
            }}
            className="text-xs text-slate-500 hover:text-red-600 font-medium flex items-center gap-1.5 px-3 py-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Data
          </button>

          <button
            onClick={handleSaveProfile}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Saved Successfully!
              </>
            ) : (
              'Save & Apply'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
