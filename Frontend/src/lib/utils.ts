import { type ClassValue, clsx } from 'clsx';

/** Merge class names with clsx (Tailwind-merge compatible) */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Format bytes to human-readable string */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/** Get relative time string from date */
export function relativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Format number with commas */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/** Generate a random number between min and max */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/** Generate a UUID-like string */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

/** Process colour palette based on pid */
export const PROCESS_COLOURS = [
  '#a0373b', '#7a1e24', '#c9484e',
  '#8d5a5b', '#b87878', '#6b3a3a',
] as const;

/** Get colour for a process based on pid */
export function getProcessColour(pid: number): string {
  return PROCESS_COLOURS[pid % 6];
}

/** Get initials from process name (first 2 letters) */
export function getProcessInitials(name: string): string {
  return name.substring(0, 2).toUpperCase();
}

/** Refresh rate options in ms */
export const REFRESH_RATES = [500, 1000, 2000, 5000, 0] as const;

/** Status display mapping */
export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    running: 'RUNNING',
    sleeping: 'IDLE',
    stopped: 'STOPPED',
    zombie: 'ZOMBIE',
    uninterruptible: 'INTENSIVE',
  };
  return map[status] || status.toUpperCase();
}
