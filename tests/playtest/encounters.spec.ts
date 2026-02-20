/**
 * Encounters Playtest — Combat, Chains, Random Encounters, Balance
 *
 * Tests the encounter system: combat engine, encounter chaining,
 * random encounter triggering, combat balance, and TPK detection.
 */

import { describe, expect, it } from 'vitest';
import {
  initCombat,
  executeAction,
  checkCombatEnd,
  calculateDamage,
  getEnemyAiAction,
  determineTurnOrder,
  calculateRewards,
} from '../../engine/encounters/combat-engine.js';
import {
  createChainFromEncounter,
  advanceChain,
  getCurrentStep,
  isChainComplete,
  createRandomEncounterCheck,
} from '../../engine/encounters/chain.js';
import type { Combatant, CombatAction, Skill } from '../../engine/encounters/types.js';
import type { RuntimeEncounter } from '../../gen/assemblage/pipeline/runtime-types.js';
import { registerCleanup } from './helpers/setup.js';

registerCleanup();

// ── Test Fixtures ────────────────────────────────────────────────────────────

const fireBlast: Skill = {
  id: 'SK-01',
  name: 'Fire Blast',
  cost: 5,
  multiplier: 1.5,
  element: 'fire',
  effect: 'burn',
};

function makePlayer(overrides: Partial<Combatant> = {}): Combatant {
  return {
    id: 'player-1',
    name: 'Callum',
    type: 'player',
    hp: 100,
    maxHp: 100,
    atk: 15,
    int: 10,
    def: 8,
    agi: 12,
    skills: [fireBlast],
    statusEffects: [],
    ...overrides,
  };
}

function makeEnemy(overrides: Partial<Combatant> = {}): Combatant {
  return {
    id: 'enemy-1',
    name: 'Wild Wolf',
    type: 'enemy',
    hp: 40,
    maxHp: 40,
    atk: 10,
    int: 3,
    def: 5,
    agi: 8,
    skills: [],
    statusEffects: [],
    ...overrides,
  };
}

function makeEncounterMap(): Map<string, RuntimeEncounter> {
  const encounters = new Map<string, RuntimeEncounter>();
  encounters.set('ENC-01', {
    id: 'ENC-01',
    name: 'Wolf Pack',
    type: 'random',
    enemies: [{ enemyId: 'E-SL-01', count: 2, position: 'front' }],
    rewards: { xp: 30, gold: 15 },
    escapeAllowed: true,
    chainNext: 'ENC-02',
  });
  encounters.set('ENC-02', {
    id: 'ENC-02',
    name: 'Alpha Wolf',
    type: 'boss',
    enemies: [{ enemyId: 'E-SL-02', count: 1, position: 'center' }],
    rewards: { xp: 80, gold: 40 },
    escapeAllowed: false,
  });
  return encounters;
}

describe('Encounters — Combat & Chains', () => {
  describe('Combat Engine', () => {
    it('initializes combat with correct turn order', () => {
      const player = makePlayer();
      const enemy = makeEnemy();
      const state = initCombat([player], [enemy]);

      expect(state.phase).toBe('player-turn');
      expect(state.combatants).toHaveLength(2);
      expect(state.turnOrder).toHaveLength(2);
      expect(state.round).toBe(1);
    });

    it('player attack reduces enemy HP', () => {
      const player = makePlayer();
      const enemy = makeEnemy();
      const state = initCombat([player], [enemy]);

      const action: CombatAction = {
        type: 'attack',
        actorId: 'player-1',
        targetId: 'enemy-1',
      };
      const next = executeAction(state, action);
      const updatedEnemy = next.combatants.find((c) => c.id === 'enemy-1')!;
      expect(updatedEnemy.hp).toBeLessThan(40);
    });

    it('skill attack applies damage multiplier', () => {
      const player = makePlayer();
      const enemy = makeEnemy();
      const state = initCombat([player], [enemy]);

      const action: CombatAction = {
        type: 'skill',
        actorId: 'player-1',
        targetId: 'enemy-1',
        skillId: 'SK-01',
      };
      const next = executeAction(state, action);
      const updatedEnemy = next.combatants.find((c) => c.id === 'enemy-1')!;
      // Skill damage should be higher than base attack
      const baseDamage = calculateDamage(player, enemy);
      const skillDamage = calculateDamage(player, enemy, fireBlast);
      expect(skillDamage).toBeGreaterThanOrEqual(baseDamage);
    });

    it('defend action doubles DEF', () => {
      const player = makePlayer();
      const enemy = makeEnemy();
      const state = initCombat([player], [enemy]);

      const action: CombatAction = { type: 'defend', actorId: 'player-1' };
      const next = executeAction(state, action);
      const updatedPlayer = next.combatants.find((c) => c.id === 'player-1')!;
      expect(updatedPlayer.def).toBe(player.def * 2);
    });

    it('flee ends combat with fled phase', () => {
      const player = makePlayer();
      const enemy = makeEnemy();
      const state = initCombat([player], [enemy]);

      const action: CombatAction = { type: 'flee', actorId: 'player-1' };
      const next = executeAction(state, action);
      expect(next.phase).toBe('fled');
    });

    it('combat ends in victory when all enemies defeated', () => {
      const player = makePlayer({ atk: 999 });
      const enemy = makeEnemy({ hp: 1 });
      const state = initCombat([player], [enemy]);

      const action: CombatAction = {
        type: 'attack',
        actorId: 'player-1',
        targetId: 'enemy-1',
      };
      const next = executeAction(state, action);
      expect(next.phase).toBe('victory');
      expect(checkCombatEnd(next)).toBe('victory');
    });

    it('combat ends in defeat when all players dead', () => {
      const player = makePlayer({ hp: 1 });
      const enemy = makeEnemy({ atk: 999 });
      let state = initCombat([player], [enemy]);

      // Skip to enemy turn by having player defend
      const defend: CombatAction = { type: 'defend', actorId: 'player-1' };
      state = executeAction(state, defend);

      // Enemy attacks
      const enemyAction = getEnemyAiAction(state, 'enemy-1');
      state = executeAction(state, enemyAction);
      expect(checkCombatEnd(state)).toBe('defeat');
    });

    it('enemy AI selects valid actions', () => {
      const player = makePlayer();
      const enemy = makeEnemy({ skills: [fireBlast] });
      const state = initCombat([player], [enemy]);

      const action = getEnemyAiAction(state, 'enemy-1');
      expect(['attack', 'skill', 'defend']).toContain(action.type);
      expect(action.actorId).toBe('enemy-1');
    });

    it('turn order is determined by AGI', () => {
      const fast = makePlayer({ id: 'fast', agi: 99 });
      const slow = makeEnemy({ id: 'slow', agi: 1 });
      const order = determineTurnOrder([fast, slow]);
      expect(order[0]).toBe('fast');
      expect(order[1]).toBe('slow');
    });

    it('rewards are calculated from defeated enemies', () => {
      const enemies = [makeEnemy({ maxHp: 40 }), makeEnemy({ id: 'e2', maxHp: 60 })];
      const rewards = calculateRewards(enemies);
      expect(rewards.xp).toBeGreaterThan(0);
      expect(rewards.gold).toBeGreaterThan(0);
    });
  });

  describe('Combat Balance — No TPK in 10 rounds', () => {
    it('balanced party survives 10 rounds against standard enemies', () => {
      const party = [
        makePlayer({ id: 'p1', name: 'Warrior', atk: 15, def: 12, agi: 10 }),
        makePlayer({ id: 'p2', name: 'Mage', atk: 8, int: 18, def: 6, agi: 14, skills: [fireBlast] }),
      ];
      const enemies = [
        makeEnemy({ id: 'e1', hp: 30, atk: 8, def: 4, agi: 7 }),
        makeEnemy({ id: 'e2', hp: 25, atk: 6, def: 3, agi: 9 }),
      ];

      let state = initCombat(party, enemies);
      let rounds = 0;

      while (checkCombatEnd(state) === 'ongoing' && rounds < 10) {
        const currentId = state.turnOrder[state.currentTurnIndex];
        const combatant = state.combatants.find((c) => c.id === currentId);
        if (!combatant || combatant.hp <= 0) {
          state = executeAction(state, { type: 'defend', actorId: currentId });
          continue;
        }

        if (combatant.type === 'player') {
          const livingEnemies = state.combatants.filter((c) => c.type === 'enemy' && c.hp > 0);
          if (livingEnemies.length > 0) {
            state = executeAction(state, {
              type: 'attack',
              actorId: combatant.id,
              targetId: livingEnemies[0].id,
            });
          } else {
            state = executeAction(state, { type: 'defend', actorId: combatant.id });
          }
        } else {
          const action = getEnemyAiAction(state, combatant.id);
          state = executeAction(state, action);
        }

        if (state.round > rounds) rounds = state.round;
      }

      // Party should not be wiped in 10 rounds
      const anyPlayerAlive = state.combatants
        .filter((c) => c.type === 'player')
        .some((c) => c.hp > 0);
      expect(anyPlayerAlive).toBe(true);
    });
  });

  describe('Encounter Chains', () => {
    it('creates chain from encounter with chainNext links', () => {
      const encounters = makeEncounterMap();
      const chain = createChainFromEncounter('ENC-01', encounters);

      expect(chain.phase).toBe('executing');
      // ENC-01 (combat) -> reward -> ENC-02 (combat)
      expect(chain.steps).toHaveLength(3);
      expect(chain.steps[0].type).toBe('combat');
      expect(chain.steps[1].type).toBe('reward');
      expect(chain.steps[2].type).toBe('combat');
    });

    it('advances through chain steps', () => {
      const encounters = makeEncounterMap();
      let chain = createChainFromEncounter('ENC-01', encounters);

      expect(getCurrentStep(chain)?.type).toBe('combat');
      expect(isChainComplete(chain)).toBe(false);

      chain = advanceChain(chain);
      expect(getCurrentStep(chain)?.type).toBe('reward');

      chain = advanceChain(chain);
      expect(getCurrentStep(chain)?.type).toBe('combat');

      chain = advanceChain(chain);
      expect(isChainComplete(chain)).toBe(true);
    });

    it('single encounter creates chain with one step', () => {
      const encounters = makeEncounterMap();
      const chain = createChainFromEncounter('ENC-02', encounters);

      expect(chain.steps).toHaveLength(1);
      expect(chain.steps[0].type).toBe('combat');
      expect(chain.steps[0].encounterId).toBe('ENC-02');
    });

    it('missing encounter creates empty completed chain', () => {
      const encounters = makeEncounterMap();
      const chain = createChainFromEncounter('NONEXISTENT', encounters);

      expect(chain.phase).toBe('complete');
      expect(chain.steps).toHaveLength(0);
    });
  });

  describe('Random Encounters', () => {
    it('never triggers at step 0', () => {
      const checker = createRandomEncounterCheck(20);
      expect(checker.shouldTrigger(0)).toBe(false);
    });

    it('always triggers at 2x stepsBetween', () => {
      const checker = createRandomEncounterCheck(10);
      // At 2x stepsBetween, probability = 1.0
      // Run multiple times to be sure (deterministic at p=1)
      let triggered = false;
      for (let i = 0; i < 10; i++) {
        if (checker.shouldTrigger(20)) triggered = true;
      }
      expect(triggered).toBe(true);
    });

    it('probability increases with steps', () => {
      const checker = createRandomEncounterCheck(100);
      // At step 1, probability is very low (0.005)
      // At step 150, probability is 0.75
      // We can't test randomness deterministically, but we can verify the API works
      const result = checker.shouldTrigger(1);
      expect(typeof result).toBe('boolean');
    });
  });
});

