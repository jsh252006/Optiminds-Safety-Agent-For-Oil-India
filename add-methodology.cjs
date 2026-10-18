const fs = require('fs');
let content = fs.readFileSync('src/components/HelpDesk.tsx', 'utf8');

const target = `{/* Feedback Section */}`;

const replacement = `{/* Methodology Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-8">
          <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Library className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">AI Safety Methodology</h2>
            </div>
          </div>
          
          <div className="p-8">
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              The OPTIMINDS Safety AI engine employs an advanced natural language processing (NLP) pipeline specifically tuned for Oil India Limited (OIL) operations. Our process ensures that insights are data-driven, traceable, and strictly aligned with OISD standards.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-3">1</div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Report Ingestion & Preprocessing</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Raw safety observations, hazard logs, and incident reports are ingested (via text or PDF). The system extracts textual content, normalizes terminology, and removes personally identifiable information (PII) before analysis.</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-3">2</div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Precursor & Pattern Detection</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">The NLP engine scans for specific combinations of risk factors, such as bypassed energy isolations, missing permits, or equipment failures. These are flagged as "Precursor Signals" which often precede major incidents.</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-3">3</div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">SIF Potential Assessment</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Based on the detected precursors, the AI evaluates whether the conditions could plausibly lead to a Serious Injury or Fatality (SIF). Events are classified as Potential SIF, Non-SIF, or Requires Review.</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-3">4</div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Barrier Analysis & Risk Ranking</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">The system evaluates the integrity of defensive layers (e.g., LOTO, PPE, Gas Detection). Weaknesses are quantified to generate dynamic risk rankings for activities, sites, and specific controls.</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800/30">
              <h4 className="font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5" /> Human Validation Mandate
              </h4>
              <p className="text-sm text-blue-900 dark:text-blue-300">
                <strong>IMPORTANT:</strong> AI outputs are strictly decision-support indicators. The platform is designed to assist, not replace, human expertise. All AI-generated findings, SIF classifications, and risk rankings require validation by qualified HSE personnel before operational or safety-critical decisions are enacted.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Section */}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/HelpDesk.tsx', content);
