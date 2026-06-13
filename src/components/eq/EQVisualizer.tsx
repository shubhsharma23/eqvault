"use client";
import { useEffect, useState } from "react";
import type { EQBand } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  bands: EQBand[];
  height?: number;
  animate?: boolean;
  className?: string;
};

export default function EQVisualizer({ bands, height = 72, animate = true, className }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const gains = bands.map((b) => b.gain);
  const maxAbs = Math.max(...gains.map(Math.abs), 3);
  const labelPadding = 16; // Space for labels above/below bars
  const mid = height / 2 + labelPadding;
  const totalHeight = height + labelPadding * 2 + 16; // Add padding top/bottom + freq labels

  return (
    <div className={cn("w-full", className)}>
      <svg
        width="100%"
        viewBox={`0 0 ${bands.length * 28} ${totalHeight}`}
        preserveAspectRatio="none"
        aria-label="EQ curve visualization"
      >
        {/* Zero line */}
        <line
          x1={0} y1={mid} x2={bands.length * 28} y2={mid}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={0.5}
          strokeDasharray="2 3"
        />

        {bands.map((band, i) => {
          const x = i * 28 + 4;
          const barW = 18;
          const pxPerDb = (height / 2 - 4) / maxAbs;
          const gainPx = band.gain * pxPerDb;
          const barH = Math.abs(gainPx);
          const y = band.gain >= 0 ? mid - gainPx : mid;
          const opacity = 0.45 + (Math.abs(band.gain) / maxAbs) * 0.55;
          const color = band.gain > 0 ? "#7b5cf0" : band.gain < 0 ? "#f05c7b" : "#444";

          return (
            <g key={band.freq}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(barH, 2)}
                rx={3}
                fill={color}
                opacity={mounted && animate ? opacity : 0}
                style={{
                  transition: mounted ? `height 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 30}ms, opacity 0.3s ease ${i * 30}ms` : undefined,
                }}
              />
              {/* Gain value label on bar */}
              {Math.abs(band.gain) > 0.5 && (
                <text
                  x={x + barW / 2}
                  y={band.gain >= 0 ? y - 4 : y + barH + 10}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight="600"
                  fill={band.gain > 0 ? "#9b7ff5" : "#f57b9b"}
                  fontFamily="'DM Mono', monospace"
                  opacity={mounted && animate ? 0.9 : 0}
                  style={{
                    transition: mounted ? `opacity 0.3s ease ${i * 30 + 100}ms` : undefined,
                  }}
                >
                  {band.gain > 0 ? '+' : ''}{band.gain.toFixed(1)}
                </text>
              )}
              {/* Frequency label */}
              <text
                x={x + barW / 2}
                y={height + labelPadding * 2 + 14}
                textAnchor="middle"
                fontSize={8}
                fill="rgba(232,230,240,0.28)"
                fontFamily="'DM Mono', monospace"
              >
                {band.freq}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
