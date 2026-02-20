/**
 * Skia particle renderer — renders memory mote particles from a ParticlePool.
 *
 * Wisps: semi-transparent white/blue, size 2-4px
 * Sparkles: bright gold, size 1-3px, flash effect
 * Alpha fades based on remaining life / maxLife.
 *
 * TSX contains ONLY rendering + hooks. All particle logic in particles.ts.
 */

import { Circle, Group, Paint } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { MOTE_TYPE_SPARKLE, MOTE_TYPE_WISP, type ParticlePool } from '../ecs/systems/particles.js';
import type { CameraState } from './types.js';

// ── Props ───────────────────────────────────────────────────────────────────

export interface ParticleRendererProps {
  /** Particle pool to render */
  pool: ParticlePool;
  /** Camera state for world-to-screen positioning */
  camera: CameraState;
}

// ── Colors ──────────────────────────────────────────────────────────────────

/** Wisp: semi-transparent white/blue */
const WISP_COLOR = 'rgba(180, 210, 255, 1)';

/** Sparkle: bright gold */
const SPARKLE_COLOR = 'rgba(255, 215, 80, 1)';

// ── Visible particle data (computed per frame) ─────────────────────────────

interface VisibleParticle {
  id: number;
  screenX: number;
  screenY: number;
  radius: number;
  alpha: number;
  color: string;
}

// ── Visual helpers (extracted to reduce cognitive complexity) ──────────────

function computeWispVisual(
  id: number,
  screenX: number,
  screenY: number,
  lifeRatio: number,
): VisibleParticle {
  return {
    id,
    screenX,
    screenY,
    radius: 2 + lifeRatio * 2,
    alpha: lifeRatio * 0.6,
    color: WISP_COLOR,
  };
}

function computeSparkleVisual(
  id: number,
  screenX: number,
  screenY: number,
  lifeRatio: number,
): VisibleParticle {
  const flash = lifeRatio > 0.7 ? 1.0 : lifeRatio / 0.7;
  return { id, screenX, screenY, radius: 1 + flash * 2, alpha: flash * 0.9, color: SPARKLE_COLOR };
}

function computeMoteVisual(
  id: number,
  screenX: number,
  screenY: number,
  lifeRatio: number,
  moteType: number,
): VisibleParticle | null {
  if (moteType === MOTE_TYPE_WISP) return computeWispVisual(id, screenX, screenY, lifeRatio);
  if (moteType === MOTE_TYPE_SPARKLE) return computeSparkleVisual(id, screenX, screenY, lifeRatio);
  return null;
}

// ── Particle renderer component ─────────────────────────────────────────────

/**
 * Renders active particles from a ParticlePool as Skia circles.
 * Camera-offset for correct screen positioning.
 */
export const ParticleRenderer = React.memo(function ParticleRenderer({
  pool,
  camera,
}: ParticleRendererProps) {
  const particles = useMemo(() => {
    const visible: VisibleParticle[] = [];

    for (let i = 0; i < pool.poolSize; i++) {
      if (pool.active[i] === 0) continue;

      const screenX = pool.x[i] - camera.x;
      const screenY = pool.y[i] - camera.y;

      // Viewport culling — skip particles outside screen
      if (
        screenX < -8 ||
        screenX > camera.viewportWidth + 8 ||
        screenY < -8 ||
        screenY > camera.viewportHeight + 8
      ) {
        continue;
      }

      const lifeRatio = pool.life[i] / pool.maxLife[i];
      const visual = computeMoteVisual(i, screenX, screenY, lifeRatio, pool.type[i]);
      if (visual) visible.push(visual);
    }

    return visible;
  }, [pool, camera]);

  if (particles.length === 0) return null;

  return (
    <Group>
      {particles.map((p) => (
        <Circle key={p.id} cx={p.screenX} cy={p.screenY} r={p.radius}>
          <Paint color={p.color} opacity={p.alpha} />
        </Circle>
      ))}
    </Group>
  );
});
