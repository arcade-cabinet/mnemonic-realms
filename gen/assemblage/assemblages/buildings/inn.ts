/**
 * Inn assemblage factory.
 *
 * Creates an inn or tavern building -- the largest standard building type.
 * Inns serve as rest points (full HP/SP restore), rumor sources, and
 * dream-sequence triggers after Act I.
 *
 * Used across the world:
 * - Everwick: The Bright Hearth (Nyro, SQ-12, dream sequences)
 * - Millbrook: Oram's riverside inn
 * - Shimmer Marsh: Marsh waypoint inn
 * - Flickerveil: Flickering Village inn
 *
 * Features:
 * - Larger footprint than shops (typically 5x5 or 6x5)
 * - Warm-toned ground patch (dirt with light-grass border)
 * - Building visual with chimney smoke implied by the sprite
 * - Front door for child world transition
 * - Optional innkeeper NPC near the entrance
 * - Optional signpost/lantern visual beside the door
 */
import type {
  AssemblageDefinition,
  AssemblageObject,
  EventHook,
  VisualObject,
} from '../../types.ts';

interface InnOptions {
  /** Unique assemblage ID (e.g., 'inn-bright-hearth') */
  id: string;
  /** Human-readable name (e.g., 'The Bright Hearth') */
  name: string;
  /** Object ref for the inn building (e.g., 'house.red-large-1') */
  objectRef: string;
  /** Building footprint in tiles */
  width: number;
  height: number;
  /** Optional signpost or lantern visual beside the entrance */
  signpost?: {
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
  /** Innkeeper NPC near the entrance or visible through doorway */
  innkeeper?: {
    name: string;
    x: number;
    y: number;
    sprite?: string;
    dialogue?: string;
    properties?: Record<string, string | number | boolean>;
  };
  /** Optional resonance stone hidden inside (e.g., behind the fireplace) */
  hiddenStone?: {
    id: string;
    x: number;
    y: number;
    fragments: string;
    revealCondition?: string;
  };
}

export function createInn(opts: InnOptions): AssemblageDefinition {
  const layers: Record<string, { width: number; height: number; tiles: (string | 0)[] }> = {};

  // Ground layer: dirt inner area with light-grass border for a warm, welcoming feel
  const groundTiles: (string | 0)[] = [];
  for (let y = 0; y < opts.height; y++) {
    for (let x = 0; x < opts.width; x++) {
      const isEdge = x === 0 || x === opts.width - 1 || y === 0 || y === opts.height - 1;
      groundTiles.push(isEdge ? 'terrain:ground.light-grass' : 'terrain:ground.dirt');
    }
  }
  layers.ground = { width: opts.width, height: opts.height, tiles: groundTiles };

  // Collision: block the building body, leave bottom row open
  const collisionData = new Array(opts.width * opts.height).fill(0) as (0 | 1)[];
  for (let y = 0; y < opts.height - 1; y++) {
    for (let x = 0; x < opts.width; x++) {
      collisionData[y * opts.width + x] = 1;
    }
  }

  // Visual: the inn building sprite
  const visuals: VisualObject[] = [{ objectRef: opts.objectRef, x: 0, y: 0 }];

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

  if (opts.innkeeper) {
    const npcProps: Record<string, string | number | boolean> = {
      ...(opts.innkeeper.sprite ? { sprite: opts.innkeeper.sprite } : {}),
      ...(opts.innkeeper.dialogue ? { dialogue: opts.innkeeper.dialogue } : {}),
      ...opts.innkeeper.properties,
    };

    objects.push({
      name: opts.innkeeper.name,
      type: 'npc',
      x: opts.innkeeper.x,
      y: opts.innkeeper.y,
      properties: npcProps,
    });
  }

  if (opts.hiddenStone) {
    objects.push({
      name: opts.hiddenStone.id,
      type: 'trigger',
      x: opts.hiddenStone.x,
      y: opts.hiddenStone.y,
      properties: {
        eventType: 'action',
        fragments: opts.hiddenStone.fragments,
        description: `Hidden Resonance Stone: ${opts.hiddenStone.fragments}`,
        ...(opts.hiddenStone.revealCondition
          ? { revealCondition: opts.hiddenStone.revealCondition }
          : {}),
      },
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
