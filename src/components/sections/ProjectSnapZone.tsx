"use client";

import { type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";

export default function ProjectSnapZone({ children }: { children: ReactNode }) {
  useGSAP(() => {
    const panels = gsap.utils.toArray<HTMLElement>('section[id^="project-"]');
    if (panels.length === 0) return;

    // Get the scroll position of each project panel
    const trackers = panels.map((panel) =>
      ScrollTrigger.create({ trigger: panel, start: "top top" })
    );
    const panelStarts = trackers.map((st) => st.start);

    // Single ScrollTrigger with snap, limited to the project zone
    const snapTrigger = ScrollTrigger.create({
      trigger: panels[0],
      start: "top top",
      endTrigger: panels[panels.length - 1],
      end: "bottom bottom",
      snap: {
        snapTo: (_progress, self) => {
          if (!self) return 0;
          const closestScroll = gsap.utils.snap(panelStarts, self.scroll());
          return gsap.utils.normalize(
            self.start,
            self.end,
            closestScroll
          );
        },
        duration: { min: 0.3, max: 0.6 },
        delay: 0.1,
        ease: "power2.inOut",
      },
    });

    return () => {
      trackers.forEach((st) => st.kill());
      snapTrigger.kill();
    };
  }, []);

  return <>{children}</>;
}
