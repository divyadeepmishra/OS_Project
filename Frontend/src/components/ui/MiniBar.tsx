'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MiniBarProps {
  value: number; // 0–100
  maxWidth?: number;
  className?: string;
}

/** Inline CPU/MEM progress bar — 4px height, gradient fill based on severity */
export default function MiniBar({ value, maxWidth = 120, className }: MiniBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  let gradient: string;
  if (clampedValue > 70) {
    gradient = 'var(--gradient-primary)';
  } else if (clampedValue > 40) {
    gradient = 'linear-gradient(90deg, #c9484e, #ff7f7f)';
  } else {
    gradient = 'linear-gradient(90deg, #b87878, #ffc3c2)';
  }

  return (
    <div className={cn('mini-bar-track', className)} style={{ maxWidth }}>
      <div
        className="mini-bar-fill"
        style={{
          width: `${clampedValue}%`,
          background: gradient,
        }}
      />
    </div>
  );
}
