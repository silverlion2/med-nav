import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';
import { useNavigationStore } from '../store/navigationStore';
import { benefitDetails } from '../data/content';

const typeConfig = {
  urgent: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  financial: { icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  insurance: { icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  health: { icon: Heart, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
};

const SummaryCard = React.memo(({ itemId, type }) => {
  const item = benefitDetails[itemId];
  if (!item) return null;

  const config = typeConfig[type] || typeConfig.insurance;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl border ${config.border} bg-white shadow-sm mb-3 flex items-start space-x-3`}>
      <div className={`p-2 rounded-lg ${config.bg} shrink-0 mt-0.5`}>
        <Icon size={20} className={config.color} />
      </div>
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-1 leading-tight">{item.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.target}</p>
        <div className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold text-red-600 bg-red-50 border border-red-100">
          预计省下: {item.savings}
        </div>
      </div>
    </div>
  );
});

export const MatchSummaryView = () => {
  const navigate = useNavigate();
  const resetNavigation = useNavigationStore(state => state.resetNavigation);
  const matchedBenefits = useDataStore(state => state.matchedBenefits);

  const resetToHome = () => {
    resetNavigation();
    navigate('/');
  };
  const viewTimeline = () => navigate('/result');

  // If navigated directly without any scan data
  if (!matchedBenefits) {
    return (
      <div className="flex-1 w-full bg-slate-50 flex items-center justify-center flex-col">
        <div className="text-gray-400 mb-4">没有最新的匹配资料</div>
        <button onClick={resetToHome} className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">返回主导航</button>
      </div>
    );
  }

  const { urgent = [], financial = [], insurance = [], health = [] } = matchedBenefits;
  const totalMatches = urgent.length + financial.length + insurance.length + health.length;

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto relative pb-10">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-500 to-green-600 px-6 pt-12 pb-8 text-white rounded-b-[40px] shadow-lg shrink-0 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full backdrop-blur-sm mb-4">
          <ShieldCheck size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">匹配成功</h1>
        <p className="text-green-50 text-sm">系统根据您的实际情况，找出了以下福利</p>
      </div>

      <div className="px-5 -mt-6 relative z-10 flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 text-center">
          <p className="text-gray-600 mb-1 text-sm">为您精准匹配到</p>
          <div className="text-4xl font-extrabold text-gray-800 tracking-tight">
            <span className="text-green-600 mx-1">{totalMatches}</span>项
          </div>
          <p className="text-xs text-gray-400 mt-2">点击底部的按钮可将它们安排进申请时间轴</p>
        </div>

        <div className="space-y-4">
          <div className="animate-in slide-in-from-bottom-2" style={{ animationDelay: '100ms' }}>
            {urgent.map(id => <SummaryCard key={id} itemId={id} type="urgent" />)}
          </div>
          <div className="animate-in slide-in-from-bottom-2" style={{ animationDelay: '200ms' }}>
            {financial.map(id => <SummaryCard key={id} itemId={id} type="financial" />)}
          </div>
          <div className="animate-in slide-in-from-bottom-2" style={{ animationDelay: '300ms' }}>
            {insurance.map(id => <SummaryCard key={id} itemId={id} type="insurance" />)}
          </div>
          <div className="animate-in slide-in-from-bottom-2" style={{ animationDelay: '400ms' }}>
            {health.map(id => <SummaryCard key={id} itemId={id} type="health" />)}
          </div>

          {totalMatches === 0 && (
             <div className="text-center text-gray-500 p-6 bg-gray-100 rounded-xl">哎呀，目前暂时没有完全匹配的专项福利。</div>
          )}
        </div>
      </div>

      <div className="p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent sticky bottom-0 mt-auto">
        <button 
          onClick={viewTimeline} 
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl flex justify-center items-center shadow-lg shadow-gray-900/20 active:scale-95 transition-transform mb-3"
        >
          查看详细规划申请时间轴 <ArrowRight size={18} className="ml-2" />
        </button>
        <button 
          onClick={resetToHome} 
          className="w-full bg-white text-gray-600 font-bold py-3.5 rounded-2xl flex justify-center items-center border border-gray-200 active:bg-gray-50 transition-colors text-sm"
        >
          <Home size={16} className="mr-2" /> 稍后再看，返回主页
        </button>
      </div>
    </div>
  );
};
