import React from 'react';
import { Stethoscope, Syringe, Zap, Leaf, Lock, Camera, CheckCircle2 } from 'lucide-react';
import { useWizardStore } from '../store/wizardStore';
import { useNavigationStore } from '../store/navigationStore';
import { useDataStore } from '../store/dataStore';

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
        <div className="animate-in slide-in-from-right-4 duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-dashed border-blue-300 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">疾病专属福利已锁定</h4>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              请通过下方智能规划工具补充您的病情信息。<br/>
              AI 将根据您的真实情况，为您精准匹配药企援助金、商保直赔及工会兜底资金。
            </p>
            <button 
              onClick={handleScanClick}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center shadow-md active:bg-blue-700 transition"
            >
              <Camera className="w-5 h-5 mr-2" />
              进入 AI 智能规划
            </button>
          </div>
        </div>
      )}

      {/* 疾病专项已解锁状态: 显示 Med-Nav 算出的结果! */}
      {welfareCategory === 'disease' && hasScanned && matchedBenefits && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg flex items-center border border-green-200 mb-4">
            <CheckCircle2 className="w-4 h-4 mr-1 shrink-0" /> 根据您的专属档案智能匹配到以下可用福利
          </div>
          
          <div className="px-2"> {/* Optional padding to align with Med-Nav cards visually */}
             {matchedBenefits.urgent?.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-red-500" borderColor="border-red-200" />)}
             {matchedBenefits.financial?.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-orange-500" borderColor="border-orange-200" />)}
             {matchedBenefits.insurance?.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-blue-500" borderColor="border-blue-200" />)}
             {matchedBenefits.health?.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-green-500" borderColor="border-green-200" />)}
          </div>
        </div>
      )}
    </div>
  );
};
