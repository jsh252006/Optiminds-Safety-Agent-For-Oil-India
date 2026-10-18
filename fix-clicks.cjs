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

replaceFile('src/components/HomeDashboard.tsx', [
    ['hover:scale-105', 'hover:scale-105 active:scale-95'],
    ['whileTap={{ scale: 0.98 }}', 'whileTap={{ scale: 0.95 }}']
]);

replaceFile('src/components/Navbar.tsx', [
    ['hover:bg-slate-200 dark:hover:bg-slate-700', 'hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95']
]);

