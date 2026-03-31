'use client';

import React, { useState } from 'react';
import { Zap, Download, Maximize2 } from 'lucide-react';
import { useAppContext } from '@/components/layout/AppShell';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import GlassCard from '@/components/ui/GlassCard';
import CircularGauge from '@/components/ui/CircularGauge';
import CPULineChart from '@/components/charts/CPULineChart';

export default function CpuPage() {
  const { systemMetrics, settings, togglePause, isRunning } = useAppContext();
  const { cpuChartData, coreChartData } = useSystemMetrics(systemMetrics);
  const [showPerCore, setShowPerCore] = useState(true);

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-headline font-extrabold text-5xl -tracking-tight mb-2">
          <span style={{ color: 'var(--on-surface)' }}>Processor </span>
          <span style={{ color: 'var(--primary)' }} className="italic">Intelligence</span>
        </h1>
        <p className="text-sm font-body" style={{ color: 'var(--on-surface-muted)' }}>
          Deep-dive analysis of neural load and thread distribution.
        </p>
      </div>

      {/* Main Gauge Card */}
      <GlassCard className="mb-6 flex flex-col md:flex-row items-center justify-between p-8">
        <div className="flex items-center gap-8 mb-6 md:mb-0">
          <CircularGauge
            value={systemMetrics.cpuPercent}
            size={200}
            label="UTILIZATION"
            strokeWidth={14}
            variant={systemMetrics.cpuPercent > settings.cpuThreshold ? 'dark' : 'light'}
          />
          <div>
            <div
              className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mb-1 px-3 py-1 rounded-full inline-block"
              style={{ color: 'var(--primary)', background: 'rgba(160,55,59,0.08)' }}
            >
              NEURAL LOAD
            </div>
            <div className="font-headline font-semibold text-2xl mt-2" style={{ color: 'var(--on-surface)' }}>
              Processor Intensity
            </div>
            <p className="text-sm font-body mt-2 max-w-[280px]" style={{ color: 'var(--on-surface-muted)' }}>
              Overall system execution threshold is currently operating within expected parameters.
            </p>
          </div>
        </div>

        {/* Metrics right side */}
        <div className="w-full md:w-auto md:min-w-[280px] space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-body uppercase tracking-wide" style={{ color: 'var(--on-surface-faint)' }}>System Stability</span>
              <span className="text-sm font-body font-semibold" style={{ color: 'var(--primary)' }}>High</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--surface-high)]">
              <div className="h-full bg-[var(--primary)] rounded-full w-[85%]" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-body uppercase tracking-wide" style={{ color: 'var(--on-surface-faint)' }}>Node Velocity</span>
              <span className="text-sm font-body font-semibold" style={{ color: 'var(--on-surface)' }}>2.4 TB/s</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--surface-high)]">
              <div className="h-full rounded-full w-[45%]" style={{ background: 'var(--gradient-hero)' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-body uppercase tracking-wide" style={{ color: 'var(--on-surface-faint)' }}>Thermal Limit</span>
              <span className="text-sm font-body font-semibold flex items-center gap-1" style={{ color: 'var(--warning)' }}>
                68°C
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--surface-high)]">
              <div className="h-full bg-[var(--warning)] rounded-full w-[68%]" />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Live Chart */}
      <GlassCard className="mb-6 p-0 overflow-hidden">
        <div className="p-5 border-b flex flex-wrap items-center justify-between" style={{ borderColor: 'var(--surface-high)' }}>
          <div className="flex items-center gap-3">
            <Zap size={20} style={{ color: 'var(--primary)' }} />
            <h2 className="font-headline font-medium text-lg" style={{ color: 'var(--on-surface)' }}>Live Telemetry</h2>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button
              onClick={togglePause}
              className="px-4 py-1.5 rounded-full text-xs font-body font-medium transition-colors hover:bg-[var(--surface-high)]"
              style={{ color: 'var(--on-surface-muted)' }}
            >
              {isRunning ? 'Pause Data' : 'Resume Data'}
            </button>
            <div className="flex bg-[var(--surface-low)] rounded-full p-1 mx-2">
              {['1m', '5m', '15m'].map((t, i) => (
                <button
                  key={t}
                  className="px-3 py-1 rounded-full text-[10px] font-body font-medium transition-all"
                  style={i === 0 ? { background: 'white', color: 'var(--on-surface)', boxShadow: 'var(--shadow-card)' } : { color: 'var(--on-surface-muted)' }}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPerCore(!showPerCore)}
              className="p-2 rounded-full transition-colors hover:bg-[var(--surface-high)]"
              style={{ color: showPerCore ? 'var(--primary)' : 'var(--on-surface-muted)' }}
              title="Toggle Per-Core View"
            >
              <Maximize2 size={16} />
            </button>
            <button
              className="p-2 rounded-full transition-colors hover:bg-[var(--surface-high)]"
              style={{ color: 'var(--on-surface-muted)' }}
              title="Export PNG"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
        <div className="px-2 pt-6 pb-2">
          <CPULineChart data={cpuChartData} threshold={settings.cpuThreshold} height={260} />
        </div>
      </GlassCard>

      {/* Per-Core Grid */}
      {showPerCore && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up">
          {coreChartData.map((core) => (
            <GlassCard key={core.core} className="flex flex-col items-center justify-center py-6">
              <CircularGauge value={core.value} size={84} strokeWidth={6} label="" showValue={false} />
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-headline font-semibold text-lg" style={{ color: 'var(--on-surface)' }}>
                  {core.value.toFixed(0)}%
                </span>
              </div>
              <div className="text-[10px] font-body uppercase tracking-wide mt-3" style={{ color: 'var(--on-surface-faint)' }}>
                {core.core}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
