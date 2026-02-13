import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import { ColorMatrixFilter, Graphics } from 'pixi.js';
import { playCinematic, screenShake } from './cinematic-sequencer';
import { addFilter, flashBrightness, removeFilter, screenOverlay } from './filter-manager';
import { spawnParticles } from './particle-engine';

type Emo = 'joy' | 'fury' | 'sorrow' | 'awe';
const P = spawnParticles;
const s = (c: number, n: number, sp: number, l: number, g = 0, sz = 2, d = 0) => ({
  color: c,
  count: n,
  speed: sp,
  lifetime: l,
  gravity: g,
  size: sz,
  fadeOut: true as const,
  drift: d,
});

export function resonanceDormant(cx: number, cy: number) {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return null;
  const gfx = new Graphics();
  gfx.zIndex = 7000;
  scene.viewport.addChild(gfx);
  const iv = setInterval(() => {
    gfx.clear();
    const t = (Date.now() % 3000) / 3000;
    for (let i = 0; i < 4; i++) {
      const r = 20 + i * 15 + Math.sin(t * Math.PI * 2 + i) * 5;
      gfx.lineStyle(1.5, 0xdda0dd, 0.15 + Math.sin(t * Math.PI * 2 + i * 0.5) * 0.1);
      gfx.drawCircle(cx, cy, r);
    }
  }, 50);
  return {
    cleanup: () => {
      clearInterval(iv);
      gfx.removeFromParent();
      gfx.destroy();
    },
  };
}

export function resonanceRecall(cx: number, cy: number, emotion: Emo): Promise<void> {
  const c: Record<Emo, number> = { joy: 0xffd700, fury: 0x6644aa, sorrow: 0x7b68ee, awe: 0xff99cc };
  return playCinematic({
    duration: 15000,
    steps: [
      { at: 0, action: () => P(cx, cy, s(c[emotion], 20, 15, 3, -5, 2, 10)) },
      {
        at: 3000,
        action: () => ({ joy: joyR, fury: furyR, sorrow: sorrowR, awe: aweR })[emotion](cx, cy),
      },
      { at: 6000, action: () => P(cx, cy, s(c[emotion], 40, 8, 4, -3, 3, 15)) },
      { at: 10000, action: () => flashBrightness('viewport', 1500, 1.5) },
      { at: 13000, action: () => P(cx, cy, s(c[emotion], 15, 20, 2, -10)) },
    ],
  });
}

function joyR(cx: number, cy: number) {
  P(cx, cy, s(0xffd700, 50, 25, 3, -15, 3));
  flashBrightness('viewport', 2000, 1.8);
}

function furyR(cx: number, cy: number) {
  screenShake(6, 2000);
  for (let i = 0; i < 5; i++)
    setTimeout(() => {
      P(cx, cy, s(0x6644aa, 15, 80, 0.5, 0, 2));
      screenOverlay(0xffffff, 0.2, 100);
    }, i * 400);
}

function sorrowR(cx: number, cy: number) {
  const f = new ColorMatrixFilter();
  f.saturate(-0.6, false);
  f.brightness(0.85, false);
  addFilter('viewport', f);
  setTimeout(() => {
    removeFilter('viewport', f);
    P(cx, cy, s(0x7b68ee, 30, 10, 4, -5, 2.5, 8));
  }, 5000);
}

function aweR(cx: number, cy: number) {
  const colors = [0xff0000, 0xff8800, 0xffff00, 0x00ff00, 0x0088ff, 0x8800ff];
  for (let i = 0; i < colors.length; i++) {
    const c = colors[i];
    setTimeout(() => P(cx, cy, s(c, 10, 20, 3, -8, 2, 12)), i * 300);
  }
}
