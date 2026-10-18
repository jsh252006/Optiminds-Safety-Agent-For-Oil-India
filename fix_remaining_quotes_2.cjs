const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

content = content.replace(/let newTheme: light \| dark \| system = light;/g, "let newTheme: 'light' | 'dark' | 'system' = 'light';");
content = content.replace(/if \(lowerQuery\.includes\(dark mode\) \|\| lowerQuery\.includes\(dark theme\) \|\| lowerQuery\.includes\(change theme to dark\) \|\| lowerQuery\.includes\(darken\)\) \{/g, "if (lowerQuery.includes('dark mode') || lowerQuery.includes('dark theme') || lowerQuery.includes('change theme to dark') || lowerQuery.includes('darken')) {");
content = content.replace(/setTheme\(dark\);/g, "setTheme('dark');");
content = content.replace(/newTheme = dark;/g, "newTheme = 'dark';");
content = content.replace(/\} else if \(lowerQuery\.includes\(light mode\) \|\| lowerQuery\.includes\(light theme\) \|\| lowerQuery\.includes\(change theme to light\) \|\| lowerQuery\.includes\(lighten\)\) \{/g, "} else if (lowerQuery.includes('light mode') || lowerQuery.includes('light theme') || lowerQuery.includes('change theme to light') || lowerQuery.includes('lighten')) {");
content = content.replace(/setTheme\(light\);/g, "setTheme('light');");
content = content.replace(/newTheme = light;/g, "newTheme = 'light';");

content = content.replace(/\} else if \(lowerQuery\.includes\(system theme\) \|\| lowerQuery\.includes\(system mode\)\) \{/g, "} else if (lowerQuery.includes('system theme') || lowerQuery.includes('system mode')) {");
content = content.replace(/setTheme\(system\);/g, "setTheme('system');");
content = content.replace(/newTheme = system;/g, "newTheme = 'system';");

content = content.replace(/let messageId = Date\.now\(\)\.toString\(\);/g, "let messageId = Date.now().toString();");

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
