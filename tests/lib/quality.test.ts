import { describe, expect, it } from "vitest";
import { getQualityConfig } from "@/lib/quality";

describe("getQualityConfig", () => {
  it("returns a single static config", () => {
    const a = getQualityConfig();
    const b = getQualityConfig();
    expect(a).toBe(b);
  });

  it("config has all expected fields with sensible values", () => {
    const c = getQualityConfig();
    expect(c.particleCount).toBeGreaterThan(0);
    expect(c.starCount1).toBeGreaterThan(0);
    expect(c.starCount2).toBeGreaterThanOrEqual(0);
    expect(c.sphereSegments).toBeGreaterThan(0);
    expect(c.atmosphereSegments).toBeGreaterThan(0);
    expect(c.orbitRingPoints).toBeGreaterThan(0);
    expect(typeof c.postProcessing).toBe("boolean");
    expect(typeof c.mipmapBlur).toBe("boolean");
    expect(c.bloomIntensity).toBeGreaterThanOrEqual(0);
    expect(typeof c.showClouds).toBe("boolean");
    expect(typeof c.showCorona).toBe("boolean");
    expect(["full", "reduced", "off"]).toContain(c.mouseInteraction);
    expect(["full", "dot", "off"]).toContain(c.customCursor);
  });
});
