const fs = require('fs');
let navContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

navContent = navContent.replace(
  /const isActive \n                  \? "bg-\[#1A365D\] shadow-inner text-cyan-400 border border-\[#1A365D\] ring-1 ring-black\/20" \n                  : "text-slate-300 hover:bg-slate-700 hover:text-white border border-transparent"\n              \)}\n            >/,
  `const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left",
                isActive 
                  ? "bg-[#1A365D] shadow-inner text-cyan-400 border border-[#1A365D] ring-1 ring-black/20" 
                  : "text-slate-300 hover:bg-slate-700 hover:text-white border border-transparent"
              )}
            >`
);
fs.writeFileSync('src/components/Sidebar.tsx', navContent);
