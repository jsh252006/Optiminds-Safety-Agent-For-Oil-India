const fs = require('fs');
let saContent = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

saContent = saContent.replace(
  'bg-amber-50/90 backdrop-blur border-b border-amber-200 p-2.5 text-amber-900',
  'bg-yellow-500/90 backdrop-blur border-b border-yellow-600 p-2.5 text-slate-900'
);
saContent = saContent.replace(
  '<AlertTriangle className="w-4 h-4 text-amber-600" />',
  '<AlertTriangle className="w-4 h-4 text-slate-900" />'
);
// The user chat bubbles should not be red-900 on amber-500. They should use Slate 800 or similar
saContent = saContent.replace(
  /msg.role === 'user' \n                  \? "bg-amber-500 text-red-900 rounded-tr-sm"/,
  `msg.role === 'user' \n                  ? "bg-slate-700 text-white rounded-tr-sm"`
);

// Fix confidence score colors
saContent = saContent.replace(/bg-red-50 text-red-700 border-red-200/g, 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300');
saContent = saContent.replace(/bg-emerald-50 text-emerald-700 border-emerald-200/g, 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300');
saContent = saContent.replace(/bg-amber-50 text-amber-700 border-amber-200/g, 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300');

fs.writeFileSync('src/components/SafetyAssistant.tsx', saContent);

