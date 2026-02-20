import { ColorMatrixFilter } from 'pixi.js';
import { playCinematic, screenShake, tweenValue } from './cinematic-sequencer';
import { addFilter, flashBrightness, removeFilter, screenOverlay } from './filter-manager';
import { spawnParticles, suppressParticles } from './particle-engine';
import { expandRadialEffect } from './zone-effects';

const P = spawnParticles;
const s = (c: number, n: number, sp: number, l: number, g = 0, sz = 2, d = 0) => ({
  color: c,
  count: n,
  speed: sp,
  lifetime: l,
  gravity: g,
  size: sz,
  fadeOut: true,
  drift: d,
});

export function liraFreezingSequence(lx: number, ly: number): Promise<void> {
  return playCinematic({
    duration: 12000,
    steps: [
      {
        at: 0,
        action: () => {
          for (let i = 0; i < 8; i++)
            setTimeout(() => P(lx + i * 5, ly, s(0xdaa520, 3, 15, 1, -5)), i * 200);
        },
      },
      { at: 2000, action: () => suppressParticles(true) },
      { at: 2500, action: () => expandRadialEffect(lx, ly, 150, 1500, 0xaaccff, 0.5) },
      { at: 3000, action: () => screenShake(5, 1500) },
      {
        at: 3500,
        action: () => {
          const d = new ColorMatrixFilter();
          d.saturate(-0.5, false);
          d.brightness(0.85, false);
          addFilter('viewport', d);
          P(lx, ly, s(0xccddff, 20, 8, 3, 0, 2.5));
          setTimeout(() => removeFilter('viewport', d), 5000);
        },
      },
      { at: 6000, action: () => suppressParticles(false) },
      {
        at: 7000,
        action: () => {
          for (let i = 0; i < 5; i++)
            setTimeout(() => {
              screenShake(2, 100);
              P(lx, ly, s(0xccddff, 3, 20, 0.5, 0, 1.5));
            }, i * 500);
        },
      },
    ],
  });
}

export function godRecallVision(god: string): Promise<void> {
  const GOD_COLORS: Record<string, number> = {
    resonance: 0xdda0dd,
    verdance: 0x66dd44,
    luminos: 0xffffff,
    kinesis: 0x999999,
  };
  const c = GOD_COLORS[god] ?? 0xdaa520;
  return playCinematic({
    duration: 8000,
    steps: [
      { at: 0, action: () => screenOverlay(0x000000, 0.6, 500) },
      {
        at: 500,
        action: () => {
          for (let i = 0; i < 5; i++)
            setTimeout(() => P(240, 160, s(c, 8, 10, 3, -5, 2, 8)), i * 800);
        },
      },
      { at: 6000, action: () => flashBrightness('viewport', 1000, 1.5) },
      { at: 7500, action: () => screenOverlay(0x000000, 0.4, 500) },
    ],
  });
}

export function endgameBloom(): Promise<void> {
  return playCinematic({
    duration: 15000,
    steps: [
      { at: 0, action: () => flashBrightness('viewport', 3000, 2.5) },
      { at: 500, action: () => P(240, 160, s(0xffd700, 60, 20, 5, -8, 3, 10)) },
      { at: 3000, action: () => screenShake(2, 3000) },
      { at: 4000, action: () => P(120, 100, s(0x66dd44, 30, 15, 3, -10, 2.5)) },
      {
        at: 7000,
        action: () => {
          const w = new ColorMatrixFilter();
          addFilter('viewport', w);
          tweenValue(0, 1, 5000, (t) => {
            w.reset();
            w.saturate(0.1 + t * 0.3, false);
            w.brightness(1 + t * 0.15, false);
          });
          setTimeout(() => removeFilter('viewport', w), 8000);
        },
      },
      {
        at: 10000,
        action: () => {
          for (let i = 0; i < 10; i++)
            P(Math.random() * 480, Math.random() * 320, s(0xdaa520, 5, 10, 4, -5, 2, 8));
        },
      },
      { at: 14000, action: () => flashBrightness('viewport', 1000, 2.0) },
    ],
  });
}

export function firstMemoryRemix(cx: number, cy: number): Promise<void> {
  return playCinematic({
    duration: 10000,
    steps: [
      { at: 0, action: () => P(cx, cy, s(0xdaa520, 15, 5, 3, 0, 3, 5)) },
      {
        at: 2000,
        action: () => {
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            P(cx + Math.cos(a) * 10, cy + Math.sin(a) * 10, s(0xffd700, 3, 15, 1, 0, 1.5));
          }
        },
      },
      {
        at: 4000,
        action: () => {
          flashBrightness('viewport', 1000, 2.0);
          const rainbowColors = [0xff0000, 0xff8800, 0xffff00, 0x00ff00, 0x0088ff, 0x8800ff];
          for (let i = 0; i < rainbowColors.length; i++) {
            const rc = rainbowColors[i];
            setTimeout(() => P(cx, cy - i * 5, s(rc, 8, 20, 3, -15, 2.5, 10)), i * 200);
          }
        },
      },
      { at: 7000, action: () => P(cx, cy - 30, s(0xffd700, 30, 8, 3, -5, 2, 12)) },
    ],
  });
}

export function curatorGodPulse(emotion: 'joy' | 'fury' | 'sorrow' | 'awe') {
  if (emotion === 'joy') {
    flashBrightness('viewport', 800, 1.4);
    P(240, 160, s(0xffd700, 15, 15, 2, -8));
  } else if (emotion === 'fury') {
    screenShake(4, 600);
    P(240, 160, s(0xccddff, 10, 30, 0.6, 0, 2.5));
  } else if (emotion === 'sorrow') {
    const b = new ColorMatrixFilter();
    b.brightness(0.9, false);
    addFilter('viewport', b);
    setTimeout(() => removeFilter('viewport', b), 2000);
  } else {
    for (const ac of [0xff0000, 0x00ff00, 0x0088ff, 0xff88ff])
      P(240, 160, s(ac, 4, 12, 2, -5, 2, 8));
  }
}

export function creditsWorldGrowth(): { cleanup: () => void } {
  let on = true;
  const tick = () => {
    if (!on) return;
    const x = Math.random() * 480,
      y = 200 + Math.random() * 120;
    P(x, y, s(0xccaa66, 3, 8, 3, -5));
    if (Math.random() < 0.3) P(x, y, s(0x66dd44, 5, 5, 2, -3, 3));
    setTimeout(tick, 500);
  };
  tick();
  return {
    cleanup: () => {
      on = false;
    },
  };
}

export function stagnationExpansion(cx: number, cy: number): Promise<void> {
  return playCinematic({
    duration: 6000,
    steps: [
      { at: 0, action: () => expandRadialEffect(cx, cy, 48, 2000, 0xaaccff, 0.4) },
      { at: 500, action: () => screenShake(3, 2000) },
      { at: 1000, action: () => P(cx, cy, s(0xccddff, 20, 15, 2)) },
      { at: 2000, action: () => expandRadialEffect(cx, cy, 96, 2000, 0xaaccff, 0.5) },
      { at: 3000, action: () => P(cx, cy, s(0xccddff, 30, 20, 2.5, 0, 2.5)) },
      {
        at: 4000,
        action: () => {
          const d = new ColorMatrixFilter();
          d.saturate(-0.4, false);
          d.brightness(0.88, false);
          addFilter('viewport', d);
          setTimeout(() => removeFilter('viewport', d), 3000);
        },
      },
    ],
  });
}
