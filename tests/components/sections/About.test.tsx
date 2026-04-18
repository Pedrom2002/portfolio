import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "@/components/sections/About";
import { personalInfo } from "@/lib/constants";

vi.mock("@gsap/react", () => ({
  useGSAP: (cb: () => void) => cb(),
}));

vi.mock("@/lib/gsap-config", () => ({
  gsap: { from: vi.fn() },
  ScrollTrigger: {},
}));

beforeEach(() => {});
afterEach(() => vi.restoreAllMocks());

describe("<About />", () => {
  it("renders the section heading", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { level: 2, name: /about me/i }),
    ).toBeInTheDocument();
  });

  it("renders the bio from constants", () => {
    render(<About />);
    expect(screen.getByText(personalInfo.bio)).toBeInTheDocument();
  });

  it("renders the location badge", () => {
    render(<About />);
    expect(screen.getByText(personalInfo.location)).toBeInTheDocument();
  });

  it("renders all stats", () => {
    render(<About />);
    for (const stat of personalInfo.stats) {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    }
  });
});
