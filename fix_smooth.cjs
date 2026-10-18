const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/behavior: smooth/g, "behavior: 'smooth'");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
