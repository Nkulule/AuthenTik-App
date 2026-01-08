
import React, { useState } from 'react';
import { Post, VerificationStatus, UserRole, Comment } from '../types';
import { 
  ShieldCheck, Info, PlayCircle, History, 
  ExternalLink, CheckCircle2, Share2, MessageSquare, 
  X, Link, Download, Send, Heart, Eye, Check, UserCheck
} from 'lucide-react';

const StatusBadge: React.FC<{ status: VerificationStatus }> = ({ status }) => {
  const config = {
    [VerificationStatus.VERIFIED]: "bg-emerald-100 text-emerald-700 border-emerald-200",
    [VerificationStatus.PENDING]: "bg-amber-100 text-amber-700 border-amber-200",
    [VerificationStatus.AI_SCREENED]: "bg-blue-100 text-blue-700 border-blue-200",
    [VerificationStatus.RIGHT_OF_REPLY]: "bg-purple-100 text-purple-700 border-purple-200",
    [VerificationStatus.CORRECTED]: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${config[status]}`}>
      {status === VerificationStatus.VERIFIED && <ShieldCheck size={14} />}
      {status}
    </span>
  );
};

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [showLogs, setShowLogs] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [liked, setLiked] = useState(post.likedByMe || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showToast, setShowToast] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: "Alex Thompson", 
      authorRole: UserRole.JOURNALIST,
      content: newComment,
      timestamp: "Just now"
    };
    
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const shareOptions = [
    { 
      name: 'Copy Source Link', 
      icon: <Link size={18}/>, 
      desc: 'Unique verification URL',
      action: () => {
        navigator.clipboard.writeText(`https://veritas.app/verify/vrt-${post.id}`);
        triggerToast();
      } 
    },
    { 
      name: 'Export Verified PDF', 
      icon: <Download size={18}/>, 
      desc: 'Full dossier for citation',
      action: () => alert('Generating cryptographic PDF report...') 
    },
    { 
      name: 'Internal Truth Circle', 
      icon: <CheckCircle2 size={18}/>, 
      desc: 'Share with verified peers',
      action: () => alert('Shared with your verified rank colleagues.') 
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 transition-all hover:shadow-md relative">
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <Check size={14} className="text-emerald-400" />
          Verified Link Copied
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
              {post.author[0]}
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                {post.author}
                <CheckCircle2 size={14} className="text-blue-500" />
              </h4>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{post.authorRole}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={post.status} />
            {post.replyConfirmed && (
              <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm animate-in fade-in zoom-in-95">
                <UserCheck size={10} /> Verified Response Included
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">{post.type}</p>
          <h2 className="text-2xl font-serif font-bold text-slate-900 leading-tight mb-3">
            {post.title}
          </h2>
          <p className="text-slate-700 leading-relaxed line-clamp-3">
            {post.content}
          </p>
        </div>

        {post.interviewUrl && (
          <div className="mb-4 aspect-video bg-slate-900 rounded-lg relative group cursor-pointer overflow-hidden ring-1 ring-slate-200">
            <img 
              src={`https://picsum.photos/seed/${post.id}/800/450`} 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" 
              alt="Interview preview"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle size={64} className="text-white opacity-90 group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute bottom-4 left-4">
              <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest">Live Verified Recording</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {post.sources.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-md text-xs border border-slate-100">
              <ExternalLink size={12} /> {s}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-y-3">
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleLike}
              className={`text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${liked ? 'text-rose-600 scale-105' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Heart size={18} fill={liked ? "currentColor" : "none"} />
              {likeCount}
            </button>
            <div className="text-sm font-medium flex items-center gap-1.5 text-slate-500">
              <Eye size={18} />
              {formatNumber(post.views)}
            </div>
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${showComments ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <MessageSquare size={18} />
              Discourse ({comments.length})
            </button>
            <button 
              onClick={() => setShowLogs(!showLogs)}
              className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${showLogs ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <History size={18} />
              Audit Trail
            </button>
            <button 
              onClick={() => setShowShareModal(true)}
              className="text-slate-500 hover:text-slate-900 text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>
          <span className="text-xs text-slate-400 font-medium">{post.timestamp}</span>
        </div>

        {showLogs && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                Information Integrity Audit
              </h5>
              {post.replyConfirmed && (
                <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-bold uppercase tracking-tighter">
                  <UserCheck size={12} /> Right of Reply Logged
                </div>
              )}
            </div>
            <div className="space-y-4">
              {post.auditTrail.map((log) => (
                <div key={log.id} className="flex gap-3 border-l-2 border-slate-200 ml-1.5 pl-4 relative">
                  <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${log.step.includes('Reply') ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{log.step}</p>
                    <p className="text-[10px] text-slate-400 mb-1">{log.timestamp} • {log.actor}</p>
                    <p className="text-xs text-slate-600 leading-relaxed italic">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showComments && (
          <div className="mt-6 border-t border-slate-100 pt-6 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-6">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare size={14} />
                Verified Discourse
              </h5>
              <div className="flex items-center gap-2 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                <ShieldCheck size={10} className="text-emerald-600" />
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                  Identity Authenticated Area
                </span>
              </div>
            </div>
            
            <div className="space-y-6 mb-8">
              {comments.length > 0 ? comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 font-bold shrink-0 border border-slate-200 relative">
                    {comment.author[0]}
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                      <CheckCircle2 size={12} className="text-blue-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                      <span className="text-sm font-bold text-slate-900">{comment.author}</span>
                      <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase tracking-tight border border-slate-200">
                        {comment.authorRole}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-auto">{comment.timestamp}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 group-hover:bg-slate-100/50 transition-colors">
                      <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <MessageSquare size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 font-medium">No verified contributions yet.</p>
                </div>
              )}
            </div>

            <form onSubmit={handleAddComment} className="pt-6 border-t border-slate-100">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-slate-900/10 border-2 border-white ring-1 ring-slate-900/5">
                  A
                </div>
                <div className="flex-1 space-y-3">
                  <div className="relative">
                    <textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a verified contribution to this information..." 
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all resize-none placeholder:text-slate-400 focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Authenticated User:</span>
                        <span className="text-[10px] font-bold text-slate-700 px-2 py-0.5 bg-slate-100 rounded">Alex Thompson (Journalist II)</span>
                     </div>
                     <button 
                      type="submit"
                      disabled={!newComment.trim()}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-30 transition-all shadow-md active:scale-95"
                    >
                      <Send size={14} />
                      Post Verified Discourse
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Share Verification</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Authenticated Sharing</p>
              </div>
              <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-3">
              <div className="grid grid-cols-1 gap-1">
                {shareOptions.map((option, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      option.action();
                      setShowShareModal(false);
                    }}
                    className="flex items-center gap-4 px-4 py-4 hover:bg-slate-50 rounded-xl transition-all text-slate-700 group border border-transparent hover:border-slate-100 text-left"
                  >
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors group-hover:shadow-sm">
                      <span className="text-slate-500 group-hover:text-slate-900">
                        {option.icon}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 leading-none mb-1">{option.name}</p>
                      <p className="text-xs text-slate-400">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 bg-slate-50 flex items-center gap-3 border-t border-slate-100">
               <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                 <ShieldCheck size={18} className="text-emerald-600" />
               </div>
               <div className="overflow-hidden">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Cid Verification Key</p>
                 <p className="text-[9px] font-mono text-slate-400 truncate">vrt_{post.id}_hash_0x8f23...a3e9</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
