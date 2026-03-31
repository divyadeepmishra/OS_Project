'use client';

import React from 'react';
import { Database, LayoutGrid, HardDrive } from 'lucide-react';
import { useAppContext } from '@/components/layout/AppShell';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import GlassCard from '@/components/ui/GlassCard';
import KPICard from '@/components/ui/KPICard';
import MemoryDonut from '@/components/charts/MemoryDonut';
import { formatNumber } from '@/lib/utils';

export default function MemoryPage() {
  const { systemMetrics } = useAppContext();
  const { memoryPercent, swapPercent } = useSystemMetrics(systemMetrics);

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-headline font-extrabold text-5xl -tracking-tight mb-2">
          <span style={{ color: 'var(--on-surface)' }}>Memory </span>
          <span style={{ color: 'var(--primary)' }} className="italic">Matrix</span>
        </h1>
        <p className="text-sm font-body" style={{ color: 'var(--on-surface-muted)' }}>
          Volatile storage state and allocation telemetry.
        </p>
      </div>

      {/* Hero Dark Card */}
      <GlassCard variant="dark" className="mb-6 p-8 relative overflow-hidden">
        {/* Background decorative waves */}
        <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between relative z-10">
          <div>
            <div className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mb-2" style={{ color: 'var(--on-surface-dark-muted)' }}>
              PRIMARY POOL
            </div>
            <div className="font-headline font-extrabold text-5xl sm:text-7xl mb-1 -tracking-tight" style={{ color: 'var(--on-surface-dark)' }}>
              {systemMetrics.memoryUsedGB.toFixed(1)} <span className="text-2xl font-semibold opacity-80">GB Used</span>
            </div>
            <p className="text-sm font-body sm:text-base mt-2" style={{ color: 'var(--on-surface-dark-muted)' }}>
              of {systemMetrics.memoryTotalGB.toFixed(1)} GB Total Architecture
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex gap-3">
            <div className="flex -space-x-3 mr-4">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-[#7a1e24] flex items-center justify-center text-[10px] font-bold"
                  style={{ background: `rgba(255,255,255,0.${i}5)`, color: 'var(--on-surface-dark)' }}
                >
                  N{i}
                </div>
              ))}
            </div>
            <button
              className="px-6 py-2 rounded-full text-sm font-body font-semibold border-2 transition-all hover:bg-white hover:text-[var(--primary)]"
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'var(--on-surface-dark)' }}
            >
              Flush
            </button>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="mt-8 relative z-10">
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <div
              className="h-full rounded-full transition-all duration-500 relative"
              style={{
                width: `${memoryPercent}%`,
                background: 'rgba(255,255,255,0.8)',
                boxShadow: '0 0 10px rgba(255,255,255,0.5)'
              }}
            />
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <GlassCard className="lg:col-span-1 flex flex-col items-center justify-center py-8">
          <MemoryDonut
            usedGB={systemMetrics.memoryUsedGB}
            cachedGB={systemMetrics.memoryCachedGB}
            freeGB={systemMetrics.memoryFreeGB}
            size={220}
          />
          <div className="w-full mt-6 space-y-3 px-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 font-body font-medium" style={{ color: 'var(--on-surface)' }}>
                <span className="w-3 h-3 rounded-full bg-[var(--primary)]" />
                Active Used
              </div>
              <span className="font-mono">{systemMetrics.memoryUsedGB.toFixed(1)} GB</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 font-body font-medium" style={{ color: 'var(--on-surface)' }}>
                <span className="w-3 h-3 rounded-full bg-[var(--primary-container)]" />
                Cached / Buffers
              </div>
              <span className="font-mono">{systemMetrics.memoryCachedGB.toFixed(1)} GB</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 font-body font-medium" style={{ color: 'var(--on-surface)' }}>
                <span className="w-3 h-3 rounded-full bg-[var(--surface-high)]" />
                Free
              </div>
              <span className="font-mono">{systemMetrics.memoryFreeGB.toFixed(1)} GB</span>
            </div>
          </div>
        </GlassCard>

        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Swap Card */}
          <GlassCard className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-low)] flex items-center justify-center">
                <HardDrive size={20} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h3 className="font-headline font-semibold text-lg" style={{ color: 'var(--on-surface)' }}>Swap Space</h3>
                <p className="text-xs font-body" style={{ color: 'var(--on-surface-muted)' }}>Virtual memory allocation on disk</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-body uppercase tracking-wide" style={{ color: 'var(--on-surface-faint)' }}>Allocation</span>
                  <span className="text-sm font-mono font-medium" style={{ color: 'var(--on-surface)' }}>
                    {systemMetrics.swapUsedGB.toFixed(2)} / {systemMetrics.swapTotalGB.toFixed(0)} GB
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[var(--surface-low)] overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${swapPercent}%`,
                      background: swapPercent > 50 ? 'var(--warning)' : 'var(--gradient-primary)',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                 <div className="rounded-xl p-4" style={{ background: 'var(--surface-low)' }}>
                   <div className="text-[10px] font-body uppercase tracking-wide mb-1" style={{ color: 'var(--on-surface-faint)' }}>Swap In</div>
                   <div className="font-mono text-base" style={{ color: 'var(--on-surface)' }}>1.2 MB/s</div>
                 </div>
                 <div className="rounded-xl p-4" style={{ background: 'var(--surface-low)' }}>
                   <div className="text-[10px] font-body uppercase tracking-wide mb-1" style={{ color: 'var(--on-surface-faint)' }}>Swap Out</div>
                   <div className="font-mono text-base" style={{ color: 'var(--on-surface)' }}>0.1 MB/s</div>
                 </div>
              </div>
            </div>
          </GlassCard>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-6 flex-1">
             <KPICard
               icon={Database}
               value={formatNumber(Math.floor(systemMetrics.memoryCachedGB * 142))}
               label="DIRTY PAGES"
               badge={{ text: 'Low', variant: 'stable' }}
             />
             <KPICard
               icon={LayoutGrid}
               value="12"
               label="HUGE PAGES"
             />
          </div>
        </div>
      </div>
    </div>
  );
}
