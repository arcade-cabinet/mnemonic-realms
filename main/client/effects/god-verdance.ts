import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import { Graphics } from 'pixi.js';
import { playCinematic, screenShake } from './cinematic-sequencer';
import { flashBrightness } from './filter-manager';
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

export function verdanceDormant(cx: number, cy: number) {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return null;
  const gfx = new Graphics();
  gfx.zIndex = 7000;
  scene.viewport.addChild(gfx);
  const iv = setInterval(() => {
    gfx.clear();
    const pulse = 0.5 + Math.sin(Date.now() / 800) * 0.3;
    for (let i = 0; i < 5; i++) {
      const ox = (i - 2) * 12;
      gfx.lineStyle(2, 0x33cc33, pulse);
      gfx.moveTo(cx + ox, cy);
      gfx.lineTo(cx + ox + Math.sin(i) * 8, cy - 40 - i * 10);
    }
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      gfx.lineStyle(1.5, 0x33cc33, pulse * 0.6);
      gfx.moveTo(cx, cy + 10);
      gfx.lineTo(cx + Math.cos(a) * 60, cy + 10 + Math.sin(a) * 30);
    }
  }, 60);
  const sv = setInterval(() => {
    const a = Math.random() * Math.PI * 2,
      d = 40 + Math.random() * 30;
    P(cx + Math.cos(a) * d, cy + Math.sin(a) * d, s(0x66dd44, 2, 5, 2, -8, 1.5));
  }, 3000);
  return {
    cleanup: () => {
      clearInterval(iv);
      clearInterval(sv);
      gfx.removeFromParent();
      gfx.destroy();
    },
  };
}

export function verdanceRecall(cx: number, cy: number, emotion: Emo): Promise<void> {
  const c: Record<Emo, number> = { joy: 0x66dd44, fury: 0x885522, sorrow: 0xcc8833, awe: 0x44ddaa };
  return playCinematic({
    duration: 15000,
    steps: [
      { at: 0, action: () => P(cx, cy - 20, s(c[emotion], 25, 10, 3, -10)) },
      {
        at: 3000,
        action: () => ({ joy: joyV, fury: furyV, sorrow: sorrowV, awe: aweV })[emotion](cx, cy),
      },
      { at: 7000, action: () => P(cx, cy, s(c[emotion], 40, 12, 4, -8, 3)) },
      { at: 11000, action: () => flashBrightness('viewport', 2000, 1.6) },
      { at: 14000, action: () => P(cx, cy, s(c[emotion], 20, 15, 2, -5)) },
    ],
  });
}

function joyV(cx: number, cy: number) {
  for (let i = 0; i < 8; i++)
    setTimeout(() => P(cx, cy - i * 15, s(0x66dd44, 10, 30, 2, -20, 2.5)), i * 200);
  setTimeout(() => {
    for (let i = 0; i < 6; i++) {
      const ax = cx + (Math.random() - 0.5) * 120;
      P(ax, cy + (Math.random() - 0.5) * 80, s(0xffaacc, 5, 15, 2.5, -10));
    }
  }, 2000);
}

function furyV(cx: number, cy: number) {
  screenShake(5, 2000);
  for (let i = 0; i < 6; i++)
    setTimeout(() => {
      const a = (i / 6) * Math.PI * 2;
      P(cx + Math.cos(a) * 20, cy + Math.sin(a) * 20, s(0x885522, 8, 60, 0.8, 40, 2));
    }, i * 300);
}

function sorrowV(cx: number, cy: number) {
  const colors = [0xcc8833, 0xdd6622, 0xeeaa44, 0xbb5511];
  const iv = setInterval(() => {
    const c = colors[Math.floor(Math.random() * 4)];
    P(cx + (Math.random() - 0.5) * 100, cy - 50, s(c, 3, 8, 4, 12, 2, 10));
  }, 200);
  setTimeout(() => clearInterval(iv), 8000);
}

function aweV(cx: number, cy: number) {
  const colors = [0x44ddaa, 0x33ccbb, 0x55eebb];
  for (let i = 0; i < colors.length; i++) {
    const c = colors[i];
    setTimeout(() => P(cx, cy + 10, s(c, 15, 8, 4, 3, 2, 6)), i * 500);
  }
}
