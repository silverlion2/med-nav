import React from 'react';
import { Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useMedAPI } from '../hooks/useMedAPI';

export const RetrieveModal = () => {
  const {
    showRetrieveModal, setShowRetrieveModal,
    retrievePhone, setRetrievePhone,
    retrieveCode, setRetrieveCode,
    retrieveError, isRetrieving
  } = useAppContext();
  const { handleRetrieve } = useMedAPI();

  if (!showRetrieveModal) return null;

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-slide-up">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-800 flex items-center"><Search className="text-orange-500 mr-2" size={20} /> 找回专属医疗档案</h3>
          <button onClick={() => setShowRetrieveModal(false)} className="text-gray-400 p-1">✕</button>
        </div>
        <div className="space-y-4 mb-6">
          <input 
            type="tel" 
            placeholder="请输入预留手机号" 
            value={retrievePhone} 
            onChange={(e) => setRetrievePhone(e.target.value.replace(/\D/g, '').slice(0, 11))} 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 outline-none focus:border-orange-500 transition-colors text-sm" 
          />
          <input 
            type="text" 
            placeholder="请输入4位专属码" 
            value={retrieveCode} 
            onChange={(e) => setRetrieveCode(e.target.value.replace(/\D/g, '').slice(0, 4))} 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 outline-none focus:border-orange-500 transition-colors tracking-widest font-mono text-lg text-center" 
          />
        </div>
        {retrieveError && <div className="text-xs text-red-500 mb-4 text-center bg-red-50 p-2 rounded">{retrieveError}</div>}
        <button onClick={handleRetrieve} disabled={isRetrieving} className={`w-full text-white font-bold py-3.5 rounded-xl flex justify-center items-center ${isRetrieving ? 'bg-orange-300' : 'bg-orange-500 active:scale-95'}`}>
          {isRetrieving ? '努力查询中...' : '一键找回报告'}
        </button>
      </div>
    </div>
  );
};
