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

// App.tsx
replaceFile('src/App.tsx', [
    ['bg-slate-50 font-sans text-slate-900', 'bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100'],
    ['bg-white/60 backdrop-blur-xl shadow-2xl shadow-blue-900/5', 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-blue-900/5 dark:shadow-blue-900/20'],
    ['border-white/80', 'border-white/80 dark:border-slate-700/50'],
    ['bg-slate-50 flex items-center justify-center', 'bg-slate-50 dark:bg-slate-950 flex items-center justify-center'],
    ['bg-white rounded-3xl shadow-2xl border border-slate-200/60', 'bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60'],
    ['bg-purple-400/20 rounded-full mix-blend-multiply', 'bg-purple-400/20 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten'],
    ['bg-cyan-400/20 rounded-full mix-blend-multiply', 'bg-cyan-400/20 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten'],
    ['bg-pink-400/20 rounded-full mix-blend-multiply', 'bg-pink-400/20 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten'],
    ['bg-amber-400/20 rounded-full mix-blend-multiply', 'bg-amber-400/20 dark:bg-amber-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten']
]);

// Navbar.tsx
replaceFile('src/components/Navbar.tsx', [
    ['bg-white/40 backdrop-blur-md border-b border-white/60', 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-b border-white/60 dark:border-slate-800/60'],
    ['text-slate-900 leading-tight group-hover:text-blue-700', 'text-slate-900 dark:text-slate-100 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400'],
    ['bg-slate-200/40 rounded-xl border border-slate-200/60', 'bg-slate-200/40 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60'],
    ['bg-white text-blue-700 shadow-md border border-slate-200/80', 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-md border border-slate-200/80 dark:border-slate-600/80'],
    ['text-slate-600 hover:bg-slate-50 hover:text-slate-900', 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'],
    ['bg-slate-300/50', 'bg-slate-300/50 dark:bg-slate-700/50'],
    ['bg-slate-100 hover:bg-slate-200 text-slate-700', 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'],
    ['bg-white rounded-xl shadow-xl border border-slate-200', 'bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700'],
    ['hover:bg-blue-50 hover:text-blue-700', 'hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400'],
    ['bg-white text-slate-800 text-sm rounded-xl', 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm rounded-xl'],
    ['border-b border-slate-100 bg-slate-50', 'border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50'],
    ['text-slate-900', 'text-slate-900 dark:text-slate-100'],
    ['text-slate-500', 'text-slate-500 dark:text-slate-400'],
    ['text-slate-700', 'text-slate-700 dark:text-slate-300'],
    ['border-l border-slate-200', 'border-l border-slate-200 dark:border-slate-700/50'],
    ['bg-slate-100 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200 shadow-sm', 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm']
]);

// Sidebar.tsx
replaceFile('src/components/Sidebar.tsx', [
    ['bg-white/40 backdrop-blur-md border-r border-white/60', 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-r border-white/60 dark:border-slate-800/60'],
    ['text-slate-400 uppercase', 'text-slate-400 dark:text-slate-500 uppercase'],
    ['text-slate-600 hover:bg-white hover:text-blue-700 hover:shadow-sm border border-transparent', 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 hover:shadow-sm border border-transparent dark:hover:border-slate-700/50'],
    ['bg-blue-600 text-white shadow-md shadow-blue-900/20 border border-blue-500', 'bg-blue-600 dark:bg-blue-600/90 text-white shadow-md shadow-blue-900/20 border border-blue-500 dark:border-blue-500/50'],
    ['bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/50', 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-300/50 dark:border-slate-700/50'],
    ['text-slate-800', 'text-slate-800 dark:text-slate-200'],
    ['text-slate-500', 'text-slate-500 dark:text-slate-400'],
    ['text-blue-700', 'text-blue-700 dark:text-blue-400']
]);

// AuthPage.tsx
replaceFile('src/components/AuthPage.tsx', [
    ['bg-stone-50 flex flex-col', 'bg-stone-50 dark:bg-slate-950 flex flex-col'],
    ['text-stone-900', 'text-stone-900 dark:text-slate-100'],
    ['text-stone-500', 'text-stone-500 dark:text-slate-400'],
    ['bg-white py-8 px-4 shadow-xl shadow-stone-200/50 sm:rounded-2xl sm:px-10 border border-stone-100', 'bg-white dark:bg-slate-900 py-8 px-4 shadow-xl shadow-stone-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-stone-100 dark:border-slate-800'],
    ['text-stone-700', 'text-stone-700 dark:text-slate-300'],
    ['bg-stone-50 focus:bg-white', 'bg-stone-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-950'],
    ['ring-stone-300', 'ring-stone-300 dark:ring-slate-700'],
    ['text-stone-400', 'text-stone-400 dark:text-slate-500'],
    ['border-dashed border-stone-300 text-stone-600 hover:bg-stone-50', 'border-dashed border-stone-300 dark:border-slate-700 text-stone-600 dark:text-slate-400 hover:bg-stone-50 dark:hover:bg-slate-800'],
    ['border-t border-stone-200', 'border-t border-stone-200 dark:border-slate-800'],
    ['bg-white px-3 text-stone-500', 'bg-white dark:bg-slate-900 px-3 text-stone-500 dark:text-slate-400'],
    ['bg-white px-3 py-2.5 text-sm font-semibold text-stone-700 shadow-sm ring-1 ring-inset ring-stone-300 hover:bg-stone-50', 'bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold text-stone-700 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-stone-300 dark:ring-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700'],
    ['text-stone-600 font-medium', 'text-stone-600 dark:text-slate-400 font-medium']
]);

// HomeDashboard.tsx
replaceFile('src/components/HomeDashboard.tsx', [
    ['text-slate-900', 'text-slate-900 dark:text-slate-100'],
    ['text-slate-500', 'text-slate-500 dark:text-slate-400'],
    ['text-slate-600', 'text-slate-600 dark:text-slate-400'],
    ['bg-white/80 border border-slate-200/60 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-300/50', 'bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:bg-slate-700/80'],
    ['text-slate-700', 'text-slate-700 dark:text-slate-300'],
    ['bg-slate-50/50', 'bg-slate-50/50 dark:bg-slate-900/50']
]);

