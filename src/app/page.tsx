"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useGuest } from "@/hooks/useGuest";
import DiveVisualEngine from "@/components/dive/DiveVisualEngine";
import Scene1DeepSea from "@/components/scenes/Scene1DeepSea";
import MusicPlayer, { type MusicPlayerHandle } from "@/components/MusicPlayer";
import TransformationOverlay from "@/components/TransformationOverlay";
import { CreatureSVG } from "@/components/svg/SeaCreatures";
import { CREATURE_NAME_VI } from "@/types/guest";

const loadScene2MidWater = () => import("@/components/scenes/Scene2MidWater");
const loadScene3Surface = () => import("@/components/scenes/Scene3Surface");
const loadScene4Horizon = () => import("@/components/scenes/Scene4Horizon");

const Scene2MidWater = dynamic(loadScene2MidWater, { ssr: false });
const Scene3Surface = dynamic(loadScene3Surface, { ssr: false });
const Scene4Horizon = dynamic(loadScene4Horizon, { ssr: false });

type RsvpStatus = "pending" | "confirmed" | "declined";

const SCENE_PROGRESS = [0, 0.34, 0.68, 1] as const;
const TRANSITION_MS = 1050;
const SUNBURST_MS = 1450;
const BUBBLE_SURGE_MS = 1450;

const SURFACE_CREATURE_SPRITE_SOURCES = [
  "/art/dive/creatures/clownfish-sheet.png",
  "/art/dive/creatures/turtle-sheet.png",
  "/art/dive/creatures/jellyfish-sheet.png",
  "/art/dive/creatures/seahorse-sheet.png",
  "/art/dive/creatures/crab-sheet.png",
  "/art/dive/creatures/octopus-sheet.png",
  "/art/dive/creatures/dolphin-sheet.png",
  "/art/dive/creatures/starfish-sheet.png",
  "/art/dive/creatures/pufferfish-sheet.png",
  "/art/dive/creatures/whale-sheet.png",
  "/art/dive/creatures/shrimp-sheet.png",
  "/art/dive/creatures/ray-sheet.png",
] as const;

type TransitionDirection = "next" | "prev";

interface SceneMeta {
  label: string;
  shortLabel: string;
}

const scenes: SceneMeta[] = [
  { label: "Vực sâu", shortLabel: "01" },
  { label: "Dòng ký ức", shortLabel: "02" },
  { label: "Mặt nước", shortLabel: "03" },
  { label: "Ánh sáng", shortLabel: "04" },
];

function clampScene(index: number) {
  return Math.min(scenes.length - 1, Math.max(0, index));
}

const preloadedImageSources = new Set<string>();
const preloadedImages: HTMLImageElement[] = [];

function scheduleIdleWork(callback: () => void, timeout = 450) {
  const idleWindow = window as Window & {
    requestIdleCallback?: (cb: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  if (idleWindow.requestIdleCallback) {
    return idleWindow.requestIdleCallback(callback, { timeout });
  }
  return window.setTimeout(callback, Math.min(timeout, 180));
}

function preloadImagesInIdle(sources: readonly string[], batchSize = 2) {
  let index = 0;

  const loadBatch = () => {
    for (let count = 0; count < batchSize && index < sources.length; count += 1, index += 1) {
      if (preloadedImageSources.has(sources[index])) continue;
      preloadedImageSources.add(sources[index]);
      const image = new Image();
      image.decoding = "async";
      image.src = sources[index];
      preloadedImages.push(image);
      void image.decode?.().catch(() => {});
    }
    if (index < sources.length) {
      scheduleIdleWork(loadBatch, 320);
    }
  };

  scheduleIdleWork(loadBatch, 320);
}

function isEditableKeyTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    tagName === "button"
  );
}

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return null;
  if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
    sharedAudioCtx = new AudioContextCtor();
  }
  if (sharedAudioCtx.state === "suspended") {
    void sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

function playTransitionSfx(direction: TransitionDirection, targetScene: number) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = targetScene === 3 ? 0.95 : 0.54;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(targetScene === 3 ? 0.13 : 0.18, now + 0.04);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  master.connect(ctx.destination);

  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const fade = 1 - i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * fade * fade * (targetScene === 3 ? 0.42 : 1);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(direction === "next" ? 520 : 380, now);
  filter.frequency.exponentialRampToValueAtTime(targetScene === 3 ? 2200 : 780, now + duration);
  noise.connect(filter);
  filter.connect(master);
  noise.start(now);
  noise.stop(now + duration);

  const shimmer = ctx.createOscillator();
  const shimmerGain = ctx.createGain();
  shimmer.type = "sine";
  shimmer.frequency.setValueAtTime(targetScene === 3 ? 520 : 240, now);
  shimmer.frequency.exponentialRampToValueAtTime(targetScene === 3 ? 1120 : 360, now + duration);
  shimmerGain.gain.setValueAtTime(0.0001, now);
  shimmerGain.gain.exponentialRampToValueAtTime(targetScene === 3 ? 0.055 : 0.03, now + 0.08);
  shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(master);
  shimmer.start(now);
  shimmer.stop(now + duration);

  noise.onended = () => { noise.disconnect(); filter.disconnect(); shimmer.disconnect(); shimmerGain.disconnect(); master.disconnect(); };
}

function DiveSceneTransition({ active, direction, targetScene }: { active: boolean; direction: TransitionDirection; targetScene: number }) {
  const sceneClass = targetScene === 1 ? "dive-transition-memory" : targetScene === 2 ? "dive-transition-surface" : "";
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className={`dive-scene-transition dive-scene-transition-${direction} ${sceneClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          aria-hidden="true"
        >
          <div className="dive-transition-light" />
          <div className="dive-transition-current">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} style={{ "--transition-index": index } as CSSProperties} />
            ))}
          </div>
          <div className="dive-transition-bubbles">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} style={{ "--bubble-index": index } as CSSProperties} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const CRITICAL_IMAGES = [
  "/art/dive/objects/rock-arch.svg",
  "/art/dive/objects/abyss-wall.svg",
];

const MIN_LOADING_MS = 320;

function DiveLoadingScreen({ onReady }: { onReady: () => void }) {
  const fired = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!fired.current) {
        fired.current = true;
        onReady();
      }
    }, MIN_LOADING_MS);

    for (const src of CRITICAL_IMAGES) {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    }

    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <div className="dive-loading-screen">
      <div className="dive-loading-content">
        <div className="dive-loading-bubbles" aria-hidden="true">
          <span /><span /><span />
        </div>
        <p className="dive-loading-text">Đang lặn xuống…</p>
      </div>
    </div>
  );
}

function SunburstTransition({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="sunburst-transition"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.1 } }}
          aria-hidden="true"
        >
          <div className="sunburst-fill" />
          <div className="sunburst-warmth" />
          <div className="sunburst-halo" />
          <div className="sunburst-core" />
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className="sunburst-ray"
              style={{ "--ray-index": i } as CSSProperties}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 68 bong bóng sinh tự động (deterministic theo index): đợt đầu nhỏ thưa,
// đợt sau to dần và dày đặc để lấp kín màn hình quanh mốc đổi cảnh (~1.15s).
const SURGE_BUBBLES = Array.from({ length: 82 }, (_, i) => {
  const isGiant = i >= 60;
  const isMid = i >= 28 && i < 60;
  return {
    x: ((i * 61.8) % 100) / 100,
    size: isGiant ? 132 + ((i * 37) % 102) : isMid ? 54 + ((i * 43) % 74) : 16 + ((i * 53) % 48),
    delay: isGiant ? 0.28 + (i - 60) * 0.014 : isMid ? 0.12 + ((i - 28) % 10) * 0.028 : (i % 18) * 0.015,
    duration: isGiant ? 0.82 + (i % 5) * 0.04 : isMid ? 0.95 + (i % 7) * 0.04 : 1.05 + (i % 6) * 0.045,
    drift: (((i * 41) % 61) - 30) / 10,
    alpha: isGiant ? 0.98 : isMid ? 0.9 : 0.76,
  };
});

function BubbleSurgeTransition({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let raf = 0;
    const startedAt = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawBubble = (x: number, y: number, radius: number, alpha: number) => {
      const fill = ctx.createRadialGradient(x - radius * 0.28, y - radius * 0.32, radius * 0.05, x, y, radius);
      fill.addColorStop(0, `rgba(255,255,255,${0.95 * alpha})`);
      fill.addColorStop(0.2, `rgba(255,255,255,${0.48 * alpha})`);
      fill.addColorStop(0.58, `rgba(216,247,255,${0.52 * alpha})`);
      fill.addColorStop(1, `rgba(148,219,238,${0.78 * alpha})`);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = `rgba(255,255,255,${0.54 * alpha})`;
      ctx.lineWidth = Math.max(1, radius * 0.025);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x - radius * 0.3, y - radius * 0.32, Math.max(2, radius * 0.12), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.56 * alpha})`;
      ctx.fill();
    };

    const draw = (now: number) => {
      const elapsed = (now - startedAt) / 1000;
      ctx.clearRect(0, 0, width, height);

      if (reduceMotion) {
        ctx.fillStyle = "rgba(214,245,250,0.96)";
        ctx.fillRect(0, 0, width, height);
        return;
      }

      for (const bubble of SURGE_BUBBLES) {
        const t = (elapsed - bubble.delay) / bubble.duration;
        if (t < 0 || t > 1) continue;
        const eased = 1 - Math.pow(1 - t, 2.2);
        const fade = Math.min(1, t / 0.08) * (1 - Math.max(0, (t - 0.88) / 0.12));
        const radius = bubble.size * (0.32 + eased * 0.72);
        const x = bubble.x * width + Math.sin(t * Math.PI * 2 + bubble.x * 7) * 10 + bubble.drift * width * 0.008;
        const y = height + radius - eased * (height + radius * 3.2);
        drawBubble(x, y, radius, Math.max(0, fade) * bubble.alpha);
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="bubble-surge-transition"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.22 } }}
          aria-hidden="true"
        >
          <canvas ref={canvasRef} className="bubble-surge-canvas" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HomeContent() {
  const guest = useGuest();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [visualReady, setVisualReady] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>("next");
  const [transitionType, setTransitionType] = useState<"dive" | "sunburst" | "bubbles">("dive");
  const [targetScene, setTargetScene] = useState(0);
  const [settlingScene, setSettlingScene] = useState<number | null>(null);
  const settlingTimerRef = useRef<number | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>("pending");
  const [rsvpStatusGuestKey, setRsvpStatusGuestKey] = useState<string | null>(null);
  const [transformActive, setTransformActive] = useState(false);
  const musicRef = useRef<MusicPlayerHandle>(null);
  const [experienceStarted, setExperienceStarted] = useState(false);
  const [musicReady, setMusicReady] = useState(false);
  const rsvpStatusKey = `rsvp_status:${guest.key}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const saved = localStorage.getItem(rsvpStatusKey);
      setRsvpStatus(saved === "confirmed" || saved === "declined" ? saved : "pending");
    } catch {
      setRsvpStatus("pending");
    }
    setRsvpStatusGuestKey(guest.key);
    setTransformActive(false);
  }, [guest.key, mounted, rsvpStatusKey]);

  // An toàn: nhạc chỉ là phần phụ. Nếu YouTube bị chặn/chậm và không prime kịp,
  // vẫn cho vào trải nghiệm sau 3.5s thay vì kẹt màn loading vĩnh viễn.
  useEffect(() => {
    const timer = window.setTimeout(() => setMusicReady(true), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  const handleRsvpComplete = useCallback((status: RsvpStatus) => {
    setRsvpStatus(status);
    setRsvpStatusGuestKey(guest.key);
    localStorage.setItem(rsvpStatusKey, status);
    if (status === "confirmed") {
      setTransformActive(true);
    }
  }, [guest.key, rsvpStatusKey]);

  const handleLoadingReady = useCallback(() => {
    setVisualReady(true);
  }, []);

  const visualProgress = SCENE_PROGRESS[sceneIndex];
  const canStartExperience = !loadingVisible && musicReady;
  const effectiveRsvpStatus = rsvpStatusGuestKey === guest.key ? rsvpStatus : "pending";

  const handleMusicReadyChange = useCallback((ready: boolean) => {
    setMusicReady(ready);
  }, []);

  useEffect(() => {
    if (!visualReady || !musicReady) return;

    setLoading(false);
    const timer = window.setTimeout(() => setLoadingVisible(false), 230);
    return () => window.clearTimeout(timer);
  }, [musicReady, visualReady]);

  const handleStartExperience = useCallback(() => {
    if (!canStartExperience) return;
    musicRef.current?.startExperience();
    setExperienceStarted(true);
  }, [canStartExperience]);

  useEffect(() => {
    if (!mounted) return;
    if (sceneIndex === 1) {
      scheduleIdleWork(() => {
        void loadScene3Surface();
        preloadImagesInIdle(SURFACE_CREATURE_SPRITE_SOURCES, 2);
      }, 280);
    }
    if (sceneIndex === 2) {
      scheduleIdleWork(() => {
        void loadScene4Horizon();
      }, 280);
    }
  }, [mounted, sceneIndex]);

  useEffect(() => {
    return () => {
      if (settlingTimerRef.current) window.clearTimeout(settlingTimerRef.current);
    };
  }, []);

  const goToScene = useCallback(
    (nextIndex: number) => {
      const target = clampScene(nextIndex);
      if (target === sceneIndex || transitioning) return;

      const direction: TransitionDirection = target > sceneIndex ? "next" : "prev";
      const isSunburst = target === 3;
      const isBubbleSurge = target === 2 && direction === "next";
      setTransitionDirection(direction);
      setTransitionType(isSunburst ? "sunburst" : isBubbleSurge ? "bubbles" : "dive");
      setTargetScene(target);
      setTransitioning(true);
      requestAnimationFrame(() => playTransitionSfx(direction, target));

      const totalMs = isSunburst ? SUNBURST_MS : isBubbleSurge ? BUBBLE_SURGE_MS : TRANSITION_MS;
      window.setTimeout(() => {
        setSceneIndex(target);
        if (target === 2 || target === 3) {
          if (settlingTimerRef.current) window.clearTimeout(settlingTimerRef.current);
          setSettlingScene(target);
          settlingTimerRef.current = window.setTimeout(() => {
            setSettlingScene(null);
            settlingTimerRef.current = null;
          }, target === 3 ? 780 : 420);
        }
      }, isSunburst ? 700 : isBubbleSurge ? 720 : 250);

      window.setTimeout(() => {
        setTransitioning(false);
      }, totalMs);
    },
    [sceneIndex, transitioning],
  );

  const handleGoToScene = useCallback(
    (nextIndex: number) => {
      if (!experienceStarted) return;
      const target = clampScene(nextIndex);
      musicRef.current?.prepareForScene(target);
      goToScene(target);
    },
    [experienceStarted, goToScene],
  );

  const handleTransformDiveStart = useCallback(() => {
    requestAnimationFrame(() => playTransitionSfx("prev", 2));
  }, []);

  const handleTransformDone = useCallback(() => {
    setTransformActive(false);
    setTransitioning(false);
    setTransitionDirection("prev");
    setTransitionType("dive");
    setTargetScene(2);
    setSettlingScene(2);
    if (settlingTimerRef.current) window.clearTimeout(settlingTimerRef.current);
    settlingTimerRef.current = window.setTimeout(() => {
      setSettlingScene(null);
      settlingTimerRef.current = null;
    }, 420);
    setSceneIndex(2);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableKeyTarget(event.target)) return;

      if (!experienceStarted) {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          handleStartExperience();
        }
        return;
      }

      if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
        event.preventDefault();
        handleGoToScene(sceneIndex + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleGoToScene(sceneIndex - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [experienceStarted, handleGoToScene, handleStartExperience, sceneIndex]);

  const activeScene = useMemo(() => {
    switch (sceneIndex) {
      case 0:
        return <Scene1DeepSea guest={guest} scrollProgress={0.04} started={experienceStarted} />;
      case 1:
        return <Scene2MidWater guest={guest} scrollProgress={visualProgress} />;
      case 2:
        return <Scene3Surface scrollProgress={visualProgress} guest={guest} rsvpConfirmed={effectiveRsvpStatus === "confirmed"} deferCreatureMount={transitioning || settlingScene === 2} />;
      default:
        return <Scene4Horizon guest={guest} onRsvpComplete={handleRsvpComplete} rsvpDone={effectiveRsvpStatus === "confirmed" && !transformActive} transitionSettling={transitioning || settlingScene === 3} />;
    }
  }, [guest, sceneIndex, visualProgress, effectiveRsvpStatus, handleRsvpComplete, transformActive, transitioning, settlingScene, experienceStarted]);

  if (!mounted) return null;

  return (
    <main className="invitation-scene-app h-screen overflow-hidden">
      <DiveVisualEngine sceneIndex={sceneIndex} sceneProgress={visualProgress} isTransitioning={transitioning} targetScene={targetScene} />

      <section className="scene-page-stage relative z-10 h-screen overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={sceneIndex}
            className="scene-page-panel absolute inset-0 overflow-y-auto overscroll-contain"
            initial={{ opacity: 0, y: sceneIndex === 3 ? 0 : (transitionDirection === "next" ? 32 : -32) }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: sceneIndex === 3 ? 0 : (transitionDirection === "next" ? -28 : 28),
              transition: { duration: transitionType === "sunburst" || transitionType === "bubbles" ? 0.05 : 0.55, ease: "easeOut" },
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {activeScene}
          </motion.div>
        </AnimatePresence>
      </section>

      <div className="scene-navigation fixed inset-x-0 bottom-5 z-40 flex items-center justify-center px-4">
        <div className="scene-navigation-bar">
          <button
            type="button"
            className="scene-nav-button"
            onClick={() => handleGoToScene(sceneIndex - 1)}
            disabled={!experienceStarted || sceneIndex === 0 || transitioning}
          >
            Trước
          </button>

          <div className="scene-dots" aria-label="Chọn cảnh">
            {scenes.map((scene, index) => (
              <button
                key={scene.label}
                type="button"
                className={`scene-dot ${index === sceneIndex ? "is-active" : ""}`}
                aria-label={`Đến cảnh ${scene.shortLabel}: ${scene.label}`}
                onClick={() => handleGoToScene(index)}
                disabled={!experienceStarted || transitioning}
              >
                <span>{scene.shortLabel}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="scene-nav-button"
            onClick={() => handleGoToScene(sceneIndex + 1)}
            disabled={!experienceStarted || sceneIndex === scenes.length - 1 || transitioning}
          >
            Tiếp
          </button>

          <AnimatePresence>
            {effectiveRsvpStatus === "confirmed" && (
              <motion.div
                className="nav-creature-companion"
                initial={{ opacity: 0, x: 20, scale: 0 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                title={CREATURE_NAME_VI[guest.creature]}
              >
                <CreatureSVG creature={guest.creature} size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {transitionType === "sunburst" ? (
        <SunburstTransition active={transitioning} />
      ) : transitionType === "bubbles" ? (
        <BubbleSurgeTransition active={transitioning} />
      ) : (
        <DiveSceneTransition active={transitioning} direction={transitionDirection} targetScene={targetScene} />
      )}
      <TransformationOverlay
        active={transformActive}
        creature={guest.creature}
        creatureMsg={guest.creatureMsg}
        guestName={guest.display}
        onDiveStart={handleTransformDiveStart}
        onComplete={handleTransformDone}
      />
      <MusicPlayer
        ref={musicRef}
        guest={guest}
        sceneIndex={sceneIndex}
        onReadyChange={handleMusicReadyChange}
      />

      <AnimatePresence>
        {!experienceStarted && !loadingVisible && (
          <motion.div
            className="experience-start-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
          >
            <motion.button
              type="button"
              className="experience-start-button"
              onClick={handleStartExperience}
              disabled={!canStartExperience}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.42, ease: "easeOut" }}
            >
              Bắt đầu
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {loadingVisible && (
        <div className={`dive-loading-overlay ${loading ? "" : "is-fading"}`}>
          <DiveLoadingScreen onReady={handleLoadingReady} />
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen bg-ocean-deep" />}>
      <HomeContent />
    </Suspense>
  );
}
