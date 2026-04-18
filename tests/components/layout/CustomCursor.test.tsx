import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

const { quickToMock } = vi.hoisted(() => ({
  quickToMock: vi.fn<(...args: unknown[]) => (v: number) => void>(
    () => () => {},
  ),
}));

vi.mock("@/lib/gsap-config", () => ({
  gsap: {
    quickTo: quickToMock,
    to: vi.fn(),
  },
}));

const matchMediaMock = (matches: Record<string, boolean> = {}) =>
  vi.fn((q: string) => ({
    matches: matches[q] ?? false,
    media: q,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;

beforeEach(() => {
  quickToMock.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("<CustomCursor />", () => {
  it("renders nothing on touch devices", async () => {
    window.matchMedia = matchMediaMock({ "(pointer: coarse)": true });
    Object.defineProperty(window.navigator, "hardwareConcurrency", {
      configurable: true,
      value: 16,
    });
    Object.defineProperty(window.navigator, "deviceMemory", {
      configurable: true,
      value: 16,
    });
    const CustomCursor = (await import("@/components/layout/CustomCursor")).default;
    const { container } = render(<CustomCursor />);
    expect(container.firstChild).toBeNull();
  });

  it("renders cursor elements on a pointer device with high tier", async () => {
    window.matchMedia = matchMediaMock();
    Object.defineProperty(window.navigator, "hardwareConcurrency", {
      configurable: true,
      value: 16,
    });
    Object.defineProperty(window.navigator, "deviceMemory", {
      configurable: true,
      value: 16,
    });
    const CustomCursor = (await import("@/components/layout/CustomCursor")).default;
    const { container } = render(<CustomCursor />);
    // ring + dot OR just dot for medium
    expect(container.querySelectorAll("div").length).toBeGreaterThan(0);
    expect(quickToMock).toHaveBeenCalled();
  });
});
