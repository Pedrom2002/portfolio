import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    // vmForks works on Windows where the default pool times out spawning workers.
    pool: "vmForks",
    isolate: false,
    // Module reload + JSDOM init is slow on Windows; raise default timeouts.
    testTimeout: 30_000,
    hookTimeout: 30_000,
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/types/**",
        // 3D / WebGL — covered by Playwright E2E, not jsdom
        "src/components/three/**",
        // App router metadata / framework files
        "src/app/layout.tsx",
        "src/app/page.tsx",
        "src/app/providers.tsx",
        "src/app/error.tsx",
        "src/app/not-found.tsx",
        "src/app/manifest.ts",
        "src/app/sitemap.ts",
        "src/app/robots.ts",
        "src/app/opengraph-image.tsx",
        "src/app/fonts.ts",
        // gsap-config is a side-effect module
        "src/lib/gsap-config.ts",
      ],
    },
  },
});
