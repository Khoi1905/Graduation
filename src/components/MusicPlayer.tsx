"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { Guest } from "@/types/guest";

interface Props {
  guest: Guest;
  sceneIndex: number;
  onReadyChange?: (ready: boolean) => void;
}

export interface MusicPlayerHandle {
  startExperience: () => boolean;
  prepareForScene: (targetScene: number) => void;
  toggle: () => void;
}

interface SceneTrack {
  src: string;
  volume: number;
  start: number;
}

const INTRO_TRACK: SceneTrack = { src: "la_AEFO8m7U", volume: 28, start: 3 };
const SHARED_TRACK: SceneTrack = { src: "7Wg5wz7bLZM", volume: 42, start: 0 };
const FADE_MS = 450;

function extractVideoId(src: string): string {
  if (!src) return "";
  const match = src.match(/(?:embed\/|shorts\/|v=|youtu\.be\/)([\w-]{11})/);
  if (match) return match[1];
  const trimmed = src.trim();
  return /^[\w-]{11}$/.test(trimmed) ? trimmed : "";
}

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement | string, opts: Record<string, unknown>) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  loadVideoById: (opts: { videoId: string; startSeconds?: number }) => void;
  cueVideoById: (opts: { videoId: string; startSeconds?: number }) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  setVolume: (v: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getPlayerState: () => number;
}

type PlayerKey = "intro" | "shared";

let apiPromise: Promise<Window["YT"]> | null = null;

function loadYouTubeApi(): Promise<Window["YT"]> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };

    const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
    if (!existing) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });

  return apiPromise;
}

function trackForScene(sceneIndex: number) {
  return sceneIndex === 0 ? INTRO_TRACK : SHARED_TRACK;
}

function keyForScene(sceneIndex: number): PlayerKey {
  return sceneIndex === 0 ? "intro" : "shared";
}

const MusicPlayer = forwardRef<MusicPlayerHandle, Props>(function MusicPlayer(
  { guest: _guest, sceneIndex, onReadyChange },
  ref,
) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);
  const introPlayerRef = useRef<YTPlayer | null>(null);
  const sharedPlayerRef = useRef<YTPlayer | null>(null);
  const introReadyRef = useRef(false);
  const introPrimedRef = useRef(false);
  const sharedReadyRef = useRef(false);
  const introStartedRef = useRef(false);
  const sharedStartedRef = useRef(false);
  const enabledRef = useRef(false);
  const userMutedRef = useRef(false);
  const activeKeyRef = useRef<PlayerKey | null>(null);
  const sceneIndexRef = useRef(sceneIndex);
  const fadeTimersRef = useRef<Record<PlayerKey, number | null>>({ intro: null, shared: null });

  sceneIndexRef.current = sceneIndex;

  const getPlayer = useCallback((key: PlayerKey) => {
    return key === "intro" ? introPlayerRef.current : sharedPlayerRef.current;
  }, []);

  const playerIsReady = useCallback((key: PlayerKey) => {
    return key === "intro" ? introPrimedRef.current : sharedReadyRef.current;
  }, []);

  const setIntroPrimed = useCallback(() => {
    if (introPrimedRef.current) return;
    const player = introPlayerRef.current;
    try {
      player?.seekTo(INTRO_TRACK.start, true);
      player?.pauseVideo();
      player?.setVolume(0);
    } catch {}
    introPrimedRef.current = true;
    setReady(true);
    onReadyChange?.(true);
  }, [onReadyChange]);

  const primeIntroPlayer = useCallback(() => {
    const player = introPlayerRef.current;
    const id = extractVideoId(INTRO_TRACK.src);
    if (!player || !id) return;

    try {
      player.mute();
      player.setVolume(0);
      player.loadVideoById({ videoId: id, startSeconds: INTRO_TRACK.start });
      player.playVideo();
      introStartedRef.current = true;
    } catch {}
  }, []);

  const clearFadeTimer = useCallback((key: PlayerKey) => {
    const timer = fadeTimersRef.current[key];
    if (timer) {
      window.clearInterval(timer);
      fadeTimersRef.current[key] = null;
    }
  }, []);

  const fadeVolume = useCallback(
    (key: PlayerKey, to: number, onDone?: () => void) => {
      const player = getPlayer(key);
      if (!player) return;

      clearFadeTimer(key);
      let current = 0;
      try {
        current = player.getVolume();
      } catch {}

      const steps = Math.max(1, Math.round(FADE_MS / 40));
      const delta = (to - current) / steps;
      let i = 0;

      fadeTimersRef.current[key] = window.setInterval(() => {
        i += 1;
        const v = i >= steps ? to : current + delta * i;
        try {
          player.setVolume(Math.max(0, Math.min(100, v)));
        } catch {}

        if (i >= steps) {
          clearFadeTimer(key);
          onDone?.();
        }
      }, 40);
    },
    [clearFadeTimer, getPlayer],
  );

  const cuePlayer = useCallback((key: PlayerKey) => {
    const player = getPlayer(key);
    const track = key === "intro" ? INTRO_TRACK : SHARED_TRACK;
    const id = extractVideoId(track.src);
    if (!player || !id) return;

    try {
      player.cueVideoById({ videoId: id, startSeconds: track.start });
      player.setVolume(0);
    } catch {}
  }, [getPlayer]);

  const startPlayer = useCallback(
    (key: PlayerKey, restart = false) => {
      const player = getPlayer(key);
      const track = key === "intro" ? INTRO_TRACK : SHARED_TRACK;
      const id = extractVideoId(track.src);
      if (!player || !id || !playerIsReady(key)) return false;

      const startedRef = key === "intro" ? introStartedRef : sharedStartedRef;
      try {
        if (key === "intro") {
          if (restart) {
            player.seekTo(track.start, true);
          }
          player.unMute();
          player.setVolume(track.volume);
        } else if (restart || !startedRef.current) {
          player.loadVideoById({ videoId: id, startSeconds: track.start });
          player.setVolume(0);
        }
        player.playVideo();
      } catch {
        return false;
      }

      startedRef.current = true;
      return true;
    },
    [getPlayer, playerIsReady],
  );

  const applySceneAudio = useCallback(
    (targetScene: number, restartCurrent = false) => {
      if (!enabledRef.current || userMutedRef.current) return false;

      const nextKey = keyForScene(targetScene);
      const nextTrack = trackForScene(targetScene);
      const previousKey = activeKeyRef.current;

      if (!startPlayer(nextKey, restartCurrent)) return false;

      activeKeyRef.current = nextKey;
      if (nextKey === "intro") {
        try {
          getPlayer(nextKey)?.setVolume(nextTrack.volume);
        } catch {}
      } else {
        fadeVolume(nextKey, nextTrack.volume);
      }

      if (previousKey && previousKey !== nextKey) {
        fadeVolume(previousKey, 0, () => {
          try {
            getPlayer(previousKey)?.pauseVideo();
          } catch {}
        });
      }

      return true;
    },
    [fadeVolume, getPlayer, startPlayer],
  );

  const startExperience = useCallback(() => {
    userMutedRef.current = false;
    enabledRef.current = true;
    setEnabled(true);
    return applySceneAudio(sceneIndexRef.current, true);
  }, [applySceneAudio]);

  const prepareForScene = useCallback(
    (targetScene: number) => {
      if (!enabledRef.current || userMutedRef.current || !playerIsReady(keyForScene(targetScene))) return;

      const nextKey = keyForScene(targetScene);
      if (activeKeyRef.current === nextKey) return;

      const previousKey = activeKeyRef.current;
      const shouldRestart = nextKey === "intro" || previousKey !== nextKey;
      if (!startPlayer(nextKey, shouldRestart)) return;

      activeKeyRef.current = nextKey;
      if (previousKey && previousKey !== nextKey) {
        fadeVolume(previousKey, 0, () => {
          try {
            getPlayer(previousKey)?.pauseVideo();
          } catch {}
        });
      }
    },
    [fadeVolume, getPlayer, playerIsReady, startPlayer],
  );

  const stopAudio = useCallback(() => {
    userMutedRef.current = true;
    enabledRef.current = false;
    setEnabled(false);

    (["intro", "shared"] as const).forEach((key) => {
      fadeVolume(key, 0, () => {
        try {
          getPlayer(key)?.pauseVideo();
        } catch {}
      });
    });
  }, [fadeVolume, getPlayer]);

  const toggle = useCallback(() => {
    if (enabledRef.current) {
      stopAudio();
      return;
    }

    startExperience();
  }, [startExperience, stopAudio]);

  useImperativeHandle(ref, () => ({ startExperience, prepareForScene, toggle }), [
    prepareForScene,
    startExperience,
    toggle,
  ]);

  useEffect(() => {
    onReadyChange?.(false);
  }, [onReadyChange]);

  useEffect(() => {
    let cancelled = false;
    const introId = extractVideoId(INTRO_TRACK.src);
    const sharedId = extractVideoId(SHARED_TRACK.src);

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !YT || !holderRef.current || introPlayerRef.current || sharedPlayerRef.current) return;

        const createMount = () => {
          const mount = document.createElement("div");
          holderRef.current?.appendChild(mount);
          return mount;
        };

        const sharedPlayerVars = {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        };

        introPlayerRef.current = new YT.Player(createMount(), {
          height: "200",
          width: "200",
          videoId: introId,
          playerVars: sharedPlayerVars,
          events: {
            onReady: () => {
              if (cancelled) return;
              introReadyRef.current = true;
              primeIntroPlayer();
            },
            onStateChange: (event: { data?: number }) => {
              if (cancelled || introPrimedRef.current) return;
              if (event.data === 1) {
                window.setTimeout(() => {
                  if (!cancelled) setIntroPrimed();
                }, 180);
              }
            },
          },
        });

        sharedPlayerRef.current = new YT.Player(createMount(), {
          height: "200",
          width: "200",
          videoId: sharedId,
          playerVars: sharedPlayerVars,
          events: {
            onReady: () => {
              if (cancelled) return;
              sharedReadyRef.current = true;
              cuePlayer("shared");
            },
          },
        });
      })
      .catch(() => {
        onReadyChange?.(false);
      });

    return () => {
      cancelled = true;
      (["intro", "shared"] as const).forEach((key) => {
        clearFadeTimer(key);
        try {
          getPlayer(key)?.stopVideo();
        } catch {}
      });
    };
  }, [clearFadeTimer, cuePlayer, getPlayer, onReadyChange, primeIntroPlayer, setIntroPrimed]);

  useEffect(() => {
    if (!ready || !enabledRef.current || userMutedRef.current) return;
    applySceneAudio(sceneIndex, false);
  }, [applySceneAudio, ready, sceneIndex]);

  return (
    <>
      <div
        ref={holderRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-240px",
          top: "-240px",
          width: 200,
          height: 200,
          overflow: "hidden",
          pointerEvents: "none",
          opacity: 0,
        }}
      />
      <button
        data-music-toggle
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-ocean-cream/20 backdrop-blur-md border border-ocean-cream/30 flex items-center justify-center text-ocean-cream hover:bg-ocean-cream/30 transition-colors"
        aria-label={enabled ? "Tat nhac" : "Bat nhac"}
      >
        {enabled ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="2" width="4" height="12" rx="1" />
            <rect x="9" y="2" width="4" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2l10 6-10 6V2z" />
          </svg>
        )}
      </button>
    </>
  );
});

export default MusicPlayer;
