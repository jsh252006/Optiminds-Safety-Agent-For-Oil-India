const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

// We add a quick unlock in handleSend
const unlockCode = `
    // Unlock speech synthesis on user interaction
    if ('speechSynthesis' in window) {
      const unlockUtterance = new SpeechSynthesisUtterance('');
      unlockUtterance.volume = 0;
      window.speechSynthesis.speak(unlockUtterance);
    }
`;

content = content.replace("setIsTyping(true);", unlockCode + "\n    setIsTyping(true);");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
