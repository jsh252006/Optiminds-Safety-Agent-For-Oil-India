const fs = require('fs');

const utilsContent = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function triggerHaptic(pattern: number | number[] = 15) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      // Ignore gracefully if not supported or permission denied
    }
  }
}

export function playUISound(type: 'tab' | 'card' | 'toggle' | 'action') {
  // UI clicking sounds disabled per user request
}
`;

fs.writeFileSync('src/lib/utils.ts', utilsContent);
