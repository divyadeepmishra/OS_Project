'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Process, ProcessStatus, SystemMetrics, Settings } from '@/types';

const CPU_HISTORY_LENGTH = 30;
const SYSTEM_HISTORY_LENGTH = 60;
const TOTAL_MEMORY_GB = 16;
const SWAP_TOTAL_GB = 4;

/** Create initial system metrics */
function createInitialMetrics(): SystemMetrics {
  return {
    cpuPercent: 0,
    cpuHistory: Array.from({ length: SYSTEM_HISTORY_LENGTH }, () => 0),
    cpuCores: [],
    loadAverage: [0, 0, 0],
    memoryUsedGB: 0,
    memoryTotalGB: TOTAL_MEMORY_GB,
    memoryCachedGB: 0,
    memoryFreeGB: 0,
    swapUsedGB: 0,
    swapTotalGB: SWAP_TOTAL_GB,
    networkUpKBs: 0,
    networkDownKBs: 0,
    networkUpHistory: Array.from({ length: SYSTEM_HISTORY_LENGTH }, () => 0),
    networkDownHistory: Array.from({ length: SYSTEM_HISTORY_LENGTH }, () => 0),
    uptimeSeconds: 0,
  };
}

/** Hook return type */
export interface UseProcessSimulationReturn {
  processes: Process[];
  systemMetrics: SystemMetrics;
  killProcess: (pid: number) => void;
  pauseProcess: (pid: number) => void;
  resumeProcess: (pid: number) => void;
  setPriority: (pid: number, priority: number) => void;
  isRunning: boolean;
  togglePause: () => void;
  setRefreshRate: (ms: number) => void;
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
}

/** Master simulation/data hook providing all process and system data */
export function useProcessSimulation(): UseProcessSimulationReturn {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>(createInitialMetrics);
  const [isRunning, setIsRunning] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    refreshRateMs: 2000,
    cpuThreshold: 80,
    memThreshold: 85,
    showCpuAlerts: true,
    showMemAlerts: true,
    showProcessAlerts: true,
    density: 'comfortable',
  });

  const processHistoryMap = useRef<Map<number, number[]>>(new Map());

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const setRefreshRate = useCallback((ms: number) => {
    setSettings(prev => ({ ...prev, refreshRateMs: ms }));
  }, []);

  const togglePause = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  // --- PROCESS ACTIONS ---
  // When a user clicks "Kill", it sends a POST request to the backend.
  // The backend uses native OS libraries to send a SIGTERM (terminate) signal to that specific Process ID.
  const killProcess = useCallback(async (pid: number) => {
    try {
      await fetch(`http://localhost:3001/api/processes/${pid}/kill`, { method: 'POST' });
      // Optimistically remove the process from the React UI list before the next polling tick
      setProcesses(prev => prev.filter(p => p.pid !== pid));
    } catch (e) {
      console.error('Failed to kill process', e);
    }
  }, []);

  const pauseProcess = useCallback(async (pid: number) => {
    try {
      await fetch(`http://localhost:3001/api/processes/${pid}/pause`, { method: 'POST' });
    } catch (e) {
      console.error('Failed to pause process', e);
    }
  }, []);

  const resumeProcess = useCallback(async (pid: number) => {
    try {
      await fetch(`http://localhost:3001/api/processes/${pid}/resume`, { method: 'POST' });
    } catch (e) {
      console.error('Failed to resume process', e);
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setPriority = useCallback((pid: number, priority: number) => {
    console.warn('Set priority not implemented via API yet');
  }, []);

  // ----------------------------------------------------
  // THE POLLING ENGINE (Data Fetching Loop)
  // ----------------------------------------------------
  // This useEffect hook is the heartbeat of the Dashboard.
  // Instead of using WebSockets, it sets up an interval that repeatedly polls the Node.js backend.
  useEffect(() => {
    // If the user pauses the dashboard, stop fetching data entirely.
    if (!isRunning || settings.refreshRateMs === 0) return;

    // This async function coordinates network requests to the local server.
    const fetchData = async () => {
      try {
        // 1. HTTP Network Requests: The browser asks the Node server for hardware data.
        // We use Promise.all to fetch both endpoints simultaneously, cutting wait time in half.
        const [sysRes, procRes] = await Promise.all([
          fetch('http://localhost:3001/api/system'),
          fetch('http://localhost:3001/api/processes')
        ]);
        
        if (!sysRes.ok || !procRes.ok) return;

        // 2. Parse JSON: Convert the raw response text into JavaScript Objects.
        const sysData = await sysRes.json();
        const procData = await procRes.json();

        // 3. Map State Data: Transform the raw hardware telemetry into numbers our UI charts understand.
        setSystemMetrics(prev => {
          const cpuVal = sysData.cpu.currentLoad || 0;
          const mem = sysData.mem || {};
          const net = sysData.network || {};
          
          const memUsedGB = (mem.active || 0) / (1024 ** 3);
          const memTotalGB = (mem.total || 0) / (1024 ** 3);
          const memCachedGB = (mem.cached || mem.buffers || 0) / (1024 ** 3);
          const memFreeGB = (mem.free || 0) / (1024 ** 3);

          const swapUsedGB = (mem.swapused || 0) / (1024 ** 3);
          const swapTotalGB = (mem.swaptotal || 0) / (1024 ** 3);

          const netUp = (net.tx_sec || 0) / 1024;
          const netDown = (net.rx_sec || 0) / 1024;

          return {
            ...prev,
            cpuPercent: Math.round(cpuVal * 10) / 10,
            cpuHistory: [...prev.cpuHistory.slice(-SYSTEM_HISTORY_LENGTH + 1), cpuVal],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cpuCores: sysData.cpu.cpus ? sysData.cpu.cpus.map((c: any) => c.load) : [],
            loadAverage: sysData.cpu.avgLoad ? [sysData.cpu.avgLoad, sysData.cpu.avgLoad, sysData.cpu.avgLoad] : prev.loadAverage,
            memoryUsedGB: Math.round(memUsedGB * 10) / 10,
            memoryTotalGB: Math.round(memTotalGB * 10) / 10,
            memoryCachedGB: Math.round(memCachedGB * 10) / 10,
            memoryFreeGB: Math.round(memFreeGB * 10) / 10,
            swapUsedGB: Math.round(swapUsedGB * 10) / 10,
            swapTotalGB: Math.round(swapTotalGB * 10) / 10,
            networkUpKBs: Math.round(netUp),
            networkDownKBs: Math.round(netDown),
            networkUpHistory: [...prev.networkUpHistory.slice(-SYSTEM_HISTORY_LENGTH + 1), netUp],
            networkDownHistory: [...prev.networkDownHistory.slice(-SYSTEM_HISTORY_LENGTH + 1), netDown],
            uptimeSeconds: sysData.time.uptime || prev.uptimeSeconds + Math.round(settings.refreshRateMs / 1000),
          };
        });

        // Map process data
        if (procData && procData.list) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedProcesses: Process[] = procData.list.map((p: any) => {
            const history = processHistoryMap.current.get(p.pid) || Array(CPU_HISTORY_LENGTH).fill(0);
            const newCpu = p.pcpu || 0;
            const newHistory = [...history.slice(-CPU_HISTORY_LENGTH + 1), newCpu];
            processHistoryMap.current.set(p.pid, newHistory);

            let status: ProcessStatus = 'running';
            const s = String(p.state).toLowerCase();
            if (s.includes('s')) status = 'sleeping';
            if (s.includes('z')) status = 'zombie';
            if (s.includes('t')) status = 'stopped';
            if (s.includes('d')) status = 'uninterruptible';

            let user: Process['user'] = 'root';
            const u = String(p.user).toLowerCase();
            if (u.includes('root')) user = 'root';
            else if (u.includes('ubuntu')) user = 'ubuntu';
            else if (u.includes('www')) user = 'www-data';
            else if (u.includes('postgres')) user = 'postgres';
            else if (u.includes('redis')) user = 'redis';
            else user = 'root';

            return {
              pid: p.pid,
              name: p.name || 'unknown',
              user,
              status,
              cpu: Math.round(newCpu * 10) / 10,
              memory: Math.round((p.pmem || 0) * 10) / 10,
              memoryMB: Math.round((p.memRss || 0) / 1024),
              threads: p.threads || 1,
              startTime: new Date(Date.now() - (p.started ? parseInt(p.started, 10) * 1000 : 0)),
              priority: p.priority || 0,
              ioReadKBs: 0,
              ioWriteKBs: 0,
              openFiles: 0,
              cpuHistory: newHistory,
            };
          });
          
          setProcesses(mappedProcesses);
        }

      } catch (err) {
        console.error('Failed to fetch telemetry:', err);
      }
    };

    fetchData(); // initial call
    const interval = setInterval(fetchData, settings.refreshRateMs);
    return () => clearInterval(interval);
  }, [isRunning, settings.refreshRateMs]);

  return {
    processes,
    systemMetrics,
    killProcess,
    pauseProcess,
    resumeProcess,
    setPriority,
    isRunning,
    togglePause,
    setRefreshRate,
    settings,
    updateSettings,
  };
}
