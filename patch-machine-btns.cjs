const fs = require('fs');
let content = fs.readFileSync('src/components/MachineManager.tsx', 'utf8');

const targetStr = `                  {/* Scheduling Info */}
                  {machine.scheduleType && machine.scheduleType !== 'None' && machine.scheduleTime && !machine.scheduledTriggered && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 flex items-start gap-2">
                      <Bell className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-orange-800">
                          Scheduled: {machine.scheduleType}
                        </div>
                        <div className="text-[11px] text-orange-600 font-medium">
                          {new Date(machine.scheduleTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>`;

const newStr = `                  {/* Scheduling Info */}
                  {machine.scheduleType && machine.scheduleType !== 'None' && machine.scheduleTime && !machine.scheduledTriggered && (
                    <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-500/30 rounded-lg p-2.5 flex items-start gap-2 mb-2">
                      <Bell className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-orange-800 dark:text-orange-300">
                          Scheduled: {machine.scheduleType}
                        </div>
                        <div className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">
                          {new Date(machine.scheduleTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {machine.status === 'Open' && (!machine.scheduleType || machine.scheduleType === 'None' || machine.scheduledTriggered) && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button 
                        onClick={() => openModal(machine, 'Maintenance')}
                        className="flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-amber-400 dark:hover:bg-amber-900/30 dark:hover:border-amber-500/50 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-all shadow-sm hover:shadow"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span className="truncate">Schedule Maintenance</span>
                      </button>
                      <button 
                        onClick={() => openModal(machine, 'Turn Off')}
                        className="flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 dark:hover:border-red-500/50 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-all shadow-sm hover:shadow"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span className="truncate">Schedule Turn Off</span>
                      </button>
                    </div>
                  )}
                </div>`;

if(content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync('src/components/MachineManager.tsx', content);
    console.log('patched btns');
} else {
    console.log('targetStr not found');
}
