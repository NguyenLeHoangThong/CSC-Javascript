import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Bài 32 — Testing & Debug (frontend).
//
// Kept in its OWN file rather than inside vite.config.ts, because vite.config.ts now
// conditionally loads rollup-plugin-visualizer (Bài 37) and there is no reason for a
// test run to touch the bundle analyser.
export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom, not node: components need document/window to render into.
    environment: "jsdom",
    globals: true,
    // Runs before every test file — registers the jest-dom matchers.
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false, // MUI's emotion styles are irrelevant to behaviour and slow to compile
  },
});
