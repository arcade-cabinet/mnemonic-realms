import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock vibrancy module since memory's recallMemory calls increaseVibrancy
vi.mock('../../main/server/systems/vibrancy', () => ({
  increaseVibrancy: vi.fn(() => 30),
}));

import {
  collectFragment,
  getCollectedFragments,
  hasFragment,
  getFragmentCount,
  getFragmentsByEmotion,
  getFragmentsByZone,
  getFragmentDef,
  MEMORY_FRAGMENTS,
  recallMemory,
  getGodRecallEmotion,
  isGodRecalled,
  getGodRecallState,
  getRecallOrder,
  getRecallCount,
  getSubclassBranch,
  getWorldStateKey,
} from '../../main/server/systems/memory';
import { increaseVibrancy } from '../../main/server/systems/vibrancy';

// ---------------------------------------------------------------------------
// Mock RpgPlayer
// ---------------------------------------------------------------------------

function createMockPlayer(vars: Record<string, unknown> = {}) {
  const store = new Map<string, unknown>(Object.entries(vars));
  return {
    getVariable: vi.fn((key: string) => store.get(key)),
    setVariable: vi.fn((key: string, value: unknown) => store.set(key, value)),
    emit: vi.fn(),
  } as unknown as import('@rpgjs/server').RpgPlayer;
}

// ---------------------------------------------------------------------------
// Fragment Definitions
// ---------------------------------------------------------------------------

describe('getFragmentDef', () => {
  it('returns fragment definition by ID', () => {
    const frag = getFragmentDef('frag-vh-01');
    expect(frag).toBeDefined();
    expect(frag!.name).toBe('Wildflower Offering');
    expect(frag!.emotion).toBe('joy');
    expect(frag!.zone).toBe('village-hub');
  });

  it('returns undefined for unknown ID', () => {
    expect(getFragmentDef('nonexistent')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Fragment Collection
// ---------------------------------------------------------------------------

describe('collectFragment', () => {
  it('collects a valid fragment and returns true', () => {
    const player = createMockPlayer();
    const result = collectFragment(player, 'frag-vh-01');
    expect(result).toBe(true);
    expect(player.setVariable).toHaveBeenCalledWith('MEMORY_FRAGMENTS', ['frag-vh-01']);
  });

  it('emits memory-fragment-collected event', () => {
    const player = createMockPlayer();
    collectFragment(player, 'frag-vh-01');
    expect(player.emit).toHaveBeenCalledWith(
      'memory-fragment-collected',
      expect.objectContaining({ totalCount: 1 }),
    );
  });

  it('returns false for duplicate collection', () => {
    const player = createMockPlayer({ MEMORY_FRAGMENTS: ['frag-vh-01'] });
    const result = collectFragment(player, 'frag-vh-01');
    expect(result).toBe(false);
  });

  it('returns false for unknown fragment ID', () => {
    const player = createMockPlayer();
    const result = collectFragment(player, 'nonexistent');
    expect(result).toBe(false);
  });

  it('accumulates multiple fragments', () => {
    const player = createMockPlayer();
    collectFragment(player, 'frag-vh-01');
    collectFragment(player, 'frag-vh-02');
    expect(player.setVariable).toHaveBeenCalledWith(
      'MEMORY_FRAGMENTS',
      ['frag-vh-01', 'frag-vh-02'],
    );
  });
});

// ---------------------------------------------------------------------------
// Query functions
// ---------------------------------------------------------------------------

describe('getCollectedFragments', () => {
  it('returns fragment definitions for collected IDs', () => {
    const player = createMockPlayer({ MEMORY_FRAGMENTS: ['frag-vh-01', 'frag-hf-01'] });
    const frags = getCollectedFragments(player);
    expect(frags).toHaveLength(2);
    expect(frags[0].name).toBe('Wildflower Offering');
    expect(frags[1].name).toBe('Meadow Lullaby');
  });

  it('returns empty array when no fragments collected', () => {
    const player = createMockPlayer();
    expect(getCollectedFragments(player)).toEqual([]);
  });
});

describe('hasFragment', () => {
  it('returns true for collected fragment', () => {
    const player = createMockPlayer({ MEMORY_FRAGMENTS: ['frag-vh-01'] });
    expect(hasFragment(player, 'frag-vh-01')).toBe(true);
  });

  it('returns false for uncollected fragment', () => {
    const player = createMockPlayer();
    expect(hasFragment(player, 'frag-vh-01')).toBe(false);
  });
});

describe('getFragmentCount', () => {
  it('returns count of collected fragments', () => {
    const player = createMockPlayer({
      MEMORY_FRAGMENTS: ['frag-vh-01', 'frag-vh-02', 'frag-hf-01'],
    });
    expect(getFragmentCount(player)).toBe(3);
  });

  it('returns 0 with no fragments', () => {
    const player = createMockPlayer();
    expect(getFragmentCount(player)).toBe(0);
  });
});

describe('getFragmentsByEmotion', () => {
  it('filters collected fragments by emotion', () => {
    const player = createMockPlayer({
      MEMORY_FRAGMENTS: ['frag-vh-01', 'frag-vh-02', 'frag-hf-01'],
    });
    // frag-vh-01 = joy, frag-vh-02 = calm, frag-hf-01 = calm
    const calmFrags = getFragmentsByEmotion(player, 'calm');
    expect(calmFrags).toHaveLength(2);
    expect(calmFrags.every((f) => f.emotion === 'calm')).toBe(true);
  });
});

describe('getFragmentsByZone', () => {
  it('filters collected fragments by zone', () => {
    const player = createMockPlayer({
      MEMORY_FRAGMENTS: ['frag-vh-01', 'frag-vh-02', 'frag-hf-01'],
    });
    const vhFrags = getFragmentsByZone(player, 'village-hub');
    expect(vhFrags).toHaveLength(2);
    expect(vhFrags.every((f) => f.zone === 'village-hub')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// God Recall System
// ---------------------------------------------------------------------------

describe('recallMemory', () => {
  beforeEach(() => {
    vi.mocked(increaseVibrancy).mockClear();
  });

  it('recalls a god successfully', () => {
    const player = createMockPlayer();
    const result = recallMemory(player, 'resonance', 'joy');

    expect(result.success).toBe(true);
    expect(result.godName).toBe('Cantara, God of the Living Song');
    expect(result.abilityName).toBe('Song of the Heart');
    expect(result.vibrancyGain).toBe(15);
  });

  it('sets subclass branch on first recall (joy -> luminary)', () => {
    const player = createMockPlayer();
    const result = recallMemory(player, 'resonance', 'joy');
    expect(result.subclassBranch).toBe('luminary');
    expect(player.setVariable).toHaveBeenCalledWith('SUBCLASS_BRANCH', 'luminary');
  });

  it('sets subclass branch on first recall (fury -> crucible)', () => {
    const player = createMockPlayer();
    const result = recallMemory(player, 'resonance', 'fury');
    expect(result.subclassBranch).toBe('crucible');
  });

  it('increases vibrancy in the god zone', () => {
    const player = createMockPlayer();
    recallMemory(player, 'resonance', 'joy');
    expect(increaseVibrancy).toHaveBeenCalledWith(player, 'resonance-fields', 15);
  });

  it('prevents double recall of same god', () => {
    const player = createMockPlayer({ RECALL_resonance: 'joy' });
    const result = recallMemory(player, 'resonance', 'awe');
    expect(result.success).toBe(false);
    expect(result.error).toContain('already been recalled');
  });

  it('rejects unknown god', () => {
    const player = createMockPlayer();
    const result = recallMemory(player, 'unknown' as any, 'joy');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unknown god');
  });

  it('rejects invalid emotion', () => {
    const player = createMockPlayer();
    const result = recallMemory(player, 'resonance', 'invalid' as any);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid recall emotion');
  });

  it('emits god-recalled event', () => {
    const player = createMockPlayer();
    recallMemory(player, 'verdance', 'sorrow');
    expect(player.emit).toHaveBeenCalledWith(
      'god-recalled',
      expect.objectContaining({
        godId: 'verdance',
        emotion: 'sorrow',
        isFirstRecall: true,
      }),
    );
  });
});

describe('recall query functions', () => {
  it('getGodRecallEmotion returns the stored emotion', () => {
    const player = createMockPlayer({ RECALL_resonance: 'joy' });
    expect(getGodRecallEmotion(player, 'resonance')).toBe('joy');
  });

  it('isGodRecalled returns true/false correctly', () => {
    const player = createMockPlayer({ RECALL_resonance: 'joy' });
    expect(isGodRecalled(player, 'resonance')).toBe(true);
    expect(isGodRecalled(player, 'verdance')).toBe(false);
  });

  it('getGodRecallState returns full state', () => {
    const player = createMockPlayer({ RECALL_luminos: 'fury' });
    const state = getGodRecallState(player, 'luminos');
    expect(state).toEqual({
      godId: 'luminos',
      emotion: 'fury',
      godName: 'Pyralis, God of the Searing Truth',
      abilityName: 'Searing Gaze',
    });
  });

  it('getRecallOrder returns ordered list', () => {
    const player = createMockPlayer({ RECALL_ORDER: ['resonance', 'verdance'] });
    expect(getRecallOrder(player)).toEqual(['resonance', 'verdance']);
  });

  it('getRecallCount returns count', () => {
    const player = createMockPlayer({ RECALL_ORDER: ['resonance'] });
    expect(getRecallCount(player)).toBe(1);
  });

  it('getSubclassBranch returns stored branch', () => {
    const player = createMockPlayer({ SUBCLASS_BRANCH: 'luminary' });
    expect(getSubclassBranch(player)).toBe('luminary');
  });

  it('getWorldStateKey builds correct key', () => {
    const player = createMockPlayer({
      RECALL_resonance: 'joy',
      RECALL_verdance: 'fury',
    });
    const key = getWorldStateKey(player);
    expect(key).toBe('resonance:joy|verdance:fury');
  });

  it('getWorldStateKey returns empty string with no recalls', () => {
    const player = createMockPlayer();
    expect(getWorldStateKey(player)).toBe('');
  });
});
