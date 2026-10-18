const fs = require('fs');
let content = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');

content = content.replace(/Risk Score > 75/g, "Risk Score &gt; 75");

fs.writeFileSync('src/components/AnalyticsDashboard.tsx', content);
