const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-400/20 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob"></div>',
  '<div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-slate-400/20 dark:bg-slate-800/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob"></div>'
);
content = content.replace(
  '<div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-cyan-400/20 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>',
  '<div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-orange-400/10 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>'
);
content = content.replace(
  '<div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-pink-400/20 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>',
  '<div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-blue-400/10 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>'
);
content = content.replace(
  '<div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-amber-400/20 dark:bg-amber-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob"></div>',
  '<div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-slate-300/20 dark:bg-slate-800/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob"></div>'
);

fs.writeFileSync('src/App.tsx', content);
console.log('App updated.');
