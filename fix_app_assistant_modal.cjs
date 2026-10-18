const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the highly polished glassmorphism of the FAB assistant modal
content = content.replace(
  '<div className="w-full h-full rotate-180 flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-slate-700/50 overflow-hidden relative rounded-3xl">',
  '<div className="w-full h-full rotate-180 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden relative rounded-2xl shadow-xl">'
);

// Reduce the rounding of the outer modal shell to match standard student look (rounded-2xl)
content = content.replace(
  'className="fixed bottom-24 right-6 w-[400px] min-w-[300px] max-w-[90vw] h-[600px] min-h-[400px] max-h-[85vh] z-50 rotate-180 resize overflow-hidden rounded-3xl shadow-2xl"',
  'className="fixed bottom-24 right-6 w-[400px] min-w-[300px] max-w-[90vw] h-[600px] min-h-[400px] max-h-[85vh] z-50 rotate-180 resize overflow-hidden rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-700"'
);

fs.writeFileSync('src/App.tsx', content);
