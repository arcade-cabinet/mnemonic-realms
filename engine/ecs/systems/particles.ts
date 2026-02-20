/**
 * Memory Mote Particle System — Pure logic for particle pool management.
 *
 * Particles are managed as typed arrays (NOT ECS entities) for performance.
 * Pool is bounded — NEVER allocate during gameplay. Recycle dead particles.
 * No GC pressure — all arrays are pre-allocated.
 *
 * Mote types per vibrancy state:
 * - forgotten → none (no particles)
 * - partial → wisp (ghostly wisps, invitation)
 * - remembered → sparkle (golden memory sparkles)
 */

import { TILE_SIZE } from '../../renderer/types.js';
import type { VibrancyArea, VibrancyState } from './vibrancy.js';

// ── Types ───────────────────────────────────────────────────────────────────

/** Visual style of a memory mote particle. */
export type MoteType = 'wisp' | 'sparkle' | 'none';

/** Mote type encoded as Uint8 for the typed array. */
const MOTE_NONE = 0;
const MOTE_WISP = 1;
const MOTE_SPARKLE = 2;

/**
 * SoA (struct-of-arrays) particle pool for cache-friendly iteration.
 * All arrays are pre-allocated; particles are recycled in-place.
 */
export interface ParticlePool {
  /** Position X in pixels */
  x: Float32Array;
  /** Position Y in pixels */
  y: Float32Array;
  /** Velocity X (pixels/frame) */
  vx: Float32Array;
  /** Velocity Y (pixels/frame) */
  vy: Float32Array;
  /** Remaining life (frames) */
  life: Float32Array;
  /** Total lifetime for alpha calc */
  maxLife: Float32Array;
  /** 0=none, 1=wisp, 2=sparkle */
  type: Uint8Array;
  /** 0=dead, 1=alive */
  active: Uint8Array;
  /** Max particles in pool */
  poolSize: number;
  /** Current active particle count */
  activeCount: number;
}

// ── Pool Creation ───────────────────────────────────────────────────────────

/**
 * Allocate a particle pool. All particles start dead.
 */
export function createParticlePool(maxParticles: number): ParticlePool {
  return {
    x: new Float32Array(maxParticles),
    y: new Float32Array(maxParticles),
    vx: new Float32Array(maxParticles),
    vy: new Float32Array(maxParticles),
    life: new Float32Array(maxParticles),
    maxLife: new Float32Array(maxParticles),
    type: new Uint8Array(maxParticles),
    active: new Uint8Array(maxParticles),
    poolSize: maxParticles,
    activeCount: 0,
  };
}

// ── Mote Type Mapping ───────────────────────────────────────────────────────

/**
 * Determine the mote visual type for a given vibrancy state.
 */
export function getMoteTypeForArea(state: VibrancyState): MoteType {
  switch (state) {
    case 'forgotten':
      return 'none';
    case 'partial':
      return 'wisp';
    case 'remembered':
      return 'sparkle';
  }
}

// ── Spawning ────────────────────────────────────────────────────────────────

/**
 * Spawn a single mote particle at the given pixel position.
 * Finds a dead slot and recycles it. No-op if pool is full.
 */
export function spawnMote(pool: ParticlePool, x: number, y: number, moteType: MoteType): void {
  if (moteType === 'none') return;
  if (pool.activeCount >= pool.poolSize) return;

  // Find a dead particle slot
  for (let i = 0; i < pool.poolSize; i++) {
    if (pool.active[i] === 0) {
      pool.active[i] = 1;
      pool.x[i] = x;
      pool.y[i] = y;

      if (moteType === 'wisp') {
        // Wisps: slow float upward, slight horizontal drift, 60-120 frame life
        pool.type[i] = MOTE_WISP;
        pool.vx[i] = (Math.random() - 0.5) * 0.3;
        pool.vy[i] = -(0.2 + Math.random() * 0.3);
        pool.life[i] = 60 + Math.random() * 60;
        pool.maxLife[i] = pool.life[i];
      } else {
        // Sparkles: quick burst, random direction, 20-40 frame life
        pool.type[i] = MOTE_SPARKLE;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.5;
        pool.vx[i] = Math.cos(angle) * speed;
        pool.vy[i] = Math.sin(angle) * speed;
        pool.life[i] = 20 + Math.random() * 20;
        pool.maxLife[i] = pool.life[i];
      }

      pool.activeCount++;
      return;
    }
  }
}

// ── Update ──────────────────────────────────────────────────────────────────

/**
 * Tick all active particles. Position += velocity, life -= 1.
 * Expired particles are marked dead and recycled in-place.
 */
export function updateParticles(pool: ParticlePool): void {
  for (let i = 0; i < pool.poolSize; i++) {
    if (pool.active[i] === 0) continue;

    pool.x[i] += pool.vx[i];
    pool.y[i] += pool.vy[i];
    pool.life[i] -= 1;

    if (pool.life[i] <= 0) {
      pool.active[i] = 0;
      pool.type[i] = MOTE_NONE;
      pool.activeCount--;
    }
  }
}

// ── Area Spawning ───────────────────────────────────────────────────────────

/**
 * Spawn motes within a vibrancy area based on spawn rate.
 * Converts area tile coords to pixel coords (×TILE_SIZE).
 * Randomizes position within area, calls spawnMote per particle.
 *
 * @param pool - Particle pool to spawn into
 * @param area - Vibrancy area defining bounds and state
 * @param spawnRate - Number of particles to attempt spawning this frame
 */
export function spawnAreaMotes(pool: ParticlePool, area: VibrancyArea, spawnRate: number): void {
  const moteType = getMoteTypeForArea(area.state);
  if (moteType === 'none') return;

  const pixelX = area.x * TILE_SIZE;
  const pixelY = area.y * TILE_SIZE;
  const pixelW = area.width * TILE_SIZE;
  const pixelH = area.height * TILE_SIZE;

  for (let i = 0; i < spawnRate; i++) {
    const x = pixelX + Math.random() * pixelW;
    const y = pixelY + Math.random() * pixelH;
    spawnMote(pool, x, y, moteType);
  }
}

// ── Constants for renderer ──────────────────────────────────────────────────

/** Exported mote type numeric constants for renderer use. */
export const MOTE_TYPE_NONE = MOTE_NONE;
export const MOTE_TYPE_WISP = MOTE_WISP;
export const MOTE_TYPE_SPARKLE = MOTE_SPARKLE;
