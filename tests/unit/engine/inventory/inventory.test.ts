import { describe, it, expect } from 'vitest';
import {
  createInventory,
  addItem,
  removeItem,
  hasItem,
  getItemCount,
  equipItem,
  unequipItem,
  getEquippedItem,
} from '../../../../engine/inventory/inventory.js';

describe('createInventory', () => {
  it('starts with empty items, null equipment, and 0 gold', () => {
    const inv = createInventory();
    expect(inv.items.size).toBe(0);
    expect(inv.equipment.weapon).toBeNull();
    expect(inv.equipment.armor).toBeNull();
    expect(inv.equipment.accessory).toBeNull();
    expect(inv.gold).toBe(0);
  });
});

describe('addItem', () => {
  it('creates a new entry for an unseen item', () => {
    const inv = addItem(createInventory(), 'potion');
    expect(inv.items.get('potion')).toBe(1);
  });

  it('increases count for an existing item', () => {
    let inv = addItem(createInventory(), 'potion');
    inv = addItem(inv, 'potion', 3);
    expect(inv.items.get('potion')).toBe(4);
  });

  it('does not mutate original state', () => {
    const original = createInventory();
    addItem(original, 'potion');
    expect(original.items.size).toBe(0);
  });
});

describe('removeItem', () => {
  it('decreases count by 1 (default)', () => {
    const inv = removeItem(addItem(createInventory(), 'potion', 3), 'potion');
    expect(inv.items.get('potion')).toBe(2);
  });

  it('removes entry when count reaches 0', () => {
    const inv = removeItem(addItem(createInventory(), 'potion', 1), 'potion');
    expect(inv.items.has('potion')).toBe(false);
  });

  it('removes entry when count goes below 0', () => {
    const inv = removeItem(addItem(createInventory(), 'potion', 1), 'potion', 5);
    expect(inv.items.has('potion')).toBe(false);
  });
});

describe('hasItem', () => {
  it('returns true when item present with sufficient count', () => {
    const inv = addItem(createInventory(), 'potion', 3);
    expect(hasItem(inv, 'potion', 2)).toBe(true);
    expect(hasItem(inv, 'potion', 3)).toBe(true);
  });

  it('returns false when item absent or insufficient', () => {
    const inv = addItem(createInventory(), 'potion', 1);
    expect(hasItem(inv, 'potion', 2)).toBe(false);
    expect(hasItem(inv, 'sword')).toBe(false);
  });
});

describe('getItemCount', () => {
  it('returns count for present item', () => {
    const inv = addItem(createInventory(), 'potion', 5);
    expect(getItemCount(inv, 'potion')).toBe(5);
  });

  it('returns 0 for absent item', () => {
    expect(getItemCount(createInventory(), 'potion')).toBe(0);
  });
});

describe('equipItem', () => {
  it('moves item from inventory to equipment slot', () => {
    let inv = addItem(createInventory(), 'iron-sword');
    inv = equipItem(inv, 'iron-sword', 'weapon');
    expect(inv.equipment.weapon).toBe('iron-sword');
    expect(inv.items.has('iron-sword')).toBe(false);
  });

  it('swaps old equipped item back to inventory', () => {
    let inv = addItem(createInventory(), 'iron-sword');
    inv = addItem(inv, 'steel-sword');
    inv = equipItem(inv, 'iron-sword', 'weapon');
    inv = equipItem(inv, 'steel-sword', 'weapon');
    expect(inv.equipment.weapon).toBe('steel-sword');
    expect(inv.items.get('iron-sword')).toBe(1);
    expect(inv.items.has('steel-sword')).toBe(false);
  });
});

describe('unequipItem', () => {
  it('returns equipped item to inventory', () => {
    let inv = addItem(createInventory(), 'iron-sword');
    inv = equipItem(inv, 'iron-sword', 'weapon');
    inv = unequipItem(inv, 'weapon');
    expect(inv.equipment.weapon).toBeNull();
    expect(inv.items.get('iron-sword')).toBe(1);
  });

  it('does nothing for empty slot', () => {
    const inv = createInventory();
    const result = unequipItem(inv, 'weapon');
    expect(result).toBe(inv); // same reference — no change
  });
});

describe('getEquippedItem', () => {
  it('returns item id from slot', () => {
    let inv = addItem(createInventory(), 'iron-sword');
    inv = equipItem(inv, 'iron-sword', 'weapon');
    expect(getEquippedItem(inv, 'weapon')).toBe('iron-sword');
  });

  it('returns null for empty slot', () => {
    expect(getEquippedItem(createInventory(), 'weapon')).toBeNull();
  });
});

