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

export function kinesisDormant(cx: number, cy: number) {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return null;
  const gfx = new Graphics();
  gfx.zIndex = 7000;
  scene.viewport.addChild(gfx);
  const iv = setInterval(() => {
    gfx.clear();
    const t = Date.now() / 1000;
    const sh = Math.sin(t * 30) * 1.5;
    gfx.beginFill(0x888888, 0.4);
    gfx.drawRect(cx - 12 + sh, cy - 64, 24, 64);
    gfx.endFill();
    for (let i = 0; i < 3; i++) {
      const a = t * 0.8 + (i / 3) * Math.PI * 2;
      gfx.beginFill(0x999999, 0.6);
      gfx.drawCircle(cx + Math.cos(a) * 30, cy - 70 + Math.sin(a) * 10, 3);
      gfx.endFill();
    }
  }, 50);
  const sv = setInterval(() => screenShake(1, 100), 3000);
  return {
    cleanup: () => {
      clearInterval(iv);
      clearInterval(sv);
      gfx.removeFromParent();
      gfx.destroy();
    },
  };
}

export function kinesisRecall(cx: number, cy: number, emotion: Emo): Promise<void> {
  const c: Record<Emo, number> = { joy: 0xdaa520, fury: 0xff6633, sorrow: 0x8899aa, awe: 0xaaddff };
  return playCinematic({
    duration: 15000,
    steps: [
      { at: 0, action: () => P(cx, cy, s(c[emotion], 20, 20, 3)) },
      {
        at: 3000,
        action: () => ({ joy: joyK, fury: furyK, sorrow: sorrowK, awe: aweK })[emotion](cx, cy),
      },
      { at: 7000, action: () => P(cx, cy, s(c[emotion], 35, 12, 4, -5, 3)) },
      { at: 11000, action: () => flashBrightness('viewport', 2000, 1.6) },
      { at: 14000, action: () => P(cx, cy, s(c[emotion], 15, 18, 2)) },
    ],
  });
}

function joyK(cx: number, cy: number) {
  let step = 0;
  const iv = setInterval(() => {
    step++;
    const x = cx + Math.sin(step * 0.3) * 40,
      y = cy - 50 - step * 3;
    P(x, y, s(0xdaa520, 3, 30, 0.8, 0, 2));
    P(x, y, s(0xdaa520, 1, 0, 1.5, 0, 4));
    if (step > 20) clearInterval(iv);
  }, 150);
}

function furyK(cx: number, cy: number) {
  screenShake(8, 4000);
  for (let i = 0; i < 6; i++)
    setTimeout(() => {
      const a = (i / 6) * Math.PI * 2;
      P(cx + Math.cos(a) * 15, cy + Math.sin(a) * 15, s(0xff6633, 10, 50, 0.8, 60, 2.5));
      screenOverlay(0xff6633, 0.1, 200);
    }, i * 400);
  const g = new ColorMatrixFilter();
  g.brightness(1.15, false);
  addFilter('viewport', g);
  setTimeout(() => removeFilter('viewport', g), 5000);
}

function sorrowK(cx: number, cy: number) {
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    let st = 0;
    const iv = setInterval(() => {
      st++;
      P(
        cx + Math.cos(a) * (30 + st * 5),
        cy - 70 + Math.sin(a) * (10 + st * 3),
        s(0xdaa520, 1, 2, 3),
      );
      if (st > 15) clearInterval(iv);
    }, 200);
  }
  setTimeout(() => P(cx, cy - 40, s(0x8899aa, 25, 5, 5, -2, 2.5, 8)), 3000);
}

function aweK(cx: number, cy: number) {
  screenShake(3, 3000);
  let sp = 15;
  const iv = setInterval(() => {
    sp += 5;
    const a = Math.random() * Math.PI * 2;
    P(cx + Math.cos(a) * 25, cy - 60 + Math.sin(a) * 8, s(0xaaddff, 3, sp, 1, 0, 2));
  }, 200);
  setTimeout(() => clearInterval(iv), 5000);
  setTimeout(() => {
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      P(cx + Math.cos(a) * 15, cy - 50 + Math.sin(a) * 25, s(0xaaddff, 1, 3, 4, 0, 1.5, 10));
    }
  }, 4000);
}

export const POST_RECALL_CONFIGS: Record<
  string,
  { color: number; gravity: number; drift: number; count: number }
> = {
  cantara: { color: 0xffd700, gravity: -8, drift: 5, count: 3 },
  tempestus: { color: 0x6644aa, gravity: -15, drift: 0, count: 5 },
  tacet: { color: 0x7b68ee, gravity: -3, drift: 3, count: 1 },
  harmonia: { color: 0xff99cc, gravity: -5, drift: 8, count: 3 },
  floriana: { color: 0xffaacc, gravity: -5, drift: 4, count: 4 },
  thornweald: { color: 0x885522, gravity: 5, drift: 2, count: 3 },
  autumnus: { color: 0xcc8833, gravity: 12, drift: 10, count: 5 },
  sylvanos: { color: 0x44ddaa, gravity: 2, drift: 6, count: 3 },
  solara: { color: 0xffd700, gravity: -10, drift: 3, count: 4 },
  pyralis: { color: 0xffffff, gravity: -5, drift: 0, count: 3 },
  vesperis: { color: 0xffdd44, gravity: -3, drift: 10, count: 3 },
  prisma: { color: 0xff88ff, gravity: -5, drift: 12, count: 4 },
  jubila: { color: 0xdaa520, gravity: 0, drift: 5, count: 3 },
  tecton: { color: 0xff6633, gravity: 15, drift: 0, count: 3 },
  errantis: { color: 0xdaa520, gravity: 0, drift: 3, count: 2 },
  vortis: { color: 0xaaddff, gravity: 0, drift: 15, count: 4 },
};

export function spawnPostRecallAmbient(godForm: string, x: number, y: number) {
  const cfg = POST_RECALL_CONFIGS[godForm];
  if (!cfg) return;
  P(x, y, s(cfg.color, cfg.count, 10, 3, cfg.gravity, 2, cfg.drift));
}
