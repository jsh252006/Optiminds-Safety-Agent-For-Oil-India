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

replaceFile('src/components/AnalyticsDashboard.tsx', [
    ['p-6 lg:p-10', 'p-4 md:p-6 lg:p-8']
]);

replaceFile('src/components/MachineManager.tsx', [
    ['p-6 md:p-8', 'p-4 md:p-6 lg:p-8']
]);

replaceFile('src/components/ReportAnalyzer.tsx', [
    ['p-6 lg:p-10', 'p-4 md:p-6 lg:p-8']
]);

replaceFile('src/components/WeeklyBriefing.tsx', [
    ['p-6 lg:p-10', 'p-4 md:p-6 lg:p-8'],
    ['p-8', 'p-4 md:p-8']
]);

