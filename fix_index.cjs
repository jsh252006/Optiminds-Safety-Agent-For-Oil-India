const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Remove the console.warn for window.fetch overwrite
content = content.replace(/console\.warn\('Ignored attempt to overwrite window\.fetch'\);/g, "");

fs.writeFileSync('index.html', content);
