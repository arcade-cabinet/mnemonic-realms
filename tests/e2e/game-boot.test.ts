import { test, expect } from '@playwright/test';

test.describe('Game Boot', () => {
  test('page loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/');
    await page.waitForTimeout(5000);

    // Only filter ResizeObserver (Chromium quirk). Everything else is a real error.
    const critical = errors.filter((msg) => !msg.includes('ResizeObserver'));
    expect(critical).toEqual([]);
  });

  test('RPG container exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#rpg')).toBeAttached();
  });

  test('PixiJS canvas renders with non-zero dimensions', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('#rpg > canvas');
    await expect(canvas).toBeAttached({ timeout: 15_000 });

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('no asset 404s on load', async ({ page }) => {
    const failed: string[] = [];
    page.on('requestfailed', (req) => {
      if (req.url().includes('localhost')) {
        failed.push(`${req.failure()?.errorText}: ${req.url()}`);
      }
    });

    await page.goto('/');
    await page.waitForTimeout(5000);
    expect(failed).toEqual([]);
  });

  test('no console errors during boot', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // favicon is a browser concern, not ours
        if (!text.includes('favicon')) {
          errors.push(text);
        }
      }
    });

    await page.goto('/');
    await page.waitForTimeout(5000);
    expect(errors).toEqual([]);
  });

  test('Vue GUI layer mounts alongside canvas', async ({ page }) => {
    await page.goto('/');
    await page.locator('#rpg > canvas').waitFor({ state: 'attached', timeout: 15_000 });

    const guiLayerCount = await page.evaluate(() => {
      const rpg = document.querySelector('#rpg');
      if (!rpg) return 0;
      let count = 0;
      for (const child of rpg.children) {
        if (child.tagName !== 'CANVAS') count++;
      }
      return count;
    });

    expect(guiLayerCount).toBeGreaterThan(0);
  });
});
