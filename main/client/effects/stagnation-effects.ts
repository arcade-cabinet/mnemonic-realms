import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import { ColorMatrixFilter, type Container, Graphics } from 'pixi.js';
import { screenShake } from './cinematic-sequencer';
import { addFilter, removeFilter, tintBlue } from './filter-manager';
import { spawnParticles } from './particle-engine';
import type { ZoneBounds } from './zone-effects';
import { enterStagnationZone, exitStagnationZone } from './zone-effects';

interface FrozenMeta {
  filter: ColorMatrixFilter;
  interval: ReturnType<typeof setInterval>;
}
interface PreserverMeta {
  filter: ColorMatrixFilter;
  interval: ReturnType<typeof setInterval>;
}
const frozenMeta = new WeakMap<Container, FrozenMeta>();
const preserverMeta = new WeakMap<Container, PreserverMeta>();

// E-STAG-01: Stagnation Zone Crystal Overlay
export function applyStagnationOverlay(id: string, bounds: ZoneBounds) {
  enterStagnationZone(id, bounds);
}

export function removeStagnationOverlay(id: string) {
  exitStagnationZone(id);
}

// E-STAG-02: Stagnation Border Shimmer
export function stagnationBorderShimmer(bounds: ZoneBounds) {
  const borderTiles = [
    { x: bounds.x - 16, y: bounds.y, w: 16, h: bounds.height },
    { x: bounds.x + bounds.width, y: bounds.y, w: 16, h: bounds.height },
    { x: bounds.x, y: bounds.y - 16, w: bounds.width, h: 16 },
    { x: bounds.x, y: bounds.y + bounds.height, w: bounds.width, h: 16 },
  ];
  for (const b of borderTiles) {
    for (let i = 0; i < 3; i++) {
      const x = b.x + Math.random() * b.w;
      const y = b.y + Math.random() * b.h;
      spawnParticles(x, y, {
        color: 0xffffff,
        count: 1,
        speed: 5,
        lifetime: 2,
        size: 1,
        fadeOut: true,
      });
    }
  }
}

// E-STAG-03: Stagnation Breaking Animation
export async function stagnationBreaking(cx: number, cy: number, _bounds: ZoneBounds, id: string) {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return;

  // Phase 1: Fracture lines glow gold (0.5s)
  const fractures = new Graphics();
  fractures.zIndex = 9500;
  scene.viewport.addChild(fractures);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    fractures.lineStyle(2, 0xdaa520, 0.8);
    fractures.moveTo(cx, cy);
    fractures.lineTo(cx + Math.cos(angle) * 60, cy + Math.sin(angle) * 60);
  }
  await new Promise((r) => setTimeout(r, 500));

  // Phase 2: Shatter burst (1.0s)
  spawnParticles(cx, cy, {
    color: 0xccddff,
    count: 30,
    speed: 120,
    lifetime: 1,
    gravity: 80,
    size: 3,
    fadeOut: true,
  });
  screenShake(5, 500);
  await new Promise((r) => setTimeout(r, 500));

  fractures.removeFromParent();
  fractures.destroy();

  // Phase 3: Color flood — remove stagnation filter
  removeStagnationOverlay(id);

  // Phase 4: Warm amber mote burst
  spawnParticles(cx, cy, {
    color: 0xdaa520,
    count: 25,
    speed: 50,
    lifetime: 1.5,
    gravity: -20,
    size: 2.5,
    fadeOut: true,
  });
}

// E-STAG-04: Frozen NPC Rendering
export function freezeSprite(sprite: Container) {
  const filter = tintBlue(sprite, 0.85);
  const interval = setInterval(() => {
    spawnParticles(sprite.x ?? 0, sprite.y ?? 0, {
      color: 0xffffff,
      count: 2,
      speed: 8,
      lifetime: 1,
      size: 1,
      fadeOut: true,
    });
  }, 2000);
  frozenMeta.set(sprite, { filter, interval });
}

export function unfreezeSprite(sprite: Container) {
  const meta = frozenMeta.get(sprite);
  if (meta) {
    removeFilter(sprite, meta.filter);
    clearInterval(meta.interval);
    frozenMeta.delete(sprite);
  }
}

// E-STAG-05: Preserver Agent Crystal Aura
export function preserverAura(sprite: Container) {
  const filter = new ColorMatrixFilter();
  filter.saturate(-0.2, false);
  filter.brightness(1.1, false);
  addFilter(sprite, filter);
  const interval = setInterval(() => {
    spawnParticles(sprite.x ?? 0, sprite.y ?? 0, {
      color: 0xaaccff,
      count: 2,
      speed: 12,
      lifetime: 1.5,
      gravity: -5,
      size: 1.5,
      fadeOut: true,
    });
  }, 1500);
  preserverMeta.set(sprite, { filter, interval });
}

export function removePreserverAura(sprite: Container) {
  const meta = preserverMeta.get(sprite);
  if (meta) {
    removeFilter(sprite, meta.filter);
    clearInterval(meta.interval);
    preserverMeta.delete(sprite);
  }
}
