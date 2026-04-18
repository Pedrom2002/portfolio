import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// jsdom doesn't implement matchMedia — used by useMediaQuery, quality.ts.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

// jsdom doesn't implement IntersectionObserver — used by Framer Motion's whileInView.
if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
  // @ts-expect-error - simple stub
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}

// jsdom doesn't implement ResizeObserver.
if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  // @ts-expect-error - simple stub
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// PointerEvent stub for user-event in jsdom.
if (typeof window !== "undefined" && !("PointerEvent" in window)) {
  // @ts-expect-error
  window.PointerEvent = class extends Event {
    constructor(type: string, init?: EventInit) {
      super(type, init);
    }
  };
}
