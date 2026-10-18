const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Also update dark:bg-[#1e293b] if it's there
app = app.replace(/dark:bg-\[#1e293b\]/g, 'dark:bg-[#0b1121]');
app = app.replace(/bg-slate-50/g, 'bg-[#f8fafc]');

// The mesh gradient
app = app.replace(
  '<div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-slate-400/20 dark:bg-slate-800/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob"></div>',
  '<div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob"></div>'
);
app = app.replace(
  '<div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-orange-400/10 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>',
  '<div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-teal-400/30 dark:bg-teal-600/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>'
);
app = app.replace(
  '<div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-blue-400/10 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>',
  '<div className="absolute bottom-[-20%] left-[20%] w-[50rem] h-[50rem] bg-rose-400/30 dark:bg-rose-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>'
);
app = app.replace(
  '<div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-slate-300/20 dark:bg-slate-800/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob"></div>',
  '<div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-amber-400/20 dark:bg-amber-700/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob"></div>'
);

fs.writeFileSync('src/App.tsx', app);
console.log('App background fixed');
