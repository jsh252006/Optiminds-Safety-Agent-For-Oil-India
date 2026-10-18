const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/\? Immediate response for emergency protocols, evacuations, and first aid\./g, "? 'Immediate response for emergency protocols, evacuations, and first aid.'");
content = content.replace(/\? AI assistant for workplace hazard identification and compliance checking\./g, "? 'AI assistant for workplace hazard identification and compliance checking.'");
content = content.replace(/: Ask questions about safety rules, PPE requirements, and OISD guidelines\./g, ": 'Ask questions about safety rules, PPE requirements, and OISD guidelines.'");

content = content.replace(/\{msg.role === 'user' \? You : Oily\}/g, "{msg.role === 'user' ? 'You' : 'Oily'}");
content = content.replace(/\{msg.confidence === HIGH/g, "{msg.confidence === 'HIGH'");
content = content.replace(/msg.confidence === MEDIUM/g, "msg.confidence === 'MEDIUM'");
content = content.replace(/msg.confidence === LOW/g, "msg.confidence === 'LOW'");
content = content.replace(/bg-red-100 text-red-700/g, "'bg-red-100 text-red-700'");
content = content.replace(/bg-amber-100 text-amber-700/g, "'bg-amber-100 text-amber-700'");
content = content.replace(/bg-slate-100 text-slate-700/g, "'bg-slate-100 text-slate-700'");
content = content.replace(/bg-red-500/g, "'bg-red-500'");
content = content.replace(/bg-amber-500/g, "'bg-amber-500'");
content = content.replace(/bg-slate-400/g, "'bg-slate-400'");
content = content.replace(/High Confidence/g, "'High Confidence'");
content = content.replace(/Medium Confidence/g, "'Medium Confidence'");
content = content.replace(/Low Confidence/g, "'Low Confidence'");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
