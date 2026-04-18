import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

beforeEach(() => {
  Object.defineProperty(window.navigator, "hardwareConcurrency", {
    configurable: true,
    value: 16,
  });
  Object.defineProperty(window.navigator, "deviceMemory", {
    configurable: true,
    value: 16,
  });
});

afterEach(() => {
  vi.resetModules();
});

describe("useQuality", () => {
  it("returns the same QualityConfig object across renders (memoised)", async () => {
    const { useQuality } = await import("@/hooks/useQuality");
    const { result, rerender } = renderHook(() => useQuality());
    const a = result.current;
    rerender();
    expect(result.current).toBe(a);
  });

  it("returns a config with the expected shape", async () => {
    const { useQuality } = await import("@/hooks/useQuality");
    const { result } = renderHook(() => useQuality());
    const c = result.current;
    expect(c).toEqual(
      expect.objectContaining({
        tier: expect.any(String),
        particleCount: expect.any(Number),
        sphereSegments: expect.any(Number),
        showClouds: expect.any(Boolean),
      }),
    );
  });
});
