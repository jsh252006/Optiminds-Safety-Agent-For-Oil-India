const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/: Your intelligent safety companion\. Ask questions about procedures, PPE, or regulatory compliance, grounded entirely in the OIL India official knowledge base\.\}/g, ": 'Your intelligent safety companion. Ask questions about procedures, PPE, or regulatory compliance, grounded entirely in the OIL India official knowledge base.'}");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
