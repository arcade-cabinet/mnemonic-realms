import { describe, expect, it } from 'vitest';
import type { RuntimeVibrancyArea } from '../../../../../gen/assemblage/pipeline/runtime-types.js';
import {
  checkForgottenDamage,
  createVibrancyMap,
  deserializeVibrancyState,
  getAreaAtPosition,
  serializeVibrancyState,
  updateVibrancyFromQuests,
} from '../../../../../engine/ecs/systems/vibrancy.js';

// ── Test data ───────────────────────────────────────────────────────────────

const testAreas: RuntimeVibrancyArea[] = [
  {
    id: 'everwick',
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    initialState: 'remembered',
  },
  {
    id: 'heartfield',
    x: 10,
    y: 0,
    width: 15,
    height: 15,
    initialState: 'partial',
    unlockQuest: 'find-the-shepherd',
  },
  {
    id: 'shimmer-marsh',
    x: 25,
    y: 0,
    width: 20,
    height: 20,
    initialState: 'forgotten',
    unlockQuest: 'marsh-expedition',
  },
];

// ── createVibrancyMap ───────────────────────────────────────────────────────

describe('createVibrancyMap', () => {
  it('initializes areas from runtime data with correct states', () => {
    const map = createVibrancyMap(testAreas);
    expect(map.areas).toHaveLength(3);
    expect(map.areas[0]).toEqual({
      id: 'everwick',
      x: 0, y: 0, width: 10, height: 10,
      state: 'remembered',
    });
    expect(map.areas[1].state).toBe('partial');
    expect(map.areas[1].unlockQuest).toBe('find-the-shepherd');
    expect(map.areas[2].state).toBe('forgotten');
    expect(map.areas[2].unlockQuest).toBe('marsh-expedition');
  });

  it('handles empty runtime areas', () => {
    const map = createVibrancyMap([]);
    expect(map.areas).toHaveLength(0);
  });
});

// ── getAreaAtPosition ───────────────────────────────────────────────────────

describe('getAreaAtPosition', () => {
  const map = createVibrancyMap(testAreas);

  it('returns correct area for pixel position (pixel→tile conversion)', () => {
    // Pixel (80, 80) → tile (5, 5) → inside everwick (0,0 to 10,10)
    const area = getAreaAtPosition(map, 80, 80);
    expect(area).not.toBeNull();
    expect(area!.id).toBe('everwick');
  });

  it('returns correct area at tile boundary', () => {
    // Pixel (160, 0) → tile (10, 0) → inside heartfield (10,0 to 25,15)
    const area = getAreaAtPosition(map, 160, 0);
    expect(area).not.toBeNull();
    expect(area!.id).toBe('heartfield');
  });

  it('returns null for position outside all areas', () => {
    // Pixel (800, 800) → tile (50, 50) → outside all areas
    const area = getAreaAtPosition(map, 800, 800);
    expect(area).toBeNull();
  });

  it('handles position at area origin (top-left corner)', () => {
    // Pixel (0, 0) → tile (0, 0) → inside everwick
    const area = getAreaAtPosition(map, 0, 0);
    expect(area).not.toBeNull();
    expect(area!.id).toBe('everwick');
  });

  it('returns null for position just outside area boundary', () => {
    // Pixel (159, 0) → tile (9, 0) → inside everwick (last tile)
    expect(getAreaAtPosition(map, 159, 0)!.id).toBe('everwick');
    // Pixel (0, 160) → tile (0, 10) → outside everwick (height=10, so y<10)
    expect(getAreaAtPosition(map, 0, 160)).toBeNull();
  });

  it('handles sub-tile pixel positions correctly', () => {
    // Pixel (7, 7) → tile (0, 0) → inside everwick
    expect(getAreaAtPosition(map, 7, 7)!.id).toBe('everwick');
    // Pixel (15, 15) → tile (0, 0) → still inside everwick (floor division)
    expect(getAreaAtPosition(map, 15, 15)!.id).toBe('everwick');
  });
});

// ── updateVibrancyFromQuests ────────────────────────────────────────────────

describe('updateVibrancyFromQuests', () => {
  it('transitions forgotten → partial when quest is complete', () => {
    const map = createVibrancyMap(testAreas);
    const updated = updateVibrancyFromQuests(map, { 'marsh-expedition': true });
    const marsh = updated.areas.find((a) => a.id === 'shimmer-marsh');
    expect(marsh!.state).toBe('partial');
  });

  it('transitions partial → remembered when quest is complete', () => {
    const map = createVibrancyMap(testAreas);
    const updated = updateVibrancyFromQuests(map, { 'find-the-shepherd': true });
    const heartfield = updated.areas.find((a) => a.id === 'heartfield');
    expect(heartfield!.state).toBe('remembered');
  });

  it('does not change remembered areas', () => {
    const map = createVibrancyMap(testAreas);
    // Even if we pass all quests, everwick stays remembered
    const updated = updateVibrancyFromQuests(map, {
      'find-the-shepherd': true,
      'marsh-expedition': true,
    });
    const everwick = updated.areas.find((a) => a.id === 'everwick');
    expect(everwick!.state).toBe('remembered');
  });

  it('does not change areas when quest is not flagged', () => {
    const map = createVibrancyMap(testAreas);
    const updated = updateVibrancyFromQuests(map, {});
    expect(updated.areas[1].state).toBe('partial');
    expect(updated.areas[2].state).toBe('forgotten');
  });

  it('does not change areas when quest flag is false', () => {
    const map = createVibrancyMap(testAreas);
    const updated = updateVibrancyFromQuests(map, { 'marsh-expedition': false });
    expect(updated.areas[2].state).toBe('forgotten');
  });

  it('returns new object (immutable)', () => {
    const map = createVibrancyMap(testAreas);
    const updated = updateVibrancyFromQuests(map, { 'marsh-expedition': true });
    expect(updated).not.toBe(map);
    expect(updated.areas).not.toBe(map.areas);
  });
});

// ── checkForgottenDamage ────────────────────────────────────────────────────

describe('checkForgottenDamage', () => {
  const forgottenArea = createVibrancyMap(testAreas).areas[2]; // shimmer-marsh, forgotten
  const partialArea = createVibrancyMap(testAreas).areas[1]; // heartfield, partial
  const rememberedArea = createVibrancyMap(testAreas).areas[0]; // everwick, remembered

  it('warns at exactly 2 steps in forgotten area', () => {
    const result = checkForgottenDamage(forgottenArea, 2);
    expect(result.shouldWarn).toBe(true);
    expect(result.shouldDamage).toBe(false);
    expect(result.damageAmount).toBe(0);
  });

  it('does not warn or damage at 1 step in forgotten area', () => {
    const result = checkForgottenDamage(forgottenArea, 1);
    expect(result.shouldWarn).toBe(false);
    expect(result.shouldDamage).toBe(false);
  });

  it('does not warn or damage at 3 steps in forgotten area', () => {
    const result = checkForgottenDamage(forgottenArea, 3);
    expect(result.shouldWarn).toBe(false);
    expect(result.shouldDamage).toBe(false);
  });

  it('damages at 4 steps in forgotten area', () => {
    const result = checkForgottenDamage(forgottenArea, 4);
    expect(result.shouldDamage).toBe(true);
    expect(result.damageAmount).toBe(8); // 5 + (4-3)*3 = 8
    expect(result.shouldWarn).toBe(false);
  });

  it('damage scales with steps beyond 3', () => {
    expect(checkForgottenDamage(forgottenArea, 5).damageAmount).toBe(11); // 5 + 2*3
    expect(checkForgottenDamage(forgottenArea, 6).damageAmount).toBe(14); // 5 + 3*3
    expect(checkForgottenDamage(forgottenArea, 10).damageAmount).toBe(26); // 5 + 7*3
  });

  it('no damage in partial area', () => {
    const result = checkForgottenDamage(partialArea, 10);
    expect(result.shouldDamage).toBe(false);
    expect(result.shouldWarn).toBe(false);
  });

  it('no damage in remembered area', () => {
    const result = checkForgottenDamage(rememberedArea, 10);
    expect(result.shouldDamage).toBe(false);
    expect(result.shouldWarn).toBe(false);
  });

  it('no damage when area is null', () => {
    const result = checkForgottenDamage(null, 10);
    expect(result.shouldDamage).toBe(false);
    expect(result.shouldWarn).toBe(false);
  });
});

// ── serialize / deserialize ─────────────────────────────────────────────────

describe('serializeVibrancyState', () => {
  it('returns areaId → state map', () => {
    const map = createVibrancyMap(testAreas);
    const serialized = serializeVibrancyState(map);
    expect(serialized).toEqual({
      everwick: 'remembered',
      heartfield: 'partial',
      'shimmer-marsh': 'forgotten',
    });
  });

  it('handles empty map', () => {
    const map = createVibrancyMap([]);
    expect(serializeVibrancyState(map)).toEqual({});
  });
});

describe('deserializeVibrancyState', () => {
  it('restores saved state into vibrancy map', () => {
    const map = createVibrancyMap(testAreas);
    const saved = {
      everwick: 'remembered' as const,
      heartfield: 'remembered' as const,
      'shimmer-marsh': 'partial' as const,
    };
    const restored = deserializeVibrancyState(map, saved);
    expect(restored.areas[0].state).toBe('remembered');
    expect(restored.areas[1].state).toBe('remembered');
    expect(restored.areas[2].state).toBe('partial');
  });

  it('keeps current state for areas not in saved data', () => {
    const map = createVibrancyMap(testAreas);
    const saved = { heartfield: 'remembered' as const };
    const restored = deserializeVibrancyState(map, saved);
    expect(restored.areas[0].state).toBe('remembered'); // unchanged
    expect(restored.areas[1].state).toBe('remembered'); // restored
    expect(restored.areas[2].state).toBe('forgotten'); // unchanged
  });

  it('round-trips correctly (serialize then deserialize)', () => {
    const map = createVibrancyMap(testAreas);
    // Advance some states
    const updated = updateVibrancyFromQuests(map, {
      'find-the-shepherd': true,
      'marsh-expedition': true,
    });
    const serialized = serializeVibrancyState(updated);
    // Create fresh map and restore
    const freshMap = createVibrancyMap(testAreas);
    const restored = deserializeVibrancyState(freshMap, serialized);
    expect(restored.areas[0].state).toBe('remembered');
    expect(restored.areas[1].state).toBe('remembered');
    expect(restored.areas[2].state).toBe('partial');
  });

  it('returns new object (immutable)', () => {
    const map = createVibrancyMap(testAreas);
    const restored = deserializeVibrancyState(map, {});
    expect(restored).not.toBe(map);
  });
});

