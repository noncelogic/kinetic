import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function captureMetadata(): {
  url: string;
  userAgent: string;
  viewport: { width: number; height: number };
  timestamp: string;
} {
  return {
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    viewport: typeof window !== 'undefined' 
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: 0, height: 0 },
    timestamp: new Date().toISOString(),
  };
}

export async function captureScreenshot(): Promise<string | null> {
  // Requires html2canvas or similar - this is a stub
  // In production, use dynamic import to keep bundle small
  console.warn('[feedback] Screenshot capture requires html2canvas');
  return null;
}
