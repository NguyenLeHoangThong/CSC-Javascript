import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Bài 32 — global test setup.

// Unmount everything after each test. Without this, the previous test's DOM is still
// on the page and `getByText` finds two matches ("Found multiple elements...").
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks();
});

// jsdom does not implement matchMedia, and MUI calls it (useMediaQuery, the theme's
// prefers-color-scheme lookup). Without this stub every component test crashes with
// "matchMedia is not a function".
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(), // deprecated, but MUI still feature-detects it
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});
