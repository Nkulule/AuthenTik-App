
import React, { useState } from 'react';
import { ContentType, UserRole, VerificationStatus } from '../types';
import { screenContent } from '../services/geminiService';
import { Send, Link2, FileText, Loader2, AlertTriangle, UserCheck } from 'lucide-react';

interface CreatePostProps {
  onPostCreated: (post: any) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
          <FileText size={18} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Publish Verified Content</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Content Type</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value as ContentType)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {Object.values(ContentType).map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div>
          <input 
            type="text" 
            placeholder="Article Headline..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-serif font-bold text-slate-900 bg-transparent border-b border-slate-100 focus:border-blue-500 focus:outline-none pb-2 placeholder:text-slate-300"
          />
        </div>

        <div>
          <textarea 
            placeholder="Present the facts, evidence, and verified accounts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[150px] bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium hover:bg-slate-200 transition-colors">
            <Link2 size={14} /> Add Source
          </button>
          <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium hover:bg-slate-200 transition-colors">
            <UserCheck size={14} /> Request Right of Reply
          </button>
        </div>

        {aiAnalysis && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg animate-pulse">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-1">
              <Loader2 size={16} className="animate-spin" />
              AuthenTik AI Fact-Checker Screening...
            </div>
            <p className="text-xs text-blue-600">Cross-referencing claims with global databases and verifying source credibility.</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
          <p className="text-[10px] text-slate-400 max-w-[250px] leading-tight">
            Note: All submissions undergo human editorial review and mandatory right-of-reply confirmation before final verification.
          </p>
          <button 
            type="submit"
            disabled={isSubmitting || !title || !content}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/10"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            Submit for Verification
          </button>
        </div>
      </form>
    </div>
  );
};
