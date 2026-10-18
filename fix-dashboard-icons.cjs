const fs = require('fs');
let content = fs.readFileSync('src/components/HomeDashboard.tsx', 'utf8');

// Instead of bgLight, let's use the actual gradient for the icon background
content = content.replace(
  'className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform duration-300 group-hover:scale-110", mod.bgLight)}',
  'className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-current/20 transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br", mod.color)}'
);

content = content.replace(
  '<Icon className={cn("w-7 h-7", mod.iconColor)} />',
  '<Icon className="w-7 h-7 text-white" />'
);

// Also add a nice subtle border to the cards and improve the hover state
content = content.replace(
  'className="group cursor-pointer relative overflow-hidden bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300"',
  'className="group cursor-pointer relative overflow-hidden bg-white dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"'
);
// Fallback if previous replace failed (because it was just dark:bg-slate-800)
content = content.replace(
  'className="group cursor-pointer relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300"',
  'className="group cursor-pointer relative overflow-hidden bg-white dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"'
);


// Increase hover opacity
content = content.replace(
  'group-hover:opacity-10 bg-gradient-to-br transition-opacity duration-500", mod.color)',
  'group-hover:opacity-5 bg-gradient-to-br transition-opacity duration-500", mod.color)'
);

fs.writeFileSync('src/components/HomeDashboard.tsx', content);
console.log('Home dashboard fixed');
