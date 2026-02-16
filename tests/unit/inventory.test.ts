import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  addItem,
  removeItem,
  getInventory,
  equipItem,
  getEquipBonuses,
  addGold,
  removeGold,
  getGold,
} from '../../main/server/systems/inventory';

// ---------------------------------------------------------------------------
// Mock RpgPlayer
// ---------------------------------------------------------------------------

function createMockPlayer(vars: Record<string, unknown> = {}) {
  const store = new Map<string, unknown>(Object.entries(vars));
  return {
    getVariable: vi.fn((key: string) => store.get(key)),
    setVariable: vi.fn((key: string, value: unknown) => store.set(key, value)),
    emit: vi.fn(),
    hp: 50,
    sp: 20,
    param: { maxHp: 100, maxSp: 50 },
  } as unknown as import('@rpgjs/server').RpgPlayer;
}

// ---------------------------------------------------------------------------
// Inventory add/remove
// ---------------------------------------------------------------------------

describe('addItem', () => {
  it('adds an item to empty inventory', () => {
    const player = createMockPlayer();
    addItem(player, 'potion', 3);
    expect(player.setVariable).toHaveBeenCalledWith('INVENTORY', { potion: 3 });
  });

  it('stacks items in existing inventory', () => {
    const player = createMockPlayer({ INVENTORY: { potion: 2 } });
    addItem(player, 'potion', 1);
    expect(player.setVariable).toHaveBeenCalledWith('INVENTORY', { potion: 3 });
  });

  it('defaults quantity to 1', () => {
    const player = createMockPlayer();
    addItem(player, 'potion');
    expect(player.setVariable).toHaveBeenCalledWith('INVENTORY', { potion: 1 });
  });
});

describe('removeItem', () => {
  it('removes items and returns true', () => {
    const player = createMockPlayer({ INVENTORY: { potion: 3 } });
    const result = removeItem(player, 'potion', 2);
    expect(result).toBe(true);
    expect(player.setVariable).toHaveBeenCalledWith('INVENTORY', { potion: 1 });
  });

  it('deletes key when quantity reaches 0', () => {
    const player = createMockPlayer({ INVENTORY: { potion: 1 } });
    const result = removeItem(player, 'potion', 1);
    expect(result).toBe(true);
    // The entry should be deleted (not set to 0)
    const lastCall = (player.setVariable as ReturnType<typeof vi.fn>).mock.calls.find(
      (c) => c[0] === 'INVENTORY',
    );
    expect(lastCall?.[1]).not.toHaveProperty('potion');
  });

  it('returns false when insufficient quantity', () => {
    const player = createMockPlayer({ INVENTORY: { potion: 1 } });
    const result = removeItem(player, 'potion', 5);
    expect(result).toBe(false);
  });

  it('returns false when item does not exist', () => {
    const player = createMockPlayer();
    const result = removeItem(player, 'nonexistent');
    expect(result).toBe(false);
  });
});

describe('getInventory', () => {
  it('returns a copy of inventory contents', () => {
    const player = createMockPlayer({ INVENTORY: { potion: 2, sword: 1 } });
    const inv = getInventory(player);
    expect(inv).toEqual({ potion: 2, sword: 1 });
  });

  it('returns empty object when no inventory', () => {
    const player = createMockPlayer();
    const inv = getInventory(player);
    expect(inv).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// Equipment
// ---------------------------------------------------------------------------

describe('equipItem', () => {
  it('equips a weapon from inventory', () => {
    const player = createMockPlayer({ INVENTORY: { 'W-SW-01': 1 } });
    const result = equipItem(player, 'weapon', 'W-SW-01');
    expect(result).toBe(true);
    // Weapon removed from inventory, equipped
    expect(player.setVariable).toHaveBeenCalledWith('EQUIPMENT', expect.objectContaining({ weapon: 'W-SW-01' }));
  });

  it('equips armor from inventory', () => {
    const player = createMockPlayer({ INVENTORY: { 'A-01': 1 } });
    const result = equipItem(player, 'armor', 'A-01');
    expect(result).toBe(true);
    expect(player.setVariable).toHaveBeenCalledWith('EQUIPMENT', expect.objectContaining({ armor: 'A-01' }));
  });

  it('returns false if item is not in inventory', () => {
    const player = createMockPlayer();
    const result = equipItem(player, 'weapon', 'W-SW-01');
    expect(result).toBe(false);
  });

  it('returns false if weapon ID does not match weapon slot', () => {
    const player = createMockPlayer({ INVENTORY: { 'A-01': 1 } });
    const result = equipItem(player, 'weapon', 'A-01');
    expect(result).toBe(false);
  });

  it('returns false if armor ID does not match armor slot', () => {
    const player = createMockPlayer({ INVENTORY: { 'W-SW-01': 1 } });
    const result = equipItem(player, 'armor', 'W-SW-01');
    expect(result).toBe(false);
  });

  it('returns previously equipped item to inventory', () => {
    const player = createMockPlayer({
      INVENTORY: { 'W-SW-02': 1 },
      EQUIPMENT: { weapon: 'W-SW-01', armor: null, accessory: null },
    });
    equipItem(player, 'weapon', 'W-SW-02');

    // W-SW-01 should be back in inventory, W-SW-02 equipped
    const invCall = (player.setVariable as ReturnType<typeof vi.fn>).mock.calls.find(
      (c) => c[0] === 'INVENTORY',
    );
    expect(invCall?.[1]).toHaveProperty('W-SW-01', 1);
    expect(invCall?.[1]).not.toHaveProperty('W-SW-02');
  });
});

describe('getEquipBonuses', () => {
  it('calculates ATK bonus from sword', () => {
    const player = createMockPlayer({
      INVENTORY: { 'W-SW-01': 1 },
    });
    equipItem(player, 'weapon', 'W-SW-01');
    const bonuses = getEquipBonuses(player);
    expect(bonuses.atk).toBe(5); // W-SW-01 gives +5 atk
  });

  it('calculates INT bonus from wand', () => {
    const player = createMockPlayer({
      INVENTORY: { 'W-WD-01': 1 },
    });
    equipItem(player, 'weapon', 'W-WD-01');
    const bonuses = getEquipBonuses(player);
    expect(bonuses.int).toBe(5); // W-WD-01 gives +5 int
  });

  it('calculates DEF bonus from armor', () => {
    const player = createMockPlayer({
      INVENTORY: { 'A-01': 1 },
    });
    equipItem(player, 'armor', 'A-01');
    const bonuses = getEquipBonuses(player);
    expect(bonuses.def).toBe(3); // A-01 gives +3 def
  });

  it('returns zero bonuses when nothing equipped', () => {
    const player = createMockPlayer();
    const bonuses = getEquipBonuses(player);
    expect(bonuses).toEqual({ atk: 0, def: 0, int: 0 });
  });
});

// ---------------------------------------------------------------------------
// Gold
// ---------------------------------------------------------------------------

describe('gold', () => {
  it('starts at 0', () => {
    const player = createMockPlayer();
    expect(getGold(player)).toBe(0);
  });

  it('adds gold', () => {
    const player = createMockPlayer();
    addGold(player, 100);
    expect(getGold(player)).toBe(100);
  });

  it('removes gold when sufficient', () => {
    const player = createMockPlayer({ GOLD: 50 });
    const result = removeGold(player, 30);
    expect(result).toBe(true);
    expect(getGold(player)).toBe(20);
  });

  it('fails to remove gold when insufficient', () => {
    const player = createMockPlayer({ GOLD: 10 });
    const result = removeGold(player, 50);
    expect(result).toBe(false);
    expect(getGold(player)).toBe(10);
  });
});
