import React from 'react';
import { ShieldCheck, KeySquare, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigationStore } from '../store/navigationStore';
import { useWizardStore } from '../store/wizardStore';
import { useMedAPI } from '../hooks/useMedAPI';
import { useNavigate } from 'react-router-dom';

export const AuthModal = () => {
  const { 
    showAuthModal, setShowAuthModal, 
    showCodeModal, setShowCodeModal,
    phone, setPhone, 
    isAgreed, setIsAgreed,
    authError, uniqueCode
  } = useAuthStore();
  
  const { setStep } = useNavigationStore();
  const setHasScanned = useWizardStore(state => state.setHasScanned);
  const { handleGenerateCode } = useMedAPI();
  const navigate = useNavigate();

  const triggerHaptic = () => {
    if (navigator.vibrate) navigator.vibrate(40);
  };

  const unlockReport = () => {
    triggerHaptic();
    setShowCodeModal(false);
    setHasScanned(true);
    setStep('landing');
    navigate('/result');
  };

  if (showAuthModal) {
    return (
      <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-up">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold text-gray-800 flex items-center"><ShieldCheck className="text-green-500 mr-2" size={20} /> 建立专属医疗档案</h3>
            <button onClick={() => setShowAuthModal(false)} className="text-gray-400">✕</button>
          </div>
          
          <p className="text-xs text-gray-500 mb-4">为方便您日后查阅报告及接收政策更新，请输入手机号。我们将为您生成免密专属查询码。</p>
          
          <input 
            type="tel" 
            placeholder="请输入真实的 11 位手机号码" 
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3 outline-none focus:border-orange-500 transition-colors"
          />
          
          <label className="flex items-start gap-2 mb-4 p-2 bg-gray-50 rounded-lg cursor-pointer">
            <input type="checkbox" checked={isAgreed} onChange={(e) => { triggerHaptic(); setIsAgreed(e.target.checked); }} className="mt-1 shrink-0 accent-orange-500 w-4 h-4" />
            <span className="text-[11px] text-gray-500 leading-tight">我已阅读并同意《隐私保护声明》，已知悉本平台仅提供财务补助信息整合，不提供任何临床医疗建议。</span>
          </label>

          {authError && <div className="text-[11px] text-red-500 mb-3 text-center bg-red-50 p-2 rounded">{authError}</div>}

          <button onClick={() => { triggerHaptic(); handleGenerateCode(); }} className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 flex justify-center items-center">
            <KeySquare size={18} className="mr-2"/> 免费生成专属查询码
          </button>
        </div>
      </div>
    );
  }

  if (showCodeModal) {
    return (
      <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 border border-gray-700">
          <div className="p-8 text-center text-white">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
              <CheckCircle2 size={32} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">档案创建成功！</h3>
            <p className="text-sm text-gray-400 mb-6">这是您的专属找回凭证，请务必截图保存：</p>
            
            <div className="bg-black/50 border border-gray-600 rounded-xl p-4 mb-6 relative">
              <div className="text-[10px] text-gray-500 absolute top-2 left-3">手机号 {phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</div>
              <div className="text-4xl font-mono font-bold tracking-[0.2em] text-orange-400 mt-2">{uniqueCode}</div>
            </div>

            <button onClick={unlockReport} className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl shadow-lg active:scale-95">我已截图保存，立刻看报告</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
