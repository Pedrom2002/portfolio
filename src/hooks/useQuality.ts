"use client";

import { useSyncExternalStore } from "react";
import {
  getQualityConfigForLevel,
  getQualityLevel,
  subscribeQuality,
} from "@/lib/quality";

// Config only changes when the FPS monitor steps the quality level down, so
// it is stable across renders (and identical on SSR and first client render).
export function useQuality() {
  const level = useSyncExternalStore(subscribeQuality, getQualityLevel, () => 0);
  return getQualityConfigForLevel(level);
}
