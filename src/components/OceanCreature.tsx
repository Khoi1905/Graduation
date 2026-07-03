"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { type CreatureType } from "@/types/guest";
import CreatureSprite from "@/components/CreatureSprite";

interface Props {
  name: string;
  creature: CreatureType;
  avatar: string | null;
  index: number;
  total: number;
  isHighlighted?: boolean;
  message?: string | null;
  fullMessage?: string | null;
  hasDetail?: boolean;
  onSelect?: () => void;
}

const MESSAGE_MAX_CHARS = 90;

type LaneSide = "left" | "right" | "top" | "bottom";

interface CreatureLane {
  side: LaneSide;
  left: number;
  top: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
}

// Lanes stay around the viewport edges so creatures do not pass through the event card.
const LANES: CreatureLane[] = [
  { side: "left", left: 7, top: 18, x1: 8, y1: -4, x2: 18, y2: 4, x3: 7, y3: 10 },
  { side: "right", left: 93, top: 20, x1: -8, y1: -4, x2: -18, y2: 4, x3: -7, y3: 10 },
  { side: "left", left: 10, top: 38, x1: 12, y1: -7, x2: 19, y2: 1, x3: 8, y3: 8 },
  { side: "right", left: 90, top: 40, x1: -12, y1: -7, x2: -19, y2: 1, x3: -8, y3: 8 },
  { side: "left", left: 7, top: 58, x1: 10, y1: -8, x2: 17, y2: 2, x3: 6, y3: 9 },
  { side: "right", left: 93, top: 60, x1: -10, y1: -8, x2: -17, y2: 2, x3: -6, y3: 9 },
  { side: "left", left: 13, top: 74, x1: 11, y1: -8, x2: 18, y2: -2, x3: 7, y3: 4 },
  { side: "right", left: 87, top: 74, x1: -11, y1: -8, x2: -18, y2: -2, x3: -7, y3: 4 },
  { side: "top", left: 20, top: 14, x1: 10, y1: 4, x2: 18, y2: 7, x3: 7, y3: 3 },
  { side: "top", left: 80, top: 14, x1: -10, y1: 4, x2: -18, y2: 7, x3: -7, y3: 3 },
  { side: "top", left: 30, top: 18, x1: -7, y1: 5, x2: -13, y2: 8, x3: -5, y3: 3 },
  { side: "top", left: 70, top: 18, x1: 7, y1: 5, x2: 13, y2: 8, x3: 5, y3: 3 },
  { side: "bottom", left: 20, top: 84, x1: 11, y1: -4, x2: 18, y2: -2, x3: 6, y3: 2 },
  { side: "bottom", left: 80, top: 84, x1: -11, y1: -4, x2: -18, y2: -2, x3: -6, y3: 2 },
  { side: "bottom", left: 32, top: 87, x1: -8, y1: -5, x2: -14, y2: -2, x3: -5, y3: 1 },
  { side: "bottom", left: 68, top: 87, x1: 8, y1: -5, x2: 14, y2: -2, x3: 5, y3: 1 },
];

const HIGHLIGHTED_LANE: CreatureLane = {
  side: "right",
  left: 90,
  top: 24,
  x1: -6,
  y1: 5,
  x2: -13,
  y2: 12,
  x3: -4,
  y3: 18,
};

export default function OceanCreature({
  name,
  creature,
  avatar,
  index,
  total,
  isHighlighted,
  message,
  fullMessage,
  hasDetail,
  onSelect,
}: Props) {
  const initials = name.slice(0, 1).toUpperCase();
  const detailMessage = fullMessage ?? message;
  const isInteractive = Boolean(onSelect && hasDetail);

  const lane = isHighlighted ? HIGHLIGHTED_LANE : LANES[index % LANES.length];
  const leftBase = lane.left;
  const topBase = lane.top;

  const reverseFacing = lane.x1 < 0;
  const swimDuration = isHighlighted ? 24 : 22 + (index % 5) * 3; // 22–34s
  const swimDelay = -((index * 3.3) % swimDuration); // desync các con
  const bobDelay = index * 0.9;
  const bobDuration = 6.5 + (index % 4) * 1.4;

  const animDelay = isHighlighted ? 0.15 : 0.2 + index * 0.28;
  const spriteSize = isHighlighted ? 80 : (total > 10 ? 58 : 68);

  const trimmedMessage = detailMessage?.trim()
    ? detailMessage.trim().length > MESSAGE_MAX_CHARS
      ? `${detailMessage.trim().slice(0, MESSAGE_MAX_CHARS)}…`
      : detailMessage.trim()
    : null;

  return (
    <motion.button
      type="button"
      disabled={!isInteractive}
      aria-label={isInteractive ? `Xem lời chúc của ${name}` : undefined}
      onClick={(event) => {
        if (!isInteractive) return;
        event.stopPropagation();
        onSelect?.();
      }}
      onKeyDown={(event) => {
        if (!isInteractive) return;
        event.stopPropagation();
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.();
        }
      }}
      className={`ocean-creature-3d absolute is-lane-${lane.side} ${reverseFacing ? "is-reverse-lane" : ""} ${isInteractive ? "is-detail-enabled" : "pointer-events-none"} ${isHighlighted ? "is-highlighted" : ""}`}
      style={{
        left: `${leftBase}%`,
        top: `${topBase}%`,
      }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: animDelay, type: "spring", stiffness: 190, damping: 18 }}
    >
      <div
        className="creature-swim"
        style={{
          "--path-x-1": `${lane.x1}vw`,
          "--path-y-1": `${lane.y1}vh`,
          "--path-x-2": `${lane.x2}vw`,
          "--path-y-2": `${lane.y2}vh`,
          "--path-x-3": `${lane.x3}vw`,
          "--path-y-3": `${lane.y3}vh`,
          "--swim-duration": `${swimDuration}s`,
          "--swim-delay": `${swimDelay}s`,
        } as CSSProperties}
      >
        <div
          className="creature-bob flex flex-col items-center gap-0"
          style={{
            "--bob-delay": `${bobDelay}s`,
            "--bob-duration": `${bobDuration}s`,
          } as CSSProperties}
        >
          {trimmedMessage && (
            <motion.span
              className="creature-message-bubble"
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: animDelay + 0.6 }}
            >
              {trimmedMessage}
            </motion.span>
          )}

          <div
            className="avatar-bubble-3d w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium border-2 border-white/50 overflow-hidden"
            style={{
              background: avatar ? "transparent" : "linear-gradient(145deg, rgba(255,255,255,0.58), rgba(92,150,172,0.34))",
              backdropFilter: "blur(4px)",
              color: "rgba(10,22,40,0.72)",
            }}
          >
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>

          <span
            className={`creature-facing -mt-1 ${reverseFacing ? "is-facing-reverse" : ""}`}
            style={{
              "--swim-duration": `${swimDuration}s`,
              "--swim-delay": `${swimDelay}s`,
            } as CSSProperties}
          >
            <CreatureSprite
              creature={creature}
              size={spriteSize}
              facing="right"
              className="creature-guest-sprite"
            />
          </span>

          <span className="creature-label-3d text-[10px] text-ocean-deep/76 font-sans whitespace-nowrap">
            {name}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
