const fs = require('fs');

let content = fs.readFileSync('src/components/MachineManager.tsx', 'utf8');

// 1. Add createdAt to interface
content = content.replace(
`  scheduleTime?: string;
  scheduledTriggered?: boolean;
}`,
`  scheduleTime?: string;
  scheduledTriggered?: boolean;
  createdAt?: any;
}`);

// 2. Add confirmation state and custom modal for deletion
// Find: const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
content = content.replace(
`  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);`,
`  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null);`);

// 3. Update handleDelete logic
content = content.replace(
`  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this machine record?')) return;
    try {
      await deleteDoc(doc(db, 'machines', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, \`machines/\${id}\`);
      alert("Error: You might not have permission to delete this record.");
    }
  };`,
`  const confirmDelete = async () => {
    if (!machineToDelete) return;
    try {
      await deleteDoc(doc(db, 'machines', machineToDelete.id));
      setMachineToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, \`machines/\${machineToDelete.id}\`);
      alert("Error: You might not have permission to delete this record.");
    }
  };`);

// Update delete button
content = content.replace(
/onClick=\{\(\) \=\> handleDelete\(machine\.id\)\}/g,
`onClick={() => setMachineToDelete(machine)}`
);

// 4. Update the card to show date and time
content = content.replace(
`<div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                          {machine.location || 'Unknown Location'}
                        </span>
                      </div>`,
`<div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                          {machine.location || 'Unknown Location'}
                        </span>
                      </div>
                      {machine.createdAt && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px] font-medium text-slate-400">
                            Added: {new Date(machine.createdAt.toDate ? machine.createdAt.toDate() : machine.createdAt).toLocaleString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}`
);

// 5. Add Delete Confirmation Modal
content = content.replace(
`{/* Modal */}
        <AnimatePresence>`,
`{/* Delete Confirmation Modal */}
        <AnimatePresence>
          {machineToDelete && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                onClick={() => setMachineToDelete(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[60] overflow-hidden p-6 text-center"
              >
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Delete Machine?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Are you sure you want to remove <strong>{machineToDelete.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMachineToDelete(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Modal */}
        <AnimatePresence>`
);

fs.writeFileSync('src/components/MachineManager.tsx', content);
