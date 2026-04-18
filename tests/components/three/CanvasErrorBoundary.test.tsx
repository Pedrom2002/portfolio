import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CanvasErrorBoundary from "@/components/three/CanvasErrorBoundary";

function Boom(): never {
  throw new Error("WebGL exploded");
}

beforeEach(() => {
  // Suppress React's noisy error log during error-boundary tests.
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("<CanvasErrorBoundary />", () => {
  it("renders children when no error is thrown", () => {
    render(
      <CanvasErrorBoundary>
        <div>healthy canvas</div>
      </CanvasErrorBoundary>,
    );
    expect(screen.getByText(/healthy canvas/i)).toBeInTheDocument();
  });

  it("renders the default fallback on error", () => {
    const { container } = render(
      <CanvasErrorBoundary>
        <Boom />
      </CanvasErrorBoundary>,
    );
    const fallback = container.querySelector('[aria-hidden="true"]');
    expect(fallback).not.toBeNull();
    expect(fallback).toHaveClass("bg-[#050812]");
  });

  it("renders a custom fallback when provided", () => {
    render(
      <CanvasErrorBoundary fallback={<p>oops</p>}>
        <Boom />
      </CanvasErrorBoundary>,
    );
    expect(screen.getByText(/oops/i)).toBeInTheDocument();
  });

  it("dispatches a 'scene-ready' event so the preloader unblocks", () => {
    const listener = vi.fn();
    window.addEventListener("scene-ready", listener);
    render(
      <CanvasErrorBoundary>
        <Boom />
      </CanvasErrorBoundary>,
    );
    expect(listener).toHaveBeenCalled();
    window.removeEventListener("scene-ready", listener);
  });
});
