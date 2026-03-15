import { create } from 'zustand';

export const useDataStore = create((set) => ({
  matchedBenefits: null,
  feedback: {},
  activeDetail: null,

  setMatchedBenefits: (benefits) => set({ matchedBenefits: benefits }),
  setFeedback: (feedback) => set({ feedback }),
  setActiveDetail: (detail) => set({ activeDetail: detail }),

  resetData: () => set({
    matchedBenefits: null,
    feedback: {},
    activeDetail: null
  })
}));
