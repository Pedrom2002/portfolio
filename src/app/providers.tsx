"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { type ReactNode, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Bridges Lenis smooth-scroll into GSAP ScrollTrigger. Without this
// ScrollTrigger reads native window.scrollY, which Lenis intercepts —
// triggers can fail to fire and `.from({opacity:0})` reveals never play
// on slower machines, leaving sections invisible.
function LenisGsapBridge() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
    // Refresh after fonts + first paint settle so trigger positions reflect
    // the final layout (esp. with 3D canvas mounting + lazy fonts).
    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 600);
    const t2 = window.setTimeout(refresh, 2000);
    window.addEventListener("load", refresh);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: reducedMotion ? 1 : 0.1,
        duration: reducedMotion ? 0 : 1.4,
        smoothWheel: !reducedMotion,
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}

// Re-export for convenience
export { gsap, ScrollTrigger };
