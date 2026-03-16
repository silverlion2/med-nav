import React, { useState, useMemo } from 'react';
import { Search, Pill, ExternalLink, X } from 'lucide-react';
import { useNavigationStore } from '../store/navigationStore';
import { useDataStore } from '../store/dataStore';
import { benefitDetails, drugDatabase } from '../data/content';

export const DrugSearchModal = () => {
  const { showDrugSearchModal, setShowDrugSearchModal } = useNavigationStore();
  const { setActiveDetail } = useDataStore();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const results = [];
    Object.keys(drugDatabase).forEach(drug => {
      if (drug.toLowerCase().includes(q)) {
        results.push({ name: drug, benefits: drugDatabase[drug] });
      }
    });
    return results;
  }, [query]);

  if (!showDrugSearchModal) return null;

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-slide-up flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center mb-5 shrink-0">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Pill className="text-blue-500 mr-2" size={20} /> 通过药名找福利
          </h3>
          <button onClick={() => setShowDrugSearchModal(false)} className="text-gray-400 p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="relative mb-4 shrink-0">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="输入药品名称 (如：奥希替尼)" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition-colors text-sm"
            autoFocus 
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {query.trim() && searchResults.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-8">
              未找到相关药品福利信息，请尝试更换关键词
            </div>
          ) : (
            searchResults.map(drug => (
              <div key={drug.name} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                <div className="font-bold text-blue-700 mb-3">{drug.name}</div>
                <div className="space-y-2">
                  {drug.benefits.map(bId => {
                    const bInfo = benefitDetails[bId];
                    if (!bInfo) return null;
                    return (
                      <div 
                        key={bId} 
                        onClick={() => setActiveDetail(bInfo)}
                        className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-bold text-gray-800 text-sm">{bInfo.title}</div>
                          <ExternalLink size={14} className="text-blue-500 shrink-0 ml-2 mt-0.5" />
                        </div>
                        <div className="text-xs text-orange-500 font-medium mb-1">{bInfo.savings}</div>
                        <div className="text-[10px] text-gray-500 line-clamp-1">{bInfo.sponsor}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
