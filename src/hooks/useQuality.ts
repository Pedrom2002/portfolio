"use client";

import { useSyncExternalStore } from "react";
import { getQualityConfig, subscribeQuality } from "@/lib/quality";

const ssrConfig = getQualityConfig();

export function useQuality() {
  return useSyncExternalStore(
    subscribeQuality,
    getQualityConfig,
    () => ssrConfig,
  );
}
