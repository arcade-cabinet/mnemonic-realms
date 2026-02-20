import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import { ColorMatrixFilter, Graphics } from 'pixi.js';
import { playCinematic, screenShake, tweenValue } from './cinematic-sequencer';
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

export function luminosDormant(cx: number, cy: number) {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return null;
  const gfx = new Graphics();
  gfx.zIndex = 7000;
  scene.viewport.addChild(gfx);
  const iv = setInterval(() => {
    gfx.clear();
    const t = Date.now() / 1000;
    const w = 12 + Math.sin(t * 2) * 3;
    gfx.beginFill(0xffffff, 0.25);
    gfx.drawRect(cx - w / 2, cy - 80, w, 100);
    gfx.endFill();
    for (let i = 0; i < 3; i++) {
      const a = t * 1.5 + (i / 3) * Math.PI * 2;
      gfx.lineStyle(2, 0xffffff, 0.5);
      gfx.moveTo(cx, cy - 30);
      gfx.lineTo(cx + Math.cos(a) * 8, cy - 30 + Math.sin(a) * 8);
    }
    [0xff0000, 0xff8800, 0xffff00, 0x00ff00, 0x0088ff, 0x8800ff].forEach((c, i) => {
      const ra = t * 1.5 + i * 0.3;
      gfx.lineStyle(1, c, 0.2);
      gfx.moveTo(cx, cy - 30);
      gfx.lineTo(cx + Math.cos(ra) * 50, cy - 30 + Math.sin(ra) * 30);
    });
  }, 50);
  return {
    cleanup: () => {
      clearInterval(iv);
      gfx.removeFromParent();
      gfx.destroy();
    },
  };
}

export function luminosRecall(cx: number, cy: number, emotion: Emo): Promise<void> {
  const c: Record<Emo, number> = { joy: 0xffd700, fury: 0xffffff, sorrow: 0xffaa44, awe: 0xff99cc };
  return playCinematic({
    duration: 15000,
    steps: [
      { at: 0, action: () => P(cx, cy, s(0xffffff, 20, 15, 3, -10, 2.5)) },
      {
        at: 3000,
        action: () => ({ joy: joyL, fury: furyL, sorrow: sorrowL, awe: aweL })[emotion](cx, cy),
      },
      { at: 7000, action: () => P(cx, cy, s(c[emotion], 35, 10, 4, -5, 3)) },
      { at: 11000, action: () => flashBrightness('viewport', 2000, 1.8) },
      { at: 14000, action: () => P(cx, cy, s(c[emotion], 15, 20, 2, -8)) },
    ],
  });
}

function joyL(cx: number, cy: number) {
  screenOverlay(0x000000, 0.4, 1000);
  setTimeout(() => {
    P(cx, cy, s(0xffd700, 60, 50, 2, -10, 3.5));
    flashBrightness('viewport', 1500, 2.2);
    const w = new ColorMatrixFilter();
    w.saturate(0.3, false);
    w.brightness(1.08, false);
    addFilter('viewport', w);
    setTimeout(() => removeFilter('viewport', w), 8000);
  }, 1000);
}

function furyL(cx: number, cy: number) {
  screenShake(4, 3000);
  for (let i = 0; i < 8; i++)
    setTimeout(() => {
      const a = (i / 8) * Math.PI * 2;
      P(cx + Math.cos(a) * 5, cy + Math.sin(a) * 5, s(0xffffff, 8, 80, 0.4, 0, 1.5));
    }, i * 250);
  const h = new ColorMatrixFilter();
  h.brightness(1.3, false);
  h.contrast(1.3, false);
  addFilter('viewport', h);
  setTimeout(() => removeFilter('viewport', h), 6000);
}

function sorrowL(cx: number, cy: number) {
  const f = new ColorMatrixFilter();
  addFilter('viewport', f);
  tweenValue(0, 1, 4000, (t) => {
    f.reset();
    f.saturate(-0.2 + t * 0.1, false);
    f.brightness(1 - t * 0.1, false);
  });
  const iv = setInterval(() => {
    const x = cx + (Math.random() - 0.5) * 120,
      y = cy + (Math.random() - 0.5) * 80;
    P(x, y, s(0xffdd44, 1, 5, 3, -3, 1.5, 10));
  }, 300);
  setTimeout(() => {
    clearInterval(iv);
    removeFilter('viewport', f);
  }, 8000);
}

function aweL(cx: number, cy: number) {
  P(cx, cy, s(0xffffff, 20, 40, 1, 0, 2));
  const colors = [0xff0000, 0xff8800, 0xffff00, 0x00ff00, 0x0088ff, 0x8800ff];
  for (let i = 0; i < colors.length; i++) {
    const c = colors[i];
    setTimeout(() => P(cx, cy, s(c, 12, 18, 4, -5, 2.5, 15)), i * 400);
  }
}
