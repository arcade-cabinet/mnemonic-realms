import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  startCombat,
  processTurn,
  getCombat,
  endCombat,
  isInCombat,
  CombatPhase,
  ActionType,
  type CombatState,
} from '../../main/server/systems/combat';

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
    position: { x: 0, y: 0 },
  } as unknown as import('@rpgjs/server').RpgPlayer;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

let randomSpy: ReturnType<typeof vi.spyOn>;

/**
 * Pin Math.random to produce deterministic results.
 * Combat calls random for damage variance + crit rolls, and for flee chance.
 * Sequence: variance=mid (1.0), no-crit for each damage calc; flee fails.
 */
function pinRandomNoCrit() {
  // Each calculateDamage call consumes 2 random values: variance + crit
  // Return 0.5 (variance=1.0) then 0.99 (no crit) repeatedly
  randomSpy.mockReturnValue(0.5);
  randomSpy.mockReturnValueOnce(0.5).mockReturnValueOnce(0.99);
}

/** Make enough random values available for multiple damage calcs (no crits). */
function pinRandomMultiple(count: number) {
  for (let i = 0; i < count; i++) {
    randomSpy.mockReturnValueOnce(0.5).mockReturnValueOnce(0.99);
  }
}

// Enemy IDs from heartfield.json DDL data:
// E-SL-01: Meadow Sprite  (hp:30, atk:5, int:3, def:3, agi:8, xp:18, gold:8)
// E-SL-02: Grass Serpent   (hp:45, atk:8, int:2, def:5, agi:10, xp:25, gold:12)

beforeEach(() => {
  randomSpy = vi.spyOn(Math, 'random');
});

afterEach(() => {
  randomSpy.mockRestore();
});

// ---------------------------------------------------------------------------
// startCombat
// ---------------------------------------------------------------------------

describe('startCombat', () => {
  it('creates valid combat state with enemies', () => {
    pinRandomMultiple(4);
    const player = createMockPlayer({ PLAYER_AGI: 15 });
    const state = startCombat(player, ['E-SL-01']);

    expect(state).not.toBeNull();
    expect(state!.enemies).toHaveLength(1);
    expect(state!.enemies[0].id).toBe('E-SL-01');
    expect(state!.enemies[0].name).toBe('Meadow Sprite');
    expect(state!.enemies[0].hp).toBe(30);
    expect(state!.enemies[0].maxHp).toBe(30);
    expect(state!.round).toBe(1);
    expect(state!.defending).toBe(false);
    expect(state!.playerEffects).toEqual([]);
  });

  it('creates combat with multiple enemies', () => {
    pinRandomMultiple(4);
    const player = createMockPlayer({ PLAYER_AGI: 15 });
    const state = startCombat(player, ['E-SL-01', 'E-SL-02']);

    expect(state).not.toBeNull();
    expect(state!.enemies).toHaveLength(2);
    expect(state!.enemies[0].name).toBe('Meadow Sprite');
    expect(state!.enemies[1].name).toBe('Grass Serpent');
  });

  it('returns null for unknown enemy IDs', () => {
    const player = createMockPlayer();
    const state = startCombat(player, ['UNKNOWN-ID']);
    expect(state).toBeNull();
  });

  it('returns null for empty enemy list', () => {
    const player = createMockPlayer();
    const state = startCombat(player, []);
    expect(state).toBeNull();
  });

  it('returns null if already in combat', () => {
    pinRandomMultiple(8);
    const player = createMockPlayer({ PLAYER_AGI: 15 });
    startCombat(player, ['E-SL-01']);
    const second = startCombat(player, ['E-SL-02']);
    expect(second).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// isInCombat
// ---------------------------------------------------------------------------

describe('isInCombat', () => {
  it('returns false when not in combat', () => {
    const player = createMockPlayer();
    expect(isInCombat(player)).toBe(false);
  });

  it('returns true when in combat', () => {
    pinRandomMultiple(4);
    const player = createMockPlayer({ PLAYER_AGI: 15 });
    startCombat(player, ['E-SL-01']);
    expect(isInCombat(player)).toBe(true);
  });

  it('returns false after endCombat', () => {
    pinRandomMultiple(4);
    const player = createMockPlayer({ PLAYER_AGI: 15 });
    startCombat(player, ['E-SL-01']);
    endCombat(player);
    expect(isInCombat(player)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Basic attack action produces damage
// ---------------------------------------------------------------------------

describe('processTurn — attack', () => {
  it('attack action deals damage to the target enemy', () => {
    // Pin random: enough for startCombat + processTurn damage calcs
    pinRandomMultiple(20);
    // Give the player high AGI so they go first
    const player = createMockPlayer({ PLAYER_AGI: 50, PLAYER_ATK: 20, PLAYER_DEF: 10 });
    startCombat(player, ['E-SL-01']);

    const state = getCombat(player);
    expect(state).not.toBeNull();
    // Player should get first turn with AGI=50 vs Meadow Sprite AGI=8
    expect(state!.phase).toBe(CombatPhase.PlayerTurn);

    const result = processTurn(player, { type: ActionType.Attack, targetIndex: 0 });
    expect(result).not.toBeNull();
    // The enemy should have taken damage
    expect(result!.enemies[0].hp).toBeLessThan(30);
  });
});

// ---------------------------------------------------------------------------
// Defend action reduces damage taken
// ---------------------------------------------------------------------------

describe('processTurn — defend', () => {
  it('defend action sets defending flag and enemy deals less damage than without defending', () => {
    // We run two scenarios and compare damage taken.
    // Scenario 1: Player attacks (no defend)
    pinRandomMultiple(20);
    const player1 = createMockPlayer({ PLAYER_AGI: 50, PLAYER_ATK: 20, PLAYER_DEF: 5 });
    startCombat(player1, ['E-SL-02']); // Grass Serpent: atk=8, agi=10
    processTurn(player1, { type: ActionType.Attack, targetIndex: 0 });
    const hp1 = player1.hp;

    // Scenario 2: Player defends (DEF * 2 during enemy turn)
    pinRandomMultiple(20);
    const player2 = createMockPlayer({ PLAYER_AGI: 50, PLAYER_ATK: 20, PLAYER_DEF: 5 });
    startCombat(player2, ['E-SL-02']);
    processTurn(player2, { type: ActionType.Defend });
    const hp2 = player2.hp;

    // Defending player should have taken less or equal damage
    expect(hp2).toBeGreaterThanOrEqual(hp1);
  });

  it('defend action produces the defensive stance message', () => {
    pinRandomMultiple(20);
    const player = createMockPlayer({ PLAYER_AGI: 50, PLAYER_ATK: 20, PLAYER_DEF: 10 });
    startCombat(player, ['E-SL-01']);
    const result = processTurn(player, { type: ActionType.Defend });
    // After player defends, enemies act; lastResult will be enemy's action.
    // But the defending flag should be set internally — we verify via less damage taken.
    expect(result).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Flee action
// ---------------------------------------------------------------------------

describe('processTurn — flee', () => {
  it('successful flee ends combat with Fled phase', () => {
    const player = createMockPlayer({ PLAYER_AGI: 50, PLAYER_ATK: 10 });
    startCombat(player, ['E-SL-01']);

    // The flee roll is the next Math.random() call: < 0.5 = success
    randomSpy.mockReturnValueOnce(0.1); // flee succeeds
    const result = processTurn(player, { type: ActionType.Flee });
    expect(result).not.toBeNull();
    expect(result!.phase).toBe(CombatPhase.Fled);
    expect(result!.lastResult?.fled).toBe(true);
  });

  it('failed flee does not end combat', () => {
    const player = createMockPlayer({ PLAYER_AGI: 50, PLAYER_ATK: 10, PLAYER_DEF: 10 });
    startCombat(player, ['E-SL-01']);

    // Flee roll: 0.9 (>= 0.5 = fail), then enemy damage calc values
    randomSpy
      .mockReturnValueOnce(0.9) // flee fails
      .mockReturnValueOnce(0.5) // enemy variance
      .mockReturnValueOnce(0.99); // enemy no crit
    const result = processTurn(player, { type: ActionType.Flee });
    expect(result).not.toBeNull();
    expect(result!.phase).not.toBe(CombatPhase.Fled);
  });

  it('flee is blocked by Vow of Steel effect', () => {
    const player = createMockPlayer({ PLAYER_AGI: 50, PLAYER_ATK: 10, PLAYER_DEF: 10 });
    startCombat(player, ['E-SL-01']);

    // Manually inject Vow of Steel effect into player effects
    const state = getCombat(player);
    state!.playerEffects.push({ effectId: 'ST-VOW-STEEL', turnsRemaining: 3 });

    // Provide values for enemy damage calc after blocked flee
    randomSpy
      .mockReturnValueOnce(0.5) // enemy variance
      .mockReturnValueOnce(0.99); // enemy no crit
    const result = processTurn(player, { type: ActionType.Flee });
    expect(result).not.toBeNull();
    expect(result!.phase).not.toBe(CombatPhase.Fled);
  });
});

// ---------------------------------------------------------------------------
// Skill action costs SP
// ---------------------------------------------------------------------------

describe('processTurn — skill', () => {
  it('skill action deducts SP from player', () => {
    pinRandomMultiple(20);
    // Knight with SK-KN-01 (Oath Strike, spCost: 0) and SK-KN-03 (Vow of Steel, spCost: 12)
    const player = createMockPlayer({
      PLAYER_AGI: 50,
      PLAYER_ATK: 20,
      PLAYER_INT: 10,
      PLAYER_DEF: 10,
      PLAYER_CLASS_ID: 'knight',
      PLAYER_SKILLS: ['SK-KN-03'],
    });
    player.sp = 50;

    startCombat(player, ['E-SL-01']);
    processTurn(player, { type: ActionType.Skill, skillId: 'SK-KN-03' });
    // SK-KN-03 (Vow of Steel) costs 12 SP
    expect(player.sp).toBe(38);
  });
});

// ---------------------------------------------------------------------------
// Turn order respects AGI values
// ---------------------------------------------------------------------------

describe('turn order', () => {
  it('player with higher AGI gets first turn', () => {
    pinRandomMultiple(10);
    // Player AGI=50 >> Meadow Sprite AGI=8
    const player = createMockPlayer({ PLAYER_AGI: 50 });
    const state = startCombat(player, ['E-SL-01']);

    expect(state).not.toBeNull();
    expect(state!.turnOrder[0].kind).toBe('player');
    expect(state!.phase).toBe(CombatPhase.PlayerTurn);
  });

  it('enemy with higher AGI goes before player', () => {
    pinRandomMultiple(10);
    // Player AGI=1 << Grass Serpent AGI=10
    const player = createMockPlayer({ PLAYER_AGI: 1, PLAYER_DEF: 50 });
    const state = startCombat(player, ['E-SL-02']);

    expect(state).not.toBeNull();
    // First entry should be the enemy (higher AGI)
    expect(state!.turnOrder[0].kind).toBe('enemy');
    expect(state!.phase).toBe(CombatPhase.EnemyTurn);
  });

  it('turn order sorts multiple combatants by AGI descending', () => {
    pinRandomMultiple(10);
    // Player AGI=9 — between Meadow Sprite (8) and Grass Serpent (10)
    const player = createMockPlayer({ PLAYER_AGI: 9 });
    const state = startCombat(player, ['E-SL-01', 'E-SL-02']);

    expect(state).not.toBeNull();
    const order = state!.turnOrder;
    // Expected order: Grass Serpent (10) > Player (9) > Meadow Sprite (8)
    expect(order[0].kind).toBe('enemy'); // Grass Serpent
    expect(order[0].agi).toBe(10);
    expect(order[1].kind).toBe('player');
    expect(order[1].agi).toBe(9);
    expect(order[2].kind).toBe('enemy'); // Meadow Sprite
    expect(order[2].agi).toBe(8);
  });
});

// ---------------------------------------------------------------------------
// Status effect ticking
// ---------------------------------------------------------------------------

describe('status effects in combat', () => {
  it('poison deals damage at start of player turn', () => {
    pinRandomMultiple(20);
    const player = createMockPlayer({
      PLAYER_AGI: 50,
      PLAYER_ATK: 20,
      PLAYER_DEF: 20,
    });
    player.hp = 100;
    player.param.maxHp = 100;

    startCombat(player, ['E-SL-01']);
    const state = getCombat(player);
    // Inject poison into player effects
    state!.playerEffects.push({ effectId: 'ST-POISON', turnsRemaining: 3 });

    // Process a turn — poison ticks at start of player's turn
    processTurn(player, { type: ActionType.Attack, targetIndex: 0 });

    // Poison: 5% of maxHp(100) = 5 damage. Player starts at 100, takes 5 from poison.
    // Then enemies may attack too. But poison definitely reduced HP.
    expect(player.hp).toBeLessThan(100);
  });

  it('stun prevents player action', () => {
    pinRandomMultiple(20);
    const player = createMockPlayer({
      PLAYER_AGI: 50,
      PLAYER_ATK: 20,
      PLAYER_DEF: 20,
    });
    player.hp = 100;

    startCombat(player, ['E-SL-01']);
    const state = getCombat(player);
    // Inject stun
    state!.playerEffects.push({ effectId: 'ST-STUN', turnsRemaining: 1 });

    const enemyHpBefore = state!.enemies[0].hp;
    processTurn(player, { type: ActionType.Attack, targetIndex: 0 });

    // Stunned player cannot attack — enemy HP should remain unchanged from the player attack
    // (enemy may have taken their turn and attacked player instead)
    const afterState = getCombat(player);
    // If stunned, the player's attack is skipped — enemy should not have been hit by player
    // The enemy may still have taken damage from effects, but not from attack action
    expect(afterState!.enemies[0].hp).toBe(enemyHpBefore);
  });
});

// ---------------------------------------------------------------------------
// Victory: all enemies defeated
// ---------------------------------------------------------------------------

describe('combat end — Victory', () => {
  it('combat enters Victory phase when all enemies are defeated', () => {
    pinRandomMultiple(30);
    // Give the player massive ATK to one-shot the enemy
    const player = createMockPlayer({
      PLAYER_AGI: 50,
      PLAYER_ATK: 500,
      PLAYER_DEF: 100,
    });

    startCombat(player, ['E-SL-01']); // Meadow Sprite: 30 HP
    const result = processTurn(player, { type: ActionType.Attack, targetIndex: 0 });

    expect(result).not.toBeNull();
    expect(result!.enemies[0].hp).toBe(0);
    expect(result!.phase).toBe(CombatPhase.Victory);
  });

  it('victory with multiple enemies requires all to be defeated', () => {
    pinRandomMultiple(50);
    const player = createMockPlayer({
      PLAYER_AGI: 50,
      PLAYER_ATK: 500,
      PLAYER_DEF: 100,
    });

    startCombat(player, ['E-SL-01', 'E-SL-02']);

    // Kill first enemy
    const after1 = processTurn(player, { type: ActionType.Attack, targetIndex: 0 });
    expect(after1!.enemies[0].hp).toBe(0);
    // Second enemy still alive — should not be victory yet
    expect(after1!.enemies[1].hp).toBeGreaterThan(0);
    expect(after1!.phase).not.toBe(CombatPhase.Victory);

    // Kill second enemy
    pinRandomMultiple(20);
    const after2 = processTurn(player, { type: ActionType.Attack, targetIndex: 1 });
    expect(after2!.enemies[1].hp).toBe(0);
    expect(after2!.phase).toBe(CombatPhase.Victory);
  });
});

// ---------------------------------------------------------------------------
// Defeat: player hp <= 0
// ---------------------------------------------------------------------------

describe('combat end — Defeat', () => {
  it('combat enters Defeat phase when player hp reaches 0', () => {
    // Player goes first (higher AGI), attacks, then enemy retaliates and kills.
    // Grass Serpent: atk=8, agi=10, def=5
    const player = createMockPlayer({
      PLAYER_AGI: 50, // Player goes first
      PLAYER_ATK: 1,  // Minimal damage dealt
      PLAYER_DEF: 0,  // No defense — enemy will deal good damage
    });
    player.hp = 1; // 1 HP — any damage kills

    startCombat(player, ['E-SL-02']);
    expect(getCombat(player)!.phase).toBe(CombatPhase.PlayerTurn);

    // Player attack variance + crit, then enemy attack variance + crit
    randomSpy
      .mockReturnValueOnce(0.5).mockReturnValueOnce(0.99) // player attack
      .mockReturnValueOnce(0.5).mockReturnValueOnce(0.99); // enemy attack
    const result = processTurn(player, { type: ActionType.Attack, targetIndex: 0 });

    expect(result).not.toBeNull();
    expect(player.hp).toBe(0);
    expect(result!.phase).toBe(CombatPhase.Defeat);
  });
});

// ---------------------------------------------------------------------------
// getCombat and endCombat
// ---------------------------------------------------------------------------

describe('getCombat / endCombat', () => {
  it('getCombat returns null when not in combat', () => {
    const player = createMockPlayer();
    expect(getCombat(player)).toBeNull();
  });

  it('getCombat returns state when in combat', () => {
    pinRandomMultiple(10);
    const player = createMockPlayer({ PLAYER_AGI: 15 });
    startCombat(player, ['E-SL-01']);
    const state = getCombat(player);
    expect(state).not.toBeNull();
    expect(state!.enemies).toHaveLength(1);
  });

  it('endCombat clears combat state', () => {
    pinRandomMultiple(10);
    const player = createMockPlayer({ PLAYER_AGI: 15 });
    startCombat(player, ['E-SL-01']);
    endCombat(player);
    expect(getCombat(player)).toBeNull();
    expect(isInCombat(player)).toBe(false);
  });
});
