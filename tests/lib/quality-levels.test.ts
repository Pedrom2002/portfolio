import { afterEach, describe, expect, it } from "vitest";
import {
  MAX_QUALITY_LEVEL,
  getQualityConfig,
  getQualityConfigForLevel,
  getQualityLevel,
  setQualityLevel,
  subscribeQuality,
} from "@/lib/quality";

afterEach(() => setQualityLevel(0));

describe("quality levels", () => {
  it("level 0 is exactly the full config (no visual change on capable machines)", () => {
    expect(getQualityConfigForLevel(0)).toBe(getQualityConfig());
  });

  it("each level only removes cost, never adds it", () => {
    const full = getQualityConfigForLevel(0);
    const l3 = getQualityConfigForLevel(MAX_QUALITY_LEVEL);
    expect(l3.dpr).toBe(1);
    expect(l3.postProcessing).toBe(false);
    expect(l3.particleFraction).toBeLessThan(full.particleFraction);
    // geometry-defining counts are never changed, so nothing is rebuilt
    expect(l3.particleCount).toBe(full.particleCount);
  });

  it("clamps out-of-range levels", () => {
    expect(getQualityConfigForLevel(-5)).toBe(getQualityConfigForLevel(0));
    expect(getQualityConfigForLevel(99)).toBe(getQualityConfigForLevel(MAX_QUALITY_LEVEL));
  });

  it("notifies subscribers only when the level actually changes", () => {
    let calls = 0;
    const unsub = subscribeQuality(() => calls++);
    setQualityLevel(1);
    setQualityLevel(1);
    setQualityLevel(2);
    unsub();
    setQualityLevel(3);
    expect(calls).toBe(2);
    expect(getQualityLevel()).toBe(3);
  });
});
