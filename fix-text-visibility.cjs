const fs = require('fs');

// Fix Sidebar
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// The inactive icons are currently text-slate-500 dark:text-slate-400
sidebar = sidebar.replace(
  /: "text-slate-500 dark:text-slate-400 transition-colors group-hover:text-white"/g,
  ': "text-slate-400 transition-colors group-hover:text-white"'
);
sidebar = sidebar.replace(
  /text-slate-400 uppercase/g,
  'text-slate-400 uppercase tracking-widest' // Just making sure
);
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);


// Fix Navbar
let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Theme Button
nav = nav.replace(
  /className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-200 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"/g,
  'className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#334155]/50 hover:bg-[#334155] active:scale-95 text-slate-300 hover:text-white transition-colors border border-[#334155] shadow-inner"'
);

// Language Button
nav = nav.replace(
  /className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-200 dark:text-slate-300 dark:text-slate-200 transition-colors border border-slate-200 shadow-sm"/g,
  'className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#334155]/50 hover:bg-[#334155] active:scale-95 text-slate-300 hover:text-white transition-colors border border-[#334155] shadow-inner"'
);

// Language Dropdown inactive items (on white background in light mode)
nav = nav.replace(
  /languageName === lang.label \? "text-blue-700 bg-blue-50\/50" : "text-slate-200 dark:text-slate-300"/g,
  'languageName === lang.label ? "text-blue-700 bg-blue-50/50 dark:text-cyan-400 dark:bg-cyan-900/30" : "text-slate-700 dark:text-slate-300"'
);

// Logout Button
nav = nav.replace(
  /className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900\/20 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"/g,
  'className="p-2 rounded-lg bg-[#334155]/50 text-slate-300 hover:text-red-400 hover:bg-red-900/20 transition-colors border border-[#334155] shadow-inner"'
);

// User info dropdown role/location text (needs to be visible against white dropdown in light mode)
nav = nav.replace(
  /<span className="font-semibold text-slate-200 dark:text-slate-300">/g,
  '<span className="font-semibold text-slate-700 dark:text-slate-300">'
);

// In Navbar inactive icons
nav = nav.replace(
  /: "text-slate-500 dark:text-slate-400"\)} \/>/g,
  ': "text-slate-400")} />'
);

// Change border-l border-slate-200 to something less harsh on navy blue
nav = nav.replace(
  /border-l border-slate-200 dark:border-slate-700\/50/g,
  'border-l border-slate-700'
);

fs.writeFileSync('src/components/Navbar.tsx', nav);

console.log('Text visibility fixed!');
