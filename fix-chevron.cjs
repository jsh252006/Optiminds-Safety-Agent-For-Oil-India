const fs = require('fs');
let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
nav = nav.replace(
  '<ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />',
  '<ChevronDown className="w-3 h-3 text-slate-400" />'
);
fs.writeFileSync('src/components/Navbar.tsx', nav);
