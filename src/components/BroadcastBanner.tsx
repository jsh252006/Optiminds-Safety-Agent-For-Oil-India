import { useData } from '../contexts/DataContext';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export default function BroadcastBanner() {
  const { broadcasts } = useData();

  if (!broadcasts || broadcasts.length === 0) return null;

  return (
    <div className="flex flex-col w-full z-50 px-4 pt-4 space-y-2 relative">
      <AnimatePresence>
        {broadcasts.map((broadcast) => (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            key={broadcast.id} 
            className={cn(
              "px-4 py-3 flex items-center justify-center gap-3 text-sm font-semibold rounded-2xl border shadow-lg backdrop-blur-md",
              broadcast.type === 'emergency' 
                ? "bg-red-600/90 text-white border-red-500/50 shadow-red-900/20" 
                : "bg-amber-400/90 text-amber-900 border-amber-300/50 shadow-amber-900/10"
            )}
          >
            {broadcast.type === 'emergency' ? (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            ) : (
              <Info className="w-5 h-5 shrink-0" />
            )}
            <div className="flex items-center gap-2">
              <span>{broadcast.message}</span>
              {broadcast.createdAt && typeof broadcast.createdAt.toDate === 'function' ? (
                <span className="opacity-80 text-xs">
                  • {formatDistanceToNow(broadcast.createdAt.toDate(), { addSuffix: true })}
                </span>
              ) : (
                <span className="opacity-80 text-xs">• Just now</span>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
