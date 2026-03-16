import React from 'react';
import { FileText, CheckCircle2, BarChart3, Activity } from 'lucide-react';

export const UnionTasksView = () => {
  return (
    <div className="animate-in fade-in duration-300 p-5">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FileText className="w-6 h-6 text-indigo-600 mr-2" />
          报销追踪管家
        </h2>
        <p className="text-xs text-gray-500 mt-1">资金福利流转进度与时间线追踪</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 pt-8 mb-6 ml-6">
        <div className="relative border-l-2 border-gray-200 ml-1 space-y-8">
          <div className="relative">
            <div className="absolute -left-[45px] top-4 bg-white text-[11px] font-bold text-gray-400 py-1 pr-1">10月12日</div>
            <div className="absolute -left-[6px] top-6 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            <div className="pl-6 pt-5">
              <p className="text-sm font-bold text-gray-800">药企援助项目核销已达成</p>
              <p className="text-xs text-gray-500 mt-1">通过国家慈善总会渠道完成抵扣 ¥500</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-[45px] top-4 bg-white text-[11px] font-bold text-purple-600 py-1 pr-1">预计今日</div>
            <div className="absolute -left-[7px] top-6 w-3 h-3 bg-purple-500 rounded-full border-2 border-white animate-pulse"></div>
            <div className="pl-6 pt-5">
              <p className="text-sm font-bold text-purple-600">工会互助理赔审核中</p>
              <p className="text-xs text-gray-500 mb-2 mt-1">AI已将发票脱敏并分发至官方理赔中心</p>
              <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">预计3日内打款至您的医保绑定的银行卡</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-[45px] top-4 bg-white text-[11px] font-bold text-gray-400 py-1 pr-1">10月28日</div>
            <div className="absolute -left-[6px] top-6 w-2.5 h-2.5 bg-slate-300 rounded-full border-2 border-white"></div>
            <div className="pl-6 pt-5 opacity-60">
              <p className="text-sm font-bold text-slate-600">大病医疗退税额度记账</p>
              <p className="text-xs text-gray-500 mt-1">将于月底由税务局进行累计合并</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UnionB2BView = () => {
  return (
    <div className="animate-in fade-in duration-300 p-5 bg-slate-900 min-h-[100dvh] text-white pb-24">
      <h2 className="text-xl font-bold mb-2 flex items-center">
        <BarChart3 className="w-6 h-6 mr-2 text-blue-400" />
        工会专属控制台
      </h2>
      <p className="text-slate-400 text-xs mb-6">年度职工健康资产与减负大屏</p>

      {/* 核心指标：外界资金争取 */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-1 rounded-bl-lg">核心成效</div>
        <p className="text-slate-400 text-xs mb-1">为职工争取外部额外资金汇总</p>
        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-bold text-emerald-400 mr-1">¥ 324.5</span>
          <span className="text-sm text-emerald-500">万</span>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-4 mt-2">
          <div>
            <p className="text-slate-400 text-[10px] mb-1">深度覆盖慢病职工</p>
            <p className="text-lg font-bold text-white">1,250<span className="text-xs font-normal text-slate-500 ml-1">人</span></p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] mb-1">人均自费减负</p>
            <p className="text-lg font-bold text-blue-400">-¥ 2,596<span className="text-xs font-normal text-slate-500 ml-1">/人</span></p>
          </div>
        </div>
      </div>

      {/* 福利通道激活率 (Adoption) */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mb-6">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-indigo-400" />
          各项福利通道激活与使用率
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">药品援助项目 (PAP)</span>
              <span className="text-red-400 font-bold">68%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-red-400 h-1.5 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">商保/惠民保补充理赔</span>
              <span className="text-purple-400 font-bold">45%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-purple-400 h-1.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">工会互助金兜底报销</span>
              <span className="text-orange-400 font-bold">78%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
