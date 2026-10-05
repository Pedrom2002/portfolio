import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Contact from "@/components/sections/Contact";
import { personalInfo } from "@/lib/constants";

vi.mock("@gsap/react", () => ({
  useGSAP: (cb: () => void) => cb(),
}));

vi.mock("@/lib/gsap-config", () => ({
  gsap: { from: vi.fn() },
}));

vi.mock("@/components/sections/ContactForm", () => ({
  default: () => <div data-testid="contact-form" />,
}));

afterEach(() => vi.restoreAllMocks());

describe("<Contact />", () => {
  it("renders the 'Let's Work Together' heading", () => {
    render(<Contact />);
    expect(
      screen.getByRole("heading", { level: 2, name: /let.+s work together/i }),
    ).toBeInTheDocument();
  });

  it("renders the form (mocked)", () => {
    render(<Contact />);
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
  });

  it("renders the personal email as a mailto link", () => {
    render(<Contact />);
    const link = screen.getByRole("link", { name: personalInfo.email });
    expect(link).toHaveAttribute("href", `mailto:${personalInfo.email}`);
  });

  it("renders a single CV download link", () => {
    render(<Contact />);
    expect(
      screen.getByRole("link", { name: /curriculum vitae/i }),
    ).toHaveAttribute("href", "/Pedro_Marques_CV.pdf");
    expect(document.querySelectorAll("a[download]")).toHaveLength(1);
  });

  it("renders all social links from constants", () => {
    render(<Contact />);
    for (const social of personalInfo.socials) {
      const link = screen.getByLabelText(social.name);
      expect(link).toHaveAttribute("href", social.url);
    }
  });
});
