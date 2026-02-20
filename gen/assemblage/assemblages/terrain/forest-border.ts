/**
 * Forest border assemblage factory.
 *
 * Creates a strip of trees along a map edge. Trees are placed as
 * visual objects with collision at their trunks. The ground layer
 * optionally uses dark grass for forest floor.
 */
import type { AssemblageDefinition, VisualObject } from '../../types.ts';

type Edge = 'north' | 'south' | 'east' | 'west';

interface ForestBorderOptions {
  /** Which map edge */
  edge: Edge;
  /** Length along the edge (in tiles) */
  length: number;
  /** Depth of the forest strip (in tiles, default 4) */
  depth?: number;
  /** Gap range (in tiles from start) for a gate/path opening */
  gap?: { start: number; end: number };
}

/** Tree palette refs with approximate sizes in tiles (at 16px/tile) */
const TREE_TYPES = [
  { ref: 'tree.emerald-5', tilesW: 6, tilesH: 8 }, // 97x124
  { ref: 'tree.emerald-6', tilesW: 5, tilesH: 7 }, // 80x110
  { ref: 'tree.emerald-3', tilesW: 3, tilesH: 6 }, // 52x92
  { ref: 'tree.emerald-4', tilesW: 3, tilesH: 6 }, // 48x93
  { ref: 'tree.emerald-1', tilesW: 4, tilesH: 4 }, // 64x63
  { ref: 'tree.emerald-2', tilesW: 3, tilesH: 4 }, // 46x63
];

const BUSH_TYPES = [
  { ref: 'bush.emerald-1', tilesW: 3, tilesH: 2 },
  { ref: 'bush.emerald-2', tilesW: 2, tilesH: 2 },
];

export function createForestBorder(opts: ForestBorderOptions): AssemblageDefinition {
  const depth = opts.depth ?? 4;
  const isHorizontal = opts.edge === 'north' || opts.edge === 'south';
  const width = isHorizontal ? opts.length : depth;
  const height = isHorizontal ? depth : opts.length;

  // Fill ground with dark grass
  const groundTiles = new Array(width * height).fill('terrain:ground.dark-grass');
  const layers = {
    ground: { width, height, tiles: groundTiles },
  };

  // Collision: entire border is blocked
  const collisionData = new Array(width * height).fill(1) as (0 | 1)[];

  // Clear gap in collision if specified
  if (opts.gap) {
    for (let i = opts.gap.start; i < opts.gap.end; i++) {
      if (isHorizontal) {
        for (let d = 0; d < depth; d++) {
          collisionData[d * width + i] = 0;
        }
        // Also clear ground terrain in the gap
        for (let d = 0; d < depth; d++) {
          groundTiles[d * width + i] = 0;
        }
      } else {
        for (let d = 0; d < depth; d++) {
          collisionData[i * width + d] = 0;
        }
        for (let d = 0; d < depth; d++) {
          groundTiles[i * width + d] = 0;
        }
      }
    }
  }

  // Place trees using deterministic pseudo-random spacing
  const visuals: VisualObject[] = [];
  const seed = opts.edge.charCodeAt(0) + opts.length;
  let rng = seed;
  const nextRng = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng;
  };

  if (isHorizontal) {
    // Place trees along the horizontal strip
    let x = 0;
    while (x < opts.length) {
      // Skip gap
      if (opts.gap && x >= opts.gap.start && x < opts.gap.end) {
        x = opts.gap.end;
        continue;
      }

      const treeIdx = nextRng() % TREE_TYPES.length;
      const tree = TREE_TYPES[treeIdx];
      const ty = nextRng() % Math.max(1, depth - 2);

      visuals.push({ objectRef: tree.ref, x, y: ty });

      // Occasional bush between trees
      if (nextRng() % 3 === 0 && x + tree.tilesW + 1 < opts.length) {
        const bushIdx = nextRng() % BUSH_TYPES.length;
        const bush = BUSH_TYPES[bushIdx];
        visuals.push({ objectRef: bush.ref, x: x + tree.tilesW, y: depth - 1 });
      }

      x += tree.tilesW + 1;
    }
  } else {
    // Place trees along the vertical strip
    let y = 0;
    while (y < opts.length) {
      if (opts.gap && y >= opts.gap.start && y < opts.gap.end) {
        y = opts.gap.end;
        continue;
      }

      const treeIdx = nextRng() % TREE_TYPES.length;
      const tree = TREE_TYPES[treeIdx];
      const tx = nextRng() % Math.max(1, depth - 2);

      visuals.push({ objectRef: tree.ref, x: tx, y });

      if (nextRng() % 3 === 0 && y + tree.tilesH + 1 < opts.length) {
        const bushIdx = nextRng() % BUSH_TYPES.length;
        const bush = BUSH_TYPES[bushIdx];
        visuals.push({ objectRef: bush.ref, x: depth - 1, y: y + tree.tilesH });
      }

      y += tree.tilesH + 1;
    }
  }

  return {
    id: `forest-border-${opts.edge}`,
    description: `Forest border along ${opts.edge} edge`,
    width,
    height,
    layers,
    collision: { width, height, data: collisionData },
    visuals,
  };
}
