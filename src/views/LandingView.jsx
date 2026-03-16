import React from 'react';
import { useNavigationStore } from '../store/navigationStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Pill, ShieldCheck } from 'lucide-react';

// Custom ACFTU Logo SVG (Refined for light background)
const ACFTULogo = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 mb-6 shadow-xl rounded-full bg-white p-1 border-4 border-red-50">
    <circle cx="50" cy="50" r="48" fill="#E60012" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="4 2" />
    {/* Inner Gear */}
    <path d="M50 25 L50 75 M25 50 L75 50 M32 32 L68 68 M32 68 L68 32" stroke="#FFD700" strokeWidth="4" />
    <circle cx="50" cy="50" r="18" fill="#E60012" stroke="#FFD700" strokeWidth="2" />
    {/* "工" Character */}
    <path d="M42 42 L58 42 M50 42 L50 58 M38 58 L62 58" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const LandingView = () => {
  const setStep = useNavigationStore(state => state.setStep);
  const setShowRetrieveModal = useAuthStore(state => state.setShowRetrieveModal);
  const setShowDrugSearchModal = useNavigationStore(state => state.setShowDrugSearchModal);
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full h-full bg-slate-50 p-6 relative overflow-x-hidden overflow-y-auto flex flex-col items-center justify-between">
      
      {/* Immersive Light Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-100/50 via-white to-slate-50 z-0"></div>
      
      {/* Subtle patterns */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-red-500 rounded-full opacity-10 blur-[80px] z-0"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-600 rounded-full opacity-5 blur-[80px] z-0"></div>

      {/* Top Decorator */}
      <div className="w-full pt-12 flex justify-center z-10 shrink-0">
        <div className="px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full text-red-700 font-bold text-[10px] tracking-widest border border-red-200 shadow-sm flex items-center">
          <ShieldCheck size={14} className="mr-1" /> 官方服务入口
        </div>
      </div>

      {/* Hero Content (Centered) */}
      <div className="flex-1 w-full flex flex-col items-center justify-center z-10 my-10">
        <ACFTULogo />
        
        <h1 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-wider font-serif text-center drop-shadow-sm">
          全国总工会<br/><span className="text-red-600">医疗省钱导航</span>
        </h1>
        
        <p className="text-slate-500 text-sm font-medium tracking-wide text-center bg-white/60 px-4 py-1 rounded-full border border-slate-100">
          职工专属健康与财务护盾
        </p>

        <div className="mt-8 border-t border-slate-200/50 pt-4 w-2/3 text-center">
           <p className="text-slate-400 text-[10px] font-bold tracking-widest flex items-center justify-center">
             <Sparkles size={10} className="mr-1 text-orange-400" /> AI 强力驱动
           </p>
        </div>
      </div>

      {/* Action Buttons (Bottom Attached) */}
      <div className="w-full space-y-4 z-10 shrink-0 pb-6">
        
        {/* Primary CTA: Union Dashboard (Home / 首页) - Red/Official */}
        <button 
          onClick={() => navigate('/dashboard')} 
          className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-500/30 flex justify-center items-center active:scale-95 transition-all outline-none border border-red-500"
        >
          进入工会服务大厅 (首页) <ArrowRight className="ml-2" size={18} />
        </button>

        {/* Secondary CTA: AI Wizard Tool - Light Gold/Orange */}
        <button 
          onClick={() => setStep('wizard')} 
          className="w-full bg-white text-slate-800 font-bold py-4 rounded-2xl flex justify-center items-center active:bg-slate-50 transition-all outline-none border border-orange-200 shadow-md shadow-orange-100"
        >
           <Sparkles size={16} className="text-orange-500 mr-2" /> 
           启动 AI 极速测算工具
        </button>

        {/* Third CTA: Search Drug - Blue/Outline */}
        <button 
          onClick={() => setShowDrugSearchModal(true)} 
          className="w-full bg-white text-blue-700 font-bold py-3.5 rounded-2xl flex justify-center items-center active:bg-slate-50 transition-all outline-none border-2 border-blue-50/50 shadow-sm"
        >
           <Pill size={16} className="text-blue-500 mr-2" /> 
           通过药名找专项福利
        </button>

        <div className="flex justify-between mt-6 px-2">
           <button 
            onClick={() => navigate('/welfare')} 
            className="text-slate-500 text-xs flex items-center hover:text-red-600 transition-colors outline-none font-medium"
          >
            <Heart size={12} className="mr-1" /> 通用健康福利
          </button>
          <button 
            onClick={() => setShowRetrieveModal(true)} 
            className="text-slate-500 text-xs hover:text-blue-600 transition-colors outline-none font-medium underline underline-offset-2"
          >
            老用户找回报告
          </button>
        </div>

      </div>
    </div>
  );
};
