const fs = require('fs');
let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Ensure text-cyan-400 is not overridden by active icon
sidebarContent = sidebarContent.replace(
  `isActive ? "text-cyan-400" : "text-slate-400 transition-colors group-hover:text-white"`,
  `isActive ? "text-cyan-400" : "text-slate-400 transition-colors group-hover:text-white"`
);

// We need to fix the active/inactive logic in the Sidebar and Navbar if it got mangled
sidebarContent = sidebarContent.replace(
  `isActive \n                  ? "bg-[#1A365D] shadow-inner text-cyan-400 border border-[#1A365D] ring-1 ring-black/20" \n                  : "text-slate-300 hover:bg-slate-700 hover:text-white border border-transparent"`,
  `isActive 
                  ? "bg-[#1A365D] shadow-inner text-cyan-400 border border-[#1A365D] ring-1 ring-black/20" 
                  : "text-slate-300 hover:bg-slate-700 hover:text-white border border-transparent"`
);

fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);
