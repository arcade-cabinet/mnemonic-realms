import { describe, expect, it } from 'vitest';
import { selectCombatAction } from '../../../../../engine/testing/behaviors/combat.js';
import type { CombatState, Combatant } from '../../../../../engine/encounters/types.js';

function makeCombatant(overrides: Partial<Combatant> & { id: string; name: string; type: 'player' | 'enemy' }): Combatant {
  return {
    hp: 100,
    maxHp: 100,
    atk: 10,
    int: 5,
    def: 5,
    agi: 5,
    skills: [],
    statusEffects: [],
    ...overrides,
  };
}

function makeState(overrides: Partial<CombatState> = {}): CombatState {
  const player = makeCombatant({ id: 'p1', name: 'Hero', type: 'player' });
  const enemy = makeCombatant({ id: 'e1', name: 'Slime', type: 'enemy', hp: 30 });
  return {
    phase: 'player-turn',
    combatants: [player, enemy],
    turnOrder: ['p1', 'e1'],
    currentTurnIndex: 0,
    turnResults: [],
    round: 1,
    ...overrides,
  };
}

describe('selectCombatAction', () => {
  describe('aggressive style', () => {
    it('attacks the weakest enemy', () => {
      const enemy1 = makeCombatant({ id: 'e1', name: 'Slime', type: 'enemy', hp: 50 });
      const enemy2 = makeCombatant({ id: 'e2', name: 'Bat', type: 'enemy', hp: 20 });
      const state = makeState({ combatants: [makeCombatant({ id: 'p1', name: 'Hero', type: 'player' }), enemy1, enemy2] });

      const action = selectCombatAction(state, 'p1', 'aggressive');
      expect(action.targetId).toBe('e2'); // Bat has lower HP
    });

    it('uses skill if available', () => {
      const player = makeCombatant({
        id: 'p1', name: 'Hero', type: 'player',
        skills: [{ id: 'fireball', name: 'Fireball', cost: 5, multiplier: 2.0, element: 'fire' }],
      });
      const state = makeState({ combatants: [player, makeCombatant({ id: 'e1', name: 'Slime', type: 'enemy' })] });

      const action = selectCombatAction(state, 'p1', 'aggressive');
      expect(action.type).toBe('skill');
      expect(action.skillId).toBe('fireball');
    });
  });

  describe('defensive style', () => {
    it('defends when HP is critical', () => {
      const player = makeCombatant({ id: 'p1', name: 'Hero', type: 'player', hp: 20, maxHp: 100 });
      const state = makeState({ combatants: [player, makeCombatant({ id: 'e1', name: 'Slime', type: 'enemy' })] });

      const action = selectCombatAction(state, 'p1', 'defensive');
      expect(action.type).toBe('defend');
    });

    it('attacks when HP is healthy', () => {
      const player = makeCombatant({ id: 'p1', name: 'Hero', type: 'player', hp: 80, maxHp: 100 });
      const state = makeState({ combatants: [player, makeCombatant({ id: 'e1', name: 'Slime', type: 'enemy' })] });

      const action = selectCombatAction(state, 'p1', 'defensive');
      expect(action.type).toBe('attack');
    });
  });

  describe('balanced style', () => {
    it('defends when HP is low', () => {
      const player = makeCombatant({ id: 'p1', name: 'Hero', type: 'player', hp: 25, maxHp: 100 });
      const state = makeState({ combatants: [player, makeCombatant({ id: 'e1', name: 'Slime', type: 'enemy' })] });

      const action = selectCombatAction(state, 'p1', 'balanced');
      expect(action.type).toBe('defend');
    });

    it('uses skill when available and HP is healthy', () => {
      const player = makeCombatant({
        id: 'p1', name: 'Hero', type: 'player', hp: 80, maxHp: 100,
        skills: [{ id: 'slash', name: 'Slash', cost: 3, multiplier: 1.5 }],
      });
      const state = makeState({ combatants: [player, makeCombatant({ id: 'e1', name: 'Slime', type: 'enemy' })] });

      const action = selectCombatAction(state, 'p1', 'balanced');
      expect(action.type).toBe('skill');
    });

    it('attacks when no skills available', () => {
      const player = makeCombatant({ id: 'p1', name: 'Hero', type: 'player', hp: 80, maxHp: 100 });
      const state = makeState({ combatants: [player, makeCombatant({ id: 'e1', name: 'Slime', type: 'enemy' })] });

      const action = selectCombatAction(state, 'p1', 'balanced');
      expect(action.type).toBe('attack');
    });
  });

  it('returns defend when actor not found', () => {
    const state = makeState();
    const action = selectCombatAction(state, 'nonexistent', 'balanced');
    expect(action.type).toBe('defend');
  });

  it('returns defend when no enemies alive', () => {
    const player = makeCombatant({ id: 'p1', name: 'Hero', type: 'player' });
    const enemy = makeCombatant({ id: 'e1', name: 'Slime', type: 'enemy', hp: 0 });
    const state = makeState({ combatants: [player, enemy] });

    const action = selectCombatAction(state, 'p1', 'aggressive');
    expect(action.type).toBe('defend');
  });
});

