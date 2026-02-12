import { test } from '@playwright/test';

test('capture sword & sorcery aesthetic screenshots', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  await page.screenshot({
    path: 'screenshots/01-landing-page.png',
    fullPage: true,
  });
  
  await page.click('text=Load Saga');
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'screenshots/02-load-game-modal.png',
    fullPage: true,
  });
  
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  
  await page.click('text=Settings');
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'screenshots/03-settings-modal.png',
    fullPage: true,
  });
  
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  
  await page.fill('input[type="text"]', 'dark ancient forest');
  await page.waitForTimeout(300);
  await page.screenshot({
    path: 'screenshots/04-seed-input.png',
    fullPage: true,
  });
});
