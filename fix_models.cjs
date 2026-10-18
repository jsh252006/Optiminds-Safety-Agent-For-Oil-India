const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/"gemini-3\.8-flash"/g, '"gemini-3.1-flash-lite"');
content = content.replace(/'gemini-3\.8-flash'/g, "'gemini-3.1-flash-lite'");

fs.writeFileSync('server.ts', content);
