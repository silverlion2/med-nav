import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWizardStore } from '../store/wizardStore';
import { useNavigationStore } from '../store/navigationStore';
import { useDataStore } from '../store/dataStore';

export const useMedAPI = () => {
  const handleGenerateCode = useCallback(async (isMVPBypass = false, navigate = null) => {
    const { phone, isAgreed, setAuthError, setUniqueCode, setShowAuthModal, setShowCodeModal } = useAuthStore.getState();
    const { formData, setHasScanned } = useWizardStore.getState();
    const { setStep } = useNavigationStore.getState();
    const { setMatchedBenefits } = useDataStore.getState();

    let currentPhone = phone;
    let currentAgreed = isAgreed;
    
    if (isMVPBypass === true) {
      currentPhone = '13800138000'; // MVP Mock Phone
      currentAgreed = true;
    }

    if (currentPhone.length !== 11 || !/^\d{11}$/.test(currentPhone)) { setAuthError('请输入正确的11位手机号码'); return; }
    if (!currentAgreed) { setAuthError('请先阅读并勾选同意《隐私保护声明》'); return; }
    
    setAuthError('正在向云端数据库安全建档...');
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setUniqueCode(code);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: currentPhone, code, profileData: formData }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.status === 404) {
        setAuthError('⚠️ 错误(404)：当前处于本地环境或API未部署，请推送代码至Vercel线上测试！');
        return;
      }
      if (res.status === 500) {
        setAuthError('⚠️ 错误(500)：Vercel 连不上数据库！请检查 Vercel 的 DATABASE_URL 环境变量，或执行 npx prisma db push 建表！');
        return;
      }

      const data = await res.json();
      
      if (!data.success) {
        setAuthError(`服务器提示：${data.message || '建档失败，请稍后再试'}`);
        return;
      }

      setMatchedBenefits(data.engineResult);
      setShowAuthModal(false);
      
      if (isMVPBypass === true) {
        setHasScanned(true);
        setStep('landing');
        if (navigate) navigate('/summary');
      } else {
        setShowCodeModal(true);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Fetch Error:', error);
      if (error.name === 'AbortError') {
        setAuthError('⚠️ 请求超时，请检查网络连接后重试。');
      } else {
        setAuthError(`⚠️ 网络请求阻断：${error.message}。请刷新页面或检查代理设置。`);
      }
    }
  }, []);

  const handleRetrieve = useCallback(async (navigate = null) => {
    const { retrievePhone, retrieveCode, setRetrieveError, setIsRetrieving, setShowRetrieveModal, setPhone } = useAuthStore.getState();
    const { setFormData, setHasScanned } = useWizardStore.getState();
    const { setStep } = useNavigationStore.getState();
    const { setMatchedBenefits } = useDataStore.getState();

    if (retrievePhone.length !== 11 || !/^\d{11}$/.test(retrievePhone)) { setRetrieveError('请输入正确的11位手机号码'); return; }
    if (retrieveCode.length !== 4 || !/^\d{4}$/.test(retrieveCode)) { setRetrieveError('请输入4位专属查询码'); return; }
    
    setRetrieveError('');
    setIsRetrieving(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch('/api/get-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: retrievePhone, code: retrieveCode }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.status === 404) { setRetrieveError('⚠️ 错误：API不存在，请推送到 Vercel 在线测试！'); setIsRetrieving(false); return; }
      if (res.status === 500) { setRetrieveError('⚠️ 错误：数据库连接异常，请检查 Vercel DATABASE_URL。'); setIsRetrieving(false); return; }

      const data = await res.json();

      if (data.success) {
        setFormData(data.profileData || {});
        setMatchedBenefits(data.engineResult);
        setPhone(retrievePhone);
        setShowRetrieveModal(false);
        setHasScanned(true);
        setStep('landing');
        if (navigate) navigate('/summary');
      } else {
        setRetrieveError(data.message || '查询不到该档案');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        setRetrieveError('网络请求超时，请检查网络连接');
      } else {
        setRetrieveError('网络异常，请推送到 Vercel 线上环境测试');
      }
    } finally {
      useAuthStore.getState().setIsRetrieving(false);
    }
  }, []);

  const handleFeedback = useCallback((e, itemId, status) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const { phone } = useAuthStore.getState();
    const { setFeedback } = useDataStore.getState();
    
    setFeedback(prev => ({ ...prev, [itemId]: status }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch('/api/save-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: phone || 'anonymous-user', feedbackData: { benefitId: itemId, action: status, time: new Date().toISOString() }}),
      signal: controller.signal
    }).catch(error => console.error('埋点失败:', error))
      .finally(() => clearTimeout(timeoutId));
  }, []);

  return { handleGenerateCode, handleRetrieve, handleFeedback };
};
