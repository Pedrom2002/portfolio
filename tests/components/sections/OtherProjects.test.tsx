import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import OtherProjects from "@/components/sections/OtherProjects";
import { otherProjects } from "@/lib/constants";

vi.mock("@gsap/react", () => ({ useGSAP: (cb: () => void) => cb() }));
vi.mock("@/lib/gsap-config", () => ({ gsap: { from: vi.fn() } }));

describe("<OtherProjects />", () => {
  it("renders the section heading", () => {
    render(<OtherProjects />);
    expect(screen.getByRole("heading", { level: 2, name: /more projects/i })).toBeInTheDocument();
  });

  it.each(otherProjects.map((p) => [p.title, p]))("renders %s", (_t, project) => {
    render(<OtherProjects />);
    expect(screen.getByRole("heading", { level: 3, name: project.title })).toBeInTheDocument();
    expect(screen.getByText(project.description)).toBeInTheDocument();
  });
});
