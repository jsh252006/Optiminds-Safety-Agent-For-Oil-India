const fs = require('fs');

const content = `import { Activity, FileSearch, BarChart3, BookOpen, Library, ArrowRight, ShieldCheck, CheckCircle2, FileText, Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export default function HomeDashboard({ setCurrentTab }: HomeDashboardProps) {
  const { t } = useLanguage();

  const cards = [
    {
      id: 'analyzer',
      title: 'Report Analysis',
      description: 'Upload and parse incident reports using AI to extract safety insights and barrier failures.',
      icon: FileSearch,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30'
    },
    {
      id: 'assistant',
      title: 'Safety Q&A',
      description: 'Ask the AI safety assistant questions about OISD guidelines and operational protocols.',
      icon: MessageSquare,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/30'
    },
    {
      id: 'analytics',
      title: 'Hazard Detection',
      description: 'View dashboard metrics, recurring hazard trends, and potential SIF event identifiers.',
      icon: AlertTriangle,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/30'
    },
    {
      id: 'rules',
      title: 'Compliance Status',
      description: 'Check compliance with safety rules and browse indexed safety manuals.',
      icon: CheckCircle2,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/30'
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        
        {/* Project Header */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
             <ShieldCheck className="w-8 h-8 text-blue-700 dark:text-blue-400" />
             <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">OPTIMINDS</h1>
          </div>
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2">Safety Intelligence Platform</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">
            AI-assisted safety report analysis and proactive hazard detection for Oil & Gas operations.
          </p>
        </div>

        {/* Simple 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => setCurrentTab(card.id)}
              className="text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md p-6 rounded-xl transition-all group flex flex-col h-full"
            >
              <div className={\`p-3 rounded-lg w-fit mb-4 \${card.bgColor} \${card.color}\`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                {card.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Open Module <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        {/* Demo Disclaimer */}
        <div className="pt-8 text-center border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 font-medium italic">
            Note: For this SIH prototype demonstration, we use publicly available and/or synthetic sample reports because actual operational safety data is highly confidential.
          </p>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/HomeDashboard.tsx', content);
console.log("HomeDashboard updated to a simple grid layout.");
