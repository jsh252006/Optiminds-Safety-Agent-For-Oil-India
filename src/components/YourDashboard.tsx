import { useState, useMemo, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, Shield, ShieldCheck, Mail, MapPin, Briefcase, 
  FileText, CheckCircle2, Clock, AlertTriangle, Plus, 
  ExternalLink, Edit3, Sparkles, MessageSquare, ChevronDown, 
  ChevronUp, Check, X, ShieldAlert, Award
} from 'lucide-react';
import { safeFormatDate } from '../lib/utils';
import { IncidentReport } from '../types';

interface YourDashboardProps {
  onSwitchToCommonDashboard?: () => void;
  onNavigateToAnalyzer?: () => void;
  onNavigateToAssistant?: (query?: string) => void;
}

export default function YourDashboard({ 
  onSwitchToCommonDashboard, 
  onNavigateToAnalyzer,
  onNavigateToAssistant 
}: YourDashboardProps) {
  const { incidentReports, updateIncidentReport, addIncidentReport } = useData();
  const { user, userProfile } = useAuth();

  // Local Profile state (persisted in localStorage for convenience)
  const [profileName, setProfileName] = useState(() => {
    return user?.displayName || (userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : '') || localStorage.getItem('optiminds_user_name') || 'Field Safety Engineer';
  });
  const [profileRole, setProfileRole] = useState(() => {
    return localStorage.getItem('optiminds_user_role') || 'Senior HSE Inspector & Operations Lead';
  });
  const [profileFacility, setProfileFacility] = useState(() => {
    return localStorage.getItem('optiminds_user_facility') || 'Oil India Limited - Duliajan Field HQ';
  });
  const [profilePhone, setProfilePhone] = useState(() => {
    return localStorage.getItem('optiminds_user_phone') || '+91 374 280 0555';
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(profileName);
  const [tempRole, setTempRole] = useState(profileRole);
  const [tempFacility, setTempFacility] = useState(profileFacility);
  const [tempPhone, setTempPhone] = useState(profilePhone);

  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [recentQueries, setRecentQueries] = useState<Array<{ id?: string; query: string; createdAt?: string }>>([]);

  // Fetch recent queries from Cloud SQL / relational backend
  useEffect(() => {
    async function loadRecentQueries() {
      try {
        let token = '';
        if (user) {
          token = await user.getIdToken();
        }
        const res = await fetch('/api/queries', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setRecentQueries(data.slice(0, 6));
          }
        }
      } catch (e) {
        console.warn('Could not fetch SQL queries', e);
      }
    }
    loadRecentQueries();
  }, []);

  const handleSaveProfile = () => {
    setProfileName(tempName);
    setProfileRole(tempRole);
    setProfileFacility(tempFacility);
    setProfilePhone(tempPhone);
    localStorage.setItem('optiminds_user_name', tempName);
    localStorage.setItem('optiminds_user_role', tempRole);
    localStorage.setItem('optiminds_user_facility', tempFacility);
    localStorage.setItem('optiminds_user_phone', tempPhone);
    setIsEditingProfile(false);
  };

  // Filter reports uploaded by the current user
  const yourReports = useMemo(() => {
    if (!user) {
      // If not logged in, match by local authored flag or user-lead-hse-01 sample
      return incidentReports.filter(r => r.userId === 'user-lead-hse-01' || r.userName?.toLowerCase().includes('rahul') || r.userId === 'local-user');
    }

    const matched = incidentReports.filter(r => {
      const matchUid = r.userId && r.userId === user.uid;
      const matchEmail = user.email && r.userEmail && r.userEmail.toLowerCase() === user.email.toLowerCase();
      const matchName = user.displayName && r.userName && r.userName.toLowerCase() === user.displayName.toLowerCase();
      return matchUid || matchEmail || matchName;
    });

    // If user has no personal reports yet, include any tagged user-lead-hse-01 so the dashboard is immediately demonstrative
    if (matched.length === 0) {
      return incidentReports.filter(r => r.userId === 'user-lead-hse-01' || r.userId === 'local-user');
    }

    return matched;
  }, [incidentReports, user]);

  // Personal statistics
  const personalStats = useMemo(() => {
    const totalReports = yourReports.length;
    let potentialSifCount = 0;
    let totalActions = 0;
    let completedActions = 0;

    yourReports.forEach(r => {
      if (r.analysis?.sifClassification?.includes('Potential SIF')) {
        potentialSifCount++;
      }
      if (r.preventiveActions) {
        totalActions += r.preventiveActions.length;
        completedActions += r.preventiveActions.filter(a => a.status === 'COMPLETED').length;
      }
    });

    const pendingActions = totalActions - completedActions;
    const completionRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 100;
    
    const avgRisk = totalReports > 0 
      ? Math.round(yourReports.reduce((acc, r) => acc + (r.analysis?.riskScore || 50), 0) / totalReports)
      : 0;

    return {
      totalReports,
      potentialSifCount,
      totalActions,
      completedActions,
      pendingActions,
      completionRate,
      avgRisk
    };
  }, [yourReports]);

  // Toggle action status
  const handleToggleActionStatus = async (reportId: string, actionId: string) => {
    const report = incidentReports.find(r => r.id === reportId);
    if (!report || !report.preventiveActions) return;

    const updatedActions = report.preventiveActions.map(act => {
      if (act.id === actionId) {
        const nextStatus = act.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        return {
          ...act,
          status: nextStatus as 'COMPLETED' | 'PENDING',
          dateCompleted: nextStatus === 'COMPLETED' ? new Date().toISOString() : undefined
        };
      }
      return act;
    });

    await updateIncidentReport(reportId, { preventiveActions: updatedActions });
  };

  // Quick helper to claim a sample report to current user
  const handleClaimSampleReport = async () => {
    const available = incidentReports.find(r => r.userId !== user?.uid);
    if (!available) return;

    await updateIncidentReport(available.id, {
      userId: user?.uid || 'local-user',
      userEmail: user?.email || undefined,
      userName: profileName
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Top Personal Profile & Identity Banner */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* User Identity Details */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-lg shadow-blue-500/20">
                  {profileName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center" title="Active">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {profileName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Verified Operator
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {profileRole}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profileFacility}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {user?.email || 'authenticated.field@oilindia.in'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 pt-1">
                  Employee ID: <span className="font-mono text-slate-600 dark:text-slate-300">{user?.uid ? user.uid.substring(0, 10).toUpperCase() : 'OIL-IND-9402'}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Header Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setTempName(profileName);
                  setTempRole(profileRole);
                  setTempFacility(profileFacility);
                  setTempPhone(profilePhone);
                  setIsEditingProfile(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm rounded-xl transition-all"
              >
                <Edit3 className="w-4 h-4 text-slate-500" />
                Edit Profile
              </button>

              {onNavigateToAnalyzer && (
                <button
                  onClick={onNavigateToAnalyzer}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Upload Report
                </button>
              )}

              {onSwitchToCommonDashboard && (
                <button
                  onClick={onSwitchToCommonDashboard}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
                >
                  Switch to Common Dashboard
                </button>
              )}
            </div>
          </div>

          {/* Personal Key Indicators Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/60">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Reports Authored</div>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{personalStats.totalReports}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Uploaded by your account</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">SIF Cases Flagged</div>
              <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{personalStats.potentialSifCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">High potential incidents</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Actions Completed</div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{personalStats.completedActions} <span className="text-sm font-normal text-slate-400">/ {personalStats.totalActions}</span></div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">{personalStats.completionRate}% resolution rate</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Safety Streak</div>
              <div className="text-2xl font-extrabold text-amber-500 mt-1 flex items-center gap-1">
                18 <span className="text-xs font-bold text-amber-600">DAYS</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Continuous incident tracking</div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Content: Your Reports vs Your Actions & Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Your Uploaded Reports (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Reports Uploaded By You ({yourReports.length})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Operational incident reports created or submitted by your identity
                  </p>
                </div>

                {onNavigateToAnalyzer && (
                  <button
                    onClick={onNavigateToAnalyzer}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Upload New
                  </button>
                )}
              </div>

              {/* Reports List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {yourReports.length === 0 ? (
                  <div className="py-12 px-6 text-center space-y-3">
                    <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No reports linked to your profile yet
                    </div>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Upload your first incident report via Report Analyzer or link an operational benchmark report to explore your personal metrics.
                    </p>
                    <div className="flex justify-center gap-2 pt-2">
                      {onNavigateToAnalyzer && (
                        <button
                          onClick={onNavigateToAnalyzer}
                          className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow hover:bg-blue-500 transition-colors"
                        >
                          Upload Report Now
                        </button>
                      )}
                      <button
                        onClick={handleClaimSampleReport}
                        className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        Link Sample Report
                      </button>
                    </div>
                  </div>
                ) : (
                  yourReports.map((report) => {
                    const isExpanded = expandedReportId === report.id;
                    const isSif = report.analysis?.sifClassification?.includes('Potential SIF');
                    const riskScore = report.analysis?.riskScore || 0;

                    return (
                      <div key={report.id} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-750/30">
                        <div 
                          className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          onClick={() => setExpandedReportId(prev => prev === report.id ? null : report.id)}
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                riskScore >= 75 ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300' :
                                riskScore >= 40 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                                'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              }`}>
                                {report.incidentSeverity || (riskScore >= 75 ? 'Critical' : riskScore >= 40 ? 'Moderate' : 'Low')}
                              </span>

                              {isSif && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                                  SIF Precursor
                                </span>
                              )}

                              <span className="text-xs text-slate-400">
                                {safeFormatDate(report.date || report.createdAt)}
                              </span>
                            </div>

                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                              {report.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              {report.site && (
                                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  {report.site}
                                </span>
                              )}
                              {report.activity && (
                                <span>{report.activity}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="text-[10px] text-slate-400 font-semibold uppercase">Risk Score</div>
                              <div className={`text-base font-extrabold ${
                                riskScore >= 70 ? 'text-red-600' : riskScore >= 40 ? 'text-amber-600' : 'text-emerald-600'
                              }`}>
                                {riskScore} / 100
                              </div>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-500">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </div>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                              {report.description}
                            </p>

                            {report.preventiveActions && report.preventiveActions.length > 0 && (
                              <div className="space-y-1.5">
                                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                  Assigned Actions
                                </div>
                                <div className="space-y-1">
                                  {report.preventiveActions.map(act => (
                                    <div 
                                      key={act.id} 
                                      onClick={() => handleToggleActionStatus(report.id, act.id)}
                                      className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs cursor-pointer hover:border-blue-300 transition-colors"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                          act.status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'
                                        }`}>
                                          {act.status === 'COMPLETED' && <Check className="w-3 h-3" />}
                                        </div>
                                        <span className={act.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}>
                                          {act.text}
                                        </span>
                                      </div>
                                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                        act.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                      }`}>
                                        {act.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {onNavigateToAnalyzer && (
                              <div className="flex justify-end pt-1">
                                <button
                                  onClick={onNavigateToAnalyzer}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  Open full analysis in Report Analyzer <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Your Action Checklist & Recent Q&A (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Interactive Personal Action Tracker */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Your Preventive Actions Tracker
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click an action to toggle completion status
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                  {personalStats.completedActions} Done
                </span>
              </div>

              {/* Action checklist items */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {yourReports.flatMap(r => (r.preventiveActions || []).map(a => ({ ...a, reportId: r.id, reportTitle: r.title }))).length === 0 ? (
                  <div className="text-xs text-slate-400 italic py-6 text-center">
                    No preventive actions registered under your reports.
                  </div>
                ) : (
                  yourReports.flatMap(r => (r.preventiveActions || []).map(a => ({ ...a, reportId: r.id, reportTitle: r.title }))).map((act) => (
                    <div 
                      key={act.id}
                      onClick={() => handleToggleActionStatus(act.reportId, act.id)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-750/50 cursor-pointer transition-colors space-y-1.5"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 ${
                          act.status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}>
                          {act.status === 'COMPLETED' && <Check className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium leading-snug ${act.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {act.text}
                          </p>
                          <div className="text-[10px] text-slate-400 truncate mt-1">
                            Ref: {act.reportTitle}
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                          act.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {act.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Your Recent Safety Q&A Inquiries (from Cloud SQL / backend) */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    Your Recent Safety Inquiries
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Synced with Cloud SQL safety log
                  </p>
                </div>

                {onNavigateToAssistant && (
                  <button
                    onClick={() => onNavigateToAssistant()}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Open Assistant
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {recentQueries.length === 0 ? (
                  <div className="text-xs text-slate-400 italic py-4 text-center">
                    No recent inquiries recorded. Ask a question to start logging.
                  </div>
                ) : (
                  recentQueries.map((item, idx) => (
                    <div 
                      key={item.id || idx}
                      onClick={() => onNavigateToAssistant && onNavigateToAssistant(item.query)}
                      className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-900/40 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer transition-colors text-xs flex items-center justify-between gap-2"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        "{item.query}"
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Safety Champion Recognition Card */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  Certified Safety Contributor
                </div>
                <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                  Proactive reporting and 100% adherence to Stop Work Authority (SWA) protocols.
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                Edit Profile Details
              </h3>
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Operational Role & Title</label>
                <input
                  type="text"
                  value={tempRole}
                  onChange={(e) => setTempRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assigned Facility / Area</label>
                <input
                  type="text"
                  value={tempFacility}
                  onChange={(e) => setTempFacility(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow transition-colors"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
