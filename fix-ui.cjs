const fs = require('fs');
let content = fs.readFileSync('src/components/ReportAnalyzer.tsx', 'utf8');

const regex = /<div>\s*<label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-1">Incident Title<\/label>[\s\S]*?<\/div>/;

const newFields = `
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Incident Title <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. Minor spill during refuelling" 
                      value={reportTitle}
                      onChange={e => setReportTitle(e.target.value)}
                      disabled={!!activeAnalysis || isAnalyzing}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / Site</label>
                      <select
                        value={site}
                        onChange={(e) => setSite(e.target.value)}
                        disabled={!!activeAnalysis || isAnalyzing}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 dark:bg-slate-900"
                      >
                        <option value="">Select Location</option>
                        <option value="Duliajan Field">Duliajan Field</option>
                        <option value="Moran Field">Moran Field</option>
                        <option value="Naharkatiya Field">Naharkatiya Field</option>
                        <option value="Digboi Field">Digboi Field</option>
                        <option value="Baghjan Field">Baghjan Field</option>
                        <option value="Kumchai Field">Kumchai Field</option>
                        <option value="Pipeline Network">Pipeline Network</option>
                        <option value="Pump Station">Pump Station</option>
                        <option value="Offshore / Other">Offshore / Other</option>
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
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 dark:bg-slate-900"
                      >
                        <option value="">Auto-Detect via AI</option>
                        <option value="Near Miss">Near Miss</option>
                        <option value="Unsafe Act / Condition">Unsafe Act / Condition</option>
                        <option value="Blowout">Blowout</option>
                        <option value="Well Kick">Well Kick</option>
                        <option value="Pipeline Leak / Burst">Pipeline Leak / Burst</option>
                        <option value="Rig / Hoist Incident">Rig / Hoist Incident</option>
                        <option value="H2S Release">H2S Release</option>
                        <option value="Gas Leak">Gas Leak</option>
                        <option value="Oil Spill / Loss of Containment">Oil Spill / Loss of Containment</option>
                        <option value="Fire / Explosion">Fire / Explosion</option>
                        <option value="Process Safety Event">Process Safety Event</option>
                        <option value="Vehicle / Transportation">Vehicle / Transportation</option>
                        <option value="Chemical Exposure">Chemical Exposure</option>
                        <option value="Work at Height">Work at Height</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
`;

content = content.replace(regex, newFields);
fs.writeFileSync('src/components/ReportAnalyzer.tsx', content);
