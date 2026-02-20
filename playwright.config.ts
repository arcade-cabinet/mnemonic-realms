import { defineConfig, devices } from '@playwright/test';

const useDevServer = !!process.env.E2E_DEV;
const port = useDevServer ? 3000 : 4173;

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: ['**/rpgjs-archive/**'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--use-gl=angle',
            '--use-angle=swiftshader',
            '--enable-webgl',
            '--ignore-gpu-blocklist',
            '--enable-gpu-rasterization',
            '--disable-gpu-sandbox',
          ],
        },
      },
    },
  ],
  webServer: {
    command: useDevServer
      ? 'pnpm dev'
      : 'python3 -m http.server 4173 -d dist',
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: useDevServer ? 60_000 : 30_000,
  },
});
