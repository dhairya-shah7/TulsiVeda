import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { LocalizationService, SupportedLanguage } from '../services/localizationService.ts';

export interface AudioNarratorProps {
  textToSpeak?: string;
  textToNarrate?: string; // Alias for seamless compatibility
  label?: string;
  className?: string;
  langCode?: SupportedLanguage;
}

/**
 * Finds the best matching TTS voice for a given BCP-47 tag or language code.
 * Ensures that Android / iOS WebViews do not fall back to English when an Indian voice is available.
 */
export const findMatchingVoice = (bcpTag: string, langCode: string): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetBcp = bcpTag.toLowerCase().replace('_', '-');
  const targetPrefix = langCode.toLowerCase();

  // 1. Exact BCP-47 tag match (e.g. "gu-in", "hi-in", "pa-in")
  let matched = voices.find(v => {
    const l = v.lang.toLowerCase().replace('_', '-');
    return l === targetBcp;
  });
  if (matched) return matched;

  // 2. Language prefix match (e.g. "gu", "pa", "hi", "mr", "ta", "te", etc.)
  matched = voices.find(v => {
    const l = v.lang.toLowerCase().replace('_', '-');
    return l.startsWith(targetPrefix + '-') || l === targetPrefix;
  });
  if (matched) return matched;

  // 3. Voice Name search (e.g. Google ગુજરાતી, Google हिन्दी, etc.)
  const langNameMap: Record<string, string[]> = {
    hi: ['hindi', 'हिन्दी'],
    gu: ['gujarati', 'ગુજરાતી'],
    pa: ['punjabi', 'ਪੰਜਾਬੀ'],
    mr: ['marathi', 'मराठी'],
    ta: ['tamil', 'தமிழ்'],
    te: ['telugu', 'తెలుగు'],
    kn: ['kannada', 'ಕನ್ನಡ'],
    ml: ['malayalam', 'മലയാളം'],
    bn: ['bengali', 'বাংলা'],
    or: ['odia', 'oriyya', 'ଓଡ଼ିଆ'],
    as: ['assamese', 'অসমীয়া'],
    en: ['indian english', 'india', 'en-in'],
  };

  const keywords = langNameMap[targetPrefix] || [];
  if (keywords.length > 0) {
    matched = voices.find(v => {
      const name = v.name.toLowerCase();
      return keywords.some(k => name.includes(k.toLowerCase()));
    });
    if (matched) return matched;
  }

  // 4. Secondary fallback for Indic languages: Hindi voice can pronounce Indic phonemes
  if (targetPrefix !== 'en') {
    const hindiVoice = voices.find(v => {
      const l = v.lang.toLowerCase().replace('_', '-');
      return l.startsWith('hi') || v.name.toLowerCase().includes('hindi');
    });
    if (hindiVoice) return hindiVoice;
  }

  // 5. Default system voice
  return voices.find(v => v.default) || voices[0] || null;
};

export const playNativeTTS = (text: string, langCode?: SupportedLanguage) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const clean = text.replace(/[\*\#\_]/g, '');
  const utterance = new SpeechSynthesisUtterance(clean);
  const activeLang = langCode || LocalizationService.getCurrentLanguage();
  const bcp = langCode ? `${langCode}-IN` : LocalizationService.getBcp47();
  
  utterance.lang = bcp;
  utterance.rate = 0.92;
  utterance.pitch = 1.0;

  const matchedVoice = findMatchingVoice(bcp, activeLang);
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const AudioNarrator: React.FC<AudioNarratorProps> = ({
  textToSpeak,
  textToNarrate,
  label,
  className = '',
  langCode,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const content = textToNarrate || textToSpeak || '';

  // Pre-load voices on component mount for instant response
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      };
    }
  }, []);

  const speak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported on this device.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = content.replace(/[\*\#\_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const activeLang = langCode || LocalizationService.getCurrentLanguage();
    const bcp = langCode ? `${langCode}-IN` : LocalizationService.getBcp47();

    utterance.lang = bcp;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const matchedVoice = findMatchingVoice(bcp, activeLang);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={speak}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
        isSpeaking
          ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
          : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
      } ${className}`}
      title="Tap to listen aloud in your language"
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-4 h-4 text-amber-700 animate-spin" />
          <span>{LocalizationService.t('stop_audio')}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-emerald-700" />
          {label !== undefined && label !== '' ? (
            <span>{label}</span>
          ) : label === '' ? null : (
            <span>{LocalizationService.t('listen_native')}</span>
          )}
        </>
      )}
    </button>
  );
};

