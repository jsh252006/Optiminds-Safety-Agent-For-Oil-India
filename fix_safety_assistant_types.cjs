const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/mode\?: general \| emergency \| inspector;/g, "mode?: 'general' | 'emergency' | 'inspector';");
content = content.replace(/export default function SafetyAssistant\(\{ mode = general \}: SafetyAssistantProps\) \{/g, "export default function SafetyAssistant({ mode = 'general' }: SafetyAssistantProps) {");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
