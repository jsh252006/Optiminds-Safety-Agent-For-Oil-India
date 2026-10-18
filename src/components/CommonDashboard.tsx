import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, ShieldAlert, AlertTriangle, CheckCircle2, TrendingUp, 
  MapPin, Activity, FileText, Search, Filter, ExternalLink, 
  ChevronDown, ChevronUp, Plus, ShieldCheck, Download, AlertOctagon,
  Layers, Users, Clock
} from 'lucide-react';
import { safeFormatDate } from '../lib/utils';
import { IncidentReport } from '../types';

interface CommonDashboardProps {
  onSwitchToUserDashboard?: () => void;
  onNavigateToAnalyzer?: () => void;
}

export default function CommonDashboard({ onSwitchToUserDashboard, onNavigateToAnalyzer }: CommonDashboardProps) {
  const { incidentReports } = useData();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [sifFilter, setSifFilter] = useState('ALL');
  const [siteFilter, setSiteFilter] = useState('ALL');
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  // Compute Overall Aggregate Statistics
  const overallStats = useMemo(() => {
    const totalReports = incidentReports.length;
    let potentialSifCount = 0;
    let highRiskCount = 0;
    let totalActions = 0;
    let completedActions = 0;

    const siteCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const severityCounts: Record<string, number> = { Critical: 0, High: 0, Moderate: 0, Low: 0 };

    incidentReports.forEach(report => {
      const analysis = report.analysis;
      const severity = report.incidentSeverity || (analysis && analysis.riskScore >= 75 ? 'Critical' : analysis && analysis.riskScore >= 40 ? 'Moderate' : 'Low');
      
      if (severityCounts[severity] !== undefined) {
        severityCounts[severity]++;
      } else {
        severityCounts[severity] = 1;
      }

      if (analysis?.sifClassification?.includes('Potential SIF')) {
        potentialSifCount++;
      }
      if ((analysis?.riskScore || 0) >= 70) {
        highRiskCount++;
      }

      if (report.site) {
        siteCounts[report.site] = (siteCounts[report.site] || 0) + 1;
      }

      if (report.eventCategory) {
        categoryCounts[report.eventCategory] = (categoryCounts[report.eventCategory] || 0) + 1;
      }

      if (report.preventiveActions) {
        totalActions += report.preventiveActions.length;
        completedActions += report.preventiveActions.filter(a => a.status === 'COMPLETED').length;
      }
    });

    const sifRate = totalReports > 0 ? Math.round((potentialSifCount / totalReports) * 100) : 0;
    const actionResolutionRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 100;
    
    // Average Risk Score
    const totalRisk = incidentReports.reduce((acc, r) => acc + (r.analysis?.riskScore || 50), 0);
    const avgRisk = totalReports > 0 ? Math.round(totalRisk / totalReports) : 0;

    return {
      totalReports,
      potentialSifCount,
      sifRate,
      highRiskCount,
      totalActions,
      completedActions,
      actionResolutionRate,
      avgRisk,
      siteCounts,
      categoryCounts,
      severityCounts,
    };
  }, [incidentReports]);

  // Unique sites for filter
  const uniqueSites = useMemo(() => {
    const set = new Set<string>();
    incidentReports.forEach(r => {
      if (r.site) set.add(r.site);
    });
    return Array.from(set).sort();
  }, [incidentReports]);

  // Filtered reports list
  const filteredReports = useMemo(() => {
    return incidentReports.filter(report => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = report.title?.toLowerCase().includes(q);
        const matchDesc = report.description?.toLowerCase().includes(q);
        const matchSite = report.site?.toLowerCase().includes(q);
        const matchCat = report.eventCategory?.toLowerCase().includes(q);
        const matchAuthor = report.userName?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchSite && !matchCat && !matchAuthor) {
          return false;
        }
      }

      // Severity filter
      if (severityFilter !== 'ALL') {
        const repSeverity = (report.incidentSeverity || (report.analysis && report.analysis.riskScore >= 75 ? 'Critical' : report.analysis && report.analysis.riskScore >= 40 ? 'Moderate' : 'Low')).toUpperCase();
        if (repSeverity !== severityFilter) return false;
      }

      // SIF filter
      if (sifFilter !== 'ALL') {
        const sifClass = report.analysis?.sifClassification || 'Non-SIF';
        if (sifFilter === 'SIF' && !sifClass.includes('Potential SIF')) return false;
        if (sifFilter === 'NON_SIF' && sifClass.includes('Potential SIF')) return false;
      }

      // Site filter
      if (siteFilter !== 'ALL' && report.site !== siteFilter) {
        return false;
      }

      return true;
    });
  }, [incidentReports, searchQuery, severityFilter, sifFilter, siteFilter]);

  const toggleExpand = (id: string) => {
    setExpandedReportId(prev => prev === id ? null : id);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Top Header Banner */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-400/30 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5" />
                Enterprise Safety Surveillance
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Common Safety Dashboard
              </h1>
              <p className="text-slate-600 dark:text-blue-200/80 text-sm sm:text-base max-w-2xl leading-relaxed">
                Aggregated intelligence across all {overallStats.totalReports} uploaded incident reports. Real-time Serious Injury & Fatality (SIF) tracking, barrier failure alerts, and cross-site compliance monitoring.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {onNavigateToAnalyzer && (
                <button
                  onClick={onNavigateToAnalyzer}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium text-sm rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Upload Incident Report
                </button>
              )}
              {onSwitchToUserDashboard && (
                <button
                  onClick={onSwitchToUserDashboard}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-700 dark:text-white font-medium text-sm rounded-xl border border-slate-200 dark:border-white/20 shadow-sm transition-all active:scale-95"
                >
                  <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
                  View Your Dashboard
                </button>
              )}
            </div>
          </div>

          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
            <div>
              <div className="text-xs text-slate-500 dark:text-blue-200 uppercase tracking-wider font-semibold">Total Reports</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{overallStats.totalReports}</div>
              <div className="text-xs text-slate-500 dark:text-blue-300/70 mt-0.5">Across all sites & units</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-amber-200 uppercase tracking-wider font-semibold">SIF Potential Rate</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{overallStats.sifRate}%</div>
              <div className="text-xs text-slate-500 dark:text-amber-300/70 mt-0.5">{overallStats.potentialSifCount} critical precursor cases</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-red-200 uppercase tracking-wider font-semibold">Avg Risk Score</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">{overallStats.avgRisk}<span className="text-sm font-normal text-slate-400 dark:text-slate-400">/100</span></div>
              <div className="text-xs text-slate-500 dark:text-red-300/70 mt-0.5">{overallStats.highRiskCount} High / Critical severity</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-emerald-200 uppercase tracking-wider font-semibold">Actions Resolved</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{overallStats.actionResolutionRate}%</div>
              <div className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">{overallStats.completedActions} of {overallStats.totalActions} closed</div>
            </div>
          </div>
        </div>

        {/* Operational Facility Matrix Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
          {/* Severity Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-500" />
                Severity Breakdown
              </h3>
              <span className="text-xs text-slate-500 font-medium">All Reports</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {[
                { label: 'Critical', count: overallStats.severityCounts['Critical'] || 0, color: 'bg-red-500', text: 'text-red-700 dark:text-red-400' },
                { label: 'High', count: overallStats.severityCounts['High'] || 0, color: 'bg-orange-500', text: 'text-orange-700 dark:text-orange-400' },
                { label: 'Moderate', count: overallStats.severityCounts['Moderate'] || 0, color: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400' },
                { label: 'Low', count: overallStats.severityCounts['Low'] || 0, color: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
              ].map(item => {
                const pct = overallStats.totalReports > 0 ? Math.round((item.count / overallStats.totalReports) * 100) : 0;
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={item.text}>{item.label}</span>
                      <span className="text-slate-600 dark:text-slate-400">{item.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Overall Reports Uploaded - Master Repository */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          
          {/* Repository Controls Bar */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  All Uploaded Reports Repository
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Showing {filteredReports.length} of {incidentReports.length} total operational incident reports
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," 
                      + ["Title,Site,Activity,Severity,RiskScore,Author,Date"]
                      .concat(filteredReports.map(r => `"${r.title.replace(/"/g, '""')}","${r.site || ''}","${r.activity || ''}","${r.incidentSeverity || ''}","${r.analysis?.riskScore || 0}","${r.userName || ''}","${r.date || ''}"`))
                      .join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `OPTIMINDS_All_Reports_${new Date().toISOString().split('T')[0]}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  title="Export reports as CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              {/* Search Bar */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, location, author, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Severity Filter */}
              <div className="sm:col-span-2">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Severities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              {/* SIF Filter */}
              <div className="sm:col-span-2">
                <select
                  value={sifFilter}
                  onChange={(e) => setSifFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All SIF Statuses</option>
                  <option value="SIF">Potential SIF Only</option>
                  <option value="NON_SIF">Non-SIF Only</option>
                </select>
              </div>

              {/* Site Filter */}
              <div className="sm:col-span-3">
                <select
                  value={siteFilter}
                  onChange={(e) => setSiteFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
                >
                  <option value="ALL">All Sites ({uniqueSites.length})</option>
                  {uniqueSites.map(site => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredReports.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <div className="text-slate-600 dark:text-slate-400 font-medium">No reports matched your filters</div>
                <button
                  onClick={() => { setSearchQuery(''); setSeverityFilter('ALL'); setSifFilter('ALL'); setSiteFilter('ALL'); }}
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Reset search & filters
                </button>
              </div>
            ) : (
              filteredReports.map((report) => {
                const isExpanded = expandedReportId === report.id;
                const isUserReport = (user && report.userId === user.uid) || (user?.email && report.userEmail === user.email);
                const isPotentialSif = report.analysis?.sifClassification?.includes('Potential SIF');
                const riskScore = report.analysis?.riskScore || 0;
                
                const severity = report.incidentSeverity || (riskScore >= 75 ? 'Critical' : riskScore >= 40 ? 'Moderate' : 'Low');

                return (
                  <div key={report.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-750/30">
                    <div 
                      className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      onClick={() => toggleExpand(report.id)}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            severity === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900' :
                            severity === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-900' :
                            severity === 'Moderate' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900' :
                            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                          }`}>
                            {severity}
                          </span>

                          {isPotentialSif && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              Potential SIF
                            </span>
                          )}

                          {isUserReport && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                              Uploaded by You
                            </span>
                          )}

                          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            {safeFormatDate(report.date || report.createdAt)}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          {report.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          {report.site && (
                            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {report.site}
                            </span>
                          )}
                          {report.activity && (
                            <span className="flex items-center gap-1">
                              <Activity className="w-3.5 h-3.5 text-slate-400" />
                              {report.activity}
                            </span>
                          )}
                          {report.userName && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              {report.userName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right side stats pill & expand toggle */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-xs text-slate-400 font-medium">Risk Score</div>
                          <div className={`text-base font-extrabold ${
                            riskScore >= 70 ? 'text-red-600 dark:text-red-400' :
                            riskScore >= 40 ? 'text-amber-600 dark:text-amber-400' :
                            'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Report Deep Dive */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">Report Summary: </span>
                          {report.description}
                        </div>

                        {/* Analysis Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* SIF & Findings */}
                          {report.analysis?.findings && report.analysis.findings.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                                Key Safety Findings
                              </div>
                              <ul className="space-y-1.5">
                                {report.analysis.findings.slice(0, 2).map((f, idx) => (
                                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300">
                                    <span className="font-semibold text-red-600 dark:text-red-400">[{f.severity || 'WARN'}] </span>
                                    {f.finding}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Preventive Actions */}
                          {report.preventiveActions && report.preventiveActions.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                Corrective & Preventive Actions ({report.preventiveActions.length})
                              </div>
                              <ul className="space-y-1.5">
                                {report.preventiveActions.slice(0, 2).map((act, idx) => (
                                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${act.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                    <span className="truncate">{act.text}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ml-auto ${
                                      act.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                    }`}>
                                      {act.status}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Quick Action Footer */}
                        {onNavigateToAnalyzer && (
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={onNavigateToAnalyzer}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold text-xs rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Inspect in Report Analyzer
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
    </div>
  );
}
