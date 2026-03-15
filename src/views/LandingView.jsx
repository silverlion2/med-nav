import React from 'react';
import { Activity, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import { useNavigationStore } from '../store/navigationStore';
import { useAuthStore } from '../store/authStore';

export const LandingView = () => {
  const setStep = useNavigationStore(state => state.setStep);
  const setShowRetrieveModal = useAuthStore(state => state.setShowRetrieveModal);

  return (
    <div className="flex-1 w-full bg-orange-50 p-6 relative overflow-x-hidden overflow-y-auto flex flex-col">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-200 rounded-full opacity-50 blur-2xl z-0"></div>
      <div className="flex-1 flex flex-col justify-center relative z-10 pb-8">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-orange-500 shrink-0">
          <Activity size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
          医疗省钱导航 <br /><span className="text-orange-500 text-2xl">您的智能财务规划助手</span>
        </h1>
        <p className="text-gray-600 mb-8">打破医疗信息差，整合全社会医保、公卫、商保与药企援助资金。不卖药，只教您薅政策羊毛。</p>
        <div className="space-y-4 mb-10">
          <div className="flex items-center text-sm text-gray-700 bg-white/60 p-3 rounded-lg"><CheckCircle2 size={18} className="text-green-500 mr-2" /> 纯结构化画像，动态生成专属方案</div>
          <div className="flex items-center text-sm text-gray-700 bg-white/60 p-3 rounded-lg"><CheckCircle2 size={18} className="text-green-500 mr-2" /> 毫秒级匹配上千项福利政策</div>
        </div>
        <button onClick={() => setStep('wizard')} className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 flex justify-center items-center active:scale-95 transition-transform">
          立即免费测算 <ArrowRight className="ml-2" size={20} />
        </button>
        <button onClick={() => setShowRetrieveModal(true)} className="w-full bg-transparent text-orange-600 font-bold py-3.5 rounded-xl border-2 border-orange-200 active:bg-orange-50 transition-colors mt-4 flex justify-center items-center">
          👉 老用户：凭专属码找回报告
        </button>
        <button onClick={() => setStep('health_benefits')} className="w-full bg-white text-green-600 border-2 border-green-100 font-bold py-4 rounded-xl shadow-sm flex justify-center items-center active:scale-95 transition-transform mt-4">
          <Heart size={20} className="mr-2" /> 浏览全民通用健康福利
        </button>
      </div>
    </div>
  );
};
