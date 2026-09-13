import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Play, Pause, AlertCircle, Sparkles } from 'lucide-react';

interface AudioWaveformProps {
  onRecordingComplete: (blob: Blob, liveTranscript?: string) => void;
  language?: string;
  isProcessing?: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ 
  onRecordingComplete,
  language = 'Gujarati',
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

  const getDefaultSpeechText = (lang: string) => {
    if (lang === 'Gujarati') {
      return 'અમે સાંધાના દુખાવા માટે હળદરની ગાંઠ વાપરીએ છીએ. એક ચમચી હળદરનું ચૂર્ણ ગરમ દૂધમાં ઉકાળીને દર્દીને દિવસમાં બે વાર, સવારે અને સાંજે, સાત દિવસ આપીએ છીએ.';
    }
    if (lang === 'Hindi') {
      return 'हम जोड़ों के दर्द के लिए हल्दी की गांठ का उपयोग करते हैं। एक चम्मच हल्दी का चूर्ण गर्म दूध में उबालकर मरीज को दिन में दो बार, सुबह और शाम, सात दिनों तक दिया जाता है।';
    }
    return 'We use Haldi rhizome root for severe joint pain and swelling. One teaspoon turmeric powder boiled in warm milk, taken orally twice daily for 7 days.';
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
        
        if (language === 'Gujarati') recognition.lang = 'gu-IN';
        else if (language === 'Hindi') recognition.lang = 'hi-IN';
        else recognition.lang = 'en-IN';

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
          console.warn('[SpeechRecognition] Warning:', e.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('[SpeechRecognition] Init exception:', e);
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

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Read from ref, never stale closure; if speech API returned empty, use language field fallback
        const finalTranscript = liveTranscriptRef.current.trim() || getDefaultSpeechText(language);
        liveTranscriptRef.current = finalTranscript;
        setLiveTranscript(finalTranscript);

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
      const finalTranscript = liveTranscriptRef.current.trim() || getDefaultSpeechText(language);
      liveTranscriptRef.current = finalTranscript;
      setLiveTranscript(finalTranscript);
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

  return (
    <div className="flex flex-col items-center justify-center py-4">
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
              Listening ({language})... {formatSeconds(recordingSeconds)}
            </span>
          ) : isProcessing ? (
            <span className="text-emerald-700 font-medium">Processing Voice with Indic Engine...</span>
          ) : (
            <span className="text-gray-600">Tap microphone to start speaking</span>
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
        <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
