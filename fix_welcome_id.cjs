const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/id: welcome,/g, "id: 'welcome',");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
