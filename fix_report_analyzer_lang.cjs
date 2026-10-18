const fs = require('fs');
let content = fs.readFileSync('src/components/ReportAnalyzer.tsx', 'utf8');

// Replace local state language with context language
content = content.replace(/const \[language, setLanguage\] = useState\('English'\);/, "");

// Find useLanguage in imports and hooks
const hookRegex = /const \{ t \} = useLanguage\(\);/;
content = content.replace(hookRegex, "const { t, languageName } = useLanguage();");

// Replace all usages of local `language` with `languageName`
content = content.replace(/formData\.append\('language', language\);/g, "formData.append('language', languageName);");
content = content.replace(/recognition\.lang = language === 'Hindi' \? 'hi-IN' : 'en-US';/g, "recognition.lang = languageName === 'Hindi' ? 'hi-IN' : 'en-US';");

// Remove the language select dropdown in ReportAnalyzer entirely since the global navbar handles it
const selectDropdownRegex = /<div className="flex items-center gap-2">\s*<Globe className="w-4 h-4 text-slate-400" \/>\s*<select[\s\S]*?<\/select>\s*<\/div>/;
content = content.replace(selectDropdownRegex, "");

fs.writeFileSync('src/components/ReportAnalyzer.tsx', content);
