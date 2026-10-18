const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(
  '<div className="p-4 bg-white dark:bg-slate-800/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 dark:border-slate-700 z-10 sticky bottom-0">',
  '<div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-10 sticky bottom-0">'
);

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
