
import React, { useState } from 'react';
import { Image, Video, Sparkles, Download, Loader2, Maximize, AspectRatio, Sliders } from 'lucide-react';
import { generateImage, generateVideo } from '../services/geminiService';

export const MediaWorkbench: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<'image' | 'video'>('image');
  const [aspect, setAspect] = useState<any>("1:1");
  const [size, setSize] = useState<any>("1K");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      if (type === 'image') {
        const url = await generateImage(prompt, aspect, size);
        setResult(url);
      } else {
        const url = await generateVideo(prompt, aspect === "1:1" ? "16:9" : aspect); // Veo supports 16:9/9:16
        setResult(url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500" />
          Verified Media Generation
        </h3>
        <div className="flex p-1 bg-slate-100 rounded-lg">
          <button onClick={() => setType('image')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${type === 'image' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
            <Image size={14} /> Image
          </button>
          <button onClick={() => setType('video')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${type === 'video' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
            <Video size={14} /> Video
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Creation Prompt</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Describe the verified ${type} content...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/10 min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Aspect Ratio</label>
            <select value={aspect} onChange={(e) => setAspect(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium">
              <option value="1:1">1:1 Square</option>
              <option value="16:9">16:9 Cinema</option>
              <option value="9:16">9:16 Portrait</option>
              <option value="4:3">4:3 Standard</option>
              <option value="21:9">21:9 Ultrawide</option>
            </select>
          </div>
          {type === 'image' && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Resolution</label>
              <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium">
                <option value="1K">1K Balanced</option>
                <option value="2K">2K Professional</option>
                <option value="4K">4K High Definition</option>
              </select>
            </div>
          )}
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-900/10"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? 'Synthesizing...' : `Generate Verified ${type === 'image' ? 'Image' : 'Video'}`}
        </button>
      </div>

      {result && (
        <div className="mt-4 animate-in zoom-in-95 fade-in duration-300">
          <div className="relative group rounded-xl overflow-hidden border border-slate-200 ring-4 ring-slate-50">
            {type === 'image' ? (
              <img src={result} className="w-full h-auto" alt="Generated content" />
            ) : (
              <video src={result} controls className="w-full" />
            )}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <a href={result} download className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-xl text-slate-900 hover:bg-white"><Download size={16} /></a>
            </div>
            <div className="absolute bottom-4 left-4">
              <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-lg">AI Generated Truth Record</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
