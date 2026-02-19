import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  serializePlayer,
  deserializePlayer,
  saveGame,
  loadGame,
  autoSave,
  type SaveData,
} from '../../main/server/systems/save-load';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('../../main/server/systems/skills', () => ({
  checkSkillUnlocks: vi.fn(),
}));
vi.mock('../../main/server/systems/vibrancy', () => ({
  VIBRANCY_ZONES: ['everwick', 'heartfield', 'ambergrove'],
}));

import { checkSkillUnlocks } from '../../main/server/systems/skills';

// ---------------------------------------------------------------------------
// localStorage mock
// ---------------------------------------------------------------------------

const mockStorage = new Map<string, string>();
const localStorageMock = {
  getItem: vi.fn((key: string) => mockStorage.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => mockStorage.set(key, value)),
  removeItem: vi.fn((key: string) => mockStorage.delete(key)),
};
vi.stubGlobal('localStorage', localStorageMock);

// ---------------------------------------------------------------------------
// Mock RpgPlayer
// ---------------------------------------------------------------------------

function createMockPlayer(vars: Record<string, unknown> = {}) {
  const store = new Map<string, unknown>(Object.entries(vars));
  return {
    getVariable: vi.fn((key: string) => store.get(key)),
    setVariable: vi.fn((key: string, value: unknown) => store.set(key, value)),
    emit: vi.fn(),
    hp: 100,
    sp: 50,
    param: { maxHp: 100, maxSp: 50 },
    position: { x: 100, y: 200 },
    setClass: vi.fn(),
    changeMap: vi.fn().mockResolvedValue(undefined),
    // getAllVarsMap reads (player as any).variables
    variables: store,
    // getPlayerMapId reads (player as any).map
    map: 'everwick',
  } as unknown as import('@rpgjs/server').RpgPlayer;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a complete SaveData object with sensible defaults, allowing overrides. */
function makeSaveData(overrides: Partial<SaveData> = {}): SaveData {
  return {
    version: 1,
    timestamp: Date.now(),
    mapId: 'everwick',
    positionX: 100,
    positionY: 200,
    classId: 'knight',
    level: 5,
    xp: 1200,
    hp: 80,
    sp: 30,
    stats: { hp: 120, sp: 60, atk: 25, int: 10, def: 20, agi: 15 },
    inventory: { potion: 3, ether: 1 },
    equipment: { weapon: 'iron-sword', armor: 'leather-vest', accessory: null },
    equipBonuses: { atk: 5, def: 3, int: 0 },
    gold: 500,
    memoryFragments: ['fragment-echo-1', 'fragment-dawn-3'],
    vibrancy: { 'everwick': 70, heartfield: 55, ambergrove: 45 },
    variables: { questProgress: 2, talkedToElder: true },
    playTimeMs: 3600000,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
  mockStorage.clear();
});

// ---------------------------------------------------------------------------
// serializePlayer
// ---------------------------------------------------------------------------

describe('serializePlayer', () => {
  it('extracts all expected fields from player state', () => {
    const player = createMockPlayer({
      PLAYER_CLASS_ID: 'knight',
      PLAYER_LEVEL: 5,
      PLAYER_XP: 1200,
      PLAYER_HP: 120,
      PLAYER_SP: 60,
      PLAYER_ATK: 25,
      PLAYER_INT: 10,
      PLAYER_DEF: 20,
      PLAYER_AGI: 15,
      INVENTORY: { potion: 3 },
      EQUIPMENT: { weapon: 'iron-sword', armor: null, accessory: null },
      EQUIP_BONUSES: { atk: 5, def: 0, int: 0 },
      GOLD: 500,
      MEMORY_FRAGMENTS: ['fragment-echo-1'],
      PLAY_TIME_MS: 3600000,
      VIBRANCY_heartfield: 55,
      'VIBRANCY_everwick': 70,
      VIBRANCY_ambergrove: 45,
      questProgress: 2,
    });

    const data = serializePlayer(player);

    expect(data.version).toBe(1);
    expect(data.timestamp).toBeGreaterThan(0);
    expect(data.mapId).toBe('everwick');
    expect(data.positionX).toBe(100);
    expect(data.positionY).toBe(200);
    expect(data.classId).toBe('knight');
    expect(data.level).toBe(5);
    expect(data.xp).toBe(1200);
    expect(data.hp).toBe(100); // player.hp, not PLAYER_HP stat
    expect(data.sp).toBe(50); // player.sp, not PLAYER_SP stat
    expect(data.stats).toEqual({ hp: 120, sp: 60, atk: 25, int: 10, def: 20, agi: 15 });
    expect(data.inventory).toEqual({ potion: 3 });
    expect(data.equipment).toEqual({ weapon: 'iron-sword', armor: null, accessory: null });
    expect(data.equipBonuses).toEqual({ atk: 5, def: 0, int: 0 });
    expect(data.gold).toBe(500);
    expect(data.memoryFragments).toEqual(['fragment-echo-1']);
    expect(data.vibrancy).toEqual({ 'everwick': 70, heartfield: 55, ambergrove: 45 });
    expect(data.variables).toEqual({ questProgress: 2 });
    expect(data.playTimeMs).toBe(3600000);
  });

  it('reads classId from PLAYER_CLASS_ID variable (not player.class)', () => {
    const player = createMockPlayer({ PLAYER_CLASS_ID: 'mage' });

    const data = serializePlayer(player);

    expect(data.classId).toBe('mage');
    expect(player.getVariable).toHaveBeenCalledWith('PLAYER_CLASS_ID');
  });

  it('returns defaults for missing variables', () => {
    const player = createMockPlayer();

    const data = serializePlayer(player);

    expect(data.classId).toBe('');
    expect(data.level).toBe(1);
    expect(data.xp).toBe(0);
    expect(data.gold).toBe(0);
    expect(data.memoryFragments).toEqual([]);
    expect(data.inventory).toEqual({});
    expect(data.equipment).toEqual({ weapon: null, armor: null, accessory: null });
    expect(data.equipBonuses).toEqual({ atk: 0, def: 0, int: 0 });
    expect(data.stats).toEqual({ hp: 0, sp: 0, atk: 0, int: 0, def: 0, agi: 0 });
    expect(data.playTimeMs).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// extractGenericVars (tested indirectly through serializePlayer)
// ---------------------------------------------------------------------------

describe('extractGenericVars', () => {
  it('excludes system variables with PLAYER_ prefix', () => {
    const player = createMockPlayer({
      PLAYER_CLASS_ID: 'knight',
      PLAYER_LEVEL: 5,
      PLAYER_HP: 120,
      PLAYER_SP: 60,
      PLAYER_ATK: 25,
      PLAYER_INT: 10,
      PLAYER_DEF: 20,
      PLAYER_AGI: 15,
      customFlag: true,
    });

    const data = serializePlayer(player);
    expect(data.variables).toEqual({ customFlag: true });
    expect(data.variables).not.toHaveProperty('PLAYER_CLASS_ID');
    expect(data.variables).not.toHaveProperty('PLAYER_LEVEL');
  });

  it('excludes system variables with VIBRANCY_ prefix', () => {
    const player = createMockPlayer({
      'VIBRANCY_everwick': 70,
      VIBRANCY_heartfield: 55,
      myQuestFlag: 'done',
    });

    const data = serializePlayer(player);
    expect(data.variables).toEqual({ myQuestFlag: 'done' });
    expect(data.variables).not.toHaveProperty('VIBRANCY_everwick');
  });

  it('excludes system variables with ACTIVE_QUEST_ prefix', () => {
    const player = createMockPlayer({
      ACTIVE_QUEST_find_elder: true,
      npcDialogue: 3,
    });

    const data = serializePlayer(player);
    expect(data.variables).toEqual({ npcDialogue: 3 });
    expect(data.variables).not.toHaveProperty('ACTIVE_QUEST_find_elder');
  });

  it('excludes exact system variable names (INVENTORY, EQUIPMENT, GOLD, etc.)', () => {
    const player = createMockPlayer({
      INVENTORY: { potion: 1 },
      EQUIPMENT: { weapon: null, armor: null, accessory: null },
      GOLD: 100,
      EQUIP_BONUSES: { atk: 0, def: 0, int: 0 },
      MEMORY_FRAGMENTS: [],
      CHOSEN_GRAPHIC: 'sprite-player-knight',
      SEED: 12345,
      PLAY_TIME_MS: 1000,
      userFlag: 'hello',
    });

    const data = serializePlayer(player);
    expect(data.variables).toEqual({ userFlag: 'hello' });
    expect(data.variables).not.toHaveProperty('INVENTORY');
    expect(data.variables).not.toHaveProperty('EQUIPMENT');
    expect(data.variables).not.toHaveProperty('GOLD');
    expect(data.variables).not.toHaveProperty('EQUIP_BONUSES');
    expect(data.variables).not.toHaveProperty('MEMORY_FRAGMENTS');
    expect(data.variables).not.toHaveProperty('CHOSEN_GRAPHIC');
    expect(data.variables).not.toHaveProperty('SEED');
    expect(data.variables).not.toHaveProperty('PLAY_TIME_MS');
  });
});

// ---------------------------------------------------------------------------
// deserializePlayer
// ---------------------------------------------------------------------------

describe('deserializePlayer', () => {
  it('restores all variables via setVariable', async () => {
    const player = createMockPlayer();
    const data = makeSaveData();

    await deserializePlayer(player, data);

    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_CLASS_ID', 'knight');
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_LEVEL', 5);
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_XP', 1200);
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_HP', 120);
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_SP', 60);
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_ATK', 25);
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_INT', 10);
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_DEF', 20);
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_AGI', 15);
    expect(player.setVariable).toHaveBeenCalledWith('INVENTORY', data.inventory);
    expect(player.setVariable).toHaveBeenCalledWith('EQUIPMENT', data.equipment);
    expect(player.setVariable).toHaveBeenCalledWith('EQUIP_BONUSES', data.equipBonuses);
    expect(player.setVariable).toHaveBeenCalledWith('GOLD', 500);
    expect(player.setVariable).toHaveBeenCalledWith('MEMORY_FRAGMENTS', data.memoryFragments);
    expect(player.setVariable).toHaveBeenCalledWith('PLAY_TIME_MS', 3600000);
    // Vibrancy zones
    expect(player.setVariable).toHaveBeenCalledWith('VIBRANCY_everwick', 70);
    expect(player.setVariable).toHaveBeenCalledWith('VIBRANCY_heartfield', 55);
    expect(player.setVariable).toHaveBeenCalledWith('VIBRANCY_ambergrove', 45);
    // Generic variables
    expect(player.setVariable).toHaveBeenCalledWith('questProgress', 2);
    expect(player.setVariable).toHaveBeenCalledWith('talkedToElder', true);
  });

  it('calls player.setClass with classId', async () => {
    const player = createMockPlayer();
    const data = makeSaveData({ classId: 'mage' });

    await deserializePlayer(player, data);

    expect(player.setClass).toHaveBeenCalledWith('mage');
  });

  it('calls player.changeMap with saved map and position', async () => {
    const player = createMockPlayer();
    const data = makeSaveData({ mapId: 'heartfield', positionX: 300, positionY: 400 });

    await deserializePlayer(player, data);

    expect(player.changeMap).toHaveBeenCalledWith('heartfield', { x: 300, y: 400 });
  });

  it('calls checkSkillUnlocks after restore', async () => {
    const player = createMockPlayer();
    const data = makeSaveData();

    await deserializePlayer(player, data);

    expect(checkSkillUnlocks).toHaveBeenCalledWith(player);
  });

  it('handles invalid/corrupted data gracefully (returns early)', async () => {
    const player = createMockPlayer();

    // null data
    await deserializePlayer(player, null as unknown as SaveData);
    expect(player.setVariable).not.toHaveBeenCalled();

    // non-object data
    await deserializePlayer(player, 'garbage' as unknown as SaveData);
    expect(player.setVariable).not.toHaveBeenCalled();

    // object missing version
    await deserializePlayer(player, { mapId: 'test' } as unknown as SaveData);
    expect(player.setVariable).not.toHaveBeenCalled();

    // version is not a number
    await deserializePlayer(player, { version: 'bad' } as unknown as SaveData);
    expect(player.setVariable).not.toHaveBeenCalled();
  });

  it('skips setClass when classId is empty', async () => {
    const player = createMockPlayer();
    const data = makeSaveData({ classId: '' });

    await deserializePlayer(player, data);

    expect(player.setClass).not.toHaveBeenCalled();
  });

  it('restores CHOSEN_GRAPHIC based on classId sprite map', async () => {
    const player = createMockPlayer();

    await deserializePlayer(player, makeSaveData({ classId: 'knight' }));
    expect(player.setVariable).toHaveBeenCalledWith('CHOSEN_GRAPHIC', 'sprite-player-knight');

    vi.clearAllMocks();
    const player2 = createMockPlayer();
    await deserializePlayer(player2, makeSaveData({ classId: 'mage' }));
    expect(player2.setVariable).toHaveBeenCalledWith('CHOSEN_GRAPHIC', 'sprite-player-mage');

    vi.clearAllMocks();
    const player3 = createMockPlayer();
    await deserializePlayer(player3, makeSaveData({ classId: 'rogue' }));
    expect(player3.setVariable).toHaveBeenCalledWith('CHOSEN_GRAPHIC', 'sprite-player-rogue');

    vi.clearAllMocks();
    const player4 = createMockPlayer();
    await deserializePlayer(player4, makeSaveData({ classId: 'cleric' }));
    expect(player4.setVariable).toHaveBeenCalledWith('CHOSEN_GRAPHIC', 'sprite-player-cleric');
  });

  it('defaults CHOSEN_GRAPHIC to knight for unknown classId', async () => {
    const player = createMockPlayer();
    await deserializePlayer(player, makeSaveData({ classId: 'barbarian' }));
    expect(player.setVariable).toHaveBeenCalledWith('CHOSEN_GRAPHIC', 'sprite-player-knight');
  });

  it('restores hp/sp capped to maxHp/maxSp', async () => {
    const player = createMockPlayer();
    // player.param.maxHp = 100, data.hp = 80 -> min(80, 100) = 80
    const data = makeSaveData({ hp: 80, sp: 30 });

    await deserializePlayer(player, data);

    expect(player.hp).toBe(80);
    expect(player.sp).toBe(30);
  });

  it('does not call changeMap when mapId is empty', async () => {
    const player = createMockPlayer();
    const data = makeSaveData({ mapId: '' });

    await deserializePlayer(player, data);

    expect(player.changeMap).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Round-trip: serialize -> deserialize
// ---------------------------------------------------------------------------

describe('round-trip', () => {
  it('serialize then deserialize preserves all data', async () => {
    // Set up a player with full state
    const originalPlayer = createMockPlayer({
      PLAYER_CLASS_ID: 'rogue',
      PLAYER_LEVEL: 7,
      PLAYER_XP: 2500,
      PLAYER_HP: 90,
      PLAYER_SP: 45,
      PLAYER_ATK: 30,
      PLAYER_INT: 15,
      PLAYER_DEF: 18,
      PLAYER_AGI: 35,
      INVENTORY: { potion: 5, antidote: 2 },
      EQUIPMENT: { weapon: 'steel-dagger', armor: 'shadow-cloak', accessory: 'speed-ring' },
      EQUIP_BONUSES: { atk: 8, def: 2, int: 1 },
      GOLD: 1250,
      MEMORY_FRAGMENTS: ['fragment-echo-1', 'fragment-dawn-3', 'fragment-twilight-7'],
      PLAY_TIME_MS: 7200000,
      'VIBRANCY_everwick': 80,
      VIBRANCY_heartfield: 60,
      VIBRANCY_ambergrove: 50,
      questTalkedToElder: true,
      dungeonKeyFound: 'golden',
    });

    // Serialize
    const data = serializePlayer(originalPlayer);

    // Deserialize into a fresh player
    const restoredPlayer = createMockPlayer();
    await deserializePlayer(restoredPlayer, data);

    // Verify class
    expect(restoredPlayer.setClass).toHaveBeenCalledWith('rogue');
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('PLAYER_CLASS_ID', 'rogue');

    // Verify progression
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('PLAYER_LEVEL', 7);
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('PLAYER_XP', 2500);

    // Verify stats
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('PLAYER_HP', 90);
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('PLAYER_SP', 45);
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('PLAYER_ATK', 30);
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('PLAYER_INT', 15);
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('PLAYER_DEF', 18);
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('PLAYER_AGI', 35);

    // Verify inventory & equipment
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('INVENTORY', { potion: 5, antidote: 2 });
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('EQUIPMENT', {
      weapon: 'steel-dagger',
      armor: 'shadow-cloak',
      accessory: 'speed-ring',
    });
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('EQUIP_BONUSES', { atk: 8, def: 2, int: 1 });
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('GOLD', 1250);

    // Verify memory fragments
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('MEMORY_FRAGMENTS', [
      'fragment-echo-1',
      'fragment-dawn-3',
      'fragment-twilight-7',
    ]);

    // Verify vibrancy
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('VIBRANCY_everwick', 80);
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('VIBRANCY_heartfield', 60);
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('VIBRANCY_ambergrove', 50);

    // Verify generic variables
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('questTalkedToElder', true);
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('dungeonKeyFound', 'golden');

    // Verify play time
    expect(restoredPlayer.setVariable).toHaveBeenCalledWith('PLAY_TIME_MS', 7200000);

    // Verify map change
    expect(restoredPlayer.changeMap).toHaveBeenCalledWith('everwick', { x: 100, y: 200 });
  });
});

// ---------------------------------------------------------------------------
// saveGame
// ---------------------------------------------------------------------------

describe('saveGame', () => {
  it('writes to localStorage with correct key', () => {
    const player = createMockPlayer({
      PLAYER_CLASS_ID: 'knight',
      PLAYER_LEVEL: 3,
    });

    saveGame(player, 'slot-1');

    expect(localStorageMock.setItem).toHaveBeenCalled();

    // Check the save data was stored with the correct key
    const saveKey = 'mnemonic-realms-save-slot-1';
    const rawSave = mockStorage.get(saveKey);
    expect(rawSave).toBeDefined();

    const parsed = JSON.parse(rawSave!);
    expect(parsed.version).toBe(1);
    expect(parsed.classId).toBe('knight');
    expect(parsed.level).toBe(3);
  });

  it('updates meta index in localStorage', () => {
    const player = createMockPlayer({
      PLAYER_CLASS_ID: 'mage',
      PLAYER_LEVEL: 5,
    });

    saveGame(player, 'slot-2');

    const rawMeta = mockStorage.get('mnemonic-realms-save-meta');
    expect(rawMeta).toBeDefined();

    const meta = JSON.parse(rawMeta!);
    expect(meta['slot-2']).toBeDefined();
    expect(meta['slot-2'].slotId).toBe('slot-2');
    expect(meta['slot-2'].classId).toBe('mage');
    expect(meta['slot-2'].level).toBe(5);
  });

  it('preserves existing meta entries when saving to a different slot', () => {
    const player1 = createMockPlayer({ PLAYER_CLASS_ID: 'knight', PLAYER_LEVEL: 1 });
    saveGame(player1, 'slot-1');

    const player2 = createMockPlayer({ PLAYER_CLASS_ID: 'mage', PLAYER_LEVEL: 2 });
    saveGame(player2, 'slot-2');

    const meta = JSON.parse(mockStorage.get('mnemonic-realms-save-meta')!);
    expect(meta['slot-1']).toBeDefined();
    expect(meta['slot-2']).toBeDefined();
    expect(meta['slot-1'].classId).toBe('knight');
    expect(meta['slot-2'].classId).toBe('mage');
  });
});

// ---------------------------------------------------------------------------
// loadGame
// ---------------------------------------------------------------------------

describe('loadGame', () => {
  it('reads from localStorage and calls deserializePlayer', async () => {
    const data = makeSaveData({ classId: 'knight', level: 10 });
    mockStorage.set('mnemonic-realms-save-slot-1', JSON.stringify(data));

    const player = createMockPlayer();
    const result = await loadGame(player, 'slot-1');

    expect(result).toBe(true);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('mnemonic-realms-save-slot-1');
    // Verify deserializePlayer was called (by checking side-effects)
    expect(player.setClass).toHaveBeenCalledWith('knight');
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_LEVEL', 10);
  });

  it('returns false when slot is empty', async () => {
    const player = createMockPlayer();
    const result = await loadGame(player, 'slot-1');

    expect(result).toBe(false);
    expect(player.setVariable).not.toHaveBeenCalled();
  });

  it('returns false for corrupted JSON', async () => {
    mockStorage.set('mnemonic-realms-save-slot-1', 'not-valid-json{{{');

    const player = createMockPlayer();
    const result = await loadGame(player, 'slot-1');

    expect(result).toBe(false);
    expect(player.setVariable).not.toHaveBeenCalled();
  });

  it('returns false for JSON without version field', async () => {
    mockStorage.set('mnemonic-realms-save-slot-1', JSON.stringify({ mapId: 'test' }));

    const player = createMockPlayer();
    const result = await loadGame(player, 'slot-1');

    expect(result).toBe(false);
    expect(player.setVariable).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// autoSave
// ---------------------------------------------------------------------------

describe('autoSave', () => {
  it('skips if no class set (PLAYER_CLASS_ID not set)', () => {
    const player = createMockPlayer();

    autoSave(player);

    expect(player.getVariable).toHaveBeenCalledWith('PLAYER_CLASS_ID');
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('saves to auto slot when class is set', () => {
    const player = createMockPlayer({
      PLAYER_CLASS_ID: 'cleric',
      PLAYER_LEVEL: 4,
    });

    autoSave(player);

    expect(player.getVariable).toHaveBeenCalledWith('PLAYER_CLASS_ID');
    expect(localStorageMock.setItem).toHaveBeenCalled();

    const rawSave = mockStorage.get('mnemonic-realms-save-auto');
    expect(rawSave).toBeDefined();

    const parsed = JSON.parse(rawSave!);
    expect(parsed.classId).toBe('cleric');
  });

  it('does not save when PLAYER_CLASS_ID is falsy (empty string)', () => {
    const player = createMockPlayer({ PLAYER_CLASS_ID: '' });

    autoSave(player);

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
});
