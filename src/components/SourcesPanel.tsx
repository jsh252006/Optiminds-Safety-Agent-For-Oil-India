import { Library, ExternalLink, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function SourcesPanel() {
  const { t } = useLanguage();

  return (
    <div className="h-full bg-transparent p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold tracking-widest uppercase mb-3">
            Knowledge Base
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <Library className="w-8 h-8 text-blue-600" />
            Sources & Standards
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Official regulatory and organizational foundations of the Safety Knowledge Base.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-8 space-y-10">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-blue-100/50 dark:border-blue-900/40">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Oil India Limited (OIL) HSE Documentation</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  The primary source of truth for organizational safety procedures. This includes the overarching OIL HSE Policy, Safety Management System (SMS) manuals, standard operating procedures (SOPs), and site-specific emergency response plans (ERPs).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 pt-8 border-t border-slate-100 dark:border-slate-700">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-emerald-100/50 dark:border-emerald-900/40">
                <Database className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Oil Industry Safety Directorate (OISD) Standards</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Technical standards and guidelines published by OISD, a technical directorate under the Ministry of Petroleum and Natural Gas. The system indexes mandatory and recommended practices (e.g., OISD-STD-105, OISD-STD-155) for upstream and downstream operations.
                </p>
                <button className="inline-flex items-center gap-1.5 text-sm font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-4">
                  View Indexed Standards <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-5 pt-8 border-t border-slate-100 dark:border-slate-700">
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-amber-100/50 dark:border-amber-900/40">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Statutory & Regulatory Requirements</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Applicable national and state-level statutory requirements, including the Mines Act, Oil Mines Regulations (OMR), and Environmental Protection Rules. These sources are prioritized when resolving regulatory compliance queries.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-sm text-slate-300 shadow-xl flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div className="leading-relaxed">
            <strong className="text-white font-semibold">{t('sources.transparency')}</strong> {t('sources.transparency.desc')}
          </div>
        </div>

      </div>
    </div>
  );
}
