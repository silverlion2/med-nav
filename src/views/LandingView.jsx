import React from 'react';
import { useNavigationStore } from '../store/navigationStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Pill, ShieldCheck, Search, ShieldAlert, Gift } from 'lucide-react';

// Premium Abstract Logo (Glassmorphism / Metallic feel)
const PremiumLogo = () => (
  <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
    {/* Soft glow background */}
    <div className="absolute inset-0 bg-blue-500 rounded-full blur-[20px] opacity-20"></div>
    {/* Glass Morphism Shield */}
    <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[2.5rem] rotate-45 flex items-center justify-center overflow-hidden">
       {/* Inner metallic reflection */}
       <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/80 to-transparent"></div>
    </div>
    {/* Center Medical Cross */}
    <svg viewBox="0 0 100 100" className="w-12 h-12 z-10 drop-shadow-sm -rotate-45">
      <defs>
        <linearGradient id="crossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      <rect x="42" y="20" width="16" height="60" rx="4" fill="url(#crossGrad)" />
      <rect x="20" y="42" width="60" height="16" rx="4" fill="url(#crossGrad)" />
      {/* Inner subtle glow line */}
      <rect x="44" y="22" width="12" height="56" rx="3" fill="none" stroke="white" strokeWidth="1" opacity="0.5"/>
      <rect x="22" y="44" width="56" height="12" rx="3" fill="none" stroke="white" strokeWidth="1" opacity="0.5"/>
    </svg>
  </div>
);

// Feature Item for the 3-column grid
const FeatureItem = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center flex-1 px-1">
    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] mb-2 text-slate-700">
      <Icon size={18} strokeWidth={2.5}/>
    </div>
    <h3 className="text-xs font-bold text-slate-800 mb-0.5">{title}</h3>
    <p className="text-[9px] text-slate-500 text-center leading-tight tracking-wide">{desc}</p>
  </div>
);

export const LandingView = () => {
  const setStep = useNavigationStore(state => state.setStep);
  const setShowRetrieveModal = useAuthStore(state => state.setShowRetrieveModal);
  const setShowDrugSearchModal = useNavigationStore(state => state.setShowDrugSearchModal);
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full h-full bg-[#FAFAFA] p-6 relative overflow-x-hidden overflow-y-auto flex flex-col items-center justify-between">
      
      {/* Premium Subtle Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none"></div>
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-slate-100 rounded-full blur-[80px] -translate-x-1/2 z-0 pointer-events-none"></div>

      {/* Top Decorator */}
      <div className="w-full pt-12 flex justify-center z-10 shrink-0">
        <div className="px-4 py-1 bg-white/60 backdrop-blur-xl rounded-full text-slate-600 font-bold text-[10px] tracking-widest border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center">
          <ShieldCheck size={12} className="mr-1.5 opacity-80" /> 职工专属医疗财务平台
        </div>
      </div>

      {/* Hero Content (Centered) */}
      <div className="flex-1 w-full flex flex-col items-center justify-center z-10 my-6">
        <PremiumLogo />
        
        <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-widest font-sans drop-shadow-sm">
          职工医惠通
        </h1>
        
        <p className="text-slate-500 text-xs font-medium tracking-widest text-center mt-1">
          每一笔医疗支出 都帮您找到最优解
        </p>

        {/* 3-Column Core Features Section */}
        <div className="w-full mt-10 p-5 bg-white/70 backdrop-blur-2xl rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex justify-between gap-2">
           <FeatureItem icon={Search} title="深度测算" desc="挖掘隐形可报销项" />
           <FeatureItem icon={ShieldAlert} title="防坑防漏" desc="打破医疗信息差" />
           <FeatureItem icon={Gift} title="专属福利" desc="医保/商保/工会全打通" />
        </div>
      </div>

      {/* Action Buttons (Bottom Attached) */}
      <div className="w-full space-y-3.5 z-10 shrink-0 pb-6 w-full max-w-[340px] mx-auto">
        
        {/* Primary CTA: AI Wizard Tool */}
        <button 
          onClick={() => setStep('wizard')} 
          className="w-full relative overflow-hidden bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.2)] flex justify-center items-center active:scale-[0.98] transition-all outline-none border border-slate-800"
        >
           {/* Subtle reflection on button */}
           <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
           <Sparkles size={16} className="text-slate-300 mr-2" /> 
           开启专属智能测算
        </button>

        {/* Secondary CTA: Union Dashboard (Home) */}
        <button 
          onClick={() => navigate('/dashboard')} 
          className="w-full bg-white text-slate-800 font-bold py-3.5 rounded-2xl flex justify-center items-center active:bg-slate-50 transition-all outline-none border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.02)]"
        >
          进入个人应用中心 <ArrowRight className="ml-2 text-slate-400" size={16} />
        </button>

        {/* Third CTA: Search Drug */}
        <button 
          onClick={() => setShowDrugSearchModal(true)} 
          className="w-full bg-white/50 backdrop-blur-sm text-slate-600 font-bold py-3 rounded-2xl flex justify-center items-center hover:bg-white active:bg-white transition-all outline-none border border-slate-200/60"
        >
           <Pill size={14} className="text-slate-400 mr-2" /> 
           按药品/疾病检索专项福利
        </button>

        <div className="flex justify-between mt-6 px-4">
           <button 
            onClick={() => navigate('/welfare')} 
            className="text-slate-400 text-xs flex items-center hover:text-slate-800 transition-colors outline-none font-medium"
          >
            <Heart size={12} className="mr-1" /> 通用健康大厅
          </button>
          <button 
            onClick={() => setShowRetrieveModal(true)} 
            className="text-slate-400 text-xs flex items-center hover:text-slate-800 transition-colors outline-none font-medium underline underline-offset-2"
          >
            历史档案提取
          </button>
        </div>

      </div>
    </div>
  );
};

