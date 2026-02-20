import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import { Graphics } from 'pixi.js';
import { spawnParticles } from './particle-engine';

// E-SKT-01: Sketch Rendering Style — alpha oscillation for partially solidified tiles
export function sketchFlicker(tileSprite: { alpha: number } | null) {
  if (!tileSprite) return null;
  const interval = setInterval(() => {
    const t = Date.now() / 1500;
    tileSprite.alpha = 0.6 + Math.sin(t * Math.PI * 2) * 0.3;
  }, 50);
  return {
    cleanup: () => {
      clearInterval(interval);
      tileSprite.alpha = 1;
    },
  };
}

// E-SKT-02: Sketch Solidification Animation — radial tile reveal
export function sketchSolidify(
  cx: number,
  cy: number,
  radiusTiles: number,
  swapTile: (tx: number, ty: number) => void,
) {
  const tileSize = 16;
  const maxRing = radiusTiles;

  for (let ring = 0; ring <= maxRing; ring++) {
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: nested ring iteration is inherent to radial reveal
    setTimeout(() => {
      for (let dx = -ring; dx <= ring; dx++) {
        for (let dy = -ring; dy <= ring; dy++) {
          if (Math.abs(dx) === ring || Math.abs(dy) === ring) {
            const tx = Math.floor(cx / tileSize) + dx;
            const ty = Math.floor(cy / tileSize) + dy;
            swapTile(tx, ty);
          }
        }
      }
      // Paint fill particles per ring
      const count = ring * 4;
      for (let i = 0; i < Math.min(count, 12); i++) {
        const angle = (i / count) * Math.PI * 2;
        const dist = ring * tileSize;
        spawnParticles(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, {
          color: 0xffd700,
          count: 2,
          speed: 10,
          lifetime: 0.5,
          size: 2,
          fadeOut: true,
        });
      }
    }, ring * 50);
  }
}

// E-SKT-03: The Living Sketch — procedural line-drawing animation
export function livingSketch(cx: number, cy: number) {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return null;

  const gfx = new Graphics();
  gfx.zIndex = 6000;
  scene.viewport.addChild(gfx);

  const lines: Array<{ points: Array<{ x: number; y: number }>; age: number; maxAge: number }> = [];

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: sketch line animation loop has inherent branching
  const interval = setInterval(() => {
    // Spawn new line
    if (lines.length < 5) {
      const ox = cx + (Math.random() - 0.5) * 100;
      const oy = cy + (Math.random() - 0.5) * 60;
      const pts = [{ x: ox, y: oy }];
      for (let i = 0; i < 6; i++) {
        const last = pts[pts.length - 1];
        pts.push({ x: last.x + (Math.random() - 0.5) * 20, y: last.y - 5 - Math.random() * 10 });
      }
      lines.push({ points: pts, age: 0, maxAge: 3000 });
    }

    gfx.clear();
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      line.age += 50;
      const t = line.age / line.maxAge;
      if (t >= 1) {
        lines.splice(i, 1);
        continue;
      }
      const drawCount = Math.floor(line.points.length * Math.min(t * 2, 1));
      const alpha = t < 0.5 ? 0.6 : 0.6 * (1 - (t - 0.5) * 2);
      gfx.lineStyle(1.5, 0xccaa66, alpha);
      for (let j = 1; j < drawCount; j++) {
        gfx.moveTo(line.points[j - 1].x, line.points[j - 1].y);
        gfx.lineTo(line.points[j].x, line.points[j].y);
      }
    }
  }, 50);

  return {
    cleanup: () => {
      clearInterval(interval);
      gfx.removeFromParent();
      gfx.destroy();
    },
  };
}

// E-SKT-04: Sketch-to-Reality Boundary Shimmer
export function boundaryShimmer(tiles: Array<{ sprite: { alpha: number } }>) {
  const interval = setInterval(() => {
    const t = Date.now() / 2000;
    tiles.forEach((tile, i) => {
      tile.sprite.alpha = 0.4 + Math.sin(t * Math.PI * 2 + i * 0.5) * 0.4;
    });
  }, 60);
  return { cleanup: () => clearInterval(interval) };
}

// E-SKT-05: Wireframe Mountain Rendering — pulsing vertex glow
export function wireframeVertexGlow(vertices: Array<{ x: number; y: number }>) {
  const interval = setInterval(() => {
    const pulse = 0.5 + Math.sin(Date.now() / 600) * 0.3;
    vertices.forEach((v) => {
      spawnParticles(v.x, v.y, {
        color: 0xffffff,
        count: 1,
        speed: 0,
        lifetime: 0.8,
        size: 1.5 + pulse,
        fadeOut: true,
      });
    });
  }, 1500);
  return { cleanup: () => clearInterval(interval) };
}

// E-SKT-06: World's Edge Void — gradient fade + slow sketch drawing
export function worldsEdgeVoid(edgeX: number, yTop: number, yBottom: number) {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene?.viewport) return null;

  const gfx = new Graphics();
  gfx.zIndex = 5500;
  // Gradient white fade
  for (let i = 0; i < 10; i++) {
    gfx.beginFill(0xffffff, i * 0.08);
    gfx.drawRect(edgeX + i * 8, yTop, 8, yBottom - yTop);
    gfx.endFill();
  }
  scene.viewport.addChild(gfx);

  // Slow sketch lines beyond edge
  const sketch = livingSketch(edgeX + 60, (yTop + yBottom) / 2);

  return {
    cleanup: () => {
      gfx.removeFromParent();
      gfx.destroy();
      sketch?.cleanup();
    },
  };
}
