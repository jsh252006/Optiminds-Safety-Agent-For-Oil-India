const fs = require('fs');
let content = fs.readFileSync('src/components/ReportAnalyzer.tsx', 'utf8');
content = content.replace(/<label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Location \/ Site<\/label>/g, '<label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / Site <span className="text-red-500">*</span></label>');
content = content.replace(/<label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Category<\/label>/g, '<label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Category <span className="text-red-500">*</span></label>');
fs.writeFileSync('src/components/ReportAnalyzer.tsx', content);
