"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Guest } from "@/types/guest";
import UnderwaterScenery from "./UnderwaterScenery";

interface Props {
  guest: Guest;
  scrollProgress: number;
  started: boolean;
}

function TypeWriter({
  text,
  delay = 0,
  speed = 70,
  active,
}: {
  text: string;
  delay?: number;
  speed?: number;
  active: boolean;
}) {
  const [done, setDone] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    const el = textRef.current;
    if (!el) return;

    let i = 0;
    let lastTime = 0;

    const step = (time: number) => {
      if (!lastTime) lastTime = time;
      if (time - lastTime >= speed) {
        i += 1;
        lastTime = time;
        el.textContent = text.slice(0, i);
      }

      if (i < text.length) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDone(true);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [text, speed]);

  useEffect(() => {
    const el = textRef.current;
    if (el) el.textContent = "";
    setDone(false);

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (!active) return;

    const timer = window.setTimeout(animate, delay);
    return () => {
      window.clearTimeout(timer);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [active, delay, animate]);

  return (
    <span>
      <span ref={textRef} />
      {active && !done && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-ocean-cream/60 ml-1 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </span>
  );
}

function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-ocean-cream/30 text-sm tracking-widest uppercase">
            Cuộn xuống
          </span>
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-ocean-cream/30"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function getScene1SubjectPronoun(pronoun: Guest["pronoun"]) {
  if (pronoun === "anh" || pronoun === "chị") return "em";
  if (pronoun === "em") return "anh";
  return "mình";
}

const INTRO_LINE_REVEAL_GAP = 0.85;

export default function Scene1DeepSea({ guest, scrollProgress, started }: Props) {
  const opacity = scrollProgress < 0.18 ? 1 : Math.max(0, 1 - (scrollProgress - 0.18) * 6);
  const [showSubtext, setShowSubtext] = useState(false);
  const subjectPronoun = getScene1SubjectPronoun(guest.pronoun);
  const introLines = [
    `Từ ngày bước chân vào đại học, điều đầu tiên ${subjectPronoun} cảm nhận được là áp lực.`,
    "Thứ áp lực âm ỉ, thường trực, giống như đang ở dưới đáy đại dương, tối tăm, ngột ngạt và chẳng hề có phương hướng.",
    `Nhưng rồi ${subjectPronoun} vẫn cứ đi, cứ tìm đường trong chính những mơ hồ ấy.`,
    `Bởi khi đã từng ở dưới đáy, ${subjectPronoun} nhận ra rằng chỉ cần không dừng lại, đường nào cũng sẽ là đường đi lên.`,
  ];

  useEffect(() => {
    setShowSubtext(false);
    if (!started) return;

    const timer = window.setTimeout(() => setShowSubtext(true), 2200);
    return () => window.clearTimeout(timer);
  }, [started]);

  return (
    <section
      className="h-[100vh] flex items-center justify-center px-6 relative overflow-hidden"
      style={{ opacity }}
    >
      <UnderwaterScenery variant="deep" />

      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, transparent 20%, rgba(2, 5, 12, ${0.85 * (1 - scrollProgress)}) 100%)`,
        }}
      />

      <div className="text-center w-full max-w-4xl relative z-10">
        <div
          className="absolute inset-0 -inset-x-20 -inset-y-10 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 50% 40% at 50% 45%, rgba(80, 160, 220, 0.12) 0%, transparent 70%)",
          }}
        />

        <h1 className="font-serif text-4xl md:text-6xl mb-8 relative">
          <span
            className="relative"
            style={{
              textShadow: "0 0 60px rgba(100, 200, 255, 0.4), 0 0 120px rgba(100, 200, 255, 0.15)",
            }}
          >
            <TypeWriter text={`Gửi ${guest.display},`} delay={800} speed={100} active={started} />
          </span>
        </h1>

        <AnimatePresence>
          {showSubtext && (
            <motion.div
              className="scene1-intro-copy mx-auto"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 1.2 }}
              style={{
                textShadow: "0 0 30px rgba(100, 200, 255, 0.2)",
              }}
            >
              {introLines.map((line, index) => (
                <motion.p
                  key={line}
                  className="font-serif"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1,
                    delay: index * INTRO_LINE_REVEAL_GAP,
                    ease: "easeOut",
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScrollHint visible={started && scrollProgress < 0.03} />
    </section>
  );
}
