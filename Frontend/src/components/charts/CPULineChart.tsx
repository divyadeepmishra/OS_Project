'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CPULineChartProps {
  data: { time: number; value: number }[];
  threshold?: number;
  height?: number;
}

/** Live scrolling CPU line/area chart with gradient fill and threshold line */
export default function CPULineChart({ data, threshold = 80, height = 220 }: CPULineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a0373b" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#a0373b" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="time"
          tick={false}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: 'var(--on-surface-faint)' }}
          axisLine={false}
          tickLine={false}
          width={30}
        />

        <ReferenceLine
          y={threshold}
          stroke="#7d5700"
          strokeDasharray="4 4"
          label={{
            value: 'Warning',
            position: 'right',
            fill: '#7d5700',
            fontSize: 10,
          }}
        />

        <Tooltip
          contentStyle={{
            background: 'rgba(255,255,255,0.90)',
            backdropFilter: 'blur(12px)',
            border: 'none',
            borderRadius: '0.75rem',
            boxShadow: 'var(--shadow-card)',
            fontSize: 12,
            fontFamily: 'var(--font-body)',
            color: 'var(--on-surface)',
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(val: any) => [`${Number(val).toFixed(1)}%`, 'CPU']}
          labelFormatter={() => ''}
        />

        <Area
          type="monotone"
          dataKey="value"
          stroke="#a0373b"
          strokeWidth={2}
          fill="url(#cpuGrad)"
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
