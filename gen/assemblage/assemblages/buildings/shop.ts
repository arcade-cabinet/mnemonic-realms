/**
 * Shop assemblage factory.
 *
 * Creates a general-purpose shop building for merchants, curio dealers,
 * and provision stores. Used across the world:
 *
 * - Everwick: Khali's Curios (general goods)
 * - Millbrook: Theron's Provisions, Lissa's Fish Market
 * - Shimmer Marsh: Vash's supply hut
 * - Flickerveil: Flickering Village shop
 *
 * Each shop has a stone or dirt ground patch, a building visual, collision,
 * a front door for child world transition, an optional shopkeeper NPC standing
 * outside or visible through the doorway, and an optional signpost object.
 */
import type {
  AssemblageDefinition,
  AssemblageObject,
  EventHook,
  VisualObject,
} from '../../types.ts';

interface ShopOptions {
  /** Unique assemblage ID (e.g., 'shop-khali-curios') */
  id: string;
  /** Human-readable name (e.g., "Khali's Curios") */
  name: string;
  /** Object ref from the palette (e.g., 'house.blue-small-1') */
  objectRef: string;
  /** Building footprint in tiles */
  width: number;
  height: number;
  /** Ground terrain under the building (default: 'terrain:ground.dirt') */
  groundTerrain?: string;
  /** Optional signpost visual placed beside the door */
  signpost?: {
    objectRef: string;
    x: number;
    y: number;
  };
  /** Front door position relative to assemblage for child world transition */
  door?: {
    x: number;
    y: number;
    targetMap?: string;
    targetX?: number;
    targetY?: number;
  };
  /** Optional shopkeeper NPC standing near the entrance */
  shopkeeper?: {
    name: string;
    x: number;
    y: number;
    sprite?: string;
    dialogue?: string;
    shopType?: string;
    properties?: Record<string, string | number | boolean>;
  };
}

export function createShop(opts: ShopOptions): AssemblageDefinition {
  const layers: Record<string, { width: number; height: number; tiles: (string | 0)[] }> = {};

  // Ground layer: stone or dirt patch under the shop
  const terrain = opts.groundTerrain ?? 'terrain:ground.dirt';
  const groundTiles = new Array(opts.width * opts.height).fill(terrain);
  layers.ground = { width: opts.width, height: opts.height, tiles: groundTiles };

  // Collision: block the building footprint, leave bottom row passable for approach
  const collisionData = new Array(opts.width * opts.height).fill(0) as (0 | 1)[];
  for (let y = 0; y < opts.height - 1; y++) {
    for (let x = 0; x < opts.width; x++) {
      collisionData[y * opts.width + x] = 1;
    }
  }

  // Visual: the shop building sprite
  const visuals: VisualObject[] = [{ objectRef: opts.objectRef, x: 0, y: 0 }];

  // Optional signpost beside the door
  if (opts.signpost) {
    visuals.push({
      objectRef: opts.signpost.objectRef,
      x: opts.signpost.x,
      y: opts.signpost.y,
    });
  }

  // Objects and hooks
  const objects: AssemblageObject[] = [];
  const hooks: EventHook[] = [];

  // Door transition into the shop child world
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

  // Shopkeeper NPC near the entrance
  if (opts.shopkeeper) {
    const npcProps: Record<string, string | number | boolean> = {
      ...(opts.shopkeeper.sprite ? { sprite: opts.shopkeeper.sprite } : {}),
      ...(opts.shopkeeper.dialogue ? { dialogue: opts.shopkeeper.dialogue } : {}),
      ...(opts.shopkeeper.shopType ? { shopType: opts.shopkeeper.shopType } : {}),
      ...opts.shopkeeper.properties,
    };

    objects.push({
      name: opts.shopkeeper.name,
      type: 'npc',
      x: opts.shopkeeper.x,
      y: opts.shopkeeper.y,
      properties: npcProps,
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
    anchors: [
      { name: 'entrance', x: opts.door?.x ?? Math.floor(opts.width / 2), y: opts.height - 1 },
    ],
  };
}
