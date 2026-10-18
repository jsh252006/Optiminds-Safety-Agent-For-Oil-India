const fs = require('fs');
let content = fs.readFileSync('src/components/MachineManager.tsx', 'utf8');

content = content.replace(
  'bg-orange-100 rounded-2xl flex items-center justify-center border border-orange-200 shadow-inner',
  'bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20'
);
content = content.replace(
  '<Server className="w-7 h-7 text-orange-600" />',
  '<Server className="w-7 h-7 text-white" />'
);

fs.writeFileSync('src/components/MachineManager.tsx', content);

let wb = fs.readFileSync('src/components/WeeklyBriefing.tsx', 'utf8');
wb = wb.replace(
  'bg-amber-100 rounded-2xl flex items-center justify-center border border-amber-200 shadow-inner',
  'bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20'
);
wb = wb.replace(
  '<Calendar className="w-7 h-7 text-amber-600" />',
  '<Calendar className="w-7 h-7 text-white" />'
);
fs.writeFileSync('src/components/WeeklyBriefing.tsx', wb);

let ad = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');
ad = ad.replace(
  'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-500/20 border-none'
);
ad = ad.replace(
  'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100',
  'bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-500/20'
);
ad = ad.replace(
  'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/20'
);
ad = ad.replace(
  'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
);
fs.writeFileSync('src/components/AnalyticsDashboard.tsx', ad);
console.log('Fixed headers in other files');
