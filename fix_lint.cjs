const fs = require('fs');

// Fix AuthPage
let authContent = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');
authContent = authContent.replace(/setLoading\(true\);/g, '');
authContent = authContent.replace(/setLoading\(false\);/g, '');
fs.writeFileSync('src/components/AuthPage.tsx', authContent);

// Fix SafetyAssistant
let safetyContent = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');
safetyContent = safetyContent.replace(/if \(speechSynthesis in window\)/g, "if ('speechSynthesis' in window)");
fs.writeFileSync('src/components/SafetyAssistant.tsx', safetyContent);

// Fix AnalyticsDashboard
let analyticsContent = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');
if (!analyticsContent.includes('import { X ')) {
    analyticsContent = analyticsContent.replace(/import \{ (.*?)\} from 'lucide-react';/, "import { X, $1} from 'lucide-react';");
}
fs.writeFileSync('src/components/AnalyticsDashboard.tsx', analyticsContent);
