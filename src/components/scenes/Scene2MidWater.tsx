"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Guest } from "@/types/guest";
import UnderwaterScenery from "./UnderwaterScenery";

interface Props {
  guest: Guest;
  scrollProgress: number;
}

const DEFAULT_MESSAGE = [
  "Bốn năm - nghe thì ngắn, nhưng đủ để thay đổi cách mình nhìn mọi thứ.",
  "Có những đêm tưởng không qua nổi, có những kỳ thi tưởng không kịp,\ncó những lúc tự hỏi mình đang ở đây làm gì.",
  "Nhưng rồi cũng đến đây - nơi mà ánh sáng bắt đầu lọt qua,\nvà mình nhận ra mọi thứ phía dưới đều có ý nghĩa của nó.",
];

const LINE_REVEAL_GAP = 1.35;

function splitStoryLines(message: string[]) {
  return message.flatMap((paragraph, paragraphIndex) => {
    const lines = paragraph
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return lines.map((line, lineIndex) => ({
      text: line,
      paragraphEnd: lineIndex === lines.length - 1 && paragraphIndex < message.length - 1,
    }));
  });
}

export default function Scene2MidWater({ guest, scrollProgress: _scrollProgress }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const paragraphs = guest.msg ? guest.msg.split("\n\n") : DEFAULT_MESSAGE;
  const storyLines = splitStoryLines(paragraphs);

  return (
    <section
      ref={ref}
      className="min-h-[120vh] flex items-center justify-center px-6 py-20 relative overflow-hidden"
    >
      <UnderwaterScenery variant="mid" />

      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none z-[1]"
        style={{
          background: "linear-gradient(180deg, rgba(10,22,40,0.3) 0%, transparent 100%)",
        }}
      />

      <div className="scene2-story-copy max-w-2xl text-center relative z-10 lg:ml-auto lg:mr-[9vw]">
        <motion.div
          className="w-12 h-[1px] mx-auto mb-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(136,204,238,0.6), transparent)" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2 }}
        />

        {storyLines.map((line, i) => (
          <motion.p
            key={`${line.text}-${i}`}
            className={`font-serif text-xl md:text-2xl leading-relaxed text-ocean-cream/90 ${line.paragraphEnd ? "mb-8" : "mb-4"} last:mb-0`}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 1.15,
              delay: 0.5 + i * LINE_REVEAL_GAP,
              ease: "easeOut",
            }}
            style={{
              textShadow: "0 0 30px rgba(100, 200, 255, 0.15)",
            }}
          >
            {line.text}
          </motion.p>
        ))}

        <motion.div
          className="w-12 h-[1px] mx-auto mt-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(136,204,238,0.6), transparent)" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.5 + storyLines.length * LINE_REVEAL_GAP }}
        />
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none z-[1]"
        style={{
          background: "linear-gradient(0deg, rgba(91,143,168,0.2) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}
