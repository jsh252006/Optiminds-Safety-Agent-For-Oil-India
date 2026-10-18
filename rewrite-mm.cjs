const fs = require('fs');

const content = `import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, X, Activity, Server, MapPin, Clock, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

interface Machine {
  id: string;
  name: string;
  status: 'Open' | 'Closed';
  details: string;
  location: string;
  createdBy: string;
  scheduleType?: 'None' | 'Turn On' | 'Turn Off';
  scheduleTime?: string;
  scheduledTriggered?: boolean;
}

export default function MachineManager() {
  const { user } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'Open' | 'Closed'>('Open');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState('');
  const [scheduleType, setScheduleType] = useState<'None' | 'Turn On' | 'Turn Off'>('None');
  const [scheduleTime, setScheduleTime] = useState('');

  // Scheduler Effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      machines.forEach(async (machine) => {
        if (
          machine.scheduleType && 
          machine.scheduleType !== 'None' && 
          machine.scheduleTime && 
          !machine.scheduledTriggered
        ) {
          const scheduleDate = new Date(machine.scheduleTime);
          if (now >= scheduleDate) {
            // Trigger reminder and update status
            const newStatus = machine.scheduleType === 'Turn On' ? 'Open' : 'Closed';
            
            // Show reminder notification
            if (Notification.permission === 'granted') {
              new Notification('Machine Reminder', {
                body: \`Time to \${machine.scheduleType} machine: \${machine.name}\`
              });
            } else {
              alert(\`⚠️ Reminder: It is time to \${machine.scheduleType} machine: \${machine.name}. Auto-updating status to \${newStatus}.\`);
            }

            try {
              await updateDoc(doc(db, 'machines', machine.id), {
                status: newStatus,
                scheduleType: 'None',
                scheduledTriggered: true,
                updatedAt: serverTimestamp(),
              });
            } catch (err) {
              console.error("Failed to update machine schedule", err);
            }
          }
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [machines]);

  // Request notification permissions
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, 'machines'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const machineData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Machine[];
      
      setMachines(machineData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching machines:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return;
    
    const payload = {
      name,
      status,
      details,
      location,
      scheduleType,
      scheduleTime: scheduleType !== 'None' ? scheduleTime : null,
      scheduledTriggered: false,
    };

    try {
      if (editingMachine) {
        await updateDoc(doc(db, 'machines', editingMachine.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'machines'), {
          ...payload,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      closeModal();
    } catch (error) {
      handleFirestoreError(error, editingMachine ? OperationType.UPDATE : OperationType.CREATE, 'machines');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this machine record?')) return;
    try {
      await deleteDoc(doc(db, 'machines', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, \`machines/\${id}\`);
      alert("Error: You might not have permission to delete this record.");
    }
  };

  const openModal = (machine?: Machine) => {
    if (machine) {
      setEditingMachine(machine);
      setName(machine.name);
      setStatus(machine.status);
      setDetails(machine.details);
      setLocation(machine.location || '');
      setScheduleType(machine.scheduleType || 'None');
      setScheduleTime(machine.scheduleTime || '');
    } else {
      setEditingMachine(null);
      setName('');
      setStatus('Open');
      setDetails('');
      setLocation('');
      setScheduleType('None');
      setScheduleTime('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-slate-500">
        <Activity className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p>Loading machines...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-none transition-shadow hover:shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Server className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Machine Management</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track status and schedule actions for equipment.</p>
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Machine
          </button>
        </div>

        {machines.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 text-center flex flex-col items-center">
            <Server className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No machines tracked</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
              Add your first machine to track its operational status and schedule maintenance alerts.
            </p>
            <button
              onClick={() => openModal()}
              className="mt-6 flex items-center gap-2 bg-slate-900 dark:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add First Machine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {machines.map((machine) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={machine.id}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden"
              >
                <div className="p-5 flex items-start justify-between gap-4 border-b border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-inner",
                      machine.status === 'Open' ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                    )}>
                      <Server className={cn(
                        "w-6 h-6",
                        machine.status === 'Open' ? "text-emerald-600" : "text-red-600"
                      )} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-tight line-clamp-1" title={machine.name}>
                        {machine.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                          {machine.location || 'Unknown Location'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold border shrink-0",
                    machine.status === 'Open' ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
                  )}>
                    {machine.status}
                  </div>
                </div>
                <div className="p-5 flex-1 bg-slate-50/50">
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">
                    {machine.details || 'No additional details provided.'}
                  </p>
                  
                  {/* Scheduling Info */}
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
                </div>
                {/* Changed to always be partially visible on mobile, visible on hover for desktop */}
                <div className="p-3 border-t border-slate-100 bg-white dark:bg-slate-800 flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(machine)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" /> <span className="text-xs font-semibold md:hidden">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(machine.id)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" /> <span className="text-xs font-semibold md:hidden">Delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 overflow-y-auto"
                onClick={closeModal}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-[5%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden max-h-[90vh] flex flex-col"
              >
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {editingMachine ? 'Edit Machine' : 'Add New Machine'}
                  </h2>
                  <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:text-slate-400 p-1 rounded-full hover:bg-slate-200 dark:bg-slate-700 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Machine Name / ID</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-slate-100"
                      placeholder="e.g. Rig Pump #4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-slate-100"
                      placeholder="e.g. Sector 5, Block B"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Current Status</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setStatus('Open')}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2",
                          status === 'Open' ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50"
                        )}
                      >
                        <div className={cn("w-2 h-2 rounded-full", status === 'Open' ? "bg-emerald-500" : "bg-slate-300")} />
                        Open / Active
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus('Closed')}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2",
                          status === 'Closed' ? "bg-red-50 border-red-500 text-red-700 shadow-md" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50"
                        )}
                      >
                        <div className={cn("w-2 h-2 rounded-full", status === 'Closed' ? "bg-red-500" : "bg-slate-300")} />
                        Closed / Inactive
                      </button>
                    </div>
                  </div>

                  {/* Scheduling Section */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        Schedule Reminder (Optional)
                      </label>
                      <select
                        value={scheduleType}
                        onChange={(e) => setScheduleType(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-slate-100"
                      >
                        <option value="None">No Schedule</option>
                        <option value="Turn On">Schedule to Turn On (Open)</option>
                        <option value="Turn Off">Schedule to Turn Off (Close)</option>
                      </select>
                    </div>

                    {scheduleType !== 'None' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">When?</label>
                        <input
                          type="datetime-local"
                          required={scheduleType !== 'None'}
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-slate-100"
                        />
                        <p className="text-xs text-slate-500 mt-2">You will receive a browser alert and the status will update automatically.</p>
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Details & Remarks</label>
                    <textarea
                      required
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-slate-100 h-24 resize-none"
                      placeholder="Maintenance notes, operational context, reason for closure..."
                    />
                  </div>
                  <div className="pt-2 shrink-0">
                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
                    >
                      {editingMachine ? 'Save Changes' : 'Add Machine'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
`
fs.writeFileSync('src/components/MachineManager.tsx', content);
