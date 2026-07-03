"use client";

import { useEffect, useMemo, useRef } from "react";
import { CREATURE_SPRITES } from "@/components/CreatureSprite";
import type { CreatureType } from "@/types/guest";

interface Props {
  sceneIndex: number;
  sceneProgress: number;
  isTransitioning?: boolean;
  targetScene?: number;
}

type ScenePhase = "abyss" | "memory" | "surface" | "arrival";
type ObjectDepth = "far" | "mid" | "front";
type ObjectLayer = "back" | "terrain" | "mid" | "fauna" | "front" | "surface";
type ObjectMotion =
  | "idleSway"
  | "depthDrift"
  | "slowSwim"
  | "schoolLoop"
  | "schoolTraverse"
  | "schoolTraverseReverse"
  | "schoolCrossRight"
  | "schoolCrossLeft"
  | "kelpSwayStrong"
  | "bubbleRise"
  | "currentDrift"
  | "foamLap"
  | "waveBandDrift"
  | "surfaceRayPulse"
  | "cloudDrift";
type LightGroup = "abyss" | "memory" | "surface" | "arrival" | "warm";
type SafeZone = "center" | "cards" | "textRight";

interface Particle {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  warmth: number;
}

interface DiveObject {
  src: string;
  scene: ScenePhase;
  role?: "terrain" | "flora" | "fauna" | "ambient-shadow" | "surface";
  layer: ObjectLayer;
  depth: ObjectDepth;
  motion: ObjectMotion;
  x: string;
  y: string;
  width: string;
  opacity: number;
  parallax: number;
  blur?: number;
  lightGroup?: LightGroup;
  safeZone?: SafeZone;
  amp?: number;
  scale?: number;
  delay?: number;
  duration?: number;
  flip?: boolean;
}

interface CanvasCreature {
  creature: CreatureType;
  fromX: number;
  toX: number;
  y: number;
  size: number;
  opacity: number;
  blur: number;
  duration: number;
  delay: number;
  facing: "left" | "right";
  depth: ObjectDepth;
  bob: number;
  phase: number;
}

interface MotionState {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
}

const art = "/art/dive";
const objects = `${art}/objects`;

const diveObjects: DiveObject[] = [
  { src: `${objects}/rock-arch.svg`, scene: "abyss", role: "terrain", layer: "back", depth: "far", motion: "depthDrift", x: "14%", y: "6%", width: "72vw", opacity: 0.42, parallax: 2.5, blur: 1, lightGroup: "abyss", scale: 1.04, delay: -8, duration: 42, amp: 0.42 },
  { src: `${objects}/abyss-wall.svg`, scene: "abyss", role: "terrain", layer: "front", depth: "front", motion: "depthDrift", x: "-12%", y: "-4%", width: "34vw", opacity: 0.7, parallax: 8, blur: 0.12, lightGroup: "abyss", delay: -6, duration: 36, amp: 0.34 },
  { src: `${objects}/abyss-wall.svg`, scene: "abyss", role: "terrain", layer: "front", depth: "front", motion: "depthDrift", x: "78%", y: "-2%", width: "31vw", opacity: 0.62, parallax: 8, blur: 0.18, lightGroup: "abyss", flip: true, delay: -18, duration: 40, amp: 0.3 },
  { src: `${objects}/reef-silhouette.svg`, scene: "abyss", role: "terrain", layer: "front", depth: "front", motion: "depthDrift", x: "-8%", y: "75%", width: "52vw", opacity: 0.54, parallax: 10, lightGroup: "abyss", delay: -9, duration: 28, amp: 0.36 },
  { src: `${objects}/bubble-column.svg`, scene: "abyss", role: "surface", layer: "mid", depth: "mid", motion: "bubbleRise", x: "64%", y: "38%", width: "8vw", opacity: 0.28, parallax: 7, blur: 0.1, lightGroup: "abyss", scale: 0.82, delay: -5, duration: 18, amp: 0.75 },
  { src: `${objects}/fish-trail.svg`, scene: "abyss", role: "fauna", layer: "fauna", depth: "far", motion: "schoolTraverse", x: "6%", y: "26%", width: "19vw", opacity: 0.18, parallax: 3.5, blur: 0.55, lightGroup: "abyss", scale: 0.7, delay: -7, duration: 42, flip: true, amp: 0.45 },

  { src: `${objects}/current-ribbons.svg`, scene: "memory", layer: "back", depth: "far", motion: "currentDrift", x: "-10%", y: "18%", width: "120vw", opacity: 0.38, parallax: 2.5, blur: 0.4, lightGroup: "memory", delay: -8, duration: 28, amp: 0.7, safeZone: "textRight" },
  { src: `${objects}/canyon-shelves.svg`, scene: "memory", layer: "terrain", depth: "far", motion: "depthDrift", x: "-18%", y: "40%", width: "58vw", opacity: 0.34, parallax: 3.5, blur: 0.55, lightGroup: "memory", delay: -14, duration: 40, amp: 0.55 },
  { src: `${objects}/kelp-cluster.svg`, scene: "memory", role: "flora", layer: "front", depth: "front", motion: "kelpSwayStrong", x: "-4%", y: "32%", width: "19vw", opacity: 0.66, parallax: 11, lightGroup: "memory", scale: 1.12, delay: -3, duration: 11, amp: 1.18 },
  { src: `${objects}/kelp-cluster.svg`, scene: "memory", role: "flora", layer: "mid", depth: "mid", motion: "kelpSwayStrong", x: "79%", y: "29%", width: "17vw", opacity: 0.5, parallax: 7, blur: 0.12, lightGroup: "memory", scale: 0.96, delay: -8, duration: 13, flip: true, amp: 0.92, safeZone: "textRight" },
  { src: `${objects}/kelp-cluster.svg`, scene: "memory", role: "flora", layer: "mid", depth: "mid", motion: "kelpSwayStrong", x: "5%", y: "50%", width: "12vw", opacity: 0.42, parallax: 7, blur: 0.18, lightGroup: "memory", scale: 0.72, delay: -11, duration: 15, amp: 0.76 },
  { src: `${objects}/coral-garden.svg`, scene: "memory", role: "flora", layer: "front", depth: "front", motion: "kelpSwayStrong", x: "2%", y: "72%", width: "50vw", opacity: 0.56, parallax: 12, lightGroup: "memory", delay: -12, duration: 17, amp: 0.68 },
  { src: `${objects}/coral-garden.svg`, scene: "memory", role: "flora", layer: "front", depth: "front", motion: "kelpSwayStrong", x: "64%", y: "76%", width: "40vw", opacity: 0.36, parallax: 10, blur: 0.15, lightGroup: "memory", flip: true, delay: -17, duration: 19, amp: 0.54, safeZone: "textRight" },
  { src: `${objects}/reef-silhouette.svg`, scene: "memory", layer: "terrain", depth: "mid", motion: "depthDrift", x: "46%", y: "74%", width: "48vw", opacity: 0.38, parallax: 8, blur: 0.2, lightGroup: "memory", scale: 0.92, delay: -12, duration: 28, amp: 0.5, safeZone: "textRight" },
  { src: `${objects}/fish-school-rich.svg`, scene: "memory", role: "fauna", layer: "fauna", depth: "mid", motion: "schoolCrossRight", x: "-38vw", y: "18%", width: "30vw", opacity: 0.46, parallax: 7, lightGroup: "memory", scale: 0.9, delay: -10, duration: 34, flip: true, amp: 0.86 },
  { src: `${objects}/fish-trail.svg`, scene: "memory", role: "fauna", layer: "fauna", depth: "mid", motion: "schoolCrossRight", x: "-42vw", y: "42%", width: "36vw", opacity: 0.4, parallax: 6, blur: 0.12, lightGroup: "memory", delay: -23, duration: 39, flip: true, amp: 0.8 },
  { src: `${objects}/fish-trail.svg`, scene: "memory", role: "fauna", layer: "fauna", depth: "far", motion: "schoolCrossLeft", x: "104vw", y: "16%", width: "22vw", opacity: 0.24, parallax: 3.5, blur: 0.55, lightGroup: "memory", scale: 0.68, delay: -24, duration: 47, amp: 0.58, safeZone: "textRight" },
  { src: `${objects}/fish-school-rich.svg`, scene: "memory", role: "fauna", layer: "fauna", depth: "far", motion: "schoolCrossLeft", x: "108vw", y: "52%", width: "20vw", opacity: 0.24, parallax: 3.5, blur: 0.55, lightGroup: "memory", scale: 0.66, delay: -17, duration: 52, amp: 0.54, safeZone: "textRight" },
  { src: `${objects}/fish-trail.svg`, scene: "memory", role: "fauna", layer: "fauna", depth: "far", motion: "schoolCrossRight", x: "-34vw", y: "12%", width: "18vw", opacity: 0.2, parallax: 3, blur: 0.68, lightGroup: "memory", scale: 0.58, delay: -6, duration: 50, flip: true, amp: 0.5 },
  { src: `${objects}/fish-school-rich.svg`, scene: "memory", role: "fauna", layer: "fauna", depth: "mid", motion: "schoolCrossLeft", x: "106vw", y: "33%", width: "22vw", opacity: 0.3, parallax: 5.5, blur: 0.28, lightGroup: "memory", scale: 0.72, delay: -28, duration: 43, amp: 0.6, safeZone: "textRight" },
  { src: `${objects}/fish-trail.svg`, scene: "memory", role: "fauna", layer: "fauna", depth: "mid", motion: "schoolCrossRight", x: "-36vw", y: "64%", width: "24vw", opacity: 0.3, parallax: 7, blur: 0.18, lightGroup: "memory", scale: 0.62, delay: -4, duration: 45, flip: true, amp: 0.72 },
  { src: `${objects}/fish-school-rich.svg`, scene: "memory", role: "fauna", layer: "fauna", depth: "far", motion: "schoolCrossLeft", x: "112vw", y: "72%", width: "16vw", opacity: 0.2, parallax: 3.2, blur: 0.7, lightGroup: "memory", scale: 0.58, delay: -36, duration: 56, amp: 0.48 },
  { src: `${objects}/fish-trail.svg`, scene: "memory", role: "fauna", layer: "fauna", depth: "mid", motion: "schoolCrossRight", x: "-44vw", y: "29%", width: "20vw", opacity: 0.26, parallax: 6.5, blur: 0.3, lightGroup: "memory", scale: 0.68, delay: -31, duration: 41, flip: true, amp: 0.62 },

  { src: `${objects}/surface-ceiling.svg`, scene: "surface", role: "surface", layer: "surface", depth: "far", motion: "waveBandDrift", x: "-10%", y: "-6%", width: "120vw", opacity: 0.76, parallax: 1.2, blur: 0.08, lightGroup: "surface", delay: -3, duration: 16, amp: 0.5 },
  { src: `${objects}/wave-ridges.svg`, scene: "surface", role: "surface", layer: "surface", depth: "far", motion: "waveBandDrift", x: "-12%", y: "7%", width: "124vw", opacity: 0.54, parallax: 1.2, blur: 0.18, lightGroup: "surface", delay: -10, duration: 18, amp: 0.45 },
  { src: `${objects}/current-ribbons.svg`, scene: "surface", layer: "back", depth: "far", motion: "surfaceRayPulse", x: "-8%", y: "18%", width: "116vw", opacity: 0.38, parallax: 2, blur: 0.3, lightGroup: "surface", delay: -14, duration: 18, amp: 0.65 },
  { src: `${objects}/bubble-column.svg`, scene: "surface", layer: "front", depth: "front", motion: "bubbleRise", x: "14%", y: "15%", width: "10vw", opacity: 0.42, parallax: 10, lightGroup: "surface", scale: 1.08, delay: -2, duration: 12, amp: 1 },
  { src: `${objects}/fish-trail.svg`, scene: "surface", role: "fauna", layer: "fauna", depth: "far", motion: "schoolTraverse", x: "54%", y: "36%", width: "18vw", opacity: 0.18, parallax: 3.5, blur: 0.5, lightGroup: "surface", scale: 0.65, delay: -12, duration: 34, flip: true, amp: 0.48 },
  { src: `${objects}/kelp-cluster.svg`, scene: "surface", layer: "mid", depth: "mid", motion: "idleSway", x: "-5%", y: "62%", width: "13vw", opacity: 0.24, parallax: 6, blur: 0.2, lightGroup: "surface", scale: 0.8, delay: -7, duration: 13, amp: 0.6 },
  { src: `${objects}/reef-silhouette.svg`, scene: "surface", layer: "front", depth: "front", motion: "depthDrift", x: "62%", y: "82%", width: "42vw", opacity: 0.25, parallax: 8, blur: 0.15, lightGroup: "surface", scale: 0.78, delay: -9, duration: 26, amp: 0.45 },

  { src: `${objects}/horizon-haze.svg`, scene: "arrival", layer: "back", depth: "far", motion: "cloudDrift", x: "-8%", y: "18%", width: "116vw", opacity: 0.64, parallax: 1, blur: 0.1, lightGroup: "arrival", delay: -8, duration: 58, amp: 0.45, safeZone: "cards" },
  { src: `${objects}/cloud-bank.svg`, scene: "arrival", role: "surface", layer: "surface", depth: "far", motion: "cloudDrift", x: "-10%", y: "2%", width: "58vw", opacity: 0.44, parallax: 1, blur: 0.06, lightGroup: "arrival", delay: -4, duration: 56, amp: 0.46, safeZone: "cards" },
  { src: `${objects}/cloud-bank.svg`, scene: "arrival", role: "surface", layer: "surface", depth: "far", motion: "cloudDrift", x: "54%", y: "9%", width: "50vw", opacity: 0.34, parallax: 1, blur: 0.12, lightGroup: "arrival", scale: 0.86, delay: -28, duration: 64, flip: true, amp: 0.42, safeZone: "cards" },
  { src: `${objects}/wave-ridges.svg`, scene: "arrival", role: "surface", layer: "surface", depth: "far", motion: "waveBandDrift", x: "-24%", y: "45%", width: "148vw", opacity: 0.12, parallax: 1.5, blur: 0.28, lightGroup: "warm", delay: -12, duration: 20, amp: 0.36, safeZone: "cards" },
  { src: `${objects}/foam-band.svg`, scene: "arrival", role: "surface", layer: "front", depth: "front", motion: "foamLap", x: "-26%", y: "64%", width: "152vw", opacity: 0.055, parallax: 3, blur: 0.3, lightGroup: "warm", scale: 1.08, delay: -5, duration: 13, amp: 0.52, safeZone: "cards" },
  { src: `${objects}/surface-ceiling.svg`, scene: "arrival", role: "surface", layer: "mid", depth: "mid", motion: "waveBandDrift", x: "-24%", y: "48%", width: "150vw", opacity: 0.018, parallax: 2, blur: 0.55, lightGroup: "warm", delay: -9, duration: 18, amp: 0.32, safeZone: "cards" },
  { src: `${objects}/foam-band.svg`, scene: "arrival", role: "surface", layer: "mid", depth: "mid", motion: "foamLap", x: "-30%", y: "76%", width: "160vw", opacity: 0.04, parallax: 3, blur: 0.42, lightGroup: "warm", scale: 0.9, delay: -10, duration: 17, amp: 0.42, safeZone: "cards" },
  { src: `${objects}/current-ribbons.svg`, scene: "arrival", layer: "surface", depth: "far", motion: "currentDrift", x: "-24%", y: "42%", width: "148vw", opacity: 0.035, parallax: 1.5, blur: 0.9, lightGroup: "arrival", delay: -18, duration: 36, amp: 0.34, safeZone: "cards" },
];

const surfaceCreatures: CanvasCreature[] = [
  { creature: "clownfish", fromX: -0.18, toX: 1.18, y: 0.24, size: 46, opacity: 0.46, blur: 0.15, duration: 24, delay: -6, facing: "right", depth: "mid", bob: 0.018, phase: 0.3 },
  { creature: "dolphin", fromX: -0.26, toX: 1.18, y: 0.11, size: 62, opacity: 0.25, blur: 0.65, duration: 38, delay: -21, facing: "right", depth: "far", bob: 0.014, phase: 1.8 },
  { creature: "shrimp", fromX: -0.16, toX: 1.1, y: 0.84, size: 42, opacity: 0.38, blur: 0.16, duration: 22, delay: -12, facing: "right", depth: "mid", bob: 0.006, phase: 2.4 },
  { creature: "jellyfish", fromX: -0.1, toX: 0.86, y: 0.56, size: 50, opacity: 0.3, blur: 0.34, duration: 31, delay: -18, facing: "right", depth: "far", bob: 0.034, phase: 0.9 },
  { creature: "ray", fromX: 1.16, toX: -0.24, y: 0.2, size: 66, opacity: 0.28, blur: 0.56, duration: 34, delay: -14, facing: "left", depth: "far", bob: 0.012, phase: 2.1 },
  { creature: "pufferfish", fromX: 1.12, toX: -0.16, y: 0.73, size: 48, opacity: 0.4, blur: 0.2, duration: 24, delay: -4, facing: "left", depth: "mid", bob: 0.02, phase: 1.2 },
  { creature: "seahorse", fromX: 1.1, toX: 0.02, y: 0.44, size: 43, opacity: 0.34, blur: 0.28, duration: 29, delay: -9, facing: "left", depth: "far", bob: 0.038, phase: 2.8 },
  { creature: "turtle", fromX: 1.13, toX: -0.18, y: 0.86, size: 56, opacity: 0.32, blur: 0.42, duration: 36, delay: -11, facing: "left", depth: "far", bob: 0.01, phase: 0.5 },
  { creature: "whale", fromX: -0.34, toX: 1.02, y: 0.64, size: 82, opacity: 0.16, blur: 0.9, duration: 54, delay: -30, facing: "right", depth: "far", bob: 0.012, phase: 1.4 },
];

const depthRank: Record<ObjectDepth, number> = { far: 0, mid: 1, front: 2 };

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function band(progress: number, start: number, peak: number, end: number) {
  if (progress <= peak) return smoothstep(start, peak, progress);
  return 1 - smoothstep(peak, end, progress);
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rgb(color: [number, number, number], alpha: number) {
  return `rgba(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])}, ${alpha})`;
}

function plateOpacity(progress: number) {
  return {
    abyss: clamp(1 - smoothstep(0.14, 0.38, progress)),
    memory: band(progress, 0.12, 0.36, 0.66),
    surface: band(progress, 0.42, 0.68, 0.88),
    arrival: smoothstep(0.72, 0.96, progress),
  };
}

function sceneToIndex(scene: ScenePhase) {
  switch (scene) {
    case "abyss":
      return 0;
    case "memory":
      return 1;
    case "surface":
      return 2;
    case "arrival":
      return 3;
  }
}

function depthTravel(depth: ObjectDepth) {
  if (depth === "front") return 12;
  if (depth === "mid") return 7;
  return 3;
}

function layerZ(layer: ObjectLayer) {
  switch (layer) {
    case "back":
      return 1;
    case "terrain":
      return 2;
    case "mid":
      return 3;
    case "fauna":
      return 4;
    case "surface":
      return 5;
    case "front":
      return 6;
  }
}

function positiveMod(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function cycle(time: number, duration: number, delay = 0) {
  return positiveMod(time / 1000 + delay, duration) / duration;
}

function loopFade(t: number) {
  return smoothstep(0, 0.08, t) * (1 - smoothstep(0.9, 1, t));
}

function parseCssLength(value: string, axisSize: number, viewportWidth: number, viewportHeight: number) {
  const trimmed = value.trim();
  const numeric = Number.parseFloat(trimmed);
  if (!Number.isFinite(numeric)) return 0;
  if (trimmed.endsWith("vw")) return (numeric / 100) * viewportWidth;
  if (trimmed.endsWith("vh")) return (numeric / 100) * viewportHeight;
  if (trimmed.endsWith("%")) return (numeric / 100) * axisSize;
  return numeric;
}

function imageReady(image: HTMLImageElement | undefined): image is HTMLImageElement {
  return Boolean(image?.complete && image.naturalWidth > 0 && image.naturalHeight > 0);
}

function objectOpacityMultiplier(object: DiveObject) {
  switch (object.lightGroup ?? object.scene) {
    case "abyss":
      return 0.62;
    case "memory":
      return 0.85;
    case "surface":
      return 0.97;
    case "arrival":
    case "warm":
      return 0.98;
  }
}

function objectComposite(object: DiveObject): GlobalCompositeOperation {
  if (object.layer === "back" || object.layer === "surface" || object.layer === "fauna") return "screen";
  if (object.depth === "far") return "screen";
  return "source-over";
}

function getObjectMotion(object: DiveObject, time: number, width: number, height: number, reduceMotion: boolean): MotionState {
  if (reduceMotion) return { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, opacity: 1 };

  const duration = object.duration ?? 20;
  const t = cycle(time, duration, object.delay ?? 0);
  const wave = Math.sin(t * Math.PI * 2);
  const wave2 = Math.sin(t * Math.PI * 4 + 0.7);
  const amp = object.amp ?? 1;

  switch (object.motion) {
    case "schoolCrossRight":
      return {
        x: mix(-0.08 * width, 1.5 * width, t),
        y: Math.sin(t * Math.PI * 3) * height * 0.011 * amp,
        rotation: Math.sin(t * Math.PI * 2) * 0.01 * amp,
        scaleX: 1,
        scaleY: 1,
        opacity: loopFade(t),
      };
    case "schoolCrossLeft":
      return {
        x: mix(0.08 * width, -1.5 * width, t),
        y: Math.sin(t * Math.PI * 3 + 0.4) * height * 0.01 * amp,
        rotation: Math.sin(t * Math.PI * 2 + 0.6) * 0.01 * amp,
        scaleX: 1,
        scaleY: 1,
        opacity: loopFade(t),
      };
    case "schoolTraverse":
      return {
        x: mix(-0.12 * width, 0.2 * width, t) * amp,
        y: Math.sin(t * Math.PI * 2.4) * height * 0.018 * amp,
        rotation: wave * 0.014 * amp,
        scaleX: 1,
        scaleY: 1,
        opacity: 0.5 + loopFade(t) * 0.5,
      };
    case "schoolTraverseReverse":
      return {
        x: mix(0.11 * width, -0.18 * width, t) * amp,
        y: Math.sin(t * Math.PI * 2.3 + 0.8) * height * 0.017 * amp,
        rotation: -wave * 0.014 * amp,
        scaleX: 1,
        scaleY: 1,
        opacity: 0.48 + loopFade(t) * 0.52,
      };
    case "bubbleRise":
      return {
        x: Math.sin(t * Math.PI * 2 + 1.2) * width * 0.018 * amp,
        y: mix(height * 0.1, -height * 0.24, t) * amp,
        rotation: wave * 0.02 * amp,
        scaleX: 0.96 + smoothstep(0.2, 0.85, t) * 0.1,
        scaleY: 0.96 + smoothstep(0.2, 0.85, t) * 0.1,
        opacity: loopFade(t),
      };
    case "kelpSwayStrong":
      return {
        x: wave * width * 0.008 * amp,
        y: wave2 * height * 0.004 * amp,
        rotation: wave * 0.055 * amp,
        scaleX: 1 + wave * 0.018 * amp,
        scaleY: 1,
        opacity: 0.88 + 0.12 * Math.cos(t * Math.PI * 2),
      };
    case "idleSway":
      return {
        x: wave * width * 0.008 * amp,
        y: wave2 * height * 0.005 * amp,
        rotation: wave * 0.025 * amp,
        scaleX: 1,
        scaleY: 1,
        opacity: 0.9 + 0.1 * wave2,
      };
    case "depthDrift":
      return {
        x: wave * width * 0.018 * amp,
        y: Math.cos(t * Math.PI * 2 + 0.5) * height * 0.008 * amp,
        rotation: wave * 0.008 * amp,
        scaleX: 1 + wave2 * 0.012 * amp,
        scaleY: 1 + wave * 0.008 * amp,
        opacity: 0.9 + 0.1 * Math.cos(t * Math.PI * 2),
      };
    case "slowSwim":
    case "schoolLoop":
      return {
        x: wave * width * 0.035 * amp,
        y: wave2 * height * 0.012 * amp,
        rotation: wave * 0.018 * amp,
        scaleX: 1,
        scaleY: 1,
        opacity: 0.82 + 0.18 * Math.cos(t * Math.PI * 2),
      };
    case "currentDrift":
      return {
        x: mix(-0.06 * width, 0.08 * width, t) * amp,
        y: Math.sin(t * Math.PI * 2) * height * 0.008 * amp,
        rotation: -0.08 + wave * 0.01,
        scaleX: 0.98 + smoothstep(0.2, 0.7, t) * 0.06,
        scaleY: 1,
        opacity: 0.56 + 0.44 * Math.sin(t * Math.PI),
      };
    case "foamLap":
      return {
        x: Math.sin(t * Math.PI * 2) * width * 0.024 * amp,
        y: Math.sin(t * Math.PI * 2 + 0.5) * height * 0.006 * amp,
        rotation: wave * 0.004 * amp,
        scaleX: 1 + Math.sin(t * Math.PI) * 0.018 * amp,
        scaleY: 1 + Math.sin(t * Math.PI) * 0.026 * amp,
        opacity: 0.68 + 0.32 * Math.sin(t * Math.PI),
      };
    case "waveBandDrift":
      return {
        x: Math.sin(t * Math.PI * 2) * width * 0.026 * amp,
        y: Math.sin(t * Math.PI * 2 + 0.4) * height * 0.005 * amp,
        rotation: wave * 0.004 * amp,
        scaleX: 1 + Math.sin(t * Math.PI) * 0.018 * amp,
        scaleY: 1 + Math.sin(t * Math.PI) * 0.03 * amp,
        opacity: 0.74 + 0.26 * Math.sin(t * Math.PI),
      };
    case "surfaceRayPulse":
      return {
        x: Math.sin(t * Math.PI * 2) * width * 0.03 * amp,
        y: Math.sin(t * Math.PI * 2 + 0.8) * height * 0.008 * amp,
        rotation: wave * 0.01 * amp,
        scaleX: 0.98 + Math.sin(t * Math.PI) * 0.07 * amp,
        scaleY: 0.98 + Math.sin(t * Math.PI) * 0.05 * amp,
        opacity: 0.5 + 0.5 * Math.sin(t * Math.PI),
      };
    case "cloudDrift":
      return {
        x: mix(-0.05 * width, 0.08 * width, t) * amp,
        y: Math.sin(t * Math.PI * 2 + 0.6) * height * 0.004 * amp,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 0.82 + 0.18 * Math.sin(t * Math.PI),
      };
  }
}

export default function DiveVisualEngine({ sceneIndex, sceneProgress, isTransitioning = false, targetScene = sceneIndex }: Props) {
  const ambientCanvasRef = useRef<HTMLCanvasElement>(null);
  const objectCanvasRef = useRef<HTMLCanvasElement>(null);
  const targetProgressRef = useRef(sceneProgress);
  const progressRef = useRef(sceneProgress);
  const sceneIndexRef = useRef(sceneIndex);
  const isTransitioningRef = useRef(isTransitioning);
  const targetSceneRef = useRef(targetScene);
  targetProgressRef.current = sceneProgress;
  sceneIndexRef.current = sceneIndex;
  isTransitioningRef.current = isTransitioning;
  targetSceneRef.current = targetScene;

  const particles = useMemo<Particle[]>(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const count = isMobile ? 50 : 130;
    return Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 2.4,
      speed: 0.012 + Math.random() * 0.04,
      drift: 8 + Math.random() * 30,
      phase: Math.random() * Math.PI * 2,
      warmth: Math.random(),
    }));
  }, []);

  const objectsByScene = useMemo(() => {
    const sorted = [...diveObjects].sort((a, b) => {
      const layerDiff = layerZ(a.layer) - layerZ(b.layer);
      if (layerDiff !== 0) return layerDiff;
      return depthRank[a.depth] - depthRank[b.depth];
    });
    const grouped = new Map<number, DiveObject[]>();
    for (const obj of sorted) {
      const idx = sceneToIndex(obj.scene);
      const arr = grouped.get(idx);
      if (arr) arr.push(obj);
      else grouped.set(idx, [obj]);
    }
    return grouped;
  }, []);

  const opacityMultiplierCache = useMemo(() => {
    const cache = new Map<DiveObject, number>();
    for (const obj of diveObjects) {
      cache.set(obj, objectOpacityMultiplier(obj));
    }
    return cache;
  }, []);

  useEffect(() => {
    const ambientCanvas = ambientCanvasRef.current;
    const objectCanvas = objectCanvasRef.current;
    if (!ambientCanvas || !objectCanvas) return;

    const ctx = ambientCanvas.getContext("2d");
    const objectCtx = objectCanvas.getContext("2d");
    if (!ctx || !objectCtx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prefersMobileCanvas = window.matchMedia("(max-width: 768px)").matches;
    const lowPowerDevice = (navigator.hardwareConcurrency || 8) <= 4;
    const runLeanCanvas = prefersMobileCanvas || lowPowerDevice;
    let width = 0;
    let height = 0;
    let raf = 0;
    let hidden = document.visibilityState === "hidden";
    const dpr = Math.min(window.devicePixelRatio || 1, runLeanCanvas ? 1.25 : 1.5);
    const targetFrameMs = runLeanCanvas ? 33 : 16;
    const imageMap = new Map<string, HTMLImageElement>();
    let lastPreloadedScene = -1;
    let deferredPreloadTimer = 0;
    let surfaceCreaturePreloadIndex = 0;
    let surfaceCreaturePreloadTimer = 0;
    let drawFrame: FrameRequestCallback | null = null;

    const resize = () => {
      const rect = ambientCanvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      for (const canvas of [ambientCanvas, objectCanvas]) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      objectCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cachedSkyQ = -1;
      cachedVignetteKey = "";
    };

    const drawLightShafts = (time: number, p: number) => {
      const intensity = smoothstep(0.28, 0.78, p);
      if (intensity <= 0.02) return;

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < 8; i++) {
        const x = width * (0.12 + i * 0.12) + Math.sin(time * 0.00022 + i) * 22;
        const shaftWidth = mix(80, 220, intensity) * (0.65 + (i % 3) * 0.2);
        const alpha = intensity * (0.025 + (i % 2) * 0.018);
        const gradient = ctx.createLinearGradient(x, 0, x + shaftWidth * 0.5, height);
        gradient.addColorStop(0, rgb([255, 242, 190], alpha * 1.6));
        gradient.addColorStop(0.3, rgb([220, 244, 220], alpha * 1.1));
        gradient.addColorStop(0.6, rgb([150, 226, 230], alpha * 0.7));
        gradient.addColorStop(1, "rgba(150, 226, 230, 0)");

        ctx.beginPath();
        ctx.moveTo(x - shaftWidth * 0.5, -20);
        ctx.lineTo(x + shaftWidth * 0.85, -20);
        ctx.lineTo(x + shaftWidth * 1.6, height + 40);
        ctx.lineTo(x - shaftWidth * 0.3, height + 40);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      ctx.restore();
    };

    const drawCaustics = (time: number, p: number) => {
      const intensity = smoothstep(0.46, 0.92, p);
      if (intensity <= 0.02) return;

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.lineCap = "round";
      for (let i = 0; i < 16; i++) {
        const yBase = height * (0.1 + i * 0.055);
        ctx.beginPath();
        for (let x = -90; x <= width + 90; x += 28) {
          const y =
            yBase +
            Math.sin(x * 0.013 + time * 0.0005 + i * 0.8) * mix(3, 14, intensity) +
            Math.sin(x * 0.031 - time * 0.00034 + i) * 4;
          if (x === -90) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = rgb([232, 255, 246], intensity * (0.02 + (i % 4) * 0.008));
        ctx.lineWidth = 0.8 + (i % 3) * 0.45;
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawCurrentStreaks = (time: number, p: number) => {
      if (p < 0.08) return;
      const intensity = 0.34 + (1 - smoothstep(0.78, 1, p)) * 0.24;

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.lineCap = "round";
      for (let i = 0; i < 9; i++) {
        const t = positiveMod(time * 0.00004 + i * 0.12, 1);
        const x = mix(-width * 0.22, width * 1.12, t);
        const y = height * (0.12 + i * 0.075) + Math.sin(time * 0.00036 + i) * height * 0.012;
        const lineWidth = width * (0.18 + (i % 3) * 0.06);
        const gradient = ctx.createLinearGradient(x, y, x + lineWidth, y - height * 0.04);
        gradient.addColorStop(0, "rgba(175,244,240,0)");
        gradient.addColorStop(0.48, `rgba(175,244,240,${0.12 * intensity})`);
        gradient.addColorStop(1, "rgba(255,230,164,0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + lineWidth, y - height * 0.04);
        ctx.stroke();
      }
      ctx.restore();
    };

    const glowSize = 32;
    const half = glowSize / 2;
    function makeGlow(r: number, g: number, b: number) {
      const c = document.createElement("canvas");
      c.width = glowSize;
      c.height = glowSize;
      const gc = c.getContext("2d")!;
      const grad = gc.createRadialGradient(half, half, 0, half, half, half);
      grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      gc.fillStyle = grad;
      gc.fillRect(0, 0, glowSize, glowSize);
      return c;
    }
    const glowCold = makeGlow(142, 226, 245);
    const glowWarm = makeGlow(255, 222, 170);

    const ensureImage = (src: string) => {
      let image = imageMap.get(src);
      if (!image) {
        image = new Image();
        image.decoding = "async";
        image.onload = () => {
          if (reduceMotion && !hidden && drawFrame) {
            raf = requestAnimationFrame(drawFrame);
          }
        };
        image.src = src;
        imageMap.set(src, image);
      }
      return image;
    };

    const preloadSceneImages = (index: number) => {
      const sceneObjects = objectsByScene.get(index);
      if (!sceneObjects) return;
      for (const object of sceneObjects) {
        ensureImage(object.src);
      }
    };

    const preloadSurfaceCreatures = () => {
      if (surfaceCreaturePreloadTimer || surfaceCreaturePreloadIndex >= surfaceCreatures.length) return;
      const batchSize = runLeanCanvas ? 2 : 4;
      const loadBatch = () => {
        surfaceCreaturePreloadTimer = 0;
        for (let count = 0; count < batchSize && surfaceCreaturePreloadIndex < surfaceCreatures.length; count += 1) {
          const creature = surfaceCreatures[surfaceCreaturePreloadIndex];
          ensureImage(CREATURE_SPRITES[creature.creature].src);
          surfaceCreaturePreloadIndex += 1;
        }
        if (surfaceCreaturePreloadIndex < surfaceCreatures.length) {
          surfaceCreaturePreloadTimer = window.setTimeout(loadBatch, runLeanCanvas ? 160 : 90);
        }
      };
      surfaceCreaturePreloadTimer = window.setTimeout(loadBatch, 0);
    };

    const scheduleDeferredPreload = (currentScene: number) => {
      if (deferredPreloadTimer) window.clearTimeout(deferredPreloadTimer);
      deferredPreloadTimer = window.setTimeout(() => {
        deferredPreloadTimer = 0;
        preloadSceneImages(currentScene + 1);
        if (currentScene >= 1) preloadSurfaceCreatures();
      }, currentScene === 0 ? 900 : 420);
    };

    const preloadForCurrentScene = () => {
      const currentScene = sceneIndexRef.current;
      if (currentScene === lastPreloadedScene) return;
      lastPreloadedScene = currentScene;
      preloadSceneImages(currentScene);
      scheduleDeferredPreload(currentScene);
    };

    const drawParticles = (time: number, p: number) => {
      const ascent = mix(22, 8, p);
      const brightness = mix(0.55, 1.1, smoothstep(0.3, 0.95, p));
      const warmBlend = smoothstep(0.55, 1, p);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const particle of particles) {
        const drift = Math.sin(time * 0.00035 + particle.phase) * particle.drift;
        const x = ((particle.x * width + drift) % (width + 50)) - 25;
        const y = ((particle.y * height - time * particle.speed * ascent) % (height + 50) + height + 50) % (height + 50) - 25;
        const alpha = (0.06 + particle.warmth * 0.08) * brightness * (1 - smoothstep(0.97, 1, p) * 0.4);
        const r = particle.r * 5;
        const warm = warmBlend * particle.warmth;
        const glow = warm > 0.5 ? glowWarm : glowCold;
        ctx.globalAlpha = alpha;
        ctx.drawImage(glow, x - r, y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const drawCanvasObject = (object: DiveObject, time: number, p: number) => {
      const image = ensureImage(object.src);
      if (!imageReady(image)) return;

      const objectWidth = parseCssLength(object.width, width, width, height);
      const objectHeight = objectWidth * (image.naturalHeight / image.naturalWidth);
      const baseX = parseCssLength(object.x, width, width, height);
      const baseY = parseCssLength(object.y, height, width, height);
      const ascent = smoothstep(0, 1, p);
      const travelY = -((object.parallax ?? depthTravel(object.depth)) * ascent * height) / 100;
      const motion = getObjectMotion(object, time, width, height, reduceMotion);
      const scale = object.scale ?? 1;
      const opacity = object.opacity * motion.opacity;
      if (opacity <= 0.01) return;

      const finalX = baseX + motion.x;
      const finalY = baseY + travelY + motion.y;
      const margin = Math.max(objectWidth, objectHeight) * scale * 0.5;
      if (finalX + objectWidth * scale + margin < 0 || finalX - margin > width ||
          finalY + objectHeight * scale + margin < 0 || finalY - margin > height) {
        return;
      }

      objectCtx.save();
      objectCtx.globalAlpha = opacity * (opacityMultiplierCache.get(object) ?? 1);
      objectCtx.globalCompositeOperation = objectComposite(object);
      objectCtx.translate(baseX + objectWidth / 2 + motion.x, baseY + objectHeight / 2 + travelY + motion.y);
      objectCtx.rotate(motion.rotation);
      objectCtx.scale((object.flip ? -1 : 1) * scale * motion.scaleX, scale * motion.scaleY);
      objectCtx.drawImage(image, -objectWidth / 2, -objectHeight / 2, objectWidth, objectHeight);
      objectCtx.restore();
    };

    const drawSurfaceCreature = (item: CanvasCreature, time: number) => {
      const meta = CREATURE_SPRITES[item.creature];
      const image = ensureImage(meta.src);
      if (!imageReady(image)) return;

      const t = reduceMotion ? 0.42 : cycle(time, item.duration, item.delay);
      const fade = reduceMotion ? 1 : loopFade(t);
      const frame = reduceMotion ? 0 : Math.floor(cycle(time, meta.frameDuration, item.delay) * meta.frames) % meta.frames;
      const frameWidth = image.naturalWidth / meta.frames;
      const frameHeight = image.naturalHeight;
      const depthScale = item.depth === "far" ? 0.86 : item.depth === "mid" ? 1 : 1.12;
      const drawSize = item.size * meta.scale * depthScale;
      const drawWidth = drawSize;
      const drawHeight = drawSize * (frameHeight / frameWidth);
      const x = mix(item.fromX * width, item.toX * width, t);
      const y =
        item.y * height +
        Math.sin(t * Math.PI * 2 + item.phase) * height * item.bob +
        Math.sin(t * Math.PI * 6 + item.phase) * height * item.bob * 0.18;
      const tilt = Math.sin(t * Math.PI * 2 + item.phase) * 0.025;

      objectCtx.save();
      objectCtx.globalAlpha = item.opacity * fade * (item.depth === "far" ? 0.88 : 0.94);
      objectCtx.globalCompositeOperation = item.depth === "far" ? "screen" : "source-over";
      objectCtx.translate(x, y);
      objectCtx.rotate(tilt);
      objectCtx.scale(item.facing === "left" ? -1 : 1, 1);
      objectCtx.drawImage(image, frame * frameWidth, 0, frameWidth, frameHeight, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      objectCtx.restore();
    };

    let cachedSkyQ = -1;
    let cachedBgGradient: CanvasGradient | null = null;
    let cachedVignetteKey = "";
    let cachedVignetteGradient: CanvasGradient | null = null;
    let frameCount = 0;
    let lastDrawTime = 0;

    const draw = (time: number) => {
      if (hidden) return;
      const shouldThrottle = targetFrameMs > 16 && !isTransitioningRef.current;
      if (shouldThrottle && lastDrawTime && time - lastDrawTime < targetFrameMs) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastDrawTime = time;
      frameCount++;
      preloadForCurrentScene();

      const target = targetProgressRef.current;
      const diff = target - progressRef.current;
      if (Math.abs(diff) > 0.001) {
        progressRef.current += diff * 0.08;
      } else {
        progressRef.current = target;
      }
      const p = progressRef.current;
      const depth = 1 - smoothstep(0.12, 0.92, p);
      ctx.clearRect(0, 0, width, height);
      objectCtx.clearRect(0, 0, width, height);

      const sky = smoothstep(0.62, 1, p);
      const skyQ = Math.round(sky * 50) / 50;
      if (skyQ !== cachedSkyQ) {
        cachedSkyQ = skyQ;
        cachedBgGradient = ctx.createLinearGradient(0, 0, 0, height);
        cachedBgGradient.addColorStop(0, rgb([mix(3, 226, skyQ), mix(23, 239, skyQ), mix(46, 226, skyQ)], 0.9));
        cachedBgGradient.addColorStop(0.48, rgb([mix(5, 72, skyQ), mix(58, 166, skyQ), mix(91, 178, skyQ)], 0.72));
        cachedBgGradient.addColorStop(1, rgb([mix(1, 28, skyQ), mix(10, 105, skyQ), mix(28, 126, skyQ)], 0.92));
      }
      ctx.fillStyle = cachedBgGradient!;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      const depthQ = Math.round(depth * 50) / 50;
      const vignetteKey = `${width}x${height}:${skyQ}:${depthQ}`;
      if (vignetteKey !== cachedVignetteKey || !cachedVignetteGradient) {
        cachedVignetteKey = vignetteKey;
        cachedVignetteGradient = ctx.createRadialGradient(width * 0.52, height * 0.32, height * 0.05, width * 0.52, height * 0.42, height * 0.76);
        cachedVignetteGradient.addColorStop(0, `rgba(255, 245, 205, ${0.08 + skyQ * 0.2})`);
        cachedVignetteGradient.addColorStop(0.55, `rgba(0, 20, 40, ${0.03 + depthQ * 0.1})`);
        cachedVignetteGradient.addColorStop(1, `rgba(0, 4, 12, ${0.38 * depthQ})`);
      }
      ctx.fillStyle = cachedVignetteGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      if (frameCount % 2 === 0) {
        drawCurrentStreaks(time, p);
        drawLightShafts(time, p);
        drawCaustics(time, p);
      }
      drawParticles(time, p);

      const sceneObjects = objectsByScene.get(sceneIndexRef.current);
      if (sceneObjects) {
        for (const object of sceneObjects) {
          drawCanvasObject(object, time, p);
        }
      }
      const shedSurfaceFauna = isTransitioningRef.current && (sceneIndexRef.current === 2 || targetSceneRef.current === 2);
      if (sceneIndexRef.current === 2 && !shedSurfaceFauna) {
        for (const creature of surfaceCreatures) {
          drawSurfaceCreature(creature, time);
        }
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };
    drawFrame = draw;

    const onVisibilityChange = () => {
      hidden = document.visibilityState === "hidden";
      if (hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(draw);
      }
    };

    resize();
    preloadForCurrentScene();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibilityChange);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      if (deferredPreloadTimer) window.clearTimeout(deferredPreloadTimer);
      if (surfaceCreaturePreloadTimer) window.clearTimeout(surfaceCreaturePreloadTimer);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [particles, objectsByScene, opacityMultiplierCache]);

  const opacities = plateOpacity(sceneProgress);
  const ascent = smoothstep(0, 1, sceneProgress);

  return (
    <div className="dive-visual-engine fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={ambientCanvasRef} className="dive-ambient-canvas absolute inset-0 h-full w-full" />

      {opacities.abyss > 0.01 && (
        <div
          className="dive-plate dive-plate-abyss"
          style={{ opacity: opacities.abyss, transform: `translate3d(0, ${ascent * -4}vh, 0) scale(${1.04 + ascent * 0.02})` }}
        />
      )}
      {opacities.memory > 0.01 && (
        <div
          className="dive-plate dive-plate-memory"
          style={{ opacity: opacities.memory, transform: `translate3d(0, ${2 - ascent * 8}vh, 0) scale(${1.05 + ascent * 0.025})` }}
        />
      )}
      {opacities.surface > 0.01 && (
        <div
          className="dive-plate dive-plate-surface"
          style={{ opacity: opacities.surface, transform: `translate3d(0, ${5 - ascent * 10}vh, 0) scale(${1.04 + ascent * 0.015})` }}
        />
      )}
      {opacities.arrival > 0.01 && (
        <div
          className="dive-plate dive-plate-arrival"
          style={{ opacity: opacities.arrival, transform: `translate3d(0, ${8 - ascent * 11}vh, 0) scale(${1.03 + ascent * 0.01})` }}
        />
      )}

      <canvas ref={objectCanvasRef} className="dive-object-canvas absolute inset-0 h-full w-full" />

      <div className="dive-silhouette dive-silhouette-left" />
      <div className="dive-silhouette dive-silhouette-right" />
      <div className="dive-surface-glow" />
    </div>
  );
}
