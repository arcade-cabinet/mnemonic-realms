import { describe, expect, it } from 'vitest';
import {
  createSaveData,
  deserializeSave,
  migrateSave,
  SAVE_VERSION,
  serializeSave,
} from '../../../../engine/save/serializer.js';
import type { SaveData } from '../../../../engine/save/types.js';

// ── Test fixtures ───────────────────────────────────────────────────────────

function makeSaveParams() {
  return {
    position: { mapId: 'everwick', x: 18, y: 10 },
    stats: { hp: 45, maxHp: 50, level: 3, xp: 120, className: 'knight' },
    inventory: {
      items: { 'C-HP-01': 5, 'W-SW-01': 1 },
      equipment: { weapon: 'W-SW-01', armor: null, accessory: null },
      gold: 250,
    },
    quests: {
      'MQ-01': {
        questId: 'MQ-01',
        status: 'completed' as const,
        objectives: [
          { index: 0, completed: true },
          { index: 1, completed: true },
        ],
      },
      'MQ-02': {
        questId: 'MQ-02',
        status: 'active' as const,
        objectives: [
          { index: 0, completed: true },
          { index: 1, completed: false },
          { index: 2, completed: false },
        ],
      },
    },
    questFlags: { 'MQ-01': true },
    vibrancy: { everwick: 'remembered', heartfield: 'partial' },
    stones: ['stone-1', 'stone-2'],
    playTime: 3600,
  };
}

// ── createSaveData ──────────────────────────────────────────────────────────

describe('createSaveData', () => {
  it('produces correct structure', () => {
    const data = createSaveData(makeSaveParams());
    expect(data.version).toBe(SAVE_VERSION);
    expect(typeof data.timestamp).toBe('number');
    expect(data.playerPosition).toEqual({ mapId: 'everwick', x: 18, y: 10 });
    expect(data.playerStats.hp).toBe(45);
    expect(data.playerStats.className).toBe('knight');
    expect(data.inventory.items['C-HP-01']).toBe(5);
    expect(data.inventory.equipment.weapon).toBe('W-SW-01');
    expect(data.inventory.gold).toBe(250);
    expect(Object.keys(data.quests)).toHaveLength(2);
    expect(data.questFlags['MQ-01']).toBe(true);
    expect(data.vibrancy.everwick).toBe('remembered');
    expect(data.discoveredStones).toEqual(['stone-1', 'stone-2']);
    expect(data.playTime).toBe(3600);
  });

  it('creates defensive copies (not reference-shared)', () => {
    const params = makeSaveParams();
    const data = createSaveData(params);
    params.position.x = 999;
    expect(data.playerPosition.x).toBe(18);
  });
});

// ── serialize / deserialize round-trip ──────────────────────────────────────

describe('serializeSave / deserializeSave', () => {
  it('round-trips correctly', () => {
    const data = createSaveData(makeSaveParams());
    const json = serializeSave(data);
    const restored = deserializeSave(json);
    expect(restored).not.toBeNull();
    expect(restored!.version).toBe(data.version);
    expect(restored!.playerPosition).toEqual(data.playerPosition);
    expect(restored!.playerStats).toEqual(data.playerStats);
    expect(restored!.inventory).toEqual(data.inventory);
    expect(restored!.quests).toEqual(data.quests);
    expect(restored!.questFlags).toEqual(data.questFlags);
    expect(restored!.vibrancy).toEqual(data.vibrancy);
    expect(restored!.discoveredStones).toEqual(data.discoveredStones);
    expect(restored!.playTime).toBe(data.playTime);
  });
});

// ── deserializeSave error handling ──────────────────────────────────────────

describe('deserializeSave', () => {
  it('returns null on invalid JSON', () => {
    expect(deserializeSave('not-json{')).toBeNull();
  });

  it('returns null on empty string', () => {
    expect(deserializeSave('')).toBeNull();
  });

  it('returns null on missing required fields', () => {
    expect(deserializeSave('{"version": 1}')).toBeNull();
  });

  it('returns null on wrong type (array)', () => {
    expect(deserializeSave('[1, 2, 3]')).toBeNull();
  });

  it('returns null on null value', () => {
    expect(deserializeSave('null')).toBeNull();
  });
});

// ── migrateSave ─────────────────────────────────────────────────────────────

describe('migrateSave', () => {
  it('sets version to current SAVE_VERSION', () => {
    const data = createSaveData(makeSaveParams());
    const oldData = { ...data, version: 0 };
    const migrated = migrateSave(oldData);
    expect(migrated.version).toBe(SAVE_VERSION);
  });

  it('preserves all fields during migration', () => {
    const data = createSaveData(makeSaveParams());
    const migrated = migrateSave(data);
    expect(migrated.playerPosition).toEqual(data.playerPosition);
    expect(migrated.playerStats).toEqual(data.playerStats);
    expect(migrated.quests).toEqual(data.quests);
  });

  it('returns new object (immutable)', () => {
    const data = createSaveData(makeSaveParams());
    const migrated = migrateSave(data);
    expect(migrated).not.toBe(data);
  });
});

// ── SAVE_VERSION ────────────────────────────────────────────────────────────

describe('SAVE_VERSION', () => {
  it('is a positive number', () => {
    expect(SAVE_VERSION).toBeGreaterThan(0);
    expect(Number.isInteger(SAVE_VERSION)).toBe(true);
  });
});

