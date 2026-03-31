'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIBadge {
  text: string;
  variant: 'up' | 'down' | 'stable';
}

interface KPICardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  badge?: KPIBadge;
  variant?: 'light' | 'dark';
  children?: React.ReactNode;
  className?: string;
}

const BADGE_STYLES: Record<string, { color: string; prefix: string }> = {
  up: { color: 'var(--success)', prefix: '↑ ' },
  down: { color: 'var(--error)', prefix: '↓ ' },
  stable: { color: 'var(--success)', prefix: '' },
};

/** Stat card with icon, animated number, optional badge, and sparkline slot */
export default function KPICard({
  icon: Icon,
  value,
  label,
  badge,
  variant = 'light',
  children,
  className,
}: KPICardProps) {
  const isDark = variant === 'dark';
  const [displayed, setDisplayed] = useState(value);
  const prevVal = useRef(value);

  // Count-up animation for numeric values
  useEffect(() => {
    if (typeof value !== 'number' || typeof prevVal.current !== 'number') {
      setDisplayed(value);
      prevVal.current = value;
      return;
    }
    const start = prevVal.current as number;
    const end = value;
    const duration = 400;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = start + (end - start) * eased;
      setDisplayed(Math.round(current * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    prevVal.current = value;
  }, [value]);

  return (
    <div
      className={cn(
        'rounded-[1.25rem] p-6 relative overflow-hidden',
        isDark ? 'dark-rose-card' : '',
        className
      )}
      style={
        !isDark
          ? {
              background: 'var(--surface-lowest)',
              boxShadow: 'var(--shadow-card)',
            }
          : undefined
      }
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4">
          <span
            className="text-xs font-body font-medium px-2 py-0.5 rounded-full"
            style={{
              color: BADGE_STYLES[badge.variant].color,
              background: badge.variant === 'up'
                ? 'var(--success-bg)'
                : badge.variant === 'down'
                ? 'var(--error-bg)'
                : 'var(--success-bg)',
            }}
          >
            {BADGE_STYLES[badge.variant].prefix}{badge.text}
          </span>
        </div>
      )}

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{
          background: isDark ? 'rgba(255,255,255,0.15)' : 'var(--gradient-primary)',
        }}
      >
        <Icon size={20} color={isDark ? 'var(--on-surface-dark)' : 'white'} />
      </div>

      {/* Value */}
      <div
        className="text-4xl font-headline font-extrabold -tracking-tight mb-1"
        style={{ color: isDark ? 'var(--on-surface-dark)' : 'var(--on-surface)' }}
      >
        {typeof displayed === 'number' ? displayed.toFixed(1) : displayed}
      </div>

      {/* Label */}
      <div
        className="text-[10px] font-body font-medium tracking-[0.1em] uppercase"
        style={{ color: isDark ? 'var(--on-surface-dark-muted)' : 'var(--on-surface-faint)' }}
      >
        {label}
      </div>

      {/* Sparkline / extra content slot */}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
