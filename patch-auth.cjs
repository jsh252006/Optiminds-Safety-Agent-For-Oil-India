const fs = require('fs');

let content = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');

content = content.replace(/bg-stone-50/g, 'bg-amber-50');
content = content.replace(/hover:bg-stone-50/g, 'hover:bg-amber-50');

fs.writeFileSync('src/components/AuthPage.tsx', content);
console.log('AuthPage patched successfully.');
