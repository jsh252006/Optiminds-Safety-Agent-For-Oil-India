const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

const updatedSpeakText = `
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
       console.error("SpeechSynthesis not supported.");
       return;
    }
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      const langCode = languageName === 'Hindi' ? 'hi-IN' : 'en-US';
      utterance.lang = langCode;
      
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        let voiceToUse = voices.find(v => v.lang.includes(langCode));
        if (!voiceToUse && languageName === 'Hindi') voiceToUse = voices.find(v => v.lang.includes('hi'));
        if (!voiceToUse) voiceToUse = voices.find(v => v.lang.includes('en'));
        
        if (voiceToUse) {
          utterance.voice = voiceToUse;
        }
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
         console.error("SpeechSynthesis Error:", e);
         setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }, 50);
  };
`;

const startIndex = content.indexOf('const speakText = (text: string) => {');
const endIndex = content.indexOf('const stopSpeaking = () => {');

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + updatedSpeakText.trim() + '\n\n  ' + content.substring(endIndex);
    fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
    console.log("Updated speakText function.");
} else {
    console.log("Could not find bounds.");
}
