const fs = require('fs');

let content = fs.readFileSync('src/components/ReportAnalyzer.tsx', 'utf8');

// Replace red with rose/coral, blue with emerald for low, amber stays amber
content = content.replace(/bg-red-500/g, 'bg-rose-500');
content = content.replace(/bg-red-50 text-red-700 border border-red-200/g, 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:border-rose-800');
content = content.replace(/bg-red-50 dark:bg-red-900\/200/g, 'bg-rose-500'); // for the top bar
content = content.replace(/bg-amber-50 dark:bg-amber-900\/200/g, 'bg-amber-500');
content = content.replace(/bg-blue-500/g, 'bg-emerald-500');
content = content.replace(/bg-blue-50 text-blue-700 border border-blue-200/g, 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800');

// Fix cards
content = content.replace(/shadow-sm overflow-hidden group hover:shadow-md transition-shadow/g, 'shadow-lg shadow-slate-200/50 dark:shadow-none overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300');

fs.writeFileSync('src/components/ReportAnalyzer.tsx', content);

let mmContent = fs.readFileSync('src/components/MachineManager.tsx', 'utf8');
mmContent = mmContent.replace(/bg-red-100 text-red-800/g, 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400');
mmContent = mmContent.replace(/bg-green-100 text-green-800/g, 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400');
mmContent = mmContent.replace(/shadow-sm/g, 'shadow-lg shadow-slate-200/50 dark:shadow-none transition-shadow hover:shadow-xl');
fs.writeFileSync('src/components/MachineManager.tsx', mmContent);

console.log('Colors fixed');
