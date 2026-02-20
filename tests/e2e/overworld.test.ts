import { test, expect, type Page } from '@playwright/test';

/**
 * Wait for the title screen menu to be ready.
 */
async function waitForTitleMenu(page: Page) {
  await expect(page.getByText('New Journey')).toBeVisible({ timeout: 15_000 });
}

/**
 * Navigate from title screen → class selection → game start.
 */
async function startGame(page: Page) {
  await waitForTitleMenu(page);

  // Click "New Journey" to enter class selection
  await page.getByText('New Journey').click();
  await page.waitForTimeout(500);

  // Click "Begin" to start the game
  await expect(page.getByText('Begin')).toBeVisible({ timeout: 5_000 });
  await page.getByText('Begin').click();
  await page.waitForTimeout(1000);
}

test.describe('Overworld', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('game page loads after class selection', async ({ page }) => {
    await startGame(page);

    // After starting, Expo Router navigates to /game
    // The game page shows "Game Canvas — MnemonicEngine" placeholder
    await expect(page.getByText('Game Canvas')).toBeVisible({ timeout: 10_000 });

    // Title screen text should no longer be visible
    await expect(page.getByText('MNEMONIC REALMS')).not.toBeVisible();
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
    await page.waitForTimeout(2000);

    const critical = errors.filter((msg) => !msg.includes('ResizeObserver'));
    expect(critical).toEqual([]);
  });

  test('movement keys do not crash the game page', async ({ page }) => {
    await startGame(page);

    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // Press arrow keys on the game page — should not cause errors
    for (const key of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']) {
      await page.keyboard.press(key);
      await page.waitForTimeout(200);
    }

    // Game page should still be rendered
    await expect(page.getByText('Game Canvas')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('held movement keys are stable on game page', async ({ page }) => {
    await startGame(page);

    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(1000);
    await page.keyboard.up('ArrowUp');

    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(1000);
    await page.keyboard.up('ArrowRight');

    // Game page should still be rendered
    await expect(page.getByText('Game Canvas')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('title screen is dismissed after starting', async ({ page }) => {
    // Capture initial page content
    const initialContent = await page.locator('#root').innerText();
    await startGame(page);
    const gameContent = await page.locator('#root').innerText();

    // UI must have changed — we're no longer on the title screen
    expect(gameContent).not.toBe(initialContent);
  });
});
