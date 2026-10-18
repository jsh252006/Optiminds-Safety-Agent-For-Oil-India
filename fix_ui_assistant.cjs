const fs = require('fs');
let content = fs.readFileSync('src/components/SafetyAssistant.tsx', 'utf8');

const chips = `
        {/* Quick Action Chips (Improves UX and speed for basic tasks) */}
        {messages.length <= 1 && (
          <div className="max-w-4xl mx-auto px-4 md:px-8 mb-4 flex flex-wrap gap-2 justify-center">
            {['PPE for pipeline?', 'Gas leak protocol', 'Hot work permit rules', 'What is OISD?'].map((q) => (
              <button 
                key={q}
                onClick={() => {
                  setQuery(q);
                  setTimeout(() => document.getElementById('ai-send-btn')?.click(), 100);
                }}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-colors shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="max-w-4xl mx-auto w-full px-4 md:px-8 pb-4 relative z-10 shrink-0">
`;

// Find the input container
content = content.replace('<div className="max-w-4xl mx-auto w-full px-4 md:px-8 pb-4 relative z-10 shrink-0">', chips);

content = content.replace('onClick={handleSend}', 'id="ai-send-btn"\n              onClick={handleSend}');

fs.writeFileSync('src/components/SafetyAssistant.tsx', content);
