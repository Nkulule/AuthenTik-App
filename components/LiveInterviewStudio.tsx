
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Mic, MicOff, PhoneOff, Radio, Signal, Loader2, AlertCircle } from 'lucide-react';

export const LiveInterviewStudio: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const startSession = async () => {
    try {
      setIsActive(true);
      setError(null);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: any) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + " " + message.serverContent.outputTranscription.text);
            }
            
            const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioBase64 && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioBase64), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
          },
          onclose: () => stopSession(),
          onerror: (e) => setError("Session connection error.")
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are a professional investigative journalist conducting a live truth-testing interview.'
        }
      });
      
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setError("Failed to access microphone or connect.");
      setIsActive(false);
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    sourcesRef.current.forEach(s => s.stop());
    setIsActive(false);
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h4 className="text-white text-xs font-bold uppercase tracking-widest">AuthenTik Live Studio</h4>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
            <Signal size={12} className={isActive ? "text-emerald-500" : ""} />
            {isActive ? 'CONNECTED' : 'STANDBY'}
          </div>
        </div>
      </div>

      <div className="p-8 flex flex-col items-center justify-center min-h-[300px] relative">
        {!isActive ? (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto ring-4 ring-slate-800/50">
              <Radio size={32} className="text-slate-500" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Start Live Interview</h3>
              <p className="text-slate-500 text-xs max-w-xs mx-auto">Engage in a real-time conversational verification session with AuthenTik AI.</p>
            </div>
            <button 
              onClick={startSession}
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all flex items-center gap-2 mx-auto"
            >
              <Mic size={18} /> Begin Session
            </button>
          </div>
        ) : (
          <div className="w-full space-y-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-1 bg-blue-500 rounded-full animate-bounce" style={{ height: `${Math.random() * 40 + 10}px`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 min-h-[120px]">
              <p className="text-slate-400 text-[10px] font-bold uppercase mb-2">Live Transcript</p>
              <p className="text-slate-200 text-sm leading-relaxed italic">{transcription || "Listening for speaker..."}</p>
            </div>
            <button 
              onClick={stopSession}
              className="px-8 py-3 bg-red-600/10 text-red-500 border border-red-600/30 rounded-full font-bold hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 mx-auto"
            >
              <PhoneOff size={18} /> End Interview
            </button>
          </div>
        )}
        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-900/50 border border-red-500/30 p-3 rounded-lg flex items-center gap-3 text-red-200 text-xs">
            <AlertCircle size={14} /> {error}
          </div>
        )}
      </div>
    </div>
  );
};
