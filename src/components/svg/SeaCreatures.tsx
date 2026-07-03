"use client";

import { useId } from "react";
import type { CreatureType } from "@/types/guest";

interface SVGCreatureProps {
  size?: number;
  className?: string;
}

function objectClass(className: string) {
  return `sea-object-3d ${className}`.trim();
}

function SoftShadow({ id }: { id: string }) {
  return (
    <filter id={id} x="-30%" y="-40%" width="160%" height="190%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#03111f" floodOpacity="0.28" />
      <feDropShadow dx="-1" dy="-1" stdDeviation="0.5" floodColor="#ffffff" floodOpacity="0.18" />
    </filter>
  );
}

export function ClownfishSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size, height: size * 0.66 }}>
      <svg viewBox="0 0 96 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`cf-body-${id}`} x1="22" y1="13" x2="72" y2="53">
            <stop offset="0%" stopColor="#ffb45e" />
            <stop offset="45%" stopColor="#f47b32" />
            <stop offset="100%" stopColor="#bf3d18" />
          </linearGradient>
          <linearGradient id={`cf-fin-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff9b48" />
            <stop offset="100%" stopColor="#b93618" />
          </linearGradient>
          <SoftShadow id={`cf-shadow-${id}`} />
        </defs>
        <path d="M17 32 L3 16 Q9 31 3 48 Z" fill={`url(#cf-fin-${id})`} opacity="0.95" />
        <path d="M31 18 Q38 4 51 15 L45 22 Z" fill={`url(#cf-fin-${id})`} />
        <path d="M32 43 Q22 58 15 48 Q22 43 33 38 Z" fill="#c94c22" opacity="0.75" />
        <ellipse cx="50" cy="32" rx="35" ry="21" fill={`url(#cf-body-${id})`} filter={`url(#cf-shadow-${id})`} />
        <path d="M25 14 Q20 32 25 50" stroke="#fff4de" strokeWidth="6" strokeLinecap="round" opacity="0.95" />
        <path d="M47 12 Q43 32 48 52" stroke="#fff4de" strokeWidth="6" strokeLinecap="round" opacity="0.92" />
        <path d="M28 17 Q23 32 28 47" stroke="#81351e" strokeWidth="1.7" strokeLinecap="round" opacity="0.45" />
        <path d="M51 15 Q47 32 52 49" stroke="#81351e" strokeWidth="1.5" strokeLinecap="round" opacity="0.36" />
        <ellipse cx="55" cy="23" rx="20" ry="8" fill="#fff8ea" opacity="0.2" />
        <path d="M23 42 Q45 58 75 39" fill="#7b2718" opacity="0.12" />
        <circle cx="72" cy="27" r="6" fill="#fffaf0" />
        <circle cx="74" cy="26" r="3.5" fill="#122238" />
        <circle cx="75.4" cy="24.8" r="1.1" fill="#ffffff" />
        <path d="M81 34 Q85 36 81 39" stroke="#812b1b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function TurtleSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size, height: size * 0.72 }}>
      <svg viewBox="0 0 96 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`tu-shell-${id}`} cx="38%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#8ccf79" />
            <stop offset="56%" stopColor="#4e9654" />
            <stop offset="100%" stopColor="#28663c" />
          </radialGradient>
          <linearGradient id={`tu-skin-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#77bd78" />
            <stop offset="100%" stopColor="#327247" />
          </linearGradient>
          <SoftShadow id={`tu-shadow-${id}`} />
        </defs>
        <ellipse cx="22" cy="19" rx="13" ry="6" fill={`url(#tu-skin-${id})`} transform="rotate(-28 22 19)" />
        <ellipse cx="22" cy="51" rx="13" ry="6" fill={`url(#tu-skin-${id})`} transform="rotate(28 22 51)" />
        <ellipse cx="62" cy="18" rx="11" ry="5" fill={`url(#tu-skin-${id})`} transform="rotate(-20 62 18)" />
        <ellipse cx="62" cy="52" rx="11" ry="5" fill={`url(#tu-skin-${id})`} transform="rotate(20 62 52)" />
        <ellipse cx="44" cy="35" rx="30" ry="23" fill={`url(#tu-shell-${id})`} filter={`url(#tu-shadow-${id})`} />
        <path d="M44 13 L31 28 L44 35 L57 28 Z" fill="#2d7440" opacity="0.42" />
        <path d="M44 35 L31 28 L24 38 L32 49 Z" fill="#25633a" opacity="0.34" />
        <path d="M44 35 L57 28 L65 38 L56 49 Z" fill="#25633a" opacity="0.34" />
        <path d="M44 35 L32 49 L44 58 L56 49 Z" fill="#1d5634" opacity="0.28" />
        <ellipse cx="39" cy="26" rx="12" ry="7" fill="#ffffff" opacity="0.16" />
        <ellipse cx="76" cy="35" rx="11" ry="8" fill={`url(#tu-skin-${id})`} />
        <circle cx="81" cy="32" r="3.2" fill="#fffaf0" />
        <circle cx="82" cy="31.5" r="1.9" fill="#122418" />
        <circle cx="82.8" cy="30.6" r="0.7" fill="#ffffff" />
        <path d="M86 36 Q89 37 86 39" stroke="#285f3c" strokeWidth="1.2" fill="none" />
        <path d="M10 35 L3 31 L3 39 Z" fill="#3f824e" />
      </svg>
    </div>
  );
}

export function JellyfishSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 76 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`jf-bell-${id}`} cx="40%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#f2d5ff" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#b980db" stopOpacity="0.74" />
            <stop offset="100%" stopColor="#7250a8" stopOpacity="0.58" />
          </radialGradient>
          <SoftShadow id={`jf-shadow-${id}`} />
        </defs>
        <path d="M8 35 Q8 8 38 8 Q68 8 68 35 Q58 43 38 43 Q18 43 8 35Z" fill={`url(#jf-bell-${id})`} filter={`url(#jf-shadow-${id})`} />
        <path d="M17 30 Q26 15 38 15 Q51 15 59 30" fill="#ffffff" opacity="0.22" />
        <path d="M12 37 Q20 47 38 47 Q56 47 64 37" stroke="#5e3e91" strokeWidth="2" opacity="0.22" />
        <circle cx="29" cy="30" r="4" fill="#fff9ff" opacity="0.78" />
        <circle cx="30" cy="29" r="2" fill="#2a1948" />
        <circle cx="47" cy="30" r="4" fill="#fff9ff" opacity="0.78" />
        <circle cx="48" cy="29" r="2" fill="#2a1948" />
        {[14, 26, 38, 50, 62].map((x, i) => (
          <path
            key={x}
            d={`M${x} 42 Q${x - 6 + i * 2} 55 ${x} 64 Q${x + 4 - i} 71 ${x - 1} 76`}
            stroke={i % 2 ? "#d8a7ef" : "#9b70d0"}
            strokeWidth={i === 2 ? 3 : 2.4}
            fill="none"
            opacity={i === 2 ? 0.64 : 0.48}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}

export function CrabSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size, height: size * 0.68 }}>
      <svg viewBox="0 0 96 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`cr-body-${id}`} x1="22" y1="17" x2="70" y2="56">
            <stop offset="0%" stopColor="#ff9066" />
            <stop offset="52%" stopColor="#df5535" />
            <stop offset="100%" stopColor="#9b2b1f" />
          </linearGradient>
          <SoftShadow id={`cr-shadow-${id}`} />
        </defs>
        <path d="M25 38 L8 29 L2 20" stroke="#b43c28" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M26 43 L9 44 L3 40" stroke="#b43c28" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M28 48 L13 55 L6 56" stroke="#b43c28" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M71 38 L88 29 L94 20" stroke="#b43c28" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M70 43 L87 44 L93 40" stroke="#b43c28" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M68 48 L83 55 L90 56" stroke="#b43c28" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M21 30 L9 17 Q4 10 10 7 Q17 5 17 15 L24 25" fill="#d84e33" />
        <path d="M75 30 L87 17 Q92 10 86 7 Q79 5 79 15 L72 25" fill="#d84e33" />
        <ellipse cx="48" cy="42" rx="27" ry="17" fill={`url(#cr-body-${id})`} filter={`url(#cr-shadow-${id})`} />
        <ellipse cx="44" cy="36" rx="15" ry="7" fill="#fff4e8" opacity="0.16" />
        <line x1="39" y1="27" x2="36" y2="18" stroke="#a73725" strokeWidth="3" strokeLinecap="round" />
        <line x1="57" y1="27" x2="60" y2="18" stroke="#a73725" strokeWidth="3" strokeLinecap="round" />
        <circle cx="36" cy="16" r="5" fill="#fff9f0" />
        <circle cx="60" cy="16" r="5" fill="#fff9f0" />
        <circle cx="37.5" cy="15" r="2.8" fill="#142033" />
        <circle cx="61.5" cy="15" r="2.8" fill="#142033" />
        <path d="M43 47 Q48 50 53 47" stroke="#7c241a" strokeWidth="1.3" fill="none" />
      </svg>
    </div>
  );
}

export function OctopusSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size, height: size * 0.9 }}>
      <svg viewBox="0 0 82 74" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`oc-body-${id}`} cx="38%" cy="28%" r="76%">
            <stop offset="0%" stopColor="#ef9dc0" />
            <stop offset="58%" stopColor="#c25a94" />
            <stop offset="100%" stopColor="#78265e" />
          </radialGradient>
          <SoftShadow id={`oc-shadow-${id}`} />
        </defs>
        <ellipse cx="41" cy="28" rx="26" ry="22" fill={`url(#oc-body-${id})`} filter={`url(#oc-shadow-${id})`} />
        <ellipse cx="36" cy="20" rx="10" ry="6" fill="#fff6fb" opacity="0.18" />
        <circle cx="31" cy="28" r="5" fill="#fff9ff" />
        <circle cx="51" cy="28" r="5" fill="#fff9ff" />
        <circle cx="33" cy="27" r="2.8" fill="#251329" />
        <circle cx="53" cy="27" r="2.8" fill="#251329" />
        <path d="M36 37 Q41 40 46 37" stroke="#6c1d52" strokeWidth="1.5" fill="none" />
        {[18, 28, 38, 48, 58, 66].map((x, i) => (
          <path
            key={x}
            d={`M${x} 44 Q${x - 8 + i} 56 ${x - 2} 66 Q${x + 5} 72 ${x + 8} 66`}
            stroke={i < 3 ? "#b74b86" : "#94366f"}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity={0.66 - i * 0.03}
          />
        ))}
        <circle cx="22" cy="59" r="1.6" fill="#e5a4c2" opacity="0.45" />
        <circle cx="58" cy="60" r="1.6" fill="#e5a4c2" opacity="0.45" />
      </svg>
    </div>
  );
}

export function SeahorseSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size * 0.64, height: size }}>
      <svg viewBox="0 0 52 82" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`se-body-${id}`} x1="18" y1="4" x2="34" y2="78">
            <stop offset="0%" stopColor="#ffe681" />
            <stop offset="48%" stopColor="#d8b23e" />
            <stop offset="100%" stopColor="#8d7327" />
          </linearGradient>
          <SoftShadow id={`se-shadow-${id}`} />
        </defs>
        <path d="M30 8 Q42 6 43 17 Q44 29 33 32 Q27 34 29 43 Q31 53 25 60 Q19 67 25 75 Q28 80 20 78 Q13 76 16 67 Q19 58 18 51 Q17 42 23 35 Q28 28 28 20" stroke={`url(#se-body-${id})`} strokeWidth="9" fill="none" strokeLinecap="round" filter={`url(#se-shadow-${id})`} />
        <ellipse cx="35" cy="19" rx="8" ry="10" fill="#f4d65d" opacity="0.55" />
        <path d="M26 19 Q20 26 26 32 Q19 40 25 47 Q18 55 24 61" stroke="#b9932f" strokeWidth="2.2" fill="none" opacity="0.5" />
        <path d="M30 9 Q31 2 37 5" stroke="#f0cf55" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="32" cy="16" rx="3.6" ry="3.2" fill="#fff8dd" />
        <circle cx="33.2" cy="15.2" r="1.8" fill="#2d2613" />
        <path d="M41 21 L48 19" stroke="#aa8728" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="28" cy="32" rx="4" ry="16" fill="#fff4bd" opacity="0.15" />
      </svg>
    </div>
  );
}

export function DolphinSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size, height: size * 0.52 }}>
      <svg viewBox="0 0 104 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`do-body-${id}`} x1="22" y1="11" x2="80" y2="43">
            <stop offset="0%" stopColor="#91c4e6" />
            <stop offset="52%" stopColor="#4f86b5" />
            <stop offset="100%" stopColor="#2d557c" />
          </linearGradient>
          <SoftShadow id={`do-shadow-${id}`} />
        </defs>
        <path d="M15 31 Q7 20 12 12 L17 26" fill="#386489" opacity="0.78" />
        <path d="M23 38 Q10 51 5 45 Q12 36 24 34" fill="#386489" opacity="0.62" />
        <ellipse cx="51" cy="28" rx="38" ry="16" fill={`url(#do-body-${id})`} filter={`url(#do-shadow-${id})`} />
        <ellipse cx="57" cy="34" rx="24" ry="7" fill="#f1fbff" opacity="0.2" />
        <path d="M50 11 Q56 2 62 12" fill="#4f86b5" />
        <path d="M86 28 Q95 21 102 25 Q100 32 86 32" fill="#497ba5" />
        <circle cx="89" cy="24" r="3.6" fill="#fffaff" />
        <circle cx="90" cy="23.5" r="2" fill="#12243b" />
        <path d="M96 29 Q99 31 96 33" stroke="#284d70" strokeWidth="1.2" fill="none" />
        <path d="M25 21 Q49 9 78 23" stroke="#ffffff" strokeWidth="2" opacity="0.13" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function StarfishSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`st-body-${id}`} cx="45%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#ffd983" />
            <stop offset="55%" stopColor="#e79a3c" />
            <stop offset="100%" stopColor="#a9651c" />
          </radialGradient>
          <SoftShadow id={`st-shadow-${id}`} />
        </defs>
        <path d="M38 7 L44 28 L64 17 L49 36 L71 39 L49 42 L62 62 L44 50 L38 72 L32 50 L14 62 L27 42 L5 39 L27 36 L12 17 L32 28 Z" fill={`url(#st-body-${id})`} filter={`url(#st-shadow-${id})`} />
        <path d="M38 16 L41 32 L56 25 L45 38 L60 40 L45 42 L54 56 L41 48 L38 64 L35 48 L22 56 L31 42 L16 40 L31 38 L20 25 L35 32 Z" fill="#fff0ad" opacity="0.12" />
        {[38, 52, 52, 24, 24].map((x, i) => (
          <circle key={i} cx={x} cy={[39, 31, 48, 48, 31][i]} r="2" fill="#f6c66c" opacity="0.38" />
        ))}
        <circle cx="38" cy="39" r="6" fill="#c87828" opacity="0.28" />
      </svg>
    </div>
  );
}

export function PufferfishSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size, height: size * 0.72 }}>
      <svg viewBox="0 0 88 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`pf-body-${id}`} cx="38%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#d9f39a" />
            <stop offset="55%" stopColor="#91c861" />
            <stop offset="100%" stopColor="#527b32" />
          </radialGradient>
          <SoftShadow id={`pf-shadow-${id}`} />
        </defs>
        <path d="M15 32 L4 22 L6 32 L4 42 Z" fill="#6b963d" />
        <circle cx="42" cy="32" r="25" fill={`url(#pf-body-${id})`} filter={`url(#pf-shadow-${id})`} />
        {[26, 36, 49, 58].map((x, i) => (
          <path key={x} d={`M${x} ${18 + i * 7} l4 -5 l3 6`} stroke="#446b2e" strokeWidth="1.5" strokeLinecap="round" opacity="0.38" />
        ))}
        <ellipse cx="37" cy="23" rx="13" ry="7" fill="#ffffff" opacity="0.16" />
        <circle cx="58" cy="27" r="5" fill="#fffaf0" />
        <circle cx="60" cy="26" r="2.8" fill="#142033" />
        <path d="M64 36 Q69 39 64 42" stroke="#3b662c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function WhaleSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size * 1.12, height: size * 0.64 }}>
      <svg viewBox="0 0 112 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`wh-body-${id}`} x1="20" y1="12" x2="86" y2="52">
            <stop offset="0%" stopColor="#7da6d3" />
            <stop offset="58%" stopColor="#426b9d" />
            <stop offset="100%" stopColor="#263b64" />
          </linearGradient>
          <SoftShadow id={`wh-shadow-${id}`} />
        </defs>
        <path d="M19 33 Q8 23 5 14 Q19 18 27 28" fill="#334f7c" />
        <path d="M19 33 Q7 43 5 52 Q19 48 27 38" fill="#334f7c" />
        <ellipse cx="56" cy="34" rx="42" ry="21" fill={`url(#wh-body-${id})`} filter={`url(#wh-shadow-${id})`} />
        <path d="M42 43 Q62 58 89 38" fill="#e8f5fb" opacity="0.22" />
        <ellipse cx="52" cy="24" rx="18" ry="8" fill="#ffffff" opacity="0.13" />
        <path d="M50 15 Q54 4 63 14" fill="#456fa0" />
        <circle cx="86" cy="29" r="4" fill="#fffaf0" />
        <circle cx="87" cy="28.5" r="2.2" fill="#102238" />
        <path d="M91 35 Q96 37 91 39" stroke="#263b64" strokeWidth="1.4" fill="none" />
        <path d="M28 44 Q52 49 82 43" stroke="#f7fbff" strokeWidth="1.3" opacity="0.25" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function ShrimpSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size, height: size * 0.7 }}>
      <svg viewBox="0 0 96 66" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`shp-body-${id}`} x1="16" y1="14" x2="72" y2="54">
            <stop offset="0%" stopColor="#ffd0bd" />
            <stop offset="52%" stopColor="#e98678" />
            <stop offset="100%" stopColor="#a94a45" />
          </linearGradient>
          <SoftShadow id={`shp-shadow-${id}`} />
        </defs>
        <path d="M18 38 Q18 18 43 16 Q70 15 78 37 Q66 54 42 51 Q25 49 18 38Z" fill={`url(#shp-body-${id})`} filter={`url(#shp-shadow-${id})`} />
        <path d="M28 18 Q23 30 28 48" stroke="#fff0e8" strokeWidth="3" opacity="0.35" />
        <path d="M42 16 Q36 32 42 51" stroke="#fff0e8" strokeWidth="3" opacity="0.28" />
        <path d="M55 19 Q49 33 55 49" stroke="#8f3d3b" strokeWidth="2" opacity="0.28" />
        <path d="M75 37 Q89 30 93 40 Q84 45 74 42" fill="#c75e57" />
        <path d="M23 42 Q12 52 5 48" stroke="#b6524d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M25 47 Q17 60 9 58" stroke="#b6524d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="67" cy="28" r="4" fill="#fffaf0" />
        <circle cx="68" cy="27.5" r="2.2" fill="#152033" />
        <path d="M70 23 Q80 12 92 11" stroke="#e7a094" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function RaySVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size * 1.08, height: size * 0.68 }}>
      <svg viewBox="0 0 108 66" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`ray-body-${id}`} cx="44%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#b7c4ce" />
            <stop offset="58%" stopColor="#748796" />
            <stop offset="100%" stopColor="#3f5160" />
          </radialGradient>
          <SoftShadow id={`ray-shadow-${id}`} />
        </defs>
        <path d="M10 34 Q34 8 55 16 Q78 8 99 34 Q77 47 55 43 Q32 47 10 34Z" fill={`url(#ray-body-${id})`} filter={`url(#ray-shadow-${id})`} />
        <path d="M55 42 Q58 56 72 62" stroke="#465968" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="46" cy="25" rx="4" ry="3" fill="#fffaf0" />
        <ellipse cx="66" cy="25" rx="4" ry="3" fill="#fffaf0" />
        <circle cx="47" cy="24.5" r="1.8" fill="#152033" />
        <circle cx="67" cy="24.5" r="1.8" fill="#152033" />
        <path d="M29 31 Q55 17 82 31" stroke="#ffffff" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
        <path d="M29 38 Q55 49 82 38" stroke="#243744" strokeWidth="1.5" opacity="0.22" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function GenericFishSVG({
  size = 60,
  className = "",
  color1 = "#5bb7df",
  color2 = "#236a9e",
}: SVGCreatureProps & { color1?: string; color2?: string }) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size, height: size * 0.62 }}>
      <svg viewBox="0 0 88 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`gf-body-${id}`} x1="16" y1="10" x2="68" y2="45">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
          <SoftShadow id={`gf-shadow-${id}`} />
        </defs>
        <path d="M15 27 L3 15 L5 27 L3 39 Z" fill={color2} opacity="0.9" />
        <ellipse cx="43" cy="27" rx="31" ry="18" fill={`url(#gf-body-${id})`} filter={`url(#gf-shadow-${id})`} />
        <ellipse cx="48" cy="21" rx="18" ry="7" fill="#ffffff" opacity="0.18" />
        <path d="M38 10 Q43 2 50 10" fill={color1} opacity="0.72" />
        <path d="M34 31 Q25 42 20 37 Q26 31 35 30" fill={color2} opacity="0.58" />
        <circle cx="61" cy="23" r="5" fill="#fffaf0" />
        <circle cx="63" cy="22.3" r="2.8" fill="#102238" />
        <circle cx="64" cy="21.4" r="0.9" fill="#ffffff" />
        <path d="M70 29 Q74 31 70 34" stroke={color2} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function SharkSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size * 1.18, height: size * 0.58 }}>
      <svg viewBox="0 0 118 58" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`sk-body-${id}`} x1="18" y1="8" x2="92" y2="48">
            <stop offset="0%" stopColor="#9fb7c5" />
            <stop offset="58%" stopColor="#526d7d" />
            <stop offset="100%" stopColor="#243744" />
          </linearGradient>
          <SoftShadow id={`sk-shadow-${id}`} />
        </defs>
        <path d="M18 30 Q8 19 3 10 Q20 14 31 26" fill="#385061" opacity="0.92" />
        <path d="M18 30 Q7 42 4 51 Q20 47 31 35" fill="#304655" opacity="0.78" />
        <path d="M52 14 Q58 1 67 15" fill="#5f7888" />
        <path d="M52 39 Q41 52 30 47 Q39 38 54 34" fill="#314958" opacity="0.58" />
        <path d="M14 31 Q49 2 93 22 Q106 27 115 29 Q105 33 92 37 Q49 56 14 31Z" fill={`url(#sk-body-${id})`} filter={`url(#sk-shadow-${id})`} />
        <path d="M35 38 Q59 49 93 34 Q72 49 40 45" fill="#eff8fb" opacity="0.28" />
        <ellipse cx="64" cy="21" rx="20" ry="7" fill="#ffffff" opacity="0.14" />
        <circle cx="92" cy="25" r="3.6" fill="#fffaf0" />
        <circle cx="93" cy="24.5" r="1.9" fill="#0c1720" />
        <path d="M99 31 Q105 32 111 30" stroke="#13242e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M101 32 l2 4 l2 -4 l2 4" stroke="#f8fbfb" strokeWidth="1" opacity="0.72" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function SquidSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size * 0.82, height: size * 1.08 }}>
      <svg viewBox="0 0 74 92" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`sq-body-${id}`} cx="38%" cy="22%" r="78%">
            <stop offset="0%" stopColor="#ffd3c8" />
            <stop offset="56%" stopColor="#d9798f" />
            <stop offset="100%" stopColor="#7c3b79" />
          </radialGradient>
          <SoftShadow id={`sq-shadow-${id}`} />
        </defs>
        <path d="M37 5 Q58 22 54 48 Q47 64 37 68 Q27 64 20 48 Q16 22 37 5Z" fill={`url(#sq-body-${id})`} filter={`url(#sq-shadow-${id})`} />
        <path d="M23 24 Q12 21 8 11 Q21 12 31 21" fill="#b85d88" opacity="0.64" />
        <path d="M51 24 Q62 21 66 11 Q53 12 43 21" fill="#b85d88" opacity="0.64" />
        <ellipse cx="34" cy="29" rx="10" ry="16" fill="#ffffff" opacity="0.16" />
        <circle cx="30" cy="43" r="4" fill="#fff9ff" />
        <circle cx="44" cy="43" r="4" fill="#fff9ff" />
        <circle cx="31" cy="42.4" r="2.1" fill="#241334" />
        <circle cx="45" cy="42.4" r="2.1" fill="#241334" />
        {[22, 30, 38, 46, 54].map((x, i) => (
          <path
            key={x}
            d={`M${x} 61 Q${x - 8 + i * 2} 74 ${x - 1} 86`}
            stroke={i % 2 ? "#d989a3" : "#a85892"}
            strokeWidth={i === 2 ? 4 : 3}
            strokeLinecap="round"
            fill="none"
            opacity={0.68}
          />
        ))}
      </svg>
    </div>
  );
}

export function AngelfishSVG({ size = 60, className = "" }: SVGCreatureProps) {
  const id = useId();
  return (
    <div className={objectClass(className)} style={{ width: size, height: size * 0.9 }}>
      <svg viewBox="0 0 86 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`af-body-${id}`} x1="18" y1="8" x2="62" y2="62">
            <stop offset="0%" stopColor="#fff1a0" />
            <stop offset="48%" stopColor="#f5a84c" />
            <stop offset="100%" stopColor="#cf5b6f" />
          </linearGradient>
          <SoftShadow id={`af-shadow-${id}`} />
        </defs>
        <path d="M18 39 L4 25 L7 39 L4 53 Z" fill="#d46478" opacity="0.86" />
        <path d="M38 12 Q50 0 58 15 Q48 18 40 24" fill="#ffd86d" opacity="0.84" />
        <path d="M36 54 Q42 72 26 76 Q30 61 35 48" fill="#d95d73" opacity="0.72" />
        <path d="M18 39 Q36 11 62 19 Q78 29 80 39 Q78 49 62 59 Q36 67 18 39Z" fill={`url(#af-body-${id})`} filter={`url(#af-shadow-${id})`} />
        <path d="M33 20 Q25 39 33 58" stroke="#fff7cb" strokeWidth="4.5" opacity="0.6" strokeLinecap="round" />
        <path d="M47 18 Q40 39 48 60" stroke="#8f3551" strokeWidth="3" opacity="0.26" strokeLinecap="round" />
        <ellipse cx="55" cy="30" rx="13" ry="6" fill="#ffffff" opacity="0.18" />
        <circle cx="64" cy="34" r="4.4" fill="#fffaf0" />
        <circle cx="65" cy="33.3" r="2.4" fill="#142033" />
        <path d="M70 42 Q75 44 70 47" stroke="#8f3551" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function CreatureSVG({ creature, size = 60, className = "" }: { creature: CreatureType; size?: number; className?: string }) {
  switch (creature) {
    case "clownfish":
      return <ClownfishSVG size={size} className={className} />;
    case "turtle":
      return <TurtleSVG size={size} className={className} />;
    case "jellyfish":
      return <JellyfishSVG size={size} className={className} />;
    case "crab":
      return <CrabSVG size={size} className={className} />;
    case "octopus":
      return <OctopusSVG size={size} className={className} />;
    case "seahorse":
      return <SeahorseSVG size={size} className={className} />;
    case "dolphin":
      return <DolphinSVG size={size} className={className} />;
    case "starfish":
      return <StarfishSVG size={size} className={className} />;
    case "pufferfish":
      return <PufferfishSVG size={size} className={className} />;
    case "whale":
      return <WhaleSVG size={size} className={className} />;
    case "shrimp":
      return <ShrimpSVG size={size} className={className} />;
    case "ray":
      return <RaySVG size={size} className={className} />;
    case "shark":
      return <SharkSVG size={size} className={className} />;
    case "squid":
      return <SquidSVG size={size} className={className} />;
    case "angelfish":
      return <AngelfishSVG size={size} className={className} />;
  }
}
