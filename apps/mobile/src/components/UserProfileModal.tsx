import React, { useState, useEffect } from 'react';
import { 
  X, User, Stethoscope, HeartHandshake, Globe, MapPin, 
  CheckCircle2, RefreshCw, ChevronRight, Sparkles, Check, ShieldAlert
} from 'lucide-react';
import { 
  getStoredLanguage, 
  setStoredLanguage, 
  t, 
  SUPPORTED_LANGUAGES, 
  SupportedLanguage 
} from '../services/localizationService';
import { playNativeTTS } from './AudioNarrator';
import { IS_STANDALONE } from '../config/appTarget';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: 'citizen' | 'asha' | 'doctor';
  onRoleChange: (role: 'citizen' | 'asha' | 'doctor') => void;
  currentMode: 'village' | 'city';
  onModeChange: (mode: 'village' | 'city') => void;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onOpenLanguagePicker?: () => void;
  onOpenAdmin?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange,
  currentMode,
  onModeChange,
  onLanguageChange,
  onOpenLanguagePicker,
  onOpenAdmin
}) => {
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(getStoredLanguage());
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('tulsiveda_user_name') || 'Aarav Sharma');
  const [location, setLocation] = useState<string>(() => localStorage.getItem('tulsiveda_location') || 'Pune, Maharashtra');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showAllLanguages, setShowAllLanguages] = useState<boolean>(false);
  const [showDeskSwitcher, setShowDeskSwitcher] = useState<boolean>(false);

  useEffect(() => {
    setActiveLang(getStoredLanguage());
  }, [isOpen]);

  if (!isOpen) return null;

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === activeLang) || SUPPORTED_LANGUAGES[0];

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
    }, 900);
  };

  const roles = [
    {
      id: 'citizen',
      title: 'Citizen',
      nativeLabel: 'नागरिक • Patient',
      desc: 'Self & family botanical remedy safety and hospital medicine clash verification',
      icon: User,
      color: 'emerald',
      activeBorder: 'border-emerald-600 bg-emerald-50/70 text-emerald-950',
      iconBg: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'asha',
      title: 'ASHA Worker',
      nativeLabel: 'आशा कार्यकर्ता • Field Post',
      desc: 'Community health worker desk for village home remedy logging and patient review',
      icon: HeartHandshake,
      color: 'teal',
      activeBorder: 'border-teal-600 bg-teal-50/70 text-teal-950',
      iconBg: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'doctor',
      title: 'Medical Doctor',
      nativeLabel: 'चिकित्सक • Clinical Officer',
      desc: 'CDSCO allopathic prescription validation, pharmacopeia review & safety sign-off',
      icon: Stethoscope,
      color: 'blue',
      activeBorder: 'border-blue-600 bg-blue-50/70 text-blue-950',
      iconBg: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3.5 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Modern Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 text-white font-bold text-lg shadow-xs">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight leading-tight">{t('profile_title')}</h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 uppercase">
                  {currentRole}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
                Bharat Health Identity & Ecosystem Settings
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white flex items-center justify-center border border-white/20 shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 space-y-5 overflow-y-auto flex-1">
          {/* Section 1: Personal Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('personal_info_heading')}</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {t('full_name_label')}
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-slate-800 text-xs font-semibold transition-all"
                    placeholder="Enter full name..."
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {t('location_district_label')}
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-slate-800 text-xs font-semibold transition-all"
                    placeholder="e.g. Pune, Maharashtra"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Verified Professional & Health Identity (Role-Locked) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Credentials & Desk</span>
              </h3>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                ✓ ABDM Active
              </span>
            </div>

            {/* Role-Specific Credential Card (Non-switchable in profile) */}
            {currentRole === 'citizen' && (
              <div className="p-4 rounded-2xl border-2 border-emerald-500/60 bg-gradient-to-br from-emerald-50/90 to-teal-50/50 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block">Citizen Health Profile</span>
                    <span className="text-[10px] font-semibold text-emerald-800">ABHA ID: 91-8274-1029-4412 (Verified)</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug font-medium">
                  Authorizes self & family botanical remedy safety checks. Linked directly to your local PHC and assigned ASHA field worker.
                </p>
              </div>
            )}

            {currentRole === 'asha' && (
              <div className="p-4 rounded-2xl border-2 border-teal-500/60 bg-gradient-to-br from-teal-50/90 to-cyan-50/50 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block">ASHA Sangini Field Identity</span>
                    <span className="text-[10px] font-semibold text-teal-800">NHM Reg: ASH-MH-44029 • Sub-Center Post</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug font-medium">
                  Authorized for community home visits, village symptom triage, and 1-tap clinical referral escalation to the Medical Officer.
                </p>
              </div>
            )}

            {currentRole === 'doctor' && (
              <div className="p-4 rounded-2xl border-2 border-blue-500/60 bg-gradient-to-br from-blue-50/90 to-indigo-50/50 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block">Medical Officer Clinical Station</span>
                    <span className="text-[10px] font-semibold text-blue-800">NMC Reg: NMC-IND-882194 • PHC Clinician</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug font-medium">
                  Authorized for CDSCO allopathic prescription validation, pharmacopeia review, adding doctor guidance, and final clinical sign-off.
                </p>
              </div>
            )}

            {/* Dedicated Switch Workstation Modal Trigger (Only in Unified App) */}
            {!IS_STANDALONE && (
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  Switch between Citizen, ASHA or Doctor desks?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeskSwitcher(true);
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-emerald-700 underline transition-colors"
                >
                  Switch Workstation
                </button>
              </div>
            )}

            {/* Admin Command Center Quick Link */}
            {onOpenAdmin && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shadow-md border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black block text-white">National Surveillance Admin</span>
                    <span className="text-[10px] text-slate-300">Outbreak telemetry, ADR pharmacovigilance & OTA rule dispatch</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs shadow-xs transition-all shrink-0 ml-2"
                >
                  Enter
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Interface Display Mode */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              {t('ecosystem_mode_heading')}
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onModeChange('village');
                  localStorage.setItem('tulsiveda_env_mode', 'village');
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all relative ${
                  currentMode === 'village'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🌾</span>
                    <span className="font-black text-xs text-slate-900">{t('mode_village')}</span>
                  </div>
                  {currentMode === 'village' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[10.5px] text-slate-500 font-medium mt-1 leading-snug">
                  Voice guidance, large icons & simple 3-step citizen workflow.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  onModeChange('city');
                  localStorage.setItem('tulsiveda_env_mode', 'city');
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all relative ${
                  currentMode === 'city'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🏙️</span>
                    <span className="font-black text-xs text-slate-900">{t('mode_city')}</span>
                  </div>
                  {currentMode === 'city' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[10.5px] text-slate-500 font-medium mt-1 leading-snug">
                  Full clinical pharmacopeia, multi-tier generics & dense analytical data.
                </p>
              </button>
            </div>
          </div>

          {/* Section 4: Pan-India Language Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('pan_india_lang_heading')}</span>
              </h3>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                12 Languages
              </span>
            </div>

            {/* Active Language Card */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-xs text-slate-900 block leading-tight">
                    {currentLangObj.nativeName} ({currentLangObj.name})
                  </span>
                  <span className="text-[10.5px] text-slate-500 font-medium">
                    {currentLangObj.region}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenLanguagePicker) {
                    onOpenLanguagePicker();
                  } else {
                    setShowAllLanguages(prev => !prev);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-extrabold shadow-2xs hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-1"
              >
                <span>{showAllLanguages ? 'Hide' : 'Change'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Collapsible or Expanded Grid if opened inline */}
            {showAllLanguages && (
              <div className="grid grid-cols-3 gap-2 pt-1 animate-in fade-in duration-200">
                {SUPPORTED_LANGUAGES.map(lang => {
                  const isSelected = activeLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">{lang.nativeName}</div>
                      <div className={`text-[9.5px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {lang.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50/90 border-t border-slate-200/80 rounded-b-[28px] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="text-xs text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('clear_btn')}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs shadow-md transition-all flex items-center gap-2"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <span>{t('save_profile_btn')}</span>
            )}
          </button>
        </div>
        {/* Desk Switcher Overlay (For Switching Workstations) */}
        {showDeskSwitcher && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Switch Application Desk</h3>
                  <p className="text-[11px] text-slate-500">Select active workstation role</p>
                </div>
                <button 
                  onClick={() => setShowDeskSwitcher(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'citizen',
                    title: 'Citizen Desk',
                    native: 'नागरिक • Patient',
                    desc: 'Family home remedies, voice search, & BioMistral clash checks',
                    icon: User,
                    color: 'emerald',
                    btnBg: 'hover:bg-emerald-50 hover:border-emerald-500'
                  },
                  {
                    id: 'asha',
                    title: 'ASHA Field Worker',
                    native: 'आशा कार्यकर्ता • Community Post',
                    desc: 'Dual tools: Citizen search + village intake & escalate to doctor',
                    icon: HeartHandshake,
                    color: 'teal',
                    btnBg: 'hover:bg-teal-50 hover:border-teal-500'
                  },
                  {
                    id: 'doctor',
                    title: 'Medical Doctor Desk',
                    native: 'चिकित्सक • Clinical Officer',
                    desc: 'Review ASHA referrals, add notes, and sign-off clashes',
                    icon: Stethoscope,
                    color: 'blue',
                    btnBg: 'hover:bg-blue-50 hover:border-blue-500'
                  }
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = currentRole === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onRoleChange(item.id as any);
                        localStorage.setItem('tulsiveda_user_role', item.id);
                        setShowDeskSwitcher(false);
                        onClose();
                      }}
                      className={`w-full p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all ${
                        isActive 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold' 
                          : `border-slate-200 bg-white ${item.btnBg} text-slate-800`
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black">{item.title}</span>
                          <span className="text-[10px] text-slate-400">({item.native})</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowDeskSwitcher(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
