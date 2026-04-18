import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  useIsMobile,
  useIsTouchDevice,
  useMediaQuery,
} from "@/hooks/useMediaQuery";

interface FakeMQL {
  matches: boolean;
  media: string;
  listeners: Set<(e: MediaQueryListEvent) => void>;
  addEventListener: (t: string, cb: (e: MediaQueryListEvent) => void) => void;
  removeEventListener: (t: string, cb: (e: MediaQueryListEvent) => void) => void;
}

const mqls = new Map<string, FakeMQL>();

beforeEach(() => {
  mqls.clear();
  window.matchMedia = vi.fn((query: string) => {
    if (!mqls.has(query)) {
      const mql: FakeMQL = {
        matches: false,
        media: query,
        listeners: new Set(),
        addEventListener: (_t, cb) => mql.listeners.add(cb),
        removeEventListener: (_t, cb) => mql.listeners.delete(cb),
      };
      mqls.set(query, mql);
    }
    return mqls.get(query) as unknown as MediaQueryList;
  }) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  vi.restoreAllMocks();
});

function fire(query: string, matches: boolean) {
  const mql = mqls.get(query)!;
  mql.matches = matches;
  mql.listeners.forEach((cb) =>
    cb({ matches, media: query } as MediaQueryListEvent),
  );
}

describe("useMediaQuery", () => {
  it("returns the initial match state", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 1px)"));
    expect(result.current).toBe(false);
  });

  it("re-renders when the media query changes", () => {
    const q = "(prefers-color-scheme: dark)";
    const { result } = renderHook(() => useMediaQuery(q));
    expect(result.current).toBe(false);
    act(() => fire(q, true));
    expect(result.current).toBe(true);
    act(() => fire(q, false));
    expect(result.current).toBe(false);
  });

  it("removes the listener on unmount", () => {
    const q = "(min-width: 999px)";
    const { unmount } = renderHook(() => useMediaQuery(q));
    expect(mqls.get(q)!.listeners.size).toBe(1);
    unmount();
    expect(mqls.get(q)!.listeners.size).toBe(0);
  });
});

describe("useIsMobile", () => {
  it("queries the mobile breakpoint", () => {
    renderHook(() => useIsMobile());
    expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 768px)");
  });
});

describe("useIsTouchDevice", () => {
  it("queries the coarse-pointer media", () => {
    renderHook(() => useIsTouchDevice());
    expect(window.matchMedia).toHaveBeenCalledWith("(pointer: coarse)");
  });
});
