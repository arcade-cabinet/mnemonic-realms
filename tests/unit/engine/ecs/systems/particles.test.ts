import { describe, expect, it } from 'vitest';
import {
  createParticlePool,
  getMoteTypeForArea,
  spawnAreaMotes,
  spawnMote,
  updateParticles,
} from '../../../../../engine/ecs/systems/particles.js';
import type { VibrancyArea } from '../../../../../engine/ecs/systems/vibrancy.js';
import { TILE_SIZE } from '../../../../../engine/renderer/types.js';

// ── createParticlePool ──────────────────────────────────────────────────────

describe('createParticlePool', () => {
  it('allocates typed arrays with correct size', () => {
    const pool = createParticlePool(100);
    expect(pool.x).toBeInstanceOf(Float32Array);
    expect(pool.y).toBeInstanceOf(Float32Array);
    expect(pool.vx).toBeInstanceOf(Float32Array);
    expect(pool.vy).toBeInstanceOf(Float32Array);
    expect(pool.life).toBeInstanceOf(Float32Array);
    expect(pool.maxLife).toBeInstanceOf(Float32Array);
    expect(pool.type).toBeInstanceOf(Uint8Array);
    expect(pool.active).toBeInstanceOf(Uint8Array);
    expect(pool.x.length).toBe(100);
    expect(pool.poolSize).toBe(100);
  });

  it('starts with all particles dead', () => {
    const pool = createParticlePool(50);
    expect(pool.activeCount).toBe(0);
    for (let i = 0; i < 50; i++) {
      expect(pool.active[i]).toBe(0);
    }
  });
});

// ── spawnMote ───────────────────────────────────────────────────────────────

describe('spawnMote', () => {
  it('activates a dead particle with correct type (wisp)', () => {
    const pool = createParticlePool(10);
    spawnMote(pool, 100, 200, 'wisp');

    expect(pool.activeCount).toBe(1);
    expect(pool.active[0]).toBe(1);
    expect(pool.x[0]).toBe(100);
    expect(pool.y[0]).toBe(200);
    expect(pool.type[0]).toBe(1); // MOTE_WISP
  });

  it('activates a dead particle with correct type (sparkle)', () => {
    const pool = createParticlePool(10);
    spawnMote(pool, 50, 75, 'sparkle');

    expect(pool.activeCount).toBe(1);
    expect(pool.active[0]).toBe(1);
    expect(pool.type[0]).toBe(2); // MOTE_SPARKLE
  });

  it('wisp has upward velocity (negative vy)', () => {
    const pool = createParticlePool(10);
    spawnMote(pool, 0, 0, 'wisp');

    expect(pool.vy[0]).toBeLessThan(0);
    expect(pool.life[0]).toBeGreaterThanOrEqual(60);
    expect(pool.life[0]).toBeLessThanOrEqual(120);
  });

  it('sparkle has life in range 20-40', () => {
    const pool = createParticlePool(10);
    spawnMote(pool, 0, 0, 'sparkle');

    expect(pool.life[0]).toBeGreaterThanOrEqual(20);
    expect(pool.life[0]).toBeLessThanOrEqual(40);
  });

  it('is a no-op when moteType is none', () => {
    const pool = createParticlePool(10);
    spawnMote(pool, 100, 200, 'none');
    expect(pool.activeCount).toBe(0);
  });

  it('is a no-op when pool is full', () => {
    const pool = createParticlePool(2);
    spawnMote(pool, 10, 10, 'wisp');
    spawnMote(pool, 20, 20, 'sparkle');
    expect(pool.activeCount).toBe(2);

    // Pool is full — this should be a no-op
    spawnMote(pool, 30, 30, 'wisp');
    expect(pool.activeCount).toBe(2);
  });
});

// ── updateParticles ─────────────────────────────────────────────────────────

describe('updateParticles', () => {
  it('decrements life and moves position', () => {
    const pool = createParticlePool(10);
    spawnMote(pool, 100, 100, 'wisp');
    const initialLife = pool.life[0];
    const initialX = pool.x[0];
    const vx = pool.vx[0];

    updateParticles(pool);

    expect(pool.life[0]).toBe(initialLife - 1);
    expect(pool.x[0]).toBeCloseTo(initialX + vx, 5);
  });

  it('marks expired particles as dead', () => {
    const pool = createParticlePool(10);
    spawnMote(pool, 0, 0, 'sparkle');
    expect(pool.activeCount).toBe(1);

    // Force life to 1 so next update kills it
    pool.life[0] = 1;
    updateParticles(pool);

    expect(pool.active[0]).toBe(0);
    expect(pool.activeCount).toBe(0);
  });

  it('does not touch dead particles', () => {
    const pool = createParticlePool(10);
    // All dead — should be a no-op
    updateParticles(pool);
    expect(pool.activeCount).toBe(0);
  });
});

// ── getMoteTypeForArea ──────────────────────────────────────────────────────

describe('getMoteTypeForArea', () => {
  it('returns none for forgotten', () => {
    expect(getMoteTypeForArea('forgotten')).toBe('none');
  });

  it('returns wisp for partial', () => {
    expect(getMoteTypeForArea('partial')).toBe('wisp');
  });

  it('returns sparkle for remembered', () => {
    expect(getMoteTypeForArea('remembered')).toBe('sparkle');
  });
});

// ── spawnAreaMotes ──────────────────────────────────────────────────────────

describe('spawnAreaMotes', () => {
  const partialArea: VibrancyArea = {
    id: 'heartfield',
    x: 10,
    y: 5,
    width: 20,
    height: 15,
    state: 'partial',
  };

  const forgottenArea: VibrancyArea = {
    id: 'shimmer-marsh',
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    state: 'forgotten',
  };

  it('spawns particles within area bounds (pixel coords)', () => {
    const pool = createParticlePool(100);
    spawnAreaMotes(pool, partialArea, 10);

    expect(pool.activeCount).toBe(10);

    const minX = partialArea.x * TILE_SIZE;
    const maxX = (partialArea.x + partialArea.width) * TILE_SIZE;
    const minY = partialArea.y * TILE_SIZE;
    const maxY = (partialArea.y + partialArea.height) * TILE_SIZE;

    for (let i = 0; i < pool.poolSize; i++) {
      if (pool.active[i] === 0) continue;
      expect(pool.x[i]).toBeGreaterThanOrEqual(minX);
      expect(pool.x[i]).toBeLessThan(maxX);
      expect(pool.y[i]).toBeGreaterThanOrEqual(minY);
      expect(pool.y[i]).toBeLessThan(maxY);
    }
  });

  it('does not spawn for forgotten areas', () => {
    const pool = createParticlePool(100);
    spawnAreaMotes(pool, forgottenArea, 10);
    expect(pool.activeCount).toBe(0);
  });

  it('spawns wisps for partial area', () => {
    const pool = createParticlePool(10);
    spawnAreaMotes(pool, partialArea, 1);
    expect(pool.type[0]).toBe(1); // MOTE_WISP
  });

  it('spawns sparkles for remembered area', () => {
    const rememberedArea: VibrancyArea = {
      ...partialArea,
      state: 'remembered',
    };
    const pool = createParticlePool(10);
    spawnAreaMotes(pool, rememberedArea, 1);
    expect(pool.type[0]).toBe(2); // MOTE_SPARKLE
  });
});

// ── Particle recycling ──────────────────────────────────────────────────────

describe('particle recycling', () => {
  it('reuses dead particle slots on re-spawn', () => {
    const pool = createParticlePool(2);

    // Spawn and fill pool
    spawnMote(pool, 10, 10, 'wisp');
    spawnMote(pool, 20, 20, 'sparkle');
    expect(pool.activeCount).toBe(2);

    // Kill first particle
    pool.life[0] = 1;
    updateParticles(pool);
    expect(pool.activeCount).toBe(1);
    expect(pool.active[0]).toBe(0);

    // Re-spawn into slot 0
    spawnMote(pool, 50, 50, 'wisp');
    expect(pool.activeCount).toBe(2);
    expect(pool.active[0]).toBe(1);
    expect(pool.x[0]).toBe(50);
    expect(pool.y[0]).toBe(50);
  });

  it('full lifecycle: spawn → expire → re-spawn', () => {
    const pool = createParticlePool(1);

    // Spawn
    spawnMote(pool, 0, 0, 'sparkle');
    expect(pool.activeCount).toBe(1);

    // Run until expired
    pool.life[0] = 1;
    updateParticles(pool);
    expect(pool.activeCount).toBe(0);

    // Re-spawn at same index
    spawnMote(pool, 99, 99, 'wisp');
    expect(pool.activeCount).toBe(1);
    expect(pool.active[0]).toBe(1);
    expect(pool.x[0]).toBe(99);
    expect(pool.type[0]).toBe(1); // MOTE_WISP
  });
});

