const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/fetch\(\/api\/chat, \{/g, "fetch('/api/chat', {");
content = content.replace(/setMode\(chat\)/g, "setMode('chat')");
content = content.replace(/setMode\(emergency\)/g, "setMode('emergency')");
content = content.replace(/setMode\(inspector\)/g, "setMode('inspector')");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
