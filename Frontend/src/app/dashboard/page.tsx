'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { useAppContext } from '@/components/layout/AppShell';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import GlassCard from '@/components/ui/GlassCard';
import CircularGauge from '@/components/ui/CircularGauge';
import StatusChip from '@/components/ui/StatusChip';
import { getProcessColour, getProcessInitials } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

/** Dashboard / Overview page — "System Intelligence" layout */
export default function DashboardPage() {
  const { processes, systemMetrics } = useAppContext();
  const { memoryPercent } = useSystemMetrics(systemMetrics);

  const topProcesses = [...processes]
    .filter(p => p.status === 'running')
    .sort((a, b) => b.cpu - a.cpu)
    .slice(0, 5);

  const networkBarData = systemMetrics.networkDownHistory.slice(-12).map((d, i) => ({
    label: `${i}`,
    incoming: Math.round(d),
    outgoing: Math.round(systemMetrics.networkUpHistory.slice(-12)[i] || 0),
  }));

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <div
          className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mb-2 px-3 py-1 rounded-full inline-block"
          style={{ color: 'var(--primary)', background: 'rgba(160,55,59,0.08)' }}
        >
          TELEMETRY LIVE FEED
        </div>
        <h1 className="font-headline font-extrabold text-5xl -tracking-tight mb-2">
          <span style={{ color: 'var(--on-surface)' }}>System </span>
          <span style={{ color: 'var(--primary)' }} className="italic">Intelligence</span>
        </h1>
        <p className="text-sm font-body" style={{ color: 'var(--on-surface-muted)' }}>
          Real-time process monitoring with refractive telemetry analysis.
        </p>
      </div>

      {/* Row 1: CPU Gauge + Memory Dark Card */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        {/* CPU Gauge Card (60%) */}
        <GlassCard className="lg:col-span-3 flex flex-col items-center justify-center">
          <div className="w-full flex items-start justify-between mb-4">
            <div>
              <div
                className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mb-1"
                style={{ color: 'var(--on-surface-faint)' }}
              >
                NEURAL LOAD
              </div>
              <div className="font-headline font-semibold text-xl" style={{ color: 'var(--on-surface)' }}>
                Processor Intensity
              </div>
            </div>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Zap size={18} color="white" />
            </div>
          </div>
          <CircularGauge value={systemMetrics.cpuPercent} size={180} label="UTILIZATION" />
          <div className="w-full mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl px-4 py-3" style={{ background: 'var(--surface-low)' }}>
              <div className="text-[10px] font-body tracking-wide uppercase mb-1" style={{ color: 'var(--on-surface-faint)' }}>
                System Stability
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--surface-high)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${100 - systemMetrics.cpuPercent}%`,
                      background: 'var(--gradient-primary)',
                    }}
                  />
                </div>
                <span className="text-xs font-body font-semibold" style={{ color: 'var(--primary)' }}>
                  {systemMetrics.cpuPercent < 50 ? 'High' : systemMetrics.cpuPercent < 80 ? 'Medium' : 'Low'}
                </span>
              </div>
            </div>
            <div className="rounded-xl px-4 py-3" style={{ background: 'var(--surface-low)' }}>
              <div className="text-[10px] font-body tracking-wide uppercase mb-1" style={{ color: 'var(--on-surface-faint)' }}>
                Load Average
              </div>
              <div className="text-sm font-mono" style={{ color: 'var(--on-surface)' }}>
                {systemMetrics.loadAverage.map(l => l.toFixed(2)).join(' · ')}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Memory Dark Card (40%) */}
        <GlassCard variant="dark" className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mb-1" style={{ color: 'var(--on-surface-dark-muted)' }}>
              MEMORY MATRIX
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-headline font-extrabold text-4xl" style={{ color: 'var(--on-surface-dark)' }}>
                {systemMetrics.memoryUsedGB.toFixed(1)}
              </span>
              <span className="text-sm font-body" style={{ color: 'var(--on-surface-dark-muted)' }}>
                GB Used
              </span>
            </div>
            <p className="text-xs font-body" style={{ color: 'var(--on-surface-dark-muted)' }}>
              of {systemMetrics.memoryTotalGB.toFixed(1)} GB Total Architecture
            </p>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${memoryPercent}%`,
                  background: 'rgba(255,255,255,0.5)',
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] font-mono" style={{ color: 'var(--on-surface-dark-muted)' }}>
                {memoryPercent.toFixed(1)}%
              </span>
              <span className="text-[10px] font-mono" style={{ color: 'var(--on-surface-dark-muted)' }}>
                {systemMetrics.memoryFreeGB.toFixed(1)} GB free
              </span>
            </div>
          </div>
          {/* Flush button */}
          <button
            className="mt-4 px-4 py-1.5 rounded-full text-xs font-body font-medium border transition-opacity hover:opacity-80"
            style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--on-surface-dark)' }}
          >
            Flush Memory
          </button>
        </GlassCard>
      </div>

      {/* Row 2: Network + Process Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        {/* Network Flow */}
        <GlassCard className="lg:col-span-2">
          <div className="font-headline font-semibold text-base mb-1" style={{ color: 'var(--on-surface)' }}>
            Network Flow
          </div>
          <div className="text-xs font-body mb-4" style={{ color: 'var(--on-surface-faint)' }}>
            Last 12 readings
          </div>

          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={networkBarData} barSize={12} barGap={2}>
                <XAxis dataKey="label" tick={false} axisLine={false} tickLine={false} />
                <YAxis tick={false} axisLine={false} tickLine={false} width={0} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    boxShadow: 'var(--shadow-card)',
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="incoming" fill="#7a1e24" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outgoing" fill="#ffc3c2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-6 mt-3">
            <div>
              <span className="text-[10px] font-body uppercase tracking-wide mr-2" style={{ color: 'var(--on-surface-faint)' }}>INCOMING</span>
              <span className="text-sm font-mono font-semibold" style={{ color: 'var(--on-surface)' }}>{systemMetrics.networkDownKBs} KB/s</span>
            </div>
            <div>
              <span className="text-[10px] font-body uppercase tracking-wide mr-2" style={{ color: 'var(--on-surface-faint)' }}>OUTGOING</span>
              <span className="text-sm font-mono font-semibold" style={{ color: 'var(--on-surface)' }}>{systemMetrics.networkUpKBs} KB/s</span>
            </div>
          </div>
        </GlassCard>

        {/* Live Process Nodes */}
        <GlassCard className="lg:col-span-3">
          <div className="font-headline font-semibold text-base mb-1" style={{ color: 'var(--on-surface)' }}>
            Live Process Nodes
          </div>
          <div className="text-xs font-body mb-4" style={{ color: 'var(--on-surface-faint)' }}>
            Top {topProcesses.length} by CPU usage
          </div>

          <div className="space-y-2.5">
            {topProcesses.map(p => (
              <div
                key={p.pid}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
                style={{ background: 'var(--surface-low)' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-mono font-semibold flex-shrink-0"
                  style={{ background: getProcessColour(p.pid) }}
                >
                  {getProcessInitials(p.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-body font-semibold truncate" style={{ color: 'var(--on-surface)' }}>
                    {p.name}
                  </div>
                  <div className="text-[10px] font-body" style={{ color: 'var(--on-surface-faint)' }}>
                    Cluster · {p.threads} threads
                  </div>
                </div>
                <StatusChip status={p.status} />
                <span className="text-xs font-mono" style={{ color: 'var(--primary)' }}>
                  {p.cpu.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Row 3: Status bar */}
      <div
        className="rounded-[1.25rem] px-6 py-4 flex items-center justify-between"
        style={{ background: 'var(--surface-lowest)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--success)' }} />
          <span className="text-sm font-body" style={{ color: 'var(--on-surface)' }}>
            All Systems Nominal.
          </span>
          <span className="text-xs font-body" style={{ color: 'var(--on-surface-faint)' }}>
            Last integrity check 2 min ago.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-1.5 rounded-full text-xs font-body font-medium transition-colors"
            style={{ background: 'var(--surface-highest)', color: 'var(--on-surface-muted)' }}
          >
            Download Logs
          </button>
          <button
            className="px-4 py-1.5 rounded-full text-xs font-body font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--gradient-primary)' }}
          >
            Initiate Full Sync
          </button>
        </div>
      </div>
    </div>
  );
}
