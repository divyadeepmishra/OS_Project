'use client';

import React, { memo, useCallback } from 'react';
import { MoreVertical } from 'lucide-react';
import type { Process } from '@/types';
import { getProcessColour, getProcessInitials } from '@/lib/utils';
import StatusChip from './StatusChip';
import MiniBar from './MiniBar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProcessCardProps {
  process: Process;
  index?: number;
  onKill?: (pid: number) => void;
  onPause?: (pid: number) => void;
  onResume?: (pid: number) => void;
  onViewDetail?: (process: Process) => void;
}

/** Single process row card — circle icon, name+PID, CPU/MEM bars, status chip, menu */
const ProcessCard = memo(
  function ProcessCard({ process, index = 0, onKill, onPause, onResume, onViewDetail }: ProcessCardProps) {
    const colour = getProcessColour(process.pid);
    const initials = getProcessInitials(process.name);

    const handleKill = useCallback(() => onKill?.(process.pid), [onKill, process.pid]);
    const handlePause = useCallback(() => onPause?.(process.pid), [onPause, process.pid]);
    const handleResume = useCallback(() => onResume?.(process.pid), [onResume, process.pid]);
    const handleView = useCallback(() => onViewDetail?.(process), [onViewDetail, process]);

    return (
      <div
        className="group process-card-enter flex items-center gap-4 rounded-[1.25rem] px-5 py-4 transition-all duration-200 hover:-translate-y-[1px]"
        style={
          {
            '--index': index,
            background: 'var(--surface-lowest)',
            boxShadow: 'var(--shadow-card)',
          } as React.CSSProperties
        }
      >
        {/* Avatar circle */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-mono font-semibold text-xs"
          style={{ background: colour }}
        >
          {initials}
        </div>

        {/* Name + PID */}
        <div className="min-w-[130px]">
          <div className="font-body font-semibold text-sm" style={{ color: 'var(--on-surface)' }}>
            {process.name}
          </div>
          <div className="font-mono text-xs" style={{ color: 'var(--on-surface-faint)' }}>
            PID: {process.pid}
          </div>
        </div>

        {/* CPU + MEM bars */}
        <div className="flex-1 flex items-center gap-6">
          <div className="flex items-center gap-2 min-w-[180px]">
            <span className="text-[10px] font-body font-medium tracking-wide uppercase w-8" style={{ color: 'var(--on-surface-faint)' }}>
              CPU
            </span>
            <MiniBar value={process.cpu} />
            <span className="text-xs font-mono w-12 text-right" style={{ color: 'var(--on-surface-muted)' }}>
              {process.cpu.toFixed(1)}%
            </span>
          </div>

          <div className="flex items-center gap-2 min-w-[180px]">
            <span className="text-[10px] font-body font-medium tracking-wide uppercase w-8" style={{ color: 'var(--on-surface-faint)' }}>
              MEM
            </span>
            <MiniBar value={process.memory} />
            <span className="text-xs font-mono w-16 text-right" style={{ color: 'var(--on-surface-muted)' }}>
              {process.memoryMB.toFixed(0)} MB
            </span>
          </div>
        </div>

        {/* Status chip */}
        <StatusChip status={process.status} />

        {/* Three-dot menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--surface-high)] outline-none"
            style={{ color: 'var(--on-surface-muted)' }}
          >
            <MoreVertical size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl" style={{ background: 'var(--surface-lowest)', boxShadow: 'var(--shadow-float)' }}>
            <DropdownMenuItem className="text-sm font-body cursor-pointer" onClick={handleView}>
              View Details
            </DropdownMenuItem>
            {process.status === 'running' ? (
              <DropdownMenuItem className="text-sm font-body cursor-pointer" onClick={handlePause}>
                Pause
              </DropdownMenuItem>
            ) : process.status === 'stopped' ? (
              <DropdownMenuItem className="text-sm font-body cursor-pointer" onClick={handleResume}>
                Resume
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              className="text-sm font-body cursor-pointer"
              style={{ color: 'var(--error)' }}
              onClick={handleKill}
            >
              Kill Process
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
  (prev, next) => {
    // Custom comparator — only re-render if significantly changed
    return (
      Math.abs(prev.process.cpu - next.process.cpu) < 0.5 &&
      Math.abs(prev.process.memory - next.process.memory) < 0.5 &&
      prev.process.status === next.process.status &&
      prev.process.pid === next.process.pid
    );
  }
);

export default ProcessCard;
