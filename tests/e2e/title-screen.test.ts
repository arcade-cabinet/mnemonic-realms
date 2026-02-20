import { test, expect, type Page } from '@playwright/test';

/**
 * Wait for the title screen menu to be ready.
 * The logo phase types "MNEMONIC REALMS" letter-by-letter, then fades to menu.
 */
async function waitForTitleMenu(page: Page) {
  await expect(page.getByText('New Journey')).toBeVisible({ timeout: 15_000 });
}

test.describe('Title Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('title text animates in', async ({ page }) => {
    // The logo phase renders "MNEMONIC REALMS" via letter-by-letter animation
    await expect(page.getByText('MNEMONIC REALMS')).toBeVisible({ timeout: 10_000 });
  });

  test('menu shows New Journey and Settings', async ({ page }) => {
    await waitForTitleMenu(page);

    await expect(page.getByText('New Journey')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('shows all four class options after clicking New Journey', async ({ page }) => {
    await waitForTitleMenu(page);

    // Click "New Journey" to enter class selection
    await page.getByText('New Journey').click();
    await page.waitForTimeout(500);

    // "Choose Your Path" heading should appear
    await expect(page.getByText('Choose Your Path')).toBeVisible({ timeout: 5_000 });

    // All four class names should be visible
    for (const cls of ['Knight', 'Mage', 'Rogue', 'Cleric']) {
      await expect(page.getByText(cls, { exact: true })).toBeVisible({ timeout: 5_000 });
    }
  });

  test('class selection has Back and Begin buttons', async ({ page }) => {
    await waitForTitleMenu(page);

    await page.getByText('New Journey').click();
    await page.waitForTimeout(500);

    await expect(page.getByText('Back')).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText('Begin')).toBeVisible({ timeout: 5_000 });
  });

  test('Back button returns to menu from class selection', async ({ page }) => {
    await waitForTitleMenu(page);

    await page.getByText('New Journey').click();
    await page.waitForTimeout(500);

    // Click Back to return to menu
    await page.getByText('Back').click();
    await page.waitForTimeout(500);

    // Menu options should be visible again
    await expect(page.getByText('New Journey')).toBeVisible({ timeout: 5_000 });
  });

  test('no seed input is shown to the player', async ({ page }) => {
    await waitForTitleMenu(page);

    // Seed is buried internally (creative direction). No seed UI allowed.
    const seedInput = page.locator('input[type="text"]');
    expect(await seedInput.count()).toBe(0);
  });
});
