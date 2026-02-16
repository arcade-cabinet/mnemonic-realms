import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import { Container, Graphics } from 'pixi.js';

export interface ParticleConfig {
  color: number;
  count: number;
  speed: number;
  lifetime: number;
  gravity?: number;
  size?: number;
  fadeOut?: boolean;
  spread?: number;
  rotation?: number;
  drift?: number;
}

interface Particle {
  gfx: Graphics;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  gravity: number;
  fadeOut: boolean;
  drift: number;
}

const pool: Particle[] = [];
const active: Particle[] = [];
let container: Container | null = null;
let tickSub: { unsubscribe(): void } | null = null;
let suppressed = false;

export function getEffectContainer(): Container | null {
  if (container) return container;
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return null;
  container = new Container();
  container.zIndex = 9999;
  scene.viewport.addChild(container);
  return container;
}

function acquire(): Particle {
  // biome-ignore lint/style/noNonNullAssertion: length check guarantees element exists
  if (pool.length) return pool.pop()!;
  return {
    gfx: new Graphics(),
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 0,
    gravity: 0,
    fadeOut: true,
    drift: 0,
  };
}

function release(p: Particle) {
  p.gfx.removeFromParent();
  p.gfx.clear();
  pool.push(p);
}

function ensureTick() {
  if (tickSub) return;
  const client = inject(RpgClientEngine);
  tickSub = client.tick.subscribe(({ deltaTime }) => {
    const dt = deltaTime / 1000;
    for (let i = active.length - 1; i >= 0; i--) {
      const p = active[i];
      p.life -= dt;
      if (p.life <= 0) {
        release(p);
        active.splice(i, 1);
        continue;
      }
      p.vy += p.gravity * dt;
      p.vx += Math.sin(p.life * 3) * p.drift * dt;
      p.gfx.x += p.vx * dt;
      p.gfx.y += p.vy * dt;
      if (p.fadeOut) p.gfx.alpha = Math.max(0, p.life / p.maxLife);
    }
    if (active.length === 0 && tickSub) {
      tickSub.unsubscribe();
      tickSub = null;
    }
  });
}

export function spawnParticles(x: number, y: number, config: ParticleConfig) {
  if (suppressed) return;
  const c = getEffectContainer();
  if (!c) return;
  const {
    color,
    count,
    speed,
    lifetime,
    gravity = 0,
    size = 3,
    fadeOut = true,
    spread = Math.PI * 2,
    drift = 0,
  } = config;

  for (let i = 0; i < Math.min(count, 200); i++) {
    const p = acquire();
    const angle = Math.random() * spread - spread / 2;
    const spd = speed * (0.5 + Math.random() * 0.5);
    p.vx = Math.cos(angle) * spd;
    p.vy = Math.sin(angle) * spd;
    p.life = lifetime * (0.6 + Math.random() * 0.4);
    p.maxLife = p.life;
    p.gravity = gravity;
    p.fadeOut = fadeOut;
    p.drift = drift;
    p.gfx.clear();
    p.gfx.beginFill(color, 0.9);
    p.gfx.drawCircle(0, 0, size);
    p.gfx.endFill();
    p.gfx.x = x;
    p.gfx.y = y;
    p.gfx.alpha = 1;
    c.addChild(p.gfx);
    active.push(p);
  }
  ensureTick();
}

export function suppressParticles(s: boolean) {
  suppressed = s;
}
export function getActiveCount() {
  return active.length;
}

export function resetParticles() {
  for (const p of active) release(p);
  active.length = 0;
  container = null;
  if (tickSub) {
    tickSub.unsubscribe();
    tickSub = null;
  }
}
