import { describe, expect, it, vi } from 'vitest';
import {
  resolveEncounterChain,
  selectRandomEncounter,
  serializeEncounter,
  serializeEncounterPool,
} from '../../../gen/assemblage/pipeline/encounter-serializer.ts';
import {
  EncounterDdlSchema,
  EncounterFileDdlSchema,
  EncounterPoolDdlSchema,
} from '../../../gen/schemas/ddl-encounters.ts';
import type { EncounterDdl, EncounterPoolDdl } from '../../../gen/schemas/ddl-encounters.ts';
import type { RuntimeEncounterPool } from '../../../gen/assemblage/pipeline/runtime-types.ts';

import settledLandsData from '../../../gen/ddl/encounters/settled-lands.json';
import bossData from '../../../gen/ddl/encounters/boss-encounters.json';

// --- Helpers ---

function makeEncounter(overrides: Partial<EncounterDdl> = {}): EncounterDdl {
  return {
    id: 'ENC-TEST-01',
    name: 'Test Encounter',
    region: 'test-region',
    type: 'random',
    enemies: [{ enemyId: 'E-SL-01', count: 2 }],
    rewards: { xp: 50, gold: 20 },
    escapeAllowed: true,
    ...overrides,
  };
}

function makePool(overrides: Partial<EncounterPoolDdl> = {}): EncounterPoolDdl {
  return {
    regionId: 'test-region',
    encounters: ['ENC-TEST-01', 'ENC-TEST-02'],
    stepsBetween: 100,
    levelRange: [1, 5],
    ...overrides,
  };
}

// --- DDL Validation Tests ---

describe('DDL encounter schema validation', () => {
  it('validates settled-lands.json against EncounterFileDdlSchema', () => {
    const result = EncounterFileDdlSchema.safeParse(settledLandsData);
    expect(result.success).toBe(true);
  });

  it('validates boss-encounters.json against EncounterFileDdlSchema', () => {
    // boss-encounters.json has no pools, wrap with optional
    const result = EncounterFileDdlSchema.safeParse(bossData);
    expect(result.success).toBe(true);
  });

  it('validates a single encounter against EncounterDdlSchema', () => {
    const result = EncounterDdlSchema.safeParse(makeEncounter());
    expect(result.success).toBe(true);
  });

  it('validates an encounter pool against EncounterPoolDdlSchema', () => {
    const result = EncounterPoolDdlSchema.safeParse(makePool());
    expect(result.success).toBe(true);
  });

  it('rejects encounter with empty enemies', () => {
    const result = EncounterDdlSchema.safeParse(makeEncounter({ enemies: [] }));
    expect(result.success).toBe(false);
  });

  it('rejects pool with empty encounters', () => {
    const result = EncounterPoolDdlSchema.safeParse(makePool({ encounters: [] }));
    expect(result.success).toBe(false);
  });

  it('rejects encounter with invalid type', () => {
    const result = EncounterDdlSchema.safeParse(
      makeEncounter({ type: 'invalid' as any }),
    );
    expect(result.success).toBe(false);
  });
});

// --- Chain Resolution Tests ---

describe('resolveEncounterChain', () => {
  it('resolves a simple A → B → C chain', () => {
    const encounters = new Map<string, EncounterDdl>([
      ['A', makeEncounter({ id: 'A', chain: { next: 'B' } })],
      ['B', makeEncounter({ id: 'B', chain: { next: 'C' } })],
      ['C', makeEncounter({ id: 'C' })],
    ]);
    expect(resolveEncounterChain('A', encounters)).toEqual(['A', 'B', 'C']);
  });

  it('handles missing next encounter gracefully', () => {
    const encounters = new Map<string, EncounterDdl>([
      ['A', makeEncounter({ id: 'A', chain: { next: 'B' } })],
      // B is missing
    ]);
    expect(resolveEncounterChain('A', encounters)).toEqual(['A']);
  });

  it('returns empty array for nonexistent start encounter', () => {
    const encounters = new Map<string, EncounterDdl>();
    expect(resolveEncounterChain('MISSING', encounters)).toEqual([]);
  });

  it('handles single encounter with no chain', () => {
    const encounters = new Map<string, EncounterDdl>([
      ['A', makeEncounter({ id: 'A' })],
    ]);
    expect(resolveEncounterChain('A', encounters)).toEqual(['A']);
  });

  it('handles circular chain references without infinite loop', () => {
    const encounters = new Map<string, EncounterDdl>([
      ['A', makeEncounter({ id: 'A', chain: { next: 'B' } })],
      ['B', makeEncounter({ id: 'B', chain: { next: 'A' } })],
    ]);
    expect(resolveEncounterChain('A', encounters)).toEqual(['A', 'B']);
  });
});

// --- Random Encounter Selection Tests ---

describe('selectRandomEncounter', () => {
  it('selects an encounter from the pool', () => {
    const pool: RuntimeEncounterPool = {
      regionId: 'test',
      encounters: ['ENC-01', 'ENC-02', 'ENC-03'],
      stepsBetween: 100,
      levelRange: [1, 5],
    };
    const result = selectRandomEncounter(pool);
    expect(pool.encounters).toContain(result);
  });

  it('returns undefined for empty pool', () => {
    const pool: RuntimeEncounterPool = {
      regionId: 'test',
      encounters: [],
      stepsBetween: 100,
      levelRange: [1, 5],
    };
    expect(selectRandomEncounter(pool)).toBeUndefined();
  });

  it('returns the only encounter when pool has one entry', () => {
    const pool: RuntimeEncounterPool = {
      regionId: 'test',
      encounters: ['ENC-ONLY'],
      stepsBetween: 100,
      levelRange: [1, 5],
    };
    expect(selectRandomEncounter(pool)).toBe('ENC-ONLY');
  });
});

// --- Serialization Tests ---

describe('serializeEncounter', () => {
  it('produces correct runtime format', () => {
    const encounter = makeEncounter({
      id: 'ENC-SL-01',
      name: 'Meadow Sprites',
      type: 'random',
      enemies: [
        { enemyId: 'E-SL-01', count: 3, position: 'front' },
      ],
      background: 'bg-heartfield-meadow',
      music: 'bgm-combat-settled',
      rewards: { xp: 54, gold: 24 },
      escapeAllowed: true,
    });

    const result = serializeEncounter(encounter);

    expect(result.id).toBe('ENC-SL-01');
    expect(result.name).toBe('Meadow Sprites');
    expect(result.type).toBe('random');
    expect(result.enemies).toHaveLength(1);
    expect(result.enemies[0]).toEqual({ enemyId: 'E-SL-01', count: 3, position: 'front' });
    expect(result.background).toBe('bg-heartfield-meadow');
    expect(result.music).toBe('bgm-combat-settled');
    expect(result.rewards).toEqual({ xp: 54, gold: 24 });
    expect(result.escapeAllowed).toBe(true);
    expect(result.chainNext).toBeUndefined();
  });

  it('includes chainNext when chain is defined', () => {
    const encounter = makeEncounter({
      chain: { next: 'ENC-SL-02' },
    });
    const result = serializeEncounter(encounter);
    expect(result.chainNext).toBe('ENC-SL-02');
  });

  it('defaults position to front when not specified', () => {
    const encounter = makeEncounter({
      enemies: [{ enemyId: 'E-SL-01', count: 1 }],
    });
    const result = serializeEncounter(encounter);
    expect(result.enemies[0].position).toBe('front');
  });

  it('defaults rewards to zero when not specified', () => {
    const encounter = makeEncounter();
    // Remove rewards from the encounter
    const { rewards, ...rest } = encounter;
    const noRewards = { ...rest, rewards: undefined } as any;
    const result = serializeEncounter(noRewards);
    expect(result.rewards).toEqual({ xp: 0, gold: 0 });
  });
});

describe('serializeEncounterPool', () => {
  it('produces correct runtime pool and encounters', () => {
    const enc1 = makeEncounter({ id: 'ENC-TEST-01' });
    const enc2 = makeEncounter({ id: 'ENC-TEST-02', name: 'Test 2' });
    const enc3 = makeEncounter({ id: 'ENC-TEST-03', name: 'Not in pool' });
    const pool = makePool();

    const result = serializeEncounterPool(pool, [enc1, enc2, enc3]);

    expect(result.pool.regionId).toBe('test-region');
    expect(result.pool.encounters).toEqual(['ENC-TEST-01', 'ENC-TEST-02']);
    expect(result.pool.stepsBetween).toBe(100);
    expect(result.pool.levelRange).toEqual([1, 5]);
    // Only encounters in the pool are serialized
    expect(result.encounters).toHaveLength(2);
    expect(result.encounters.map((e) => e.id)).toEqual(['ENC-TEST-01', 'ENC-TEST-02']);
  });

  it('produces valid JSON with no circular references', () => {
    const enc = makeEncounter();
    const pool = makePool({ encounters: ['ENC-TEST-01'] });
    const result = serializeEncounterPool(pool, [enc]);

    const json = JSON.stringify(result);
    expect(typeof json).toBe('string');
    expect(json.length).toBeGreaterThan(0);

    const parsed = JSON.parse(json);
    expect(parsed.pool.regionId).toBe('test-region');
    expect(parsed.encounters).toHaveLength(1);
  });
});

