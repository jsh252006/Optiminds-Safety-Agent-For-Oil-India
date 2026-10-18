const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/from react;/g, "from 'react';");
content = content.replace(/from lucide-react;/g, "from 'lucide-react';");
content = content.replace(/from \.\.\/types;/g, "from '../types';");
content = content.replace(/from \.\.\/lib\/utils;/g, "from '../lib/utils';");
content = content.replace(/from \.\.\/lib\/audio;/g, "from '../lib/audio';");
content = content.replace(/from \.\.\/contexts\/LanguageContext;/g, "from '../contexts/LanguageContext';");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
