/** Process status types matching Linux process states */
export type ProcessStatus =
  | 'running'
  | 'sleeping'
  | 'stopped'
  | 'zombie'
  | 'uninterruptible';

/** A single monitored process */
export interface Process {
  pid: number;
  name: string;
  user: 'root' | 'ubuntu' | 'www-data' | 'postgres' | 'redis';
  status: ProcessStatus;
  cpu: number;
  memory: number;
  memoryMB: number;
  threads: number;
  startTime: Date;
  priority: number;
  ioReadKBs: number;
  ioWriteKBs: number;
  openFiles: number;
  cpuHistory: number[];
}

/** System-wide metrics snapshot */
export interface SystemMetrics {
  cpuPercent: number;
  cpuHistory: number[];
  cpuCores: number[];
  loadAverage: [number, number, number];
  memoryUsedGB: number;
  memoryTotalGB: number;
  memoryCachedGB: number;
  memoryFreeGB: number;
  swapUsedGB: number;
  swapTotalGB: number;
  networkUpKBs: number;
  networkDownKBs: number;
  networkUpHistory: number[];
  networkDownHistory: number[];
  uptimeSeconds: number;
}

/** Alert severity levels */
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'error';

/** A system alert notification */
export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: Date;
  acknowledged: boolean;
  processName?: string;
  pid?: number;
}

/** Sort configuration for process list */
export interface SortConfig {
  key: keyof Process;
  direction: 'asc' | 'desc';
}

/** Navigation item */
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

/** User-configurable settings */
export interface Settings {
  refreshRateMs: number;
  cpuThreshold: number;
  memThreshold: number;
  showCpuAlerts: boolean;
  showMemAlerts: boolean;
  showProcessAlerts: boolean;
  density: 'comfortable' | 'compact' | 'cozy';
}
