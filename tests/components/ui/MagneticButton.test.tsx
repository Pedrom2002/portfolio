import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MagneticButton from "@/components/ui/MagneticButton";

const { quickToMock } = vi.hoisted(() => ({
  quickToMock: vi.fn<(target: unknown, prop: string, opts?: unknown) => (v: number) => void>(
    () => () => {},
  ),
}));

vi.mock("@/lib/gsap-config", () => ({
  gsap: { quickTo: quickToMock },
}));

beforeEach(() => {
  quickToMock.mockClear();
  // Force non-touch.
  window.matchMedia = vi.fn((q: string) => ({
    matches: false,
    media: q,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("<MagneticButton />", () => {
  it("renders a <button> when no href", () => {
    const onClick = vi.fn();
    render(
      <MagneticButton onClick={onClick}>Click me</MagneticButton>,
    );
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn.tagName).toBe("BUTTON");
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders an <a> when href is provided (internal)", () => {
    render(
      <MagneticButton href="/about">Go</MagneticButton>,
    );
    const link = screen.getByRole("link", { name: /go/i });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/about");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  it("opens external href in new tab with rel=noopener noreferrer", () => {
    render(
      <MagneticButton href="https://example.com">Out</MagneticButton>,
    );
    const link = screen.getByRole("link", { name: /out/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("registers gsap.quickTo for the magnetic effect on non-touch devices", () => {
    render(<MagneticButton>X</MagneticButton>);
    // 2 calls — one for x, one for y
    expect(quickToMock).toHaveBeenCalledTimes(2);
    expect(quickToMock.mock.calls[0][1]).toBe("x");
    expect(quickToMock.mock.calls[1][1]).toBe("y");
  });
});
