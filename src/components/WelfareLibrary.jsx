import React from 'react';
import { Stethoscope, Syringe, Zap, Leaf, Lock, Camera, CheckCircle2 } from 'lucide-react';
import { useWizardStore } from '../store/wizardStore';
import { useNavigationStore } from '../store/navigationStore';
import { useDataStore } from '../store/dataStore';
import { BenefitCard } from './BenefitCard';
import { benefitDetails } from '../data/content';

export const WelfareLibrary = () => {
  const { welfareCategory, setWelfareCategory, hasScanned } = useWizardStore();
  const setStep = useNavigationStore(state => state.setStep);
  const matchedBenefits = useDataStore(state => state.matchedBenefits);

  const handleScanClick = () => {
    // Instead of a fake timeout scan, we launch the Med-Nav Wizard
    setStep('wizard');
  };

  return (
    <div className="mt-2">
      <div className="flex p-1 bg-gray-200 rounded-xl mb-4">
        <button 
          onClick={() => setWelfareCategory('preventive')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${welfareCategory === 'preventive' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'}`}
        >
          治未病专区 (4)
        </button>
        <button 
          onClick={() => setWelfareCategory('disease')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${welfareCategory === 'disease' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
        >
          疾病专项福利 {hasScanned ? '' : '🔒'}
        </button>
      </div>
      
      {/* 1. 治未病福利列表 (健康人专属，无需解锁) */}
      {welfareCategory === 'preventive' && (
        <div className="space-y-3 animate-in slide-in-from-left-4 duration-300">
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mr-3">
                <Stethoscope className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">专项高危疾病早筛</p>
                <p className="text-xs text-gray-400">肺结节/消化道肿瘤基因检测</p>
              </div>
            </div>
            <button className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">免费预约</button>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                <Syringe className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">职工及家属疫苗福利</p>
                <p className="text-xs text-gray-400">流感/带状疱疹/HPV特供</p>
              </div>
            </div>
            <p className="text-sm font-bold text-blue-600">工会直补</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-3">
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">员工精力与抗压管理</p>
                <p className="text-xs text-gray-400">知名睡眠与营养专家指导</p>
              </div>
            </div>
            <p className="text-sm font-bold text-orange-600">在线 1V1</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-green-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">中医“治未病”养生专区</p>
                <p className="text-xs text-gray-400">节气膏方/理疗/三伏贴特约</p>
              </div>
            </div>
            <p className="text-sm font-bold text-green-700">专属折扣</p>
          </div>

        </div>
      )}

      {/* 2. 疾病专项福利列表 (生病人群，需AI识别解锁) */}
      {welfareCategory === 'disease' && !hasScanned && (
        <div className="mt-4 animate-in fade-in duration-300">
          <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-xl flex items-center justify-between border border-blue-200 mb-6 shadow-sm sticky top-1 z-10">
            <div className="flex items-center">
               <Lock className="w-4 h-4 mr-2 shrink-0" /> 以下是大病福利全库，内容已加密
            </div>
            <button onClick={handleScanClick} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm active:bg-blue-700 transition-colors">
              智能测算解锁
            </button>
          </div>
          
          <div className="px-2">
            {Object.keys(benefitDetails).map(id => (
              <BenefitCard 
                key={id} 
                itemId={id} 
                locked={true} 
                onLockedClick={handleScanClick} 
              />
            ))}
          </div>
        </div>
      )}

      {/* 疾病专项已解锁状态: 显示 Med-Nav 算出的结果! */}
      {welfareCategory === 'disease' && hasScanned && matchedBenefits && (
        <div className="space-y-3 animate-in fade-in duration-300 mt-4">
          <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg flex items-center border border-green-200 mb-6 sticky top-1 z-10 shadow-sm">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2"><CheckCircle2 className="w-3.5 h-3.5" /></div> 
            已根据您的专属档案解密适用福利
          </div>
          
          <div className="px-2"> 
             {/* 优先展示匹配到的福利 (彩色，可点击) */}
             {matchedBenefits.urgent?.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-red-500" borderColor="border-red-200" />)}
             {matchedBenefits.financial?.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-orange-500" borderColor="border-orange-200" />)}
             {matchedBenefits.insurance?.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-blue-500" borderColor="border-blue-200" />)}
             {matchedBenefits.health?.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-green-500" borderColor="border-green-200" />)}
             {matchedBenefits.clarification?.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-slate-400" borderColor="border-slate-300" />)}

             {/* 其余未匹配到的福利，展示在底部，置灰锁定 */}
             {Object.keys(benefitDetails).map(id => {
                const isMatched = 
                  (matchedBenefits.urgent || []).includes(id) ||
                  (matchedBenefits.financial || []).includes(id) ||
                  (matchedBenefits.insurance || []).includes(id) ||
                  (matchedBenefits.health || []).includes(id) ||
                  (matchedBenefits.clarification || []).includes(id);
                
                if (!isMatched) {
                  return <BenefitCard key={`unmatched-${id}`} itemId={id} locked={true} />;
                }
                return null;
             })}
          </div>
        </div>
      )}
    </div>
  );
};
