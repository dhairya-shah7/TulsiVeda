import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { LocalizationService, SupportedLanguage } from '../services/localizationService.ts';

export interface AudioNarratorProps {
  textToSpeak?: string;
  textToNarrate?: string; // Alias for seamless compatibility
  label?: string;
  className?: string;
}

export const playNativeTTS = (text: string, langCode?: SupportedLanguage) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/[\*\#\_]/g, '');
  const utterance = new SpeechSynthesisUtterance(clean);
  const bcp = langCode ? `${langCode}-IN` : LocalizationService.getBcp47();
  utterance.lang = bcp;
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
};

export const AudioNarrator: React.FC<AudioNarratorProps> = ({
  textToSpeak,
  textToNarrate,
  label,
  className = '',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const content = textToNarrate || textToSpeak || '';

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported on this browser/device.');
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
    utterance.lang = LocalizationService.getBcp47();
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

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
      title="Tap to listen aloud in your language (आवाज में सुनें)"
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-4 h-4 text-amber-700 animate-spin" />
          <span>{LocalizationService.t('stopAudio')}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-emerald-700" />
          <span>{label || LocalizationService.t('listenInNative')}</span>
        </>
      )}
    </button>
  );
};
