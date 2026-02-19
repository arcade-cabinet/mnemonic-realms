import { describe, it, expect, vi } from 'vitest';
import {
  initVibrancy,
  getVibrancy,
  setVibrancy,
  increaseVibrancy,
  getVibrancyTier,
  resolveMapZone,
  DEFAULT_VIBRANCY,
  VIBRANCY_ZONES,
  type VibrancyZone,
} from '../../main/server/systems/vibrancy';

// ---------------------------------------------------------------------------
// Mock RpgPlayer
// ---------------------------------------------------------------------------

function createMockPlayer(vars: Record<string, unknown> = {}) {
  const store = new Map<string, unknown>(Object.entries(vars));
  return {
    getVariable: vi.fn((key: string) => store.get(key)),
    setVariable: vi.fn((key: string, value: unknown) => store.set(key, value)),
    emit: vi.fn(),
    zoneVibrancy: 0,
    zoneBiome: '',
    map: undefined as { id?: string } | undefined,
  } as unknown as import('@rpgjs/server').RpgPlayer;
}

// ---------------------------------------------------------------------------
// initVibrancy
// ---------------------------------------------------------------------------

describe('initVibrancy', () => {
  it('sets all zones to their default values', () => {
    const player = createMockPlayer();
    initVibrancy(player);

    for (const zone of VIBRANCY_ZONES) {
      expect(player.setVariable).toHaveBeenCalledWith(
        `VIBRANCY_${zone}`,
        DEFAULT_VIBRANCY[zone],
      );
    }
  });

  it('initializes everwick to 60', () => {
    const player = createMockPlayer();
    initVibrancy(player);
    expect(player.setVariable).toHaveBeenCalledWith('VIBRANCY_everwick', 60);
  });

  it('initializes fortress to 0', () => {
    const player = createMockPlayer();
    initVibrancy(player);
    expect(player.setVariable).toHaveBeenCalledWith('VIBRANCY_fortress', 0);
  });
});

// ---------------------------------------------------------------------------
// getVibrancy
// ---------------------------------------------------------------------------

describe('getVibrancy', () => {
  it('returns stored value when initialized', () => {
    const player = createMockPlayer({ 'VIBRANCY_everwick': 75 });
    expect(getVibrancy(player, 'everwick')).toBe(75);
  });

  it('falls back to default when not initialized', () => {
    const player = createMockPlayer();
    expect(getVibrancy(player, 'everwick')).toBe(60);
    expect(getVibrancy(player, 'fortress')).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// setVibrancy
// ---------------------------------------------------------------------------

describe('setVibrancy', () => {
  it('sets vibrancy value', () => {
    const player = createMockPlayer();
    setVibrancy(player, 'everwick', 80);
    expect(player.setVariable).toHaveBeenCalledWith('VIBRANCY_everwick', 80);
  });

  it('clamps to max 100', () => {
    const player = createMockPlayer();
    setVibrancy(player, 'everwick', 150);
    expect(player.setVariable).toHaveBeenCalledWith('VIBRANCY_everwick', 100);
  });

  it('clamps to min 0', () => {
    const player = createMockPlayer();
    setVibrancy(player, 'everwick', -10);
    expect(player.setVariable).toHaveBeenCalledWith('VIBRANCY_everwick', 0);
  });

  it('rounds fractional values', () => {
    const player = createMockPlayer();
    setVibrancy(player, 'everwick', 33.7);
    expect(player.setVariable).toHaveBeenCalledWith('VIBRANCY_everwick', 34);
  });
});

// ---------------------------------------------------------------------------
// increaseVibrancy
// ---------------------------------------------------------------------------

describe('increaseVibrancy', () => {
  it('increases from current value and returns new value', () => {
    const player = createMockPlayer({ 'VIBRANCY_heartfield': 55 });
    const result = increaseVibrancy(player, 'heartfield', 10);
    expect(result).toBe(65);
    expect(player.setVariable).toHaveBeenCalledWith('VIBRANCY_heartfield', 65);
  });

  it('caps at 100', () => {
    const player = createMockPlayer({ 'VIBRANCY_heartfield': 95 });
    const result = increaseVibrancy(player, 'heartfield', 20);
    expect(result).toBe(100);
  });

  it('uses default value when not initialized', () => {
    const player = createMockPlayer();
    // heartfield default = 55, +10 = 65
    const result = increaseVibrancy(player, 'heartfield', 10);
    expect(result).toBe(65);
  });
});

// ---------------------------------------------------------------------------
// getVibrancyTier
// ---------------------------------------------------------------------------

describe('getVibrancyTier', () => {
  it('returns muted for 0-33', () => {
    const player = createMockPlayer({ 'VIBRANCY_fortress': 0 });
    expect(getVibrancyTier(player, 'fortress')).toBe('muted');

    const player2 = createMockPlayer({ 'VIBRANCY_fortress': 33 });
    expect(getVibrancyTier(player2, 'fortress')).toBe('muted');
  });

  it('returns normal for 34-66', () => {
    const player = createMockPlayer({ 'VIBRANCY_heartfield': 34 });
    expect(getVibrancyTier(player, 'heartfield')).toBe('normal');

    const player2 = createMockPlayer({ 'VIBRANCY_heartfield': 66 });
    expect(getVibrancyTier(player2, 'heartfield')).toBe('normal');
  });

  it('returns vivid for 67-100', () => {
    const player = createMockPlayer({ 'VIBRANCY_everwick': 67 });
    expect(getVibrancyTier(player, 'everwick')).toBe('vivid');

    const player2 = createMockPlayer({ 'VIBRANCY_everwick': 100 });
    expect(getVibrancyTier(player2, 'everwick')).toBe('vivid');
  });

  it('uses default vibrancy to determine tier', () => {
    const player = createMockPlayer();
    // everwick default = 60 -> normal
    expect(getVibrancyTier(player, 'everwick')).toBe('normal');
    // fortress default = 0 -> muted
    expect(getVibrancyTier(player, 'fortress')).toBe('muted');
  });
});

// ---------------------------------------------------------------------------
// resolveMapZone
// ---------------------------------------------------------------------------

describe('resolveMapZone', () => {
  it('resolves everwick map to zone and biome', () => {
    const info = resolveMapZone('everwick');
    expect(info).toEqual({ zone: 'everwick', biome: 'village' });
  });

  it('resolves depths-l1 to depths-1 dungeon', () => {
    const info = resolveMapZone('depths-l1');
    expect(info).toEqual({ zone: 'depths-1', biome: 'dungeon' });
  });

  it('resolves fortress-f1 to fortress', () => {
    const info = resolveMapZone('fortress-f1');
    expect(info).toEqual({ zone: 'fortress', biome: 'fortress' });
  });

  it('returns undefined for unknown map', () => {
    expect(resolveMapZone('nonexistent-map')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// DEFAULT_VIBRANCY and VIBRANCY_ZONES
// ---------------------------------------------------------------------------

describe('constants', () => {
  it('has 18 zones defined', () => {
    expect(VIBRANCY_ZONES).toHaveLength(18);
  });

  it('all zones have valid default values (0-100)', () => {
    for (const zone of VIBRANCY_ZONES) {
      const v = DEFAULT_VIBRANCY[zone];
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });
});
