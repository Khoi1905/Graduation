"use client";

import type { CSSProperties } from "react";

type SceneryVariant = "deep" | "mid" | "surface" | "horizon";

const currentCounts: Record<SceneryVariant, number> = {
  deep: 3,
  mid: 8,
  surface: 7,
  horizon: 4,
};

export default function UnderwaterScenery({ variant }: { variant: SceneryVariant }) {
  return (
    <div className={`dive-scene-atmosphere dive-scene-atmosphere-${variant} absolute inset-0 overflow-hidden pointer-events-none`}>
      <div className="absolute inset-0 dive-scene-vignette" />
      <div className="absolute inset-0 dive-text-clarity" />
      <div className="absolute inset-0 dive-local-current">
        {Array.from({ length: currentCounts[variant] }, (_, index) => (
          <span key={index} style={{ "--current-index": index } as CSSProperties} />
        ))}
      </div>
      <div className="absolute inset-x-0 top-0 h-32 dive-scene-top-fade" />
      <div className="absolute inset-x-0 bottom-0 h-40 dive-scene-bottom-fade" />
    </div>
  );
}
