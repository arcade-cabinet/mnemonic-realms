import { test, expect, type Page } from '@playwright/test';

async function waitForGameReady(page: Page) {
  await page.locator('#rpg > canvas').waitFor({ state: 'attached', timeout: 15_000 });
  await page.waitForTimeout(2000);
}

/** Open New Quest modal, then click Embark on Your Quest. */
async function startGame(page: Page) {
  // Click "New Quest" — first enabled menu button
  const newQuestBtn = page.locator('.menu-btn').first();
  await expect(newQuestBtn).toBeVisible({ timeout: 5_000 });
  await newQuestBtn.click();
  await page.waitForTimeout(500);

  // Click "Embark on Your Quest"
  const embarkBtn = page.locator('.embark-btn');
  await expect(embarkBtn).toBeVisible({ timeout: 5_000 });
  await embarkBtn.click();
  await page.waitForTimeout(3000);
}

test.describe('Overworld', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGameReady(page);
  });

  test('player spawns on everwick after class selection', async ({ page }) => {
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
