import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { LandingView } from './views/LandingView';
import { WizardView } from './views/WizardView';
import { CalculatingView, HookingView, HealthBenefitsView } from './views/OtherViews';
import { ReportView } from './views/ReportView';
import { AuthModal } from './components/AuthModal';
import { RetrieveModal } from './components/RetrieveModal';
import { ActiveDetailModal } from './components/ActiveDetailModal';

const AppContent = () => {
  const { step } = useAppContext();

  return (
    <div className="max-w-md mx-auto h-[100dvh] bg-gray-100 shadow-2xl relative overflow-hidden flex flex-col font-sans">
      {step === 'landing' && <LandingView />}
      {step === 'wizard' && <WizardView />}
      {step === 'calculating' && <CalculatingView />}
      {step === 'hook' && <HookingView />}
      {step === 'report' && <ReportView />}
      {step === 'health_benefits' && <HealthBenefitsView />}

      {/* Global Modals */}
      <AuthModal />
      <RetrieveModal />
      <ActiveDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}