import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  phone: '',
  isAgreed: false,
  uniqueCode: '',
  showAuthModal: false,
  showCodeModal: false,
  authError: '',

  showRetrieveModal: false,
  retrievePhone: '',
  retrieveCode: '',
  retrieveError: '',
  isRetrieving: false,

  setPhone: (phone) => set({ phone }),
  setIsAgreed: (agreed) => set({ isAgreed: agreed }),
  setUniqueCode: (code) => set({ uniqueCode: code }),
  setShowAuthModal: (show) => set({ showAuthModal: show }),
  setShowCodeModal: (show) => set({ showCodeModal: show }),
  setAuthError: (error) => set({ authError: error }),

  setShowRetrieveModal: (show) => set({ showRetrieveModal: show }),
  setRetrievePhone: (phone) => set({ retrievePhone: phone }),
  setRetrieveCode: (code) => set({ retrieveCode: code }),
  setRetrieveError: (error) => set({ retrieveError: error }),
  setIsRetrieving: (isRetrieving) => set({ isRetrieving }),

  resetAuth: () => set({
    phone: '',
    isAgreed: false,
    showAuthModal: false,
    showCodeModal: false,
    authError: '',
    showRetrieveModal: false,
    retrievePhone: '',
    retrieveCode: '',
    retrieveError: ''
  })
}));
