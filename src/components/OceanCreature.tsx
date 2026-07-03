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
}

const MESSAGE_MAX_CHARS = 90;

// Các "làn" bơi trải quanh màn hình — mỗi làn có gốc trái/trên riêng để creature
// không chồng lên nhau. roamX luôn dương (đều bơi sang phải trước) nên chỉ cần MỘT
// keyframe lật hướng dùng chung, đảm bảo mặt luôn quay đúng chiều di chuyển.
const LANES: Array<{ left: number; top: number }> = [
  { left: 8, top: 16 },
  { left: 40, top: 12 },
  { left: 14, top: 46 },
  { left: 46, top: 40 },
  { left: 10, top: 68 },
  { left: 48, top: 66 },
  { left: 26, top: 28 },
  { left: 34, top: 56 },
];

export default function OceanCreature({ name, creature, avatar, index, total, isHighlighted, message }: Props) {
  const initials = name.slice(0, 1).toUpperCase();

  const lane = LANES[index % LANES.length];
  const leftBase = isHighlighted ? 63 : lane.left;
  const topBase = isHighlighted ? 22 : lane.top;

  // Biên độ bơi ngang (vw) + trôi dọc (vh) — biến thiên theo index cho tự nhiên.
  const roamX = isHighlighted ? 11 : 18 + (index % 4) * 3; // 18–27vw
  const roamYUp = isHighlighted ? -3 : -(2 + (index % 3)); // -2..-4vh
  const roamYDown = isHighlighted ? 2 : 1 + (index % 2) * 2; // 1 hoặc 3vh
  const swimDuration = isHighlighted ? 24 : 22 + (index % 5) * 3; // 22–34s
  const swimDelay = -((index * 3.3) % swimDuration); // desync các con
  const bobDelay = index * 0.9;
  const bobDuration = 6.5 + (index % 4) * 1.4;

  const animDelay = isHighlighted ? 0.15 : 0.2 + index * 0.28;
  const spriteSize = isHighlighted ? 80 : (total > 10 ? 58 : 68);

  const trimmedMessage = message?.trim()
    ? message.trim().length > MESSAGE_MAX_CHARS
      ? `${message.trim().slice(0, MESSAGE_MAX_CHARS)}…`
      : message.trim()
    : null;

  return (
    <motion.div
      className={`ocean-creature-3d absolute pointer-events-none ${isHighlighted ? "is-highlighted" : ""}`}
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
          "--roam-x": `${roamX}vw`,
          "--roam-y-up": `${roamYUp}vh`,
          "--roam-y-down": `${roamYDown}vh`,
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
            className="creature-facing -mt-1"
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
    </motion.div>
  );
}
