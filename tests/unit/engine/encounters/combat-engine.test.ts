import { describe, it, expect, vi } from 'vitest';
import {
  initCombat,
  determineTurnOrder,
  calculateDamage,
  executeAction,
  checkCombatEnd,
  getEnemyAiAction,
  calculateRewards,
} from '../../../../engine/encounters/combat-engine';
import type {
  Combatant,
  CombatAction,
  CombatState,
  Skill,
} from '../../../../engine/encounters/types';

// ── Test Fixtures ────────────────────────────────────────────────────────────

function makePlayer(overrides: Partial<Combatant> = {}): Combatant {
  return {
    id: 'player-1',
    name: 'Callum',
    type: 'player',
    hp: 100,
    maxHp: 100,
    atk: 15,
    int: 8,
    def: 10,
    agi: 12,
    skills: [],
    statusEffects: [],
    ...overrides,
  };
}

function makeEnemy(overrides: Partial<Combatant> = {}): Combatant {
  return {
    id: 'enemy-1',
    name: 'Meadow Sprite',
    type: 'enemy',
    hp: 30,
    maxHp: 30,
    atk: 5,
    int: 3,
    def: 3,
    agi: 8,
    skills: [],
    statusEffects: [],
    ...overrides,
  };
}

const fireSkill: Skill = {
  id: 'sk-fire',
  name: 'Fire Bolt',
  cost: 5,
  multiplier: 1.8,
  element: 'fire',
};

// ── initCombat ───────────────────────────────────────────────────────────────

describe('initCombat', () => {
  it('sets correct phase and combatants', () => {
    const player = makePlayer();
    const enemy = makeEnemy();
    const state = initCombat([player], [enemy]);

    expect(state.combatants).toHaveLength(2);
    expect(state.round).toBe(1);
    expect(state.currentTurnIndex).toBe(0);
    expect(state.turnResults).toHaveLength(0);
    expect(['player-turn', 'enemy-turn']).toContain(state.phase);
  });

  it('first turn goes to highest AGI combatant', () => {
    const fastPlayer = makePlayer({ agi: 20 });
    const slowEnemy = makeEnemy({ agi: 5 });
    const state = initCombat([fastPlayer], [slowEnemy]);

    expect(state.phase).toBe('player-turn');
    expect(state.turnOrder[0]).toBe('player-1');
  });
});

// ── determineTurnOrder ───────────────────────────────────────────────────────

describe('determineTurnOrder', () => {
  it('sorts by AGI descending', () => {
    const fast = makePlayer({ id: 'fast', agi: 20 });
    const medium = makeEnemy({ id: 'medium', agi: 12 });
    const slow = makeEnemy({ id: 'slow', agi: 5 });

    const order = determineTurnOrder([slow, fast, medium]);
    expect(order).toEqual(['fast', 'medium', 'slow']);
  });

  it('excludes dead combatants', () => {
    const alive = makePlayer({ id: 'alive', agi: 10 });
    const dead = makeEnemy({ id: 'dead', agi: 20, hp: 0 });

    const order = determineTurnOrder([alive, dead]);
    expect(order).toEqual(['alive']);
  });
});

// ── calculateDamage ──────────────────────────────────────────────────────────

describe('calculateDamage', () => {
  it('basic attack uses ATK', () => {
    const attacker = makePlayer({ atk: 15 });
    const defender = makeEnemy({ def: 3 });
    // 15 * 1.0 - 3 * 0.5 = 13.5 -> 13
    expect(calculateDamage(attacker, defender)).toBe(13);
  });

  it('skill with multiplier increases damage', () => {
    const attacker = makePlayer({ int: 20 });
    const defender = makeEnemy({ def: 3 });
    const skill: Skill = { id: 'sk', name: 'Bolt', cost: 5, multiplier: 1.5, element: 'fire' };
    // INT-based: 20 * 1.5 - 3 * 0.5 = 28.5 -> 28
    expect(calculateDamage(attacker, defender, skill)).toBe(28);
  });

  it('minimum damage is 1', () => {
    const weakAttacker = makePlayer({ atk: 1 });
    const toughDefender = makeEnemy({ def: 100 });
    expect(calculateDamage(weakAttacker, toughDefender)).toBe(1);
  });
});

// ── executeAction ────────────────────────────────────────────────────────────

describe('executeAction', () => {
  it('attack reduces target HP', () => {
    const player = makePlayer({ atk: 15, agi: 20 });
    const enemy = makeEnemy({ def: 3, agi: 5 });
    const state = initCombat([player], [enemy]);

    const action: CombatAction = {
      type: 'attack',
      actorId: 'player-1',
      targetId: 'enemy-1',
    };

    const newState = executeAction(state, action);
    const updatedEnemy = newState.combatants.find((c) => c.id === 'enemy-1')!;
    expect(updatedEnemy.hp).toBeLessThan(30);
    expect(newState.turnResults.length).toBeGreaterThan(0);
  });

  it('defend halves incoming damage', () => {
    const player = makePlayer({ atk: 15, agi: 20, def: 10 });
    const enemy = makeEnemy({ atk: 10, def: 3, agi: 5 });
    const state = initCombat([player], [enemy]);

    // Player defends
    const defendAction: CombatAction = { type: 'defend', actorId: 'player-1' };
    const afterDefend = executeAction(state, defendAction);

    // Check that player's DEF was doubled
    const defendingPlayer = afterDefend.combatants.find((c) => c.id === 'player-1')!;
    expect(defendingPlayer.def).toBe(20); // doubled from 10
    expect(defendingPlayer.statusEffects.some((e) => e.id === 'defend')).toBe(true);
  });

  it('flee sets phase to fled', () => {
    const player = makePlayer({ agi: 20 });
    const enemy = makeEnemy({ agi: 5 });
    const state = initCombat([player], [enemy]);

    const fleeAction: CombatAction = { type: 'flee', actorId: 'player-1' };
    const newState = executeAction(state, fleeAction);

    expect(newState.phase).toBe('fled');
  });

  it('skill attack uses skill multiplier', () => {
    const player = makePlayer({ int: 20, agi: 20, skills: [fireSkill] });
    const enemy = makeEnemy({ def: 3, agi: 5, hp: 100, maxHp: 100 });
    const state = initCombat([player], [enemy]);

    const skillAction: CombatAction = {
      type: 'skill',
      actorId: 'player-1',
      targetId: 'enemy-1',
      skillId: 'sk-fire',
    };

    const newState = executeAction(state, skillAction);
    const updatedEnemy = newState.combatants.find((c) => c.id === 'enemy-1')!;
    // INT 20 * 1.8 - DEF 3 * 0.5 = 34.5 -> 34 damage
    expect(updatedEnemy.hp).toBe(66);
  });
});

// ── checkCombatEnd ───────────────────────────────────────────────────────────

describe('checkCombatEnd', () => {
  it('returns victory when all enemies dead', () => {
    const state: CombatState = {
      phase: 'player-turn',
      combatants: [
        makePlayer({ hp: 50 }),
        makeEnemy({ hp: 0 }),
      ],
      turnOrder: ['player-1'],
      currentTurnIndex: 0,
      turnResults: [],
      round: 1,
    };
    expect(checkCombatEnd(state)).toBe('victory');
  });

  it('returns defeat when all players dead', () => {
    const state: CombatState = {
      phase: 'enemy-turn',
      combatants: [
        makePlayer({ hp: 0 }),
        makeEnemy({ hp: 20 }),
      ],
      turnOrder: ['enemy-1'],
      currentTurnIndex: 0,
      turnResults: [],
      round: 1,
    };
    expect(checkCombatEnd(state)).toBe('defeat');
  });

  it('returns ongoing when both sides alive', () => {
    const state: CombatState = {
      phase: 'player-turn',
      combatants: [
        makePlayer({ hp: 50 }),
        makeEnemy({ hp: 20 }),
      ],
      turnOrder: ['player-1', 'enemy-1'],
      currentTurnIndex: 0,
      turnResults: [],
      round: 1,
    };
    expect(checkCombatEnd(state)).toBe('ongoing');
  });
});

// ── getEnemyAiAction ─────────────────────────────────────────────────────────

describe('getEnemyAiAction', () => {
  it('returns valid attack action targeting a living player', () => {
    const state: CombatState = {
      phase: 'enemy-turn',
      combatants: [
        makePlayer({ hp: 50 }),
        makeEnemy(),
      ],
      turnOrder: ['enemy-1', 'player-1'],
      currentTurnIndex: 0,
      turnResults: [],
      round: 1,
    };

    const action = getEnemyAiAction(state, 'enemy-1');
    expect(action.actorId).toBe('enemy-1');
    expect(['attack', 'skill']).toContain(action.type);
    expect(action.targetId).toBe('player-1');
  });

  it('returns defend when no living players', () => {
    const state: CombatState = {
      phase: 'enemy-turn',
      combatants: [
        makePlayer({ hp: 0 }),
        makeEnemy(),
      ],
      turnOrder: ['enemy-1'],
      currentTurnIndex: 0,
      turnResults: [],
      round: 1,
    };

    const action = getEnemyAiAction(state, 'enemy-1');
    expect(action.type).toBe('defend');
  });
});

// ── calculateRewards ─────────────────────────────────────────────────────────

describe('calculateRewards', () => {
  it('sums XP and gold from enemies', () => {
    const enemies = [
      makeEnemy({ maxHp: 30 }),
      makeEnemy({ id: 'enemy-2', maxHp: 50 }),
    ];

    const rewards = calculateRewards(enemies);
    // 30 * 0.6 = 18, 50 * 0.6 = 30 -> xp = 48
    // 30 * 0.3 = 9, 50 * 0.3 = 15 -> gold = 24
    expect(rewards.xp).toBe(48);
    expect(rewards.gold).toBe(24);
  });

  it('minimum reward is 1 per enemy', () => {
    const tinyEnemy = makeEnemy({ maxHp: 1 });
    const rewards = calculateRewards([tinyEnemy]);
    expect(rewards.xp).toBeGreaterThanOrEqual(1);
    expect(rewards.gold).toBeGreaterThanOrEqual(1);
  });
});

// ── Full Combat Flow ─────────────────────────────────────────────────────────

describe('full combat flow', () => {
  it('init → player attacks → enemy attacks → check end', () => {
    // Player is faster, enemy has low HP
    const player = makePlayer({ atk: 50, agi: 20, def: 10 });
    const enemy = makeEnemy({ hp: 10, maxHp: 10, atk: 5, agi: 5, def: 2 });

    // 1. Init
    let state = initCombat([player], [enemy]);
    expect(state.phase).toBe('player-turn');
    expect(state.round).toBe(1);

    // 2. Player attacks enemy — should kill it (50 * 1.0 - 2 * 0.5 = 49 damage)
    const attackAction: CombatAction = {
      type: 'attack',
      actorId: 'player-1',
      targetId: 'enemy-1',
    };
    state = executeAction(state, attackAction);

    // Enemy should be dead, combat should be victory
    const deadEnemy = state.combatants.find((c) => c.id === 'enemy-1')!;
    expect(deadEnemy.hp).toBe(0);
    expect(state.phase).toBe('victory');
    expect(checkCombatEnd(state)).toBe('victory');
  });

  it('multi-round combat with turn advancement', () => {
    // Both have enough HP to survive multiple rounds
    const player = makePlayer({ atk: 10, agi: 15, def: 5, hp: 200, maxHp: 200 });
    const enemy = makeEnemy({ atk: 8, agi: 10, def: 5, hp: 200, maxHp: 200 });

    let state = initCombat([player], [enemy]);
    expect(state.phase).toBe('player-turn'); // player has higher AGI

    // Player attacks
    state = executeAction(state, {
      type: 'attack',
      actorId: 'player-1',
      targetId: 'enemy-1',
    });

    // Should now be enemy's turn
    expect(state.phase).toBe('enemy-turn');

    // Enemy attacks
    state = executeAction(state, {
      type: 'attack',
      actorId: 'enemy-1',
      targetId: 'player-1',
    });

    // Should advance to round 2, player's turn again
    expect(state.round).toBe(2);
    expect(state.phase).toBe('player-turn');
    expect(state.turnResults.length).toBe(2);
  });
});
