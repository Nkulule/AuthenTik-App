
import React, { useState, useRef } from 'react';
import { 
  Search, MapPin, Brain, Image, Video, Mic, 
  Send, Loader2, Link as LinkIcon, AlertCircle, FileAudio, 
  Upload, X, Speaker
} from 'lucide-react';
import { searchGrounding, mapsGrounding, complexReasoning, analyzeMedia, transcribeAudio, generateSpeech } from '../services/geminiService';

export const AiAssistant: React.FC = () => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<'search' | 'maps' | 'reason' | 'media'>('search');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [file, setFile] = useState<{data: string, type: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile({ data: (reader.result as string).split(',')[1], type: selected.type });
      };
      reader.readAsDataURL(selected);
    }
  };

  const executeTask = async () => {
    if (!query && !file) return;
    setLoading(true);
    try {
      let result;
      if (file) {
        if (file.type.startsWith('audio')) {
          const text = await transcribeAudio(file.data);
          result = { text, type: 'transcription' };
        } else {
          const analysis = await analyzeMedia(file.data, file.type, query);
          result = { text: analysis, type: 'analysis' };
        }
      } else {
        switch (mode) {
          case 'search': result = await searchGrounding(query); break;
          case 'maps': result = await mapsGrounding(query); break;
          case 'reason': result = { text: await complexReasoning(query) }; break;
        }
      }
      setResponses([result, ...responses]);
      setQuery("");
      setFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playTts = async (text: string) => {
    const audioData = await generateSpeech(text);
    if (audioData) {
      const audio = new Audio(`data:audio/pcm;base64,${audioData}`);
      alert("Generating speech... (Audio bytes received)");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Brain size={18} className="text-indigo-500" />
          AuthenTik AI Lab
        </h3>
        <div className="flex bg-white rounded-lg border border-slate-200 p-1">
          <button onClick={() => setMode('search')} className={`p-1.5 rounded ${mode === 'search' ? 'bg-slate-100' : ''}`} title="Search Grounding"><Search size={14} /></button>
          <button onClick={() => setMode('maps')} className={`p-1.5 rounded ${mode === 'maps' ? 'bg-slate-100' : ''}`} title="Maps Grounding"><MapPin size={14} /></button>
          <button onClick={() => setMode('reason')} className={`p-1.5 rounded ${mode === 'reason' ? 'bg-slate-100' : ''}`} title="Complex Thinking"><Brain size={14} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {responses.map((res, i) => (
          <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Response</span>
              <button onClick={() => playTts(res.text)} className="text-slate-400 hover:text-indigo-500"><Speaker size={14} /></button>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{res.text}</p>
            {res.sources && res.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Grounding Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {res.sources.map((s: any, j: number) => (
                    <a key={j} href={s.web?.uri || s.maps?.uri} target="_blank" className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-blue-600 hover:underline">
                      <LinkIcon size={10} /> {s.web?.title || s.maps?.title || 'Source'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <Loader2 className="animate-spin mb-2" size={24} />
            <p className="text-xs font-medium italic">AuthenTik AI is analyzing records...</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 space-y-3">
        {file && (
          <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-2">
              <FileAudio size={16} className="text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700 truncate max-w-[150px]">Media Attachment Ready</span>
            </div>
            <button onClick={() => setFile(null)} className="text-indigo-400 hover:text-indigo-600"><X size={14} /></button>
          </div>
        )}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeTask()}
              placeholder={mode === 'reason' ? "Ask a complex query..." : "Verify a claim..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-slate-400 hover:text-indigo-500"><Upload size={16} /></button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,audio/*" />
            </div>
          </div>
          <button 
            onClick={executeTask}
            disabled={loading || (!query && !file)}
            className="p-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
