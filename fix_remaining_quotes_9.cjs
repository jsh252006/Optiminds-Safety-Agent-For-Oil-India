const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/\{mode === 'emergency' \? Oily AI : mode === 'inspector' \? Safety Inspector : Ask Oily AI\}/g, "{mode === 'emergency' ? 'Oily AI' : mode === 'inspector' ? 'Safety Inspector' : 'Ask Oily AI'}");

content = content.replace(/\{mode === 'emergency' \? Emergency Mode : mode === 'inspector' \? Inspector Mode : Standard Mode\}/g, "{mode === 'emergency' ? 'Emergency Mode' : mode === 'inspector' ? 'Inspector Mode' : 'Standard Mode'}");

content = content.replace(/\{mode === 'emergency' \? Standby for critical incident support\. : mode === 'inspector' \? Ready for compliance check\. : I can answer questions about safety rules, PPE, and OISD guidelines\.\}/g, "{mode === 'emergency' ? 'Standby for critical incident support.' : mode === 'inspector' ? 'Ready for compliance check.' : 'I can answer questions about safety rules, PPE, and OISD guidelines.'}");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
