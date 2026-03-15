import React from 'react';
import { ShieldCheck, Gift } from 'lucide-react';
import { WelfareLibrary } from '../components/WelfareLibrary';
import { useAppContext } from '../context/AppContext';

export const UnionHomeView = () => {
  const { setActiveTab } = useAppContext();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-blue-600 rounded-b-3xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xl border-2 border-blue-200">
              李
            </div>
            <div>
              <h2 className="text-lg font-bold">李建国，您好</h2>
              <p className="text-blue-100 text-sm flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" /> 北京市总工会会员
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-800 font-bold text-lg flex items-center">
            <Gift className="w-5 h-5 mr-2 text-blue-600" /> 
            专属福利库
          </h3>
          <button onClick={() => setActiveTab('welfare')} className="text-xs text-blue-500 font-bold">查看全部</button>
        </div>
        <WelfareLibrary />
      </div>
    </div>
  );
};
