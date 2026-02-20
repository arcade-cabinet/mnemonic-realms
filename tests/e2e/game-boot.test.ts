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

  test('Expo web root container exists', async ({ page }) => {
    await page.goto('/');
    // Expo web renders into a root <div id="root"> container
    await expect(page.locator('#root')).toBeAttached({ timeout: 10_000 });
  });

  test('title screen renders visible content', async ({ page }) => {
    await page.goto('/');
    // The title screen renders "MNEMONIC REALMS" via letter-by-letter animation.
    // Wait for the text to appear (logo phase completes within ~2s).
    await expect(page.getByText('MNEMONIC REALMS')).toBeVisible({ timeout: 10_000 });
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
});
