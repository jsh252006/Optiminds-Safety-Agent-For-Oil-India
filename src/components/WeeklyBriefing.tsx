import { ShieldCheck, Calendar, Activity, AlertTriangle, FileText } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { safeFormatDistanceToNow } from '../lib/utils';

export default function WeeklyBriefing() {
  const { documents } = useData();

  // Filter for recently added documents or documents that have AI analysis
  const analyzedDocs = documents.filter(doc => doc.aiAnalysis);

  return (
    <div className="h-full bg-transparent p-4 md:p-6 lg:p-4 md:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold tracking-widest uppercase mb-3">
            Intelligence
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <Calendar className="w-8 h-8 text-red-800" />
            Weekly Safety Insights
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">AI-extracted precautions and hazards from recently uploaded safety standards.</p>
        </div>

        {analyzedDocs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
            <Activity className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No recent AI analyses found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Upload a new document via the Admin Panel to generate automated safety insights.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {analyzedDocs.map((doc) => (
              <div key={doc.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-950/50 rounded-lg flex items-center justify-center shrink-0 border border-red-200/50 dark:border-red-900/40">
                      <FileText className="w-5 h-5 text-red-800 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">{doc.name}</h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {doc.standardNumber} • {doc.organization}
                      </div>
                    </div>
                  </div>
                  {doc.createdAt && (
                    <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Analyzed {safeFormatDistanceToNow(doc.createdAt)}
                    </div>
                  )}
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:p-8">
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Key Precautions
                    </h4>
                    <ul className="space-y-3">
                      {doc.aiAnalysis?.precautions?.map((prec: string, idx: number) => (
                        <li key={idx} className="flex gap-3 text-slate-700 dark:text-slate-300 items-start bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 border border-emerald-200 dark:border-emerald-800">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed text-sm font-medium">{prec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Identified Hazards
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {doc.aiAnalysis?.hazards?.map((hazard: string, idx: number) => (
                        <div key={idx} className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-lg text-sm font-semibold">
                          {hazard}
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Executive Summary</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic border-l-2 border-red-800 dark:border-red-600 pl-3">
                        "{doc.aiAnalysis?.summary}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-8 text-center pb-8">
              <p className="text-[11px] text-slate-400 italic">
                AI-generated insights based on uploaded documents. Please verify safety protocols with official OIL India documentation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
