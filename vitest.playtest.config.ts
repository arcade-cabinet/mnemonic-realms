import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/playtest/**/*.spec.ts'],
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 120_000,
  },
});

