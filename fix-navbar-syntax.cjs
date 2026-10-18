const fs = require('fs');
let navContent = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

navContent = navContent.replace(
  /const isActive \n                        \? "bg-cyan-500 text-white shadow-md border border-cyan-400 ring-1 ring-black\/10" \n                        : "text-slate-300 hover:bg-\[#334155\] hover:text-white border border-transparent"\n                    \)}\n                  >/,
  `const isActive = currentTab === item.id;
              return (
                <div key={item.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentTab(item.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap",
                      isActive 
                        ? "bg-cyan-500 text-white shadow-md border border-cyan-400 ring-1 ring-black/10" 
                        : "text-slate-300 hover:bg-[#334155] hover:text-white border border-transparent"
                    )}
                  >`
);
fs.writeFileSync('src/components/Navbar.tsx', navContent);
