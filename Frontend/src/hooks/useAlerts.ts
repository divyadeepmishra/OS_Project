'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Alert, AlertSeverity, SystemMetrics, Process, Settings } from '@/types';
import { generateId } from '@/lib/utils';

/** Alert queue management hook return type */
export interface UseAlertsReturn {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => void;
  acknowledgeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  clearAll: () => void;
  unacknowledgedCount: number;
}

/**
 * Manages alert queue — generates threshold-based alerts from metrics
 * and provides acknowledge/dismiss/clear actions.
 */
export function useAlerts(
  metrics: SystemMetrics,
  processes: Process[],
  settings: Settings
): UseAlertsReturn {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const lastCpuAlert = useRef(0);
  const lastMemAlert = useRef(0);

  // Threshold monitoring
  useEffect(() => {
    const now = Date.now();
    const cooldown = 10000; // 10s cooldown between same alert type

    // CPU threshold
    if (
      settings.showCpuAlerts &&
      metrics.cpuPercent > settings.cpuThreshold &&
      now - lastCpuAlert.current > cooldown
    ) {
      lastCpuAlert.current = now;
      setAlerts(prev => [
        {
          id: generateId(),
          severity: (metrics.cpuPercent > 90 ? 'critical' : 'warning') as AlertSeverity,
          title: 'High CPU Usage',
          description: `CPU utilisation at ${metrics.cpuPercent.toFixed(1)}% — exceeds ${settings.cpuThreshold}% threshold.`,
          timestamp: new Date(),
          acknowledged: false,
        },
        ...prev,
      ].slice(0, 50));
    }

    // Memory threshold
    const memPercent = (metrics.memoryUsedGB / metrics.memoryTotalGB) * 100;
    if (
      settings.showMemAlerts &&
      memPercent > settings.memThreshold &&
      now - lastMemAlert.current > cooldown
    ) {
      lastMemAlert.current = now;
      setAlerts(prev => [
        {
          id: generateId(),
          severity: (memPercent > 92 ? 'critical' : 'warning') as AlertSeverity,
          title: 'High Memory Usage',
          description: `Memory at ${memPercent.toFixed(1)}% — ${metrics.memoryUsedGB.toFixed(1)} GB of ${metrics.memoryTotalGB} GB used.`,
          timestamp: new Date(),
          acknowledged: false,
        },
        ...prev,
      ].slice(0, 50));
    }

    // Process spike alerts
    if (settings.showProcessAlerts) {
      processes.forEach(p => {
        if (p.cpu > 90) {
          setAlerts(prev => {
            const exists = prev.some(
              a => a.pid === p.pid && !a.acknowledged && Date.now() - a.timestamp.getTime() < cooldown
            );
            if (exists) return prev;
            return [
              {
                id: generateId(),
                severity: 'critical' as AlertSeverity,
                title: `Process Spike: ${p.name}`,
                description: `PID ${p.pid} CPU at ${p.cpu.toFixed(1)}% — potential runaway process.`,
                timestamp: new Date(),
                acknowledged: false,
                processName: p.name,
                pid: p.pid,
              },
              ...prev,
            ].slice(0, 50);
          });
        }
      });
    }
  }, [metrics.cpuPercent, metrics.memoryUsedGB, metrics.memoryTotalGB, processes, settings]);

  const addAlert = useCallback(
    (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => {
      setAlerts(prev => [
        { ...alert, id: generateId(), timestamp: new Date(), acknowledged: false },
        ...prev,
      ].slice(0, 50));
    },
    []
  );

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, acknowledged: true } : a)));
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setAlerts([]);
  }, []);

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return { alerts, addAlert, acknowledgeAlert, dismissAlert, clearAll, unacknowledgedCount };
}
