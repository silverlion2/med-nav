import React from 'react';
import { Landmark, Lock } from 'lucide-react';
import { benefitDetails } from '../data/content';
import { useDataStore } from '../store/dataStore';
import { useMedAPI } from '../hooks/useMedAPI';

const FeedbackButtons = ({ itemId }) => {
  const feedback = useDataStore(state => state.feedback);
  const { handleFeedback } = useMedAPI();
  const currentStatus = feedback[itemId];

  return (
    <div className="flex gap-1.5 mt-3">
      <button onClick={(e) => handleFeedback(e, itemId, '不感兴趣')} className={`flex-1 py-1.5 rounded-lg text-[11px] transition-all duration-200 border ${currentStatus === '不感兴趣' ? 'bg-slate-200 text-slate-600 border-slate-300 font-bold' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 font-medium'}`}>暂不需要</button>
      <button onClick={(e) => handleFeedback(e, itemId, '准备申请')} className={`flex-1 py-1.5 rounded-lg text-[11px] transition-all duration-200 border ${currentStatus === '准备申请' ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 font-bold'}`}>加入待办</button>
      <button onClick={(e) => handleFeedback(e, itemId, '已激活')} className={`flex-1 py-1.5 rounded-lg text-[11px] transition-all duration-200 border ${currentStatus === '已激活' ? 'bg-green-600 text-white border-green-600 shadow-md font-bold' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 font-medium'}`}>已办理</button>
    </div>
  );
};

export const BenefitCard = ({ itemId, lineColor = 'bg-slate-300', borderColor = 'border-slate-200', locked = false, onLockedClick = null }) => {
  const { feedback, setActiveDetail } = useDataStore();
  const item = benefitDetails[itemId];
  if (!item) return null;

  const handleClick = () => {
    if (locked && onLockedClick) {
      onLockedClick();
    } else if (!locked) {
      setActiveDetail(item);
    }
  };

  return (
    <div className={`relative pl-6 mb-8 border-l-2 ${borderColor} ${locked ? 'opacity-60 grayscale-[50%]' : ''}`}>
      <div className={`absolute left-[-7px] top-1 w-3 h-3 rounded-full ${locked ? 'bg-slate-300' : lineColor} shadow-sm border-2 border-white`}></div>
      <div className={`text-sm font-bold mb-2 ${locked ? 'text-slate-400' : lineColor.replace('bg-', 'text-')}`}>
        <span className="bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">
          {locked ? '🔒 待解锁' : `⏰ ${item.timeline.split('，')[0]}`}
        </span>
      </div>
      <div 
        className={`p-4 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border relative cursor-pointer transition-all duration-300 ${locked ? 'bg-slate-50 border-slate-200' : feedback[itemId] === '不感兴趣' ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-[0_4px_20px_rgba(29,78,216,0.08)]'}`} 
        onClick={handleClick}
      >
        <div className={`text-[10px] inline-flex items-center px-2 py-0.5 rounded mb-2 border font-bold ${locked ? 'text-slate-500 bg-slate-100 border-slate-200' : 'text-red-700 bg-red-50 border-red-100'}`}>
          <Landmark size={10} className="mr-1" /> {item.sponsor}
        </div>
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className={`font-bold leading-tight flex-1 ${locked ? 'text-slate-600' : 'text-slate-800'}`}>{item.title}</h3>
          <span className={`font-bold text-xs px-2 py-1 rounded shrink-0 border ${locked ? 'text-slate-500 bg-slate-100 border-slate-200' : 'text-red-600 bg-red-50 border-red-100'}`}>💰 {item.savings}</span>
        </div>
        <p className="text-xs text-slate-500 mb-1 line-clamp-2 leading-relaxed">{item.target}</p>
        
        {locked ? (
          <div className="mt-3 py-2 bg-blue-50/50 rounded-lg text-xs text-blue-600 font-bold flex items-center justify-center border border-blue-100/50">
            <Lock size={12} className="mr-1.5" /> 填写档案以智能测算解锁权限
          </div>
        ) : (
          <FeedbackButtons itemId={itemId} />
        )}
      </div>
    </div>
  );
};
