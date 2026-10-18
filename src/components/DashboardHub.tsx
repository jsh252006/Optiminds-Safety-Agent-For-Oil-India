import { useState, useEffect } from 'react';
import { Globe, UserCheck, BarChart3, ShieldCheck, Plus } from 'lucide-react';
import CommonDashboard from './CommonDashboard';
import YourDashboard from './YourDashboard';
import AnalyticsDashboard from './AnalyticsDashboard';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { cn, triggerHaptic, playUISound } from '../lib/utils';

interface DashboardHubProps {
  initialView?: 'common' | 'your' | 'analytics';
  setCurrentTab: (tab: string) => void;
}

export default function DashboardHub({ initialView = 'common', setCurrentTab }: DashboardHubProps) {
  const [activeDashboard, setActiveDashboard] = useState<'common' | 'your' | 'analytics'>(initialView);
  const { incidentReports } = useData();
  const { user } = useAuth();

  useEffect(() => {
    if (initialView) {
      setActiveDashboard(initialView);
    }
  }, [initialView]);

  // Count user's personal reports
  const userReportCount = incidentReports.filter(r => {
    return (user && r.userId === user.uid) || (user?.email && r.userEmail === user.email) || r.userId === 'user-lead-hse-01';
  }).length;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/60">
      
      {/* Upper Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2.5 shrink-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Upper Navigation Bar Tabs */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner gap-1">
            <button
              onClick={() => {
                triggerHaptic();
                playUISound('tab');
                setActiveDashboard('common');
              }}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
                activeDashboard === 'common'
                  ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm border border-slate-200/60 dark:border-slate-600"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Globe className={cn("w-4 h-4", activeDashboard === 'common' ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400")} />
              <span>Common Dashboard</span>
              <span className={cn(
                "text-[11px] font-extrabold px-1.5 py-0.5 rounded-full transition-colors",
                activeDashboard === 'common' 
                  ? "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300" 
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              )}>
                {incidentReports.length}
              </span>
            </button>

            <button
              onClick={() => {
                triggerHaptic();
                playUISound('tab');
                setActiveDashboard('your');
              }}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
                activeDashboard === 'your'
                  ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm border border-slate-200/60 dark:border-slate-600"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <UserCheck className={cn("w-4 h-4", activeDashboard === 'your' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400")} />
              <span>Your Dashboard</span>
              <span className={cn(
                "text-[11px] font-extrabold px-1.5 py-0.5 rounded-full transition-colors",
                activeDashboard === 'your' 
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300" 
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              )}>
                {userReportCount}
              </span>
            </button>

            <button
              onClick={() => {
                triggerHaptic();
                playUISound('tab');
                setActiveDashboard('analytics');
              }}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
                activeDashboard === 'analytics'
                  ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm border border-slate-200/60 dark:border-slate-600"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <BarChart3 className={cn("w-4 h-4", activeDashboard === 'analytics' ? "text-purple-600 dark:text-purple-400" : "text-slate-500 dark:text-slate-400")} />
              <span>Hazard Analytics</span>
            </button>
          </div>

          {/* Right Controls: Subtitle Indicator & Upload Shortcut */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="text-xs text-slate-500 dark:text-slate-400 hidden lg:flex items-center gap-2">
              {activeDashboard === 'common' && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  Overall enterprise metrics & all uploaded reports
                </span>
              )}
              {activeDashboard === 'your' && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Personal operator profile & action checklist
                </span>
              )}
              {activeDashboard === 'analytics' && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                  Predictive risk matrices & SIF trends
                </span>
              )}
            </div>

            <button
              onClick={() => {
                triggerHaptic();
                playUISound('action');
                setCurrentTab('analyzer');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 rounded-lg text-xs font-semibold transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard View */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeDashboard === 'common' ? (
          <CommonDashboard 
            onSwitchToUserDashboard={() => setActiveDashboard('your')}
            onNavigateToAnalyzer={() => setCurrentTab('analyzer')}
          />
        ) : activeDashboard === 'your' ? (
          <YourDashboard
            onSwitchToCommonDashboard={() => setActiveDashboard('common')}
            onNavigateToAnalyzer={() => setCurrentTab('analyzer')}
            onNavigateToAssistant={(query) => {
              if (query) {
                // Prepopulate question in session
                try {
                  sessionStorage.setItem('optiminds_prefill_query', query);
                } catch (e) {}
              }
              setCurrentTab('assistant');
            }}
          />
        ) : (
          <AnalyticsDashboard />
        )}
      </div>

    </div>
  );
}
