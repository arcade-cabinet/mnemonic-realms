import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import { Graphics } from 'pixi.js';
import { screenOverlay } from './filter-manager';
import { spawnParticles } from './particle-engine';
import { expandRadialEffect } from './zone-effects';

export const EMOTION_COLORS: Record<string, number> = {
  joy: 0xffd700,
  fury: 0xcd5c5c,
  sorrow: 0x7b68ee,
  awe: 0x66cdaa,
  calm: 0x87ceeb,
};

// E-MEM-01: Fragment Collection Spiral
export function playCollectEffect(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  emotionColor?: number,
) {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return;

  const color = emotionColor ?? 0xdaa520;
  const count = 10;
  const duration = 800;
  const particles: Graphics[] = [];

  for (let i = 0; i < count; i++) {
    const p = new Graphics();
    p.beginFill(color, 0.9);
    p.drawCircle(0, 0, 2 + Math.random() * 1.5);
    p.endFill();
    p.x = sourceX;
    p.y = sourceY;
    p.zIndex = 9999;
    scene.viewport.addChild(p);
    particles.push(p);
  }

  const start = performance.now();
  const offsets = particles.map(() => Math.random() * Math.PI * 2);
  const delays = particles.map((_, i) => (i / count) * 200);

  const animate = () => {
    const elapsed = performance.now() - start;
    let allDone = true;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const local = elapsed - delays[i];
      if (local < 0) {
        allDone = false;
        continue;
      }
      const t = Math.min(local / duration, 1);
      if (t >= 1) {
        if (p.parent) {
          p.removeFromParent();
          p.destroy();
        }
        continue;
      }
      allDone = false;
      const spiralR = (1 - t) * 25;
      const angle = offsets[i] + t * Math.PI * 3;
      const lerp = t * t;
      p.x = sourceX + (targetX - sourceX) * lerp + Math.cos(angle) * spiralR;
      p.y = sourceY + (targetY - sourceY) * lerp + Math.sin(angle) * spiralR;
      p.alpha = 1 - t * 0.5;
      p.scale.set(1 - t * 0.6);
    }
    if (!allDone) requestAnimationFrame(animate);
    else screenOverlay(0xdaa520, 0.15, 150);
  };
  requestAnimationFrame(animate);
}

export function collectTowardPlayer(sourceX: number, sourceY: number, emotion?: string) {
  const client = inject(RpgClientEngine);
  const player = client.player;
  if (!player) return;
  const px = player.position?.x ?? 0;
  const py = player.position?.y ?? 0;
  const color = emotion ? EMOTION_COLORS[emotion] : undefined;
  playCollectEffect(sourceX, sourceY, px, py, color);
}

// E-MEM-02: Fragment Remix Swirl
export function remixSwirl(cx: number, cy: number, inputColors: number[], outputColor: number) {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return;

  const orbs: Graphics[] = inputColors.map((color) => {
    const g = new Graphics();
    g.beginFill(color, 0.9);
    g.drawCircle(0, 0, 5);
    g.endFill();
    g.zIndex = 9999;
    scene.viewport!.addChild(g);
    return g;
  });

  const duration = 1500;
  const start = performance.now();

  const animate = () => {
    const t = Math.min((performance.now() - start) / duration, 1);
    const radius = 30 * (1 - t);
    orbs.forEach((g, i) => {
      const angle = (i / orbs.length) * Math.PI * 2 + t * Math.PI * 4;
      g.x = cx + Math.cos(angle) * radius;
      g.y = cy + Math.sin(angle) * radius;
      g.alpha = 1 - t * 0.3;
      g.scale.set(1 - t * 0.5);
    });
    if (t < 1) requestAnimationFrame(animate);
    else {
      orbs.forEach((g) => {
        g.removeFromParent();
        g.destroy();
      });
      screenOverlay(0xffffff, 0.25, 200);
      spawnParticles(cx, cy, {
        color: outputColor,
        count: 12,
        speed: 40,
        lifetime: 1,
        gravity: -15,
        size: 3,
        fadeOut: true,
      });
    }
  };
  requestAnimationFrame(animate);
}

// E-MEM-03: Broadcast Color Wave (Stagnation-Specific)
export function broadcastStagnationClash(x: number, y: number, radius: number, duration: number) {
  // Amber wave clashing with blue stagnation
  expandRadialEffect(x, y, radius * 0.7, duration * 0.6, 0xdaa520, 0.6);
  setTimeout(() => {
    expandRadialEffect(x, y, radius, duration * 0.4, 0xccddff, 0.4);
    spawnParticles(x, y, {
      color: 0xffffff,
      count: 15,
      speed: 30,
      lifetime: 0.8,
      size: 2,
      fadeOut: true,
    });
  }, duration * 0.5);
}

// E-MEM-04: Memory Fragment Counter Pulse
export function fragmentCounterPulse(element: HTMLElement | null) {
  if (!element) return;
  element.style.transition = 'transform 0.2s ease-out, filter 0.2s ease-out';
  element.style.transform = 'scale(1.15)';
  element.style.filter = 'brightness(1.3)';
  setTimeout(() => {
    element.style.transform = 'scale(1)';
    element.style.filter = 'brightness(1)';
  }, 200);
}
