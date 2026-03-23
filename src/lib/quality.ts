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
    particleCount: 55000,
    starCount1: 12000,
    starCount2: 5000,
    sphereSegments: 64,
    atmosphereSegments: 48,
    orbitRingPoints: 128,
    dpr: [1, 1.5],
    postProcessing: true,
    mipmapBlur: true,
    bloomIntensity: 0.8,
    showClouds: true,
    showCorona: true,
    mouseInteraction: "full",
    customCursor: "full",
  },
  medium: {
    tier: "medium",
    particleCount: 18000,
    starCount1: 5000,
    starCount2: 2000,
    sphereSegments: 32,
    atmosphereSegments: 24,
    orbitRingPoints: 64,
    dpr: [1, 1.2],
    postProcessing: true,
    mipmapBlur: false,
    bloomIntensity: 0.5,
    showClouds: true,
    showCorona: true,
    mouseInteraction: "reduced",
    customCursor: "dot",
  },
  low: {
    tier: "low",
    particleCount: 6000,
    starCount1: 2000,
    starCount2: 0,
    sphereSegments: 16,
    atmosphereSegments: 16,
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
  /mali-[t4]/i,
  /adreno\s*[23]/i,
  /swiftshader/i,
  /llvmpipe/i,
  /microsoft basic render/i,
  /powervr/i,
];

function detectTier(): QualityTier {
  if (typeof window === "undefined") return "high";

  // prefers-reduced-motion → always low
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return "low";

  let score = 0; // higher = weaker device

  // Hardware concurrency
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 2) score += 3;
  else if (cores <= 4) score += 1;

  // Device memory (Chrome/Edge only)
  const mem = (navigator as { deviceMemory?: number }).deviceMemory;
  if (mem !== undefined) {
    if (mem <= 2) score += 3;
    else if (mem <= 4) score += 1;
  }

  // GPU renderer
  const renderer = detectGPURenderer();
  if (renderer) {
    const isWeak = WEAK_GPU_PATTERNS.some((p) => p.test(renderer));
    if (isWeak) score += 3;
  }

  // Mobile heuristic
  const isCoarse = window.matchMedia?.("(pointer: coarse)").matches;
  const isSmallScreen = window.screen.width < 768;
  if (isCoarse && isSmallScreen) score += 2;

  if (score >= 5) return "low";
  if (score >= 2) return "medium";
  return "high";
}

let cachedTier: QualityTier | null = null;

export function getQualityTier(): QualityTier {
  if (cachedTier) return cachedTier;
  cachedTier = detectTier();
  return cachedTier;
}

export function getQualityConfig(): QualityConfig {
  return CONFIGS[getQualityTier()];
}

export function downgrade(): void {
  if (cachedTier === "high") cachedTier = "medium";
  else if (cachedTier === "medium") cachedTier = "low";
}
