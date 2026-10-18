const fs = require('fs');
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

content = content.replace(
  '<Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />',
  `
  <Icon className={cn("w-5 h-5", 
    isActive ? 
      (item.id === 'assistant' ? "text-blue-600 dark:text-blue-400" :
       item.id === 'machines' ? "text-orange-500" :
       item.id === 'analyzer' ? "text-emerald-500" :
       item.id === 'analytics' ? "text-purple-500" :
       item.id === 'weekly' ? "text-amber-500" :
       item.id === 'rules' ? "text-cyan-500" :
       item.id === 'sources' ? "text-rose-500" :
       item.id === 'help' ? "text-indigo-500" : "text-blue-700") 
    : "text-slate-500 dark:text-slate-400 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-200"
  )} />
  `
);
fs.writeFileSync('src/components/Sidebar.tsx', content);

let navContent = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navContent = navContent.replace(
  '<Icon className={cn("w-3.5 h-3.5", isActive ? "text-blue-700" : "text-slate-500 dark:text-slate-400")} />',
  `<Icon className={cn("w-3.5 h-3.5", 
    isActive ? 
      (item.id === 'assistant' ? "text-blue-600" :
       item.id === 'machines' ? "text-orange-500" :
       item.id === 'analyzer' ? "text-emerald-500" :
       item.id === 'analytics' ? "text-purple-500" : "text-blue-700") 
    : "text-slate-500 dark:text-slate-400")} />`
);
fs.writeFileSync('src/components/Navbar.tsx', navContent);
