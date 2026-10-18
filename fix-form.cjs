const fs = require('fs');
let content = fs.readFileSync('src/components/ReportAnalyzer.tsx', 'utf8');

const newForm = `<div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Incident Title <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                        placeholder="e.g., Oil Spill at Pump Station 3"
                        disabled={!!activeAnalysis || isAnalyzing}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Site / Location</label>
                      <select
                        value={site}
                        onChange={(e) => setSite(e.target.value)}
                        disabled={!!activeAnalysis || isAnalyzing}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-slate-100"
                      >
                        <option value="">Select Site</option>
                        <option value="Duliajan Field">Duliajan Field</option>
                        <option value="Moran Field">Moran Field</option>
                        <option value="Naharkatiya Field">Naharkatiya Field</option>
                        <option value="Digboi Field">Digboi Field</option>
                        <option value="Baghjan Field">Baghjan Field</option>
                        <option value="Other / Custom Location">Other / Custom Location</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Category</label>
                      <select
                        value={eventCategory}
                        onChange={(e) => {
                          setEventCategory(e.target.value);
                          setUserConfirmedCategory(e.target.value);
                        }}
                        disabled={!!activeAnalysis || isAnalyzing}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-slate-100"
                      >
                        <option value="">Auto-Detect via AI</option>
                        <option value="Near Miss">Near Miss</option>
                        <option value="Unsafe Act">Unsafe Act</option>
                        <option value="Unsafe Condition">Unsafe Condition</option>
                        <option value="Incident">Incident</option>
                        <option value="Injury">Injury</option>
                        <option value="Process Safety Event">Process Safety Event</option>
                        <option value="Fire">Fire</option>
                        <option value="Loss of Containment">Loss of Containment</option>
                        <option value="Equipment Failure">Equipment Failure</option>
                        <option value="Environmental Event">Environmental Event</option>
                        <option value="Vehicle / Transportation">Vehicle / Transportation</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Work at Height">Work at Height</option>
                        <option value="Confined Space">Confined Space</option>
                        <option value="Hot Work">Hot Work</option>
                        <option value="Lifting / Rigging">Lifting / Rigging</option>
                        <option value="Permit to Work">Permit to Work</option>
                        <option value="Chemical / Hydrocarbon Exposure">Chemical / Hydrocarbon Exposure</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Activity / Work Type</label>
                      <select
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        disabled={!!activeAnalysis || isAnalyzing}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-slate-100"
                      >
                        <option value="">Select Activity</option>
                        <option value="Drilling">Drilling</option>
                        <option value="Workover">Workover</option>
                        <option value="Well Intervention">Well Intervention</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Lifting">Lifting</option>
                        <option value="Hot Work">Hot Work</option>
                        <option value="Electrical Work">Electrical Work</option>
                        <option value="Confined Space">Confined Space</option>
                        <option value="Work at Height">Work at Height</option>
                        <option value="Excavation">Excavation</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Inspection">Inspection</option>
                        <option value="Construction">Construction</option>
                        <option value="Process Operations">Process Operations</option>
                        <option value="Pipeline Operations">Pipeline Operations</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Date & Time</label>
                      <input
                        type="datetime-local"
                        value={reportDate}
                        onChange={(e) => setReportDate(e.target.value)}
                        disabled={!!activeAnalysis || isAnalyzing}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Asset / Installation</label>
                      <input
                        type="text"
                        value={asset}
                        onChange={(e) => setAsset(e.target.value)}
                        disabled={!!activeAnalysis || isAnalyzing}
                        placeholder="e.g. Rig 12, Storage Tank C"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                  <div>`;

content = content.replace(/<div className="space-y-4">\s*<div>\s*<label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-1">Incident Title<\/label>[\s\S]*?<\/div>\s*<div>/, newForm);
fs.writeFileSync('src/components/ReportAnalyzer.tsx', content);
