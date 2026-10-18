const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/lowerQuery\.includes\(system mode\) \|\| lowerQuery\.includes\(system theme\) \|\| lowerQuery\.includes\(change theme to system\)/g, "lowerQuery.includes('system mode') || lowerQuery.includes('system theme') || lowerQuery.includes('change theme to system')");

content = content.replace(/role: user/g, "role: 'user'");
content = content.replace(/role: assistant/g, "role: 'assistant'");
content = content.replace(/method: POST/g, "method: 'POST'");
content = content.replace(/application\/json/g, "'application/json'");
content = content.replace(/content-type/g, "'content-type'");
content = content.replace(/Failed to get response/g, "'Failed to get response'");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
