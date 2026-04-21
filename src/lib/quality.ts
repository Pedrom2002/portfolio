"use client";

export type QualityTier = "high" | "medium" | "low";

interface QualityConfig {
  tier: QualityTier;
  particleCount: number;
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

const CONFIGS: Record<QualityTier, QualityConfig> = {
  high: {
    tier: "high",
    particleCount: 28000,
    starCount1: 7000,
    starCount2: 2500,
    sphereSegments: 48,
    atmosphereSegments: 32,
    orbitRingPoints: 96,
    dpr: [1, 1.25],
    postProcessing: true,
    mipmapBlur: false,
    bloomIntensity: 0.55,
    showClouds: true,
    showCorona: true,
    mouseInteraction: "full",
    customCursor: "full",
  },
  medium: {
    tier: "medium",
    particleCount: 10000,
    starCount1: 3000,
    starCount2: 1200,
    sphereSegments: 24,
    atmosphereSegments: 16,
    orbitRingPoints: 56,
    dpr: 1,
    postProcessing: false,
    mipmapBlur: false,
    bloomIntensity: 0,
    showClouds: false,
    showCorona: true,
    mouseInteraction: "reduced",
    customCursor: "dot",
  },
  low: {
    tier: "low",
    particleCount: 3500,
    starCount1: 1200,
    starCount2: 0,
    sphereSegments: 16,
    atmosphereSegments: 12,
    orbitRingPoints: 32,
    dpr: 1,
    postProcessing: false,
    mipmapBlur: false,
    bloomIntensity: 0,
    showClouds: false,
    showCorona: false,
    mouseInteraction: "off",
    customCursor: "off",
  },
};

function detectGPURenderer(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "";
    const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return "";
    return (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
  } catch {
    return "";
  }
}

const WEAK_GPU_PATTERNS = [
  /intel.*hd\s*(4[0-6]00|5[0-3]00|graphics)$/i,
  /intel.*uhd/i,
  /intel.*iris(?!.*xe\s*(max|graphics\s*g7))/i,
  /mali-[t4-7]/i,
  /adreno\s*[2-5]/i,
  /swiftshader/i,
  /llvmpipe/i,
  /microsoft basic render/i,
  /powervr/i,
  /apple\s*m1/i,
];

const STRONG_GPU_PATTERNS = [
  /nvidia.*(rtx|gtx\s*1[06-9]|gtx\s*[2-9]\d)/i,
  /radeon.*(rx\s*[5-9]|rx\s*\d{4})/i,
  /apple\s*m[2-9]/i,
];

function detectTier(): QualityTier {
  if (typeof window === "undefined") return "medium";

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return "low";

  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as { deviceMemory?: number }).deviceMemory;
  const renderer = detectGPURenderer();
  const isCoarse = !!window.matchMedia?.("(pointer: coarse)").matches;
  const isSmallScreen = window.screen.width < 768;
  const dpr = window.devicePixelRatio || 1;

  // Hard low triggers — anything that matches drops to low immediately.
  if (renderer && WEAK_GPU_PATTERNS.some((p) => p.test(renderer))) return "low";
  if (cores <= 2) return "low";
  if (mem !== undefined && mem <= 2) return "low";
  if (isCoarse && isSmallScreen) return "low";

  // Known-strong GPU → high (assuming at least quad-core).
  if (renderer && STRONG_GPU_PATTERNS.some((p) => p.test(renderer))) {
    return cores >= 4 ? "high" : "medium";
  }

  // Beefy desktop: many cores, plenty of RAM, mouse pointer, sane DPR.
  const memOk = mem === undefined || mem >= 8;
  const beefy = cores >= 8 && memOk && !isCoarse && dpr <= 2;
  if (beefy) return "high";

  return "medium";
}

let cachedTier: QualityTier | null = null;
const listeners = new Set<() => void>();

export function getQualityTier(): QualityTier {
  if (cachedTier) return cachedTier;
  cachedTier = detectTier();
  return cachedTier;
}

export function getQualityConfig(): QualityConfig {
  return CONFIGS[getQualityTier()];
}

export function subscribeQuality(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function notify() {
  listeners.forEach((l) => { try { l(); } catch { /* noop */ } });
}

export function downgrade(): boolean {
  const before = cachedTier;
  if (cachedTier === "high") cachedTier = "medium";
  else if (cachedTier === "medium") cachedTier = "low";
  if (cachedTier !== before) {
    notify();
    return true;
  }
  return false;
}

export function setTier(tier: QualityTier): void {
  if (cachedTier === tier) return;
  cachedTier = tier;
  notify();
}
