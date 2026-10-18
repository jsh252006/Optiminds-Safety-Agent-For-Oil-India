const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

const updatedErrorHandler = `
      utterance.onerror = (e: any) => {
         if (e.error !== 'interrupted' && e.error !== 'canceled') {
            // Silently handle expected browser synthesis interruptions
            console.log("SpeechSynthesis stopped or interrupted.");
         }
         setIsSpeaking(false);
      };
`;

content = content.replace(`      utterance.onerror = (e) => {
         console.error("SpeechSynthesis Error:", e);
         setIsSpeaking(false);
      };`, updatedErrorHandler.trim());

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
