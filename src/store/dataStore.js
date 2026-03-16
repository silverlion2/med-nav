import { create } from 'zustand';

export const useDataStore = create((set) => ({
  matchedBenefits: null,
  feedback: {},
  activeDetail: null,
  unionType: '北京市总工会会员', // Default union type

  familyRoster: [
    { id: 'self', name: '李建国', relation: '本人', unionType: '北京市总工会会员' }
  ],
  activeProfileId: 'self',

  setMatchedBenefits: (benefits) => set({ matchedBenefits: benefits }),
  setFeedback: (feedback) => set({ feedback }),
  setActiveDetail: (detail) => set({ activeDetail: detail }),
  setUnionType: (type) => set({ unionType: type }),

  addFamilyMember: (member) => set((state) => ({ familyRoster: [...state.familyRoster, member] })),
  setActiveProfileId: (id) => set({ activeProfileId: id }),
  updateFamilyMember: (id, updates) => set((state) => ({
    familyRoster: state.familyRoster.map(m => m.id === id ? { ...m, ...updates } : m)
  })),

  resetData: () => set({
    matchedBenefits: null,
    feedback: {},
    activeDetail: null,
    unionType: '北京市总工会会员',
    familyRoster: [{ id: 'self', name: '李建国', relation: '本人', unionType: '北京市总工会会员' }],
    activeProfileId: 'self'
  })
}));
