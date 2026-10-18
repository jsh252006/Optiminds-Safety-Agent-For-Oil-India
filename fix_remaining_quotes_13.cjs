const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/t\(assistant\.read_aloud\) \|\| Read Aloud/g, "t('assistant.read_aloud') || 'Read Aloud'");
content = content.replace(/assistant\.read_aloud/g, "'assistant.read_aloud'");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
