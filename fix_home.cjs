const fs = require('fs');
let content = fs.readFileSync('src/components/HomeDashboard.tsx', 'utf8');

// Insert useData so we can show real SI statistics
if (!content.includes('useData')) {
    content = content.replace("import { useLanguage } from '../contexts/LanguageContext';", "import { useLanguage } from '../contexts/LanguageContext';\nimport { useData } from '../contexts/DataContext';");
}

if (!content.includes('const { incidentReports }')) {
    content = content.replace('const { t } = useLanguage();', 'const { t } = useLanguage();\n  const { incidentReports } = useData();\n\n  // Calculate SIF metrics\n  const totalReports = incidentReports.length;\n  const sifPotential = incidentReports.filter(r => r.analysis?.sifClassification === "Potential SIF").length;\n  const nonSif = totalReports - sifPotential;\n');
}

// Add a quick visual widget at the top for SIF vs Non-SIF
const widget = `
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 space-y-12">
      
        {/* SIF vs Non-SIF Dashboard Mini-Widget */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
             <Activity className="w-5 h-5 text-red-600" />
             TOTAL REPORTS: {totalReports}
           </h3>
           
           <div className="flex items-center gap-4 text-sm font-semibold mb-2">
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600"></span>
                <span className="text-slate-700 dark:text-slate-300">SIF Potential: {sifPotential}</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                <span className="text-slate-700 dark:text-slate-300">Non-SIF: {nonSif}</span>
             </div>
           </div>
           
           <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
             <div 
               className="h-full bg-red-600" 
               style={{ width: \`\${totalReports === 0 ? 0 : (sifPotential / totalReports) * 100}%\` }}
             ></div>
             <div 
               className="h-full bg-slate-300 dark:bg-slate-600" 
               style={{ width: \`\${totalReports === 0 ? 100 : (nonSif / totalReports) * 100}%\` }}
             ></div>
           </div>
           
           <p className="text-xs text-slate-500 mt-3 font-medium">The system identifies reports with indicators associated with potential serious injury/fatality exposure based on the defined assessment criteria.</p>
        </div>
`;

content = content.replace('<div className="max-w-7xl mx-auto px-4 py-8 relative z-10 space-y-12">', widget);

fs.writeFileSync('src/components/HomeDashboard.tsx', content);
