const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

// Tone down border radii
content = content.replace(/rounded-3xl/g, 'rounded-xl');
content = content.replace(/rounded-2xl/g, 'rounded-xl');
content = content.replace(/rounded-br-sm/g, 'rounded-br-md');
content = content.replace(/rounded-bl-sm/g, 'rounded-bl-md');

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
console.log("SafetyAssistant fixed.");
