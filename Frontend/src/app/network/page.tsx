'use client';

import React from 'react';
import { Activity, ShieldCheck, Wifi } from 'lucide-react';
import { useAppContext } from '@/components/layout/AppShell';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import GlassCard from '@/components/ui/GlassCard';
import NetworkSparklines from '@/components/charts/NetworkSparklines';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { generateId } from '@/lib/utils';

export default function NetworkPage() {
  const { systemMetrics } = useAppContext();
  const { networkUpChartData, networkDownChartData } = useSystemMetrics(systemMetrics);

  const networkBarData = systemMetrics.networkDownHistory.slice(-20).map((d, i) => ({
    label: `T-${20 - i}`,
    incoming: Math.round(d),
    outgoing: Math.round(systemMetrics.networkUpHistory.slice(-20)[i] || 0),
  }));

  // Dummy connections for display
  const activeConnections = Array.from({ length: 6 }).map((_, i) => ({
    id: generateId(),
    ip: `192.168.1.${10 + i * 15}`,
    protocol: ['TCP', 'UDP', 'HTTPS'][Math.floor(Math.random() * 3)],
    state: ['ESTABLISHED', 'LISTEN', 'TIME_WAIT'][Math.floor(Math.random() * 3)],
    rx: Math.floor(Math.random() * 5000),
    tx: Math.floor(Math.random() * 2000),
  }));

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-headline font-extrabold text-5xl -tracking-tight mb-2">
          <span style={{ color: 'var(--on-surface)' }}>Network </span>
          <span style={{ color: 'var(--primary)' }} className="italic">Flow</span>
        </h1>
        <p className="text-sm font-body" style={{ color: 'var(--on-surface-muted)' }}>
          I/O stream metrics and protocol analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Flow Chart */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
             <div>
               <h2 className="font-headline font-semibold text-xl" style={{ color: 'var(--on-surface)' }}>Traffic Volume</h2>
               <div className="text-[10px] font-body uppercase tracking-wide mt-1" style={{ color: 'var(--on-surface-faint)' }}>Last 20s Window</div>
             </div>
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <span className="w-2.5 h-2.5 rounded-[3px] bg-[#7a1e24]" />
                 <span className="text-xs font-body font-medium" style={{ color: 'var(--on-surface-muted)' }}>Incoming</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="w-2.5 h-2.5 rounded-[3px] bg-[#ffc3c2]" />
                 <span className="text-xs font-body font-medium" style={{ color: 'var(--on-surface-muted)' }}>Outgoing</span>
               </div>
             </div>
          </div>

          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={networkBarData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--on-surface-faint)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--on-surface-faint)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'var(--surface-high)', opacity: 0.4 }}
                  contentStyle={{
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(12px)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    boxShadow: 'var(--shadow-card)',
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                <Bar dataKey="incoming" fill="#7a1e24" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outgoing" fill="#ffc3c2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Info Column */}
        <div className="space-y-6">
           {/* Sparklines */}
           <GlassCard>
             <div className="font-headline font-semibold text-base mb-4 flex gap-2 items-center" style={{ color: 'var(--on-surface)' }}>
               <Activity size={18} style={{ color: 'var(--primary)' }} />
               Live Streams
             </div>
             <NetworkSparklines
               uploadData={networkUpChartData}
               downloadData={networkDownChartData}
               uploadKBs={systemMetrics.networkUpKBs}
               downloadKBs={systemMetrics.networkDownKBs}
             />
           </GlassCard>

           {/* Security Info */}
           <GlassCard className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--success-bg)]">
                <ShieldCheck size={24} style={{ color: 'var(--success)' }} />
              </div>
              <div>
                <div className="text-sm font-body font-semibold" style={{ color: 'var(--on-surface)' }}>Firewall Integrity</div>
                <div className="text-xs font-body mt-1" style={{ color: 'var(--success)' }}>Optimal · 0 dropped</div>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* Connection Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-5 border-b flex items-center gap-3" style={{ borderColor: 'var(--surface-high)' }}>
          <Wifi size={18} style={{ color: 'var(--primary)' }} />
          <h2 className="font-headline font-medium text-lg" style={{ color: 'var(--on-surface)' }}>Active Sockets</h2>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--surface-low)' }}>
                <th className="font-body font-semibold text-[10px] uppercase tracking-wider px-5 py-3" style={{ color: 'var(--on-surface-muted)' }}>Protocol</th>
                <th className="font-body font-semibold text-[10px] uppercase tracking-wider px-5 py-3" style={{ color: 'var(--on-surface-muted)' }}>Local Address</th>
                <th className="font-body font-semibold text-[10px] uppercase tracking-wider px-5 py-3" style={{ color: 'var(--on-surface-muted)' }}>State</th>
                <th className="font-body font-semibold text-[10px] uppercase tracking-wider px-5 py-3 text-right" style={{ color: 'var(--on-surface-muted)' }}>RX Bytes</th>
                <th className="font-body font-semibold text-[10px] uppercase tracking-wider px-5 py-3 text-right" style={{ color: 'var(--on-surface-muted)' }}>TX Bytes</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--surface-low)' }}>
              {activeConnections.map(conn => (
                <tr key={conn.id} className="transition-colors hover:bg-[var(--surface-lowest)]">
                  <td className="px-5 py-3 text-xs font-mono font-medium" style={{ color: 'var(--primary)' }}>{conn.protocol}</td>
                  <td className="px-5 py-3 text-xs font-mono" style={{ color: 'var(--on-surface)' }}>{conn.ip}:*</td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded-sm text-[10px] font-mono"
                      style={{
                        background: conn.state === 'ESTABLISHED' ? 'var(--success-bg)' : 'var(--surface-high)',
                        color: conn.state === 'ESTABLISHED' ? 'var(--success)' : 'var(--on-surface-muted)',
                      }}
                    >
                      {conn.state}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs font-mono text-right" style={{ color: 'var(--on-surface-muted)' }}>{conn.rx}</td>
                  <td className="px-5 py-3 text-xs font-mono text-right" style={{ color: 'var(--on-surface-muted)' }}>{conn.tx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
