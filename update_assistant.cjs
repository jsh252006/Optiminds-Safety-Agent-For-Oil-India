const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace('<SafetyAssistant />', '<SafetyAssistant isFloating={true} />');
fs.writeFileSync('src/App.tsx', appContent);

let saContent = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

// 1. Update Props
saContent = saContent.replace(
  "mode?: 'general' | 'emergency' | 'inspector';\n}",
  "mode?: 'general' | 'emergency' | 'inspector';\n  isFloating?: boolean;\n}"
);

// 2. Update Component Signature
saContent = saContent.replace(
  "export default function SafetyAssistant({ mode = 'general' }: SafetyAssistantProps) {",
  "export default function SafetyAssistant({ mode = 'general', isFloating = false }: SafetyAssistantProps) {\n  const [recentQueries, setRecentQueries] = useState<string[]>(() => {\n    try {\n      const saved = sessionStorage.getItem('recentQueries');\n      return saved ? JSON.parse(saved) : [];\n    } catch {\n      return [];\n    }\n  });"
);

// 3. Update handleSend to save queries
const querySaveLogic = `
    const currentQuery = query.trim();
    if (currentQuery) {
      const updated = [currentQuery, ...recentQueries.filter(q => q !== currentQuery)].slice(0, 15);
      setRecentQueries(updated);
      sessionStorage.setItem('recentQueries', JSON.stringify(updated));
    }
    const userMessage: ChatMessage = {`;

saContent = saContent.replace("const userMessage: ChatMessage = {", querySaveLogic);

// 4. Update the layout
const newLayoutStart = `<div className="flex h-full absolute inset-0 bg-slate-50 dark:bg-slate-900 overflow-hidden z-0">
      {!isFloating && (
        <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-col hidden md:flex shrink-0 h-full">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Recent Q&A
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {recentQueries.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 p-2 text-center mt-4">No recent queries.</p>
            ) : (
              recentQueries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(q)}
                  className="w-full text-left text-sm p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 transition-colors truncate"
                  title={q}
                >
                  {q}
                </button>
              ))
            )}
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-900">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 scroll-smooth">`;

saContent = saContent.replace(
  /<div className="flex flex-col absolute inset-0 bg-slate-50 dark:bg-slate-900 dark:bg-slate-900\/50 overflow-hidden z-0">\s*<div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 scroll-smooth">/,
  newLayoutStart
);

// 5. Close the new wrapper div at the end of the return statement
saContent = saContent.replace(/    <\/div>\n  \);\n\}/, '    </div>\n    </div>\n  );\n}');

fs.writeFileSync('src/components/SafetyAssistant.tsx', saContent);
console.log("Updated Safety Assistant with Recent Q&A");
