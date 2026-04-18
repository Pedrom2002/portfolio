import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectsHeader, ProjectDetail } from "@/components/sections/Projects";
import { projects } from "@/lib/constants";

vi.mock("@gsap/react", () => ({
  useGSAP: (cb: () => void) => cb(),
}));

vi.mock("@/lib/gsap-config", () => ({
  gsap: { from: vi.fn() },
}));

afterEach(() => vi.restoreAllMocks());

describe("<ProjectsHeader />", () => {
  it("renders the 'Featured Projects' heading", () => {
    render(<ProjectsHeader />);
    expect(
      screen.getByRole("heading", { level: 2, name: /featured projects/i }),
    ).toBeInTheDocument();
  });
});

describe("<ProjectDetail />", () => {
  it("renders nothing for an out-of-range index", () => {
    const { container } = render(<ProjectDetail index={999} />);
    expect(container.firstChild).toBeNull();
  });

  it.each(projects.map((p, i) => [i, p]))(
    "renders title, description and tech tags for project %i (%s)",
    (i, project) => {
      render(<ProjectDetail index={i as number} />);
      expect(
        screen.getByRole("heading", { level: 3, name: project.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(project.description)).toBeInTheDocument();
      for (const tech of project.technologies) {
        expect(screen.getAllByText(tech).length).toBeGreaterThanOrEqual(1);
      }
    },
  );

  it("renders the Github link when githubUrl is set", () => {
    const project = projects[0];
    render(<ProjectDetail index={0} />);
    const link = screen.getByRole("link", { name: /github repo link/i });
    expect(link).toHaveAttribute("href", project.githubUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the Live Demo link only when demoUrl is set", () => {
    const projectWithDemo = projects.findIndex((p) => p.demoUrl);
    render(<ProjectDetail index={projectWithDemo} />);
    const demo = screen.getByRole("link", { name: /live demo/i });
    expect(demo).toHaveAttribute("href", projects[projectWithDemo].demoUrl!);
  });
});
