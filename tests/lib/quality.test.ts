import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Module re-imported per test so the cached tier resets.
async function loadFresh() {
  vi.resetModules();
  return await import("@/lib/quality");
}

const matchMediaMock = (matches: Record<string, boolean> = {}) =>
  vi.fn((q: string) => ({
    matches: matches[q] ?? false,
    media: q,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

const setNavigator = (concurrency = 8, deviceMemory?: number) => {
  Object.defineProperty(window.navigator, "hardwareConcurrency", {
    configurable: true,
    value: concurrency,
  });
  if (deviceMemory !== undefined) {
    Object.defineProperty(window.navigator, "deviceMemory", {
      configurable: true,
      value: deviceMemory,
    });
  } else {
    // delete via redefine
    try {
      delete (window.navigator as { deviceMemory?: number }).deviceMemory;
    } catch {
      Object.defineProperty(window.navigator, "deviceMemory", {
        configurable: true,
        value: undefined,
      });
    }
  }
};

beforeEach(() => {
  setNavigator(8);
  Object.defineProperty(window.screen, "width", {
    configurable: true,
    value: 1920,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getQualityConfig / detectTier", () => {
  it("returns 'high' on a beefy desktop", async () => {
    window.matchMedia = matchMediaMock();
    setNavigator(16, 16);
    const { getQualityConfig } = await loadFresh();
    expect(getQualityConfig().tier).toBe("high");
  });

  it("returns 'low' when prefers-reduced-motion is set", async () => {
    window.matchMedia = matchMediaMock({
      "(prefers-reduced-motion: reduce)": true,
    });
    const { getQualityConfig } = await loadFresh();
    expect(getQualityConfig().tier).toBe("low");
  });

  it("returns 'low' on a tiny device (1 core, 1GB ram, mobile)", async () => {
    Object.defineProperty(window.screen, "width", {
      configurable: true,
      value: 360,
    });
    window.matchMedia = matchMediaMock({ "(pointer: coarse)": true });
    setNavigator(1, 1);
    const { getQualityConfig } = await loadFresh();
    expect(getQualityConfig().tier).toBe("low");
  });

  it("returns 'medium' on a mid-range device (4 cores, 4GB ram)", async () => {
    window.matchMedia = matchMediaMock();
    setNavigator(4, 4);
    const { getQualityConfig } = await loadFresh();
    expect(getQualityConfig().tier).toBe("medium");
  });

  it("caches the tier across calls", async () => {
    window.matchMedia = matchMediaMock();
    setNavigator(16, 16);
    const { getQualityConfig, getQualityTier } = await loadFresh();
    const t1 = getQualityTier();

    // Even if hardware "changes", cached tier is returned.
    setNavigator(1, 1);
    const t2 = getQualityTier();
    expect(t1).toBe(t2);

    // Config matches the cached tier.
    expect(getQualityConfig().tier).toBe(t1);
  });

  it("downgrade() steps high -> medium -> low", async () => {
    window.matchMedia = matchMediaMock();
    setNavigator(16, 16);
    const { getQualityConfig, downgrade } = await loadFresh();

    expect(getQualityConfig().tier).toBe("high");
    downgrade();
    expect(getQualityConfig().tier).toBe("medium");
    downgrade();
    expect(getQualityConfig().tier).toBe("low");
    downgrade();
    expect(getQualityConfig().tier).toBe("low");
  });

  it("each tier has internally consistent fields", async () => {
    window.matchMedia = matchMediaMock();
    const { getQualityConfig, downgrade } = await loadFresh();
    const tiers = ["high", "medium", "low"] as const;
    const seen = new Set<string>();
    while (seen.size < 3) {
      const c = getQualityConfig();
      seen.add(c.tier);
      expect(tiers).toContain(c.tier);
      expect(c.particleCount).toBeGreaterThan(0);
      expect(c.sphereSegments).toBeGreaterThan(0);
      expect(c.atmosphereSegments).toBeGreaterThan(0);
      expect(c.orbitRingPoints).toBeGreaterThan(0);
      expect(["full", "reduced", "off"]).toContain(c.mouseInteraction);
      expect(["full", "dot", "off"]).toContain(c.customCursor);
      downgrade();
    }
  });
});
