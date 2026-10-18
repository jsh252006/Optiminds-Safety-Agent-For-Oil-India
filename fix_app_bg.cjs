const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove the Animated Mesh Gradient Background
const bgRegex = /\{\/\* Animated Mesh Gradient Background \*\/\}.*?<\/div>/s;
content = content.replace(bgRegex, '');

// Clean up the main wrapper and container styling for a simpler student look
content = content.replace(
  '<div className="flex flex-col h-screen overflow-hidden bg-amber-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 relative">',
  '<div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 relative">'
);

// Simplify the main wrapper - less glassmorphism, normal shadows
content = content.replace(
  '<main className="flex-1 flex flex-col min-h-0 relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl shadow-2xl shadow-blue-900/10 dark:shadow-blue-900/20 overflow-hidden mt-2 mx-2 mb-2 md:mt-4 md:mx-4 md:mb-4 rounded-2xl md:rounded-3xl border border-white/60 dark:border-slate-700/50 z-0">',
  '<main className="flex-1 flex flex-col min-h-0 relative bg-white dark:bg-slate-950 overflow-hidden mt-2 mx-2 mb-2 md:mt-4 md:mx-4 md:mb-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm z-0">'
);

fs.writeFileSync('src/App.tsx', content);
console.log("App background fixed.");
