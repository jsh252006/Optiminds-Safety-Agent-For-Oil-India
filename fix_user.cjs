const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/msg\.role === user/g, "msg.role === 'user'");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
