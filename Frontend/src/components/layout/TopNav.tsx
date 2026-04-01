'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Settings, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOP_TABS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Monitors', href: '/cpu' },
  { label: 'Reports', href: '/network' },
];

interface TopNavProps {
  alertCount?: number;
  onSettingsClick?: () => void;
  onAlertClick?: () => void;
}

// Top navigation bar — frosted glass, 56px fixed, with logo, tabs, and actions
export default function TopNav({ alertCount = 0, onSettingsClick, onAlertClick }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 h-[64px] rounded-2xl border transition-all"
      style={{
        background: 'rgba(255, 255, 255, 0.35)',
        backdropFilter: 'blur(32px) saturate(200%)',
        WebkitBackdropFilter: 'blur(32px) saturate(200%)',
        borderColor: 'rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 32px rgba(160,55,59,0.08), inset 0 0 20px rgba(255,255,255,0.4)',
      }}
    >
      {/* Left — Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full"
          style={{ background: 'var(--gradient-primary)', opacity: 0.9 }}
        />
        <span className="font-headline font-extrabold text-xl">
          <span style={{ color: 'var(--on-surface)' }}>Neuro</span>
          <span style={{ color: 'var(--primary)' }}>Pulse</span>
        </span>
      </div>

      {/* Center — Navigation tabs */}
      <nav className="hidden md:flex items-center gap-6">
        {TOP_TABS.map(tab => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'text-sm font-body font-medium transition-colors duration-200 pb-1',
                isActive
                  ? 'border-b-2'
                  : 'hover:text-[var(--primary)]'
              )}
              style={
                isActive
                  ? { color: 'var(--primary)', borderColor: 'var(--primary)' }
                  : { color: 'var(--on-surface-muted)' }
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Right — Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
          style={{ background: 'var(--surface-low)', color: 'var(--on-surface-faint)' }}
        >
          <Search size={14} />
          <span className="font-body">Search nodes...</span>
        </div>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="p-2 rounded-full transition-colors hover:bg-[var(--surface-high)]"
          style={{ color: 'var(--on-surface-muted)' }}
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>

        {/* Alerts bell */}
        <button
          onClick={onAlertClick}
          className="p-2 rounded-full transition-colors hover:bg-[var(--surface-high)] relative"
          style={{ color: 'var(--on-surface-muted)' }}
          aria-label="Alerts"
        >
          <Bell size={18} />
          {alertCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-body font-semibold text-white"
              style={{ background: 'var(--error)' }}
            >
              {alertCount > 99 ? '99+' : alertCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-headline font-semibold cursor-pointer"
          style={{ background: 'var(--gradient-primary)' }}
        >
          AD
        </div>
      </div>
    </header>
  );
}
