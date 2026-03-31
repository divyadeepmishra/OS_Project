'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Zap, Snowflake, Plus, AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/components/layout/AppShell';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import KPICard from '@/components/ui/KPICard';
import ProcessCard from '@/components/ui/ProcessCard';
import CircularGauge from '@/components/ui/CircularGauge';
import type { Process, ProcessStatus, SortConfig } from '@/types';
import { formatNumber } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const STATUS_FILTERS: (ProcessStatus | 'all')[] = ['all', 'running', 'sleeping', 'stopped', 'zombie'];
const PAGE_SIZE = 8;

/** Processes page — "Active Processes" with search, filter, sort, cards, and kill modal */
export default function ProcessesPage() {
  const { processes, systemMetrics, killProcess, pauseProcess, resumeProcess } = useAppContext();
  const { memoryPercent } = useSystemMetrics(systemMetrics);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProcessStatus | 'all'>('all');
  const [sort] = useState<SortConfig>({ key: 'cpu', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [killTarget, setKillTarget] = useState<Process | null>(null);
  const [killingPid, setKillingPid] = useState<number | null>(null);
  const [detailProcess, setDetailProcess] = useState<Process | null>(null);

  const filteredProcesses = useMemo(() => {
    let result = [...processes];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || String(p.pid).includes(q)
      );
    }

    // Filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];
      const mult = sort.direction === 'asc' ? 1 : -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * mult;
      }
      return String(aVal).localeCompare(String(bVal)) * mult;
    });

    return result;
  }, [processes, search, statusFilter, sort]);

  const totalPages = Math.ceil(filteredProcesses.length / PAGE_SIZE);
  const pagedProcesses = filteredProcesses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalLoad = useMemo(() => {
    const running = processes.filter(p => p.status === 'running');
    if (running.length === 0) return 0;
    return running.reduce((acc, p) => acc + p.cpu, 0) / running.length;
  }, [processes]);

  const totalThreads = useMemo(
    () => processes.reduce((acc, p) => acc + p.threads, 0),
    [processes]
  );

  const handleKillConfirm = useCallback(() => {
    if (!killTarget) return;
    setKillingPid(killTarget.pid);
    setTimeout(() => {
      killProcess(killTarget.pid);
      setKillingPid(null);
      setKillTarget(null);
    }, 300);
  }, [killTarget, killProcess]);

  const handleViewDetail = useCallback((process: Process) => {
    setDetailProcess(process);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <div
          className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mb-2 px-3 py-1 rounded-full inline-block"
          style={{ color: 'var(--primary)', background: 'rgba(160,55,59,0.08)' }}
        >
          SYSTEM PULSE
        </div>
        <h1 className="font-headline font-extrabold text-5xl -tracking-tight mb-2">
          <span style={{ color: 'var(--on-surface)' }}>Active </span>
          <span style={{ color: 'var(--primary)' }} className="italic">Processes</span>
        </h1>
        <p className="text-sm font-body" style={{ color: 'var(--on-surface-muted)' }}>
          Real-time execution flow with refractive telemetry analysis. Monitoring{' '}
          {processes.filter(p => p.status === 'running').length} active threads.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <KPICard
          icon={Zap}
          value={totalLoad.toFixed(1) + '%'}
          label="TOTAL LOAD"
          badge={{ text: '+12.4%', variant: 'up' }}
        />
        <KPICard
          icon={Snowflake}
          value={formatNumber(totalThreads)}
          label="THREADS"
          badge={{ text: 'Stable', variant: 'stable' }}
        />
        {/* Memory Saturation Card */}
        <div
          className="rounded-[1.25rem] p-6"
          style={{ background: 'var(--surface-lowest)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mb-3" style={{ color: 'var(--on-surface-faint)' }}>
            MEMORY SATURATION
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full h-2.5 rounded-full mb-2" style={{ background: 'var(--surface-high)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${memoryPercent}%`,
                    background: 'var(--gradient-primary)',
                  }}
                />
              </div>
              <span className="text-xs font-mono" style={{ color: 'var(--on-surface-muted)' }}>
                {systemMetrics.memoryUsedGB.toFixed(1)} GB / {systemMetrics.memoryTotalGB} GB
              </span>
            </div>
            <CircularGauge value={memoryPercent} size={64} showValue label="" strokeWidth={5} />
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          data-search-input
          type="text"
          placeholder="Search processes..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-full text-sm font-body outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(160,55,59,0.2)]"
          style={{ background: 'var(--surface-lowest)', color: 'var(--on-surface)', boxShadow: 'var(--shadow-card)' }}
        />
        <div className="flex gap-1.5">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => { setStatusFilter(f); setPage(1); }}
              className="px-3 py-1.5 rounded-full text-xs font-body font-medium capitalize transition-all"
              style={
                statusFilter === f
                  ? { background: 'var(--gradient-primary)', color: 'white' }
                  : { background: 'var(--surface-highest)', color: 'var(--on-surface-muted)' }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Process List */}
      <div className="space-y-3 mb-6">
        {pagedProcesses.map((p, i) => (
          <div
            key={p.pid}
            className={killingPid === p.pid ? 'process-card-exit' : ''}
          >
            <ProcessCard
              process={p}
              index={i}
              onKill={pid => setKillTarget(processes.find(proc => proc.pid === pid) || null)}
              onPause={pauseProcess}
              onResume={resumeProcess}
              onViewDetail={handleViewDetail}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-body" style={{ color: 'var(--on-surface-faint)' }}>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredProcesses.length)} of{' '}
            {filteredProcesses.length} processes
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-8 h-8 rounded-full text-xs font-body font-medium transition-all"
                style={
                  page === p
                    ? { background: 'var(--gradient-primary)', color: 'white' }
                    : { background: 'var(--surface-highest)', color: 'var(--on-surface-muted)' }
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105"
        style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-float)' }}
        aria-label="New Process Monitor"
      >
        <Plus size={24} />
      </button>

      {/* Kill Confirmation Dialog */}
      <Dialog open={!!killTarget} onOpenChange={() => setKillTarget(null)}>
        <DialogContent
          className="rounded-[1.25rem] border-none max-w-[420px]"
          style={{ background: 'var(--surface-lowest)', boxShadow: 'var(--shadow-modal)' }}
        >
          <DialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: 'var(--error-bg)' }}>
              <AlertTriangle size={24} style={{ color: 'var(--error)' }} />
            </div>
            <DialogTitle className="font-headline font-semibold text-xl" style={{ color: 'var(--on-surface)' }}>
              Terminate Process?
            </DialogTitle>
            <DialogDescription className="text-sm font-body mt-2" style={{ color: 'var(--on-surface-muted)' }}>
              You are about to send SIGTERM to <strong>{killTarget?.name}</strong> (PID {killTarget?.pid}).
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setKillTarget(null)}
              className="flex-1 py-2.5 rounded-full text-sm font-body font-medium transition-colors"
              style={{ background: 'var(--surface-highest)', color: 'var(--on-surface-muted)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleKillConfirm}
              className="flex-1 py-2.5 rounded-full text-sm font-body font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #ba1a1a, #e05252)' }}
            >
              Kill Process
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Process Detail Dialog */}
      <Dialog open={!!detailProcess} onOpenChange={() => setDetailProcess(null)}>
        <DialogContent
          className="rounded-[1.25rem] border-none max-w-[680px]"
          style={{ background: 'var(--surface-lowest)', boxShadow: 'var(--shadow-modal)' }}
        >
          {detailProcess && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-mono font-semibold text-sm"
                    style={{ background: `var(--primary)` }}
                  >
                    {detailProcess.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <DialogTitle className="font-headline font-semibold text-lg" style={{ color: 'var(--on-surface)' }}>
                      {detailProcess.name}
                    </DialogTitle>
                    <span className="text-xs font-mono" style={{ color: 'var(--on-surface-faint)' }}>
                      PID: {detailProcess.pid}
                    </span>
                  </div>
                </div>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="rounded-xl p-4" style={{ background: 'var(--surface-low)' }}>
                  <div className="text-[10px] font-body uppercase tracking-wide mb-2" style={{ color: 'var(--on-surface-faint)' }}>Details</div>
                  <div className="space-y-2 text-sm font-body" style={{ color: 'var(--on-surface)' }}>
                    <div>User: <span className="font-mono">{detailProcess.user}</span></div>
                    <div>Priority: <span className="font-mono">{detailProcess.priority}</span></div>
                    <div>Threads: <span className="font-mono">{detailProcess.threads}</span></div>
                    <div>Open Files: <span className="font-mono">{detailProcess.openFiles}</span></div>
                    <div>I/O Read: <span className="font-mono">{detailProcess.ioReadKBs.toFixed(1)} KB/s</span></div>
                    <div>I/O Write: <span className="font-mono">{detailProcess.ioWriteKBs.toFixed(1)} KB/s</span></div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <CircularGauge value={detailProcess.cpu} size={120} label="CPU" />
                  <div className="text-sm font-body mt-3" style={{ color: 'var(--on-surface-muted)' }}>
                    Memory: {detailProcess.memoryMB.toFixed(0)} MB ({detailProcess.memory.toFixed(1)}%)
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
