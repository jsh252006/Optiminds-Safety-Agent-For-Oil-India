import { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthPage from './components/AuthPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import BroadcastBanner from './components/BroadcastBanner';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Bot, Sparkles, Loader2 } from 'lucide-react';
import { audio } from './lib/audio';

// Lazy load heavy components for performance optimization
const DashboardHub = lazy(() => import('./components/DashboardHub'));
const HomeDashboard = lazy(() => import('./components/HomeDashboard'));
const MachineManager = lazy(() => import('./components/MachineManager'));
const SafetyAssistant = lazy(() => import('./components/SafetyAssistant'));
const ReportAnalyzer = lazy(() => import('./components/ReportAnalyzer'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const RuleSearch = lazy(() => import('./components/RuleSearch'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const SourcesPanel = lazy(() => import('./components/SourcesPanel'));
const HelpDesk = lazy(() => import('./components/HelpDesk'));
const WeeklyBriefing = lazy(() => import('./components/WeeklyBriefing'));

// Loading fallback for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center h-full w-full">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAdmin, loading, signInAnonymouslyUser } = useAuth();

  useEffect(() => {
    // If we're done loading and there is no user, automatically sign in anonymously for new visitors
    if (!loading && !user && !sessionStorage.getItem('hasVisitedBefore')) {
      sessionStorage.setItem('hasVisitedBefore', 'true');
      signInAnonymouslyUser().catch((err) => {
        console.warn('Automatic anonymous sign-in skipped:', err?.message || err);
      });
    }
  }, [loading, user, signInAnonymouslyUser]);


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 relative">
      
      
        

      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 overflow-hidden z-10 relative">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0">
          <BroadcastBanner />
          <main className="flex-1 flex flex-col min-h-0 relative bg-slate-50 dark:bg-slate-900 overflow-hidden mt-2 mx-2 mb-2 md:mt-4 md:mx-4 md:mb-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
                className="absolute inset-0 h-full w-full"
              >
                <Suspense fallback={<PageLoader />}>
                  {(currentTab === 'dashboard' || currentTab === 'common-dashboard' || currentTab === 'home') && (
                    <DashboardHub initialView="common" setCurrentTab={setCurrentTab} />
                  )}
                  {currentTab === 'user-dashboard' && (
                    <DashboardHub initialView="your" setCurrentTab={setCurrentTab} />
                  )}
                  {currentTab === 'assistant' && (
                    <SafetyAssistant key={currentTab} mode="general" />
                  )}
                  {currentTab === 'machines' && <MachineManager />}
                  {currentTab === 'analyzer' && <ReportAnalyzer />}
                  {currentTab === 'analytics' && <AnalyticsDashboard />}
                  {currentTab === 'weekly' && <WeeklyBriefing />}
                  {currentTab === 'rules' && <RuleSearch />}
                  {currentTab === 'sources' && <SourcesPanel />}
                  {currentTab === 'help' && <HelpDesk />}
                  {currentTab === 'admin' && isAdmin && <AdminPanel />}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Floating Action Button for Safety Assistant */}
      {currentTab !== 'assistant' && (
        <>
          <AnimatePresence>
            {isAssistantOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="fixed bottom-24 right-6 w-[400px] min-w-[300px] max-w-[90vw] h-[600px] min-h-[400px] max-h-[85vh] z-50 rotate-180 resize overflow-hidden rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-700"
                style={{ direction: 'ltr' }}
              >
                <div className="w-full h-full rotate-180 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden relative rounded-2xl shadow-xl">
                  <div className="bg-slate-900 px-4 py-3 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-white font-semibold text-sm">Oily AI Safety Assistant</span>
                  </div>
                  <button 
                    onClick={() => setIsAssistantOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <Suspense fallback={<PageLoader />}>
                    <SafetyAssistant isFloating={true} />
                  </Suspense>
                </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-red-800 text-white rounded-full shadow-xl shadow-red-900/40 flex items-center justify-center hover:bg-red-900 transition-colors z-50 group border-2 border-amber-500/30"
          >
            {isAssistantOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <div className="relative flex items-center justify-center">
                <Bot className="w-7 h-7 text-amber-400" />
                <Sparkles className="w-4 h-4 text-white absolute -top-1.5 -right-1.5 animate-pulse" />
              </div>
            )}
          </motion.button>
        </>
      )}
    </div>
  );
}
