import React from 'react';
import { useDataStore } from '../store/dataStore';

export const ActiveDetailModal = () => {
  const activeDetail = useDataStore(state => state.activeDetail);
  const setActiveDetail = useDataStore(state => state.setActiveDetail);

  if (!activeDetail) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => setActiveDetail(null)}></div>
      <div className="bg-white rounded-t-3xl h-[85vh] flex flex-col animate-slide-up relative z-10">
        <div className="flex items-center justify-between p-5 border-b shrink-0">
          <div className="font-bold text-gray-800 text-lg">福利项目详情指南</div>
          <button onClick={() => setActiveDetail(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{activeDetail.title}</h2>
            <div className="text-orange-500 font-bold text-sm bg-orange-50 inline-block px-2 py-1 rounded">💰 预计节省: {activeDetail.savings}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 mb-1 uppercase">⏰ 核心时间节点要求</div>
            <div className="text-sm text-red-700 font-medium bg-red-50 p-3 rounded-lg">{activeDetail.timeline}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 mb-1 uppercase">👣 申请执行流程</div>
            <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{activeDetail.process}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 mb-1 uppercase">📁 需准备材料</div>
            <div className="text-sm text-gray-800">{activeDetail.materials}</div>
          </div>
        </div>
        <div className="p-5 border-t shrink-0 bg-white pb-8">
          <button onClick={() => setActiveDetail(null)} className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 mb-3">我已了解，返回清单</button>
        </div>
      </div>
    </div>
  );
};
