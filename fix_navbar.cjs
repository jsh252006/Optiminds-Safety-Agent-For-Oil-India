const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Remove assistant from navItems
content = content.replace("{ id: 'assistant', label: t('nav.assistant'), icon: MessageSquare },", "");

// Make navbar more compact and standard student-looking
content = content.replace(
  '<div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/60 dark:border-slate-800/50 shrink-0 shadow-sm z-20 relative">',
  '<div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-20 relative">'
);

// Reduce top navbar height
content = content.replace(
  '<div className="px-2 lg:px-3 h-12 flex items-center justify-between">',
  '<div className="px-3 lg:px-6 h-12 flex items-center justify-between">'
);

// Simplify the navigation pills background
content = content.replace(
  '<div className="flex items-center p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl border border-slate-300/50 dark:border-slate-700/50 shadow-inner">',
  '<div className="flex items-center p-1 space-x-1">'
);

// Simplify the active state pills
content = content.replace(
  '<motion.div\n                        layoutId="nav-active-pill"\n                        className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 shadow-sm border border-white dark:border-slate-700/50 ring-1 ring-slate-200/50 dark:ring-black/20 rounded-lg -z-10"',
  '<motion.div\n                        layoutId="nav-active-pill"\n                        className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-md -z-10"'
);

fs.writeFileSync('src/components/Navbar.tsx', content);
console.log("Navbar fixed.");
