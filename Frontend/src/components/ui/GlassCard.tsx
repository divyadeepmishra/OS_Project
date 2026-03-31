'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'ghost';
  style?: React.CSSProperties;
}

/** Reusable glass card wrapper with light/dark/ghost variants */
export default function GlassCard({ children, className, variant = 'light', style }: GlassCardProps) {
  const variantClasses: Record<string, string> = {
    light: 'glass-card',
    dark: 'dark-rose-card',
    ghost: 'glass-card-ghost',
  };

  return (
    <div
      className={cn(variantClasses[variant], 'p-6', className)}
      style={style}
    >
      {children}
    </div>
  );
}
