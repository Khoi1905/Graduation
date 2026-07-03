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
      {Array.from({ length: 9 }, (_, index) => (
        <span
          key={index}
          className="transform-ray transform-ray-warm"
          style={{ "--ray-i": index } as CSSProperties}
        />
      ))}
    </div>
  );
}

function ColorAurora() {
  return (
    <div className="transform-color-aurora" aria-hidden="true">
      <span className="transform-color-aurora-a" />
      <span className="transform-color-aurora-b" />
      <span className="transform-color-aurora-c" />
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

function TransformBurst() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        angle: index * 20,
        distance: 58 + (index % 5) * 15,
        delay: 0.08 + (index % 6) * 0.06,
        size: 4 + (index % 3) * 2,
      })),
    [],
  );

  return (
    <div className="transform-burst" aria-hidden="true">
      <span className="transform-burst-wave transform-burst-wave-a" />
      <span className="transform-burst-wave transform-burst-wave-b" />
      <span className="transform-burst-orbit transform-burst-orbit-a" />
      <span className="transform-burst-orbit transform-burst-orbit-b" />
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="transform-spark"
          style={
            {
              "--spark-angle": `${spark.angle}deg`,
              "--spark-distance": `${spark.distance}px`,
              "--spark-delay": `${spark.delay}s`,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
            } as CSSProperties
          }
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
    const timer = window.setTimeout(onComplete, 1850);
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
        x: ["0vw", "2vw", "8vw", "14vw"],
        y: ["0vh", "-8vh", "12vh", "52vh"],
        scale: [1, 1.08, 0.78, 0.34],
        rotate: [0, 4, 14, 24],
        opacity: [1, 1, 0.86, 0],
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
          <ColorAurora />
          <WarmRays />
          <WarmMotes />

          <div className="transform-center">
            <motion.div
              className="transform-creature-wrap transform-creature-wrap-warm"
              initial={{ scale: 0.36, opacity: 0, y: 18 }}
              animate={creatureMotion}
              transition={
                isDive
                  ? { duration: 1.55, ease: [0.22, 0.74, 0.24, 1] }
                  : { duration: 0.85, ease: "easeOut" }
              }
            >
              <TransformBurst />
              <div className="transform-creature-color-ring transform-creature-color-ring-a" />
              <div className="transform-creature-color-ring transform-creature-color-ring-b" />
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
