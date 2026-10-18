const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/from \.\.\/contexts\/ThemeContext;/g, "from '../contexts/ThemeContext';");
content = content.replace(/from \.\/OilyAILogo;/g, "from './OilyAILogo';");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
