import { describe, it, expect } from 'vitest';
import { addItem, createInventory } from '../../../../engine/inventory/inventory.js';
import {
  canBuy,
  buyItem,
  sellItem,
  getSellPrice,
} from '../../../../engine/inventory/shop.js';
import type { GameItem } from '../../../../engine/inventory/types.js';

// ── Test fixtures ───────────────────────────────────────────────────────────

const healingHerb: GameItem = {
  id: 'C-01',
  name: 'Healing Herb',
  category: 'consumable',
  description: 'Basic HP restoration.',
  stackable: true,
  maxStack: 99,
  price: 20,
};

const ironSword: GameItem = {
  id: 'W-SW-01',
  name: 'Iron Sword',
  category: 'weapon',
  description: 'Simple iron sword.',
  stackable: false,
  maxStack: 1,
  price: 80,
};

function inventoryWithGold(gold: number) {
  return { ...createInventory(), gold };
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('canBuy', () => {
  it('returns true when player has enough gold', () => {
    const inv = inventoryWithGold(100);
    expect(canBuy(inv, healingHerb, 5)).toBe(true); // 5 * 20 = 100
  });

  it('returns false when gold is insufficient', () => {
    const inv = inventoryWithGold(50);
    expect(canBuy(inv, ironSword, 1)).toBe(false); // 80 > 50
  });

  it('returns false for multiple items exceeding budget', () => {
    const inv = inventoryWithGold(30);
    expect(canBuy(inv, healingHerb, 2)).toBe(false); // 2 * 20 = 40 > 30
  });
});

describe('buyItem', () => {
  it('deducts gold and adds item to inventory', () => {
    const inv = inventoryWithGold(200);
    const result = buyItem(inv, ironSword, 1);
    expect(result.gold).toBe(120); // 200 - 80
    expect(result.items.get('W-SW-01')).toBe(1);
  });

  it('handles buying multiple consumables', () => {
    const inv = inventoryWithGold(100);
    const result = buyItem(inv, healingHerb, 3);
    expect(result.gold).toBe(40); // 100 - 60
    expect(result.items.get('C-01')).toBe(3);
  });
});

describe('sellItem', () => {
  it('adds gold and removes item from inventory', () => {
    let inv = inventoryWithGold(50);
    inv = addItem(inv, 'C-01', 5);
    const result = sellItem(inv, 'C-01', 10, 3); // sell 3 at 10g each
    expect(result.gold).toBe(80); // 50 + 30
    expect(result.items.get('C-01')).toBe(2);
  });

  it('removes item entry when all sold', () => {
    let inv = inventoryWithGold(0);
    inv = addItem(inv, 'C-01', 1);
    const result = sellItem(inv, 'C-01', 10, 1);
    expect(result.gold).toBe(10);
    expect(result.items.has('C-01')).toBe(false);
  });
});

describe('getSellPrice', () => {
  it('returns 50% of buy price (floored)', () => {
    expect(getSellPrice(ironSword)).toBe(40); // 80 * 0.5
    expect(getSellPrice(healingHerb)).toBe(10); // 20 * 0.5
  });

  it('floors odd prices correctly', () => {
    const oddItem: GameItem = {
      id: 'test',
      name: 'Test',
      category: 'consumable',
      description: 'Test',
      stackable: true,
      maxStack: 99,
      price: 75,
    };
    expect(getSellPrice(oddItem)).toBe(37); // floor(75 * 0.5) = 37
  });
});

