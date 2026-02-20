/**
 * Marsh assemblage factory.
 *
 * Creates patches of marshy wetland — spongy ground, scattered pools of
 * standing water, reed clusters, and patches of deep mud that slow or block
 * movement. Shimmer Marsh is the primary consumer: misty marshland where
 * pools reflect memories rather than sky, with ground that dissolves
 * underfoot and reforms elsewhere.
 *
 * The factory supports several variants:
 * - 'wetland': generic marsh terrain with scattered pools
 * - 'bog': dense, darker marsh with more impassable deep water
 * - 'shallows': mostly shallow water with scattered dry hummocks
 * - 'stagnation-bog': Preserver-crystallized marsh (frozen ripples, ice formations)
 */
import type { Anchor, AssemblageDefinition, AssemblageObject, VisualObject } from '../../types.ts';

type MarshVariant = 'wetland' | 'bog' | 'shallows' | 'stagnation-bog';

interface MarshOptions {
  /** Unique assemblage ID */
  id: string;
  /** Marsh variant */
  variant: MarshVariant;
  /** Width in tiles */
  width: number;
  /** Height in tiles */
  height: number;
  /** Pool density: 0.0 to 1.0 (default: 0.3) */
  poolDensity?: number;
  /** Reed cluster density: 0.0 to 1.0 (default: 0.2) */
  reedDensity?: number;
  /** Safe path through the marsh — a walkable corridor */
  safePath?: {
    /** Entry edge */
    entry: 'north' | 'south' | 'east' | 'west';
    /** Exit edge */
    exit: 'north' | 'south' | 'east' | 'west';
    /** Path width in tiles (default: 2) */
    width?: number;
  };
  /** Events placed in the marsh */
  events?: Array<{
    id: string;
    type: 'trigger' | 'transition';
    x: number;
    y: number;
    description?: string;
  }>;
  /** Resonance stones */
  resonanceStones?: Array<{
    id: string;
    fragments: string;
    x: number;
    y: number;
    submerged?: boolean;
  }>;
}

export function createMarsh(opts: MarshOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const poolDensity = opts.poolDensity ?? 0.3;
  const reedDensity = opts.reedDensity ?? 0.2;

  // Deterministic pseudo-random
  let rng = w * 53 + h * 31 + opts.variant.charCodeAt(0);
  const nextRng = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng;
  };
  const nextFloat = () => nextRng() / 0x7fffffff;

  // Build safe path mask if specified
  const safeMask = new Set<number>();
  if (opts.safePath) {
    const pathW = opts.safePath.width ?? 2;
    buildSafePathMask(safeMask, w, h, opts.safePath.entry, opts.safePath.exit, pathW);
  }

  const groundTiles: (string | 0)[] = [];
  const waterTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];
  const visuals: VisualObject[] = [];

  // Generate pool centers using noise
  const poolCenters: Array<{ x: number; y: number; r: number }> = [];
  const poolCount = Math.floor((w * h * poolDensity) / 25);
  for (let i = 0; i < poolCount; i++) {
    const px = 2 + (nextRng() % Math.max(1, w - 4));
    const py = 2 + (nextRng() % Math.max(1, h - 4));
    const pr = 1 + (nextRng() % 3);
    poolCenters.push({ x: px, y: py, r: pr });
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const onSafePath = safeMask.has(idx);

      // Distance to nearest pool center
      let minPoolDist = Infinity;
      for (const pool of poolCenters) {
        const d = Math.sqrt((x - pool.x) ** 2 + (y - pool.y) ** 2);
        minPoolDist = Math.min(minPoolDist, d / pool.r);
      }

      if (opts.variant === 'stagnation-bog') {
        // Preserver-crystallized: frozen water, crystallized sand
        if (minPoolDist <= 0.7 && !onSafePath) {
          groundTiles.push('terrain:sand');
          waterTiles.push('terrain:water.frozen');
          detailTiles.push('terrain:shadow.light');
          collisionData.push(1);
        } else if (minPoolDist <= 1.2 && !onSafePath) {
          groundTiles.push('terrain:sand');
          waterTiles.push(0);
          detailTiles.push('terrain:shadow.light');
          collisionData.push(0);
        } else {
          groundTiles.push(onSafePath ? 'terrain:ground.dirt' : 'terrain:sand');
          waterTiles.push(0);
          detailTiles.push(onSafePath ? 0 : 'terrain:shadow.light');
          collisionData.push(0);
        }
      } else if (opts.variant === 'bog') {
        // Dense, dark bog — more blocking water
        if (minPoolDist <= 0.6 && !onSafePath) {
          groundTiles.push(0);
          waterTiles.push('terrain:water.deep');
          detailTiles.push(0);
          collisionData.push(1);
        } else if (minPoolDist <= 1.0 && !onSafePath) {
          groundTiles.push('terrain:ground.mud');
          waterTiles.push('terrain:water.shallow');
          detailTiles.push(0);
          collisionData.push(1);
        } else if (minPoolDist <= 1.5) {
          groundTiles.push('terrain:ground.mud');
          waterTiles.push(0);
          detailTiles.push(0);
          collisionData.push(0);
        } else {
          groundTiles.push('terrain:ground.dark-grass');
          waterTiles.push(0);
          detailTiles.push(0);
          collisionData.push(0);
        }
      } else if (opts.variant === 'shallows') {
        // Mostly water with dry hummocks
        if (minPoolDist <= 1.0 || (!onSafePath && nextFloat() < 0.4)) {
          groundTiles.push(0);
          waterTiles.push('terrain:water.shallow');
          detailTiles.push(0);
          collisionData.push(onSafePath ? 0 : 1);
        } else {
          groundTiles.push('terrain:ground.mud');
          waterTiles.push(0);
          detailTiles.push(0);
          collisionData.push(0);
        }
      } else {
        // Standard wetland
        if (minPoolDist <= 0.7 && !onSafePath) {
          groundTiles.push(0);
          waterTiles.push('terrain:water.deep');
          detailTiles.push(0);
          collisionData.push(1);
        } else if (minPoolDist <= 1.0 && !onSafePath) {
          groundTiles.push('terrain:ground.mud');
          waterTiles.push('terrain:water.shallow');
          detailTiles.push(0);
          collisionData.push(nextFloat() < 0.4 ? 1 : 0);
        } else if (minPoolDist <= 1.4) {
          groundTiles.push('terrain:ground.mud');
          waterTiles.push(0);
          detailTiles.push(0);
          collisionData.push(0);
        } else {
          groundTiles.push(nextFloat() < 0.3 ? 'terrain:ground.mud' : 'terrain:ground.dark-grass');
          waterTiles.push(0);
          detailTiles.push(0);
          collisionData.push(0);
        }
      }

      // Reed cluster visuals on passable marsh tiles near water
      if (
        collisionData[idx] === 0 &&
        minPoolDist > 0.8 &&
        minPoolDist < 2.0 &&
        nextFloat() < reedDensity
      ) {
        visuals.push({ objectRef: 'prop.reed-cluster', x, y });
      }
    }
  }

  const objects: AssemblageObject[] = [];

  if (opts.events) {
    for (const evt of opts.events) {
      objects.push({
        name: evt.id,
        type: evt.type,
        x: evt.x,
        y: evt.y,
        properties: {
          ...(evt.description ? { description: evt.description } : {}),
        },
      });
    }
  }

  if (opts.resonanceStones) {
    for (const stone of opts.resonanceStones) {
      objects.push({
        name: stone.id,
        type: 'trigger',
        x: stone.x,
        y: stone.y,
        properties: {
          eventType: 'action',
          fragments: stone.fragments,
          description: stone.submerged
            ? 'A Resonance Stone half-submerged in murky water, its glow diffused through the ripples'
            : 'A Resonance Stone rising from the marsh on a bed of tangled roots',
        },
      });
    }
  }

  const layers: Record<string, { width: number; height: number; tiles: (string | 0)[] }> = {
    ground: { width: w, height: h, tiles: groundTiles },
    water: { width: w, height: h, tiles: waterTiles },
  };

  // Only include detail layer if it has non-zero content
  if (detailTiles.some((t) => t !== 0)) {
    layers.ground2 = { width: w, height: h, tiles: detailTiles };
  }

  return {
    id: opts.id,
    description: `Marsh ${opts.variant} (${w}x${h})`,
    width: w,
    height: h,
    layers,
    collision: { width: w, height: h, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    anchors: [
      { name: 'north', x: Math.floor(w / 2), y: 0 },
      { name: 'south', x: Math.floor(w / 2), y: h - 1 },
      { name: 'east', x: w - 1, y: Math.floor(h / 2) },
      { name: 'west', x: 0, y: Math.floor(h / 2) },
    ],
  };
}

/**
 * Builds a set of tile indices marking the safe path through the marsh.
 * Uses a simple midpoint-to-midpoint L-shaped path.
 */
function buildSafePathMask(
  mask: Set<number>,
  w: number,
  h: number,
  entry: 'north' | 'south' | 'east' | 'west',
  exit: 'north' | 'south' | 'east' | 'west',
  pathWidth: number,
): void {
  const entryPoint = edgeMidpoint(entry, w, h);
  const exitPoint = edgeMidpoint(exit, w, h);
  const midX = Math.floor((entryPoint.x + exitPoint.x) / 2);
  const midY = Math.floor((entryPoint.y + exitPoint.y) / 2);
  const halfPw = Math.floor(pathWidth / 2);

  // Entry to midpoint
  stampLine(mask, entryPoint.x, entryPoint.y, midX, midY, halfPw, w);
  // Midpoint to exit
  stampLine(mask, midX, midY, exitPoint.x, exitPoint.y, halfPw, w);
}

function edgeMidpoint(
  edge: 'north' | 'south' | 'east' | 'west',
  w: number,
  h: number,
): { x: number; y: number } {
  switch (edge) {
    case 'north':
      return { x: Math.floor(w / 2), y: 0 };
    case 'south':
      return { x: Math.floor(w / 2), y: h - 1 };
    case 'east':
      return { x: w - 1, y: Math.floor(h / 2) };
    case 'west':
      return { x: 0, y: Math.floor(h / 2) };
  }
}

function stampLine(
  mask: Set<number>,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  halfWidth: number,
  mapWidth: number,
): void {
  // Horizontal then vertical (L-shaped)
  const minX = Math.min(x0, x1);
  const maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1);
  const maxY = Math.max(y0, y1);

  // Horizontal segment at y0
  for (let x = minX; x <= maxX; x++) {
    for (let dy = -halfWidth; dy <= halfWidth; dy++) {
      const my = y0 + dy;
      if (my >= 0) {
        mask.add(my * mapWidth + x);
      }
    }
  }

  // Vertical segment at x1
  for (let y = minY; y <= maxY; y++) {
    for (let dx = -halfWidth; dx <= halfWidth; dx++) {
      const mx = x1 + dx;
      if (mx >= 0) {
        mask.add(y * mapWidth + mx);
      }
    }
  }
}
