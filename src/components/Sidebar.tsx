import { BookOpen, Library, Phone, Settings, Calendar, Activity, CheckSquare, X, MessageSquare, FileSearch, BarChart3, Home, Globe, UserCheck, Sun, Moon, Monitor, LayoutDashboard } from 'lucide-react';
import { cn, triggerHaptic, playUISound } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ currentTab, setCurrentTab, isOpen, setIsOpen }: SidebarProps) {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const navItems = [
    // Consolidated Dashboard Tab
    { id: 'dashboard', label: t('nav.dashboard') || 'Dashboard', icon: LayoutDashboard },

    // Top Nav Items (Mobile & Quick Access)
    { id: 'analyzer', label: 'Report Analyzer', icon: FileSearch, mobileOnly: true },
    { id: 'assistant', label: t('nav.assistant'), icon: MessageSquare, mobileOnly: true },
    { id: 'machines', label: 'Machine Status', icon: Activity },
    
    // Sidebar Items
    { id: 'weekly', label: t('side.weekly'), icon: Calendar },
    { id: 'rules', label: t('side.rules'), icon: BookOpen },
    { id: 'sources', label: t('side.sources'), icon: Library },
    { id: 'help', label: 'Help & Methodology', icon: Phone },
    ...(isAdmin ? [{ id: 'admin', label: t('side.admin'), icon: Settings }] : []),
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden" 
            onClick={() => setIsOpen(false)} 
          />
        )}
      </AnimatePresence>
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-52 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700/50 flex flex-col shadow-2xl md:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between px-3 pt-3">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('side.title')}</div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  triggerHaptic();
                  playUISound('toggle');
                  setIsOpen(false);
                }} 
                className="p-1.5 -mr-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-lg"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="flex-1 py-3 px-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id || (item.id === 'dashboard' && (currentTab === 'common-dashboard' || currentTab === 'user-dashboard' || currentTab === 'home'));
                return (
                  <div key={item.id} className="relative">
                    <motion.button
                      onClick={() => {
                        triggerHaptic(10);
                        playUISound('tab');
                        setCurrentTab(item.id);
                        setIsOpen(false);
                      }}
                      whileTap={{ scale: 0.96 }}
                      className={cn(
                        "relative w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-left group z-10",
                        isActive 
                          ? "text-cyan-900 dark:text-cyan-100" 
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mobile-sidebar-active-pill"
                          className="absolute inset-0 bg-slate-100 dark:bg-slate-800/80 shadow-sm border border-slate-200 dark:border-slate-700/50 rounded-lg -z-10"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <Icon className={cn("w-5 h-5 transition-colors duration-200", 
                         isActive ? 
                           (item.id === 'dashboard' ? "text-cyan-600 dark:text-cyan-400" :
                           item.id === 'assistant' ? "text-blue-600 dark:text-blue-400" :
                           item.id === 'machines' ? "text-orange-500" :
                           item.id === 'analyzer' ? "text-emerald-500" :
                           item.id === 'analytics' ? "text-purple-500" :
                           item.id === 'weekly' ? "text-amber-500" :
                           item.id === 'rules' ? "text-cyan-500" :
                           item.id === 'sources' ? "text-rose-500" :
                           item.id === 'help' ? "text-indigo-500" : "text-blue-700")
                         : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                      )} />
                      {item.label}
                    </motion.button>
                  </div>
                );
              })}
            </div>

            {/* Mobile Sidebar Theme Switcher */}
            <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="px-2 pb-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Appearance
              </div>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(10);
                    playUISound('tab');
                    setTheme('light');
                  }}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    theme === 'light'
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(10);
                    playUISound('tab');
                    setTheme('dark');
                  }}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    theme === 'dark'
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(10);
                    playUISound('tab');
                    setTheme('system');
                  }}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    theme === 'system'
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Auto</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex z-10 w-56 lg:w-60 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex-col shrink-0 overflow-hidden rounded-xl h-fit md:mt-4 md:ml-4 mb-4">
        <div className="py-4 px-3 space-y-1">
          <div className="px-2 pb-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('side.title')}</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id || (item.id === 'dashboard' && (currentTab === 'common-dashboard' || currentTab === 'user-dashboard' || currentTab === 'home'));
            return (
              <div key={item.id} className="relative">
                <motion.button
                  onClick={() => {
                    triggerHaptic(10);
                    playUISound('tab');
                    setCurrentTab(item.id);
                    setIsOpen(false);
                  }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-left group z-10",
                    item.mobileOnly ? "md:hidden" : "",
                    isActive 
                      ? "text-cyan-900 dark:text-cyan-100" 
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {isActive && !item.mobileOnly && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-md -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className={cn("w-5 h-5 transition-colors duration-200", 
                     isActive ? 
                       (item.id === 'dashboard' ? "text-cyan-600 dark:text-cyan-400" :
                       item.id === 'assistant' ? "text-blue-600 dark:text-blue-400" :
                       item.id === 'machines' ? "text-orange-500" :
                       item.id === 'analyzer' ? "text-emerald-500" :
                       item.id === 'analytics' ? "text-purple-500" :
                       item.id === 'weekly' ? "text-amber-500" :
                       item.id === 'rules' ? "text-cyan-500" :
                       item.id === 'sources' ? "text-rose-500" :
                       item.id === 'help' ? "text-indigo-500" : "text-blue-700")
                     : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                  )} />
                  {item.label}
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Desktop Sidebar Appearance Segmented Control */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="grid grid-cols-3 gap-1 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                playUISound('tab');
                setTheme('light');
              }}
              title="Light Theme"
              className={cn(
                "flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-semibold transition-all",
                theme === 'light'
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">Light</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                playUISound('tab');
                setTheme('dark');
              }}
              title="Dark Theme"
              className={cn(
                "flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-semibold transition-all",
                theme === 'dark'
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">Dark</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                playUISound('tab');
                setTheme('system');
              }}
              title="System Theme"
              className={cn(
                "flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-semibold transition-all",
                theme === 'system'
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">Auto</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
