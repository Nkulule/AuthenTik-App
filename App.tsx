
import React, { useState } from 'react';
import { Sidebar, MobileNav } from './components/Navigation';
import { PostCard } from './components/PostCard';
import { CreatePost } from './components/CreatePost';
import { AiAssistant } from './components/AiAssistant';
import { MediaWorkbench } from './components/MediaWorkbench';
import { LiveInterviewStudio } from './components/LiveInterviewStudio';
import { Post, UserRole, ContentType, VerificationStatus } from './types';
import { Shield, Search, TrendingUp, Info, Users, Sparkles, Brain, Radio, CheckCircle2 } from 'lucide-react';
import { BrandIcon } from './components/BrandIcon';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    author: "Dr. Sarah Chen",
    authorRole: UserRole.EXPERT,
    type: ContentType.RESEARCH,
    title: "New Analysis of Deep-Sea Thermal Patterns: Evidence of Rapid Warming",
    content: "Our longitudinal study of hydrothermal vents in the North Atlantic indicates a 0.4°C baseline shift over the last 18 months. This data was cross-referenced with satellite telemetry and verified by three independent research vessels.",
    timestamp: "2 hours ago",
    status: VerificationStatus.VERIFIED,
    sources: ["NOAA Public Dataset", "DeepSea Research Journal"],
    evidenceUrls: ["#"],
    auditTrail: [
      { id: '1', step: 'Identity Check', timestamp: '2h ago', actor: 'System', details: 'PhD credentials verified.' }
    ],
    comments: [],
    likes: 342,
    likedByMe: true,
    views: 12405
  }
];

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState<'feed' | 'lab' | 'studio'>('feed');

  const handleNewPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="lg:ml-64 pb-24 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-12">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                 <BrandIcon size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {activeTab === 'feed' ? 'Truth Feed' : activeTab === 'lab' ? 'AuthenTik AI Lab' : 'Live Studio'}
                </h1>
                <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                  <Shield size={14} className="text-emerald-500" />
                  The global standard for authenticated information.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-1.5 bg-slate-200/50 backdrop-blur rounded-2xl ring-1 ring-slate-900/5">
              <button 
                onClick={() => setActiveTab('feed')} 
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'feed' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Feed
              </button>
              <button 
                onClick={() => setActiveTab('lab')} 
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'lab' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                AI Lab
              </button>
              <button 
                onClick={() => setActiveTab('studio')} 
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'studio' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Studio
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
              {activeTab === 'feed' && (
                <div className="space-y-8">
                  <CreatePost onPostCreated={handleNewPost} />
                  <div className="space-y-6">
                    {posts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'lab' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AiAssistant />
                  <MediaWorkbench />
                </div>
              )}

              {activeTab === 'studio' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <LiveInterviewStudio />
                </div>
              )}
            </div>

            <aside className="hidden lg:block lg:col-span-4 space-y-8">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500" />
                
                <div className="flex items-center gap-3 mb-6 relative">
                  <div className="p-2 bg-amber-50 rounded-xl">
                    <Sparkles className="text-amber-500" size={20} />
                  </div>
                  <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">System Integrity</h3>
                </div>
                
                <div className="space-y-4 relative">
                  <div className="p-4 bg-slate-50/80 rounded-2xl flex justify-between items-center border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Precision</span>
                    <span className="text-sm font-black text-emerald-600">99.4%</span>
                  </div>
                  <div className="p-4 bg-slate-50/80 rounded-2xl flex justify-between items-center border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Verifications</span>
                    <span className="text-sm font-black text-blue-600">12,402</span>
                  </div>
                  <button 
                    onClick={() => setActiveTab('lab')} 
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
                  >
                    Launch Logic Lab
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl shadow-indigo-500/20 border border-white/5 relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-xl backdrop-blur">
                      <Radio size={20} className="text-blue-400" />
                    </div>
                    <h4 className="font-black text-lg uppercase tracking-tight">Live Interview</h4>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                    Engage the Truth Engine in a real-time vocal session. Cross-examine claims instantly.
                  </p>
                  <button 
                    onClick={() => setActiveTab('studio')} 
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/30 group-hover:translate-y-[-2px]"
                  >
                    Open Studio
                  </button>
                </div>
              </div>

              <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                 <div className="flex items-center gap-3 mb-3">
                   <Shield className="text-emerald-600" size={18} />
                   <h5 className="text-xs font-black text-emerald-900 uppercase tracking-widest">Veritas Protocol</h5>
                 </div>
                 <p className="text-[11px] text-emerald-800/70 font-medium leading-relaxed">
                   Every piece of media on AuthenTik is cryptographically hashed and anchored to the Truth Chain. 100% accountability, 0% propaganda.
                 </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default App;
