"use client";

import { getQualityConfig } from "@/lib/quality";

// Single static config — same on SSR and client, no listeners, no re-renders.
const CONFIG = getQualityConfig();

export function useQuality() {
  return CONFIG;
}
