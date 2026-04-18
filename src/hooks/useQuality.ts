"use client";

import { useMemo } from "react";
import { getQualityConfig } from "@/lib/quality";

export function useQuality() {
  return useMemo(() => getQualityConfig(), []);
}
