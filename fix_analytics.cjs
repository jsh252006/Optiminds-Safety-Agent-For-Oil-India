const fs = require('fs');
let content = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');

// Tone down border radii
content = content.replace(/rounded-3xl/g, 'rounded-xl');
content = content.replace(/rounded-2xl/g, 'rounded-xl');

fs.writeFileSync('src/components/AnalyticsDashboard.tsx', content);
console.log("AnalyticsDashboard fixed.");
