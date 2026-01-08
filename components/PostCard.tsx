
import React, { useState } from 'react';
import { Post, VerificationStatus, UserRole, Comment } from '../types';
import { 
  ShieldCheck, Info, PlayCircle, History, 
  ExternalLink, CheckCircle2, Share2, MessageSquare, 
  X, Link, Download, Send, Heart, Eye, Check, UserCheck, User
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
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${config[status]}`}>
      {status === VerificationStatus.VERIFIED && <ShieldCheck size={14} />}
      {status}
    </span>
  );
};

export const PostCard: React.FC<{ post: Post, currentUserAvatar: string | null }> = ({ post, currentUserAvatar }) => {
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
      authorAvatar: currentUserAvatar || undefined,
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
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8 transition-all hover:shadow-xl hover:shadow-slate-200/50 relative group/card">
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <Check size={16} className="text-blue-400" />
          Verified Link Copied
        </div>
      )}

      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 font-bold overflow-hidden shadow-sm">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
              ) : (
                post.author[0]
              )}
            </div>
            <div>
              <h4 className="font-black text-slate-900 flex items-center gap-2">
                {post.author}
                <CheckCircle2 size={16} className="text-blue-500" />
              </h4>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{post.authorRole}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={post.status} />
            {post.replyConfirmed && (
              <span className="px-3 py-1 rounded bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 animate-in fade-in zoom-in-95">
                <UserCheck size={12} /> Verified Response Included
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{post.type}</p>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 leading-tight mb-4 group-hover/card:text-blue-600 transition-colors">
            {post.title}
          </h2>
          <p className="text-slate-600 leading-relaxed font-medium">
            {post.content}
          </p>
        </div>

        {post.interviewUrl && (
          <div className="mb-6 aspect-video bg-slate-900 rounded-3xl relative group cursor-pointer overflow-hidden ring-1 ring-slate-200">
            <img 
              src={`https://picsum.photos/seed/${post.id}/800/450`} 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
              alt="Interview preview"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <PlayCircle size={64} className="text-white opacity-90" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6">
              <span className="bg-red-600 text-white text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Live Verified Recording
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {post.sources.map((s, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:border-slate-300 transition-colors cursor-default">
              <ExternalLink size={12} className="text-blue-500" /> {s}
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-wrap justify-between items-center gap-y-4">
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={handleLike}
              className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ${liked ? 'text-rose-600 scale-105' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Heart size={20} fill={liked ? "currentColor" : "none"} className={liked ? "animate-bounce" : ""} />
              {likeCount}
            </button>
            <div className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-500">
              <Eye size={20} />
              {formatNumber(post.views)}
            </div>
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${showComments ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <MessageSquare size={20} />
              Discourse ({comments.length})
            </button>
            <button 
              onClick={() => setShowLogs(!showLogs)}
              className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${showLogs ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <History size={20} />
              Audit
            </button>
            <button 
              onClick={() => setShowShareModal(true)}
              className="text-slate-500 hover:text-slate-900 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              <Share2 size={20} />
              Share
            </button>
          </div>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{post.timestamp}</span>
        </div>

        {showLogs && (
          <div className="mt-8 p-6 bg-slate-50/80 rounded-3xl border border-slate-100 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-6">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                <ShieldCheck size={16} className="text-blue-500" />
                Cryptographic Integrity Audit
              </h5>
              {post.replyConfirmed && (
                <div className="flex items-center gap-1.5 text-[9px] text-indigo-600 font-black uppercase tracking-widest">
                  <UserCheck size={14} /> Right of Reply Logged
                </div>
              )}
            </div>
            <div className="space-y-6">
              {post.auditTrail.map((log) => (
                <div key={log.id} className="flex gap-4 border-l-2 border-slate-200 ml-1.5 pl-6 relative">
                  <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-4 ring-white ${log.step.includes('Reply') ? 'bg-indigo-500' : 'bg-blue-500'}`} />
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{log.step}</p>
                    <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-widest">{log.timestamp} • {log.actor}</p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white/50 p-3 rounded-xl border border-slate-100/50 italic">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showComments && (
          <div className="mt-8 border-t border-slate-100 pt-8 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-8">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                <MessageSquare size={16} />
                Verified Community Discourse
              </h5>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shadow-sm shadow-blue-500/5">
                <ShieldCheck size={14} className="text-blue-600" />
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                  Identity Authenticated Area
                </span>
              </div>
            </div>
            
            <div className="space-y-8 mb-10">
              {comments.length > 0 ? comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 group/comment">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 font-bold shrink-0 border border-slate-200 relative overflow-hidden shadow-sm group-hover/comment:shadow-md transition-shadow">
                    {comment.authorAvatar ? (
                      <img src={comment.authorAvatar} alt={comment.author} className="w-full h-full object-cover" />
                    ) : (
                      comment.author[0]
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-slate-100">
                      <CheckCircle2 size={12} className="text-blue-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                      <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{comment.author}</span>
                      <span className="text-[8px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md font-black uppercase tracking-widest border border-slate-200 shadow-sm">
                        {comment.authorRole}
                      </span>
                      <span className="text-[9px] text-slate-400 ml-auto font-black uppercase tracking-widest">{comment.timestamp}</span>
                    </div>
                    <div className="bg-slate-50/50 p-5 rounded-3xl rounded-tl-none border border-slate-100 group-hover/comment:bg-white group-hover/comment:shadow-xl group-hover/comment:shadow-slate-200/50 transition-all">
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">{comment.content}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                  <MessageSquare size={40} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest">No verified contributions yet.</p>
                </div>
              )}
            </div>

            <form onSubmit={handleAddComment} className="pt-8 border-t border-slate-100">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold shrink-0 shadow-xl shadow-slate-900/20 border-2 border-white overflow-hidden ring-1 ring-slate-200">
                  {currentUserAvatar ? (
                    <img src={currentUserAvatar} alt="You" className="w-full h-full object-cover" />
                  ) : (
                    'A'
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="relative group/input">
                    <textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a verified contribution to this information..." 
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-8 focus:ring-blue-500/5 transition-all resize-none placeholder:text-slate-400 focus:bg-white focus:border-blue-200"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Identity:</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                           <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Alex Thompson (Journalist II)</span>
                        </div>
                     </div>
                     <button 
                      type="submit"
                      disabled={!newComment.trim()}
                      className="flex items-center justify-center gap-3 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-30 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                      <Send size={16} />
                      Publish Discourse
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Share Record</h3>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">Authenticated Verification</p>
              </div>
              <button onClick={() => setShowShareModal(false)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all text-slate-400 hover:text-slate-900">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {shareOptions.map((option, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      option.action();
                      setShowShareModal(false);
                    }}
                    className="w-full flex items-center gap-5 px-6 py-5 hover:bg-slate-50 rounded-3xl transition-all text-slate-700 group border border-transparent hover:border-slate-200 text-left active:scale-[0.98]"
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-2xl group-hover:bg-white transition-all group-hover:shadow-lg group-hover:scale-110">
                      <span className="text-slate-500 group-hover:text-blue-600">
                        {option.icon}
                      </span>
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-900 uppercase tracking-tight mb-1">{option.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-50/80 flex items-center gap-4 border-t border-slate-100 backdrop-blur-sm">
               <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                 <ShieldCheck size={24} className="text-emerald-500" />
               </div>
               <div className="overflow-hidden">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Cryptographic Hash</p>
                 <p className="text-[9px] font-mono text-slate-500 truncate bg-slate-200/50 px-2 py-1 rounded">vrt_{post.id}_hash_0x8f23...a3e9</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
