import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Hero from "@/components/sections/Hero";
import { personalInfo } from "@/lib/constants";

const scrollToMock = vi.fn();
vi.mock("lenis/react", () => ({
  useLenis: () => ({ scrollTo: scrollToMock }),
}));

vi.mock("@gsap/react", () => ({
  useGSAP: (cb: () => void) => cb(),
}));

vi.mock("@/lib/gsap-config", () => ({
  gsap: {
    timeline: () => {
      const tl = {
        from: () => tl,
      };
      return tl;
    },
    quickTo: vi.fn(() => vi.fn()),
  },
}));

beforeEach(() => {
  scrollToMock.mockReset();
  document.body.innerHTML +=
    '<section id="projects" /><section id="contact" />';
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("<Hero />", () => {
  it("renders the personal name as a heading", () => {
    render(<Hero />);
    // Hero splits the name by word with a non-breaking space; query by level only
    // and assert each word is present in the accessible name.
    const heading = screen.getByRole("heading", { level: 1 });
    for (const word of personalInfo.name.split(" ")) {
      expect(heading.textContent).toContain(word);
    }
  });

  it("shows the title and subtitle from constants", () => {
    render(<Hero />);
    expect(screen.getByText(personalInfo.title)).toBeInTheDocument();
    expect(screen.getByText(personalInfo.subtitle)).toBeInTheDocument();
  });

  it("scrolls to #projects when 'View My Work' is clicked", () => {
    render(<Hero />);
    fireEvent.click(screen.getByRole("button", { name: /view my work/i }));
    expect(scrollToMock).toHaveBeenCalledOnce();
    expect(scrollToMock.mock.calls[0][1]).toEqual({ offset: -80 });
  });

  it("scrolls to #contact when 'Get in Touch' is clicked", () => {
    render(<Hero />);
    fireEvent.click(screen.getByRole("button", { name: /get in touch/i }));
    expect(scrollToMock).toHaveBeenCalledOnce();
  });

  it("renders 'Available for work' badge", () => {
    render(<Hero />);
    expect(screen.getByText(/available for work/i)).toBeInTheDocument();
  });
});
