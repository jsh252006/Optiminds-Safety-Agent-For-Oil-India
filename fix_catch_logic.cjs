const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/error\.message\?\.includes\(503\)/g, "error.message?.includes('503') || error.message?.includes('500') || error.message?.includes('unavailable')");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
