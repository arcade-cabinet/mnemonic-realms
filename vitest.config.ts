import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['gen/**/*.test.ts', 'main/**/*.test.ts', 'tests/unit/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
