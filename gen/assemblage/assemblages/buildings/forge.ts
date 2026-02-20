/**
 * Forge assemblage factory.
 *
 * Creates a blacksmith forge with an anvil yard, chimney stack, and
 * workspace. The forge has a larger ground footprint than a standard
 * shop because the outdoor anvil area is part of the building.
 *
 * Used across the world:
 * - Everwick: Hark's forge (weapons/armor, SQ-11)
 * - Millbrook: Dalla's riverside forge (weapons, river-cooled steel)
 *
 * Features:
 * - Stone ground patch (forges use cobblestone, not dirt)
 * - Building visual for the forge structure
 * - Anvil visual object in the outdoor work area
 * - Collision for building body; open walkway at the anvil
 * - Optional door for child world transition
 * - Optional blacksmith NPC at the anvil
 */
import type {
  AssemblageDefinition,
  AssemblageObject,
  EventHook,
  VisualObject,
} from '../../types.ts';

interface ForgeOptions {
  /** Unique assemblage ID (e.g., 'forge-hark') */
  id: string;
  /** Human-readable name (e.g., "Hark's Forge") */
  name: string;
  /** Object ref for the forge building (e.g., 'house.stone-medium-1') */
  objectRef: string;
  /** Building footprint in tiles (includes the outdoor anvil area) */
  width: number;
  height: number;
  /** Optional anvil visual placed in the outdoor work area */
  anvil?: {
    objectRef: string;
    x: number;
    y: number;
  };
  /** Front door for child world transition */
  door?: {
    x: number;
    y: number;
    targetMap?: string;
    targetX?: number;
    targetY?: number;
  };
  /** Blacksmith NPC standing at the anvil or near the entrance */
  blacksmith?: {
    name: string;
    x: number;
    y: number;
    sprite?: string;
    dialogue?: string;
    properties?: Record<string, string | number | boolean>;
  };
}

export function createForge(opts: ForgeOptions): AssemblageDefinition {
  const layers: Record<string, { width: number; height: number; tiles: (string | 0)[] }> = {};

  // Ground layer: cobblestone for the forge yard
  const groundTiles: (string | 0)[] = [];
  for (let y = 0; y < opts.height; y++) {
    for (let x = 0; x < opts.width; x++) {
      // Inner area is stone, outer ring is dirt transition
      const isEdge = x === 0 || x === opts.width - 1 || y === 0;
      groundTiles.push(isEdge ? 'terrain:ground.dirt' : 'terrain:ground.stone');
    }
  }
  layers.ground = { width: opts.width, height: opts.height, tiles: groundTiles };

  // Collision: block the upper portion (building body), leave lower rows
  // open for the anvil work area and walkway
  const collisionData = new Array(opts.width * opts.height).fill(0) as (0 | 1)[];
  const buildingRows = Math.max(1, opts.height - 2);
  for (let y = 0; y < buildingRows; y++) {
    for (let x = 0; x < opts.width; x++) {
      collisionData[y * opts.width + x] = 1;
    }
  }

  // Visuals: forge building + optional anvil
  const visuals: VisualObject[] = [{ objectRef: opts.objectRef, x: 0, y: 0 }];

  if (opts.anvil) {
    visuals.push({
      objectRef: opts.anvil.objectRef,
      x: opts.anvil.x,
      y: opts.anvil.y,
    });
  }

  // Objects and hooks
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

  if (opts.blacksmith) {
    const npcProps: Record<string, string | number | boolean> = {
      ...(opts.blacksmith.sprite ? { sprite: opts.blacksmith.sprite } : {}),
      ...(opts.blacksmith.dialogue ? { dialogue: opts.blacksmith.dialogue } : {}),
      ...opts.blacksmith.properties,
    };

    objects.push({
      name: opts.blacksmith.name,
      type: 'npc',
      x: opts.blacksmith.x,
      y: opts.blacksmith.y,
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
      { name: 'anvil', x: opts.anvil?.x ?? Math.floor(opts.width / 2), y: opts.height - 2 },
    ],
  };
}
