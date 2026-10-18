const fs = require('fs');

let content = fs.readFileSync('src/components/HomeDashboard.tsx', 'utf8');

content = content.replace(
  'bg-white dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-600',
  'bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-3xl border border-white/60 dark:border-slate-700/50 shadow-lg shadow-slate-200/20 dark:shadow-none hover:shadow-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 hover:border-white/80 dark:hover:border-slate-600'
);

fs.writeFileSync('src/components/HomeDashboard.tsx', content);
console.log('Home patched successfully.');
