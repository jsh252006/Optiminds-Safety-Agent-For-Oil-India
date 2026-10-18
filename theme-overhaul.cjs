const fs = require('fs');

// 1. App.tsx - Main Backgrounds (Warm Off-White #FAFAF9 -> stone-50)
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/bg-\[#f8fafc\]/g, 'bg-stone-50');
appContent = appContent.replace(/dark:bg-\[#0b1121\]/g, 'dark:bg-slate-900');
appContent = appContent.replace(/bg-slate-50 dark:bg-slate-950/g, 'bg-stone-50 dark:bg-slate-900');
fs.writeFileSync('src/App.tsx', appContent);

// 2. index.css - Global styles
let cssContent = fs.readFileSync('src/index.css', 'utf8');
cssContent = cssContent.replace(/@apply bg-\[#f8fafc\].*?;/g, '@apply bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100;');
fs.writeFileSync('src/index.css', cssContent);

// 3. Navbar.tsx - Deep Navy Blue (#1A365D)
let navContent = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
// Replace container classes
navContent = navContent.replace(
  /className="bg-white\/60 dark:bg-slate-900\/60 backdrop-blur-xl border-b border-slate-200\/50 dark:border-slate-700\/50 shrink-0 shadow-sm z-20 relative"/,
  'className="bg-[#1A365D] border-b border-slate-800 shrink-0 shadow-lg z-20 relative"'
);
// Logo Text
navContent = navContent.replace(
  /text-slate-900 dark:text-slate-100 dark:text-slate-100 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400/,
  'text-white leading-tight group-hover:text-cyan-400'
);
navContent = navContent.replace(
  /text-blue-600 font-bold leading-tight hidden sm:block">Safety Intelligence/,
  'text-orange-400 font-bold leading-tight hidden sm:block">Safety Intelligence'
);
// Nav items container
navContent = navContent.replace(
  /bg-slate-200\/40 dark:bg-slate-800\/40 rounded-xl border border-slate-200\/60 dark:border-slate-700\/60 shadow-inner/,
  'bg-[#334155]/50 rounded-xl border border-[#334155] shadow-inner'
);
// Nav items active/inactive
navContent = navContent.replace(
  /isActive[\s\S]*?\? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-md border border-slate-200\/80 dark:border-slate-600\/80 ring-1 ring-slate-900\/5"[\s\S]*?: "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800\/50 hover:text-slate-900 dark:text-slate-100 dark:hover:text-slate-200 border border-transparent"/,
  `isActive \n                        ? "bg-cyan-500 text-white shadow-md border border-cyan-400 ring-1 ring-black/10" \n                        : "text-slate-300 hover:bg-[#334155] hover:text-white border border-transparent"`
);
// Icons in Navbar
navContent = navContent.replace(
  /isActive \? \([\s\S]*?\) : "text-slate-500 dark:text-slate-400"/,
  'isActive ? "text-white" : "text-slate-400"'
);
navContent = navContent.replace(/text-slate-700/g, 'text-slate-200'); // Lang dropdown text
fs.writeFileSync('src/components/Navbar.tsx', navContent);

// 4. Sidebar.tsx - Slate Dark Gray (#334155)
let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
sidebarContent = sidebarContent.replace(
  /border-slate-200\/50 dark:border-slate-700\/50 flex flex-col z-10 bg-white\/10 dark:bg-slate-900\/10 backdrop-blur-md/,
  'border-slate-800 flex flex-col z-10 bg-[#334155] shadow-2xl'
);
sidebarContent = sidebarContent.replace(/text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase/, 'text-slate-400 uppercase');
sidebarContent = sidebarContent.replace(
  /isActive[\s\S]*?\? "bg-white dark:bg-slate-800\/80 shadow-md text-blue-700 dark:text-blue-400 border border-slate-200\/80 dark:border-slate-700\/80 ring-1 ring-slate-900\/5 dark:ring-white\/5"[\s\S]*?: "text-slate-600 dark:text-slate-400 hover:bg-white\/50 dark:hover:bg-slate-800\/50 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent"/,
  `isActive \n                  ? "bg-[#1A365D] shadow-inner text-cyan-400 border border-[#1A365D] ring-1 ring-black/20" \n                  : "text-slate-300 hover:bg-slate-700 hover:text-white border border-transparent"`
);
sidebarContent = sidebarContent.replace(
  /isActive \? \([\s\S]*?\) : "text-slate-500 dark:text-slate-400 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-200"/,
  'isActive ? "text-cyan-400" : "text-slate-400 transition-colors group-hover:text-white"'
);
fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);

// 5. ReportAnalyzer.tsx - CTA & Safety Colors
let reportContent = fs.readFileSync('src/components/ReportAnalyzer.tsx', 'utf8');
// Analyze Button (Petroleum Orange #F97316 -> orange-500)
reportContent = reportContent.replace(
  /bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg/,
  'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
);
// Scan Button / AI animations (Electric Cyan #06B6D4)
reportContent = reportContent.replace(/bg-blue-500/g, 'bg-cyan-500'); // General replacements for blue loaders
reportContent = reportContent.replace(/text-blue-600/g, 'text-cyan-600');
reportContent = reportContent.replace(/bg-blue-50 text-blue-700 border-blue-200/g, 'bg-cyan-50 text-cyan-700 border-cyan-200');

// Fix Highlight Colors (Emerald/Amber/Coral Red)
reportContent = reportContent.replace(/bg-rose-100 text-rose-800 dark:bg-rose-900\/40 dark:text-rose-300/g, 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300');
reportContent = reportContent.replace(/bg-rose-500/g, 'bg-red-500');
reportContent = reportContent.replace(/bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900\/30 dark:border-rose-800/g, 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-800');
reportContent = reportContent.replace(/bg-blue-100 text-blue-800 dark:bg-blue-900\/40 dark:text-blue-300 px-1/g, 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-1');

// Processing animation
reportContent = reportContent.replace(/animate-pulse/g, 'animate-pulse text-cyan-600'); 
fs.writeFileSync('src/components/ReportAnalyzer.tsx', reportContent);

// 6. MachineManager.tsx - CTAs
let mmContent = fs.readFileSync('src/components/MachineManager.tsx', 'utf8');
mmContent = mmContent.replace(/bg-blue-600 hover:bg-blue-700 text-white/g, 'bg-orange-500 hover:bg-orange-600 text-white');
fs.writeFileSync('src/components/MachineManager.tsx', mmContent);

console.log("Colors successfully mapped to strategic palette.");
