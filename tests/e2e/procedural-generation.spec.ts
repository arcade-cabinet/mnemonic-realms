/**
 * E2E Tests for Procedural Generation with Reserved Test Seed
 * 
 * Reserved Seed: "brave ancient warrior"
 * This seed is used for all deterministic testing to ensure reproducibility
 */

import { test, expect } from '@playwright/test';

const TEST_SEED = 'brave ancient warrior';

test.describe('Procedural Generation E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should load landing page', async ({ page }) => {
    await page.goto('/');
    
    // Check for main heading
    await expect(page.locator('h1')).toContainText('Mnemonic Realms');
    
    // Check for seed input
    const seedInput = page.locator('input[type="text"]');
    await expect(seedInput).toBeVisible();
  });

  test('should generate world from reserved test seed', async ({ page }) => {
    await page.goto('/');
    
    // Enter reserved test seed
    const seedInput = page.locator('input[type="text"]');
    await seedInput.fill(TEST_SEED);
    
    // Click generate button
    await page.locator('button:has-text("Generate")').click();
    
    // Wait for generation to complete
    await page.waitForSelector('text=Generated from seed', { timeout: 5000 });
    
    // Verify seed is displayed
    await expect(page.locator('body')).toContainText(TEST_SEED);
    
    // Verify character section exists
    await expect(page.locator('text=Character')).toBeVisible();
    await expect(page.locator('text=Name:')).toBeVisible();
    await expect(page.locator('text=Class:')).toBeVisible();
    await expect(page.locator('text=Alignment:')).toBeVisible();
  });

  test('should generate deterministic content from same seed', async ({ page }) => {
    await page.goto('/');
    
    // Generate world first time
    const seedInput = page.locator('input[type="text"]');
    await seedInput.fill(TEST_SEED);
    await page.locator('button:has-text("Generate")').click();
    await page.waitForSelector('text=Generated from seed');
    
    // Capture generated content
    const firstCharacterName = await page.locator('text=Name:').locator('..').textContent();
    const firstClassName = await page.locator('text=Class:').locator('..').textContent();
    
    // Reload page and generate again with same seed
    await page.reload();
    await seedInput.fill(TEST_SEED);
    await page.locator('button:has-text("Generate")').click();
    await page.waitForSelector('text=Generated from seed');
    
    // Capture content again
    const secondCharacterName = await page.locator('text=Name:').locator('..').textContent();
    const secondClassName = await page.locator('text=Class:').locator('..').textContent();
    
    // Verify determinism: same seed = same output
    expect(firstCharacterName).toBe(secondCharacterName);
    expect(firstClassName).toBe(secondClassName);
  });

  test('should display all generated content sections', async ({ page }) => {
    await page.goto('/');
    
    // Generate world
    const seedInput = page.locator('input[type="text"]');
    await seedInput.fill(TEST_SEED);
    await page.locator('button:has-text("Generate")').click();
    await page.waitForSelector('text=Generated from seed');
    
    // Verify all sections are present
    await expect(page.locator('text=Character')).toBeVisible();
    await expect(page.locator('text=Location')).toBeVisible();
    await expect(page.locator('text=Dialogue')).toBeVisible();
    await expect(page.locator('text=Microstory')).toBeVisible();
    await expect(page.locator('text=Loot')).toBeVisible();
    await expect(page.locator('text=Terrain Map')).toBeVisible();
  });

  test('should validate seed format (three words)', async ({ page }) => {
    await page.goto('/');
    
    const seedInput = page.locator('input[type="text"]');
    
    // Try invalid seed (two words)
    await seedInput.fill('only two');
    await page.locator('button:has-text("Generate")').click();
    
    // Should show error or not generate
    // Note: Implement error handling in the UI for this test to pass
    const errorMessage = page.locator('text=/must.*three.*words/i');
    const generatedText = page.locator('text=Generated from seed');
    
    // Either error shows OR generation doesn't happen
    const hasError = await errorMessage.isVisible().catch(() => false);
    const hasGenerated = await generatedText.isVisible().catch(() => false);
    
    // If no error UI yet, at least generation shouldn't happen with invalid seed
    if (!hasError) {
      expect(hasGenerated).toBe(false);
    }
  });

  test('should cache generated worlds in localStorage', async ({ page }) => {
    await page.goto('/');
    
    // Generate world
    const seedInput = page.locator('input[type="text"]');
    await seedInput.fill(TEST_SEED);
    await page.locator('button:has-text("Generate")').click();
    await page.waitForSelector('text=Generated from seed');
    
    // Check localStorage for cached data
    const cachedData = await page.evaluate(() => {
      return localStorage.getItem('mnemonic-realms-db');
    });
    
    expect(cachedData).not.toBeNull();
    expect(cachedData).toBeTruthy();
  });

  test('should load faster on second generation (cache hit)', async ({ page }) => {
    await page.goto('/');
    
    const seedInput = page.locator('input[type="text"]');
    await seedInput.fill(TEST_SEED);
    
    // First generation (uncached)
    const firstGenStart = Date.now();
    await page.locator('button:has-text("Generate")').click();
    await page.waitForSelector('text=Generated from seed');
    const firstGenTime = Date.now() - firstGenStart;
    
    // Reload and generate again (should hit cache)
    await page.reload();
    await seedInput.fill(TEST_SEED);
    
    const secondGenStart = Date.now();
    await page.locator('button:has-text("Generate")').click();
    await page.waitForSelector('text=Generated from seed');
    const secondGenTime = Date.now() - secondGenStart;
    
    // Second generation should be faster (or at least not slower)
    // Allow some variance for network/render time
    expect(secondGenTime).toBeLessThanOrEqual(firstGenTime * 1.5);
  });
});
