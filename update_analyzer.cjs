const fs = require('fs');
let content = fs.readFileSync('src/components/ReportAnalyzer.tsx', 'utf8');

// Add Cpu import
if (!content.includes('Cpu')) {
    content = content.replace('Info, ShieldX}', 'Info, ShieldX, Cpu}');
}

const stateToAdd = `
  const [useTee, setUseTee] = useState(true);
`;

content = content.replace('const [reportTitle, setReportTitle] = useState(\'\');', stateToAdd + '\n  const [reportTitle, setReportTitle] = useState(\'\');');

const toggleHtml = `
                    {/* TEE Secure Processing Toggle */}
                    <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">TEE Secure Processing</h4>
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">Run AI analysis inside a hardware-isolated Trusted Execution Environment (Confidential Computing) to protect sensitive data.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={useTee} onChange={(e) => setUseTee(e.target.checked)} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    {!activeAnalysis && (
`;

content = content.replace('{!activeAnalysis && (', toggleHtml);

const formDataAppend = `
      if (useTee) formData.append('useTee', 'true');
      const res = await fetch
`;

content = content.replace('const res = await fetch', formDataAppend);

fs.writeFileSync('src/components/ReportAnalyzer.tsx', content);
