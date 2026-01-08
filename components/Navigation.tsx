
import React from 'react';
import { Home, Compass, BookOpen, GraduationCap, Shield, Bell, User, CheckCircle2 } from 'lucide-react';
import { BrandIcon } from './BrandIcon';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active }) => (
  <button className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all group ${
    active ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
  }`}>
    <span className={`${active ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`}>{icon}</span>
    <span className="font-semibold text-sm">{label}</span>
  </button>
);

export const Sidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col w-64 fixed h-screen bg-white border-r border-slate-200 p-6 z-40">
      <div className="flex items-center gap-3 mb-10 group cursor-default">
        <div className="relative">
          <BrandIcon size={40} className="transform group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -inset-1 bg-emerald-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-black tracking-tight text-slate-900 leading-none">
            Authen<span className="text-emerald-500">Tik</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Trust Engine</p>
        </div>
      </div>

      <nav className="space-y-1.5 flex-1">
        <NavItem icon={<Home size={20} />} label="Truth Feed" active />
        <NavItem icon={<Compass size={20} />} label="Explore Archives" />
        <NavItem icon={<BookOpen size={20} />} label="Community Panels" />
        <NavItem icon={<GraduationCap size={20} />} label="Civic Education" />
        <div className="pt-6 mt-6 border-t border-slate-100">
          <NavItem icon={<Bell size={20} />} label="Notifications" />
          <NavItem icon={<User size={20} />} label="Identity Profile" />
        </div>
      </nav>

      <div className="mt-auto relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
        <div className="relative p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secured Identity</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-900">Alex Thompson</p>
            <CheckCircle2 size={14} className="text-blue-500" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Journalist Rank Tier II</p>
        </div>
      </div>
    </div>
  );
};

export const MobileNav: React.FC = () => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 py-4 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
    <Home size={24} className="text-slate-900" />
    <Compass size={24} className="text-slate-400" />
    <div className="relative -mt-10">
      <div className="absolute -inset-2 bg-white rounded-full p-2 shadow-xl border border-slate-100">
        <BrandIcon size={48} />
      </div>
    </div>
    <Bell size={24} className="text-slate-400" />
    <User size={24} className="text-slate-400" />
  </div>
);
