import { test, expect } from '@playwright/test';

test.describe('Title Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for RPG-JS canvas and title screen overlay
    await page.waitForSelector('.title-screen', { timeout: 15_000 });
  });

  test('displays title and seed input', async ({ page }) => {
    await expect(page.locator('.title')).toHaveText('Mnemonic Realms');
    await expect(page.locator('.seed-input')).toBeVisible();
    await expect(page.locator('.btn-primary')).toContainText('New Quest');
    await expect(page.locator('.btn-secondary')).toContainText('Random Seed');
  });

  test('validates seed must be exactly 3 words', async ({ page }) => {
    const input = page.locator('.seed-input');
    const startBtn = page.locator('.btn-primary');

    // Empty input — button disabled
    await expect(startBtn).toBeDisabled();

    // One word
    await input.fill('brave');
    await expect(startBtn).toBeDisabled();

    // Two words
    await input.fill('brave ancient');
    await expect(startBtn).toBeDisabled();

    // Three words — button enabled
    await input.fill('brave ancient warrior');
    await expect(startBtn).toBeEnabled();

    // Four words — disabled again
    await input.fill('brave ancient warrior king');
    await expect(startBtn).toBeDisabled();
  });

  test('random seed fills 3 words', async ({ page }) => {
    await page.locator('.btn-secondary').click();
    const value = await page.locator('.seed-input').inputValue();
    const words = value.trim().split(/\s+/);
    expect(words).toHaveLength(3);
    expect(words.every((w: string) => w.length > 0)).toBe(true);
  });

  test('starting game hides title screen', async ({ page }) => {
    await page.locator('.seed-input').fill('brave ancient warrior');
    await page.locator('.btn-primary').click();
    await expect(page.locator('.title-screen')).not.toBeVisible({ timeout: 5000 });
  });
});
