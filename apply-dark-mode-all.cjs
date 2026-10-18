const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if we already applied dark mode to avoid duplicates
    if (content.includes('dark:bg-slate-900') && filePath.includes('SafetyAssistant')) {
        // It might have been already done by previous scripts, but let's do a smart regex replace
    }

    // Only apply to files that don't already have dark: extensively (except we want to be safe)
    // Actually, simple regex to replace specific classes if they don't already have a dark: counterpart
    
    const replacements = [
        [/(?<!dark:)(bg-white)(?!\/)/g, 'bg-white dark:bg-slate-800'],
        [/(?<!dark:)(bg-slate-50)(?!\/|\w)/g, 'bg-slate-50 dark:bg-slate-900'],
        [/(?<!dark:)(bg-slate-100)(?!\/|\w)/g, 'bg-slate-100 dark:bg-slate-800/80'],
        [/(?<!dark:)(bg-slate-200)(?!\/|\w)/g, 'bg-slate-200 dark:bg-slate-700'],
        
        [/(?<!dark:)(text-slate-900)(?!\/|\w)/g, 'text-slate-900 dark:text-slate-100'],
        [/(?<!dark:)(text-slate-800)(?!\/|\w)/g, 'text-slate-800 dark:text-slate-200'],
        [/(?<!dark:)(text-slate-700)(?!\/|\w)/g, 'text-slate-700 dark:text-slate-300'],
        [/(?<!dark:)(text-slate-600)(?!\/|\w)/g, 'text-slate-600 dark:text-slate-400'],
        [/(?<!dark:)(text-slate-500)(?!\/|\w)/g, 'text-slate-500 dark:text-slate-400'],
        
        [/(?<!dark:)(border-slate-200)(?!\/|\w)/g, 'border-slate-200 dark:border-slate-700'],
        [/(?<!dark:)(border-slate-300)(?!\/|\w)/g, 'border-slate-300 dark:border-slate-600']
    ];

    let newContent = content;
    for (const [regex, replacement] of replacements) {
        newContent = newContent.replace(regex, replacement);
    }
    
    // Clean up duplicates if any
    newContent = newContent.replace(/dark:bg-slate-800 dark:bg-slate-800/g, 'dark:bg-slate-800');
    newContent = newContent.replace(/dark:text-slate-100 dark:text-slate-100/g, 'dark:text-slate-100');

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${filePath}`);
    }
}

const componentsDir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(componentsDir);

files.forEach(file => {
    if (file.endsWith('.tsx') && !['App.tsx', 'Navbar.tsx', 'Sidebar.tsx', 'AuthPage.tsx', 'HomeDashboard.tsx'].includes(file)) {
        replaceInFile(path.join(componentsDir, file));
    }
});
