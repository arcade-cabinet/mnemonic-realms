/**
 * Camp assemblage factory.
 *
 * A small NPC settlement — cabins, campfire, and utility structures
 * arranged in a loose cluster. Used for woodcutter camps, traveler
 * rest stops, and frontier outposts.
 */
import type { AssemblageDefinition, AssemblageObject, VisualObject } from '../../types.ts';

interface CampOptions {
  id: string;
  name: string;
  /** Number of cabins (1-4) */
  cabins: number;
  /** Central feature (campfire, workbench, etc.) */
  centerFeature?: string;
  /** NPCs stationed at this camp */
  npcs?: Array<{
    name: string;
    sprite: string;
    dialogue: string;
    movement?: string;
    quests?: string[];
  }>;
}

const CABIN_FOOTPRINT = { width: 6, height: 5 };

export function createCamp(opts: CampOptions): AssemblageDefinition {
  const n = Math.min(opts.cabins, 4);
  // Size scales with cabin count
  const width = 14 + n * 4;
  const height = 14 + n * 3;
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);

  // Ground: dirt in center, grass around
  const groundTiles = [];
  const collisionData: (0 | 1)[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist <= 4) {
        groundTiles.push('terrain:ground.dirt');
      } else {
        groundTiles.push('terrain:ground.dark-grass');
      }
      collisionData.push(0);
    }
  }

  const visuals: VisualObject[] = [];
  const objects: AssemblageObject[] = [];

  // Place cabins in a rough semicircle around the center
  const cabinPositions: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI + Math.PI * 0.25;
    const r = 5 + n;
    const bx = cx + Math.round(Math.cos(angle) * r) - Math.floor(CABIN_FOOTPRINT.width / 2);
    const by = cy + Math.round(Math.sin(angle) * r) - Math.floor(CABIN_FOOTPRINT.height / 2);

    cabinPositions.push({ x: bx, y: by });
    visuals.push({ objectRef: 'house.hay-small-1', x: bx, y: by });

    // Mark cabin footprint as blocked
    for (let dy = 0; dy < CABIN_FOOTPRINT.height; dy++) {
      for (let dx = 0; dx < CABIN_FOOTPRINT.width; dx++) {
        const mx = bx + dx;
        const my = by + dy;
        if (mx >= 0 && mx < width && my >= 0 && my < height) {
          collisionData[my * width + mx] = 1;
        }
      }
    }
  }

  // Central feature
  if (opts.centerFeature) {
    visuals.push({ objectRef: opts.centerFeature, x: cx, y: cy });
  }

  // NPCs near their cabins
  if (opts.npcs) {
    for (let i = 0; i < opts.npcs.length; i++) {
      const npc = opts.npcs[i];
      const cabin = cabinPositions[i % cabinPositions.length];
      const nx = cabin.x + CABIN_FOOTPRINT.width + 1;
      const ny = cabin.y + CABIN_FOOTPRINT.height;

      objects.push({
        name: npc.name,
        type: 'npc',
        x: nx,
        y: ny,
        properties: {
          dialogue: npc.dialogue,
          sprite: npc.sprite,
          ...(npc.movement ? { movement: npc.movement } : {}),
        },
      });
    }
  }

  return {
    id: opts.id,
    description: opts.name,
    width,
    height,
    layers: {
      ground: { width, height, tiles: groundTiles },
    },
    collision: { width, height, data: collisionData },
    visuals,
    objects,
    anchors: [
      { name: 'entrance', x: cx, y: height - 1 },
      { name: 'north', x: cx, y: 0 },
    ],
  };
}
