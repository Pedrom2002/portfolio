"use client";

import { ReactLenis } from "lenis/react";
import { type ReactNode, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.4,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}

// Re-export for convenience
export { gsap, ScrollTrigger };
