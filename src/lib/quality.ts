"use client";

// Single visual configuration — was a 3-tier system, but the auto-detection
// kept misclassifying mid-range machines and either tanked the look or the
// frame rate. The numbers below are tuned so the scene looks rich on a fast
// GPU and still runs on integrated Intel/AMD chips, paired with the runtime
// optimisations elsewhere (skip galaxy physics when invisible, pause render
// on hidden tabs, hard DPR cap).

export interface QualityConfig {
  particleCount: number;
  /** Fraction of the galaxy particles drawn/simulated (geometry is never rebuilt). */
  particleFraction: number;
  starCount1: number;
  starCount2: number;
  sphereSegments: number;
  atmosphereSegments: number;
  orbitRingPoints: number;
  dpr: [number, number] | number;
  postProcessing: boolean;
  mipmapBlur: boolean;
  bloomIntensity: number;
  showClouds: boolean;
  showCorona: boolean;
  mouseInteraction: "full" | "reduced" | "off";
  customCursor: "full" | "dot" | "off";
}

const CONFIG: QualityConfig = {
  particleCount: 18000,
  particleFraction: 1,
  starCount1: 5000,
  starCount2: 2000,
  sphereSegments: 32,
  atmosphereSegments: 24,
  orbitRingPoints: 80,
  dpr: [1, 1.25],
  postProcessing: true,
  mipmapBlur: false,
  bloomIntensity: 0.45,
  showClouds: true,
  showCorona: true,
  mouseInteraction: "full",
  customCursor: "full",
};

export function getQualityConfig(): QualityConfig {
  return CONFIG;
}

// Adaptive degradation. Level 0 is the full look above and is what every
// capable machine keeps for the whole session. Levels only go up when the
// measured FPS stays low (see PerformanceMonitor in GalaxyCanvas), so strong
// hardware never sees a visual change.
//   1: render at DPR 1
//   2: + bloom off
//   3: + half the galaxy particles
export const MAX_QUALITY_LEVEL = 3;

const LEVEL_CONFIGS: QualityConfig[] = [
  CONFIG,
  { ...CONFIG, dpr: 1 },
  { ...CONFIG, dpr: 1, postProcessing: false },
  { ...CONFIG, dpr: 1, postProcessing: false, particleFraction: 0.5 },
];

export function getQualityConfigForLevel(level: number): QualityConfig {
  return LEVEL_CONFIGS[Math.max(0, Math.min(MAX_QUALITY_LEVEL, level))];
}

// Weak-hardware hint: start already at level 1 (DPR 1 is barely noticeable).
export function getInitialQualityLevel(): number {
  if (typeof navigator === "undefined") return 0;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowCpu = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
  const lowMem = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  return lowCpu || lowMem ? 1 : 0;
}

let level = 0;
const listeners = new Set<() => void>();

export function getQualityLevel(): number {
  return level;
}

export function setQualityLevel(next: number): void {
  const clamped = Math.max(0, Math.min(MAX_QUALITY_LEVEL, next));
  if (clamped === level) return;
  level = clamped;
  listeners.forEach((l) => l());
}

export function subscribeQuality(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
