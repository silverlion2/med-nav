import React from 'react';
import { Search, Phone, Home } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const CalculatingView = () => {
  const { loadingText } = useAppContext();
  
  return (
    <div className="flex-1 w-full bg-gray-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="relative w-48 h-48 mb-8 animate-pulse border-4 border-orange-500/20 rounded-full flex items-center justify-center">
        <Search size={40} className="text-orange-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">AI 引擎分析中</h2>
      <p className="text-gray-400 text-sm animate-pulse">{loadingText}</p>
    </div>
  );
};

export const HookingView = () => {
  const { setShowAuthModal } = useAppContext();

  return (
    <div className="flex-1 w-full bg-gray-50 relative flex flex-col overflow-hidden">
      <div className="p-6 filter blur-md opacity-40 flex-1">
        <div className="h-20 bg-white rounded-xl mb-4"></div>
        <div className="h-32 bg-white rounded-xl mb-4"></div>
      </div>
      <div className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-10 animate-slide-up">
        <div className="text-center mb-6">
          <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-3">✨ 分析完成！</div>
          <h2 className="text-xl font-bold text-gray-800 leading-snug mb-2">系统基于逻辑树匹配了<br/>专属福利与防坑防漏指南</h2>
        </div>
        <button onClick={() => setShowAuthModal(true)} className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl flex justify-center items-center">
          <Phone size={18} className="mr-2" /> 建立档案并解锁报告
        </button>
      </div>
    </div>
  );
};

export const HealthBenefitsView = () => {
  const { resetToHome } = useAppContext();

  return (
    <div className="flex-1 w-full bg-gray-50 flex flex-col overflow-y-auto relative pb-10">
      <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 pt-10 text-white rounded-b-3xl shadow-md shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">全民日常健康福利</h1>
            <p className="text-sm opacity-90">亚健康预防与常规筛查的“免费午餐”</p>
          </div>
          <button onClick={resetToHome} className="bg-white/20 p-2 rounded-full"><Home size={20} /></button>
        </div>
      </div>
      <div className="p-6 flex-1 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
           <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">👩‍⚕️ 妇联/卫健委</div>
           <h3 className="font-bold text-gray-800 mb-1 mt-2">免费“两癌”筛查</h3>
           <p className="text-xs text-gray-500 mb-2">政府向适龄妇女免费提供乳腺癌、宫颈癌筛查。符合条件的确诊困难群体，还可向当地妇联申请 1 万元专属救助金。</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
           <div className="absolute top-0 right-0 bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">🏢 企业工会/HR</div>
           <h3 className="font-bold text-gray-800 mb-1 mt-2">EAP 心理援助与疗休养</h3>
           <p className="text-xs text-gray-500 mb-2">大中型企业工会通常会提供免费的年度疗休养名额，以及覆盖员工全家的 24 小时 EAP 免费心理咨询热线。</p>
        </div>
      </div>
      <div className="px-6 pb-6 shrink-0">
        <button onClick={resetToHome} className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl flex justify-center items-center">
           <Home size={18} className="mr-2" /> 返回导航主页
        </button>
      </div>
    </div>
  );
};
