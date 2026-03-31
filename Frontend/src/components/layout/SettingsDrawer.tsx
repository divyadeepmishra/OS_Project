'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { Settings } from '@/types';
import { REFRESH_RATES } from '@/lib/utils';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (partial: Partial<Settings>) => void;
}

/** Right slide-in settings panel */
export default function SettingsDrawer({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: SettingsDrawerProps) {
  if (!isOpen) return null;

  const refreshLabels: Record<number, string> = {
    500: '500ms',
    1000: '1s',
    2000: '2s',
    5000: '5s',
    0: 'Paused',
  };

  const densityOptions: Settings['density'][] = ['comfortable', 'compact', 'cozy'];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/10" onClick={onClose} />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-[70] w-[400px] flex flex-col animate-slide-right overflow-y-auto"
        style={{
          background: 'var(--surface-lowest)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="font-headline font-semibold text-lg" style={{ color: 'var(--on-surface)' }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--surface-high)] transition-colors"
            style={{ color: 'var(--on-surface-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* MONITORING Section */}
        <div className="px-6 py-4" style={{ background: 'var(--surface-low)' }}>
          <h3
            className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mb-4"
            style={{ color: 'var(--on-surface-faint)' }}
          >
            MONITORING
          </h3>

          {/* Refresh Interval */}
          <div className="mb-5">
            <label className="text-sm font-body font-medium block mb-2" style={{ color: 'var(--on-surface)' }}>
              Refresh Interval
            </label>
            <div className="flex gap-2">
              {REFRESH_RATES.map(rate => (
                <button
                  key={rate}
                  onClick={() => onUpdateSettings({ refreshRateMs: rate })}
                  className="px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all"
                  style={
                    settings.refreshRateMs === rate
                      ? { background: 'var(--gradient-primary)', color: 'white' }
                      : { background: 'var(--surface-highest)', color: 'var(--on-surface-muted)' }
                  }
                >
                  {refreshLabels[rate]}
                </button>
              ))}
            </div>
          </div>

          {/* CPU Threshold */}
          <div className="mb-5">
            <label className="text-sm font-body font-medium block mb-2" style={{ color: 'var(--on-surface)' }}>
              CPU Threshold — {settings.cpuThreshold}%
            </label>
            <input
              type="range"
              min={50}
              max={95}
              value={settings.cpuThreshold}
              onChange={e => onUpdateSettings({ cpuThreshold: Number(e.target.value) })}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ background: 'var(--surface-high)', accentColor: 'var(--primary)' }}
            />
          </div>

          {/* Memory Threshold */}
          <div>
            <label className="text-sm font-body font-medium block mb-2" style={{ color: 'var(--on-surface)' }}>
              Memory Threshold — {settings.memThreshold}%
            </label>
            <input
              type="range"
              min={50}
              max={95}
              value={settings.memThreshold}
              onChange={e => onUpdateSettings({ memThreshold: Number(e.target.value) })}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ background: 'var(--surface-high)', accentColor: 'var(--primary)' }}
            />
          </div>
        </div>

        {/* DISPLAY Section */}
        <div className="px-6 py-4">
          <h3
            className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mb-4"
            style={{ color: 'var(--on-surface-faint)' }}
          >
            DISPLAY
          </h3>
          <div className="mb-4">
            <label className="text-sm font-body font-medium block mb-2" style={{ color: 'var(--on-surface)' }}>
              Density
            </label>
            <div className="flex gap-2">
              {densityOptions.map(d => (
                <button
                  key={d}
                  onClick={() => onUpdateSettings({ density: d })}
                  className="px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all capitalize"
                  style={
                    settings.density === d
                      ? { background: 'var(--gradient-primary)', color: 'white' }
                      : { background: 'var(--surface-highest)', color: 'var(--on-surface-muted)' }
                  }
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ALERTS Section */}
        <div className="px-6 py-4" style={{ background: 'var(--surface-low)' }}>
          <h3
            className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mb-4"
            style={{ color: 'var(--on-surface-faint)' }}
          >
            ALERTS
          </h3>
          {[
            { key: 'showCpuAlerts' as const, label: 'CPU Alerts' },
            { key: 'showMemAlerts' as const, label: 'Memory Alerts' },
            { key: 'showProcessAlerts' as const, label: 'Process Alerts' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-sm font-body" style={{ color: 'var(--on-surface)' }}>
                {label}
              </span>
              <button
                onClick={() => onUpdateSettings({ [key]: !settings[key] })}
                className="w-10 h-5 rounded-full transition-all relative"
                style={{
                  background: settings[key] ? 'var(--gradient-primary)' : 'var(--surface-highest)',
                }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                  style={{ left: settings[key] ? '22px' : '2px' }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Save button */}
        <div className="px-6 py-5 mt-auto">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full text-sm font-body font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--gradient-primary)' }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
}
