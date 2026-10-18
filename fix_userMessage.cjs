const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

const toReplace = `
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setQuery('');
`;

// Remove the old declaration
content = content.replace(toReplace, "");

const insertAt = `
    // Basic Task & Greeting Fast-Path (Reduces Server Load & Makes it Faster)
`;

const insertText = `
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query
    };
    const newMessages = [...messages, userMessage];

    // Basic Task & Greeting Fast-Path (Reduces Server Load & Makes it Faster)
`;

content = content.replace(insertAt, insertText);

const fixTheme = `
    if (themeChanged) {
      setMessages(newMessages);
      setQuery('');
`;

content = content.replace('    if (themeChanged) {', fixTheme);

const fixApi = `
    setIsTyping(true);
    setMessages(newMessages);
    setQuery('');

    try {
`;

content = content.replace('    setIsTyping(true);\n\n    try {', fixApi);


fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
