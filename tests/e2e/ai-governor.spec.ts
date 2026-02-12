/**
 * AI-Driven E2E Tests using Yuka.js Governor
 * 
 * These tests use AI to control the player and validate gameplay scenarios
 * Reserved Seed: "brave ancient warrior"
 */

import { test, expect } from '@playwright/test';
import { PlayerGovernor, type GovernorConfig, type AIGoal } from '../ai-governor/PlayerGovernor';

const TEST_SEED = 'brave ancient warrior';

test.describe('AI Governor Playtesting', () => {
  test('should complete exploration scenario', async ({ page }) => {
    await page.goto('/');
    
    // Generate test world
    const seedInput = page.locator('input[type="text"]');
    await seedInput.fill(TEST_SEED);
    await page.locator('button:has-text("Generate")').click();
    await page.waitForSelector('text=Generated from seed');

    // Create AI governor configuration
    const config: GovernorConfig = {
      worldSeed: TEST_SEED,
      startPosition: { x: 0, y: 0 },
      goals: [
        { type: 'explore', duration: 5 }, // Explore for 5 seconds
      ],
      maxDuration: 30,
      aggressiveness: 0.3,
      exploration: 0.8,
    };

    // Create and start governor
    const governor = new PlayerGovernor(config);
    governor.start();

    // Run AI for duration
    let running = true;
    const startTime = Date.now();
    
    while (running && (Date.now() - startTime) / 1000 < 10) {
      const delta = 0.016; // ~60 FPS
      running = governor.update(delta);
      await page.waitForTimeout(16);
    }

    // Verify results
    const results = governor.getResults();
    expect(results.completed).toBe(true);
    expect(results.completedGoals).toBe(1);
  });

  test('should record scenario metrics', async ({ page }) => {
    await page.goto('/');
    
    // Generate test world
    const seedInput = page.locator('input[type="text"]');
    await seedInput.fill(TEST_SEED);
    await page.locator('button:has-text("Generate")').click();
    await page.waitForSelector('text=Generated from seed');

    // Create scenario with multiple goals
    const goals: AIGoal[] = [
      { type: 'move', target: { x: 10, y: 10 } },
      { type: 'interact', target: { x: 10, y: 10 } },
      { type: 'move', target: { x: 20, y: 20 } },
    ];

    const config: GovernorConfig = {
      worldSeed: TEST_SEED,
      startPosition: { x: 0, y: 0 },
      goals,
      maxDuration: 60,
      aggressiveness: 0.5,
      exploration: 0.5,
    };

    const governor = new PlayerGovernor(config);
    governor.start();

    // Run simulation
    let running = true;
    const startTime = Date.now();
    
    while (running && (Date.now() - startTime) / 1000 < 30) {
      running = governor.update(0.016);
      await page.waitForTimeout(16);
    }

    // Check metrics
    const results = governor.getResults();
    expect(results.metrics.interactionsPerformed).toBeGreaterThan(0);
    expect(results.metrics.goalsCompleted).toBeGreaterThan(0);
  });

  test('should timeout on impossible scenarios', async ({ page }) => {
    await page.goto('/');
    
    const seedInput = page.locator('input[type="text"]');
    await seedInput.fill(TEST_SEED);
    await page.locator('button:has-text("Generate")').click();
    await page.waitForSelector('text=Generated from seed');

    // Create impossible goal
    const config: GovernorConfig = {
      worldSeed: TEST_SEED,
      startPosition: { x: 0, y: 0 },
      goals: [
        { type: 'move', target: { x: 1000000, y: 1000000 } }, // Unreachable
      ],
      maxDuration: 5, // Short timeout
      aggressiveness: 0.5,
      exploration: 0.5,
    };

    const governor = new PlayerGovernor(config);
    governor.start();

    // Run until timeout
    let running = true;
    const startTime = Date.now();
    
    while (running && (Date.now() - startTime) / 1000 < 10) {
      running = governor.update(0.016);
      await page.waitForTimeout(16);
    }

    // Should have failed due to timeout
    const results = governor.getResults();
    expect(results.completed).toBe(false);
  });
});

test.describe('AI Scenario Capture', () => {
  test('should capture movement scenario', async ({ page }) => {
    await page.goto('/');
    
    const seedInput = page.locator('input[type="text"]');
    await seedInput.fill(TEST_SEED);
    await page.locator('button:has-text("Generate")').click();
    await page.waitForSelector('text=Generated from seed');

    const config: GovernorConfig = {
      worldSeed: TEST_SEED,
      startPosition: { x: 0, y: 0 },
      goals: [
        { type: 'move', target: { x: 5, y: 5 } },
        { type: 'move', target: { x: 10, y: 0 } },
        { type: 'move', target: { x: 0, y: 10 } },
      ],
      maxDuration: 60,
      aggressiveness: 0.5,
      exploration: 0.5,
    };

    const governor = new PlayerGovernor(config);
    governor.start();

    // Capture positions during run
    const positions: Array<{ x: number; y: number; timestamp: number }> = [];
    let running = true;
    const startTime = Date.now();
    
    while (running && (Date.now() - startTime) / 1000 < 30) {
      running = governor.update(0.016);
      
      // Capture position every 100ms
      if (positions.length === 0 || Date.now() - positions[positions.length - 1].timestamp > 100) {
        const pos = governor.getPosition();
        positions.push({
          ...pos,
          timestamp: Date.now() - startTime,
        });
      }
      
      await page.waitForTimeout(16);
    }

    // Verify movement occurred
    expect(positions.length).toBeGreaterThan(10);
    
    // Verify movement from start position
    const startPos = positions[0];
    const endPos = positions[positions.length - 1];
    const distanceMoved = Math.sqrt(
      Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2)
    );
    expect(distanceMoved).toBeGreaterThan(0);

    console.log(`📊 Captured ${positions.length} position samples`);
    console.log(`📏 Total distance moved: ${distanceMoved.toFixed(2)} units`);
  });
});
