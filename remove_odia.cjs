const fs = require('fs');

// 1. LanguageContext
let langCtx = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');
langCtx = langCtx.replace(/type LanguageCode = 'en' \| 'hi' \| 'or';/, "type LanguageCode = 'en' | 'hi';");
langCtx = langCtx.replace(/type LanguageLabel = 'English' \| 'Hindi' \| 'Odia';/, "type LanguageLabel = 'English' | 'Hindi';");
langCtx = langCtx.replace(/const languageName = language === 'en' \? 'English' : language === 'hi' \? 'Hindi' : 'Odia';/, "const languageName = language === 'en' ? 'English' : 'Hindi';");
langCtx = langCtx.replace(/else if \(name === 'Odia'\) setLanguage\('or'\);/, "");
fs.writeFileSync('src/contexts/LanguageContext.tsx', langCtx);

// 2. Navbar
let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
nav = nav.replace(/\{ code: 'or', label: 'Odia' \},?/g, "");
fs.writeFileSync('src/components/Navbar.tsx', nav);

// 3. SafetyAssistant
let safetyAst = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');
safetyAst = safetyAst.replace(/languageName === 'Odia' \? 'or-IN' :/g, "");
safetyAst = safetyAst.replace(/: languageName === 'Odia'/g, "");
fs.writeFileSync('src/components/SafetyAssistant.tsx', safetyAst);

