const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/if \(event\.error === not-allowed\) \{/g, "if (event.error === 'not-allowed') {");
content = content.replace(/console\.warn\(Microphone access was denied or not allowed in this context\.\);/g, "console.warn('Microphone access was denied or not allowed in this context.');");
content = content.replace(/console\.warn\(Speech recognition error:, event\.error\);/g, "console.warn('Speech recognition error:', event.error);");
content = content.replace(/console\.log\(Speech recognition started\.\);/g, "console.log('Speech recognition started.');");
content = content.replace(/console\.log\(Speech recognition ended\.\);/g, "console.log('Speech recognition ended.');");

// Check for missing quotes in className or styles that might have been broken, though esbuild would catch them.
fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
