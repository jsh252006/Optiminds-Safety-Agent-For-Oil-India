const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/!\(speechSynthesis in window\)/g, "!('speechSynthesis' in window)");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
