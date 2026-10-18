const fs = require('fs');
let content = fs.readFileSync('src/components/HomeDashboard.tsx', 'utf8');

content = content.replace(/className="text-slate-700"className=/g, 'className=');

fs.writeFileSync('src/components/HomeDashboard.tsx', content);
