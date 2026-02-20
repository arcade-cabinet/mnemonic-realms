/**
 * Highland assemblage factory.
 *
 * Creates elevated, wind-scoured terrain — rolling hills, exposed ridges,
 * and grassy plateaus where the ground is shorter and sparser than lowland
 * meadows. Sunridge's rolling highlands and the approaches to Hollow Ridge
 * use this terrain extensively.
 *
 * Highlands transition gradually from normal grassland at the edges to sparse
 * highland grass at the center, with scattered rock outcrops that block movement
 * and provide visual variety.
 *
 * Variants:
 * - 'plateau': flat elevated area with steep edges
 * - 'rolling': gentle hills with sparse grass and scattered stones
 * - 'outcrop': rocky formation with climbable/explorable areas
 * - 'threshold': transitional terrain — settled lands fading into frontier shimmer
 */
import type { Anchor, AssemblageDefinition, AssemblageObject, VisualObject } from '../../types.ts';

type HighlandVariant = 'plateau' | 'rolling' | 'outcrop' | 'threshold';

interface HighlandOptions {
  /** Unique assemblage ID */
  id: string;
  /** Highland variant */
  variant: HighlandVariant;
  /** Width in tiles */
  width: number;
  /** Height in tiles */
  height: number;
  /** Rock outcrop density: 0.0 to 1.0 (default: 0.15) */
  rockDensity?: number;
  /** Waystation or shrine placement */
  landmark?: {
    id: string;
    type: 'waystation' | 'shrine' | 'outpost' | 'overlook';
    x: number;
    y: number;
    description?: string;
  };
  /** Resonance stones */
  resonanceStones?: Array<{
    id: string;
    fragments: string;
    x: number;
    y: number;
  }>;
  /** Preserver crystallization level: 0.0 to 1.0 (default: 0) */
  stagnation?: number;
}

const ROCK_VISUALS = [
  { ref: 'prop.rock-large-1', tilesW: 3, tilesH: 2 },
  { ref: 'prop.rock-medium-1', tilesW: 2, tilesH: 2 },
  { ref: 'prop.rock-small-1', tilesW: 1, tilesH: 1 },
];

export function createHighland(opts: HighlandOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const rockDensity = opts.rockDensity ?? 0.15;
  const stagnation = opts.stagnation ?? 0;

  let rng = w * 47 + h * 23 + opts.variant.charCodeAt(0);
  const nextRng = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng;
  };
  const nextFloat = () => nextRng() / 0x7fffffff;

  switch (opts.variant) {
    case 'plateau':
      return buildPlateau(opts, w, h, rockDensity, stagnation, nextFloat, nextRng);
    case 'rolling':
      return buildRolling(opts, w, h, rockDensity, stagnation, nextFloat, nextRng);
    case 'outcrop':
      return buildOutcrop(opts, w, h, stagnation, nextFloat, nextRng);
    case 'threshold':
      return buildThreshold(opts, w, h, rockDensity, nextFloat, nextRng);
  }
}

function buildPlateau(
  opts: HighlandOptions,
  w: number,
  h: number,
  rockDensity: number,
  stagnation: number,
  nextFloat: () => number,
  nextRng: () => number,
): AssemblageDefinition {
  const edgeWidth = 2;
  const groundTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];
  const visuals: VisualObject[] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const distFromEdge = Math.min(x, y, w - 1 - x, h - 1 - y);

      if (distFromEdge < edgeWidth) {
        // Cliff edge of the plateau
        groundTiles.push('terrain:cliff.edge');
        detailTiles.push(0);
        collisionData.push(distFromEdge === 0 ? 1 : 0);
      } else {
        // Plateau surface
        const isStagnated = stagnation > 0 && nextFloat() < stagnation;
        if (isStagnated) {
          groundTiles.push('terrain:sand');
          detailTiles.push('terrain:shadow.light');
        } else {
          groundTiles.push('terrain:ground.highland-grass');
          detailTiles.push(0);
        }

        // Random rock outcrops
        if (nextFloat() < rockDensity * 0.3 && distFromEdge > 3) {
          const rock = ROCK_VISUALS[nextRng() % ROCK_VISUALS.length];
          visuals.push({ objectRef: rock.ref, x, y });
          collisionData.push(1);
        } else {
          collisionData.push(0);
        }
      }
    }
  }

  const objects = buildLandmarkAndStones(opts);

  return {
    id: opts.id,
    description: `Highland plateau (${w}x${h})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
      ground2: { width: w, height: h, tiles: detailTiles },
    },
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

function buildRolling(
  opts: HighlandOptions,
  w: number,
  h: number,
  rockDensity: number,
  stagnation: number,
  nextFloat: () => number,
  nextRng: () => number,
): AssemblageDefinition {
  const groundTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];
  const visuals: VisualObject[] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Use sine waves to simulate rolling hills — affects tile choice
      const hillFactor =
        Math.sin(x * 0.3) * 0.5 + Math.sin(y * 0.25) * 0.5 + Math.sin((x + y) * 0.15) * 0.3;
      const normalizedHill = (hillFactor + 1.3) / 2.6; // 0 to 1

      const isStagnated = stagnation > 0 && nextFloat() < stagnation;

      if (isStagnated) {
        groundTiles.push('terrain:sand');
      } else if (normalizedHill > 0.7) {
        // Hill crest — sparse grass, exposed stone
        groundTiles.push('terrain:ground.stone');
      } else if (normalizedHill > 0.4) {
        // Mid-slope — highland grass
        groundTiles.push('terrain:ground.highland-grass');
      } else {
        // Valley between hills — slightly richer grass
        groundTiles.push('terrain:ground.light-grass');
      }

      // Rock outcrops on hill crests
      if (normalizedHill > 0.75 && nextFloat() < rockDensity) {
        const rock = ROCK_VISUALS[nextRng() % ROCK_VISUALS.length];
        visuals.push({ objectRef: rock.ref, x, y });
        collisionData.push(1);
      } else {
        collisionData.push(0);
      }
    }
  }

  const objects = buildLandmarkAndStones(opts);

  return {
    id: opts.id,
    description: `Rolling highlands (${w}x${h})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
    },
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

function buildOutcrop(
  opts: HighlandOptions,
  w: number,
  h: number,
  stagnation: number,
  nextFloat: () => number,
  nextRng: () => number,
): AssemblageDefinition {
  const cx = Math.floor(w / 2);
  const cy = Math.floor(h / 2);
  const rx = Math.floor(w / 2) - 1;
  const ry = Math.floor(h / 2) - 1;

  const groundTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];
  const visuals: VisualObject[] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const dist = dx * dx + dy * dy;

      if (dist <= 0.3) {
        // Rocky core — impassable
        const isStagnated = stagnation > 0 && nextFloat() < stagnation;
        groundTiles.push(isStagnated ? 'terrain:sand' : 'terrain:cliff.rock');
        collisionData.push(1);

        if (nextFloat() < 0.3) {
          const rock = ROCK_VISUALS[nextRng() % ROCK_VISUALS.length];
          visuals.push({ objectRef: rock.ref, x, y });
        }
      } else if (dist <= 0.6) {
        // Rocky perimeter — partially walkable
        groundTiles.push('terrain:ground.stone');
        collisionData.push(nextFloat() < 0.4 ? 1 : 0);
      } else if (dist <= 1.0) {
        // Highland grass transition
        groundTiles.push('terrain:ground.highland-grass');
        collisionData.push(0);
      } else {
        // Surrounding grassland
        groundTiles.push('terrain:ground.grass');
        collisionData.push(0);
      }
    }
  }

  const objects = buildLandmarkAndStones(opts);

  return {
    id: opts.id,
    description: `Rocky outcrop (${w}x${h})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
    },
    collision: { width: w, height: h, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    anchors: [
      { name: 'north', x: cx, y: 0 },
      { name: 'south', x: cx, y: h - 1 },
      { name: 'east', x: w - 1, y: cy },
      { name: 'west', x: 0, y: cy },
    ],
  };
}

/**
 * Threshold: the transitional terrain at the border between Settled Lands and
 * Frontier. Grass shortens, colors fade, shapes blur as you move north.
 * Used for Sunridge's northern edge (The Threshold).
 */
function buildThreshold(
  opts: HighlandOptions,
  w: number,
  h: number,
  rockDensity: number,
  nextFloat: () => number,
  nextRng: () => number,
): AssemblageDefinition {
  const groundTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];
  const visuals: VisualObject[] = [];

  for (let y = 0; y < h; y++) {
    // Gradient: south = settled (1.0), north = frontier shimmer (0.0)
    const settled = y / h;

    for (let x = 0; x < w; x++) {
      if (settled > 0.7) {
        // Settled highland — normal grass
        groundTiles.push('terrain:ground.highland-grass');
        detailTiles.push(0);
      } else if (settled > 0.4) {
        // Transition — pale, shorter grass
        groundTiles.push('terrain:ground.light-grass');
        detailTiles.push(nextFloat() < 0.2 ? 'terrain:shadow.light' : 0);
      } else {
        // Frontier shimmer — ground simplifies, occasional shimmer overlay
        groundTiles.push('terrain:ground.stone');
        detailTiles.push(nextFloat() < 0.3 ? 'terrain:shimmer' : 0);
      }

      // Sparse rocks, more common toward the frontier side
      if (nextFloat() < rockDensity * (1 - settled + 0.2)) {
        const rock = ROCK_VISUALS[nextRng() % ROCK_VISUALS.length];
        visuals.push({ objectRef: rock.ref, x, y });
        collisionData.push(1);
      } else {
        collisionData.push(0);
      }
    }
  }

  const objects = buildLandmarkAndStones(opts);

  return {
    id: opts.id,
    description: `Highland threshold (${w}x${h})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
      ground2: { width: w, height: h, tiles: detailTiles },
    },
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

/** Shared helper: build objects from landmark and resonance stone options. */
function buildLandmarkAndStones(opts: HighlandOptions): AssemblageObject[] {
  const objects: AssemblageObject[] = [];

  if (opts.landmark) {
    objects.push({
      name: opts.landmark.id,
      type: 'trigger',
      x: opts.landmark.x,
      y: opts.landmark.y,
      properties: {
        eventType: 'action',
        landmarkType: opts.landmark.type,
        description: opts.landmark.description ?? `Highland ${opts.landmark.type}`,
      },
    });
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
          description: 'Resonance Stone standing against the highland wind',
        },
      });
    }
  }

  return objects;
}
