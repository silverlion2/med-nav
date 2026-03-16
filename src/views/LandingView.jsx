import React from 'react';
import { useNavigationStore } from '../store/navigationStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Pill, ShieldCheck, Search, ShieldAlert, Gift } from 'lucide-react';

// Fresh Teal Logo (Shield + Leaf)
const PremiumLogo = () => (
  <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
    {/* Soft glow background */}
    <div className="absolute inset-0 bg-teal-400 rounded-full blur-[20px] opacity-20"></div>
    {/* Glass Morphism Shield Base */}
    <div className="absolute inset-0 bg-gradient-to-br from-white to-teal-50 border border-white shadow-[0_8px_30px_rgba(20,184,166,0.1)] rounded-[2.5rem] rotate-45 flex items-center justify-center overflow-hidden">
       {/* Inner metallic reflection */}
       <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/80 to-transparent"></div>
    </div>
    {/* Center Leaf Element */}
    <svg viewBox="0 0 100 100" className="w-14 h-14 z-10 drop-shadow-sm -rotate-45">
      <defs>
        <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
      </defs>
      <path d="M50 85 Q20 85 20 50 Q20 20 50 15 Q80 20 80 50 Q80 85 50 85 Z" fill="url(#leafGrad)" />
      <path d="M50 15 Q35 45 50 85" fill="none" stroke="white" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
      <path d="M50 50 Q65 40 73 35" fill="none" stroke="white" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
      <path d="M50 65 Q60 60 68 57" fill="none" stroke="white" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    </svg>
  </div>
);

// Feature Item for the 3-column grid
const FeatureItem = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center flex-1 px-1">
    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] mb-2 text-teal-600">
      <Icon size={18} strokeWidth={2.5}/>
    </div>
    <h3 className="text-xs font-bold text-slate-700 mb-0.5">{title}</h3>
    <p className="text-[9px] text-slate-400 text-center leading-tight tracking-wide">{desc}</p>
  </div>
);

export const LandingView = () => {
  const setStep = useNavigationStore(state => state.setStep);
  const setShowRetrieveModal = useAuthStore(state => state.setShowRetrieveModal);
  const setShowDrugSearchModal = useNavigationStore(state => state.setShowDrugSearchModal);
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full h-full bg-white p-6 relative overflow-x-hidden overflow-y-auto flex flex-col items-center justify-between">
      
      {/* Premium Subtle Gradients (Lighter, Fresh Teal/Mint) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-50/60 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none"></div>
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-emerald-50/40 rounded-full blur-[80px] -translate-x-1/2 z-0 pointer-events-none"></div>

      {/* Top Decorator */}
      <div className="w-full pt-12 flex justify-center z-10 shrink-0">
        <div className="px-4 py-1 bg-teal-50/80 backdrop-blur-xl rounded-full text-teal-700 font-bold text-[10px] tracking-widest border border-teal-100 shadow-[0_2px_10px_rgba(20,184,166,0.05)] flex items-center">
          <ShieldCheck size={12} className="mr-1.5 opacity-80" /> 职工专属医疗财务平台
        </div>
      </div>

      {/* Hero Content (Centered) */}
      <div className="flex-1 w-full flex flex-col items-center justify-center z-10 my-6">
        <PremiumLogo />
        
        <h1 className="text-2xl font-black text-slate-800 mb-2 tracking-widest font-sans drop-shadow-sm">
          职工医惠通
        </h1>
        
        <p className="text-teal-600/80 text-xs font-medium tracking-widest text-center mt-1">
          每一笔医疗支出 都帮您找到最优解
        </p>

        {/* 3-Column Core Features Section */}
        <div className="w-full mt-10 p-5 bg-white/80 backdrop-blur-2xl rounded-3xl border border-teal-50 shadow-[0_8px_30px_rgba(20,184,166,0.06)] flex justify-between gap-2">
           <FeatureItem icon={Search} title="深度测算" desc="挖掘隐形可报销项" />
           <FeatureItem icon={ShieldAlert} title="防坑防漏" desc="打破医疗信息差" />
           <FeatureItem icon={Gift} title="专属福利" desc="医保/商保/工会全打通" />
        </div>
      </div>

      {/* Action Buttons (Bottom Attached) */}
      <div className="w-full space-y-3.5 z-10 shrink-0 pb-6 w-full max-w-[340px] mx-auto">
        
        {/* Primary CTA: AI Wizard Tool - Vibrant Teal */}
        <button 
          onClick={() => setStep('wizard')} 
          className="w-full relative overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-4 rounded-2xl shadow-[0_10px_30px_rgba(20,184,166,0.25)] flex justify-center items-center active:scale-[0.98] transition-all outline-none border border-teal-400"
        >
           {/* Subtle reflection on button */}
           <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
           <Sparkles size={16} className="text-teal-50 mr-2" /> 
           开启专属智能测算
        </button>

        {/* Secondary CTA: Union Dashboard (Home) */}
        <button 
          onClick={() => navigate('/dashboard')} 
          className="w-full bg-white text-teal-700 font-bold py-3.5 rounded-2xl flex justify-center items-center active:bg-teal-50 transition-all outline-none border border-teal-100 shadow-[0_4px_15px_rgba(20,184,166,0.04)]"
        >
          进入个人应用中心 <ArrowRight className="ml-2 text-teal-300" size={16} />
        </button>

        {/* Third CTA: Search Drug */}
        <button 
          onClick={() => setShowDrugSearchModal(true)} 
          className="w-full bg-white/60 backdrop-blur-sm text-slate-500 font-bold py-3 rounded-2xl flex justify-center items-center hover:bg-white active:bg-white transition-all outline-none border border-slate-200/60"
        >
           <Pill size={14} className="text-teal-400 mr-2" /> 
           按药品/疾病检索专项福利
        </button>

        <div className="flex justify-between mt-6 px-4">
           <button 
            onClick={() => navigate('/welfare')} 
            className="text-slate-400 text-xs flex items-center hover:text-teal-600 transition-colors outline-none font-medium"
          >
            <Heart size={12} className="mr-1" /> 通用健康大厅
          </button>
          <button 
            onClick={() => setShowRetrieveModal(true)} 
            className="text-slate-400 text-xs flex items-center hover:text-teal-600 transition-colors outline-none font-medium underline underline-offset-2"
          >
            历史档案提取
          </button>
        </div>

      </div>
    </div>
  );
};

