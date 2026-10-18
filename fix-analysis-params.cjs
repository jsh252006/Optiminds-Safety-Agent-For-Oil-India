const fs = require('fs');
let content = fs.readFileSync('src/components/ReportAnalyzer.tsx', 'utf8');

const regex = /formData\.append\('language', language\);/;
const replacement = `formData.append('language', language);
      if (site) formData.append('site', site);
      if (eventCategory) formData.append('eventCategory', eventCategory);
      if (activity) formData.append('activity', activity);`;
content = content.replace(regex, replacement);

// Require location and event category
const validateRegex = /if \(\!reportTitle\.trim\(\) \|\| \(\!reportText\.trim\(\) && \!reportFile\)\) return;/;
const validateReplacement = `if (!reportTitle.trim() || (!reportText.trim() && !reportFile)) {
      alert("Please provide a Title and Report (text or file).");
      return;
    }
    if (!site || !eventCategory) {
      alert("Please select a Location/Site and an Event Category before analyzing.");
      return;
    }`;
content = content.replace(validateRegex, validateReplacement);

fs.writeFileSync('src/components/ReportAnalyzer.tsx', content);

let serverContent = fs.readFileSync('server.ts', 'utf8');
const serverRegex = /const language = req\.body\.language \|\| "English";/;
const serverReplacement = `const language = req.body.language || "English";
    const site = req.body.site || "Unknown Site";
    const eventCategory = req.body.eventCategory || "Auto-Detect";
    const activity = req.body.activity || "Unknown Activity";`;
serverContent = serverContent.replace(serverRegex, serverReplacement);

const promptRegex = /Incident Report Text:/;
const promptReplacement = `Context:
    - Site / Location: \${site}
    - Event Category: \${eventCategory}
    - Activity: \${activity}
    
    Incident Report Text:`;
serverContent = serverContent.replace(promptRegex, promptReplacement);
fs.writeFileSync('server.ts', serverContent);
