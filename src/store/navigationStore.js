import { create } from 'zustand';

export const useNavigationStore = create((set) => ({
  activeTab: 'home', // 'home', 'welfare', 'result', 'tasks', 'b2b'
  step: 'landing',   // Controls overlays: 'landing', 'wizard', 'calculating', 'hook'

  setActiveTab: (tab) => set({ activeTab: tab }),
  setStep: (step) => set({ step: step }),
  
  resetNavigation: () => set({ activeTab: 'home', step: 'landing' })
}));
