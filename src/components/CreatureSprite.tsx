"use client";

import type { CSSProperties } from "react";
import type { CreatureType } from "@/types/guest";
import { CreatureSVG } from "@/components/svg/SeaCreatures";

type CreatureMotion = "glide" | "paddle" | "pulse" | "crawl" | "hover" | "sweep";

interface CreatureSpriteMeta {
  src: string;
  frames: 4;
  frameDuration: number;
  motion: CreatureMotion;
  scale: number;
}

const creaturePath = "/art/dive/creatures";

export const CREATURE_SPRITES = {
  clownfish: { src: `${creaturePath}/clownfish-sheet.png`, frames: 4, frameDuration: 1.05, motion: "glide", scale: 1.08 },
  turtle: { src: `${creaturePath}/turtle-sheet.png`, frames: 4, frameDuration: 1.45, motion: "paddle", scale: 1.2 },
  jellyfish: { src: `${creaturePath}/jellyfish-sheet.png`, frames: 4, frameDuration: 1.7, motion: "pulse", scale: 1.18 },
  seahorse: { src: `${creaturePath}/seahorse-sheet.png`, frames: 4, frameDuration: 1.25, motion: "hover", scale: 1.05 },
  crab: { src: `${creaturePath}/crab-sheet.png`, frames: 4, frameDuration: 0.95, motion: "crawl", scale: 1.06 },
  octopus: { src: `${creaturePath}/octopus-sheet.png`, frames: 4, frameDuration: 1.5, motion: "hover", scale: 1.12 },
  dolphin: { src: `${creaturePath}/dolphin-sheet.png`, frames: 4, frameDuration: 1.1, motion: "sweep", scale: 1.26 },
  starfish: { src: `${creaturePath}/starfish-sheet.png`, frames: 4, frameDuration: 1.8, motion: "crawl", scale: 0.94 },
  pufferfish: { src: `${creaturePath}/pufferfish-sheet.png`, frames: 4, frameDuration: 1.2, motion: "pulse", scale: 1.08 },
  whale: { src: `${creaturePath}/whale-sheet.png`, frames: 4, frameDuration: 1.55, motion: "sweep", scale: 1.34 },
  shrimp: { src: `${creaturePath}/shrimp-sheet.png`, frames: 4, frameDuration: 0.9, motion: "glide", scale: 1.04 },
  ray: { src: `${creaturePath}/ray-sheet.png`, frames: 4, frameDuration: 1.45, motion: "sweep", scale: 1.32 },
} satisfies Record<CreatureType, CreatureSpriteMeta>;

export function getCreatureMotion(creature: CreatureType) {
  return CREATURE_SPRITES[creature].motion;
}

export function getCreatureScale(creature: CreatureType) {
  return CREATURE_SPRITES[creature].scale;
}

interface CreatureSpriteProps {
  creature: CreatureType;
  size?: number;
  facing?: "left" | "right";
  className?: string;
}

export default function CreatureSprite({
  creature,
  size = 64,
  facing = "right",
  className = "",
}: CreatureSpriteProps) {
  const meta = CREATURE_SPRITES[creature];
  const displaySize = Math.round(size * meta.scale);
  const style = {
    "--creature-size": `${displaySize}px`,
    "--creature-frame-duration": `${meta.frameDuration}s`,
    backgroundImage: `url(${meta.src})`,
  } as CSSProperties;

  return (
    <span
      className={[
        "creature-sprite-shell",
        `creature-sprite-motion-${meta.motion}`,
        `creature-sprite-${creature}`,
        facing === "left" ? "is-facing-left" : "is-facing-right",
        className,
      ].join(" ")}
      style={style}
    >
      <span className="creature-sprite-depth">
        <span className="creature-sprite-frame" aria-hidden="true" />
        <span className="creature-sprite-fallback" aria-hidden="true">
          <CreatureSVG creature={creature} size={displaySize} />
        </span>
        <span className="creature-sprite-highlight" aria-hidden="true" />
      </span>
    </span>
  );
}
