/**
 * Forest Clearing assemblage factory.
 *
 * A circular clearing in dense forest, used for Hearthstone Circles,
 * sacred groves, or campfire areas. Ring of trees around open grass center.
 */
import type { AssemblageDefinition, AssemblageObject, VisualObject } from '../../types.ts';

interface ForestClearingOptions {
  id: string;
  /** Diameter of the clearing in tiles */
  diameter: number;
  /** Resonance stones arranged in a circle (Hearthstone Circle) */
  resonanceStones?: Array<{
    id: string;
    fragments: string;
    notes?: string;
  }>;
  /** Central object (staff, pedestal, campfire) */
  centerObject?: {
    objectRef: string;
  };
  /** Chest placement */
  chest?: {
    id: string;
    contents: string;
  };
}

const CLEARING_TREES = [
  { ref: 'tree.emerald-5', tilesW: 6, tilesH: 8 },
  { ref: 'tree.emerald-3', tilesW: 3, tilesH: 6 },
  { ref: 'tree.emerald-4', tilesW: 3, tilesH: 6 },
  { ref: 'tree.dark-1', tilesW: 4, tilesH: 6 },
];

export function createForestClearing(opts: ForestClearingOptions): AssemblageDefinition {
  const d = opts.diameter;
  const width = d + 6; // Extra space for surrounding trees
  const height = d + 6;
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const r = Math.floor(d / 2);

  // Ground: dark grass border, light grass in clearing
  const groundTiles = [];
  const collisionData: (0 | 1)[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist <= r) {
        groundTiles.push('terrain:ground.grass');
        collisionData.push(0);
      } else {
        groundTiles.push('terrain:ground.dark-grass');
        // Trees block outside the clearing, but only dense ring
        collisionData.push(dist <= r + 2 ? 0 : 1);
      }
    }
  }

  const visuals: VisualObject[] = [];
  const objects: AssemblageObject[] = [];

  // Place trees around the clearing perimeter
  const treeAngleStep = Math.PI / 6;
  for (let angle = 0; angle < Math.PI * 2; angle += treeAngleStep) {
    const treeR = r + 2;
    const tx = cx + Math.round(Math.cos(angle) * treeR);
    const ty = cy + Math.round(Math.sin(angle) * treeR);
    if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
      const tree = CLEARING_TREES[Math.floor(angle * 2) % CLEARING_TREES.length];
      visuals.push({ objectRef: tree.ref, x: tx, y: ty });
    }
  }

  // Resonance stones in a smaller circle inside the clearing
  if (opts.resonanceStones) {
    const stoneR = Math.floor(r * 0.6);
    for (let i = 0; i < opts.resonanceStones.length; i++) {
      const stone = opts.resonanceStones[i];
      const angle = (i / opts.resonanceStones.length) * Math.PI * 2;
      const sx = cx + Math.round(Math.cos(angle) * stoneR);
      const sy = cy + Math.round(Math.sin(angle) * stoneR);
      objects.push({
        name: stone.id,
        type: 'trigger',
        x: sx,
        y: sy,
        properties: {
          eventType: 'action',
          fragments: stone.fragments,
          description: stone.notes || `Resonance Stone ${stone.id}`,
        },
      });
    }
  }

  // Central object
  if (opts.centerObject) {
    visuals.push({ objectRef: opts.centerObject.objectRef, x: cx, y: cy });
  }

  // Chest near edge of clearing
  if (opts.chest) {
    objects.push({
      name: opts.chest.id,
      type: 'chest',
      x: cx + Math.floor(r * 0.7),
      y: cy,
      properties: { contents: opts.chest.contents },
    });
  }

  return {
    id: opts.id,
    description: `Forest clearing (${d} tile diameter)`,
    width,
    height,
    layers: {
      ground: { width, height, tiles: groundTiles },
    },
    collision: { width, height, data: collisionData },
    visuals,
    objects,
    anchors: [
      { name: 'north', x: cx, y: 0 },
      { name: 'south', x: cx, y: height - 1 },
      { name: 'east', x: width - 1, y: cy },
      { name: 'west', x: 0, y: cy },
    ],
  };
}
