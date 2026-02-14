import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import type { Filter } from 'pixi.js';
import { ColorMatrixFilter, Graphics } from 'pixi.js';
import { addFilter, removeFilter } from './filter-manager';
import { suppressParticles } from './particle-engine';
import type { Biome } from './vibrancy-tier';

export interface ZoneBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ActiveZoneEffect {
  id: string;
  bounds: ZoneBounds;
  filter?: Filter;
  overlay?: Graphics;
  cleanup: () => void;
}

const activeZones: Map<string, ActiveZoneEffect> = new Map();

function isInZone(px: number, py: number, z: ZoneBounds): boolean {
  return px >= z.x && px < z.x + z.width && py >= z.y && py < z.y + z.height;
}

export function applyZoneFilter(id: string, bounds: ZoneBounds, filter: Filter) {
  removeZoneEffect(id);
  addFilter('viewport', filter);
  activeZones.set(id, { id, bounds, filter, cleanup: () => removeFilter('viewport', filter) });
}

export function applyZoneOverlay(id: string, bounds: ZoneBounds, color: number, alpha: number) {
  removeZoneEffect(id);
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return;

  const overlay = new Graphics();
  overlay.beginFill(color, alpha);
  overlay.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
  overlay.endFill();
  overlay.zIndex = 5000;
  scene.viewport.addChild(overlay);

  activeZones.set(id, {
    id,
    bounds,
    overlay,
    cleanup: () => {
      overlay.removeFromParent();
      overlay.destroy();
    },
  });
}

export function removeZoneEffect(id: string) {
  const z = activeZones.get(id);
  if (z) {
    z.cleanup();
    activeZones.delete(id);
  }
}

export function enterStagnationZone(id: string, bounds: ZoneBounds) {
  const filter = new ColorMatrixFilter();
  filter.saturate(-0.5, false);
  filter.brightness(0.88, false);
  applyZoneFilter(`stag-${id}`, bounds, filter);
  applyZoneOverlay(`stag-overlay-${id}`, bounds, 0xccddff, 0.15);
  suppressParticles(true);
}

export function exitStagnationZone(id: string) {
  removeZoneEffect(`stag-${id}`);
  removeZoneEffect(`stag-overlay-${id}`);
  suppressParticles(false);
}

export function expandRadialEffect(
  cx: number,
  cy: number,
  maxRadius: number,
  duration: number,
  color: number,
  alpha: number,
): Promise<void> {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return Promise.resolve();

  const gfx = new Graphics();
  gfx.zIndex = 8000;
  scene.viewport.addChild(gfx);

  return new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      const t = Math.min((performance.now() - start) / duration, 1);
      const r = maxRadius * t;
      gfx.clear();
      gfx.lineStyle(3, color, alpha * (1 - t * 0.5));
      gfx.drawCircle(cx, cy, r);
      if (t < 1) requestAnimationFrame(tick);
      else {
        gfx.removeFromParent();
        gfx.destroy();
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}

export function checkZoneBoundaries(px: number, py: number): string[] {
  const inside: string[] = [];
  for (const [id, zone] of activeZones) {
    if (isInZone(px, py, zone.bounds)) inside.push(id);
  }
  return inside;
}

// ---------------------------------------------------------------------------
// Per-biome atmospheric effects
// ---------------------------------------------------------------------------

const BIOME_EFFECT_ID = 'biome-atmo';
const BIOME_OVERLAY_ID = 'biome-overlay';

/**
 * Per-biome atmospheric overlay and filter config.
 * Each biome gets a distinct visual mood that scales with vibrancy.
 */
interface BiomeAtmoCfg {
  /** Overlay color applied to the full viewport. */
  overlayColor: number;
  /** Overlay alpha at muted / normal / vivid tiers. */
  alpha: [number, number, number];
  /** Optional ColorMatrixFilter tweaks (saturation delta, brightness). */
  filter?: { saturate: number; brightness: number };
}

const BIOME_ATMO: Partial<Record<Biome, BiomeAtmoCfg>> = {
  forest: {
    overlayColor: 0x224400,
    alpha: [0.08, 0.04, 0.0],
    filter: { saturate: 0.05, brightness: 0.98 },
  },
  wetland: {
    overlayColor: 0x88aacc,
    alpha: [0.12, 0.08, 0.03],
    filter: { saturate: -0.1, brightness: 0.95 },
  },
  mountain: {
    overlayColor: 0xccddff,
    alpha: [0.06, 0.03, 0.0],
    filter: { saturate: -0.05, brightness: 1.0 },
  },
  dungeon: {
    overlayColor: 0x110800,
    alpha: [0.15, 0.1, 0.05],
    filter: { saturate: -0.15, brightness: 0.9 },
  },
  sketch: {
    overlayColor: 0xffffff,
    alpha: [0.2, 0.1, 0.03],
    filter: { saturate: -0.3, brightness: 1.08 },
  },
  fortress: {
    overlayColor: 0xaabbdd,
    alpha: [0.18, 0.15, 0.1],
    filter: { saturate: -0.4, brightness: 0.88 },
  },
  riverside: {
    overlayColor: 0x224488,
    alpha: [0.05, 0.02, 0.0],
  },
  plains: {
    overlayColor: 0xeedd88,
    alpha: [0.0, 0.02, 0.04],
  },
};

function vibrancyTierIndex(v: number): 0 | 1 | 2 {
  return v <= 33 ? 0 : v >= 67 ? 2 : 1;
}

/**
 * Apply per-biome atmospheric effects (overlay tint + optional filter).
 * Called from initVibrancySystem when the zone changes or vibrancy updates.
 */
export function applyBiomeAtmosphere(biome: Biome, vibrancy: number): void {
  // Clean up previous biome effects
  removeZoneEffect(BIOME_EFFECT_ID);
  removeZoneEffect(BIOME_OVERLAY_ID);

  const cfg = BIOME_ATMO[biome];
  if (!cfg) return;

  const tierIdx = vibrancyTierIndex(vibrancy);
  const alpha = cfg.alpha[tierIdx];

  // Apply overlay tint if non-zero
  if (alpha > 0) {
    const client = inject(RpgClientEngine);
    const scene = client.getScene<RpgSceneMap>();
    if (scene?.viewport) {
      const overlay = new Graphics();
      overlay.beginFill(cfg.overlayColor, alpha);
      overlay.drawRect(0, 0, 2000, 2000);
      overlay.endFill();
      overlay.zIndex = 4000;
      scene.viewport.addChild(overlay);
      activeZones.set(BIOME_OVERLAY_ID, {
        id: BIOME_OVERLAY_ID,
        bounds: { x: 0, y: 0, width: 2000, height: 2000 },
        overlay,
        cleanup: () => {
          overlay.removeFromParent();
          overlay.destroy();
        },
      });
    }
  }

  // Apply biome-specific color filter
  if (cfg.filter) {
    const f = new ColorMatrixFilter();
    f.saturate(cfg.filter.saturate, false);
    f.brightness(cfg.filter.brightness, false);
    addFilter('viewport', f);
    activeZones.set(BIOME_EFFECT_ID, {
      id: BIOME_EFFECT_ID,
      bounds: { x: 0, y: 0, width: 2000, height: 2000 },
      filter: f,
      cleanup: () => removeFilter('viewport', f),
    });
  }
}

export function resetZoneEffects() {
  for (const z of activeZones.values()) z.cleanup();
  activeZones.clear();
  suppressParticles(false);
}
