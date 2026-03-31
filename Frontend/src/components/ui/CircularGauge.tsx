'use client';

import React from 'react';

interface CircularGaugeProps {
  value: number; // 0–100
  size?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'light' | 'dark';
  strokeWidth?: number;
}

/** SVG ring gauge with animated arc — primary gradient fill, configurable size */
export default function CircularGauge({
  value,
  size = 160,
  label,
  showValue = true,
  variant = 'light',
  strokeWidth = 10,
}: CircularGaugeProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;
  const center = size / 2;

  const isDark = variant === 'dark';
  const trackColor = isDark ? 'rgba(255,255,255,0.12)' : 'var(--surface-high)';
  const valueColor = isDark ? 'var(--on-surface-dark)' : 'var(--on-surface)';
  const labelColor = isDark ? 'var(--on-surface-dark-muted)' : 'var(--on-surface-faint)';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={`gauge-grad-${size}-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a0373b" />
            <stop offset="100%" stopColor="#ff7f7f" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Filled arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#gauge-grad-${size}-${variant})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>

      {/* Center text */}
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-headline font-extrabold -tracking-tight"
            style={{ color: valueColor, fontSize: size * 0.22 }}
          >
            {Math.round(clampedValue)}
          </span>
          {label && (
            <span
              className="text-[10px] font-body font-medium tracking-[0.1em] uppercase mt-0.5"
              style={{ color: labelColor }}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
