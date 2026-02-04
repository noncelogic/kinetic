import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { expect, test } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../screenshots');

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

/**
 * Screenshot capture tests for Kinetic Boilerplate.
 *
 * Run: pnpm --filter @repo/screenshots capture
 *
 * Screenshots are saved to packages/screenshots/screenshots/{page}.png
 *
 * Before running, start the dev server:
 *   pnpm --filter web dev
 */

interface Route {
  name: string;
  path: string;
  waitFor?: string;
  delay?: number;
}

const ROUTES: Route[] = [
  { name: 'landing', path: '/', delay: 1000 },
  { name: 'kinetic-demo', path: '/kinetic', delay: 1000 },
  { name: 'policy-simulator', path: '/kinetic/policy-simulator', delay: 1500 },
  { name: 'showroom', path: '/showroom', delay: 1000 },
];

test.describe('Kinetic Boilerplate Screenshots', () => {
  for (const route of ROUTES) {
    test(`capture ${route.name}`, async ({ page }) => {
      const url = route.path;

      // Navigate with domcontentloaded
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      // Wait for page to be fully interactive
      await page.waitForLoadState('load');

      // Optional: wait for specific selector if defined
      if (route.waitFor) {
        await page.waitForSelector(route.waitFor, { timeout: 30000 });
      }

      // Wait for custom delay or allow animations to settle
      if (route.delay) {
        await page.waitForTimeout(route.delay);
      } else {
        await page.waitForTimeout(500);
      }

      const screenshotPath = path.join(OUTPUT_DIR, `${route.name}.png`);

      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      // Verify screenshot was created
      expect(fs.existsSync(screenshotPath)).toBe(true);

      console.warn(`✓ Captured: ${route.name}`);
    });
  }
});
