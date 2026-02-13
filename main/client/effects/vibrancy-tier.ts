import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import { ColorMatrixFilter, Graphics } from 'pixi.js';
import { addFilter, flashBrightness, removeFilter } from './filter-manager';
import { spawnParticles } from './particle-engine';
import { expandRadialEffect } from './zone-effects';

let skyBg: Graphics | null = null;

export type VibrancyTier = 'muted' | 'normal' | 'vivid';
let currentFilter: ColorMatrixFilter | null = null;
let currentTier: VibrancyTier = 'normal';
let changeSub: { unsubscribe(): void } | null = null;
let ambientIv: ReturnType<typeof setInterval> | null = null;

function getTier(v: number): VibrancyTier {
  return v <= 33 ? 'muted' : v >= 67 ? 'vivid' : 'normal';
}

export function tierTransitionBloom() {
  flashBrightness('viewport', 2000, 2.0);
}

function applyTierFilter(tier: VibrancyTier) {
  if (currentFilter) removeFilter('viewport', currentFilter);
  if (tier === 'normal') {
    currentFilter = null;
    currentTier = tier;
    return;
  }
  const f = new ColorMatrixFilter();
  if (tier === 'muted') {
    f.saturate(-0.4, false);
    f.brightness(0.92, false);
  } else {
    f.saturate(0.2, false);
    f.brightness(1.04, false);
  }
  currentFilter = f;
  currentTier = tier;
  addFilter('viewport', f);
}

const WAVE_COLORS: Record<string, number> = {
  joy: 0xffd700,
  fury: 0xcd5c5c,
  sorrow: 0x7b68ee,
  awe: 0x66cdaa,
  calm: 0x87ceeb,
};

export function broadcastRadialBloom(x: number, y: number, potency: number, emotion = 'joy') {
  expandRadialEffect(
    x,
    y,
    (3 + potency * 2) * 16,
    1500 + potency * 500,
    WAVE_COLORS[emotion] ?? 0xdaa520,
    0.6,
  );
}

function ambientDensity(v: number) {
  return v <= 20 ? 0 : v <= 40 ? 3 : v <= 60 ? 8 : v <= 80 ? 15 : 25;
}

function spawnAmbient(v: number) {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return;
  const d = ambientDensity(v);
  if (d <= 0) return;
  const c = v > 60 ? 0xdaa520 : v > 40 ? 0xccbb88 : 0x999988;
  for (let i = 0; i < d; i++) {
    const x = scene.viewport.x + Math.random() * 480,
      y = scene.viewport.y + Math.random() * 320;
    spawnParticles(x, y, {
      color: c,
      count: 1,
      speed: 5,
      lifetime: 4,
      gravity: -3,
      size: 1.5,
      fadeOut: true,
      drift: 8,
    });
  }
}

export function applySkyGradient(v: number) {
  const client = inject(RpgClientEngine);
  const colors: [number, number][] = [
    [0, 0xf5f5f0],
    [40, 0xb8d0e8],
    [70, 0xdaa520],
    [100, 0xff99cc],
  ];
  const idx = colors.findIndex(([t]) => t >= v);
  const color = idx >= 0 ? colors[idx][1] : 0xff99cc;
  const stage = client.renderer.stage;
  if (skyBg) skyBg.destroy();
  const bg = new Graphics();
  bg.beginFill(color, 0.3);
  bg.drawRect(0, 0, 2000, 2000);
  bg.endFill();
  bg.zIndex = -1;
  stage.addChildAt(bg, 0);
  skyBg = bg;
}

export function resonanceStoneParticles(x: number, y: number) {
  spawnParticles(x, y - 8, {
    color: 0xdaa520,
    count: 5,
    speed: 15,
    lifetime: 2,
    gravity: -20,
    size: 2,
    fadeOut: true,
  });
}

export function weatherAmbient(v: number) {
  if (v < 50) return;
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return;
  const n = v > 75 ? 10 : 5;
  for (let i = 0; i < n; i++) {
    const x = scene.viewport.x + Math.random() * 480,
      y = scene.viewport.y + Math.random() * 320;
    spawnParticles(x, y, {
      color: 0xffffff,
      count: 1,
      speed: 30,
      lifetime: 2,
      gravity: v > 75 ? 60 : 0,
      size: 1,
      fadeOut: true,
      spread: 0.5,
    });
  }
}

export function initVibrancySystem() {
  const client = inject(RpgClientEngine);
  changeSub?.unsubscribe();
  let lastV = 50;
  changeSub = client.objects.subscribe((objects) => {
    const e = objects[client.playerId];
    if (!e?.paramsChanged) return;
    const v = e.object?.vibrancy ?? e.object?.zoneVibrancy;
    if (typeof v !== 'number') return;
    lastV = v;
    const t = getTier(v);
    if (t !== currentTier) {
      tierTransitionBloom();
      applyTierFilter(t);
    }
    applySkyGradient(v);
  });
  applyTierFilter('normal');
  ambientIv = setInterval(() => spawnAmbient(lastV), 3000);
}

export function setVibrancyTier(t: VibrancyTier) {
  if (t !== currentTier) applyTierFilter(t);
}

export function resetVibrancy() {
  changeSub?.unsubscribe();
  changeSub = null;
  if (ambientIv) {
    clearInterval(ambientIv);
    ambientIv = null;
  }
  if (currentFilter) {
    removeFilter('viewport', currentFilter);
    currentFilter = null;
  }
  currentTier = 'normal';
}
