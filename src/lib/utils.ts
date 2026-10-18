import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeFormatDate(val: any, formatStr = 'PP'): string {
  if (!val) return 'Recently';
  try {
    const d = typeof val?.toDate === 'function' ? val.toDate() : new Date(val);
    if (isNaN(d.getTime())) return 'Recently';
    return format(d, formatStr);
  } catch {
    return 'Recently';
  }
}

export function safeFormatDistanceToNow(val: any): string {
  if (!val) return 'recently';
  try {
    const d = typeof val?.toDate === 'function' ? val.toDate() : new Date(val);
    if (isNaN(d.getTime())) return 'recently';
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return 'recently';
  }
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
