const fs = require('fs');
let content = fs.readFileSync('src/components/HomeDashboard.tsx', 'utf8');

// Fix text-slate-800 to handle dark mode
content = content.replace('bg-slate-50 text-slate-800', 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200');

// Fix Project Header
content = content.replace('<div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">', '<div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm">');
content = content.replace('text-slate-900 tracking-tight', 'text-slate-900 dark:text-slate-100 tracking-tight');
content = content.replace('text-blue-800 mb-2', 'text-blue-800 dark:text-blue-400 mb-2');
content = content.replace('text-slate-600 max-w-2xl text-lg', 'text-slate-600 dark:text-slate-400 max-w-2xl text-lg');

// Fix Data Overview Widget
content = content.replace('<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">', '<div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">');
content = content.replace('text-slate-800 flex items-center', 'text-slate-800 dark:text-slate-200 flex items-center');
content = content.replace('border-slate-100 pb-2', 'border-slate-100 dark:border-slate-700 pb-2');
content = content.replace('text-2xl font-bold text-slate-900', 'text-2xl font-bold text-slate-900 dark:text-slate-100');
content = content.replace('text-slate-500 uppercase', 'text-slate-500 dark:text-slate-400 uppercase');
content = content.replace(/>SIF Potential \(\{sifPotential\}\)<\/span>/, 'className="text-slate-700 dark:text-slate-300">SIF Potential ({sifPotential})</span>');
content = content.replace(/>Non-SIF \(\{nonSif\}\)<\/span>/, 'className="text-slate-700 dark:text-slate-300">Non-SIF ({nonSif})</span>');
content = content.replace('bg-slate-300 rounded-sm', 'bg-slate-300 dark:bg-slate-600 rounded-sm');
content = content.replace('bg-slate-200 rounded-full', 'bg-slate-200 dark:bg-slate-700 rounded-full');
content = content.replace('className="h-full bg-slate-300"', 'className="h-full bg-slate-300 dark:bg-slate-600"');

// Fix Features List
content = content.replace('bg-white p-3 border border-slate-200', 'bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700');
content = content.replace('text-slate-700">{feature}', 'text-slate-700 dark:text-slate-300">{feature}');
content = content.replace('bg-blue-50 px-2 py-0.5', 'bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5');

// Fix Navigation Modules
content = content.replace('bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50', 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-700');
content = content.replace('bg-slate-100 group-hover:bg-blue-100 rounded-md text-slate-600 group-hover:text-blue-700', 'bg-slate-100 dark:bg-slate-900 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 rounded-md text-slate-600 dark:text-slate-400 group-hover:text-blue-700 dark:group-hover:text-blue-300');
content = content.replace('text-slate-800 group-hover:text-blue-800', 'text-slate-800 dark:text-slate-200 group-hover:text-blue-800 dark:group-hover:text-blue-300');
content = content.replace('text-slate-500 mt-0.5', 'text-slate-500 dark:text-slate-400 mt-0.5');

// Fix Disclaimer border
content = content.replace('border-t border-slate-200', 'border-t border-slate-200 dark:border-slate-800');

fs.writeFileSync('src/components/HomeDashboard.tsx', content);
