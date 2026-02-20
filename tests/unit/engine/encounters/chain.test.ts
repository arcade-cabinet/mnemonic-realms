import { describe, it, expect, vi } from 'vitest';
import {
  createChainFromEncounter,
  advanceChain,
  getCurrentStep,
  isChainComplete,
  createRandomEncounterCheck,
} from '../../../../engine/encounters/chain';
import type { ChainState } from '../../../../engine/encounters/chain';
import type { RuntimeEncounter } from '../../../../gen/assemblage/pipeline/runtime-types';

// ── Test Fixtures ────────────────────────────────────────────────────────────

function makeEncounter(overrides: Partial<RuntimeEncounter> = {}): RuntimeEncounter {
  return {
    id: 'ENC-01',
    name: 'Wolf Pack',
    type: 'random',
    enemies: [{ enemyId: 'E-SL-01', count: 2, position: 'front' }],
    rewards: { xp: 20, gold: 10 },
    escapeAllowed: true,
    ...overrides,
  };
}

// ── createChainFromEncounter ────────────────────────────────────────────────

describe('createChainFromEncounter', () => {
  it('single encounter produces 1 combat step', () => {
    const encounters = new Map<string, RuntimeEncounter>([
      ['ENC-01', makeEncounter({ id: 'ENC-01' })],
    ]);

    const chain = createChainFromEncounter('ENC-01', encounters);

    expect(chain.phase).toBe('executing');
    expect(chain.steps).toHaveLength(1);
    expect(chain.steps[0]).toEqual({ type: 'combat', encounterId: 'ENC-01' });
    expect(chain.currentStepIndex).toBe(0);
  });

  it('chained encounters produce multiple steps with reward steps between', () => {
    const encounters = new Map<string, RuntimeEncounter>([
      ['ENC-01', makeEncounter({ id: 'ENC-01', chainNext: 'ENC-02' })],
      ['ENC-02', makeEncounter({ id: 'ENC-02', chainNext: 'ENC-03' })],
      ['ENC-03', makeEncounter({ id: 'ENC-03' })],
    ]);

    const chain = createChainFromEncounter('ENC-01', encounters);

    expect(chain.steps).toHaveLength(5); // combat, reward, combat, reward, combat
    expect(chain.steps[0]).toEqual({ type: 'combat', encounterId: 'ENC-01' });
    expect(chain.steps[1]).toEqual({ type: 'reward' });
    expect(chain.steps[2]).toEqual({ type: 'combat', encounterId: 'ENC-02' });
    expect(chain.steps[3]).toEqual({ type: 'reward' });
    expect(chain.steps[4]).toEqual({ type: 'combat', encounterId: 'ENC-03' });
  });

  it('handles missing encounters gracefully — returns complete chain', () => {
    const encounters = new Map<string, RuntimeEncounter>();
    const chain = createChainFromEncounter('MISSING', encounters);

    expect(chain.phase).toBe('complete');
    expect(chain.steps).toHaveLength(0);
  });

  it('handles broken chain link gracefully', () => {
    const encounters = new Map<string, RuntimeEncounter>([
      ['ENC-01', makeEncounter({ id: 'ENC-01', chainNext: 'MISSING' })],
    ]);

    const chain = createChainFromEncounter('ENC-01', encounters);

    // Only the first encounter is resolved; the missing link terminates the chain
    expect(chain.steps).toHaveLength(1);
    expect(chain.steps[0]).toEqual({ type: 'combat', encounterId: 'ENC-01' });
  });

  it('handles circular chain references without infinite loop', () => {
    const encounters = new Map<string, RuntimeEncounter>([
      ['ENC-A', makeEncounter({ id: 'ENC-A', chainNext: 'ENC-B' })],
      ['ENC-B', makeEncounter({ id: 'ENC-B', chainNext: 'ENC-A' })],
    ]);

    const chain = createChainFromEncounter('ENC-A', encounters);

    // Should resolve A -> B and stop (cycle detected)
    expect(chain.steps).toHaveLength(3); // combat A, reward, combat B
  });
});

// ── advanceChain ────────────────────────────────────────────────────────────

describe('advanceChain', () => {
  it('progresses through steps correctly', () => {
    const encounters = new Map<string, RuntimeEncounter>([
      ['ENC-01', makeEncounter({ id: 'ENC-01', chainNext: 'ENC-02' })],
      ['ENC-02', makeEncounter({ id: 'ENC-02' })],
    ]);

    let chain = createChainFromEncounter('ENC-01', encounters);
    expect(chain.currentStepIndex).toBe(0);
    expect(chain.phase).toBe('executing');

    // Advance past first combat -> reward step
    chain = advanceChain(chain);
    expect(chain.currentStepIndex).toBe(1);
    expect(getCurrentStep(chain)!.type).toBe('reward');
    expect(chain.phase).toBe('awaiting-input');

    // Advance past reward -> second combat
    chain = advanceChain(chain);
    expect(chain.currentStepIndex).toBe(2);
    expect(getCurrentStep(chain)!.type).toBe('combat');
    expect(chain.phase).toBe('executing');

    // Advance past last combat -> complete
    chain = advanceChain(chain);
    expect(chain.phase).toBe('complete');
  });

  it('clears combatState and dialogueId on advance', () => {
    const state: ChainState = {
      phase: 'executing',
      steps: [
        { type: 'combat', encounterId: 'ENC-01' },
        { type: 'reward' },
      ],
      currentStepIndex: 0,
      combatState: { phase: 'victory', combatants: [], turnOrder: [], currentTurnIndex: 0, turnResults: [], round: 1 },
    };

    const advanced = advanceChain(state);
    expect(advanced.combatState).toBeUndefined();
  });
});

// ── getCurrentStep ──────────────────────────────────────────────────────────

describe('getCurrentStep', () => {
  it('returns correct step at each position', () => {
    const encounters = new Map<string, RuntimeEncounter>([
      ['ENC-01', makeEncounter({ id: 'ENC-01' })],
    ]);

    const chain = createChainFromEncounter('ENC-01', encounters);
    const step = getCurrentStep(chain);

    expect(step).not.toBeNull();
    expect(step!.type).toBe('combat');
    expect(step!.encounterId).toBe('ENC-01');
  });

  it('returns null when chain is complete', () => {
    const chain: ChainState = {
      phase: 'complete',
      steps: [{ type: 'combat', encounterId: 'ENC-01' }],
      currentStepIndex: 1,
    };

    expect(getCurrentStep(chain)).toBeNull();
  });
});

// ── isChainComplete ─────────────────────────────────────────────────────────

describe('isChainComplete', () => {
  it('returns true only when phase is complete', () => {
    expect(isChainComplete({ phase: 'complete', steps: [], currentStepIndex: 0 })).toBe(true);
    expect(isChainComplete({ phase: 'executing', steps: [], currentStepIndex: 0 })).toBe(false);
    expect(isChainComplete({ phase: 'idle', steps: [], currentStepIndex: 0 })).toBe(false);
    expect(isChainComplete({ phase: 'awaiting-input', steps: [], currentStepIndex: 0 })).toBe(false);
  });

  it('returns true after advancing past all steps', () => {
    const encounters = new Map<string, RuntimeEncounter>([
      ['ENC-01', makeEncounter({ id: 'ENC-01' })],
    ]);

    let chain = createChainFromEncounter('ENC-01', encounters);
    expect(isChainComplete(chain)).toBe(false);

    chain = advanceChain(chain);
    expect(isChainComplete(chain)).toBe(true);
  });
});

// ── createRandomEncounterCheck ──────────────────────────────────────────────

describe('createRandomEncounterCheck', () => {
  it('never triggers at 0 steps', () => {
    const checker = createRandomEncounterCheck(20);
    // Even with random, 0 steps should never trigger
    for (let i = 0; i < 100; i++) {
      expect(checker.shouldTrigger(0)).toBe(false);
    }
  });

  it('probability increases with steps', () => {
    const checker = createRandomEncounterCheck(20);

    // At low steps, probability is low; at high steps, probability is high
    // We test by running many trials and checking the rate
    let lowStepTriggers = 0;
    let highStepTriggers = 0;
    const trials = 1000;

    vi.spyOn(Math, 'random');

    // Test at 5 steps (probability = 5/40 = 0.125)
    for (let i = 0; i < trials; i++) {
      (Math.random as any).mockReturnValueOnce(0.1); // below 0.125 -> trigger
    }
    for (let i = 0; i < trials; i++) {
      if (checker.shouldTrigger(5)) lowStepTriggers++;
    }

    // Test at 35 steps (probability = 35/40 = 0.875)
    for (let i = 0; i < trials; i++) {
      (Math.random as any).mockReturnValueOnce(0.1); // below 0.875 -> trigger
    }
    for (let i = 0; i < trials; i++) {
      if (checker.shouldTrigger(35)) highStepTriggers++;
    }

    expect(highStepTriggers).toBeGreaterThanOrEqual(lowStepTriggers);

    vi.restoreAllMocks();
  });

  it('always triggers at 2x stepsBetween', () => {
    const checker = createRandomEncounterCheck(10);

    // At 20 steps (2x10), probability = min(1, 20/20) = 1.0
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(checker.shouldTrigger(20)).toBe(true);

    vi.restoreAllMocks();
  });

  it('always triggers beyond 2x stepsBetween', () => {
    const checker = createRandomEncounterCheck(10);

    // At 50 steps, probability = min(1, 50/20) = 1.0
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    expect(checker.shouldTrigger(50)).toBe(true);

    vi.restoreAllMocks();
  });
});

