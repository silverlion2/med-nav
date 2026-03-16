import React, { Suspense, lazy } from 'react';
import { Gift } from 'lucide-react';
import { useNavigationStore } from './store/navigationStore';
import { Routes, Route } from 'react-router-dom';

// Eagerly Load Home and Shell Elements
import { UnionHomeView } from './views/UnionHomeView';
import { WelfareLibrary } from './components/WelfareLibrary';
import { BottomNav } from './components/BottomNav';
import { WizardView } from './views/WizardView';
import { CalculatingView, HookingView } from './views/OtherViews';
import { AuthModal } from './components/AuthModal';
import { RetrieveModal } from './components/RetrieveModal';
import { ActiveDetailModal } from './components/ActiveDetailModal';
import { LandingView } from './views/LandingView';
import { DrugSearchModal } from './components/DrugSearchModal';

// Lazy Load Secondary Views (Code Splitting)
const ReportView = lazy(() => import('./views/ReportView').then(module => ({ default: module.ReportView })));
const UnionTasksView = lazy(() => import('./views/UnionOtherViews').then(module => ({ default: module.UnionTasksView })));
const UnionB2BView = lazy(() => import('./views/UnionOtherViews').then(module => ({ default: module.UnionB2BView })));

const AppContent = () => {
  const { step } = useNavigationStore();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 sm:p-4 font-sans">
      <div className="w-full sm:max-w-[400px] h-[100dvh] sm:h-[800px] bg-gray-50 sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative sm:border-8 border-0 border-gray-900">
        
        {/* Fake Top Notch for UI */}
        <div className="hidden sm:flex h-6 w-full bg-blue-600 justify-center items-center z-50 absolute top-0">
          <div className="w-1/3 h-4 bg-black rounded-b-xl"></div>
        </div>

        {/* --- MAIN TAB CONTENT (Routed Layer) --- */}
        <div className={`flex-1 overflow-y-auto pb-20 bg-gray-50 sm:pt-6 pt-0 ${step !== 'landing' ? 'hidden' : ''}`}>
          <Suspense fallback={<div className="flex-1 flex items-center justify-center text-gray-400 p-10"><div className="animate-pulse">加载中...</div></div>}>
            <Routes>
              <Route path="/" element={<LandingView />} />
              <Route path="/dashboard" element={<UnionHomeView />} />
              <Route path="/welfare" element={
                <div className="animate-in fade-in duration-300">
                  <div className="bg-white pt-6 pb-2 px-5 border-b sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <Gift className="w-6 h-6 text-blue-600 mr-2" />
                      福利大厅
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">汇聚医保、商保、工会及药企援助资源</p>
                  </div>
                  <div className="px-5 mt-4">
                    <WelfareLibrary />
                  </div>
                </div>
              } />
              <Route path="/result" element={<ReportView />} />
              <Route path="/tasks" element={<UnionTasksView />} />
              <Route path="/b2b" element={<UnionB2BView />} />
            </Routes>
          </Suspense>
        </div>

        {/* --- MED-NAV OVERLAYS (Wizard Layer) --- */}
        {step !== 'landing' && (
          <div className="flex-1 overflow-hidden flex flex-col sm:pt-6 pt-0 bg-gray-50 z-20">
            {step === 'wizard' && <WizardView />}
            {step === 'calculating' && <CalculatingView />}
            {step === 'hook' && <HookingView />}
          </div>
        )}

        {/* Bottom Navigation (Always visible unless overlay takes over) */}
        {step === 'landing' && <BottomNav />}

        {/* Global Modals */}
        <AuthModal />
        <RetrieveModal />
        <ActiveDetailModal />
        <DrugSearchModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppContent />
  );
}