import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import type { DisplayObject, Filter } from 'pixi.js';
import { BlurFilter, ColorMatrixFilter, Graphics } from 'pixi.js';

export type FilterTarget = 'viewport' | 'stage' | DisplayObject;

function resolveTarget(target: FilterTarget): DisplayObject | null {
  if (typeof target !== 'string') return target;
  const client = inject(RpgClientEngine);
  if (target === 'stage') return client.renderer.stage;
  const scene = client.getScene<RpgSceneMap>();
  return scene?.viewport ?? null;
}

export function addFilter(target: FilterTarget, filter: Filter) {
  const obj = resolveTarget(target);
  if (!obj) return;
  if (!obj.filters) obj.filters = [filter];
  else (obj.filters as Filter[]).push(filter);
}

export function removeFilter(target: FilterTarget, filter: Filter) {
  const obj = resolveTarget(target);
  if (!obj?.filters) return;
  const arr = obj.filters as Filter[];
  const idx = arr.indexOf(filter);
  if (idx >= 0) arr.splice(idx, 1);
}

export function animateFilter(
  target: FilterTarget,
  filter: Filter,
  duration: number,
  update: (t: number, filter: Filter) => void,
): Promise<void> {
  return new Promise((resolve) => {
    addFilter(target, filter);
    const start = performance.now();
    const tick = () => {
      const t = Math.min((performance.now() - start) / duration, 1);
      update(t, filter);
      if (t < 1) requestAnimationFrame(tick);
      else {
        removeFilter(target, filter);
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}

export function flashBrightness(target: FilterTarget, duration: number, peak = 2.0): Promise<void> {
  const filter = new ColorMatrixFilter();
  return animateFilter(target, filter, duration, (t) => {
    const b = t < 0.5 ? 1 + (peak - 1) * (t * 2) : 1 + (peak - 1) * (1 - (t - 0.5) * 2);
    filter.brightness(b, false);
  });
}

export function desaturate(target: FilterTarget, amount = -0.4): ColorMatrixFilter {
  const filter = new ColorMatrixFilter();
  filter.saturate(amount, false);
  addFilter(target, filter);
  return filter;
}

export function tintBlue(target: FilterTarget, amount = 0.92): ColorMatrixFilter {
  const filter = new ColorMatrixFilter();
  filter.saturate(-0.5, false);
  filter.brightness(amount, false);
  addFilter(target, filter);
  return filter;
}

export function warmTint(target: FilterTarget): ColorMatrixFilter {
  const filter = new ColorMatrixFilter();
  filter.saturate(0.2, false);
  filter.brightness(1.04, false);
  addFilter(target, filter);
  return filter;
}

export function blurEffect(target: FilterTarget, strength = 4): BlurFilter {
  const blur = new BlurFilter(strength);
  addFilter(target, blur);
  return blur;
}

export function screenOverlay(color: number, alpha: number, duration: number): Promise<void> {
  const client = inject(RpgClientEngine);
  const overlay = new Graphics();
  overlay.beginFill(color, alpha);
  overlay.drawRect(0, 0, 2000, 2000);
  overlay.endFill();
  overlay.zIndex = 10000;
  client.renderer.stage.addChild(overlay);

  return new Promise((resolve) => {
    const start = performance.now();
    const fade = () => {
      const t = Math.min((performance.now() - start) / duration, 1);
      overlay.alpha = alpha * (1 - t);
      if (t < 1) requestAnimationFrame(fade);
      else {
        overlay.removeFromParent();
        overlay.destroy();
        resolve();
      }
    };
    requestAnimationFrame(fade);
  });
}
