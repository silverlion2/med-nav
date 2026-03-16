import React, { useState } from 'react';
import { Search, Phone, Home, Unlock } from 'lucide-react';
import { useWizardStore } from '../store/wizardStore';
import { useAuthStore } from '../store/authStore';
import { useNavigationStore } from '../store/navigationStore';
import { useMedAPI } from '../hooks/useMedAPI';
import { useNavigate } from 'react-router-dom';

export const CalculatingView = () => {
  const loadingText = useWizardStore(state => state.loadingText);
  
  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="relative w-48 h-48 mb-8 animate-pulse border-4 border-blue-500/20 rounded-full flex items-center justify-center shadow-lg shadow-blue-100">
        <Search size={40} className="text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-slate-800">数据库分析匹配中</h2>
      <p className="text-slate-500 text-sm animate-pulse">{loadingText}</p>
    </div>
  );
};

export const HookingView = () => {
  const { handleGenerateCode } = useMedAPI();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBypass = async () => {
    setLoading(true);
    await handleGenerateCode(true, navigate); // pass MVP flag and navigate
    setLoading(false);
  };

  return (
    <div className="flex-1 w-full bg-slate-50 relative flex flex-col overflow-hidden">
      <div className="p-6 filter blur-md opacity-40 flex-1">
        <div className="h-20 bg-white rounded-xl mb-4 border border-slate-200"></div>
        <div className="h-32 bg-white rounded-xl mb-4 border border-slate-200"></div>
      </div>
      <div className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-6 z-10 animate-slide-up border-t border-slate-100">
        <div className="text-center mb-6">
          <div className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-3 border border-green-200">✓ 分析完成</div>
          <h2 className="text-xl font-bold text-slate-800 leading-snug mb-2">系统已为您生成<br/>专属医疗福利匹配报告</h2>
        </div>
        <button onClick={handleBypass} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex justify-center items-center shadow-lg shadow-blue-600/30 active:scale-95 transition-transform">
          <Unlock size={18} className="mr-2" /> {loading ? '正在调取档案...' : '立即查看方案 (内测体验版)'}
        </button>
      </div>
    </div>
  );
};

export const HealthBenefitsView = () => {
  const resetNavigation = useNavigationStore(state => state.resetNavigation);
  const navigate = useNavigate();

  const goHome = () => {
    resetNavigation();
    navigate('/');
  };

  return (
    <div className="flex-1 w-full bg-gray-50 flex flex-col overflow-y-auto relative pb-10">
      <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 pt-10 text-white rounded-b-3xl shadow-md shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">全民日常健康福利</h1>
            <p className="text-sm opacity-90">亚健康预防与常规筛查的“免费午餐”</p>
          </div>
          <button onClick={goHome} className="bg-white/20 px-3 py-1.5 rounded-full flex items-center text-sm"><Home size={16} className="mr-1" /> 主页</button>
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
        <button onClick={goHome} className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl flex justify-center items-center">
           <Home size={18} className="mr-2" /> 返回导航主页
        </button>
      </div>
    </div>
  );
};
