const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

const fetchBlock = `
      const contentType = res.headers.get('content-type');
      if (!res.ok) {
        let errorMsg = 'Failed to fetch response';
        try {
          if (contentType && contentType.includes('application/json')) {
            const errData = await res.json();
            errorMsg = errData.error || errorMsg;
          } else {
            errorMsg = \`Server returned HTTP \${res.status} (\${res.statusText})\`;
          }
        } catch(e) {}
        throw new Error(errorMsg);
      }
      
      if (!contentType || !contentType.includes('application/json')) {
         throw new Error('The server is currently unavailable or experiencing high demand. Please try again later.');
      }
      
      const data = await res.json();
`;

// Replace the old fetch logic
content = content.replace(/if \(!res\.ok\) \{[\s\S]*?const data = await res\.json\(\);/, fetchBlock.trim());

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
