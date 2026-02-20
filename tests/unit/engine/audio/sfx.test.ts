import { describe, expect, it } from 'vitest';
import {
  createSfxRegistry,
  getSfxConfig,
  SFX_CHEST_OPEN,
  SFX_COMBAT_HIT,
  SFX_DIALOGUE_ADVANCE,
  STANDARD_SFX_IDS,
} from '../../../../engine/audio/sfx';
import type { SfxConfig } from '../../../../engine/audio/types';

// ── Test data ────────────────────────────────────────────────────────────────

const testConfigs: SfxConfig[] = [
  { id: 'dialogue-advance', file: 'sfx/dialogue-advance.ogg', volume: 0.6 },
  { id: 'chest-open', file: 'sfx/chest-open.ogg', volume: 0.8 },
  { id: 'combat-hit', file: 'sfx/combat-hit.ogg', volume: 1.0 },
];

// ── createSfxRegistry ────────────────────────────────────────────────────────

describe('createSfxRegistry', () => {
  it('creates a registry from config array', () => {
    const registry = createSfxRegistry(testConfigs);
    expect(registry.size).toBe(3);
  });

  it('creates empty registry from empty array', () => {
    const registry = createSfxRegistry([]);
    expect(registry.size).toBe(0);
  });

  it('last config wins for duplicate IDs', () => {
    const dupes: SfxConfig[] = [
      { id: 'test', file: 'first.ogg', volume: 0.5 },
      { id: 'test', file: 'second.ogg', volume: 1.0 },
    ];
    const registry = createSfxRegistry(dupes);
    expect(registry.size).toBe(1);
    expect(registry.get('test')!.file).toBe('second.ogg');
  });
});

// ── getSfxConfig ─────────────────────────────────────────────────────────────

describe('getSfxConfig', () => {
  const registry = createSfxRegistry(testConfigs);

  it('retrieves existing config by ID', () => {
    const config = getSfxConfig(registry, 'chest-open');
    expect(config).not.toBeNull();
    expect(config!.id).toBe('chest-open');
    expect(config!.file).toBe('sfx/chest-open.ogg');
    expect(config!.volume).toBe(0.8);
  });

  it('returns null for unknown ID', () => {
    expect(getSfxConfig(registry, 'nonexistent')).toBeNull();
  });

  it('retrieves all test configs correctly', () => {
    for (const cfg of testConfigs) {
      const result = getSfxConfig(registry, cfg.id);
      expect(result).toEqual(cfg);
    }
  });
});

// ── Standard SFX IDs ─────────────────────────────────────────────────────────

describe('STANDARD_SFX_IDS', () => {
  it('contains 10 standard SFX IDs', () => {
    expect(STANDARD_SFX_IDS).toHaveLength(10);
  });

  it('includes expected IDs', () => {
    expect(STANDARD_SFX_IDS).toContain(SFX_DIALOGUE_ADVANCE);
    expect(STANDARD_SFX_IDS).toContain(SFX_CHEST_OPEN);
    expect(STANDARD_SFX_IDS).toContain(SFX_COMBAT_HIT);
  });

  it('all IDs are unique', () => {
    const unique = new Set(STANDARD_SFX_IDS);
    expect(unique.size).toBe(STANDARD_SFX_IDS.length);
  });
});

