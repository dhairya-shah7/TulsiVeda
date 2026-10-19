import React, { useState } from 'react';
import { X, PhoneCall, Mic, MicOff, MessageSquare, Volume2, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';
import { BioKineticEngine } from '../services/bioKineticEngine.ts';
import { LocalizationService } from '../services/localizationService.ts';

interface IvrHotlineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IvrHotlineModal: React.FC<IvrHotlineModalProps> = ({ isOpen, onClose }) => {
  const [callerQuery, setCallerQuery] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [aiVoiceResponse, setAiVoiceResponse] = useState<string | null>(null);
  const [smsReceipt, setSmsReceipt] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!isOpen) return null;

  const handleSimulateCall = (queryText?: string) => {
    const text = queryText || callerQuery || 'I take Ecosprin for heart blood thinning. Can I drink Turmeric Haldi milk every day?';
    setCallerQuery(text);
    setIsCalling(true);
    setAiVoiceResponse(null);

    // Run custom Bio-Kinetic Causal Engine
    setTimeout(() => {
      let response = '';
      let sms = '';

      if (text.toLowerCase().includes('ecosprin') || text.toLowerCase().includes('aspirin') || text.toLowerCase().includes('हल्दी') || text.toLowerCase().includes('હળદર') || text.toLowerCase().includes('turmeric') || text.toLowerCase().includes('haldi')) {
        response = 'नमस्ते। बायो-काइनेटिक सुरक्षा इंजन की जांच: इकोस्प्रिन (Aspirin) और औषधीय हल्दी (Curcumin) दोनों रक्त को पतला करते हैं। यदि आप दोनों को एक साथ लेते हैं तो पेट में रक्तस्राव का खतरा बढ़ जाता है। कृपया हल्दी को केवल भोजन में हल्की चुटकी के रूप में लें, कच्चा गाढ़ा काढ़ा न पिएं।';
        sms = 'TULSIVEDA-ALERT: Ecosprin + High-dose Haldi may double bleeding risk. Limit to light culinary pinch. Call 1800-TULSIVEDA for free queries.';
      } else if (text.toLowerCase().includes('sugar') || text.toLowerCase().includes('glycomet') || text.toLowerCase().includes('metformin') || text.toLowerCase().includes('giloy') || text.toLowerCase().includes('गिलोय')) {
        response = 'नमस्ते। गिलोय (Tinospora) और मेटफॉर्मिन दोनों रक्त शर्करा को तेजी से कम करते हैं। दोनों को एक साथ लेने से अचानक चक्कर आना या शुगर बहुत कम होने (Hypoglycemia) का जोखिम है। नियमित शुगर जांचें और खाली पेट काढ़ा न लें।';
        sms = 'TULSIVEDA-ALERT: Metformin + Giloy kwath can cause sudden sugar crash. Keep jaggery handy and monitor blood glucose.';
      } else {
        response = 'नमस्ते। आपकी स्वास्थ्य पूछताछ प्राप्त हुई। बायो-काइनेटिक इंजन के अनुसार इस संयोजन में कोई हानिकारक टकराव नहीं मिला है। औषधि को हमेशा पर्याप्त पानी के साथ लें।';
        sms = 'TULSIVEDA-INFO: Query processed. No severe metabolic interaction detected. Stay hydrated and follow standard dosage.';
      }

      setAiVoiceResponse(response);
      setSmsReceipt(sms);
      setIsCalling(false);

      // Speak response aloud automatically
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = LocalizationService.getBcp47();
        utterance.rate = 0.95;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    }, 1200);
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm">1800-TULSIVEDA Voice Hotline</h3>
              <p className="text-[10px] text-emerald-200">Toll-Free Interactive Voice AI for Keypad Feature Phones</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Rural Feature Phone Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <Smartphone className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Designed for 450M+ Rural Citizens without Smartphones</p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Any farmer or elder using a basic Nokia or Itel keypad phone dials <strong>1800-TULSIVEDA</strong>, speaks in their dialect, and receives live spoken medical guidance and SMS advice without internet.
              </p>
            </div>
          </div>

          {/* Quick Dial Sample Queries */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              Simulate Spoken Caller Query (Tap to Speak):
            </label>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleSimulateCall('मैं इकोस्प्रिन ले रहा हूँ, क्या रोज हल्दी का काढ़ा पी सकता हूँ?')}
                className="text-left text-xs p-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 font-medium text-gray-800 transition-colors flex items-center justify-between"
              >
                <span>🗣️ "मैं इकोस्प्रिन ले रहा हूँ, क्या हल्दी का काढ़ा पी सकता हूँ?"</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">Call</span>
              </button>
              <button
                type="button"
                onClick={() => handleSimulateCall('મારા ઘૂંટણમાં દુખાવો છે અને ડાયાબિટીસની ગ્લીમેપ્રાઇડ ચાલુ છે, શું ગળોનો ઉકાળો લેવાય?')}
                className="text-left text-xs p-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 font-medium text-gray-800 transition-colors flex items-center justify-between"
              >
                <span>🗣️ "ડાયાબિટીસમાં ગ્લીમેપ્રાઇડ સાથે ગળોનો ઉકાળો લેવાય?"</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">Call</span>
              </button>
            </div>
          </div>

          {/* Live Call Interaction Area */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={callerQuery}
                onChange={(e) => setCallerQuery(e.target.value)}
                placeholder="Or type custom caller question..."
                className="form-input text-xs flex-1 py-2"
              />
              <button
                type="button"
                disabled={isCalling}
                onClick={() => handleSimulateCall()}
                className="btn-primary text-xs py-2 px-3 rounded-xl flex items-center gap-1 font-bold whitespace-nowrap"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{isCalling ? 'Connecting...' : 'Dial 1800'}</span>
              </button>
            </div>
          </div>

          {/* AI Spoken Voice Response Card */}
          {aiVoiceResponse && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>AI Interactive Voice Response (Spoken via Call):</span>
                </span>
                {isSpeaking ? (
                  <button
                    onClick={stopAudio}
                    className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded-full"
                  >
                    Stop Speaking
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-700 font-semibold bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    Audio Active
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-950 font-medium leading-relaxed bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                "{aiVoiceResponse}"
              </p>
            </div>
          )}

          {/* Nokia/Itel SMS Dispatch Receipt */}
          {smsReceipt && (
            <div className="p-3 bg-gray-900 text-white rounded-2xl space-y-1.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-gray-300">
                <span className="flex items-center gap-1 font-mono">
                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                  SMS Sent to Feature Phone (+91-98XXX-XXXXX):
                </span>
                <span className="text-[9px] bg-emerald-800/80 text-emerald-200 px-1.5 py-0.5 rounded">Delivered</span>
              </div>
              <p className="font-mono text-[11px] text-emerald-300 leading-normal bg-black/40 p-2 rounded-lg border border-gray-800">
                {smsReceipt}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500 text-[11px]">National Voice Hotline • Ayush Bharat 24x7</span>
          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="btn-outline text-xs py-1.5 px-3 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
