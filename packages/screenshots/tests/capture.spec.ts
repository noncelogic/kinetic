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
  { name: 'kinetic-demo', path: '/kinetic', delay: 2000 },
  { name: 'showroom', path: '/showroom', delay: 1000 },
];

test.describe('Kinetic Boilerplate Screenshots', () => {
  for (const route of ROUTES) {
    test(`capture ${route.name}`, async ({ page }) => {
      const url = route.path;

      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      await page.waitForLoadState('load');

      if (route.waitFor) {
        await page.waitForSelector(route.waitFor, { timeout: 30000 });
      }

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

      expect(fs.existsSync(screenshotPath)).toBe(true);

      console.warn(`✓ Captured: ${route.name}`);
    });
  }
});

/**
 * Policy Simulator Flow - captures multiple states of the interactive demo
 */
test.describe('Policy Simulator Flow', () => {
  test('capture initial state', async ({ page }) => {
    await page.goto('/kinetic/policy-simulator', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);

    const screenshotPath = path.join(OUTPUT_DIR, 'policy-simulator-01-initial.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    expect(fs.existsSync(screenshotPath)).toBe(true);
    console.warn('✓ Captured: policy-simulator-01-initial');
  });

  test('capture violation state', async ({ page }) => {
    await page.goto('/kinetic/policy-simulator', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);

    // Click the "Violate Policy" button
    const violateButton = page.getByRole('button', {
      name: /Violate Policy/i,
    });
    await violateButton.click();

    // Wait for the result to appear
    await page.waitForTimeout(1500);

    const screenshotPath = path.join(OUTPUT_DIR, 'policy-simulator-02-violation.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    expect(fs.existsSync(screenshotPath)).toBe(true);
    console.warn('✓ Captured: policy-simulator-02-violation');
  });

  test('capture compliant state', async ({ page }) => {
    await page.goto('/kinetic/policy-simulator', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);

    // Click the "Comply" button
    const complyButton = page.getByRole('button', { name: /Comply/i });
    await complyButton.click();

    // Wait for the result to appear
    await page.waitForTimeout(1500);

    const screenshotPath = path.join(OUTPUT_DIR, 'policy-simulator-03-compliant.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    expect(fs.existsSync(screenshotPath)).toBe(true);
    console.warn('✓ Captured: policy-simulator-03-compliant');
  });
});
