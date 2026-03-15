import React from 'react';
import { Gift } from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';

// Union Tabs
import { UnionHomeView } from './views/UnionHomeView';
import { UnionTasksView, UnionB2BView } from './views/UnionOtherViews';
import { WelfareLibrary } from './components/WelfareLibrary';
import { BottomNav } from './components/BottomNav';

// Med-Nav Result Tab
import { ReportView } from './views/ReportView';

// Med-Nav Overlays (Wizard & Calculating)
import { WizardView } from './views/WizardView';
import { CalculatingView, HookingView } from './views/OtherViews';

// Global Modals
import { AuthModal } from './components/AuthModal';
import { RetrieveModal } from './components/RetrieveModal';
import { ActiveDetailModal } from './components/ActiveDetailModal';

const AppContent = () => {
  const { activeTab, step } = useAppContext();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-[400px] h-[800px] bg-gray-50 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative border-8 border-gray-900">
        
        {/* Fake Top Notch for UI */}
        <div className="h-6 w-full bg-blue-600 flex justify-center items-center z-50 absolute top-0">
          <div className="w-1/3 h-4 bg-black rounded-b-xl"></div>
        </div>

        {/* --- MAIN TAB CONTENT (Underlying Layer) --- */}
        <div className={`flex-1 overflow-y-auto pb-20 bg-gray-50 pt-6 ${step !== 'landing' ? 'hidden' : ''}`}>
          
          {activeTab === 'home' && <UnionHomeView />}
          
          {activeTab === 'welfare' && (
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
          )}

          {activeTab === 'result' && <ReportView />}
          
          {activeTab === 'tasks' && <UnionTasksView />}
          
          {activeTab === 'b2b' && <UnionB2BView />}
        </div>

        {/* --- MED-NAV OVERLAYS (Wizard Layer) --- */}
        {step !== 'landing' && (
          <div className="flex-1 overflow-hidden flex flex-col pt-6 bg-gray-50 z-20">
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
      </div>
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