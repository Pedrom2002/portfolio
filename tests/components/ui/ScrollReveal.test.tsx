import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const fromMock = vi.fn();
vi.mock("@/lib/gsap-config", () => ({
  gsap: { from: (...args: unknown[]) => fromMock(...args) },
}));

import { useEffect } from "react";
vi.mock("@gsap/react", () => ({
  useGSAP: (cb: () => void) => {
    // Real useGSAP runs after the ref is attached; emulate with useEffect.
    // The mount-only behaviour is intentional — deps list must stay empty.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { cb(); }, []);
  },
}));

beforeEach(() => fromMock.mockClear());
afterEach(() => vi.restoreAllMocks());

describe("<ScrollReveal />", () => {
  it("renders children inside a wrapper div", () => {
    render(
      <ScrollReveal>
        <span>hello</span>
      </ScrollReveal>,
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("applies extra className to the wrapper", () => {
    const { container } = render(
      <ScrollReveal className="my-extra">
        <span>x</span>
      </ScrollReveal>,
    );
    expect(container.firstChild).toHaveClass("my-extra");
  });

  it("calls gsap.from with the configured offset/duration/delay and a ScrollTrigger", () => {
    render(
      <ScrollReveal y={100} duration={1.2} delay={0.3}>
        <span>x</span>
      </ScrollReveal>,
    );
    expect(fromMock).toHaveBeenCalledOnce();
    const opts = fromMock.mock.calls[0][1];
    expect(opts.y).toBe(100);
    expect(opts.duration).toBe(1.2);
    expect(opts.delay).toBe(0.3);
    expect(opts.opacity).toBe(0);
    expect(opts.scrollTrigger).toBeDefined();
    expect(opts.scrollTrigger.start).toBe("top 85%");
  });
});
