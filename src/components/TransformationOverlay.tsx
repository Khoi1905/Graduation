"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CreatureType } from "@/types/guest";
import { CREATURE_NAME_VI } from "@/types/guest";
import CreatureSprite from "@/components/CreatureSprite";
import AboveWaterScenery from "@/components/scenes/AboveWaterScenery";

interface Props {
  active: boolean;
  creature: CreatureType;
  creatureMsg: string | null;
  guestName: string;
  onDiveStart?: () => void;
  onComplete: () => void;
}

type TransformPhase = "warmReveal" | "reading" | "dive";

function WarmRays() {
  return (
    <div className="transform-rays transform-rays-warm" aria-hidden="true">
      {Array.from({ length: 7 }, (_, index) => (
        <span
          key={index}
          className="transform-ray transform-ray-warm"
          style={{ "--ray-i": index } as CSSProperties}
        />
      ))}
    </div>
  );
}

function WarmMotes() {
  const motes = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        left: 18 + ((index * 17) % 68),
        top: 18 + ((index * 23) % 56),
        delay: (index % 6) * 0.18,
        size: 5 + (index % 4) * 2,
      })),
    [],
  );

  return (
    <div className="transform-warm-motes" aria-hidden="true">
      {motes.map((mote) => (
        <span
          key={mote.id}
          className="transform-warm-mote"
          style={{
            left: `${mote.left}%`,
            top: `${mote.top}%`,
            width: `${mote.size}px`,
            height: `${mote.size}px`,
            animationDelay: `${mote.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function DiveSplash() {
  return (
    <div className="transform-dive-splash" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => (
        <span
          key={index}
          style={
            {
              "--splash-i": index,
              "--splash-x": `${(index - 5.5) * 10}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default function TransformationOverlay({
  active,
  creature,
  creatureMsg,
  guestName,
  onDiveStart,
  onComplete,
}: Props) {
  const [phase, setPhase] = useState<TransformPhase>("warmReveal");

  useEffect(() => {
    if (!active) {
      setPhase("warmReveal");
      return;
    }

    setPhase("warmReveal");
    const timer = window.setTimeout(() => setPhase("reading"), 1450);
    return () => window.clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    if (!active || phase !== "dive") return;
    const timer = window.setTimeout(onComplete, 1700);
    return () => window.clearTimeout(timer);
  }, [active, phase, onComplete]);

  const startDive = () => {
    if (phase !== "reading") return;
    onDiveStart?.();
    setPhase("dive");
  };

  const isDive = phase === "dive";
  const creatureMotion = isDive
    ? {
        x: ["0vw", "7vw", "14vw"],
        y: ["0vh", "-15vh", "43vh"],
        scale: [1, 1.12, 0.42],
        rotate: [0, 8, 22],
        opacity: [1, 1, 0],
      }
    : {
        x: "0vw",
        y: "0vh",
        scale: phase === "warmReveal" ? 0.92 : 1,
        rotate: 0,
        opacity: phase === "warmReveal" ? 0.82 : 1,
      };

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className={`transform-overlay transform-overlay-${phase}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="transform-arrival-backdrop" aria-hidden="true">
            <AboveWaterScenery />
          </div>
          <div className="transform-warm-veil" aria-hidden="true" />
          <WarmRays />
          <WarmMotes />

          <div className="transform-center">
            <motion.div
              className="transform-creature-wrap transform-creature-wrap-warm"
              initial={{ scale: 0.36, opacity: 0, y: 18 }}
              animate={creatureMotion}
              transition={
                isDive
                  ? { duration: 1.35, ease: [0.28, 0.66, 0.24, 1] }
                  : { duration: 0.85, ease: "easeOut" }
              }
            >
              <div className="transform-creature-glow" />
              <CreatureSprite creature={creature} size={132} className="transform-creature-sprite" />
            </motion.div>

            {isDive && <DiveSplash />}

            <AnimatePresence>
              {phase === "reading" && (
                <motion.div
                  className="transform-text transform-text-reading"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45 }}
                >
                  <p className="transform-creature-name">
                    {guestName}, giờ {guestName === "Bạn" ? "bạn" : "cậu"} là một{" "}
                    <strong>{CREATURE_NAME_VI[creature]}</strong>
                  </p>
                  {creatureMsg && (
                    <p className="transform-creature-msg">&ldquo;{creatureMsg}&rdquo;</p>
                  )}
                  <button type="button" className="transform-dive-button" onClick={startDive}>
                    Thả xuống biển
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
