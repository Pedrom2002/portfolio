import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

const matchMediaMock = () =>
  vi.fn((q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

beforeEach(() => {
  vi.resetModules();
  window.matchMedia = matchMediaMock() as unknown as typeof window.matchMedia;
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1000, writable: true });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 500, writable: true });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useMousePosition", () => {
  it("returns a ref starting at origin", async () => {
    const { useMousePosition } = await import("@/hooks/useMousePosition");
    const { result } = renderHook(() => useMousePosition());
    expect(result.current.current).toEqual({
      x: 0,
      y: 0,
      normalizedX: 0,
      normalizedY: 0,
    });
  });

  it("updates the ref on mouse move and computes normalised coords", async () => {
    const { useMousePosition } = await import("@/hooks/useMousePosition");
    const { result } = renderHook(() => useMousePosition());

    act(() => {
      const ev = new MouseEvent("mousemove", {
        clientX: 750,
        clientY: 125,
      });
      window.dispatchEvent(ev);
    });

    expect(result.current.current.x).toBe(750);
    expect(result.current.current.y).toBe(125);
    // normalizedX = (750/1000)*2 - 1 = 0.5
    expect(result.current.current.normalizedX).toBeCloseTo(0.5, 4);
    // normalizedY = -((125/500)*2 - 1) = -(-0.5) = 0.5
    expect(result.current.current.normalizedY).toBeCloseTo(0.5, 4);
  });

  it("removes the listener on unmount", async () => {
    const { useMousePosition } = await import("@/hooks/useMousePosition");
    const { result, unmount } = renderHook(() => useMousePosition());
    unmount();
    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 999, clientY: 999 }));
    });
    expect(result.current.current.x).toBe(0);
  });
});
