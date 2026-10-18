const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');
content = content.replace('p-6 space-y-8', 'p-4 md:p-6 space-y-6 md:space-y-8');
content = content.replace('pl-5 pr-14 py-4 rounded-2xl border', 'pl-4 pr-12 md:pl-5 md:pr-14 py-3 md:py-4 rounded-2xl border');
content = content.replace('className="absolute right-2.5 top-2.5 p-2', 'className="absolute right-2 md:right-2.5 top-1.5 md:top-2.5 p-1.5 md:p-2');
content = content.replace('w-5 h-5', 'w-4 h-4 md:w-5 md:h-5');
fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
