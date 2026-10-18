const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-blue-900/5 dark:shadow-blue-900/20 overflow-hidden mt-2 mx-2 mb-2 md:mt-4 md:mx-4 md:mb-4 rounded-2xl md:rounded-3xl border border-white/80 dark:border-slate-700/50 z-0',
  'bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl shadow-2xl shadow-blue-900/10 dark:shadow-blue-900/20 overflow-hidden mt-2 mx-2 mb-2 md:mt-4 md:mx-4 md:mb-4 rounded-2xl md:rounded-3xl border border-white/60 dark:border-slate-700/50 z-0'
);

// also let's check the floating assistant button:
content = content.replace(
  'bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60',
  'bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 dark:border-slate-700/50'
);

fs.writeFileSync('src/App.tsx', content);
console.log('App patched successfully.');
