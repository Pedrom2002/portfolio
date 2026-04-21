"use client";

import { ReactLenis } from "lenis/react";
import { type ReactNode, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import PerfWatchdog from "@/components/PerfWatchdog";

export default function Providers({ children }: { children: ReactNode }) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
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
      <PerfWatchdog />
      {children}
    </ReactLenis>
  );
}

// Re-export for convenience
export { gsap, ScrollTrigger };
