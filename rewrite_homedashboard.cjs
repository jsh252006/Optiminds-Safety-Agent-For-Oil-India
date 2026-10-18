const fs = require('fs');

const content = `import { Activity, FileSearch, BarChart3, BookOpen, Library, ArrowRight, ShieldCheck, CheckCircle2, FileText, Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

interface HomeDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export default function HomeDashboard({ setCurrentTab }: HomeDashboardProps) {
  const { t } = useLanguage();
  const { incidentReports } = useData();

  const totalReports = incidentReports.length;
  const sifPotential = incidentReports.filter(r => r.analysis?.sifClassification === "Potential SIF").length;
  const nonSif = totalReports - sifPotential;

  const features = [
    "Analyze safety reports",
    "Detect injury/fatality precursors",
    "Identify potential SIF events",
    "Analyze barrier failures",
    "Generate preventive recommendations"
  ];

  const modules = [
    {
      id: 'machines',
      title: 'Machine Management',
      description: 'Upload and manage details of machines used in Oil India, track Open/Closed status.',
      icon: Activity,
    },
    {
      id: 'analyzer',
      title: 'Report Analyzer',
      description: 'Upload or paste incident reports for instant AI breakdown of hazards and barriers.',
      icon: FileSearch,
    },
    {
      id: 'analytics',
      title: 'Safety Analytics & SIF',
      description: 'View dashboard metrics, SIF potential stats, and recurring hazard trends.',
      icon: BarChart3,
    },
    {
      id: 'rules',
      title: 'Safety Rules',
      description: 'Browse indexed safety manuals, OISD guidelines, and compliance rules.',
      icon: BookOpen,
    },
    {
      id: 'sources',
      title: 'Knowledge Base',
      description: 'Manage document sources and PDFs used for the AI knowledge retrieval.',
      icon: Library,
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-50 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        
        {/* Project Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
             <ShieldCheck className="w-8 h-8 text-blue-700" />
             <h1 className="text-3xl font-bold text-slate-900 tracking-tight">OPTIMINDS</h1>
          </div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Safety Intelligence Platform</h2>
          <p className="text-slate-600 max-w-2xl text-lg">
            AI-assisted safety report analysis and proactive hazard detection for Oil & Gas operations.
          </p>
        </div>

        {/* Data Overview Widget */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
           <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
             <Activity className="w-4 h-4 text-orange-600" />
             SYSTEM DATA OVERVIEW
           </h3>
           
           <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
             <div>
               <p className="text-2xl font-bold text-slate-900">{totalReports}</p>
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total Indexed Reports</p>
             </div>
             <div className="flex-1 w-full md:max-w-md">
               <div className="flex items-center justify-between text-xs font-semibold mb-2">
                 <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-orange-500"></span>
                    <span className="text-slate-700">SIF Potential ({sifPotential})</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-slate-300"></span>
                    <span className="text-slate-700">Non-SIF ({nonSif})</span>
                 </div>
               </div>
               <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                 <div className="h-full bg-orange-500" style={{ width: \`\${totalReports === 0 ? 0 : (sifPotential / totalReports) * 100}%\` }}></div>
                 <div className="h-full bg-slate-300" style={{ width: \`\${totalReports === 0 ? 100 : (nonSif / totalReports) * 100}%\` }}></div>
               </div>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* What Optiminds Does */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">What OPTIMINDS Does</h3>
            <div className="space-y-3">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                  <span className="text-blue-700 font-bold text-sm bg-blue-50 px-2 py-0.5 rounded">0{i + 1}</span>
                  <p className="text-sm font-semibold text-slate-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Modules */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">System Modules</h3>
            <div className="grid grid-cols-1 gap-3">
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setCurrentTab(mod.id)}
                  className="w-full text-left bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 p-4 rounded-lg shadow-sm transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 group-hover:bg-blue-100 rounded-md text-slate-600 group-hover:text-blue-700 transition-colors">
                      <mod.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-800">{mod.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{mod.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <div className="pt-8 text-center border-t border-slate-200">
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
console.log("HomeDashboard rewritten to match student project.");
