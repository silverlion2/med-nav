import { create } from 'zustand';

export const useNavigationStore = create((set) => ({
  activeTab: 'home', // 'home', 'welfare', 'result', 'tasks', 'b2b'
  step: 'landing',   // Controls overlays: 'landing', 'wizard', 'calculating', 'hook'
  showDrugSearchModal: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setStep: (step) => set({ step: step }),
  setShowDrugSearchModal: (show) => set({ showDrugSearchModal: show }),
  
  resetNavigation: () => set({ activeTab: 'home', step: 'landing', showDrugSearchModal: false })
}));
