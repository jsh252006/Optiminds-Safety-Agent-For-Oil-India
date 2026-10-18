import { useState, useEffect } from 'react';
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
  scheduleType?: 'None' | 'Turn On' | 'Turn Off' | 'Maintenance';
  reminderAction?: 'turn_on' | 'turn_off' | null;
  scheduleTime?: string;
  scheduledTriggered?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export default function MachineManager() {
  const { user } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'Open' | 'Closed'>('Open');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState('');
  const [scheduleType, setScheduleType] = useState<'None' | 'Turn On' | 'Turn Off' | 'Maintenance'>('Turn Off');
  const [scheduleTime, setScheduleTime] = useState('');

  // Scheduler Effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      machines.forEach(async (machine) => {
        const hasActiveSchedule = (
          (machine.scheduleType && machine.scheduleType !== 'None') ||
          Boolean(machine.reminderAction)
        ) && machine.scheduleTime && !machine.scheduledTriggered;

        if (hasActiveSchedule) {
          const scheduleDate = new Date(machine.scheduleTime!);
          if (now >= scheduleDate) {
            // Trigger reminder and update status
            const isTurnOn = machine.reminderAction === 'turn_on' || machine.scheduleType === 'Turn On';
            const newStatus = isTurnOn ? 'Open' : 'Closed';
            const actionLabel = isTurnOn ? 'Turn On (Open)' : 'Turn Off (Close)';
            
            // Show reminder notification
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              try {
                new Notification('Machine Reminder', {
                  body: `Time to ${actionLabel} machine: ${machine.name}`
                });
              } catch (e) {
                console.warn('Notification error:', e);
              }
            } else {
              alert(`⚠️ Reminder: It is time to ${actionLabel} machine: ${machine.name}. Auto-updating status to ${newStatus}.`);
            }

            try {
              await updateDoc(doc(db, 'machines', machine.id), {
                status: newStatus,
                scheduleType: 'None',
                reminderAction: null,
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
    try {
      // Check if we are inside an iframe (AI Studio preview)
      const inIframe = window.self !== window.top;
      
      if (!inIframe && 'Notification' in window && window.Notification && Notification.permission === 'default') {
        const promise = Notification.requestPermission();
        if (promise && promise.catch) {
          promise.catch((e) => console.log('Notification permission blocked:', e));
        }
      }
    } catch (e) {
      console.log('Notification API not allowed or supported in this context', e);
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

  const handleStatusChange = (newStatus: 'Open' | 'Closed') => {
    if (newStatus !== status) {
      setStatus(newStatus);
      setScheduleTime('');
      setScheduleType(newStatus === 'Open' ? 'Turn Off' : 'Turn On');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return;
    
    const hasReminder = Boolean(scheduleTime && scheduleTime.trim() !== '');
    const reminderAction = hasReminder
      ? (status.toLowerCase() === 'open' ? 'turn_off' : 'turn_on')
      : null;
    const effectiveScheduleType = hasReminder
      ? (status === 'Open' ? 'Turn Off' : 'Turn On')
      : 'None';

    const payload = {
      name,
      status,
      details,
      location,
      scheduleType: effectiveScheduleType,
      reminderAction,
      scheduleTime: hasReminder ? scheduleTime : null,
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

  const confirmDelete = async () => {
    if (!machineToDelete) return;
    try {
      await deleteDoc(doc(db, 'machines', machineToDelete.id));
      setMachineToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `machines/${machineToDelete.id}`);
      alert("Error: You might not have permission to delete this record.");
    }
  };

  const openModal = (machine?: Machine, overrideSchedule?: 'Maintenance' | 'Turn Off') => {
    if (machine) {
      setEditingMachine(machine);
      setName(machine.name);
      setStatus(machine.status);
      setDetails(machine.details);
      setLocation(machine.location || '');
      setScheduleType(machine.status === 'Open' ? 'Turn Off' : 'Turn On');
      setScheduleTime(machine.scheduleTime || '');
    } else {
      setEditingMachine(null);
      setName('');
      setStatus('Open');
      setDetails('');
      setLocation('');
      setScheduleType('Turn Off');
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-none transition-shadow hover:shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
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
          <div className="bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center flex flex-col items-center">
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
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                key={machine.id}
                className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden"
              >
                <div className="p-5 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-inner",
                      machine.status === 'Open' 
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-800" 
                        : "bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-800"
                    )}>
                      <Server className={cn(
                        "w-6 h-6",
                        machine.status === 'Open' ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
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
                      {machine.createdAt && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            Added: {new Date(machine.createdAt.toDate ? machine.createdAt.toDate() : machine.createdAt).toLocaleString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold border shrink-0",
                    machine.status === 'Open' 
                      ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300" 
                      : "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                  )}>
                    {machine.status}
                  </div>
                </div>
                <div className="p-5 flex-1 bg-slate-50/50 dark:bg-slate-900/40">
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">
                    {machine.details || 'No additional details provided.'}
                  </p>
                  
                  {/* Scheduling Info */}
                  {((machine.scheduleType && machine.scheduleType !== 'None') || machine.reminderAction) && machine.scheduleTime && !machine.scheduledTriggered && (
                    <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-500/30 rounded-lg p-2.5 flex items-start gap-2 mb-2">
                      <Bell className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-orange-800 dark:text-orange-300">
                          Scheduled: {machine.scheduleType || (machine.reminderAction === 'turn_on' ? 'Turn On' : 'Turn Off')}
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
                </div>
                {/* Changed to always be partially visible on mobile, visible on hover for desktop */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(machine)}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" /> <span className="text-xs font-semibold md:hidden">Edit</span>
                  </button>
                  <button
                    onClick={() => setMachineToDelete(machine)}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" /> <span className="text-xs font-semibold md:hidden">Delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
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
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[60] overflow-hidden p-6 text-center"
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
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-[5%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden max-h-[90vh] flex flex-col"
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
                        onClick={() => handleStatusChange('Open')}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2",
                          status === 'Open' 
                            ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-md" 
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                        )}
                      >
                        <div className={cn("w-2 h-2 rounded-full", status === 'Open' ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600")} />
                        Open / Active
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange('Closed')}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2",
                          status === 'Closed' 
                            ? "bg-red-50 dark:bg-red-950/50 border-red-500 text-red-700 dark:text-red-300 shadow-md" 
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                        )}
                      >
                        <div className={cn("w-2 h-2 rounded-full", status === 'Closed' ? "bg-red-500" : "bg-slate-300 dark:bg-slate-600")} />
                        Closed / Inactive
                      </button>
                    </div>
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
