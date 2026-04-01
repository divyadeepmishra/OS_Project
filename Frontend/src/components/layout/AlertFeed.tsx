'use client';

import React from 'react';
import { X, AlertTriangle, Info, XCircle, CheckCircle2 } from 'lucide-react';
import type { Alert, AlertSeverity } from '@/types';
import { relativeTime, cn } from '@/lib/utils';

interface AlertFeedProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

const SEVERITY_STYLES: Record<AlertSeverity, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  info: { icon: Info, color: 'var(--info)', bg: 'var(--info-bg)', border: '#1a4d7a' },
  warning: { icon: AlertTriangle, color: 'var(--warning)', bg: 'var(--warning-bg)', border: '#7d5700' },
  critical: { icon: AlertTriangle, color: 'var(--error)', bg: 'var(--error-bg)', border: '#ba1a1a' },
  error: { icon: XCircle, color: 'var(--error)', bg: 'var(--error-bg)', border: '#ba1a1a' },
};

// Slide-in alert panel from the right 
export default function AlertFeed({
  isOpen,
  onClose,
  alerts,
  onAcknowledge,
  onDismiss,
  onClearAll,
}: AlertFeedProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/10"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-[70] w-[360px] flex flex-col animate-slide-right"
        style={{
          background: 'var(--surface-lowest)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--surface-high)]">
          <div className="flex items-center gap-2">
            <h2 className="font-headline font-semibold text-lg" style={{ color: 'var(--on-surface)' }}>
              Alerts
            </h2>
            {alerts.length > 0 && (
              <span
                className="min-w-[22px] h-[22px] flex items-center justify-center rounded-full text-[11px] font-body font-semibold text-white"
                style={{ background: 'var(--primary)' }}
              >
                {alerts.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {alerts.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs font-body font-medium px-3 py-1 rounded-full transition-colors"
                style={{ color: 'var(--primary)', background: 'rgba(160,55,59,0.08)' }}
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[var(--surface-high)] transition-colors"
              style={{ color: 'var(--on-surface-muted)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Alert list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 size={40} style={{ color: 'var(--success)' }} className="mb-3 opacity-50" />
              <p className="text-sm font-body" style={{ color: 'var(--on-surface-muted)' }}>
                No active alerts
              </p>
              <p className="text-xs font-body mt-1" style={{ color: 'var(--on-surface-faint)' }}>
                System is operating normally
              </p>
            </div>
          ) : (
            alerts.map(alert => {
              const style = SEVERITY_STYLES[alert.severity];
              const Icon = style.icon;
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'group relative rounded-xl p-3 transition-all duration-200',
                    alert.acknowledged && 'opacity-60'
                  )}
                  style={{
                    background: 'var(--surface-lowest)',
                    boxShadow: '0 1px 4px rgba(46,36,36,0.04)',
                    borderLeft: `3px solid ${style.border}`,
                  }}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: style.bg }}
                    >
                      <Icon size={16} style={{ color: style.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-body font-semibold text-sm" style={{ color: 'var(--on-surface)' }}>
                        {alert.title}
                      </div>
                      <p className="text-xs font-body mt-0.5 leading-relaxed" style={{ color: 'var(--on-surface-muted)' }}>
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono" style={{ color: 'var(--on-surface-faint)' }}>
                          {relativeTime(alert.timestamp)}
                        </span>
                        <div className="flex-1" />
                        {!alert.acknowledged && (
                          <button
                            onClick={() => onAcknowledge(alert.id)}
                            className="text-[10px] font-body font-medium px-2 py-0.5 rounded-full transition-colors"
                            style={{ color: 'var(--primary)', background: 'rgba(160,55,59,0.08)' }}
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => onDismiss(alert.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-[var(--surface-high)]"
                          style={{ color: 'var(--on-surface-faint)' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
