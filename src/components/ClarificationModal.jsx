import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { useWizardStore } from '../store/wizardStore';
import { BenefitEngine } from '../services/BenefitEngine.js';
import benefitData from '../data/dictionary.json';

export const ClarificationModal = ({ isOpen, onClose, clarificationItems }) => {
  const { formData, setFormData } = useWizardStore();
  const { setMatchedBenefits } = useDataStore();
  const [localData, setLocalData] = useState({});
  const [isUnlocking, setIsUnlocking] = useState(false);

  if (!isOpen || !clarificationItems || clarificationItems.length === 0) return null;

  // Aggregate all unique missing fields across all clarification items
  const allMissingFields = new Set();
  clarificationItems.forEach(item => {
    item.missingFields?.forEach(field => allMissingFields.add(field));
  });

  const fields = Array.from(allMissingFields);

  const handleInputChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleUnlock = () => {
    setIsUnlocking(true);
    
    // Simulate a brief calculation delay for better UX
    setTimeout(() => {
      // 1. Merge the new data into the global formData profile
      const updatedProfile = { ...formData };
      
      if (localData.age) {
        updatedProfile.age = parseInt(localData.age, 10);
      }
      
      // If special status was selected, merge it into the existing array or create a new one
      if (localData.special_status) {
        const currentStatus = updatedProfile.special_status || [];
        if (!currentStatus.includes(localData.special_status)) {
           // We map the UI string directly as the tag for simplicity in this MVP
           // If '均无以上身份' is selected, don't add a special tag
           if (localData.special_status !== '均无以上身份') {
              updatedProfile.special_status = [...currentStatus, localData.special_status];
           }
        }
      }

      setFormData(updatedProfile);

      // 2. Re-run the BenefitEngine synchronously on the client side
      // Make sure to pass the actual array, not the wrapper object
      const engine = new BenefitEngine(benefitData.benefits || benefitData);
      const newResults = engine.evaluate(updatedProfile);
      
      // 3. Update the global matches
      setMatchedBenefits(newResults);
      
      setIsUnlocking(false);
      onClose();
    }, 800);
  };

  const renderFieldInput = (field) => {
    switch (field) {
      case 'age':
        return (
          <div key={field} className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">患者真实年龄</label>
            <input 
              type="number" 
              placeholder="请输入年龄 (如: 65)" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={localData.age || ''}
              onChange={(e) => handleInputChange('age', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1.5">部分福利（如免费筛查或特定商业险）有严格的年龄限制。</p>
          </div>
        );
      case 'special_status':
        return (
          <div key={field} className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">特殊身份或隐形资产补充</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
              value={localData.special_status || ''}
              onChange={(e) => handleInputChange('special_status', e.target.value)}
            >
              <option value="" disabled>请选择是否有以下身份...</option>
              <option value="单位工会会员">单位工会会员</option>
              <option value="退役军人/优抚对象">退役军人/优抚对象</option>
              <option value="低保户/特困等困难群体">低保户/特困等困难群体</option>
              <option value="持有商业医疗险/重疾险">持有商业医疗险/重疾险</option>
              <option value="均无以上身份">均无以上身份</option>
            </select>
            <p className="text-xs text-gray-500 mt-1.5">诸如工会互助、民政救助等福利需要对应的身份标签才能解锁。</p>
          </div>
        );
      default:
        // Fallback for any other unexpected missing fields
        return (
          <div key={field} className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">补充信息: {field}</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:w-[400px] sm:rounded-3xl rounded-t-3xl min-h-[50vh] max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
        
        {/* Header */}
        <div className="relative pt-6 pb-4 px-6 border-b border-gray-100 shrink-0">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600 shadow-sm border border-blue-100">
             <Sparkles size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">解锁更多隐藏福利</h2>
          <p className="text-sm text-gray-500 mt-1">系统发现了 {clarificationItems.length} 项非常适合您的潜在福利，只需补充以下细节即可确认是否符合申请条件。</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
           <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl mb-6">
              <h3 className="text-sm font-bold text-blue-800 flex items-center mb-2">
                 <CheckCircle2 size={16} className="mr-1.5 text-blue-500" /> 等待解锁的清单
              </h3>
              <ul className="space-y-1.5">
                 {clarificationItems.map(item => (
                    <li key={item.benefit.id} className="text-xs text-blue-700 font-medium">
                       • {item.benefit.title}
                    </li>
                 ))}
              </ul>
           </div>

           <div className="space-y-2">
              {fields.map(field => renderFieldInput(field))}
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 shrink-0 bg-white">
          <button 
            onClick={handleUnlock}
            disabled={isUnlocking}
            className="w-full py-4 bg-gray-900 border border-transparent rounded-2xl text-white font-bold text-base shadow-[0_4px_14px_0_rgb(0,0,0,30%)] hover:shadow-[0_6px_20px_rgba(0,0,0,23%)] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center active:scale-[0.98]"
          >
            {isUnlocking ? (
              <span className="flex items-center">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                 正在重新测算内核...
              </span>
            ) : (
              <span className="flex items-center">
                 确认补充信息并测算 <ChevronRight size={18} className="ml-1" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
