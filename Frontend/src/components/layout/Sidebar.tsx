'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Cpu,
  MemoryStick,
  List,
  Network,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

const NAV_ITEMS: (NavItem & { IconComponent: React.ElementType })[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard', IconComponent: LayoutDashboard },
  { id: 'cpu', label: 'CPU Monitor', href: '/cpu', icon: 'Cpu', IconComponent: Cpu },
  { id: 'memory', label: 'Memory', href: '/memory', icon: 'MemoryStick', IconComponent: MemoryStick },
  { id: 'processes', label: 'Processes', href: '/processes', icon: 'List', IconComponent: List },
  { id: 'network', label: 'Network', href: '/network', icon: 'Network', IconComponent: Network },
];

/** Collapsible sidebar navigation — transparent background, left-bar accent on active */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-[88px] bottom-0 z-40 flex flex-col"
      style={{ width: 220, background: 'transparent' }}
    >
      {/* Profile section */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-white font-headline font-semibold text-sm"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: '0 0 0 3px rgba(160,55,59,0.2)',
            }}
          >
            AD
          </div>
          <div>
            <div className="font-headline font-semibold text-[var(--on-surface)] text-sm">
              Editorial
            </div>
            <div
              className="font-body font-medium text-[10px] tracking-[0.1em] uppercase"
              style={{ color: 'var(--primary)' }}
            >
              PREMIUM TIER
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-body transition-all duration-200',
                isActive
                  ? 'border-l-[3px] font-medium'
                  : 'border-l-[3px] border-transparent hover:text-[var(--primary)]'
              )}
              style={
                isActive
                  ? {
                      borderColor: 'var(--primary)',
                      background: 'rgba(160,55,59,0.07)',
                      color: 'var(--primary)',
                    }
                  : { color: 'var(--on-surface-muted)' }
              }
            >
              <item.IconComponent size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom system label */}
      <div className="px-5 py-4 mt-auto">
        <div
          className="text-[10px] font-body font-medium tracking-[0.1em] uppercase"
          style={{ color: 'var(--on-surface-faint)' }}
        >
          SYSTEM NODE
        </div>
        <div className="text-xs font-body" style={{ color: 'var(--on-surface-muted)' }}>
          Active Monitoring
        </div>
      </div>
    </aside>
  );
}
