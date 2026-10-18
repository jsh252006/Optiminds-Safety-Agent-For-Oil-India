const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

const updatedUnlock = `
    // Unlock speech synthesis on user interaction
    if ('speechSynthesis' in window) {
      const unlockUtterance = new SpeechSynthesisUtterance('');
      unlockUtterance.volume = 0;
      unlockUtterance.onerror = () => {}; // Ignore errors on silent unlock
      window.speechSynthesis.speak(unlockUtterance);
    }
`;

content = content.replace(`    // Unlock speech synthesis on user interaction
    if ('speechSynthesis' in window) {
      const unlockUtterance = new SpeechSynthesisUtterance('');
      unlockUtterance.volume = 0;
      window.speechSynthesis.speak(unlockUtterance);
    }`, updatedUnlock.trim());

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
