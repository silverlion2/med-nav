import React from 'react';
import { Home, Gift, ScanSearch, CalendarCheck, BarChart3, ListOrdered } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const BottomNav = () => {
  const { activeTab, setActiveTab, setStep, matchedBenefits } = useAppContext();

  return (
    <div className="absolute bottom-0 w-full h-20 bg-white border-t border-gray-200 flex justify-around items-center px-1 pb-4 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-40">
      <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center p-2 w-1/5 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>
        <Home className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-bold">首页</span>
      </button>
      
      <button onClick={() => setActiveTab('welfare')} className={`flex flex-col items-center p-2 w-1/5 ${activeTab === 'welfare' ? 'text-blue-600' : 'text-gray-400'}`}>
        <Gift className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-bold">福利库</span>
      </button>

      {/* 核心操作：AI 找福利 (悬浮式 C位 按钮) */}
      <button onClick={() => setStep('wizard')} className="flex flex-col items-center relative w-1/5 -mt-6">
        <div className={`text-white p-3.5 rounded-full shadow-lg shadow-blue-200 transform transition active:scale-90 flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600`}>
          <ScanSearch className="w-7 h-7" />
        </div>
        <span className="text-[10px] font-bold text-gray-700 mt-1">AI 找福利</span>
      </button>

      {/* When benefits are matched, replace Tasks with Result tab dynamically or keep the menu order */}
      <button onClick={() => setActiveTab('result')} className={`flex flex-col items-center p-2 w-1/5 ${activeTab === 'result' ? 'text-indigo-600' : 'text-gray-400'} ${matchedBenefits ? '' : 'hidden'}`}>
        <ListOrdered className="w-6 h-6 mb-1 text-indigo-500 animate-pulse" />
        <span className="text-[10px] font-bold text-indigo-600 animate-pulse">最优解</span>
      </button>

      <button onClick={() => setActiveTab('tasks')} className={`flex flex-col items-center p-2 w-1/5 ${activeTab === 'tasks' ? 'text-blue-600' : 'text-gray-400'} ${matchedBenefits ? 'hidden' : ''}`}>
        <CalendarCheck className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-bold">报管家</span>
      </button>

      <button onClick={() => setActiveTab('b2b')} className={`flex flex-col items-center p-2 w-1/5 ${activeTab === 'b2b' ? 'text-blue-600' : 'text-gray-400'}`}>
        <BarChart3 className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-bold">工 会</span>
      </button>
    </div>
  );
};
