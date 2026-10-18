const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/error\.message\?\.includes\(high demand\)/g, "error.message?.includes('high demand')");
content = content.replace(/"Im having trouble/g, "\"I'm having trouble");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
