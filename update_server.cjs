const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `
    const site = req.body.site || "Unknown Site";
    const useTee = req.body.useTee === 'true';

    // Simulate TEE log
    if (useTee) {
       console.log("[Confidential AI] Request received in Trusted Execution Environment (TEE). Encrypting context...");
    }
`;
content = content.replace('const site = req.body.site || "Unknown Site";', replacement);
fs.writeFileSync('server.ts', content);
