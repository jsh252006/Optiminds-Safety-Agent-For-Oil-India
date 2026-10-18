const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/\? hi-IN :  en-IN;/g, "? 'hi-IN' : 'en-IN';");
content = content.replace(/v\.lang\.includes\(IN\)/g, "v.lang.includes('IN')");
content = content.replace(/\? hi-IN :  en-US;/g, "? 'hi-IN' : 'en-US';");
content = content.replace(/msg\.confidence === HIGH/g, "msg.confidence === 'HIGH'");
content = content.replace(/includes\(emergency\)/g, "includes('emergency')");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
