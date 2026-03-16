import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { questions } from '../data/content';

export const useWizardStore = create(
  persist(
    (set, get) => ({
  wizardStep: 0,
  formData: {},
  loadingText: '正在初始化匹配引擎...',
  welfareCategory: 'preventive', // 'preventive' or 'disease'
  hasScanned: false,

  setWizardStep: (step) => set({ wizardStep: step }),
  setFormData: (data) => set({ formData: data }),
  setLoadingText: (text) => set({ loadingText: text }),
  setWelfareCategory: (category) => set({ welfareCategory: category }),
  setHasScanned: (scanned) => set({ hasScanned: scanned }),

  handleOptionSelect: (qId, option, isMulti, onComplete) => {
    const { formData } = get();

    if (isMulti) {
      const current = formData[qId] || [];
      const updated = current.includes(option) ? current.filter(item => item !== option) : [...current, option];
      set({ formData: { ...formData, [qId]: updated } });
    } else {
      set({ formData: { ...formData, [qId]: option } });
    }
  },

  resetWizard: () => set({
    wizardStep: 0,
    formData: {},
    welfareCategory: 'preventive',
    hasScanned: false
  })
    }),
    {
      name: 'med-nav-wizard-storage',
    }
  )
);
