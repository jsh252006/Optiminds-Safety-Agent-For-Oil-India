const fs = require('fs');

const content = `import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Activity, AlertTriangle, ShieldAlert, BarChart3, TrendingUp, MapPin, Wrench, ShieldX, Info } from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

export default function AnalyticsDashboard() {
  const { incidentReports } = useData();
  const [timeFilter, setTimeFilter] = useState('All');

  const filteredReports = useMemo(() => {
    if (timeFilter === 'All') return incidentReports;
    const now = new Date();
    let cutoff = new Date();
    if (timeFilter === '7D') cutoff.setDate(now.getDate() - 7);
    if (timeFilter === '30D') cutoff.setDate(now.getDate() - 30);
    if (timeFilter === '90D') cutoff.setDate(now.getDate() - 90);
    if (timeFilter === '6M') cutoff.setMonth(now.getMonth() - 6);
    if (timeFilter === '12M') cutoff.setFullYear(now.getFullYear() - 1);
    
    return incidentReports.filter(r => {
      const d = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.date || Date.now());
      return d >= cutoff;
    });
  }, [incidentReports, timeFilter]);

  const stats = useMemo(() => {
    let potentialSIF = 0;
    let nonSIF = 0;
    let requiresReview = 0;
    let highRisk = 0;
    
    const precursors: Record<string, number> = {};
    const barrierConcerns: Record<string, number> = {};
    const sites: Record<string, number> = {};
    const activities: Record<string, number> = {};

    filteredReports.forEach(r => {
      const analysis = r.analysis;
      if (!analysis) return;
      
      const sifClass = analysis.sifClassification || '';
      if (sifClass.includes('Potential SIF')) potentialSIF++;
      else if (sifClass.includes('Non-SIF')) nonSIF++;
      else if (sifClass.includes('Requires Review')) requiresReview++;

      if (analysis.riskScore >= 75) highRisk++;

      if (analysis.precursors) {
        analysis.precursors.forEach(p => {
          precursors[p.signal] = (precursors[p.signal] || 0) + 1;
        });
      }
      
      if (analysis.barrierConcerns) {
        analysis.barrierConcerns.forEach(b => {
          barrierConcerns[b.barrier] = (barrierConcerns[b.barrier] || 0) + 1;
        });
      }
      
      const site = r.site || 'Unknown';
      sites[site] = (sites[site] || 0) + 1;
      
      const activity = r.activity || 'Unknown';
      activities[activity] = (activities[activity] || 0) + 1;
    });

    const sifRate = filteredReports.length > 0 ? ((potentialSIF / filteredReports.length) * 100).toFixed(1) : '0.0';

    return {
      total: filteredReports.length,
      potentialSIF,
      nonSIF,
      requiresReview,
      highRisk,
      sifRate,
      precursors: Object.entries(precursors).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count).slice(0, 5),
      barriers: Object.entries(barrierConcerns).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count).slice(0, 5),
      sites: Object.entries(sites).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count),
      activities: Object.entries(activities).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count)
    };
  }, [filteredReports]);

  // Scatter plot data for Location x Activity matrix
  const matrixData = useMemo(() => {
    const data: any[] = [];
    const siteMap: string[] = [];
    const activityMap: string[] = [];
    
    filteredReports.forEach(r => {
      if (!r.site || !r.activity) return;
      if (!siteMap.includes(r.site)) siteMap.push(r.site);
      if (!activityMap.includes(r.activity)) activityMap.push(r.activity);
      
      const x = activityMap.indexOf(r.activity);
      const y = siteMap.indexOf(r.site);
      
      const existing = data.find(d => d.x === x && d.y === y);
      if (existing) {
        existing.z += 1;
        if (r.analysis?.sifClassification?.includes('Potential SIF')) existing.sif += 1;
      } else {
        data.push({
          x,
          y,
          z: 1,
          site: r.site,
          activity: r.activity,
          sif: r.analysis?.sifClassification?.includes('Potential SIF') ? 1 : 0
        });
      }
    });
    return { data, siteMap, activityMap };
  }, [filteredReports]);

  return (
    <div className="h-full bg-transparent p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Safety Intelligence & SIF Overview
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Advanced analytics, risk rankings, and potential SIF identification.</p>
          </div>
          <div className="flex bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700">
            {['All', '7D', '30D', '90D', '6M', '12M'].map(f => (
              <button 
                key={f} 
                onClick={() => setTimeFilter(f)}
                className={\`px-4 py-2 rounded-lg text-sm font-semibold transition-colors \${timeFilter === f ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}\`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Total Potential SIF Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Reports Analyzed</p>
                <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100">{stats.total}</h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Total records in view
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-l-4 border-l-red-500 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Potential SIF Events</p>
                <h3 className="text-4xl font-black text-red-600 dark:text-red-400">{stats.potentialSIF}</h3>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              SIF Rate: <span className="font-bold text-red-600 dark:text-red-400">{stats.sifRate}%</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">High-Risk Events</p>
                <h3 className="text-4xl font-black text-amber-600 dark:text-amber-400">{stats.highRisk}</h3>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              Risk Score &gt; 75
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Requires Review</p>
                <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100">{stats.requiresReview}</h3>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300">
                <Info className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              Needs HSE validation
            </div>
          </div>
        </div>

        {/* Detailed Analytics Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recurring Precursors */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Activity className="w-5 h-5 text-indigo-500" />
              Recurring Precursor Patterns
            </h2>
            {stats.precursors.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-slate-400">Insufficient data</div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.precursors} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 12}} />
                    <RechartsTooltip cursor={{fill: '#f1f5f9', opacity: 0.1}} />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Barrier Failure Risk Ranking */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <ShieldX className="w-5 h-5 text-rose-500" />
              Barrier Failure Risk Ranking
            </h2>
            {stats.barriers.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-slate-400">Insufficient data</div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.barriers} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 12}} />
                    <RechartsTooltip cursor={{fill: '#f1f5f9', opacity: 0.1}} />
                    <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>

        {/* Site and Activity Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <MapPin className="w-5 h-5 text-emerald-500" />
              Site / Location Risk Ranking
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-500">
                    <th className="pb-3 pl-2">Site Name</th>
                    <th className="pb-3 text-right">Reports</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.sites.length === 0 ? (
                    <tr><td colSpan={2} className="py-8 text-center text-slate-400">No data</td></tr>
                  ) : stats.sites.map((site, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 pl-2 font-medium text-slate-700 dark:text-slate-300">{site.name}</td>
                      <td className="py-3 text-right font-bold">{site.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Wrench className="w-5 h-5 text-amber-500" />
              Activity Risk Ranking
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-500">
                    <th className="pb-3 pl-2">Activity</th>
                    <th className="pb-3 text-right">Reports</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.activities.length === 0 ? (
                    <tr><td colSpan={2} className="py-8 text-center text-slate-400">No data</td></tr>
                  ) : stats.activities.map((act, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 pl-2 font-medium text-slate-700 dark:text-slate-300">{act.name}</td>
                      <td className="py-3 text-right font-bold">{act.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
        
        {/* Location x Activity Cross-Analysis */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Activity className="w-5 h-5 text-cyan-500" />
            Location × Activity Risk Matrix
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Bubble size represents number of reports. Red color indicates presence of Potential SIF events.</p>
          
          {matrixData.data.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-slate-400">Insufficient data to build matrix</div>
          ) : (
            <div className="h-96 w-full overflow-x-auto">
              <div className="min-w-[700px] h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Activity" 
                      tickFormatter={(tick) => matrixData.activityMap[tick] || ''} 
                      ticks={matrixData.activityMap.map((_, i) => i)}
                      interval={0}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Site" 
                      tickFormatter={(tick) => matrixData.siteMap[tick] || ''} 
                      ticks={matrixData.siteMap.map((_, i) => i)}
                      interval={0}
                      width={120}
                    />
                    <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Reports" />
                    <RechartsTooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 text-sm">
                              <p className="font-bold mb-1">{data.site} - {data.activity}</p>
                              <p>Reports: <span className="font-semibold">{data.z}</span></p>
                              <p>Potential SIF: <span className="font-semibold text-red-500">{data.sif}</span></p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter 
                      name="Risk Matrix" 
                      data={matrixData.data} 
                      fill="#3b82f6" 
                      shape={(props: any) => {
                        const { cx, cy, payload } = props;
                        const hasSIF = payload.sif > 0;
                        return (
                          <circle cx={cx} cy={cy} r={props.r || 10} fill={hasSIF ? "#ef4444" : "#3b82f6"} fillOpacity={0.7} stroke={hasSIF ? "#991b1b" : "#1d4ed8"} strokeWidth={1} />
                        )
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/AnalyticsDashboard.tsx', content);
