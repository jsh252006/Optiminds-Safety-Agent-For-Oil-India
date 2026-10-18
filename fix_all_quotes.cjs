const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/mode === emergency/g, "mode === 'emergency'");
content = content.replace(/mode === inspector/g, "mode === 'inspector'");
content = content.replace(/languageName === Hindi/g, "languageName === 'Hindi'");

content = content.replace(/\? आपातकालीन सहायता मोड। मैं आपातकालीन प्रक्रियाओं, निकासी और प्राथमिक चिकित्सा प्रोटोकॉल के लिए स्टैंडबाय पर हूँ। आपकी स्थिति क्या है\?/g, "? 'आपातकालीन सहायता मोड। मैं आपातकालीन प्रक्रियाओं, निकासी और प्राथमिक चिकित्सा प्रोटोकॉल के लिए स्टैंडबाय पर हूँ। आपकी स्थिति क्या है?'");

content = content.replace(/\? सुरक्षा निरीक्षक एआई। मैं कार्यस्थल के खतरों की पहचान करने और अनुपालन जांच में मदद कर सकता हूँ। आप किस क्षेत्र का निरीक्षण कर रहे हैं\?/g, "? 'सुरक्षा निरीक्षक एआई। मैं कार्यस्थल के खतरों की पहचान करने और अनुपालन जांच में मदद कर सकता हूँ। आप किस क्षेत्र का निरीक्षण कर रहे हैं?'");

content = content.replace(/\? नमस्ते! मैं ऑयली एआई सुरक्षा सहायक हूँ। OIL और OISD दिशानिर्देशों के आधार पर मुझसे नियम, पीपीई, या सर्वोत्तम प्रथाओं के बारे में कुछ भी पूछें।/g, "? 'नमस्ते! मैं ऑयली एआई सुरक्षा सहायक हूँ। OIL और OISD दिशानिर्देशों के आधार पर मुझसे नियम, पीपीई, या सर्वोत्तम प्रथाओं के बारे में कुछ भी पूछें।'");

content = content.replace(/const langCode = languageName === 'Hindi' \? hi-IN : en-IN;/g, "const langCode = languageName === 'Hindi' ? 'hi-IN' : 'en-IN';");
content = content.replace(/const langCode = languageName === 'Hindi' \? hi-IN : en-US;/g, "const langCode = languageName === 'Hindi' ? 'hi-IN' : 'en-US';");
content = content.replace(/recognition.lang = langCode;/g, "recognition.lang = langCode;");
content = content.replace(/const utterance = new SpeechSynthesisUtterance\(text\);/g, "const utterance = new SpeechSynthesisUtterance(text);");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
