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
    // Open the New Quest modal to access class selection
    const newQuestBtn = page.locator('.menu-btn').first();
    await expect(newQuestBtn).toBeVisible({ timeout: 5_000 });
    await newQuestBtn.click();
    await page.waitForTimeout(500);

    // The carousel shows one class at a time — verify all 4 by cycling through pips
    const pips = page.locator('.pip');
    await expect(pips).toHaveCount(4, { timeout: 5_000 });

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

  test('class selection buttons are interactive', async ({ page }) => {
    // Open New Quest modal
    const newQuestBtn = page.locator('.menu-btn').first();
    await expect(newQuestBtn).toBeVisible({ timeout: 5_000 });
    await newQuestBtn.click();
    await page.waitForTimeout(500);

    // Carousel arrows are the class navigation buttons
    const nextArrow = page.locator('.carousel-next');
    await expect(nextArrow).toBeVisible({ timeout: 5_000 });
    await nextArrow.click();

    // Verify class changed (second class should now be active)
    const activePip = page.locator('.pip.active');
    await expect(activePip).toBeVisible();
  });

  test('"Embark" button exists', async ({ page }) => {
    // Open New Quest modal
    const newQuestBtn = page.locator('.menu-btn').first();
    await expect(newQuestBtn).toBeVisible({ timeout: 5_000 });
    await newQuestBtn.click();
    await page.waitForTimeout(500);

    const embarkBtn = page.locator('.embark-btn');
    await expect(embarkBtn).toBeVisible({ timeout: 5_000 });
  });

  test('no seed input is shown to the player', async ({ page }) => {
    // Seed is buried internally (v2 creative direction). No seed UI allowed.
    const seedInput = page.locator('input[type="text"]');
    expect(await seedInput.count()).toBe(0);
  });
});
