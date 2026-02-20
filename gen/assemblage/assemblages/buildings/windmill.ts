/**
 * Windmill assemblage factory.
 *
 * Creates an abandoned windmill on a hilltop — used for the Old Windmill
 * location in Heartfield (30, 8). The windmill is a visual building with
 * collision, a dirt hilltop, and optional objects (resonance stone, chest).
 */
import type {
  AssemblageDefinition,
  AssemblageObject,
  VisualObject,
} from '../../types.ts';

interface WindmillOptions {
  /** Unique assemblage ID */
  id: string;
  /** Human-readable name */
  name: string;
  /** Building visual from palette (e.g., 'house.hay-large-1') */
  objectRef: string;
  /** Width of the hilltop area in tiles */
  width: number;
  /** Height of the hilltop area in tiles */
  height: number;
  /** Optional resonance stone */
  resonanceStone?: {
    id: string;
    x: number;
    y: number;
    fragments: string;
  };
  /** Optional treasure chest */
  chest?: {
    id: string;
    x: number;
    y: number;
    contents: string;
  };
}

export function createWindmill(opts: WindmillOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;

  // Ground: dirt hilltop with light-grass edges
  const groundTiles: (string | 0)[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isEdge = x === 0 || x === w - 1 || y === 0 || y === h - 1;
      groundTiles.push(isEdge ? 'terrain:ground.light-grass' : 'terrain:ground.dirt');
    }
  }

  // Collision: building footprint in center, walkable around edges
  const collisionData = new Array(w * h).fill(0) as (0 | 1)[];
  const bx = Math.floor(w / 2) - 2;
  const by = 1;
  const bw = 5;
  const bh = Math.floor(h / 2);
  for (let y = by; y < by + bh; y++) {
    for (let x = bx; x < bx + bw && x < w; x++) {
      if (y >= 0 && y < h && x >= 0 && x < w) {
        collisionData[y * w + x] = 1;
      }
    }
  }

  // Windmill visual centered on the hilltop
  const visuals: VisualObject[] = [{ objectRef: opts.objectRef, x: bx, y: 0 }];

  // Objects
  const objects: AssemblageObject[] = [];

  if (opts.resonanceStone) {
    objects.push({
      name: opts.resonanceStone.id,
      type: 'trigger',
      x: opts.resonanceStone.x,
      y: opts.resonanceStone.y,
      properties: {
        eventType: 'action',
        fragments: opts.resonanceStone.fragments,
        description: `Resonance Stone: ${opts.resonanceStone.fragments}`,
      },
    });
  }

  if (opts.chest) {
    objects.push({
      name: opts.chest.id,
      type: 'chest',
      x: opts.chest.x,
      y: opts.chest.y,
      properties: {
        contents: opts.chest.contents,
      },
    });
  }

  return {
    id: opts.id,
    description: opts.name,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
    },
    collision: { width: w, height: h, data: collisionData },
    visuals,
    objects: objects.length > 0 ? objects : undefined,
  };
}
