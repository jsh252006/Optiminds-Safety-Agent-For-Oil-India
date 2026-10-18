const fs = require('fs');
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
sidebar = sidebar.replace(/text-slate-400 uppercase tracking-widest tracking-widest/g, 'text-slate-200 uppercase tracking-widest');
sidebar = sidebar.replace(/text-slate-400 uppercase tracking-widest/g, 'text-slate-200 uppercase tracking-widest');
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
