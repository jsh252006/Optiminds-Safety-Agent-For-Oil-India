const fs = require('fs');

let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
// Remove bg-transparent and leave bg-[#334155]
sidebar = sidebar.replace('bg-transparent border-r border-slate-800 flex flex-col z-10 bg-[#334155]', 'bg-[#334155] border-r border-slate-800 flex flex-col z-10');
// Make inactive text clearer
sidebar = sidebar.replace(/"text-slate-300 hover:bg-slate-700 hover:text-white border border-transparent"/g, '"text-slate-300 hover:bg-slate-700 hover:text-white border border-transparent"');
// Make icons clearer
sidebar = sidebar.replace(/: "text-slate-400 transition-colors group-hover:text-white"\)} \/>/g, ': "text-slate-400 transition-colors group-hover:text-white")} />');
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
// Make text in navbar fully white for inactive tabs for maximum contrast against navy
nav = nav.replace(/: "text-slate-300 hover:bg-\[#334155\] hover:text-white border border-transparent"/g, ': "text-slate-200 hover:bg-[#334155] hover:text-white border border-transparent"');
fs.writeFileSync('src/components/Navbar.tsx', nav);

console.log('Fixed visibility conflicts');
