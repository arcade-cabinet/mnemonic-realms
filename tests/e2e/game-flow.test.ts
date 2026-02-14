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

test.describe('Core Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGameReady(page);
  });

  test('title screen loads and shows class options', async ({ page }) => {
    // Title screen should be visible
    const titleScreen = page.locator('.title-screen');
    await expect(titleScreen.first()).toBeVisible({ timeout: 5_000 });

    // Open class selection via New Quest
    const newQuestBtn = page.locator('.menu-btn').first();
    await expect(newQuestBtn).toBeVisible({ timeout: 5_000 });
    await newQuestBtn.click();
    await page.waitForTimeout(500);

    // Carousel pips represent the 4 class options
    const pips = page.locator('.pip');
    await expect(pips).toHaveCount(4, { timeout: 5_000 });

    // Cycle through all classes and verify names
    const classNames: string[] = [];
    for (let i = 0; i < 4; i++) {
      await pips.nth(i).click();
      await page.waitForTimeout(200);
      const name = await page.locator('.class-name').innerText();
      classNames.push(name.toLowerCase());
    }

    for (const cls of ['knight', 'mage', 'rogue', 'cleric']) {
      expect(
        classNames.some((n) => n.includes(cls)),
        `Missing class: ${cls}`,
      ).toBe(true);
    }
  });

  test('selecting a class transitions to village-hub map', async ({ page }) => {
    await startGame(page);

    // Title screen should be gone
    const titleScreen = page.locator('.title-screen');
    expect(await titleScreen.count()).toBe(0);

    // Canvas still rendering — we're on village-hub now
    const canvas = page.locator('#rpg > canvas');
    await expect(canvas).toBeAttached();
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
  });

  test('player can move on the map', async ({ page }) => {
    await startGame(page);

    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // Test arrow key movement (RPG-JS default input)
    for (const key of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']) {
      await page.keyboard.down(key);
      await page.waitForTimeout(300);
      await page.keyboard.up(key);
      await page.waitForTimeout(100);
    }

    // Held movement should also be stable
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(800);
    await page.keyboard.up('ArrowRight');

    await expect(page.locator('#rpg > canvas')).toBeAttached();
    expect(errors).toEqual([]);
  });

  test('player can interact with an NPC and sees dialogue', async ({ page }) => {
    await startGame(page);

    // Player spawns at tile (15,15). Villager A is at tile (14,15) — one tile left.
    // Walk left to face the NPC.
    await page.keyboard.down('ArrowLeft');
    await page.waitForTimeout(500);
    await page.keyboard.up('ArrowLeft');
    await page.waitForTimeout(300);

    // Press Space (RPG-JS default action key) to interact with NPC
    await page.keyboard.press('Space');
    await page.waitForTimeout(1000);

    // RPG-JS default-gui dialog uses .dialog class with text in a <p> tag
    const dialog = page.locator('.dialog');
    await expect(dialog).toBeVisible({ timeout: 5_000 });

    // Verify dialogue text is present
    const dialogText = dialog.locator('p');
    await expect(dialogText).toBeVisible({ timeout: 3_000 });
    const text = await dialogText.innerText();
    expect(text.length).toBeGreaterThan(0);

    // Dismiss the dialogue
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
  });

  test('pause menu opens and closes', async ({ page }) => {
    await startGame(page);

    // Pause overlay should not be visible initially
    const pauseOverlay = page.locator('.pause-overlay');
    expect(await pauseOverlay.count()).toBe(0);

    // Press Escape to open pause menu
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Pause overlay should now be visible
    await expect(pauseOverlay).toBeVisible({ timeout: 3_000 });

    // Verify menu options are present (Inventory, Quest Log, etc.)
    const menuBtns = pauseOverlay.locator('.menu-btn');
    expect(await menuBtns.count()).toBeGreaterThan(0);

    // Press Escape again to close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Pause overlay should be gone
    await expect(pauseOverlay).not.toBeVisible();
  });
});
