const fs = require('fs');
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

content = content.replace(
  'border-slate-200/50 flex flex-col',
  'border-slate-200/50 dark:border-slate-700/50 flex flex-col z-10 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md'
);

content = content.replace(
  'bg-white dark:bg-slate-800 shadow-sm text-blue-700 dark:text-blue-400 border border-slate-200/60 dark:border-slate-700',
  'bg-white dark:bg-slate-800/80 shadow-md text-blue-700 dark:text-blue-400 border border-slate-200/80 dark:border-slate-700/80 ring-1 ring-slate-900/5 dark:ring-white/5'
);
content = content.replace(
  'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 border border-transparent',
  'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent'
);

fs.writeFileSync('src/components/Sidebar.tsx', content);

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
nav = nav.replace(
  'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-b border-white/60 dark:border-slate-800/60 shrink-0 shadow-sm z-20 relative',
  'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shrink-0 shadow-sm z-20 relative'
);
fs.writeFileSync('src/components/Navbar.tsx', nav);
console.log('Sidebar/nav fixed');
