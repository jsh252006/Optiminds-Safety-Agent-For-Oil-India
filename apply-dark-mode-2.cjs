const fs = require('fs');

function replaceFile(path, replacements) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    fs.writeFileSync(path, content);
    console.log(`Updated ${path}`);
}

// SafetyAssistant.tsx
replaceFile('src/components/SafetyAssistant.tsx', [
    ['bg-slate-50', 'bg-slate-50 dark:bg-slate-900/50'],
    ['bg-white', 'bg-white dark:bg-slate-800'],
    ['border-slate-200', 'border-slate-200 dark:border-slate-700'],
    ['text-slate-900', 'text-slate-900 dark:text-slate-100'],
    ['text-slate-800', 'text-slate-800 dark:text-slate-200'],
    ['text-slate-700', 'text-slate-700 dark:text-slate-300'],
    ['text-slate-600', 'text-slate-600 dark:text-slate-400'],
    ['text-slate-500', 'text-slate-500 dark:text-slate-400'],
    ['bg-slate-100', 'bg-slate-100 dark:bg-slate-800/80'],
    ['bg-blue-50 text-blue-900', 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'],
    ['bg-blue-100', 'bg-blue-100 dark:bg-blue-900/50'],
    ['bg-red-50 text-red-900', 'bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-100'],
    ['hover:bg-slate-200', 'hover:bg-slate-200 dark:hover:bg-slate-700'],
    ['ring-slate-300', 'ring-slate-300 dark:ring-slate-600']
]);

// ReportAnalyzer.tsx
replaceFile('src/components/ReportAnalyzer.tsx', [
    ['bg-white', 'bg-white dark:bg-slate-800'],
    ['bg-slate-50', 'bg-slate-50 dark:bg-slate-900'],
    ['border-slate-200', 'border-slate-200 dark:border-slate-700'],
    ['border-slate-300', 'border-slate-300 dark:border-slate-600'],
    ['text-slate-900', 'text-slate-900 dark:text-slate-100'],
    ['text-slate-800', 'text-slate-800 dark:text-slate-200'],
    ['text-slate-700', 'text-slate-700 dark:text-slate-300'],
    ['text-slate-600', 'text-slate-600 dark:text-slate-400'],
    ['text-slate-500', 'text-slate-500 dark:text-slate-400'],
    ['bg-slate-100', 'bg-slate-100 dark:bg-slate-800/80'],
    ['bg-red-50', 'bg-red-50 dark:bg-red-900/20'],
    ['text-red-800', 'text-red-800 dark:text-red-400'],
    ['text-amber-800', 'text-amber-800 dark:text-amber-400'],
    ['bg-amber-50', 'bg-amber-50 dark:bg-amber-900/20'],
    ['text-emerald-800', 'text-emerald-800 dark:text-emerald-400'],
    ['bg-emerald-50', 'bg-emerald-50 dark:bg-emerald-900/20']
]);

// AnalyticsDashboard.tsx
replaceFile('src/components/AnalyticsDashboard.tsx', [
    ['bg-white', 'bg-white dark:bg-slate-800'],
    ['bg-slate-50', 'bg-slate-50 dark:bg-slate-900'],
    ['border-slate-200', 'border-slate-200 dark:border-slate-700'],
    ['border-slate-100', 'border-slate-100 dark:border-slate-700/50'],
    ['text-slate-900', 'text-slate-900 dark:text-slate-100'],
    ['text-slate-800', 'text-slate-800 dark:text-slate-200'],
    ['text-slate-700', 'text-slate-700 dark:text-slate-300'],
    ['text-slate-600', 'text-slate-600 dark:text-slate-400'],
    ['text-slate-500', 'text-slate-500 dark:text-slate-400'],
    ['bg-slate-100', 'bg-slate-100 dark:bg-slate-800/80']
]);

