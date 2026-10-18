const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/msg\.structuredResponse\.answer : \)/g, "msg.structuredResponse.answer : '')");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
