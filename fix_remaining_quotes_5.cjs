const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/Content-Type:/g, "'Content-Type':");
content = content.replace(/language: languageName,/g, "language: languageName,");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
