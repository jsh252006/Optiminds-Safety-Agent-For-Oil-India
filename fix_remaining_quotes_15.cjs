const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/animationDelay: 0\.2s/g, "animationDelay: '0.2s'");
content = content.replace(/animationDelay: 0\.4s/g, "animationDelay: '0.4s'");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
