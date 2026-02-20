/**
 * Lake assemblage factory.
 *
 * An irregular lake body with shore tiles. Can contain a central
 * submerged object (dormant resonance stone, island, etc.).
 */
import type { AssemblageDefinition, AssemblageObject, VisualObject } from '../../types.ts';

interface LakeOptions {
  id: string;
  /** Lake dimensions in tiles */
  width: number;
  height: number;
  /** Submerged object at center (e.g., dormant resonance stone) */
  submergedObject?: {
    id: string;
    description: string;
    quest?: string;
  };
  /** Shore decorations */
  shoreDecor?: boolean;
}

export function createLake(opts: LakeOptions): AssemblageDefinition {
  const { width, height } = opts;
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const rx = Math.floor(width / 2) - 1;
  const ry = Math.floor(height / 2) - 1;

  const groundTiles = [];
  const waterTiles = [];
  const collisionData: (0 | 1)[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const dist = dx * dx + dy * dy;

      if (dist <= 0.7) {
        // Deep water
        groundTiles.push(0);
        waterTiles.push('terrain:water.deep');
        collisionData.push(1);
      } else if (dist <= 1.0) {
        // Shallow water / shore
        groundTiles.push('terrain:ground.sand');
        waterTiles.push('terrain:water.shallow');
        collisionData.push(1);
      } else if (dist <= 1.3) {
        // Sandy shore — walkable
        groundTiles.push('terrain:ground.sand');
        waterTiles.push(0);
        collisionData.push(0);
      } else {
        // Surrounding grass
        groundTiles.push('terrain:ground.grass');
        waterTiles.push(0);
        collisionData.push(0);
      }
    }
  }

  const visuals: VisualObject[] = [];
  const objects: AssemblageObject[] = [];

  // Shore decorations
  if (opts.shoreDecor) {
    visuals.push(
      { objectRef: 'bush.emerald-1', x: 1, y: cy },
      { objectRef: 'bush.emerald-2', x: width - 2, y: cy + 1 },
    );
  }

  // Submerged object
  if (opts.submergedObject) {
    objects.push({
      name: opts.submergedObject.id,
      type: 'trigger',
      x: cx,
      y: cy,
      properties: {
        eventType: 'action',
        description: opts.submergedObject.description,
        ...(opts.submergedObject.quest ? { linkedQuest: opts.submergedObject.quest } : {}),
      },
    });
  }

  return {
    id: opts.id,
    description: `Lake (${width}x${height})`,
    width,
    height,
    layers: {
      ground: { width, height, tiles: groundTiles },
      water: { width, height, tiles: waterTiles },
    },
    collision: { width, height, data: collisionData },
    visuals,
    objects,
    anchors: [
      { name: 'north-shore', x: cx, y: 0 },
      { name: 'south-shore', x: cx, y: height - 1 },
      { name: 'west-shore', x: 0, y: cy },
      { name: 'east-shore', x: width - 1, y: cy },
    ],
  };
}
