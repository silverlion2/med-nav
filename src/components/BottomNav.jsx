import React from 'react';
import { Home, Gift, ScanSearch, CalendarCheck, BarChart3, ListOrdered } from 'lucide-react';
import { useNavigationStore } from '../store/navigationStore';
import { useDataStore } from '../store/dataStore';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const { setStep } = useNavigationStore();
  const matchedBenefits = useDataStore(state => state.matchedBenefits);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="absolute bottom-0 w-full h-20 bg-white border-t border-gray-200 flex justify-around items-center px-1 pb-4 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-40">
      <button onClick={() => navigate('/')} className={`flex flex-col items-center p-2 w-1/5 ${currentPath === '/' ? 'text-red-600' : 'text-slate-400'}`}>
        <Home className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-bold">首页</span>
      </button>
      
      <button onClick={() => navigate('/welfare')} className={`flex flex-col items-center p-2 w-1/5 ${currentPath === '/welfare' ? 'text-red-600' : 'text-slate-400'}`}>
        <Gift className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-bold">福利库</span>
      </button>

      {/* 核心操作：AI 找福利 (悬浮式 C位 按钮) */}
      <button onClick={() => setStep('wizard')} className="flex flex-col items-center relative w-1/5 -mt-6">
        <div className={`text-white p-3.5 rounded-full shadow-lg shadow-red-200 transform transition active:scale-90 flex items-center justify-center bg-gradient-to-tr from-red-600 to-red-400`}>
          <ScanSearch className="w-7 h-7" />
        </div>
        <span className="text-[10px] font-bold text-slate-700 mt-1">智能分析</span>
      </button>

      {/* When benefits are matched, replace Tasks with Result tab dynamically or keep the menu order */}
      <button onClick={() => navigate('/result')} className={`flex flex-col items-center p-2 w-1/5 ${currentPath === '/result' ? 'text-blue-600' : 'text-slate-400'} ${matchedBenefits ? '' : 'hidden'}`}>
        <ListOrdered className="w-6 h-6 mb-1 text-blue-500 animate-pulse" />
        <span className="text-[10px] font-bold text-blue-600 animate-pulse">专属方案</span>
      </button>

      <button onClick={() => navigate('/tasks')} className={`flex flex-col items-center p-2 w-1/5 ${currentPath === '/tasks' ? 'text-red-600' : 'text-slate-400'} ${matchedBenefits ? 'hidden' : ''}`}>
        <CalendarCheck className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-bold">报销管家</span>
      </button>

      <button onClick={() => navigate('/b2b')} className={`flex flex-col items-center p-2 w-1/5 ${currentPath === '/b2b' ? 'text-red-600' : 'text-slate-400'}`}>
        <BarChart3 className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-bold">工 会</span>
      </button>
    </div>
  );
};
