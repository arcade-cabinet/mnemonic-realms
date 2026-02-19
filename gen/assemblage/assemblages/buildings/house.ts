/**
 * House assemblage factory.
 *
 * Creates a building assemblage with:
 * - Dirt ground patch under the building
 * - Visual object for the house image
 * - Collision rectangle for the building footprint
 * - Optional door event (for shops, inns)
 * - Optional NPC spawn
 */
import type {
  AssemblageDefinition,
  AssemblageObject,
  EventHook,
  VisualObject,
} from '../../types.ts';

interface HouseOptions {
  /** Unique assemblage ID */
  id: string;
  /** Human-readable name */
  name: string;
  /** Object ref from the palette (e.g., 'house.blue-large-1') */
  objectRef: string;
  /**
   * Building footprint in tiles.
   * The visual object is positioned at (0, 0) of the assemblage.
   * Width/height define the assemblage size and collision area.
   */
  width: number;
  height: number;
  /** If true, fill ground layer with dirt under the building */
  dirtGround?: boolean;
  /** Optional door position relative to assemblage (for shop/inn entry) */
  door?: {
    x: number;
    y: number;
    targetMap?: string;
    targetX?: number;
    targetY?: number;
  };
  /** Optional NPC at the building */
  npc?: {
    name: string;
    x: number;
    y: number;
    type: 'npc' | 'chest' | 'trigger';
    properties?: Record<string, string | number | boolean>;
  };
}

export function createHouse(opts: HouseOptions): AssemblageDefinition {
  const layers: Record<string, { width: number; height: number; tiles: (string | 0)[] }> = {};

  // Ground layer: optional dirt patch
  if (opts.dirtGround !== false) {
    const groundTiles = new Array(opts.width * opts.height).fill('terrain:ground.dirt');
    layers.ground = { width: opts.width, height: opts.height, tiles: groundTiles };
  }

  // Collision: block the building footprint (leave bottom row open for walkway)
  const collisionData = new Array(opts.width * opts.height).fill(0) as (0 | 1)[];
  for (let y = 0; y < opts.height - 1; y++) {
    for (let x = 0; x < opts.width; x++) {
      collisionData[y * opts.width + x] = 1;
    }
  }

  // Visual: the building image
  const visuals: VisualObject[] = [{ objectRef: opts.objectRef, x: 0, y: 0 }];

  // Objects
  const objects: AssemblageObject[] = [];
  const hooks: EventHook[] = [];

  if (opts.door) {
    objects.push({
      name: 'door',
      type: 'transition',
      x: opts.door.x,
      y: opts.door.y,
      width: 1,
      height: 1,
      properties: {
        ...(opts.door.targetMap ? { map: opts.door.targetMap } : {}),
        ...(opts.door.targetX !== undefined ? { x: opts.door.targetX } : {}),
        ...(opts.door.targetY !== undefined ? { y: opts.door.targetY } : {}),
      },
    });
  }

  if (opts.npc) {
    objects.push({
      name: opts.npc.name,
      type: opts.npc.type,
      x: opts.npc.x,
      y: opts.npc.y,
      properties: opts.npc.properties,
    });
  }

  return {
    id: opts.id,
    description: opts.name,
    width: opts.width,
    height: opts.height,
    layers,
    collision: { width: opts.width, height: opts.height, data: collisionData },
    visuals,
    objects: objects.length > 0 ? objects : undefined,
    hooks: hooks.length > 0 ? hooks : undefined,
  };
}
