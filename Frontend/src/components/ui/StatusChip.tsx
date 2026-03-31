'use client';

import React from 'react';
import type { ProcessStatus } from '@/types';
import { cn, getStatusLabel } from '@/lib/utils';

interface StatusChipProps {
  status: ProcessStatus;
  className?: string;
}

const STATUS_STYLES: Record<ProcessStatus, { bg: string; color: string; showDot: boolean }> = {
  running: {
    bg: 'rgba(26,107,58,0.12)',
    color: 'var(--success)',
    showDot: true,
  },
  sleeping: {
    bg: 'var(--surface-high)',
    color: 'var(--on-surface-muted)',
    showDot: false,
  },
  stopped: {
    bg: 'rgba(125,87,0,0.12)',
    color: 'var(--warning)',
    showDot: false,
  },
  zombie: {
    bg: 'rgba(186,26,26,0.12)',
    color: 'var(--error)',
    showDot: false,
  },
  uninterruptible: {
    bg: 'rgba(160,55,59,0.15)',
    color: 'var(--primary)',
    showDot: false,
  },
};

/** Status chip — UPPERCASE, pill-shaped, with optional animated pulse dot */
export default function StatusChip({ status, className }: StatusChipProps) {
  const style = STATUS_STYLES[status];
  const label = getStatusLabel(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full',
        'text-[10px] font-body font-medium tracking-[0.05em] uppercase',
        className
      )}
      style={{ background: style.bg, color: style.color }}
    >
      {style.showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
          style={{ background: style.color }}
        />
      )}
      {label}
    </span>
  );
}
