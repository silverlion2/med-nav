import React from 'react';
import { Landmark } from 'lucide-react';
import { benefitDetails } from '../data/content';
import { useAppContext } from '../context/AppContext';
import { useMedAPI } from '../hooks/useMedAPI';

export const FeedbackButtons = ({ itemId }) => {
  const { feedback } = useAppContext();
  const { handleFeedback } = useMedAPI();
  const currentStatus = feedback[itemId];

  return (
    <div className="flex gap-1.5 mt-2">
      <button onClick={(e) => handleFeedback(e, itemId, '不感兴趣')} className={`flex-1 py-1.5 rounded text-[11px] transition-all duration-200 border ${currentStatus === '不感兴趣' ? 'bg-gray-500 text-white border-gray-500 shadow-inner font-bold' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 font-medium'}`}>不感兴趣</button>
      <button onClick={(e) => handleFeedback(e, itemId, '准备申请')} className={`flex-1 py-1.5 rounded text-[11px] transition-all duration-200 border ${currentStatus === '准备申请' ? 'bg-orange-500 text-white border-orange-500 shadow-md font-bold' : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 font-bold'}`}>准备申请</button>
      <button onClick={(e) => handleFeedback(e, itemId, '已激活')} className={`flex-1 py-1.5 rounded text-[11px] transition-all duration-200 border ${currentStatus === '已激活' ? 'bg-green-500 text-white border-green-500 shadow-inner font-bold' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100 font-medium'}`}>已激活</button>
    </div>
  );
};

export const BenefitCard = ({ itemId, lineColor = 'bg-gray-300', borderColor = 'border-gray-200' }) => {
  const { feedback, setActiveDetail } = useAppContext();
  const item = benefitDetails[itemId];
  if (!item) return null;

  return (
    <div className={`relative pl-6 mb-8 border-l-2 ${borderColor}`}>
      <div className={`absolute left-[-7px] top-1 w-3 h-3 rounded-full ${lineColor} shadow-sm`}></div>
      <div className={`text-sm font-bold mb-2 ${lineColor.replace('bg-', 'text-')}`}>
        ⏰ {item.timeline.split('，')[0]}
      </div>
      <div className={`p-4 rounded-xl shadow-sm border relative cursor-pointer transition-all duration-300 ${feedback[itemId] === '不感兴趣' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100 active:bg-gray-50'}`} onClick={() => setActiveDetail(item)}>
        <div className="text-[10px] text-blue-700 bg-blue-50 inline-flex items-center px-1.5 py-0.5 rounded mb-1.5">
          <Landmark size={10} className="mr-1" /> {item.sponsor}
        </div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 leading-tight pr-2">{item.title}</h3>
          <span className="text-orange-500 font-bold text-xs bg-orange-50 px-1 py-0.5 rounded shrink-0">💰 {item.savings}</span>
        </div>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.target}</p>
        <FeedbackButtons itemId={itemId} />
      </div>
    </div>
  );
};
