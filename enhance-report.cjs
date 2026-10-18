const fs = require('fs');

let content = fs.readFileSync('src/components/ReportAnalyzer.tsx', 'utf8');

// The replacement logic:
const highlightedTextElement = `
<div className="w-full border rounded-lg px-3 py-4 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-sm leading-relaxed text-slate-700 dark:text-slate-300 min-h-[120px] whitespace-pre-wrap">
  {highlightKeywords(reportText || (incidentReports.find(r => r.id === activeReportId)?.text || ''), activeAnalysis?.findings || [])}
</div>
`;

// Need a highlight function in the component. We can inject it at the top of the component.
const highlightFunction = `
  const highlightKeywords = (text: string, findings: any[]) => {
    if (!text || !findings || findings.length === 0) return text;
    
    // Extract phrases to highlight
    let allPhrases = [];
    findings.forEach(f => {
      // Create a few mock keywords based on the finding category/description
      if(f.category) allPhrases.push({ word: f.category, severity: f.severity });
      // Add standard hazard words if present
      const commonWords = ['leak', 'spill', 'fire', 'pressure', 'broken', 'compromised', 'failure', 'violation', 'hazard', 'risk', 'injury', 'routine', 'normal'];
      commonWords.forEach(w => {
         if (text.toLowerCase().includes(w)) {
           let sev = 'LOW';
           if (['leak', 'fire', 'compromised', 'failure', 'violation'].includes(w)) sev = 'HIGH';
           else if (['spill', 'pressure', 'hazard', 'broken'].includes(w)) sev = 'MEDIUM';
           allPhrases.push({ word: w, severity: sev });
         }
      });
    });
    
    // Deduplicate
    const uniquePhrases = Array.from(new Set(allPhrases.map(p => p.word.toLowerCase())))
      .map(w => allPhrases.find(p => p.word.toLowerCase() === w));

    if (uniquePhrases.length === 0) return text;

    // We'll just highlight the first matching occurrences for simplicity in UI
    const parts = text.split(new RegExp(\`(\${uniquePhrases.map(p => p.word).join('|')})\`, 'gi'));
    
    return parts.map((part, i) => {
      const match = uniquePhrases.find(p => p?.word.toLowerCase() === part.toLowerCase());
      if (match) {
        const colorClass = 
          match.severity === 'HIGH' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 px-1 py-0.5 rounded' :
          match.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-1 py-0.5 rounded' :
          'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-1 py-0.5 rounded';
        return <span key={i} className={colorClass}>{part}</span>;
      }
      return part;
    });
  };
`;

// Inject function after `const { t } = useLanguage();`
content = content.replace('const { t } = useLanguage();', 'const { t } = useLanguage();\n' + highlightFunction);

// Replace the textarea when disabled
content = content.replace(
  '<textarea \n                        rows={5}\n                        placeholder="Paste observation or incident details here..."\n                        value={reportText}\n                        onChange={e => setReportText(e.target.value)}\n                        disabled={!!activeAnalysis || isAnalyzing || !!reportFile}\n                        className={cn("w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-slate-50 dark:bg-slate-900 dark:bg-slate-900 text-sm leading-relaxed", isRecording ? "border-red-400 shadow-[0_0_10px_rgba(248,113,113,0.3)]" : "border-slate-300 dark:border-slate-600 dark:border-slate-600")}\n                      ></textarea>',
  `
  {(!!activeAnalysis && reportText) ? (
     <div className="w-full border rounded-lg px-3 py-4 bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-sm leading-relaxed text-slate-700 dark:text-slate-300 min-h-[120px] whitespace-pre-wrap font-sans">
       {highlightKeywords(reportText, activeAnalysis?.findings || [])}
     </div>
  ) : (
    <textarea 
      rows={5}
      placeholder="Paste observation or incident details here..."
      value={reportText}
      onChange={e => setReportText(e.target.value)}
      disabled={isAnalyzing || !!reportFile}
      className={cn("w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-slate-50 dark:bg-slate-900 dark:bg-slate-900 text-sm leading-relaxed", isRecording ? "border-red-400 shadow-[0_0_10px_rgba(248,113,113,0.3)]" : "border-slate-300 dark:border-slate-600 dark:border-slate-600")}
    ></textarea>
  )}
  `
);

fs.writeFileSync('src/components/ReportAnalyzer.tsx', content);
console.log('Done replacing report text area with highlights.');
