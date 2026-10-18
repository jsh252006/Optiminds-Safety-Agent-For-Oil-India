const fs = require('fs');
let content = fs.readFileSync('src/components/ReportAnalyzer.tsx', 'utf8');

// Update highlight wrapper
content = content.replace(
  'return <span key={i} className={colorClass}>{part}</span>;',
  'return <span key={i} className={`${colorClass} cursor-help transition-all hover:-translate-y-0.5 inline-block`} title={`Detected Hazard: ${match.word.toUpperCase()} (${match.severity})`}>{part}</span>;'
);

fs.writeFileSync('src/components/ReportAnalyzer.tsx', content);

// Update dark mode background in index.css
let cssContent = fs.readFileSync('src/index.css', 'utf8');
cssContent = cssContent.replace(
  '@apply bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100;',
  '@apply bg-slate-50 text-slate-900 dark:bg-[#1e293b] dark:text-slate-100;'
);
fs.writeFileSync('src/index.css', cssContent);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/dark:bg-slate-950/g, 'dark:bg-[#1e293b]');
fs.writeFileSync('src/App.tsx', appContent);

