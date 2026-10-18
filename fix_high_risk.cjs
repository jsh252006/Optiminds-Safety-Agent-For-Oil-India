const fs = require('fs');
let content = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');

// Add state for modal
const stateInsert = `const [timeFilter, setTimeFilter] = useState('All');
  const [showHighRiskModal, setShowHighRiskModal] = useState(false);`;
content = content.replace(/const \[timeFilter, setTimeFilter\] = useState\('All'\);/, stateInsert);

// Replace the High Risk Card to be clickable
const cardSearch = `<div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">High-Risk Events</p>`;
const cardReplace = `<div 
            onClick={() => setShowHighRiskModal(true)}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between cursor-pointer hover:border-amber-400 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">High-Risk Events (Click to view)</p>`;
content = content.replace(cardSearch, cardReplace);

// We need an X icon for the modal, maybe lucide-react X is imported?
const importRegex = /import \{([\s\S]*?)\} from 'lucide-react';/;
if (importRegex.test(content)) {
  const match = content.match(importRegex)[1];
  let newImports = match;
  if (!newImports.includes('X')) newImports += ', X';
  content = content.replace(importRegex, `import {${newImports}} from 'lucide-react';`);
}

// Add Modal at the end
const modalCode = `
        {/* High Risk Modal */}
        {showHighRiskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-amber-50 dark:bg-amber-900/20">
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> High-Risk Event Reports (Risk Score > 75)
                </h3>
                <button onClick={() => setShowHighRiskModal(false)} className="p-1 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg text-amber-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto space-y-4 flex-1">
                {filteredReports.filter(r => r.analysis?.riskScore >= 75).length === 0 ? (
                  <div className="text-center p-8 text-slate-500">No high-risk events found in this period.</div>
                ) : (
                  filteredReports.filter(r => r.analysis?.riskScore >= 75).map((report, idx) => (
                    <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">{report.title || \`Incident Report - \${report.site}\`}</h4>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">Risk Score: {report.analysis?.riskScore}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-xs">
                        <div className="text-slate-500"><span className="font-semibold text-slate-700 dark:text-slate-300">Site:</span> {report.site || 'N/A'}</div>
                        <div className="text-slate-500"><span className="font-semibold text-slate-700 dark:text-slate-300">Category:</span> {report.eventCategory || 'N/A'}</div>
                        <div className="text-slate-500"><span className="font-semibold text-slate-700 dark:text-slate-300">SIF:</span> {report.analysis?.sifClassification || 'N/A'}</div>
                        <div className="text-slate-500"><span className="font-semibold text-slate-700 dark:text-slate-300">Date:</span> {new Date(report.createdAt?.toDate ? report.createdAt.toDate() : report.date || Date.now()).toLocaleDateString()}</div>
                      </div>
                      {report.analysis?.executiveSummary && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 border-l-2 border-amber-300 pl-3">
                          {report.analysis.executiveSummary}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}`;

content = content.replace(/<\/div>\n    <\/div>\n  \);\n}/, modalCode);
fs.writeFileSync('src/components/AnalyticsDashboard.tsx', content);
