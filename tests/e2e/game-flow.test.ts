import { test, expect, type Page } from '@playwright/test';

/**
 * Wait for the title screen to finish its logo animation and show the menu.
 * The logo phase types "MNEMONIC REALMS" letter-by-letter, then fades to menu.
 */
async function waitForTitleMenu(page: Page) {
  // Wait for "New Journey" menu option to appear (menu phase)
  await expect(page.getByText('New Journey')).toBeVisible({ timeout: 15_000 });
}

/**
 * Navigate from title screen menu → class selection → start game.
 * Uses text-based selectors matching the actual React Native UI.
 */
async function startGame(page: Page) {
  await waitForTitleMenu(page);

  // Click "New Journey" to enter class selection
  await page.getByText('New Journey').click();
  await page.waitForTimeout(500);

  // Class selection phase shows "Choose Your Path" heading
  await expect(page.getByText('Choose Your Path')).toBeVisible({ timeout: 5_000 });

  // Click "Begin" to start the game
  await page.getByText('Begin').click();
  await page.waitForTimeout(1000);
}

test.describe('Core Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('title screen loads and shows menu options', async ({ page }) => {
    await waitForTitleMenu(page);

    // Menu should show "New Journey" and "Settings" (no save data = no "Continue")
    await expect(page.getByText('New Journey')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('New Journey opens class selection with all four classes', async ({ page }) => {
    await waitForTitleMenu(page);

    // Click "New Journey" to enter class selection
    await page.getByText('New Journey').click();
    await page.waitForTimeout(500);

    // All four class names should be visible in the class selection phase
    for (const cls of ['Knight', 'Mage', 'Rogue', 'Cleric']) {
      await expect(page.getByText(cls, { exact: true })).toBeVisible({ timeout: 5_000 });
    }
  });

  test('selecting a class and clicking Begin transitions to game page', async ({ page }) => {
    await startGame(page);

    // After starting, Expo Router navigates to /game which shows the game canvas placeholder
    await expect(page.getByText('Game Canvas')).toBeVisible({ timeout: 10_000 });
  });

  test('no errors during game start flow', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await startGame(page);
    await page.waitForTimeout(2000);

    const critical = errors.filter((msg) => !msg.includes('ResizeObserver'));
    expect(critical).toEqual([]);
  });

  test('keyboard navigation works on title menu', async ({ page }) => {
    await waitForTitleMenu(page);

    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // Arrow keys navigate the menu, Enter selects
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(200);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Should have entered class selection
    await expect(page.getByText('Choose Your Path')).toBeVisible({ timeout: 5_000 });

    expect(errors).toEqual([]);
  });
});
