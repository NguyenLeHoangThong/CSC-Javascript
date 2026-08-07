import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// Bài 37 — measure before optimising.
//
//   npm run build:analyze
//
// writes dist/stats.html: a treemap of what is actually in the bundle. Run it BEFORE
// reaching for React.memo — in this app the big win was code-splitting the admin
// pages (Bài 37 in router/index.tsx), not memoising components.
export default defineConfig({
  plugins: [
    react(),
    // Only when explicitly requested, so a normal `npm run build` (and CI, and Vercel)
    // stays fast and does not emit a stats file into the deployed output.
    process.env.ANALYZE === "true" &&
      visualizer({
        filename: "dist/stats.html",
        open: true,
        gzipSize: true, // gzip is what the user actually downloads
        brotliSize: true,
      }),
  ],
  build: {
    // Warn earlier than Vite's 500kB default so a chunk creeping up gets noticed.
    chunkSizeWarningLimit: 400,
  },
});
