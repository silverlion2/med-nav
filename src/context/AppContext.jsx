import React, { createContext, useContext, useState, useCallback } from 'react';
import { questions } from '../data/content';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Navigation & Wizard State
  const [step, setStep] = useState('landing');
  const [wizardStep, setWizardStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loadingText, setLoadingText] = useState('正在初始化匹配引擎...');
  
  // Data State
  const [matchedBenefits, setMatchedBenefits] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [activeDetail, setActiveDetail] = useState(null);

  // Auth & Profile State
  const [phone, setPhone] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [uniqueCode, setUniqueCode] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [authError, setAuthError] = useState('');

  // Retrieve State
  const [showRetrieveModal, setShowRetrieveModal] = useState(false);
  const [retrievePhone, setRetrievePhone] = useState('');
  const [retrieveCode, setRetrieveCode] = useState('');
  const [retrieveError, setRetrieveError] = useState('');
  const [isRetrieving, setIsRetrieving] = useState(false);

  const resetToHome = useCallback(() => {
    setStep('landing');
    setWizardStep(0);
    setFormData({});
    setFeedback({});
    setActiveDetail(null);
    setPhone('');
    setIsAgreed(false);
    setShowAuthModal(false);
    setShowCodeModal(false);
    setAuthError('');
    setShowRetrieveModal(false);
    setRetrievePhone('');
    setRetrieveCode('');
    setRetrieveError('');
  }, []);

  const handleOptionSelect = useCallback((qId, option, isMulti) => {
    if (isMulti) {
      setFormData(prev => {
        const current = prev[qId] || [];
        const updated = current.includes(option) ? current.filter(item => item !== option) : [...current, option];
        return { ...prev, [qId]: updated };
      });
    } else {
      setFormData(prev => ({ ...prev, [qId]: option }));
      setTimeout(() => {
        setWizardStep(prev => {
          if (prev < questions.length - 1) return prev + 1;
          startCalculation();
          return prev;
        });
      }, 300);
    }
  }, []);

  const startCalculation = useCallback(() => {
    setStep('calculating');
    setTimeout(() => setLoadingText('正在基于逻辑树匹配福利...'), 800);
    setTimeout(() => setLoadingText('正在进行医学与经济排雷...'), 1600);
    setTimeout(() => setLoadingText('正在生成专属智能时间轴...'), 2400);
    setTimeout(() => setStep('hook'), 3200);
  }, []);

  const value = {
    step, setStep,
    wizardStep, setWizardStep,
    formData, setFormData,
    loadingText, setLoadingText,
    matchedBenefits, setMatchedBenefits,
    feedback, setFeedback,
    activeDetail, setActiveDetail,
    phone, setPhone,
    isAgreed, setIsAgreed,
    uniqueCode, setUniqueCode,
    showAuthModal, setShowAuthModal,
    showCodeModal, setShowCodeModal,
    authError, setAuthError,
    showRetrieveModal, setShowRetrieveModal,
    retrievePhone, setRetrievePhone,
    retrieveCode, setRetrieveCode,
    retrieveError, setRetrieveError,
    isRetrieving, setIsRetrieving,
    resetToHome,
    handleOptionSelect,
    startCalculation
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
