import { test, expect, type Page } from '@playwright/test';

async function waitForGameReady(page: Page) {
  await page.locator('#rpg > canvas').waitFor({ state: 'attached', timeout: 15_000 });
  await page.waitForTimeout(2000);
}

test.describe('Title Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGameReady(page);
  });

  test('title screen GUI is visible', async ({ page }) => {
    const titleScreen = page.locator('.title-screen');
    await expect(titleScreen.first()).toBeVisible({ timeout: 5_000 });
  });

  test('shows all four class options', async ({ page }) => {
    const pageText = await page.locator('#rpg').innerText();
    const lower = pageText.toLowerCase();

    for (const cls of ['knight', 'mage', 'rogue', 'cleric']) {
      expect(lower, `Missing class: ${cls}`).toContain(cls);
    }
  });

  test('class selection buttons are interactive', async ({ page }) => {
    const classBtn = page.locator('.class-btn, .class-grid button').first();
    await expect(classBtn).toBeVisible({ timeout: 5_000 });
    await classBtn.click();
  });

  test('"Begin Journey" button exists', async ({ page }) => {
    const beginBtn = page.locator('button').filter({ hasText: /begin/i }).first();
    await expect(beginBtn).toBeVisible({ timeout: 5_000 });
  });

  test('no seed input is shown to the player', async ({ page }) => {
    // Seed is buried internally (v2 creative direction). No seed UI allowed.
    const seedInput = page.locator('input[type="text"]');
    expect(await seedInput.count()).toBe(0);
  });
});
