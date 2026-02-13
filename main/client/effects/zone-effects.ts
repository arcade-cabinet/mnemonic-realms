import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import type { Filter } from 'pixi.js';
import { ColorMatrixFilter, Graphics } from 'pixi.js';
import { addFilter, removeFilter } from './filter-manager';
import { suppressParticles } from './particle-engine';

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

export function resetZoneEffects() {
  for (const z of activeZones.values()) z.cleanup();
  activeZones.clear();
  suppressParticles(false);
}
