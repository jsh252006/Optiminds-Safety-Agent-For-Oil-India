const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

content = content.replace(
  'className="flex items-center gap-1 p-1 bg-[#334155]/50 rounded-xl border border-[#334155] shadow-inner"',
  'className="flex items-center gap-1 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl border border-slate-300/50 dark:border-slate-700/50 shadow-inner"'
);

fs.writeFileSync('src/components/Navbar.tsx', content);
console.log('Navbar nav patched successfully.');
