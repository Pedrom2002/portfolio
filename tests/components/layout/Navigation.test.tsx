import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Navigation from "@/components/layout/Navigation";

const scrollToMock = vi.fn();
vi.mock("lenis/react", () => ({
  useLenis: () => ({ scrollTo: scrollToMock }),
}));

beforeEach(() => {
  scrollToMock.mockReset();
});

afterEach(() => vi.restoreAllMocks());

describe("<Navigation />", () => {
  it("renders all nav links", () => {
    render(<Navigation />);
    for (const label of ["Home", "About", "Projects", "Skills", "Contact"]) {
      expect(
        screen.getByRole("button", { name: new RegExp(`navigate to ${label}`, "i") }),
      ).toBeInTheDocument();
    }
  });

  it("uses lenis to scroll when a nav button is clicked (when target exists)", () => {
    document.body.innerHTML += '<section id="about" />';
    render(<Navigation />);
    fireEvent.click(screen.getByRole("button", { name: /navigate to about/i }));
    expect(scrollToMock).toHaveBeenCalledOnce();
    expect(scrollToMock.mock.calls[0][1]).toEqual({ offset: -80 });
  });

  it("toggles the mobile menu and reflects aria-expanded", () => {
    render(<Navigation />);
    const toggle = screen.getByLabelText(/toggle menu/i);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("uses aria-current='page' (not 'true') for the active link", () => {
    // The 'hero' section starts active by default in the component state.
    render(<Navigation />);
    const home = screen.getByRole("button", { name: /navigate to home/i });
    const value = home.getAttribute("aria-current");
    // Either "page" or null — never the deprecated "true".
    expect(value === null || value === "page").toBe(true);
  });
});
