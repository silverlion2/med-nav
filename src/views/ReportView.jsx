import React from 'react';
import { Home, AlertTriangle, ShieldCheck, Activity, Heart, ChevronLeft, Sparkles, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useNavigationStore } from '../store/navigationStore';
import { useDataStore } from '../store/dataStore';
import { useWizardStore } from '../store/wizardStore';
import { BenefitCard } from '../components/BenefitCard';
import { ClarificationModal } from '../components/ClarificationModal';

export const ReportView = () => {
  const [isClarifyOpen, setIsClarifyOpen] = React.useState(false);
  const [aiSummary, setAiSummary] = React.useState('');
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [hasStreamed, setHasStreamed] = React.useState(false);
  const phone = useAuthStore(state => state.phone);
  const resetNavigation = useNavigationStore(state => state.resetNavigation);
  const matchedBenefits = useDataStore(state => state.matchedBenefits);
  const formData = useWizardStore(state => state.formData);
  const navigate = useNavigate();

  // Stream AI summary when matchedBenefits changes
  React.useEffect(() => {
    if (!matchedBenefits || hasStreamed) return;

    const fetchSummary = async () => {
      setIsStreaming(true);
      setAiSummary('');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      try {
        const res = await fetch('/api/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchedBenefits, profileSummary: formData }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok || !res.body) {
          throw new Error('Stream unavailable');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            setAiSummary(prev => prev + decoder.decode(value, { stream: true }));
          }
        }
      } catch (err) {
        console.warn('AI summary stream failed, using fallback:', err.message);
        // Deterministic fallback
        const { urgent = [], financial = [], insurance = [], health = [], clarification = [] } = matchedBenefits;
        let fallback = "根据您的医疗情况评估：";
        if (urgent.length > 0) fallback += "当前最优先的任务是处理高价值的【红线福利】（如门特或靶向药援助），请务必在自费付款前完成申请。";
        else if (insurance.length > 0 || financial.length > 0) fallback += "系统为您匹配到了【资金报销与兜底】福利，请在出院阶段收集好各种发票清单。";
        else if (health.length > 0) fallback += "目前主要为您匹配到了部分【日常健康福利】。";
        if (clarification.length > 0) fallback += " 此外，有几个潜在福利需要您补充信息才能解锁。";
        setAiSummary(fallback);
      } finally {
        setIsStreaming(false);
        setHasStreamed(true);
      }
    };

    fetchSummary();
  }, [matchedBenefits, hasStreamed, formData]);

  const goHome = () => {
    resetNavigation();
    navigate('/');
  };

  const goBack = () => {
    navigate('/summary');
  };

  const renderDynamicTimeline = () => {
    if (!matchedBenefits) {
      return <div className="text-center text-gray-400 py-10 animate-pulse">正在从云端读取算力结果...</div>;
    }

    const { urgent = [], financial = [], insurance = [], health = [], clarification = [] } = matchedBenefits;
    const hasUrgent = urgent.length > 0;
    const hasFinancial = financial.length > 0;
    const hasInsurance = insurance.length > 0;
    const hasHealth = health.length > 0;
    const hasClarification = clarification.length > 0;

    if (!hasUrgent && !hasFinancial && !hasInsurance && !hasHealth && !hasClarification) {
      return <div className="text-center text-gray-500 py-10">抱歉，系统暂未匹配到对应的福利支持。</div>;
    }

    return (
      <div className="space-y-10">
        {/* AI Streamed Summary */}
        <div className="bg-orange-50/80 border border-orange-100 p-5 rounded-2xl animate-in fade-in duration-300">
          <div className="flex items-center mb-3">
            <Sparkles className="text-orange-500 mr-2" size={20} />
            <h2 className="font-bold text-gray-800">AI 智能分析总结</h2>
            {isStreaming && <div className="ml-2 w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {aiSummary || <span className="text-gray-400 animate-pulse">AI 正在为您分析匹配结果...</span>}
            {isStreaming && <span className="inline-block w-1.5 h-4 bg-orange-500 ml-0.5 animate-pulse align-text-bottom rounded-sm"></span>}
          </p>
        </div>

        {hasUrgent && (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-lg font-bold text-red-500 mb-6 flex items-center"><AlertTriangle size={20} className="mr-2" /> 绝对红线：掏钱前必须申请</h2>
            {urgent.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-red-500" borderColor="border-red-200" />)}
          </div>
        )}
        {hasFinancial && (
          <div className="animate-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-lg font-bold text-orange-500 mb-6 flex items-center"><Activity size={20} className="mr-2" /> 资金破局：大额支付兜底</h2>
            {financial.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-orange-500" borderColor="border-orange-200" />)}
          </div>
        )}
        {hasInsurance && (
          <div className="animate-in slide-in-from-bottom-2 duration-700">
            <h2 className="text-lg font-bold text-blue-500 mb-6 flex items-center"><ShieldCheck size={20} className="mr-2" /> 商业理赔与补充报销</h2>
            {insurance.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-blue-500" borderColor="border-blue-200" />)}
          </div>
        )}
        {hasHealth && (
          <div className="animate-in slide-in-from-bottom-2 duration-1000">
            <h2 className="text-lg font-bold text-green-500 mb-6 flex items-center"><Heart size={20} className="mr-2" /> 羊毛专区：日常健康维护</h2>
            {health.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-green-500" borderColor="border-green-200" />)}
          </div>
        )}
        {hasClarification && (
          <div className="animate-in slide-in-from-bottom-2 duration-1000 pb-6 border-t border-dashed border-gray-200 pt-8">
            <h2 className="text-base font-bold text-gray-600 mb-4 flex items-center"><HelpCircle size={18} className="mr-2 text-gray-400" /> AI 待确认福利</h2>
            <p className="text-xs text-gray-500 mb-4">系统发现以下隐藏福利可能适合您，但在确认几项关键信息前无法直接推荐：</p>
            {clarification.map(id => (
              <div key={id} className="opacity-70 grayscale-[30%] pointer-events-none">
                 <BenefitCard itemId={id} lineColor="bg-gray-400" borderColor="border-gray-200" />
              </div>
            ))}
            <button 
               onClick={() => setIsClarifyOpen(true)}
               className="w-full mt-2 py-3 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors"
            >
              <Sparkles size={16} className="mr-2" /> 补充信息以解锁以上福利
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto relative pb-10">
      <ClarificationModal 
        isOpen={isClarifyOpen} 
        onClose={() => setIsClarifyOpen(false)} 
        clarificationItems={matchedBenefits?.clarification || []} 
      />
      <div className={`p-6 pt-10 text-white rounded-b-3xl shadow-[0_10px_30px_rgba(220,38,38,0.15)] shrink-0 bg-gradient-to-br from-red-600 to-red-700 relative overflow-hidden`}>
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>

        <div className="flex justify-between items-start mb-1 relative z-10 w-full">
          <button onClick={goBack} className="bg-white/20 px-2 py-1.5 rounded-full backdrop-blur-sm flex items-center text-sm active:bg-white/30 transition-colors"><ChevronLeft size={16} /> 返回</button>
          <div className="text-sm opacity-80 mt-1">专属档案：{phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</div>
          <button onClick={goHome} className="bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center text-sm active:bg-white/30 transition-colors"><Home size={16} className="mr-1" /> 主页</button>
        </div>
        <h1 className="text-2xl font-bold mb-4">医疗财务规划与省钱指南</h1>
        <div className="bg-white/20 p-3 rounded-lg flex items-start border border-white/30 backdrop-blur-sm">
          <AlertTriangle size={20} className="text-yellow-200 mr-2 shrink-0 mt-0.5" />
          <div className="text-xs text-gray-100 leading-relaxed">请严格遵循以下时间轴节点申请，防止因错过时机导致无法报销。</div>
        </div>
      </div>

      <div className="p-6 flex-1">
        {renderDynamicTimeline()}
      </div>

      <div className="px-6 pb-6 text-center shrink-0">
         <button onClick={goHome} className="w-full bg-white text-gray-700 font-bold py-3.5 rounded-xl border border-gray-200 mb-4 shadow-sm active:bg-gray-50 flex justify-center items-center">
           <Home size={18} className="mr-2" /> 重新测算 / 返回主页
         </button>
         <p className="text-[10px] text-gray-400">本报告由 AI 规则引擎动态生成。仅供参考，不构成法定核名或临床用药建议。</p>
      </div>
    </div>
  );
};
