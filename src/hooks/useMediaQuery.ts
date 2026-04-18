"use client";

import { useSyncExternalStore } from "react";

const subscribe = (query: string) => (cb: () => void) => {
  const m = window.matchMedia(query);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)");
}

export function useIsTouchDevice() {
  return useMediaQuery("(pointer: coarse)");
}
