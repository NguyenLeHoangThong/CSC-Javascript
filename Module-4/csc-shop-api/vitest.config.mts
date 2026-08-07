import { defineConfig } from 'vitest/config';

// Bài 32 — Testing & Debug (backend).
export default defineConfig({
  test: {
    // Node, not jsdom: there is no DOM on the server.
    environment: 'node',
    globals: true, // describe/it/expect without importing them in every file
    include: ['src/**/*.test.ts', 'src/**/__tests__/**/*.test.ts'],
    // Env the code reads at import time. Real secrets never belong in a test run.
    env: {
      NODE_ENV: 'test',
      JWT_ACCESS_SECRET: 'test_access_secret',
      JWT_REFRESH_SECRET: 'test_refresh_secret',
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/__tests__/**', 'src/server.ts'],
    },
  },
});
