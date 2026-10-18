const fs = require('fs');

// Fix AudioEngine.playClick
let audioContent = fs.readFileSync('src/lib/audio.ts', 'utf8');
audioContent = audioContent.replace(/public playClick\(\) \{[\s\S]*?public playNotification\(\) \{/, 'public playClick() {\n    // Click sound disabled per user request\n  }\n\n  public playNotification() {');
fs.writeFileSync('src/lib/audio.ts', audioContent);

// Fix utils playUISound
let utilsContent = fs.readFileSync('src/lib/utils.ts', 'utf8');
utilsContent = utilsContent.replace(/export function playUISound\(type: 'tab' \| 'card' \| 'toggle' \| 'action'\) \{[\s\S]*?\}\n/g, "export function playUISound(type: 'tab' | 'card' | 'toggle' | 'action') {\n  // UI sounds disabled per user request\n}\n\n");
fs.writeFileSync('src/lib/utils.ts', utilsContent);
