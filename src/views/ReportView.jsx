import React from 'react';
import { Home, AlertTriangle, ShieldCheck, Activity, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useNavigationStore } from '../store/navigationStore';
import { useDataStore } from '../store/dataStore';
import { BenefitCard } from '../components/BenefitCard';

export const ReportView = () => {
  const phone = useAuthStore(state => state.phone);
  const resetNavigation = useNavigationStore(state => state.resetNavigation);
  const matchedBenefits = useDataStore(state => state.matchedBenefits);
  const navigate = useNavigate();

  const goHome = () => {
    resetNavigation();
    navigate('/');
  };

  const renderDynamicTimeline = () => {
    if (!matchedBenefits) {
      return <div className="text-center text-gray-400 py-10 animate-pulse">正在从云端读取算力结果...</div>;
    }

    const { urgent, financial, insurance, health } = matchedBenefits;
    const hasUrgent = urgent?.length > 0;
    const hasFinancial = financial?.length > 0;
    const hasInsurance = insurance?.length > 0;
    const hasHealth = health?.length > 0;

    if (!hasUrgent && !hasFinancial && !hasInsurance && !hasHealth) {
      return <div className="text-center text-gray-500 py-10">抱歉，系统暂未匹配到对应的福利支持。</div>;
    }

    return (
      <>
        {hasUrgent && (
          <div className="mb-10 animate-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-lg font-bold text-red-500 mb-6 flex items-center"><AlertTriangle size={20} className="mr-2" /> 绝对红线：掏钱前必须申请</h2>
            {urgent.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-red-500" borderColor="border-red-200" />)}
          </div>
        )}
        {hasFinancial && (
          <div className="mb-10 animate-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-lg font-bold text-orange-500 mb-6 flex items-center"><Activity size={20} className="mr-2" /> 资金破局：大额支付兜底</h2>
            {financial.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-orange-500" borderColor="border-orange-200" />)}
          </div>
        )}
        {hasInsurance && (
          <div className="mb-10 animate-in slide-in-from-bottom-2 duration-700">
            <h2 className="text-lg font-bold text-blue-500 mb-6 flex items-center"><ShieldCheck size={20} className="mr-2" /> 商业理赔与补充报销</h2>
            {insurance.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-blue-500" borderColor="border-blue-200" />)}
          </div>
        )}
        {hasHealth && (
          <div className="mb-10 animate-in slide-in-from-bottom-2 duration-1000">
            <h2 className="text-lg font-bold text-green-500 mb-6 flex items-center"><Heart size={20} className="mr-2" /> 羊毛专区：日常健康维护</h2>
            {health.map(id => <BenefitCard key={id} itemId={id} lineColor="bg-green-500" borderColor="border-green-200" />)}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto relative pb-10">
      <div className={`p-6 pt-10 text-white rounded-b-3xl shadow-[0_10px_30px_rgba(220,38,38,0.15)] shrink-0 bg-gradient-to-br from-red-600 to-red-700 relative overflow-hidden`}>
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>

        <div className="flex justify-between items-start mb-1 relative z-10">
          <div className="text-sm opacity-80">专属档案：{phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</div>
          <button onClick={goHome} className="bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center text-sm"><Home size={16} className="mr-1" /> 主页</button>
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
         <p className="text-[10px] text-gray-400">本报告基于规则引擎动态生成。不构成临床医疗用药建议。</p>
      </div>
    </div>
  );
};
