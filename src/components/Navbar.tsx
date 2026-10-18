import { useState, useRef, useEffect } from 'react';
import { MessageSquare, FileSearch, ShieldAlert, LogOut, BarChart3, Globe, ChevronDown, Activity, CheckSquare, Sun, Moon, Monitor, Menu, Home, UserCheck, LayoutDashboard } from 'lucide-react';
import { cn, triggerHaptic, playUISound } from '../lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import OptiMindsLogo from './OptiMindsLogo';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  setIsSidebarOpen?: (isOpen: boolean) => void;
}

export default function Navbar({ currentTab, setCurrentTab, setIsSidebarOpen }: NavbarProps) {
  const { signOut, user, isAdmin, userProfile } = useAuth();
  const { languageName, setLanguageByName, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    
  ] as const;
  
  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard') || 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Report Analyzer', icon: FileSearch },
    { id: 'machines', label: 'Machine Status', icon: Activity },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-20 relative">
      <div className="px-3 lg:px-6 h-12 flex items-center justify-between">
        
        {/* Mobile Menu Toggle & Brand Container */}
        <div className="flex items-center gap-1 sm:gap-2">
          {setIsSidebarOpen && (
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                triggerHaptic();
                playUISound('toggle');
                setIsSidebarOpen(true);
              }}
              className="p-1.5 sm:p-2 -ml-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 md:hidden transition-colors"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          )}

          {/* Brand */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1 sm:gap-2 lg:gap-3 pr-1 sm:pr-2 lg:pr-4 cursor-pointer group"
            onClick={() => {
              triggerHaptic(10);
              playUISound('tab');
              setCurrentTab('home');
            }}
          >
          <OptiMindsLogo className="w-8 h-8 rounded-xl shadow-md group-hover:shadow-lg transition-shadow" />
          <div>
            <h1 className="font-extrabold text-base tracking-wide text-slate-800 dark:text-white leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors hidden sm:block">OPTIMINDS</h1>
            <div className="text-[9px] uppercase tracking-widest text-orange-600 dark:text-orange-400 font-bold leading-tight hidden sm:block">Safety Intelligence</div>
          </div>
          </motion.div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 hidden md:flex items-center justify-center px-1 lg:px-2 overflow-x-auto hide-scrollbar">
          <div className="flex items-center p-1 space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'dashboard' && (currentTab === 'common-dashboard' || currentTab === 'user-dashboard' || currentTab === 'home'));
              return (
                <div key={item.id} className="flex items-center relative">
                  <motion.button
                    onClick={() => {
                      triggerHaptic(10);
                      playUISound('tab');
                      setCurrentTab(item.id);
                    }}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={cn(
                      "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 whitespace-nowrap z-10",
                      isActive 
                        ? "text-cyan-900 dark:text-cyan-100" 
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 bg-cyan-500/20 dark:bg-cyan-500/30 border border-cyan-500/30 rounded-md -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon className={cn("w-4 h-4", 
    isActive ? 
      (item.id === 'assistant' ? "text-blue-600 dark:text-blue-400" :
       item.id === 'machines' ? "text-orange-600 dark:text-orange-400" :
       item.id === 'analyzer' ? "text-emerald-600 dark:text-emerald-400" :
       item.id === 'analytics' ? "text-purple-600 dark:text-purple-400" : "text-cyan-600 dark:text-cyan-400") 
    : "text-slate-500 dark:text-slate-400")} />
                    {item.label}
                  </motion.button>
                  {index < navItems.length - 1 && (
                    <div className="w-px h-4 bg-slate-300/50 dark:bg-slate-700/50 mx-0.5"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-4 border-l border-slate-200 dark:border-slate-700 shrink-0">
          
          {/* Theme Selector */}
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                triggerHaptic();
                playUISound('toggle');
                setShowThemeMenu(!showThemeMenu);
                setShowLangMenu(false);
              }}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
              title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)} mode`}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </motion.button>

            {showThemeMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowThemeMenu(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Theme
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      playUISound('tab');
                      setTheme('light');
                      setShowThemeMenu(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                      theme === 'light' ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40" : "text-slate-700 dark:text-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Light</span>
                    </div>
                    {theme === 'light' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>}
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      playUISound('tab');
                      setTheme('dark');
                      setShowThemeMenu(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                      theme === 'dark' ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40" : "text-slate-700 dark:text-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                      <span>Dark</span>
                    </div>
                    {theme === 'dark' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>}
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      playUISound('tab');
                      setTheme('system');
                      setShowThemeMenu(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                      theme === 'system' ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40" : "text-slate-700 dark:text-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Monitor className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>System</span>
                    </div>
                    {theme === 'system' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                triggerHaptic();
                playUISound('toggle');
                setShowLangMenu(!showLangMenu);
                setShowThemeMenu(false);
              }}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold hidden sm:inline">{languageName}</span>
              <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            </motion.button>
            
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        triggerHaptic(10);
                        playUISound('tab');
                        setLanguageByName(lang.label as any);
                        setShowLangMenu(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors",
                        languageName === lang.label ? "text-blue-700 bg-blue-50/50 dark:text-cyan-400 dark:bg-cyan-900/30" : "text-slate-700 dark:text-slate-300"
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2 ml-1 pl-2 lg:pl-4 border-l border-slate-200 dark:border-slate-700">
              {user.isAnonymous ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: ["0px 0px 0px rgba(37,99,235,0)", "0px 0px 14px rgba(37,99,235,0.7)", "0px 0px 0px rgba(37,99,235,0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  onClick={() => {
                    triggerHaptic();
                    playUISound('action');
                    signOut();
                  }}
                  className="px-4 py-1.5 bg-blue-700 text-white rounded-md text-xs font-bold hover:bg-blue-800 shadow-md transition-colors border border-blue-500 tracking-wide"
                >
                  Log In
                </motion.button>
              ) : (
                <>
                  <div className="relative">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        triggerHaptic(10);
                        playUISound('toggle');
                        setShowLangMenu(false);
                      }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-950 border border-slate-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md relative group cursor-pointer overflow-hidden ring-2 ring-transparent hover:ring-slate-400 transition-all"
                    >
                      {userProfile?.photoURL ? (
                        <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user.email ? user.email.charAt(0).toUpperCase() : 'U'
                      )}
                      
                      {/* Dropdown Menu on hover/focus within group */}
                      <div className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl border border-slate-200 dark:border-slate-700 z-50 w-64 overflow-hidden flex flex-col text-left">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-950 border border-slate-600 flex items-center justify-center text-white font-extrabold text-xl shadow-sm overflow-hidden mb-3">
                            {userProfile?.photoURL ? (
                              <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              user.email ? user.email.charAt(0).toUpperCase() : 'U'
                            )}
                          </div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName}` : (user.displayName || user.email || 'Guest User')}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">{user.email || 'No email provided'}</div>
                        </div>
                        
                        <div className="p-3 space-y-2 text-xs">
                          <div className="flex justify-between items-center py-1">
                            <span className="text-slate-500 dark:text-slate-400">Role</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {isAdmin ? 'Administrator' : (userProfile?.isEmployee ? 'Employee' : 'User')}
                            </span>
                          </div>
                          {userProfile?.isEmployee && userProfile?.location && (
                            <div className="flex justify-between items-center py-1">
                              <span className="text-slate-500 dark:text-slate-400">Location</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{userProfile.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Admin Badge */}
                      {isAdmin && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white dark:border-slate-900 rounded-full" title={t('nav.admin')}></div>
                      )}
                    </motion.button>
                  </div>
                  
                  <button
                    onClick={signOut}
                    title={t('nav.signout')}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
