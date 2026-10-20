import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { LocalizationService, SupportedLanguage } from '../services/localizationService.ts';

export interface AudioNarratorProps {
  textToSpeak?: string;
  textToNarrate?: string; // Alias for seamless compatibility
  label?: string;
  className?: string;
  langCode?: SupportedLanguage;
}

const BCP47_LANGUAGE_MAP: Record<string, string> = {
  gu: 'gu-IN',
  hi: 'hi-IN',
  pa: 'pa-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  bn: 'bn-IN',
  or: 'or-IN',
  as: 'as-IN',
  en: 'en-IN',
};

/**
 * Native + Web TalkBack Player.
 * Speaks the text in the exact language selected by the user.
 * Prioritizes native Android TextToSpeech service for 100% natural Indic voices.
 */
export const playNativeTTS = async (text: string, langCode?: SupportedLanguage) => {
  const clean = text.replace(/[\*\#\_]/g, '').trim();
  if (!clean) return;

  const activeLang = langCode || LocalizationService.getCurrentLanguage();
  const bcp = BCP47_LANGUAGE_MAP[activeLang] || LocalizationService.getBcp47() || 'gu-IN';

  if (Capacitor.isNativePlatform()) {
    try {
      await TextToSpeech.stop();
      await TextToSpeech.speak({
        text: clean,
        lang: bcp,
        rate: 0.95,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      });
      return;
    } catch (err) {
      console.warn('[Native TTS Error, falling back to Web Speech]:', err);
    }
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = bcp;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const matchedVoice = findMatchingVoice(bcp, activeLang);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    window.speechSynthesis.speak(utterance);
  }
};

export const stopTTS = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await TextToSpeech.stop();
    } catch (e) {}
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const findMatchingVoice = (bcpTag: string, langCode: string): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetBcp = bcpTag.toLowerCase().replace('_', '-');
  const targetPrefix = langCode.toLowerCase();

  let matched = voices.find(v => {
    const l = v.lang.toLowerCase().replace('_', '-');
    return l === targetBcp;
  });
  if (matched) return matched;

  matched = voices.find(v => {
    const l = v.lang.toLowerCase().replace('_', '-');
    return l.startsWith(targetPrefix + '-') || l === targetPrefix;
  });
  if (matched) return matched;

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
    or: ['odia', 'oriyya', 'ଓડ଼ିଆ'],
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

  if (targetPrefix !== 'en') {
    const hindiVoice = voices.find(v => {
      const l = v.lang.toLowerCase().replace('_', '-');
      return l.startsWith('hi') || v.name.toLowerCase().includes('hindi');
    });
    if (hindiVoice) return hindiVoice;
  }

  return voices.find(v => v.default) || voices[0] || null;
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

  const speak = async () => {
    if (isSpeaking) {
      await stopTTS();
      setIsSpeaking(false);
      return;
    }

    const cleanText = content.replace(/[\*\#\_]/g, '').trim();
    if (!cleanText) return;

    const activeLang = langCode || LocalizationService.getCurrentLanguage();
    const bcp = BCP47_LANGUAGE_MAP[activeLang] || LocalizationService.getBcp47() || 'gu-IN';

    setIsSpeaking(true);

    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.stop();
        await TextToSpeech.speak({
          text: cleanText,
          lang: bcp,
          rate: 0.95,
          pitch: 1.0,
          volume: 1.0,
          category: 'ambient',
        });
        setIsSpeaking(false);
        return;
      } catch (err) {
        console.warn('[Native TTS Speak Error]:', err);
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
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
    } else {
      setIsSpeaking(false);
    }
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

