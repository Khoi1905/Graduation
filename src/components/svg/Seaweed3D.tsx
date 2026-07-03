"use client";

import { useId } from "react";

interface SeaweedProps {
  height?: number;
  color1?: string;
  color2?: string;
  className?: string;
  style?: React.CSSProperties;
}

function darken(hex: string) {
  if (!hex.startsWith("#") || hex.length !== 7) return hex;
  const n = Number.parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 255) - 34);
  const g = Math.max(0, ((n >> 8) & 255) - 34);
  const b = Math.max(0, (n & 255) - 34);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function Blade({
  id,
  h,
  x,
  width,
  lean,
  color1,
  color2,
  delay,
}: {
  id: string;
  h: number;
  x: number;
  width: number;
  lean: number;
  color1: string;
  color2: string;
  delay: number;
}) {
  const topX = x + lean;
  const midY = h * 0.54;
  const left = x - width / 2;
  const right = x + width / 2;

  return (
    <g style={{ transformOrigin: `${x}px ${h}px`, animationDelay: `${delay}s` }} className="seaweed-blade-3d">
      <path
        d={`M${left} ${h} C${left - lean * 0.35} ${h * 0.76} ${topX - width * 1.2} ${midY} ${topX} 4 C${topX + width * 0.95} ${midY} ${right + lean * 0.35} ${h * 0.78} ${right} ${h} Z`}
        fill={`url(#${id})`}
      />
      <path
        d={`M${x} ${h - 4} C${x + lean * 0.15} ${h * 0.72} ${topX - width * 0.16} ${midY} ${topX} 10`}
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d={`M${right - 1} ${h - 2} C${right + lean * 0.2} ${h * 0.76} ${topX + width * 0.65} ${midY} ${topX + width * 0.1} 8`}
        stroke={darken(color1)}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />
      {[0.34, 0.48, 0.62].map((at, i) => (
        <ellipse
          key={at}
          cx={x + lean * at * 0.7 + (i % 2 ? width * 0.32 : -width * 0.25)}
          cy={h - h * at}
          rx={width * 0.42}
          ry={width * 0.14}
          fill={i % 2 ? color2 : color1}
          opacity="0.22"
          transform={`rotate(${lean > 0 ? -18 : 18} ${x} ${h - h * at})`}
        />
      ))}
    </g>
  );
}

export function SeaweedCluster({ height = 120, color1 = "#1a6b4a", color2 = "#2d8f60", className = "", style }: SeaweedProps) {
  const id = useId();
  const h = height;
  const shadowColor = darken(color1);

  return (
    <div className={`sea-object-3d seaweed-object-3d pointer-events-none ${className}`} style={style}>
      <svg width="64" height={h} viewBox={`0 0 64 ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`sw-a-${id}`} x1="18" y1="0" x2="34" y2={h}>
            <stop offset="0%" stopColor={color2} stopOpacity="0.92" />
            <stop offset="50%" stopColor={color1} stopOpacity="0.88" />
            <stop offset="100%" stopColor={shadowColor} stopOpacity="0.78" />
          </linearGradient>
          <linearGradient id={`sw-b-${id}`} x1="38" y1="0" x2="22" y2={h}>
            <stop offset="0%" stopColor="#7bd69b" stopOpacity="0.82" />
            <stop offset="44%" stopColor={color2} stopOpacity="0.78" />
            <stop offset="100%" stopColor={shadowColor} stopOpacity="0.7" />
          </linearGradient>
          <filter id={`sw-shadow-${id}`} x="-35%" y="-20%" width="170%" height="150%">
            <feDropShadow dx="3" dy="8" stdDeviation="4" floodColor="#031b19" floodOpacity="0.28" />
          </filter>
        </defs>
        <ellipse cx="32" cy={h - 4} rx="22" ry="6" fill="#032018" opacity="0.18" />
        <g filter={`url(#sw-shadow-${id})`}>
          <Blade id={`sw-a-${id}`} h={h} x={19} width={11} lean={8} color1={color1} color2={color2} delay={0} />
          <Blade id={`sw-b-${id}`} h={h} x={32} width={13} lean={-5} color1={color1} color2={color2} delay={0.3} />
          <Blade id={`sw-a-${id}`} h={h} x={45} width={10} lean={7} color1={color1} color2={color2} delay={0.7} />
        </g>
      </svg>
    </div>
  );
}

export function CoralBranch({ height = 80, color = "#c06050", className = "", style }: { height?: number; color?: string; className?: string; style?: React.CSSProperties }) {
  const id = useId();
  const h = height;
  const dark = darken(color);

  return (
    <div className={`sea-object-3d coral-object-3d pointer-events-none ${className}`} style={style}>
      <svg width="74" height={h} viewBox={`0 0 74 ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`co-main-${id}`} x1="18" y1={h} x2="52" y2="0">
            <stop offset="0%" stopColor={dark} />
            <stop offset="48%" stopColor={color} />
            <stop offset="100%" stopColor="#f2a092" />
          </linearGradient>
          <filter id={`co-shadow-${id}`} x="-35%" y="-25%" width="170%" height="170%">
            <feDropShadow dx="3" dy="7" stdDeviation="3" floodColor="#2a0f12" floodOpacity="0.28" />
          </filter>
        </defs>
        <ellipse cx="36" cy={h - 5} rx="25" ry="6" fill="#251313" opacity="0.16" />
        <g filter={`url(#co-shadow-${id})`} stroke={`url(#co-main-${id})`} strokeLinecap="round" fill="none">
          <path d={`M36 ${h - 2} C35 ${h * 0.78} 36 ${h * 0.58} 36 ${h * 0.38}`} strokeWidth="9" />
          <path d={`M36 ${h * 0.7} C27 ${h * 0.58} 20 ${h * 0.5} 14 ${h * 0.36}`} strokeWidth="6" />
          <path d={`M37 ${h * 0.62} C49 ${h * 0.52} 56 ${h * 0.38} 61 ${h * 0.24}`} strokeWidth="6" />
          <path d={`M35 ${h * 0.46} C28 ${h * 0.36} 27 ${h * 0.24} 24 ${h * 0.13}`} strokeWidth="5" />
          <path d={`M38 ${h * 0.43} C46 ${h * 0.34} 48 ${h * 0.2} 51 ${h * 0.1}`} strokeWidth="5" />
        </g>
        {[["36", 0.38, 5.5], ["14", 0.36, 5], ["61", 0.24, 5], ["24", 0.13, 4.2], ["51", 0.1, 4.2]].map(([cx, cy, r], i) => (
          <g key={i}>
            <circle cx={Number(cx)} cy={h * Number(cy)} r={Number(r)} fill={`url(#co-main-${id})`} />
            <ellipse cx={Number(cx) - 1.5} cy={h * Number(cy) - 2} rx={Number(r) * 0.38} ry={Number(r) * 0.24} fill="#fff1e9" opacity="0.28" />
          </g>
        ))}
        <path d={`M33 ${h - 8} C32 ${h * 0.72} 33 ${h * 0.55} 34 ${h * 0.4}`} stroke="#fff1e9" strokeWidth="1.5" opacity="0.24" strokeLinecap="round" />
      </svg>
    </div>
  );
}
