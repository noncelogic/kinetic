import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for screenshot capture.
 *
 * IMPORTANT: Start the dev server manually BEFORE running screenshots:
 *   pnpm --filter web dev   # runs on port 3000
 *
 * Then run: pnpm --filter @repo/screenshots capture
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './output',
  fullyParallel: false, // Sequential for consistent ordering
  timeout: 60000, // 60 second timeout per test
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'on',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'screenshots',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      retries: 2, // Retry failed tests
    },
  ],
  workers: 1, // Sequential to avoid overloading dev server
});
