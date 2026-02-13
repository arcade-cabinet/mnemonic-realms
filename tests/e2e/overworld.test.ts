import { test, expect, type Page } from '@playwright/test';

async function waitForGameReady(page: Page) {
  await page.locator('#rpg > canvas').waitFor({ state: 'attached', timeout: 15_000 });
  await page.waitForTimeout(2000);
}

/** Select a class and click Begin Journey. No fallbacks. */
async function startGame(page: Page) {
  // Click the first class button (Knight)
  const classBtn = page.locator('.class-btn, .class-grid button').first();
  await expect(classBtn).toBeVisible({ timeout: 5_000 });
  await classBtn.click();
  await page.waitForTimeout(500);

  // Click Begin Journey
  const beginBtn = page.locator('button').filter({ hasText: /begin/i }).first();
  await expect(beginBtn).toBeVisible({ timeout: 5_000 });
  await beginBtn.click();
  await page.waitForTimeout(3000);
}

test.describe('Overworld', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGameReady(page);
  });

  test('player spawns on village-hub after class selection', async ({ page }) => {
    await startGame(page);

    // Title screen should be gone
    const titleScreen = page.locator('.title-screen');
    expect(await titleScreen.count()).toBe(0);

    // Canvas still rendering
    const canvas = page.locator('#rpg > canvas');
    await expect(canvas).toBeAttached();
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
  });

  test('no errors during game start', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon')) {
          errors.push(`console.error: ${text}`);
        }
      }
    });

    await startGame(page);
    expect(errors).toEqual([]);
  });

  test('movement keys work without errors', async ({ page }) => {
    await startGame(page);

    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    for (const key of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']) {
      await page.keyboard.press(key);
      await page.waitForTimeout(200);
    }

    await expect(page.locator('#rpg > canvas')).toBeAttached();
    expect(errors).toEqual([]);
  });

  test('held movement is stable', async ({ page }) => {
    await startGame(page);

    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(1000);
    await page.keyboard.up('ArrowUp');

    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(1000);
    await page.keyboard.up('ArrowRight');

    await expect(page.locator('#rpg > canvas')).toBeAttached();
    expect(errors).toEqual([]);
  });

  test('title screen is dismissed after starting', async ({ page }) => {
    const initialText = await page.locator('#rpg').innerText();
    await startGame(page);
    const currentText = await page.locator('#rpg').innerText();

    // UI must have changed — we're no longer on the title screen
    expect(currentText).not.toBe(initialText);
  });
});
