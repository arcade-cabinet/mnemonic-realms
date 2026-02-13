import { test, expect } from '@playwright/test';

test.describe('Title Screen', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Mnemonic Realms');
  });

  test('page has RPG container element', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#rpg')).toBeAttached();
  });

  test('page loads JavaScript bundles', async ({ page }) => {
    await page.goto('/');
    // Verify the main script tag is present (Vite-generated)
    const scripts = await page.locator('script[type="module"]').count();
    expect(scripts).toBeGreaterThanOrEqual(1);
  });

  test('page has global/require shims for RPG-JS', async ({ page }) => {
    await page.goto('/');
    const hasGlobal = await page.evaluate(() => typeof window.global !== 'undefined');
    const hasRequire = await page.evaluate(() => typeof window.require !== 'undefined');
    expect(hasGlobal).toBe(true);
    expect(hasRequire).toBe(true);
  });
});
