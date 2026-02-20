/**
 * Wheat field assemblage factory.
 *
 * Creates rectangular patches of farm-field terrain with optional
 * tall-grass hay borders. Used for Heartfield's rolling golden farmland.
 */
import type { AssemblageDefinition, VisualObject } from '../../types.ts';

interface WheatFieldOptions {
  /** Unique assemblage ID */
  id: string;
  /** Width in tiles */
  width: number;
  /** Height in tiles */
  height: number;
  /** Add tall-grass border around the field (default: true) */
  border?: boolean;
  /** Border width in tiles (default: 1) */
  borderWidth?: number;
  /** Scatter hay bales as visual objects (default: false) */
  hayBales?: boolean;
}

export function createWheatField(opts: WheatFieldOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const hasBorder = opts.border !== false;
  const bw = opts.borderWidth ?? 1;

  // Ground layer: farm terrain for inner area, tall-grass hay for border
  const groundTiles: (string | 0)[] = new Array(w * h).fill(0);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isBorder = hasBorder && (x < bw || x >= w - bw || y < bw || y >= h - bw);
      groundTiles[y * w + x] = isBorder ? 'terrain:tallgrass.hay' : 'terrain:farm';
    }
  }

  // No collision — fields are walkable (random encounters happen here)
  const collisionData = new Array(w * h).fill(0) as (0 | 1)[];

  // Optional hay bale visuals scattered in the field
  const visuals: VisualObject[] = [];
  if (opts.hayBales) {
    // Deterministic placement based on field dimensions
    let rng = w * 31 + h * 17;
    const nextRng = () => {
      rng = (rng * 1103515245 + 12345) & 0x7fffffff;
      return rng;
    };

    const count = Math.floor((w * h) / 80) + 1;
    for (let i = 0; i < count; i++) {
      const bx = bw + 1 + (nextRng() % Math.max(1, w - bw * 2 - 2));
      const by = bw + 1 + (nextRng() % Math.max(1, h - bw * 2 - 2));
      visuals.push({ objectRef: 'prop.barrel-empty', x: bx, y: by });
    }
  }

  return {
    id: opts.id,
    description: `Wheat field (${w}x${h})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
    },
    collision: { width: w, height: h, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
  };
}
