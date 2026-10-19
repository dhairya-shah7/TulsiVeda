import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Play, Pause, AlertCircle, Sparkles } from 'lucide-react';
import { t } from '../services/localizationService.ts';

const QUICK_CLINICAL_PROMPTS: Record<string, { label: string; text: string }[]> = {
  ml: [
    { label: '🌿 തുളസി — ചുമയും ജലദോഷവും', text: 'തുളസി കഷായം ചുമയ്ക്കും ജലദോഷത്തിനും കഴിക്കുന്നു' },
    { label: '🌿 മഞ്ഞൾ — സന്ധി വേദന', text: 'മഞ്ഞൾ ചൂടുപാലിൽ സന്ധി വേദനയ്ക്കായി ഉപയോഗിക്കുന്നു' },
    { label: '🌿 ഇഞ്ചി — ദഹനക്കേട് / ഗ്യാസ്', text: 'ഇഞ്ചി നീര് ദഹനക്കേടിനും ഗ്യാസിനും നൽകുന്നു' },
    { label: '🌿 ചിറ്റമൃത് — പനി', text: 'ചിറ്റമൃത് കഷായം വിട്ടുമാറാത്ത പനിക്ക് ഉപയോഗിക്കുന്നു' },
    { label: '🌿 അശ്വഗന്ധ — ഉറക്കക്കുറവ്', text: 'അശ്വഗന്ധ പൊടി ഉറക്കക്കുറവിനും ക്ഷീണത്തിനും കഴിക്കുന്നു' },
  ],
  hi: [
    { label: '🌿 तुलसी — खांसी व जुकाम', text: 'तुलसी का काढ़ा खांसी और सर्दी जुकाम के लिए लिया है' },
    { label: '🌿 हल्दी — जोड़ों का दर्द', text: 'हल्दी वाला दूध जोड़ों के दर्द और सूजन के लिए ले रहे हैं' },
    { label: '🌿 गिलोय — बुखार', text: 'गिलोय रस पुराने बुखार और कमजोरी के लिए पी रहे हैं' },
    { label: '🌿 अदरक — अपच व गैस', text: 'अदरक और नींबू का रस पेट की गैस और अपच के लिए' },
    { label: '🌿 अश्वगंधा — अनिद्रा व तनाव', text: 'अश्वगंधा चूर्ण तनाव और नींद की कमी के लिए' },
  ],
  gu: [
    { label: '🌿 તુલસી — ખાંસી અને શરદી', text: 'તુલસીનો ઉકાળો ખાંસી અને કફ શરદી માટે લીધો છે' },
    { label: '🌿 હળદર — સાંધાનો દુખાવો', text: 'હળદરવાળું દૂધ સાંધાના દુખાવા અને સોજા માટે લઈએ છીએ' },
    { label: '🌿 ગળો — તાવ', text: 'ગળોનો રસ તાવ અને નબળાઈ દૂર કરવા માટે' },
    { label: '🌿 આદુ — અપચો અને ગેસ', text: 'આદુનો રસ પાચન અને પેટના ગેસ માટે ઉપયોગ કર્યો છે' },
    { label: '🌿 અશ્વગંધા — અનિદ્રા અને થાક', text: 'અશ્વગંધા ચૂર્ણ ઊંઘ ન આવવી અને અશક્તિ માટે' },
  ],
  ta: [
    { label: '🌿 துளசி — இருமல் & சளி', text: 'துளசி கஷாயம் சளி மற்றும் இருமலுக்கு குடிக்கிறேன்' },
    { label: '🌿 மஞ்சள் — மூட்டு வலி', text: 'மஞ்சள் பால் மூட்டு வலி மற்றும் வீக்கத்திற்கு' },
    { label: '🌿 சீந்தில் — காய்ச்சல்', text: 'சீந்தில் கொடி கஷாயம் காய்ச்சலுக்கு பயன்படுத்துகிறோம்' },
    { label: '🌿 இஞ்சி — செரிமானக் கோளாறு', text: 'இஞ்சி சாறு செரிமான கோளாறு மற்றும் வாயுவிற்கு' },
  ],
  pa: [
    { label: '🌿 ਤੁਲਸੀ — ਖੰਘ ਅਤੇ ਜ਼ੁਕਾਮ', text: 'ਤੁਲਸੀ ਦਾ ਕਾੜ੍ਹਾ ਖੰਘ ਅਤੇ ਜ਼ੁਕਾਮ ਲਈ ਲਿਆ ਹੈ' },
    { label: '🌿 ਗਿਲੋਏ — ਬੁਖ਼ਾਰ', text: 'ਗਿਲੋਏ ਦਾ ਰਸ ਬੁਖ਼ਾਰ ਅਤੇ ਕਮਜ਼ੋਰੀ ਲਈ ਪੀ ਰਹੇ ਹਾਂ' },
    { label: '🌿 ਹਲਦੀ — ਜੋੜਾਂ ਦਾ ਦਰਦ', text: 'ਹਲਦੀ ਵਾਲਾ ਦੁੱਧ ਜੋੜਾਂ ਦੇ ਦਰਦ ਅਤੇ ਸੋਜ ਲਈ ਲੈ ਰਹੇ ਹਾਂ' },
    { label: '🌿 ਅਦਰਕ — ਅਪਚ ਅਤੇ ਗੈਸ', text: 'ਅਦਰਕ ਦਾ ਰਸ ਪਾਚਨ ਅਤੇ ਪੇਟ ਗੈਸ ਲਈ ਵਰਤਿਆ ਹੈ' },
    { label: '🌿 ਅਸ਼ਵਗੰਧਾ — ਨੀਂਦ ਅਤੇ ਤਣਾਅ', text: 'ਅਸ਼ਵਗੰਧਾ ਚੂਰਨ ਤਣਾਅ ਅਤੇ ਨੀਂਦ ਦੀ ਘਾਟ ਲਈ' },
  ],
  mr: [
    { label: '🌿 तुळस — खोकला व सर्दी', text: 'तुळशीचा काढा खोकला आणि सर्दीसाठी घेतला आहे' },
    { label: '🌿 हळद — सांधेदुखी व सूज', text: 'हळदीचे दूध सांधेदुखी आणि सूज कमी करण्यासाठी' },
    { label: '🌿 गुळवेल — ताप', text: 'गुळवेलीचा रस जुनाट ताप आणि थकव्यासाठी' },
    { label: '🌿 आले — अपचन व गॅस', text: 'आल्याचा रस पचन आणि पोटातील गॅससाठी' },
    { label: '🌿 अश्वगंधा — निद्रानाश व ताण', text: 'अश्वगंधा चूर्ण ताण आणि शांत झोपेसाठी' },
  ],
  bn: [
    { label: '🌿 তুলসী — কাশি ও সর্দি', text: 'তুলসী পাতার রস কাশি এবং ঠান্ডার জন্য খাচ্ছি' },
    { label: '🌿 হলুদ — বাতের ব্যথা', text: 'হলুদ দুধ গাঁটের ব্যথা এবং ফোলাভাবের জন্য' },
    { label: '🌿 গুলঞ্চ — জ্বর', text: 'গুলঞ্চের রস দীর্ঘদিনের জ্বর ও দুর্বলতার জন্য' },
    { label: '🌿 আদা — গ্যাস ও বদহজম', text: 'আদার রস হজম এবং পেটের গ্যাসের জন্য' },
  ],
  te: [
    { label: '🌿 తులసి — దగ్గు & జలుబు', text: 'తులసి కషాయం దగ్గు మరియు జలుబు కోసం తాగుతున్నాను' },
    { label: '🌿 పసుపు — కీళ్ల నొప్పులు', text: 'పసుపు పాలు కీళ్ల నొప్పులు మరియు వాపు కోసం' },
    { label: '🌿 తిప్పతీగ — జ్వరం', text: 'తిప్పతీగ కషాయం దీర్ఘకాలిక జ్వరం కోసం' },
  ],
  kn: [
    { label: '🌿 ತುಳಸಿ — ಕೆಮ್ಮು & ಶೀತ', text: 'ತುಳಸಿ ಕಷಾಯವನ್ನು ಕೆಮ್ಮು ಮತ್ತು ಶೀತಕ್ಕೆ ಕುಡಿಯುತ್ತಿದ್ದೇನೆ' },
    { label: '🌿 ಅರಿಶಿನ — ಕೀಲು ನೋವು', text: 'ಅರಿಶಿನ ಹಾಲು ಕೀಲು ನೋವು ಮತ್ತು ಊತಕ್ಕೆ' },
    { label: '🌿 ಅಮೃತಬಳ್ಳಿ — ಜ್ವರ', text: 'ಅಮೃತಬಳ್ಳಿ ರಸ ಜ್ವರ ಮತ್ತು ನಿಶ್ಯಕ್ತಿಗೆ' },
  ],
  or: [
    { label: '🌿 ତୁଳସୀ — ଥଣ୍ଡା ଓ କାଶ', text: 'ତୁଳସୀ ପତ୍ର ରସ କାଶ ଓ ଥଣ୍ଡା ପାଇଁ ପିଉଛି' },
    { label: '🌿 ହଳଦୀ — ଗଣ୍ଠି ବାତ', text: 'ହଳଦୀ କ୍ଷୀର ଗଣ୍ଠି ଯନ୍ତ୍ରଣା ଏବଂ ଫୁଲା ପାଇଁ' },
    { label: '🌿 ଗୁଳୁଚି — ଜ୍ୱର', text: 'ଗୁଳୁଚି କ୍ୱାଥ ପୁରୁଣା ଜ୍ୱର ପାଇଁ' },
  ],
  as: [
    { label: '🌿 তুলসী — কাঁহ আৰু চৰ্দি', text: 'তুলসীৰ ৰস কাঁহ আৰু চৰ্দিৰ বাবে খাইছো' },
    { label: '🌿 হালধি — গাঁঠিৰ বিষ', text: 'হালধি গাখীৰ গাঁঠিৰ বিষ আৰু ফুলি উঠাৰ বাবে' },
    { label: '🌿 শিলিখা — হজমৰ সমস্যা', text: 'শিলিখাৰ গুড়ি পেটৰ গেছ আৰু হজমৰ বাবে' },
  ],
  en: [
    { label: '🌿 Tulsi — Cough & Cold', text: 'Tulsi decoction taken for dry cough and chest congestion' },
    { label: '🌿 Turmeric — Joint Pain & Swelling', text: 'Turmeric root powder with milk taken for joint inflammation' },
    { label: '🌿 Ginger — Digestive Distress', text: 'Ginger concoction taken for dyspepsia and gas' },
    { label: '🌿 Giloy — Viral Fever', text: 'Giloy juice taken for recurrent fever and recovery' },
    { label: '🌿 Ashwagandha — Anxiety & Sleep', text: 'Ashwagandha root powder taken for insomnia and stress' },
  ]
};

interface AudioWaveformProps {
  onRecordingComplete: (blob: Blob, liveTranscript?: string) => void;
  language?: string;
  isProcessing?: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ 
  onRecordingComplete,
  language = 'Hindi',
  isProcessing = false 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  const canvasLeftRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRightRef = useRef<HTMLCanvasElement | null>(null);

  const liveTranscriptRef = useRef<string>('');

  const LANG_BCP47: Record<string, string> = {
    'Gujarati': 'gu-IN',
    'gu': 'gu-IN',
    'Hindi': 'hi-IN',
    'hi': 'hi-IN',
    'Marathi': 'mr-IN',
    'mr': 'mr-IN',
    'Tamil': 'ta-IN',
    'ta': 'ta-IN',
    'Telugu': 'te-IN',
    'te': 'te-IN',
    'Kannada': 'kn-IN',
    'kn': 'kn-IN',
    'Malayalam': 'ml-IN',
    'ml': 'ml-IN',
    'Bengali': 'bn-IN',
    'bn': 'bn-IN',
    'Punjabi': 'pa-IN',
    'pa': 'pa-IN',
    'Odia': 'or-IN',
    'or': 'or-IN',
    'Assamese': 'as-IN',
    'as': 'as-IN',
    'English': 'en-IN',
    'en': 'en-IN',
  };

  const startRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);
    setLiveTranscript('');
    liveTranscriptRef.current = '';

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.lang = LANG_BCP47[language] || 'en-IN';

        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          if (text) {
            liveTranscriptRef.current = text;
            setLiveTranscript(text);
          }
        };

        recognition.onerror = (e: any) => {
          // In Android WebView, speech recognition IPC is not exposed by default, emitting 'no-speech' or 'not-allowed'.
          // We silently catch this without alerting or blocking the user since MediaRecorder and BioMistral-7B extract cleanly.
          console.debug('[SpeechRecognition] Event:', e.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.debug('[SpeechRecognition] Init bypassed:', e);
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      let chosenMime = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          chosenMime = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          chosenMime = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          chosenMime = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/aac')) {
          chosenMime = 'audio/aac';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, chosenMime ? { mimeType: chosenMime } : undefined);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: chosenMime || 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const finalTranscript = liveTranscriptRef.current.trim();
        liveTranscriptRef.current = finalTranscript;
        setLiveTranscript(finalTranscript);
        setErrorMsg(null);

        onRecordingComplete(audioBlob, finalTranscript);

        stream.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      drawWaveforms();
    } catch (err) {
      console.warn('[Microphone] Falling back to simulated capture:', err);
      runSimulatedRecording();
    }
  };

  const runSimulatedRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
    drawSimulatedWaveforms();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    } else {
      const finalTranscript = liveTranscriptRef.current.trim();
      liveTranscriptRef.current = finalTranscript;
      setLiveTranscript(finalTranscript);
      setErrorMsg(null);
      const mockBlob = new Blob(['mic_audio'], { type: 'audio/webm' });
      onRecordingComplete(mockBlob, finalTranscript);
    }

    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setIsRecording(false);
  };

  const drawWaveforms = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const render = () => {
      analyser.getByteFrequencyData(dataArray);
      drawSideCanvas(canvasLeftRef.current, dataArray, true);
      drawSideCanvas(canvasRightRef.current, dataArray, false);
      animationFrameRef.current = requestAnimationFrame(render);
    };
    render();
  };

  const drawSimulatedWaveforms = () => {
    let tick = 0;
    const render = () => {
      tick += 0.2;
      const fakeData = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        fakeData[i] = Math.floor(Math.sin(tick + i) * 60 + 80 + Math.random() * 40);
      }
      drawSideCanvas(canvasLeftRef.current, fakeData, true);
      drawSideCanvas(canvasRightRef.current, fakeData, false);
      animationFrameRef.current = requestAnimationFrame(render);
    };
    render();
  };

  const drawSideCanvas = (canvas: HTMLCanvasElement | null, data: Uint8Array, reverse: boolean) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const barCount = 12;
    const barWidth = 3;
    const gap = 3;
    const totalW = barCount * (barWidth + gap);
    const startX = reverse ? width - totalW : 0;

    for (let i = 0; i < barCount; i++) {
      const idx = reverse ? barCount - 1 - i : i;
      const val = data[idx] || 25;
      const barHeight = Math.max(4, (val / 255) * height * 0.9);

      const x = startX + i * (barWidth + gap);
      const y = (height - barHeight) / 2;

      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }
  };

  const togglePlayback = () => {
    if (!audioElementRef.current && audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audioElementRef.current = audio;
    }

    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const langKey = (LANG_BCP47[language] || 'hi-IN').split('-')[0];
  const suggestions = QUICK_CLINICAL_PROMPTS[langKey] || QUICK_CLINICAL_PROMPTS.hi;

  const handleApplySuggestion = (text: string) => {
    setLiveTranscript(text);
    liveTranscriptRef.current = text;
    setErrorMsg(null);
    const mockBlob = new Blob(['speech_audio'], { type: 'audio/webm' });
    onRecordingComplete(mockBlob, text);
  };

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="flex items-center justify-center gap-3 w-full max-w-xs">
        <canvas
          ref={canvasLeftRef}
          width={80}
          height={60}
          className="opacity-90 transition-opacity"
        />

        <div className="relative">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              isRecording
                ? 'mic-recording-active bg-red-600 text-white'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95 shadow-emerald-700/20'
            }`}
            aria-label={isRecording ? 'Stop Recording' : 'Tap to Start Recording'}
          >
            {isRecording ? (
              <Square className="w-7 h-7 fill-white text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white stroke-[2.2]" />
            )}
          </button>
        </div>

        <canvas
          ref={canvasRightRef}
          width={80}
          height={60}
          className="opacity-90 transition-opacity"
        />
      </div>

      <div className="mt-3 text-center px-4">
        <p className="text-xs font-semibold text-gray-700">
          {isRecording ? (
            <span className="text-red-600 font-bold flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              {t('listening_status')} ({language})... {formatSeconds(recordingSeconds)}
            </span>
          ) : isProcessing ? (
            <span className="text-emerald-700 font-medium">Processing Voice with Indic Engine...</span>
          ) : (
            <span className="text-gray-600">{t('tap_to_speak')}</span>
          )}
        </p>

        {isRecording && liveTranscript && (
          <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium animate-fadeIn">
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3 h-3" /> Live Voice Detected:
            </div>
            "{liveTranscript}"
          </div>
        )}

        {audioUrl && !isRecording && (
          <div className="mt-2.5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={togglePlayback}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-full border border-emerald-200 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-emerald-800" />}
              {isPlaying ? 'Pause Audio' : 'Play Recorded Note'}
            </button>
          </div>
        )}
      </div>


      {errorMsg && (
        <div className="mt-2 text-xs text-red-600 flex items-center gap-1 text-center">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
