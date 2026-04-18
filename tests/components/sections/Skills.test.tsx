import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Skills from "@/components/sections/Skills";
import { skillCategories } from "@/lib/constants";

vi.mock("@gsap/react", () => ({
  useGSAP: (cb: () => void) => cb(),
}));

vi.mock("@/lib/gsap-config", () => ({
  gsap: { from: vi.fn() },
}));

afterEach(() => vi.restoreAllMocks());

describe("<Skills />", () => {
  it("renders the section heading", () => {
    render(<Skills />);
    expect(
      screen.getByRole("heading", { level: 2, name: /skills & technologies/i }),
    ).toBeInTheDocument();
  });

  it("renders all category headings", () => {
    render(<Skills />);
    for (const cat of skillCategories) {
      expect(
        screen.getByRole("heading", { level: 3, name: cat.name }),
      ).toBeInTheDocument();
    }
  });

  it("renders every skill name", () => {
    render(<Skills />);
    for (const cat of skillCategories) {
      for (const skill of cat.skills) {
        expect(screen.getAllByText(skill.name).length).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
