const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/: Oily AI Emergency Mode\. I am on standby for immediate evacuation procedures, first aid protocols, and crisis response\. What is your situation\?;/g, ": 'Oily AI Emergency Mode. I am on standby for immediate evacuation procedures, first aid protocols, and crisis response. What is your situation?';");

content = content.replace(/: Safety Inspector AI\. I can assist with identifying workplace hazards, checklist generation, and compliance checking\. What area are you inspecting\?;/g, ": 'Safety Inspector AI. I can assist with identifying workplace hazards, checklist generation, and compliance checking. What area are you inspecting?';");

content = content.replace(/: Hello! I am Oily, the OPTIMINDS Safety AI Assistant\. Ask me anything about safety rules, PPE, or best practices based on OIL and OISD guidelines\.;/g, ": 'Hello! I am Oily, the OPTIMINDS Safety AI Assistant. Ask me anything about safety rules, PPE, or best practices based on OIL and OISD guidelines.';");

content = content.replace(/languageName === 'Hindi' \? hi-IN : en-IN/g, "languageName === 'Hindi' ? 'hi-IN' : 'en-IN'");
content = content.replace(/languageName === 'Hindi' \? hi-IN : en-US/g, "languageName === 'Hindi' ? 'hi-IN' : 'en-US'");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
