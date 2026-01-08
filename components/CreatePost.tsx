
import React, { useState } from 'react';
import { ContentType, UserRole, VerificationStatus } from '../types';
import { screenContent } from '../services/geminiService';
import { Send, Link2, FileText, Loader2, UserCheck, User } from 'lucide-react';

interface CreatePostProps {
  onPostCreated: (post: any) => void;
  userAvatar: string | null;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, userAvatar }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<ContentType>(ContentType.NEWS);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    
    // Step 1: AI Screening
    const analysis = await screenContent(title, content);
    setAiAnalysis(analysis);

    // Wait 2 seconds to simulate the platform's multi-step logic
    setTimeout(() => {
      const newPost = {
        id: Math.random().toString(36).substr(2, 9),
        author: "Alex Thompson",
        authorAvatar: userAvatar,
        authorRole: UserRole.JOURNALIST,
        type: type,
        title: title,
        content: content,
        timestamp: "Just now",
        status: analysis.credibilityScore > 70 ? VerificationStatus.AI_SCREENED : VerificationStatus.PENDING,
        sources: ["Verified Internal Source", "Public Records"],
        evidenceUrls: [],
        likes: 0,
        likedByMe: false,
        views: 0,
        auditTrail: [
          {
            id: '1',
            step: "Identity Verified",
            timestamp: "Today, 10:00 AM",
            actor: "System",
            details: "Biometric authentication successful."
          },
          {
            id: '2',
            step: "AI Screening",
            timestamp: "Today, 10:05 AM",
            actor: "AuthenTik AI Core",
            details: analysis.analysis
          }
        ]
      };
      
      onPostCreated(newPost);
      setTitle('');
      setContent('');
      setIsSubmitting(false);
      setAiAnalysis(null);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          {userAvatar ? (
            <img src={userAvatar} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <FileText size={24} />
          )}
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Publish Verified Content</h3>
          <p className="text-xs text-slate-500 font-medium tracking-wide">Submit facts for cryptographic anchoring</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Content Classification</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
             {Object.values(ContentType).map(v => (
               <button
                key={v}
                type="button"
                onClick={() => setType(v)}
                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  type === v ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'
                }`}
               >
                 {v}
               </button>
             ))}
          </div>
        </div>

        <div>
          <input 
            type="text" 
            placeholder="Article Headline..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-serif font-bold text-slate-900 bg-transparent border-b border-slate-100 focus:border-blue-500 focus:outline-none pb-3 placeholder:text-slate-300 transition-colors"
          />
        </div>

        <div className="relative">
          <textarea 
            placeholder="Present the facts, evidence, and verified accounts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[180px] bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all resize-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors border border-slate-200/50">
            <Link2 size={14} /> Add Source
          </button>
          <button type="button" className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors border border-slate-200/50">
            <UserCheck size={14} /> Request Right of Reply
          </button>
        </div>

        {aiAnalysis && (
          <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl animate-pulse">
            <div className="flex items-center gap-3 text-blue-700 font-black text-xs uppercase tracking-widest mb-2">
              <Loader2 size={16} className="animate-spin" />
              AuthenTik AI Fact-Checker Screening...
            </div>
            <p className="text-xs text-blue-600 leading-relaxed font-medium">Cross-referencing claims with global databases and verifying source credibility.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-slate-100 gap-4">
          <p className="text-[10px] text-slate-400 max-w-[300px] leading-relaxed font-medium">
            <span className="font-black text-slate-500">Notice:</span> All submissions undergo human editorial review and mandatory right-of-reply confirmation before final verification.
          </p>
          <button 
            type="submit"
            disabled={isSubmitting || !title || !content}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/10 active:scale-95"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            Submit Verification
          </button>
        </div>
      </form>
    </div>
  );
};
