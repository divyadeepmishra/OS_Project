'use client';

import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface NetworkSparklinesProps {
  uploadData: { time: number; value: number }[];
  downloadData: { time: number; value: number }[];
  uploadKBs: number;
  downloadKBs: number;
}

//Dual compact sparkline area charts for network upload/download
export default function NetworkSparklines({
  uploadData,
  downloadData,
  uploadKBs,
  downloadKBs,
}: NetworkSparklinesProps) {
  return (
    <div className="space-y-3">
      {/* Upload */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-body font-medium" style={{ color: 'var(--on-surface-muted)' }}>
            ↑ Upload
          </span>
          <span className="text-xs font-mono" style={{ color: 'var(--primary)' }}>
            {uploadKBs} KB/s
          </span>
        </div>
        <div style={{ height: 60 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={uploadData}>
              <defs>
                <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a0373b" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#a0373b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#a0373b"
                strokeWidth={1.5}
                fill="url(#uploadGrad)"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Download */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-body font-medium" style={{ color: 'var(--on-surface-muted)' }}>
            ↓ Download
          </span>
          <span className="text-xs font-mono" style={{ color: 'var(--secondary, #8d5a5b)' }}>
            {downloadKBs} KB/s
          </span>
        </div>
        <div style={{ height: 60 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={downloadData}>
              <defs>
                <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffc3c2" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ffc3c2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#ffc3c2"
                strokeWidth={1.5}
                fill="url(#downloadGrad)"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
