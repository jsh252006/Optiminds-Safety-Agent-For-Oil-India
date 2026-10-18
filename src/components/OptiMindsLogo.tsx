import { BrainCircuit, Lightbulb, Orbit, Sparkle } from 'lucide-react';
import { cn } from '../lib/utils';

interface OptiMindsLogoProps {
  className?: string;
  iconClassName?: string;
}

export default function OptiMindsLogo({ className, iconClassName }: OptiMindsLogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center shrink-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800" />
      
      {/* Abstract Orbit */}
      <Orbit className="absolute text-blue-400/40 w-[140%] h-[140%] -rotate-12" strokeWidth={1} />
      
      {/* Brain Circuit Element (Bottom Left Bias) */}
      <BrainCircuit 
        className="absolute text-white/30 w-[85%] h-[85%] -bottom-[15%] -left-[10%]" 
        strokeWidth={1.5} 
      />
      
      {/* Central Idea/Lightbulb Element */}
      <Lightbulb 
        className={cn("relative z-10 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]", iconClassName || "w-1/2 h-1/2")} 
        strokeWidth={2.5} 
      />
      
      {/* Sparkle/Star Element */}
      <Sparkle className="absolute text-white/90 w-[20%] h-[20%] top-[15%] right-[15%] z-10 animate-pulse" fill="currentColor" />
    </div>
  );
}
