const fs = require('fs');
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Simplify sidebar appearance
content = content.replace(
  '<div className="hidden md:flex z-10 w-56 lg:w-60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 flex-col shadow-2xl shrink-0 overflow-hidden rounded-3xl h-fit md:mt-4 md:ml-4 mb-4">',
  '<div className="hidden md:flex z-10 w-56 lg:w-60 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex-col shrink-0 overflow-hidden rounded-xl h-fit md:mt-4 md:ml-4 mb-4">'
);

// Simplify sidebar active pill
content = content.replace(
  '<motion.div\n                      layoutId="sidebar-active-pill"\n                      className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 shadow-sm border border-white dark:border-slate-700/50 ring-1 ring-slate-200/50 dark:ring-black/20 rounded-lg -z-10"',
  '<motion.div\n                      layoutId="sidebar-active-pill"\n                      className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-md -z-10"'
);

fs.writeFileSync('src/components/Sidebar.tsx', content);
console.log("Sidebar fixed.");
