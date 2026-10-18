import { useState } from 'react';
import { Search, Filter, BookOpen, AlertCircle, FileText, ChevronDown, ChevronUp, Book } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { DocumentStatus } from '../types';
import { safetyKnowledgeBase } from '../rulesData';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function RuleSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'knowledge' | 'standards'>('knowledge');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  const { documents } = useData();

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.standardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.applicableArea.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredKnowledge = safetyKnowledgeBase.filter(kb => 
    kb.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kb.rules.some(rule => rule.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (kb.reference && kb.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'CURRENT':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold tracking-widest uppercase border border-emerald-200 dark:border-emerald-800">CURRENT</span>;
      case 'SUPERSEDED':
        return <span className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-[10px] font-bold tracking-widest uppercase border border-red-200 dark:border-red-800">SUPERSEDED</span>;
      case 'ARCHIVED':
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold tracking-widest uppercase border border-slate-200 dark:border-slate-700">ARCHIVED</span>;
      case 'PENDING VERIFICATION':
        return <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold tracking-widest uppercase border border-amber-200 dark:border-amber-800">PENDING</span>;
    }
  };

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-900 p-4 md:p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-[11px] font-bold tracking-widest uppercase mb-3">
            Safety Center
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Safety Rules & Standards
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Browse official OIL and OISD safety rules, standards, and guidelines.</p>
          
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder="Search rules, hazards, standard numbers... (e.g., 'Work Permit', 'Fire')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-px">
          <button
            onClick={() => setActiveTab('knowledge')}
            className={cn(
              "px-6 py-3 font-bold text-sm tracking-wide transition-all border-b-2 flex items-center gap-2",
              activeTab === 'knowledge' 
                ? "border-blue-600 text-blue-700 dark:text-blue-400 dark:border-blue-400" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            <Book className="w-4 h-4" /> HSE KNOWLEDGE BASE
          </button>
          <button
            onClick={() => setActiveTab('standards')}
            className={cn(
              "px-6 py-3 font-bold text-sm tracking-wide transition-all border-b-2 flex items-center gap-2",
              activeTab === 'standards' 
                ? "border-blue-600 text-blue-700 dark:text-blue-400 dark:border-blue-400" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            <FileText className="w-4 h-4" /> REFERENCE STANDARDS
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'knowledge' && (
          <div className="space-y-4">
            <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-5 rounded-2xl flex items-start gap-4 text-blue-900 dark:text-blue-200 text-sm shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
              <div className="leading-relaxed">
                <strong className="font-bold tracking-wide">Source Basis:</strong> OIL India HSE Management System + OISD Safety Standards. This knowledge base serves as a summarized reference for safe operations. Site-specific permits and SOPs take precedence.
              </div>
            </div>

            {filteredKnowledge.length === 0 ? (
               <div className="py-16 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                 <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                 <div className="text-lg font-medium text-slate-700 dark:text-slate-300">No rules found</div>
                 <div className="text-sm mt-1">Try adjusting your search term</div>
               </div>
            ) : (
              <div className="grid gap-4">
                {filteredKnowledge.map((kb) => (
                  <div key={kb.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <button 
                      onClick={() => toggleCategory(kb.id)}
                      className="w-full px-6 py-5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-900/70 transition-colors text-left"
                    >
                      <div className="flex-1 pr-4">
                        <h2 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                          {kb.category}
                        </h2>
                        {kb.reference && (
                          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" /> Ref: {kb.reference}
                          </div>
                        )}
                      </div>
                      {expandedCategories[kb.id] ? (
                        <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedCategories[kb.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 border-t border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
                            <ul className="space-y-4">
                              {kb.rules.map((rule, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                                  <span className="leading-relaxed text-[15px]">
                                    {rule}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'standards' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Document / Standard</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Title</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Applicable Areas</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Rev/Date</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {filteredDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">{doc.standardNumber}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-0.5">{doc.organization}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-semibold text-slate-800 dark:text-slate-200">
                        {doc.name}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1.5">
                          {doc.applicableArea.map((area, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 rounded text-xs font-medium border border-slate-200/60 dark:border-slate-600">
                              {area}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{doc.version}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{doc.publicationDate}</div>
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors opacity-0 group-hover:opacity-100">
                          View Sections
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredDocs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center text-slate-500 dark:text-slate-400">
                        <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <div className="text-lg font-medium text-slate-700 dark:text-slate-300">No documents found</div>
                        <div className="text-sm mt-1">Try adjusting your search terms</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
