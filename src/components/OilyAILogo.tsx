import { Droplet, Sparkles, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

interface OilyAILogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function OilyAILogo({ className, size = 'md' }: OilyAILogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  const sparkSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
  };

  return (
    <div className={cn("relative flex items-center justify-center bg-gradient-to-br from-red-600 to-red-900 rounded-full shadow-md shrink-0 overflow-hidden", sizeClasses[size], className)}>
      <Droplet className={cn("text-amber-400 absolute opacity-30 fill-amber-400/20", iconSizes[size])} style={{ transform: 'scale(1.4) translateY(10%)' }} />
      <Cpu className={cn("text-white relative z-10", iconSizes[size])} strokeWidth={1.5} />
      <Sparkles className={cn("text-amber-300 absolute z-20 right-[15%] top-[15%]", sparkSizes[size])} />
    </div>
  );
}
