const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/let errorMsg = Failed to fetch response;/g, "let errorMsg = 'Failed to fetch response';");
content = content.replace(/throw new Error\(errorMsg\);/g, "throw new Error(errorMsg);");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
