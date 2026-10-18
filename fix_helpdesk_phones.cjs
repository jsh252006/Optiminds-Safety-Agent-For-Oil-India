const fs = require('fs');
let content = fs.readFileSync('src/components/HelpDesk.tsx', 'utf8');

// Replace the phone numbers with clickable a tags
content = content.replace(
  '<div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">1800-233-4000</div>',
  '<a href="tel:18002334000" className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight hover:underline block">1800-233-4000</a>'
);

content = content.replace(
  '<div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">1800-233-4001</div>',
  '<a href="tel:18002334001" className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight hover:underline block">1800-233-4001</a>'
);

content = content.replace(
  '<div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">1800-233-4002</div>',
  '<a href="tel:18002334002" className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight hover:underline block">1800-233-4002</a>'
);

content = content.replace(
  '<div className="text-lg font-bold text-slate-800 dark:text-slate-200">+91 374 280 4444</div>',
  '<a href="tel:+913742804444" className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline block">+91 374 280 4444</a>'
);

content = content.replace(
  '<div className="text-lg font-bold text-blue-600 hover:underline cursor-pointer">helpdesk@oilindia.in</div>',
  '<a href="mailto:helpdesk@oilindia.in" className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline block">helpdesk@oilindia.in</a>'
);

fs.writeFileSync('src/components/HelpDesk.tsx', content);
