import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['gen/**/*.test.ts', 'tests/unit/**/*.test.ts'],
    // Exclude legacy RPG-JS tests (import archived ../../main/server/... paths),
    // platform tests (require @capacitor/haptics and native directories), and
    // storage tests (require SQLite native module unavailable in web-first build).
    exclude: [
      'tests/unit/combat.test.ts',
      'tests/unit/damage.test.ts',
      'tests/unit/memory.test.ts',
      'tests/unit/inventory.test.ts',
      'tests/unit/progression.test.ts',
      'tests/unit/save-load.test.ts',
      'tests/unit/quests.test.ts',
      'tests/unit/vibrancy.test.ts',
      'tests/unit/platform/**',
      'tests/unit/storage/**',
    ],
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
