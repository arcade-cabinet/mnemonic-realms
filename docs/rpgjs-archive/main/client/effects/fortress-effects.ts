import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import { ColorMatrixFilter, type Container, Graphics } from 'pixi.js';
import { easeOut, tweenValue } from './cinematic-sequencer';
import { addFilter, flashBrightness, removeFilter } from './filter-manager';
import { spawnParticles } from './particle-engine';

// God-emotion to fracture color mapping
const FRACTURE_COLORS: Record<string, number> = {
  'verdance-joy': 0x66dd44,
  'verdance-fury': 0x885522,
  'verdance-sorrow': 0xcc8833,
  'verdance-awe': 0x44ddaa,
  'resonance-joy': 0xffd700,
  'resonance-fury': 0x6644aa,
  'resonance-sorrow': 0x7b68ee,
  'resonance-awe': 0xff99cc,
  'luminos-joy': 0xffd700,
  'luminos-fury': 0xffffff,
  'luminos-sorrow': 0xffaa44,
  'luminos-awe': 0xff88ff,
  'kinesis-joy': 0xdaa520,
  'kinesis-fury': 0xff6633,
  'kinesis-sorrow': 0x8899aa,
  'kinesis-awe': 0xaaddff,
};

// E-FOR-01: God Recall Fractures in Fortress Walls
export function drawFortressFractures(
  wallPositions: Array<{ x: number; y: number }>,
  recalledGods: Array<{ god: string; emotion: string }>,
) {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return null;

  const gfx = new Graphics();
  gfx.zIndex = 6500;

  for (const pos of wallPositions) {
    // Pick a random recalled god's fracture color
    if (recalledGods.length === 0) continue;
    const choice = recalledGods[Math.floor(Math.random() * recalledGods.length)];
    const color = FRACTURE_COLORS[`${choice.god}-${choice.emotion}`] ?? 0xdaa520;

    // Draw crack lines
    const numCracks = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numCracks; i++) {
      gfx.lineStyle(1.5, color, 0.6);
      gfx.moveTo(pos.x, pos.y);
      let cx = pos.x;
      let cy = pos.y;
      for (let j = 0; j < 4; j++) {
        cx += (Math.random() - 0.5) * 12;
        cy += (Math.random() - 0.5) * 12;
        gfx.lineTo(cx, cy);
      }
    }
  }

  scene.viewport.addChild(gfx);
  return {
    cleanup: () => {
      gfx.removeFromParent();
      gfx.destroy();
    },
  };
}

// E-FOR-02: Fortress De-Crystallization (Endgame Bloom)
export async function fortressDecrystallization() {
  // Warm light floods through fractures
  await flashBrightness('viewport', 3000, 2.0);

  // Crystal melting particles
  for (let i = 0; i < 8; i++) {
    const x = 100 + Math.random() * 280;
    const y = 80 + Math.random() * 160;
    spawnParticles(x, y, {
      color: 0xdaa520,
      count: 8,
      speed: 12,
      lifetime: 2,
      gravity: 15,
      size: 2,
      fadeOut: true,
    });
  }

  // Remove blue tint (crystal -> stone transition feel)
  const warm = new ColorMatrixFilter();
  addFilter('viewport', warm);
  await tweenValue(
    0,
    1,
    2000,
    (t) => {
      warm.reset();
      warm.saturate(-0.3 + t * 0.5, false);
      warm.brightness(0.88 + t * 0.18, false);
    },
    easeOut,
  );
  removeFilter('viewport', warm);
}

// E-FOR-03: Gallery Frozen Scenes
export function galleryFrozenTableau(sprites: Container[], position: { x: number; y: number }) {
  const filters: ColorMatrixFilter[] = [];
  const intervals: ReturnType<typeof setInterval>[] = [];

  for (const sprite of sprites) {
    // Blue-tinted grayscale
    const filter = new ColorMatrixFilter();
    filter.saturate(-0.6, false);
    filter.brightness(0.88, false);
    addFilter(sprite, filter);
    filters.push(filter);
  }

  // Enhanced crystal edge sparkle (more frequent than standard frozen NPCs)
  const sparkleInterval = setInterval(() => {
    for (const sprite of sprites) {
      const sx = sprite.x ?? position.x;
      const sy = sprite.y ?? position.y;
      // Sparkle at corners
      spawnParticles(sx + (Math.random() - 0.5) * 16, sy + (Math.random() - 0.5) * 16, {
        color: 0xffffff,
        count: 1,
        speed: 5,
        lifetime: 1.2,
        size: 1,
        fadeOut: true,
      });
    }
  }, 800);
  intervals.push(sparkleInterval);

  return {
    cleanup: () => {
      for (let i = 0; i < filters.length; i++) removeFilter(sprites[i], filters[i]);
      for (const iv of intervals) clearInterval(iv);
    },
    // Unfreeze animation for Endgame Bloom
    unfreeze: () => {
      for (let i = 0; i < filters.length; i++) {
        const f = filters[i];
        const s = sprites[i];
        tweenValue(
          0,
          1,
          1500,
          (t) => {
            f.reset();
            f.saturate(-0.6 + t * 0.6, false);
            f.brightness(0.88 + t * 0.12, false);
          },
          easeOut,
        ).then(() => removeFilter(s, f));
      }
      for (const iv of intervals) clearInterval(iv);
    },
  };
}
