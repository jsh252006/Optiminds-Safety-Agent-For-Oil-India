const fs = require('fs');
let content = fs.readFileSync('src/components/ReportAnalyzer.tsx', 'utf8');

const target = `<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">`;

const replacement = `<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* HSE Analytics Disclaimer */}
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-3 text-slate-500 dark:text-slate-400 text-xs shadow-sm">
                      <Info className="w-5 h-5 shrink-0 text-slate-400" />
                      <p>
                        <strong>AI Analysis Disclaimer:</strong> This platform provides AI-assisted safety analysis for decision support. AI-generated findings, precursor identification, SIF classification, risk rankings and recommendations must be reviewed and validated by qualified HSE personnel before operational or safety-critical decisions are made. The system does not replace official incident investigation, risk assessment, regulatory requirements, engineering judgement, or OIL/OISD procedures.
                      </p>
                    </div>

                    {/* Executive Summary & Event Classification */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-6">
                        {activeAnalysis.executiveSummary && (
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Executive Summary</h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                              {activeAnalysis.executiveSummary}
                            </p>
                          </div>
                        )}
                        
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 pb-2">Event Classification</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Site / Location</p>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{incidentReports.find(r => r.id === activeReportId)?.site || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Activity</p>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{incidentReports.find(r => r.id === activeReportId)?.activity || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Event Category</p>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{incidentReports.find(r => r.id === activeReportId)?.eventCategory || activeAnalysis.aiSuggestedCategory || 'Unknown'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Risk Level</p>
                              <p className={\`font-bold \${activeAnalysis.riskScore >= 75 ? 'text-red-600' : activeAnalysis.riskScore >= 40 ? 'text-amber-600' : 'text-emerald-600'}\`}>
                                {activeAnalysis.riskScore >= 75 ? 'HIGH' : activeAnalysis.riskScore >= 40 ? 'MEDIUM' : 'LOW'} ({activeAnalysis.riskScore}/100)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-1">
                        {/* SIF Potential Card */}
                        <div className={\`p-6 rounded-2xl shadow-sm border h-full \${activeAnalysis.sifClassification?.includes('Potential SIF') ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30' : activeAnalysis.sifClassification?.includes('Review') ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30'}\`}>
                          <div className="flex items-center gap-3 mb-2">
                            {activeAnalysis.sifClassification?.includes('Potential SIF') ? <ShieldAlert className="w-6 h-6 text-red-600" /> : <ShieldCheck className="w-6 h-6 text-emerald-600" />}
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">Serious Injury / Fatality (SIF) Potential</h3>
                          </div>
                          
                          <div className="mt-4 space-y-4">
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">SIF Potential</p>
                              <p className={\`text-2xl font-black \${activeAnalysis.sifPotential === 'High' ? 'text-red-600' : activeAnalysis.sifPotential === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}\`}>
                                {activeAnalysis.sifPotential || 'Uncertain'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Classification</p>
                              <p className="font-bold text-slate-700 dark:text-slate-200">{activeAnalysis.sifClassification || 'Requires Review'}</p>
                            </div>
                            {activeAnalysis.sifConfidence && (
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Confidence</p>
                                <p className="font-semibold text-slate-700 dark:text-slate-300">{activeAnalysis.sifConfidence}%</p>
                              </div>
                            )}
                            
                            {activeAnalysis.humanReviewRequired && (
                              <div className="mt-4 bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg text-xs font-semibold text-slate-700 border border-white dark:border-slate-700">
                                <AlertTriangle className="w-4 h-4 text-amber-500 inline mr-1 -mt-0.5" />
                                Requires human HSE validation
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Precursors and Barriers */}
                    {(activeAnalysis.precursors || activeAnalysis.barrierConcerns) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeAnalysis.precursors && activeAnalysis.precursors.length > 0 && (
                          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                              <Activity className="w-4 h-4 text-blue-500" /> Detected Precursors
                            </h3>
                            <div className="space-y-4">
                              {activeAnalysis.precursors.map((p: any, i: number) => (
                                <div key={i} className="border-l-2 border-blue-500 pl-3">
                                  <p className="text-xs font-bold text-blue-600 mb-1">{p.category}</p>
                                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">{p.signal}</p>
                                  <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded text-xs text-slate-600 italic">
                                    " {p.evidence} "
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {activeAnalysis.barrierConcerns && activeAnalysis.barrierConcerns.length > 0 && (
                          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                              <ShieldX className="w-4 h-4 text-red-500" /> Barrier Concerns
                            </h3>
                            <div className="space-y-4">
                              {activeAnalysis.barrierConcerns.map((b: any, i: number) => (
                                <div key={i} className={\`border-l-2 \${b.riskLevel === 'HIGH' ? 'border-red-500' : 'border-amber-500'} pl-3\`}>
                                  <div className="flex justify-between items-start mb-1">
                                    <p className="text-xs font-bold text-slate-600 uppercase">{b.barrier}</p>
                                    <span className={\`text-[10px] font-bold px-1.5 py-0.5 rounded \${b.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}\`}>{b.riskLevel}</span>
                                  </div>
                                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">{b.concern}</p>
                                  <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded text-xs text-slate-600 italic">
                                    " {b.evidence} "
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
`;

content = content.replace(target, replacement);

// We need to import ShieldCheck, Info, ShieldX if they are missing
const importLucideRegex = /import {([\s\S]*?)} from 'lucide-react';/;
if (importLucideRegex.test(content)) {
  const match = content.match(importLucideRegex)[1];
  let newImports = match;
  if (!newImports.includes('ShieldCheck')) newImports += ', ShieldCheck';
  if (!newImports.includes('Info')) newImports += ', Info';
  if (!newImports.includes('ShieldX')) newImports += ', ShieldX';
  content = content.replace(importLucideRegex, `import {${newImports}} from 'lucide-react';`);
}

fs.writeFileSync('src/components/ReportAnalyzer.tsx', content);
