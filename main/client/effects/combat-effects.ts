import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import { ColorMatrixFilter, type Container, Text, TextStyle } from 'pixi.js';
import { screenShake } from './cinematic-sequencer';
import { addFilter, removeFilter, screenOverlay } from './filter-manager';
import { spawnParticles } from './particle-engine';

// E-CMB-01: Elemental Attack Particles
const ELEM_COLORS: Record<string, number> = {
  fire: 0xff6633,
  water: 0x3399ff,
  wind: 0x66cc66,
  earth: 0x996633,
  light: 0xffdd44,
  dark: 0x9944cc,
  neutral: 0xcccccc,
};
const ELEM_GRAVITY: Record<string, number> = {
  fire: -60,
  water: 80,
  wind: 0,
  earth: 120,
  light: -40,
  dark: 20,
  neutral: 40,
};

export function elementalHit(x: number, y: number, element: string) {
  spawnParticles(x, y, {
    color: ELEM_COLORS[element] ?? 0xcccccc,
    count: 12,
    speed: 60,
    lifetime: 0.5,
    gravity: ELEM_GRAVITY[element] ?? 40,
    size: 2,
    fadeOut: true,
  });
}

// E-CMB-02: Status Effect Indicators
const STATUS_COLORS: Record<string, number> = {
  poison: 0x33cc33,
  stun: 0xffff00,
  slow: 0x6699ff,
  weakness: 0xcc6633,
  inspired: 0xdaa520,
  stasis: 0xaaccff,
};

const statusIntervals = new WeakMap<Container, Map<string, ReturnType<typeof setInterval>>>();

export function showStatusEffect(sprite: Container, status: string) {
  const color = STATUS_COLORS[status] ?? 0xffffff;
  const interval = setInterval(() => {
    spawnParticles(sprite.x ?? 0, (sprite.y ?? 0) - 12, {
      color,
      count: 2,
      speed: 10,
      lifetime: 1.2,
      gravity: status === 'poison' ? 15 : -10,
      size: 1.5,
      fadeOut: true,
    });
  }, 800);
  let map = statusIntervals.get(sprite);
  if (!map) {
    map = new Map();
    statusIntervals.set(sprite, map);
  }
  map.set(status, interval);
}

export function clearStatusEffect(sprite: Container, status: string) {
  const map = statusIntervals.get(sprite);
  if (map?.has(status)) {
    clearInterval(map.get(status));
    map.delete(status);
  }
}

// E-CMB-03: Healing Bloom
export function healingSparkle(x: number, y: number) {
  spawnParticles(x, y - 8, {
    color: 0x5ccc3c,
    count: 8,
    speed: 40,
    lifetime: 0.8,
    gravity: -30,
    size: 2.5,
    fadeOut: true,
    spread: Math.PI,
  });
}

// E-CMB-04: Critical Hit Flash
export function criticalHitFlash(x: number, y: number, amount: number) {
  screenOverlay(0xffffff, 0.3, 50);
  showDamageNumber(x, y, amount, true);
  screenShake(4, 200);
}

// Screen flash utility
export function screenFlash(duration = 100, color = 0xffffff, alpha = 0.3) {
  screenOverlay(color, alpha, duration);
}

// Damage numbers
export function showDamageNumber(x: number, y: number, amount: number, isCritical = false) {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return;

  const style = new TextStyle({
    fontSize: isCritical ? 20 : 14,
    fontWeight: 'bold',
    fill: isCritical ? '#ff4444' : '#ffffff',
    stroke: '#000000',
    strokeThickness: 3,
    dropShadow: true,
    dropShadowDistance: 1,
  });

  const text = new Text(String(amount), style);
  text.anchor.set(0.5);
  text.x = x + (Math.random() - 0.5) * 10;
  text.y = y;
  text.zIndex = 10001;
  scene.viewport.addChild(text);

  const startY = text.y;
  const duration = 800;
  const start = performance.now();
  const animate = () => {
    const t = Math.min((performance.now() - start) / duration, 1);
    text.y = startY - 30 * t;
    text.alpha = 1 - t * t;
    if (isCritical && t < 0.3) text.x += (Math.random() - 0.5) * 2;
    if (t < 1) requestAnimationFrame(animate);
    else {
      text.removeFromParent();
      text.destroy();
    }
  };
  requestAnimationFrame(animate);
}

// E-CMB-05: Preserver Stasis Attack
export function stasisAttack(fromX: number, fromY: number, toX: number, toY: number) {
  const count = 5;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const t = i / (count - 1);
      const x = fromX + (toX - fromX) * t;
      const y = fromY + (toY - fromY) * t;
      spawnParticles(x, y, {
        color: 0xaaccff,
        count: 3,
        speed: 15,
        lifetime: 0.6,
        size: 2.5,
        fadeOut: true,
      });
    }, i * 100);
  }
  setTimeout(() => screenOverlay(0xaaccff, 0.15, 300), count * 100);
}

// E-CMB-06: Boss Phase Transition
export async function bossPhaseTransition(sprite: Container) {
  await screenOverlay(0x000000, 0.5, 500);
  const start = performance.now();
  const flash = () => {
    const t = (performance.now() - start) % 200;
    sprite.alpha = t < 100 ? 0.3 : 1;
    if (performance.now() - start < 600) requestAnimationFrame(flash);
    else sprite.alpha = 1;
  };
  requestAnimationFrame(flash);
  const filter = new ColorMatrixFilter();
  filter.brightness(1.3, false);
  addFilter(sprite, filter);
  setTimeout(() => removeFilter(sprite, filter), 1000);
}
