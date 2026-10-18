const fs = require('fs');
let content = fs.readFileSync('src/components/ReportAnalyzer.tsx', 'utf8');

const oldCardRegex = /\{\/\* SIF Potential Card \*\/\}([\s\S]*?)Requires human HSE validation[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

const newCard = `{/* SIF Potential Card */}
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
                            
                            {activeAnalysis.sifExplanation && (
                              <div className="mt-4 border-t border-slate-200 dark:border-slate-700/50 pt-3">
                                <button
                                  onClick={() => setIsSifExpanded(!isSifExpanded)}
                                  className="w-full flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                >
                                  <span className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    Analysis Reasoning
                                  </span>
                                  {isSifExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                                
                                {isSifExpanded && (
                                  <div className="mt-3 space-y-3 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl">
                                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {activeAnalysis.sifExplanation.reasoning}
                                      </p>
                                    </div>
                                    
                                    {activeAnalysis.sifExplanation.evidence && activeAnalysis.sifExplanation.evidence.length > 0 && (
                                      <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Supporting Evidence</p>
                                        <ul className="space-y-2">
                                          {activeAnalysis.sifExplanation.evidence.map((quote: string, i: number) => (
                                            <li key={i} className="flex gap-2">
                                              <span className="text-blue-500 mt-0.5 flex-shrink-0">&quot;</span>
                                              <span className="text-slate-600 dark:text-slate-400 italic text-xs leading-relaxed">{quote}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {activeAnalysis.humanReviewRequired && (
                              <div className="mt-4 bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg text-xs font-semibold text-slate-700 border border-white dark:border-slate-700">
                                <AlertTriangle className="w-4 h-4 text-amber-500 inline mr-1 -mt-0.5" />
                                Requires human HSE validation
                              </div>
                            )}
                          </div>
                        </div>`;

content = content.replace(oldCardRegex, newCard);
fs.writeFileSync('src/components/ReportAnalyzer.tsx', content);
