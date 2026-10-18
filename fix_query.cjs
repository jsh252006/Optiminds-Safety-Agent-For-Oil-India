const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

// Initialize query state with empty string instead of undefined
content = content.replace(/const \[query, setQuery\] = useState\(\);/g, "const [query, setQuery] = useState('');");

// Fix the setQuery() call to reset it to empty string
content = content.replace(/setQuery\(\);/g, "setQuery('');");

// Add optional chaining just to be extra safe
content = content.replace(/!query\.trim\(\)/g, "!(query || '').trim()");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
