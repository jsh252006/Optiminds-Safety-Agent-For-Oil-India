const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

const regex = /const getWelcomeMessage = \(\) => \{[\s\S]*?return languageName === 'Hindi'\s*\?\s*'(.*?)'\s*:\s*'(.*?)';\s*\};/m;
// I will just replace the function completely.
const functionReplacement = `  const getWelcomeMessage = () => {
    if (mode === 'emergency') {
      return languageName === 'Hindi' 
        ? 'आपातकालीन सहायता मोड। मैं आपातकालीन प्रक्रियाओं, निकासी और प्राथमिक चिकित्सा प्रोटोकॉल के लिए स्टैंडबाय पर हूँ। आपकी स्थिति क्या है?'
        : 'Oily AI Emergency Mode. I am on standby for immediate evacuation procedures, first aid protocols, and crisis response. What is your situation?';
    }
    
    if (mode === 'inspector') {
      return languageName === 'Hindi'
        ? 'सुरक्षा निरीक्षक एआई। मैं कार्यस्थल के खतरों की पहचान करने और अनुपालन जांच में मदद कर सकता हूँ। आप किस क्षेत्र का निरीक्षण कर रहे हैं?'
        : 'Safety Inspector AI. I can assist with identifying workplace hazards, checklist generation, and compliance checking. What area are you inspecting?';
    }
    
    return languageName === 'Hindi' 
        ? 'नमस्ते! मैं ऑयली एआई सुरक्षा सहायक हूँ। OIL और OISD दिशानिर्देशों के आधार पर मुझसे नियम, पीपीई, या सर्वोत्तम प्रथाओं के बारे में कुछ भी पूछें।'
        : 'Hello! I am Oily, the OPTIMINDS Safety AI Assistant. Ask me anything about safety rules, PPE, or best practices based on OIL and OISD guidelines.';
  };`;

// Because the regex might fail on weird string states, let's just find the bounds of the function.
const startIndex = content.indexOf('const getWelcomeMessage = () => {');
const endIndexStr = "};";
// find the closing brace of the function by counting
let braceCount = 0;
let endIndex = -1;
for (let i = startIndex; i < content.length; i++) {
  if (content[i] === '{') braceCount++;
  if (content[i] === '}') {
    braceCount--;
    if (braceCount === 0) {
      endIndex = i;
      break;
    }
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + functionReplacement + content.substring(endIndex + 1);
  fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
}
