import React from 'react';
import { ShieldCheck, Gift, BarChart2 } from 'lucide-react';
import { WelfareLibrary } from '../components/WelfareLibrary';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';

export const UnionHomeView = () => {
  const navigate = useNavigate();
  const { familyRoster, activeProfileId, setActiveProfileId, addFamilyMember, updateFamilyMember } = useDataStore();

  const activeProfile = familyRoster.find(m => m.id === activeProfileId) || familyRoster[0];

  const handleAddMember = () => {
    const name = window.prompt('请输入亲属姓名 (如: 李大爷)');
    if (!name) return;
    const relation = window.prompt('亲属关系 (如: 父亲, 母亲, 配偶)');
    if (!relation) return;
    const unionType = window.prompt('所属医保/工会类型 (如: 城乡居民医保, 新农合, 某企业工会)') || '城乡居民医保';
    
    addFamilyMember({ id: Date.now().toString(), name, relation, unionType });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-blue-600 rounded-b-3xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xl border-2 border-blue-200">
              {activeProfile.name[0]}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {activeProfile.name}，您好
                {activeProfile.relation !== '本人' && <span className="ml-2 text-[10px] bg-blue-500 px-2 py-0.5 rounded-full">代为查询</span>}
              </h2>
              <div className="text-blue-100 text-sm flex items-center mt-1">
                <ShieldCheck className="w-4 h-4 mr-1" /> 
                <select 
                  value={activeProfile.unionType} 
                  onChange={(e) => updateFamilyMember(activeProfile.id, { unionType: e.target.value })}
                  className="bg-transparent text-white border-b border-blue-400 focus:outline-none focus:border-white text-sm pb-0.5 cursor-pointer max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <option value="北京市总工会会员" className="text-gray-800">北京市总工会 (市工会)</option>
                  <option value="朝阳区工会会员" className="text-gray-800">朝阳区工会 (地区工会)</option>
                  <option value="某集团企业工会会员" className="text-gray-800">某集团企业工会 (企业工会)</option>
                  <option value="城乡居民医保" className="text-gray-800">城乡居民医保 / 新农合</option>
                </select>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/b2b')}
            className="flex items-center text-[10px] bg-blue-700/50 hover:bg-blue-700 font-medium px-2 py-1 rounded-lg border border-blue-400/30 transition-colors"
          >
            <BarChart2 className="w-3 h-3 mr-1" /> 管理侧
          </button>
        </div>

        {/* Family Roster UI (亲情账户切换) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          {familyRoster.map(member => (
            <button 
              key={member.id}
              onClick={() => setActiveProfileId(member.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${activeProfileId === member.id ? 'bg-white text-blue-600 border-white shadow-sm' : 'bg-blue-600/50 text-blue-100 border-blue-400/50 hover:bg-blue-500'}`}
            >
              {member.name} ({member.relation})
            </button>
          ))}
          <button 
            onClick={handleAddMember}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-700/40 text-blue-100 hover:bg-blue-700 border border-blue-400/50 border-dashed"
          >
            + 添加家人
          </button>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-800 font-bold text-lg flex items-center">
            <Gift className="w-5 h-5 mr-2 text-blue-600" /> 
            专属福利库
          </h3>
          <button onClick={() => navigate('/welfare')} className="text-xs text-blue-500 font-bold">查看全部</button>
        </div>
        <WelfareLibrary />
      </div>
    </div>
  );
};
