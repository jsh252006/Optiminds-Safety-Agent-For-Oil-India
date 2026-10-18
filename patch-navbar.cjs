const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

content = content.replace(
  'className="bg-[#1A365D] border-b border-slate-800 shrink-0 shadow-lg z-20 relative"',
  'className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/60 dark:border-slate-800/50 shrink-0 shadow-sm z-20 relative"'
);

content = content.replace(
  '<h1 className="font-extrabold text-base tracking-wide text-white leading-tight group-hover:text-cyan-400 transition-colors hidden sm:block">OPTIMINDS</h1>',
  '<h1 className="font-extrabold text-base tracking-wide text-slate-800 dark:text-white leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors hidden sm:block">OPTIMINDS</h1>'
);

content = content.replace(
  '<div className="text-[9px] uppercase tracking-widest text-orange-400 font-bold leading-tight hidden sm:block">Safety Intelligence</div>',
  '<div className="text-[9px] uppercase tracking-widest text-orange-600 dark:text-orange-400 font-bold leading-tight hidden sm:block">Safety Intelligence</div>'
);

content = content.replace(
  /\? "bg-cyan-500 text-white shadow-md border border-cyan-400 ring-1 ring-black\/10"/g,
  '? "bg-cyan-600 dark:bg-cyan-500 text-white shadow-sm border border-cyan-500 dark:border-cyan-400 ring-1 ring-black/10"'
);

content = content.replace(
  /: "text-slate-200 hover:bg-\[#334155\] hover:text-white border border-transparent"/g,
  ': "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white border border-transparent"'
);

content = content.replace(
  'className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#334155]/50 hover:bg-[#334155] active:scale-95 text-slate-300 hover:text-white transition-colors border border-[#334155] shadow-inner"',
  'className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 active:scale-95 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-300/50 dark:border-slate-700/50 shadow-sm"'
);

content = content.replace(
  'className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#334155]/50 hover:bg-[#334155] active:scale-95 text-slate-300 hover:text-white transition-colors border border-[#334155] shadow-inner"',
  'className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 active:scale-95 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-300/50 dark:border-slate-700/50 shadow-sm"'
);

content = content.replace(
  '<Globe className="w-3.5 h-3.5 text-blue-600" />',
  '<Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />'
);

content = content.replace(
  '<ChevronDown className="w-3 h-3 text-slate-400" />',
  '<ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />'
);

fs.writeFileSync('src/components/Navbar.tsx', content);
console.log('Navbar patched successfully.');
