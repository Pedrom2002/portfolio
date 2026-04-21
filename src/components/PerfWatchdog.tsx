"use client";

import { useEffect } from "react";
import { downgrade } from "@/lib/quality";

// Rolling FPS monitor. If average drops below LOW_FPS for SUSTAIN_MS in a row
// the quality tier is downgraded one step. Re-evaluates after a cool-down so
// the new tier gets a fair chance before any further downgrade.
const SAMPLE_MS = 1000;
const LOW_FPS = 30;
const SUSTAIN_SAMPLES = 4;       // 4 consecutive bad samples
const COOLDOWN_MS = 4000;        // wait after a downgrade before sampling again
const STARTUP_DELAY_MS = 2500;   // skip the noisy first paint window

export default function PerfWatchdog() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId = 0;
    let frames = 0;
    let windowStart = 0;
    let badStreak = 0;
    let suspendedUntil = performance.now() + STARTUP_DELAY_MS;
    let stopped = false;

    const tick = (t: number) => {
      if (stopped) return;
      if (document.hidden) {
        // Reset on hidden tab — frames don't advance, would skew FPS.
        windowStart = t;
        frames = 0;
        rafId = requestAnimationFrame(tick);
        return;
      }
      if (t < suspendedUntil) {
        windowStart = t;
        frames = 0;
        rafId = requestAnimationFrame(tick);
        return;
      }
      if (windowStart === 0) windowStart = t;
      frames++;
      const elapsed = t - windowStart;
      if (elapsed >= SAMPLE_MS) {
        const fps = (frames / elapsed) * 1000;
        if (fps < LOW_FPS) {
          badStreak++;
          if (badStreak >= SUSTAIN_SAMPLES) {
            const dropped = downgrade();
            badStreak = 0;
            suspendedUntil = t + COOLDOWN_MS;
            if (!dropped) stopped = true; // already at lowest tier
          }
        } else {
          badStreak = 0;
        }
        frames = 0;
        windowStart = t;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
