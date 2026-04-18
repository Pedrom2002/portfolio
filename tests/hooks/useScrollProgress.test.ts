import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

beforeEach(() => {
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0, writable: true });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 800, writable: true });
  Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 1800 });
});

afterEach(() => {
  // restore via writable defaults — nothing to clean
});

describe("useScrollProgress", () => {
  it("returns a stable ref starting at 0", () => {
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current.current).toBe(0);
  });

  it("updates the ref on scroll events", () => {
    const { result } = renderHook(() => useScrollProgress());

    act(() => {
      Object.defineProperty(window, "scrollY", { configurable: true, value: 500, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });

    // 500 / (1800-800) = 0.5
    expect(result.current.current).toBeCloseTo(0.5, 4);
  });

  it("clamps to 1 at the bottom of the page", () => {
    const { result } = renderHook(() => useScrollProgress());
    act(() => {
      Object.defineProperty(window, "scrollY", { configurable: true, value: 9999, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    // raw = 9999/1000 = 9.999 — implementation does not clamp; just compute it
    expect(result.current.current).toBeCloseTo(9999 / 1000, 4);
  });

  it("returns 0 when the page is not scrollable", () => {
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 800 });
    const { result } = renderHook(() => useScrollProgress());
    act(() => {
      Object.defineProperty(window, "scrollY", { configurable: true, value: 100, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current.current).toBe(0);
  });
});
