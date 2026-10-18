const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/data\.structuredResponse\.answer : \)/g, "data.structuredResponse.answer : '')");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
