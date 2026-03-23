"use client";

import { useEffect, useRef } from "react";
import { getQualityConfig } from "@/lib/quality";

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition() {
  const mouse = useRef<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    const q = getQualityConfig();
    const throttleMs = q.mouseInteraction === "full" ? 0 : 32;
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (throttleMs > 0) {
        const now = performance.now();
        if (now - lastTime < throttleMs) return;
        lastTime = now;
      }
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mouse;
}
