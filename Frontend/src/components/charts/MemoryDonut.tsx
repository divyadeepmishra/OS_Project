'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MemoryDonutProps {
  usedGB: number;
  cachedGB: number;
  freeGB: number;
  size?: number;
}

const COLORS = ['#a0373b', '#ffc3c2', '#e8e4e4'];

// Donut chart showing memory breakdown with center percentage label
export default function MemoryDonut({ usedGB, cachedGB, freeGB, size = 200 }: MemoryDonutProps) {
  const total = usedGB + cachedGB + freeGB;
  const percent = total > 0 ? Math.round((usedGB / total) * 100) : 0;

  const data = [
    { name: 'Used', value: usedGB },
    { name: 'Cached', value: cachedGB },
    { name: 'Free', value: freeGB },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.35}
            outerRadius={size * 0.45}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="font-headline font-extrabold text-3xl -tracking-tight"
          style={{ color: 'var(--primary)' }}
        >
          {percent}%
        </span>
        <span
          className="text-[10px] font-body font-medium tracking-wide uppercase"
          style={{ color: 'var(--on-surface-faint)' }}
        >
          used
        </span>
      </div>
    </div>
  );
}
