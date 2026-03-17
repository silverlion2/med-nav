import React, { useRef, useEffect } from 'react';
import { Home, CheckCircle2, FileText, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/content';
import { useWizardStore } from '../store/wizardStore';
import { useNavigationStore } from '../store/navigationStore';

export const WizardView = () => {
  const { formData, handleOptionSelect } = useWizardStore();
  const { setStep } = useNavigationStore();
  const resetNavigation = useNavigationStore(state => state.resetNavigation);
  const navigate = useNavigate();
  const timersRef = useRef([]);

  // Clear all pending timers on unmount to prevent phantom navigation
  useEffect(() => {
    return () => {
      timersRef.current.forEach(id => clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  const resetToHome = () => {
    timersRef.current.forEach(id => clearTimeout(id));
    timersRef.current = [];
    resetNavigation();
    navigate('/');
  };

  const triggerHaptic = () => {
    if (navigator.vibrate) navigator.vibrate(40);
  };

  const startCalculation = () => {
    setStep('calculating');
    // Start calculation animations (store IDs for cleanup)
    timersRef.current = [
      setTimeout(() => useWizardStore.getState().setLoadingText('正在基于逻辑树匹配福利...'), 800),
      setTimeout(() => useWizardStore.getState().setLoadingText('正在进行医学与经济排雷...'), 1600),
      setTimeout(() => useWizardStore.getState().setLoadingText('正在生成专属智能时间轴...'), 2400),
      setTimeout(() => setStep('hook'), 3200)
    ];
  };

  // Check if at least some questions are answered to allow submission (basic validation)
  // Validate against actual required question IDs instead of key count
  const requiredIds = ['disease', 'location', 'insurance'];
  const isFormValid = requiredIds.every(id => formData[id] !== undefined && formData[id] !== '');

  // Simplified Questionnaire - Only Core Routing Fields
  const coreQuestions = [
    { id: 'disease', title: '患者目前的健康状况或确诊疾病？', options: ['恶性肿瘤 (如肺癌/乳腺癌等)', '慢性病 (糖尿病/高血压等)', '突发意外伤害或重症住院', '暂无特定疾病 (探索日常福利)'] },
    { id: 'location', title: '患者所在省市或参保地？', options: ['北京', '上海', '广州/深圳', '其他省会/新一线', '普通地级市及以下'] },
    { id: 'insurance', title: '患者的基本医保类型？', options: ['职工医保 (国企/事编/普通企业)', '居民医保 (原新农合/老人儿童)', '公费医疗 (军人等)', '无基本医保/未参保'] }
  ];

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Sticky Top Navigation */}
      <div className="bg-white px-5 py-4 flex justify-between items-center shadow-sm z-30 shrink-0">
        <div className="flex items-center space-x-2">
          <FileText className="text-orange-500" size={20} />
          <h1 className="font-bold text-gray-800 text-lg">快速建档智能评估</h1>
        </div>
        <div className="flex space-x-2">
           <button 
            onClick={() => { 
              triggerHaptic(); 
              // Inject mock data for the new schema
              useWizardStore.getState().setFormData({
                disease: '恶性肿瘤 (如肺癌/乳腺癌等)',
                location: '北京',
                insurance: '职工医保 (国企/事编/普通企业)'
              });
              startCalculation(); 
            }} 
            className="text-orange-600 px-3 py-1.5 bg-orange-50 rounded-full active:bg-orange-100 flex items-center text-xs border border-orange-200 font-bold"
          >
            直接出报告 (测试)
          </button>
          <button 
            onClick={resetToHome} 
            className="text-gray-600 p-1.5 bg-gray-100 rounded-full active:bg-gray-200 border border-transparent"
          >
            <Home size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32">
        <p className="text-xs text-gray-500 mb-6 bg-orange-50 p-3 rounded-lg border border-orange-100">
          我们精简了初始问卷。只需回答这3个核心问题，AI 引擎将为您匹配基础福利。部分高级福利 AI 将在报告页进一步与您确认。
        </p>

        <div className="space-y-8">
          {coreQuestions.map((q, qIndex) => (
            <div key={q.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${qIndex * 100}ms` }}>
              <div className="flex items-start mb-4">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 font-bold text-xs flex items-center justify-center mr-3 mt-0.5 shrink-0">
                  {qIndex + 1}
                </div>
                <h2 className="text-base font-bold text-gray-800 leading-snug">
                  {q.title}
                  {q.multi && <span className="ml-2 text-[10px] font-normal text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border">多选</span>}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((opt, idx) => {
                  const isSelected = q.multi ? (formData[q.id] || []).includes(opt) : formData[q.id] === opt;
                  return (
                    <button 
                      key={idx} 
                      onClick={() => { triggerHaptic(); handleOptionSelect(q.id, opt, q.multi); }} 
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 flex justify-between items-center text-sm ${isSelected ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-gray-200 bg-white text-gray-700 hover:border-orange-200'}`}
                    >
                      <span className="leading-snug">{opt}</span>
                      {isSelected && <CheckCircle2 size={16} className="text-orange-500 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pb-8">
        <button 
          onClick={() => {
            if (isFormValid) {
              triggerHaptic();
              startCalculation();
            }
          }}
          className={`w-full flex justify-center items-center py-4 rounded-xl font-bold text-base transition-all shadow-lg ${isFormValid ? 'bg-gray-900 text-white active:scale-95 shadow-gray-900/20' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          <Wand2 size={18} className="mr-2" />
          生成 AI 匹配报告
        </button>
      </div>
    </div>
  );
};
