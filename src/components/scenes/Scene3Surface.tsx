"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useMemo, useId, useState, useEffect, type CSSProperties } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import OceanCreature from "@/components/OceanCreature";
import CreatureSprite from "@/components/CreatureSprite";
import guestsData from "../../../data/guests.json";
import type { CreatureType, Guest } from "@/types/guest";
import UnderwaterScenery from "./UnderwaterScenery";

interface Props {
  scrollProgress: number;
  guest?: Guest;
  rsvpConfirmed?: boolean;
  deferCreatureMount?: boolean;
}

interface GuestEntry {
  key: string;
  display: string;
  creature: CreatureType;
  avatar: string | null;
}

interface RsvpRow {
  guest_key?: string | null;
  display_name?: string | null;
  attendance?: string | null;
  note?: string | null;
  avatar_url?: string | null;
}

interface CreatureDetail {
  name: string;
  creature: CreatureType;
  avatar: string | null;
  message: string | null;
  isHighlighted?: boolean;
}

const dioramaObjects = [
  { src: "/art/dive/objects/kelp-cluster.svg", className: "scene3-diorama-object scene3-depth-kelp scene3-depth-kelp-left" },
  { src: "/art/dive/objects/kelp-cluster.svg", className: "scene3-diorama-object scene3-depth-kelp scene3-depth-kelp-right" },
  { src: "/art/dive/objects/coral-garden.svg", className: "scene3-diorama-object scene3-depth-coral scene3-depth-coral-left" },
  { src: "/art/dive/objects/coral-garden.svg", className: "scene3-diorama-object scene3-depth-coral scene3-depth-coral-right" },
] as const;

function Scene3Diorama() {
  return (
    <div className="scene3-diorama absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="scene3-photo-texture scene3-surface-photo-band" />
      <div className="scene3-photo-texture scene3-photo-edge scene3-photo-edge-left" />
      <div className="scene3-photo-texture scene3-photo-edge scene3-photo-edge-right" />
      <div className="scene3-photo-depth-grade" />
      {dioramaObjects.map((object) => (
        <img key={object.className} src={object.src} alt="" draggable={false} className={object.className} />
      ))}
      <div className="scene3-diorama-foreground scene3-bottom-veil" />
    </div>
  );
}

function WaterSurface() {
  const id = useId();

  return (
    <div className="scene3-surface-ceiling surface-ceiling-3d absolute inset-x-0 top-0 h-[34vh] pointer-events-none z-[4] overflow-hidden water-surface-3d">
      <div className="scene3-surface-light-core" />
      <div className="scene3-surface-ray-fan scene3-surface-ray-fan-1" />
      <div className="scene3-surface-ray-fan scene3-surface-ray-fan-2" />
      <div className="surface-rim-glow" />
      <div className="surface-top-foam surface-top-foam-1" />
      <div className="surface-top-foam surface-top-foam-2" />
      <div className="scene3-surface-shimmer scene3-surface-shimmer-1" />
      <div className="scene3-surface-shimmer scene3-surface-shimmer-2" />
      <svg
        className="scene3-surface-wave wave-move absolute inset-x-0 top-0 w-[200%] h-full"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`surface-grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(225,245,255,0.68)" />
            <stop offset="45%" stopColor="rgba(150,215,245,0.28)" />
            <stop offset="100%" stopColor="rgba(120,190,240,0)" />
          </linearGradient>
        </defs>
        <path
          d="M0,20 C120,35 240,8 360,20 C480,32 600,5 720,18 C840,31 960,8 1080,22 C1200,36 1320,5 1440,20 L1440,0 L0,0 Z"
          fill={`url(#surface-grad-${id})`}
        />
      </svg>
      <svg
        className="scene3-surface-wave scene3-surface-wave-soft wave-move absolute inset-0 w-[200%] h-full"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ animationDelay: "-4s", animationDuration: "12s" }}
      >
        <path
          d="M0,15 C180,30 360,5 540,18 C720,31 900,8 1080,20 C1260,32 1440,10 1440,15 L1440,0 L0,0 Z"
          fill="rgba(160,210,250,0.15)"
        />
      </svg>
      <div className="surface-caustic-line surface-caustic-line-1" />
      <div className="surface-caustic-line surface-caustic-line-2" />
    </div>
  );
}

function SunRays() {
  return (
    <div className="scene3-sun-rays absolute inset-x-0 top-0 h-full pointer-events-none overflow-hidden z-[3]">
      <div
        className="scene3-surface-light-wash absolute inset-x-0 top-0 h-[48%]"
        style={{
          background: "linear-gradient(180deg, rgba(230,250,255,0.32) 0%, rgba(177,226,235,0.12) 42%, transparent 100%)",
        }}
      />

      {[
        { left: "16%", width: "180px", opacity: 0.085, delay: 0, skew: -18 },
        { left: "34%", width: "260px", opacity: 0.09, delay: 1.2, skew: -8 },
        { left: "50%", width: "300px", opacity: 0.1, delay: 0.6, skew: 2 },
        { left: "66%", width: "250px", opacity: 0.08, delay: 2, skew: 12 },
        { left: "82%", width: "170px", opacity: 0.072, delay: 0.4, skew: 22 },
      ].map((ray, i) => (
        <div
          key={i}
          className="absolute top-0 sun-ray scene3-light-shaft"
          style={{
            left: ray.left,
            width: ray.width,
            height: "92%",
            background: `linear-gradient(180deg, rgba(244,252,235,${ray.opacity * 2.3}) 0%, rgba(177,226,235,${ray.opacity}) 34%, transparent 100%)`,
            transform: `skewX(${ray.skew}deg) rotate(${ray.skew * 0.25}deg)`,
            "--skew": `${ray.skew}deg`,
            animationDelay: `${ray.delay}s`,
            filter: "blur(12px)",
          } as CSSProperties}
        />
      ))}

      {[
        { left: "18%", top: "29%", width: 180, rotate: -9 },
        { left: "43%", top: "37%", width: 145, rotate: 5 },
        { left: "66%", top: "25%", width: 170, rotate: 11 },
        { left: "34%", top: "56%", width: 118, rotate: -4 },
      ].map((spot, i) => (
        <div
          key={`c-${i}`}
          className="absolute caustic-shimmer scene3-caustic-streak"
          style={{
            left: spot.left,
            top: spot.top,
            width: spot.width,
            rotate: `${spot.rotate}deg`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${3 + i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

function CountdownCard({ value, label, delay }: { value: number; label: string; delay: number }) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      <div
        className="countdown-tile-3d rounded-xl px-4 py-3 md:px-6 md:py-4 backdrop-blur-md"
        style={{
          background: "linear-gradient(145deg, rgba(238,250,255,0.78), rgba(85,132,152,0.22))",
          border: "1px solid rgba(255,255,255,0.42)",
        }}
      >
        <div className="font-serif text-3xl md:text-5xl text-ocean-deep font-bold tabular-nums">
          {String(value).padStart(2, "0")}
        </div>
      </div>
      <div className="text-xs md:text-sm text-ocean-deep/50 mt-2 tracking-wider uppercase">
        {label}
      </div>
    </motion.div>
  );
}

function CreatureDetailPanel({ detail, onClose }: { detail: CreatureDetail | null; onClose: () => void }) {
  const initials = detail?.name.slice(0, 1).toUpperCase() ?? "";
  const message = detail?.message?.trim();

  return (
    <AnimatePresence>
      {detail && (
        <>
          <motion.button
            type="button"
            className="scene3-creature-detail-backdrop"
            aria-label="Đóng lời chúc"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            className={`scene3-creature-detail-panel ${detail.isHighlighted ? "is-highlighted" : ""}`}
            role="dialog"
            aria-label={`Lời chúc của ${detail.name}`}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 0.74, 0.24, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="scene3-creature-detail-close"
              aria-label="Đóng"
              onClick={onClose}
            >
              ×
            </button>

            <div className="scene3-creature-detail-photo">
              {detail.avatar ? (
                <img src={detail.avatar} alt={`Ảnh của ${detail.name}`} />
              ) : (
                <div className="scene3-creature-detail-avatar-fallback">
                  <span>{initials}</span>
                  <CreatureSprite creature={detail.creature} size={86} facing="right" />
                </div>
              )}
            </div>

            <div className="scene3-creature-detail-copy">
              <p className="scene3-creature-detail-eyebrow">Lời chúc từ đại dương</p>
              <h3>{detail.name}</h3>
              <div className="scene3-creature-detail-creature" aria-hidden="true">
                <CreatureSprite creature={detail.creature} size={34} facing="right" />
                <span>Sinh vật của {detail.name}</span>
              </div>
              <p className="scene3-creature-detail-message">
                {message || "Chưa có lời chúc, nhưng ảnh của bạn đã bơi cùng lời mời này."}
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Scene3Surface({ scrollProgress, guest, rsvpConfirmed, deferCreatureMount = false }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const countdown = useCountdown();
  const currentGuestKey = guest?.key ?? null;
  const hasHighlightedGuest = Boolean(rsvpConfirmed && guest);
  const [rsvpCreatures, setRsvpCreatures] = useState<GuestEntry[]>([]);
  const [guestNotes, setGuestNotes] = useState<Record<string, string>>({});
  const [guestAvatars, setGuestAvatars] = useState<Record<string, string>>({});
  const [ownNote, setOwnNote] = useState<string | null>(null);
  const [ownAvatar, setOwnAvatar] = useState<string | null>(null);
  const [creaturesReady, setCreaturesReady] = useState(!deferCreatureMount);
  const [selectedCreatureDetail, setSelectedCreatureDetail] = useState<CreatureDetail | null>(null);

  const guestDirectory = useMemo(() => {
    const directory: Record<string, GuestEntry> = {};
    for (const [key, val] of Object.entries(guestsData as Record<string, Record<string, unknown>>)) {
      if (key === "default") continue;
      directory[key] = {
        key,
        display: val.display as string,
        creature: (val.creature as CreatureType) || "clownfish",
        avatar: (val.avatar as string) || null,
      };
    }
    return directory;
  }, []);

  useEffect(() => {
    if (deferCreatureMount) {
      setCreaturesReady(false);
      return;
    }

    const timer = window.setTimeout(() => setCreaturesReady(true), 220);
    return () => window.clearTimeout(timer);
  }, [deferCreatureMount]);

  useEffect(() => {
    if (!creaturesReady) return;
    let cancelled = false;

    try {
      setOwnNote(currentGuestKey ? localStorage.getItem(`rsvp_note:${currentGuestKey}`) : null);
      setOwnAvatar(currentGuestKey ? localStorage.getItem(`rsvp_avatar:${currentGuestKey}`) : null);
    } catch {}

    void (async () => {
      try {
        const { getSupabase } = await import("@/lib/supabase");
        const { data } = await getSupabase()
          .from("rsvp")
          .select("guest_key, display_name, attendance, note, avatar_url, created_at")
          .eq("attendance", "yes")
          .order("created_at", { ascending: false });
        if (cancelled || !data) return;
        const entries: GuestEntry[] = [];
        const notes: Record<string, string> = {};
        const avatars: Record<string, string> = {};
        const seen = new Set<string>();

        for (const row of data as RsvpRow[]) {
          const key = typeof row.guest_key === "string" ? row.guest_key : "";
          if (!key || key === "default" || seen.has(key)) continue;
          seen.add(key);

          const metadata = guestDirectory[key];
          const displayName = typeof row.display_name === "string" && row.display_name.trim()
            ? row.display_name.trim()
            : metadata?.display ?? key;
          const avatarUrl = typeof row.avatar_url === "string" && row.avatar_url.trim()
            ? row.avatar_url
            : metadata?.avatar ?? null;

          entries.push({
            key,
            display: displayName,
            creature: metadata?.creature ?? "clownfish",
            avatar: avatarUrl,
          });

          if (row.note && typeof row.note === "string" && row.note.trim()) {
            notes[key] = row.note.trim();
          }
          if (avatarUrl) {
            avatars[key] = avatarUrl;
          }
        }
        setRsvpCreatures(entries);
        setGuestNotes(notes);
        setGuestAvatars(avatars);
      } catch {
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [creaturesReady, currentGuestKey, guestDirectory]);

  const creatures = useMemo(() => {
    if (!hasHighlightedGuest || !currentGuestKey) return rsvpCreatures;
    return rsvpCreatures.filter((entry) => entry.key !== currentGuestKey);
  }, [currentGuestKey, hasHighlightedGuest, rsvpCreatures]);
  const totalCreatures = creatures.length + (hasHighlightedGuest ? 1 : 0);
  const highlightedAvatar = guest ? ownAvatar ?? guestAvatars[guest.key] ?? guest.avatar : null;
  const highlightedMessage = guest ? ownNote ?? guestNotes[guest.key] ?? null : null;
  const highlightedHasDetail = Boolean(highlightedAvatar || highlightedMessage?.trim());

  useEffect(() => {
    if (!selectedCreatureDetail) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedCreatureDetail(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCreatureDetail]);

  const infoItems = [
    { text: "Chủ nhật, 05 tháng 7, 2026", className: "font-semibold" },
    { text: "14:30 chiều", className: "" },
    { text: "Hội trường Nguyễn Văn Đạo", className: "" },
  ];

  return (
    <section
      ref={ref}
      className="scene3-surface-section min-h-[130vh] flex items-center justify-center px-6 py-24 relative overflow-hidden"
    >
      <UnderwaterScenery variant="surface" />

      <Scene3Diorama />
      <div className="scene3-card-safe-glow absolute inset-0 pointer-events-none z-[5]" />

      {/* Water surface at top — gợn sóng mặt biển */}
      <WaterSurface />

      {/* Sun rays / god rays chiếu xuống từ mặt biển */}
      <SunRays />

      {/* Ocean creatures swimming around */}
      {isInView && creaturesReady && creatures.map((c, i) => {
        const creatureAvatar = guestAvatars[c.key] ?? c.avatar;
        const creatureMessage = guestNotes[c.key] ?? null;
        const hasDetail = Boolean(creatureAvatar || creatureMessage?.trim());

        return (
          <OceanCreature
            key={c.key}
            name={c.display}
            creature={c.creature}
            avatar={creatureAvatar}
            index={i}
            total={totalCreatures}
            message={creatureMessage}
            fullMessage={creatureMessage}
            hasDetail={hasDetail}
            onSelect={hasDetail ? () => setSelectedCreatureDetail({
              name: c.display,
              creature: c.creature,
              avatar: creatureAvatar,
              message: creatureMessage,
            }) : undefined}
          />
        );
      })}

      {/* Guest's own creature appears after RSVP confirmation */}
      {isInView && creaturesReady && hasHighlightedGuest && guest && (
        <OceanCreature
          key="you"
          name={guest.display}
          creature={guest.creature}
          avatar={highlightedAvatar}
          index={creatures.length}
          total={totalCreatures}
          isHighlighted
          message={highlightedMessage}
          fullMessage={highlightedMessage}
          hasDetail={highlightedHasDetail}
          onSelect={highlightedHasDetail ? () => setSelectedCreatureDetail({
            name: guest.display,
            creature: guest.creature,
            avatar: highlightedAvatar,
            message: highlightedMessage,
            isHighlighted: true,
          }) : undefined}
        />
      )}

      <CreatureDetailPanel detail={selectedCreatureDetail} onClose={() => setSelectedCreatureDetail(null)} />

      <div className="scene3-event-panel object-panel-3d max-w-2xl text-center relative z-20">
        <motion.h2
          className="font-serif text-4xl md:text-6xl mb-8 text-ocean-deep"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Lễ tốt nghiệp
        </motion.h2>

        <div className="space-y-3 text-lg md:text-xl text-ocean-deep/85 font-sans mb-4">
          {infoItems.map((item, i) => (
            <motion.p
              key={i}
              className={item.className}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
            >
              {item.text}
            </motion.p>
          ))}
          <motion.p
            className="text-base text-ocean-deep/70"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            144 Xuân Thủy, Cầu Giấy, Hà Nội
          </motion.p>
          <motion.a
            href="https://maps.google.com/?q=144+Xuan+Thuy+Cau+Giay+Ha+Noi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm underline underline-offset-4 text-ocean-night hover:text-ocean-mid transition-colors"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Mở Google Maps &rarr;
          </motion.a>
        </div>

        <motion.div
          className="w-16 h-[1px] mx-auto my-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(10,22,40,0.3), transparent)" }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
        />

        {!countdown.passed && (
          <div className="flex justify-center gap-3 md:gap-6">
            {[
              { value: countdown.days, label: "ngày" },
              { value: countdown.hours, label: "giờ" },
              { value: countdown.minutes, label: "phút" },
              { value: countdown.seconds, label: "giây" },
            ].map((item, i) => (
              <CountdownCard
                key={item.label}
                value={item.value}
                label={item.label}
                delay={isInView ? 1.0 + i * 0.1 : 0}
              />
            ))}
          </div>
        )}

        {countdown.passed && (
          <motion.p
            className="font-serif text-2xl text-ocean-deep/80 italic"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Hôm nay là ngày ấy!
          </motion.p>
        )}
      </div>

      {/* Bottom gradient — "nổi lên mặt nước", sáng dần lên trời */}
      <div
        className="scene3-bottom-warmth absolute inset-x-0 bottom-0 h-80 pointer-events-none z-[5]"
        style={{
          background: "linear-gradient(0deg, rgba(196,168,130,0.5) 0%, rgba(196,168,130,0.25) 30%, transparent 100%)",
        }}
      />
    </section>
  );
}
