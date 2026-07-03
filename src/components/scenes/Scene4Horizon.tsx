"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import type { Guest } from "@/types/guest";
import RSVPForm from "@/components/RSVPForm";
import DownloadCard from "@/components/DownloadCard";
import AboveWaterScenery from "./AboveWaterScenery";

interface Props {
  guest: Guest;
  onRsvpComplete?: (status: "confirmed" | "declined") => void;
  rsvpDone?: boolean;
  transitionSettling?: boolean;
}

type CardVariant = "paper" | "teal";

function Scene4CardDecor({ variant }: { variant: CardVariant }) {
  return (
    <>
      <svg className="scene4-card-fold" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path className="scene4-card-fold-shadow" d="M64 0v64H0C22 56 48 34 64 0Z" />
        <path className="scene4-card-fold-face" d="M64 18v46H18c18-8 34-24 46-46Z" />
      </svg>

      <svg className="scene4-card-decor scene4-card-leaf-tape" viewBox="0 0 72 70" aria-hidden="true" focusable="false">
        <path className="leaf-tape-stem" d="M30 62C33 45 34 28 31 10" />
        <path className="leaf-tape-leaf" d="M31 20C18 15 12 19 8 31c12 3 20 0 23-11Z" />
        <path className="leaf-tape-leaf" d="M34 28c12-9 21-8 29 2-10 9-20 8-29-2Z" />
        <path className="leaf-tape-leaf" d="M31 40c-12-6-20-3-27 8 12 6 22 3 27-8Z" />
        <path className="leaf-tape-leaf" d="M35 50c11-7 20-5 28 4-11 8-21 7-28-4Z" />
      </svg>

      <svg className="scene4-card-decor scene4-card-cap" viewBox="0 0 78 56" aria-hidden="true" focusable="false">
        <path className="cap-board" d="M39 5 72 20 39 36 6 20Z" />
        <path className="cap-base" d="M24 30h30v13c-9 7-21 7-30 0Z" />
        <path className="cap-tassel" d="M55 24c10 5 14 12 12 23" />
        <circle className="cap-knot" cx="55" cy="24" r="3" />
        <path className="cap-tail" d="M67 47h8" />
      </svg>

      <svg
        className={`scene4-card-decor scene4-card-scroll scene4-card-scroll-${variant}`}
        viewBox="0 0 92 42"
        aria-hidden="true"
        focusable="false"
      >
        <path className="scroll-paper" d="M16 9h60c8 0 13 6 13 12s-5 12-13 12H16C8 33 3 27 3 21S8 9 16 9Z" />
        <circle className="scroll-roll" cx="16" cy="21" r="12" />
        <circle className="scroll-roll" cx="76" cy="21" r="12" />
        <path className="scroll-ribbon" d="M38 12 49 30l7-9 8 9-11-18" />
      </svg>
    </>
  );
}

function GlassCard({
  children,
  delay,
  variant = "paper",
  className = "",
}: {
  children: ReactNode;
  delay: number;
  variant?: CardVariant;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      className={`glass-card-3d scene4-glass-card scene4-glass-card-${variant} relative z-10 w-full max-w-md rounded-2xl p-6 md:p-8 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
    >
      <Scene4CardDecor variant={variant} />
      <div className="scene4-card-content">{children}</div>
    </motion.div>
  );
}

export default function Scene4Horizon({ guest, onRsvpComplete, rsvpDone, transitionSettling = false }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className={`scene4-horizon-section min-h-[115vh] flex flex-col items-center justify-start px-6 pb-[32vh] relative overflow-hidden ${transitionSettling ? "is-transition-settling" : ""}`}
    >
      <AboveWaterScenery />
      <div className="arrival-light-veil" aria-hidden="true" />
      <div className="scene4-paper-sky-wash" aria-hidden="true" />
      <div className="scene4-paper-vignette" aria-hidden="true" />

      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-8 md:gap-10 relative z-10">
        <GlassCard delay={0} variant="paper" className="scene4-rsvp-card">
          <RSVPForm guest={guest} onRsvpComplete={onRsvpComplete} rsvpDone={rsvpDone} />
        </GlassCard>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <DownloadCard guest={guest} />
        </motion.div>

        <motion.p
          className="relative z-10 text-ocean-deep/55 text-sm font-sans text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
        </motion.p>
      </div>
    </section>
  );
}
