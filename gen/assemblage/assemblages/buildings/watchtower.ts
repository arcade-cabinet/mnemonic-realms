/**
 * Watchtower assemblage factory.
 *
 * Creates outpost and watchtower structures -- military or frontier
 * observation posts. These are tall, narrow buildings with a surrounding
 * patrol area and defensive collision layout.
 *
 * Used across the world:
 * - Sunridge: Preserver Outpost (crystallized watchtower, Janik, SQ-05)
 * - Sunridge: Ridgetop Waystation (traveler's outpost with rest point)
 * - Hollow Ridge: Ridgewalker Camp guard posts
 * - Everwick: Lookout Hill telescope platform
 *
 * Features:
 * - Stone or dirt ground patch for the patrol yard
 * - Tower visual object (tall sprite, small footprint)
 * - Collision for tower body; open patrol area around it
 * - Optional guard NPC(s) patrolling the perimeter
 * - Optional Resonance Stone or treasure chest
 * - Rest point trigger for waystations
 * - Anchors at patrol yard edges for path connections
 */
import type {
  AssemblageDefinition,
  AssemblageObject,
  EventHook,
  VisualObject,
} from '../../types.ts';

interface WatchtowerOptions {
  /** Unique assemblage ID (e.g., 'watchtower-preserver-outpost') */
  id: string;
  /** Human-readable name (e.g., 'Preserver Outpost') */
  name: string;
  /** Object ref for the tower building (e.g., 'house.stone-tall-1') */
  objectRef: string;
  /** Total assemblage footprint in tiles (includes patrol yard) */
  width: number;
  height: number;
  /** Tower footprint within the assemblage (centered) */
  towerWidth?: number;
  towerHeight?: number;
  /** Ground terrain for the patrol yard */
  groundTerrain?: string;
  /** Whether this outpost acts as a rest point (full HP/SP restore) */
  restPoint?: boolean;
  /** Optional guard NPC(s) stationed at the outpost */
  guards?: Array<{
    name: string;
    x: number;
    y: number;
    sprite?: string;
    dialogue?: string;
    movement?: string;
    properties?: Record<string, string | number | boolean>;
  }>;
  /** Optional Resonance Stone in the outpost area */
  resonanceStone?: {
    id: string;
    x: number;
    y: number;
    fragments: string;
    description?: string;
  };
  /** Optional treasure chest */
  chest?: {
    id: string;
    x: number;
    y: number;
    contents: string;
    condition?: string;
  };
}

export function createWatchtower(opts: WatchtowerOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const tw = opts.towerWidth ?? 2;
  const th = opts.towerHeight ?? 3;
  const groundTerrain = opts.groundTerrain ?? 'terrain:ground.stone';

  const layers: Record<string, { width: number; height: number; tiles: (string | 0)[] }> = {};

  // Ground layer: patrol yard
  const groundTiles: (string | 0)[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isEdge = x === 0 || x === w - 1 || y === 0 || y === h - 1;
      groundTiles.push(isEdge ? 'terrain:ground.dirt' : groundTerrain);
    }
  }
  layers.ground = { width: w, height: h, tiles: groundTiles };

  // Collision: tower body is blocked, patrol yard is walkable
  const collisionData = new Array(w * h).fill(0) as (0 | 1)[];
  const towerX = Math.floor((w - tw) / 2);
  const towerY = Math.floor((h - th) / 2) - 1; // slightly north of center
  const ty = Math.max(0, towerY);

  for (let y = ty; y < ty + th && y < h; y++) {
    for (let x = towerX; x < towerX + tw && x < w; x++) {
      collisionData[y * w + x] = 1;
    }
  }

  // Visuals: tower building
  const visuals: VisualObject[] = [{ objectRef: opts.objectRef, x: towerX, y: ty }];

  // Objects
  const objects: AssemblageObject[] = [];
  const hooks: EventHook[] = [];

  // Rest point trigger (for waystations)
  if (opts.restPoint) {
    objects.push({
      name: 'rest-point',
      type: 'trigger',
      x: Math.floor(w / 2),
      y: h - 2,
      properties: {
        eventType: 'action',
        description: `${opts.name}: Rest here to restore HP and SP.`,
        restPoint: true,
      },
    });
  }

  // Guard NPCs
  if (opts.guards) {
    for (const guard of opts.guards) {
      const npcProps: Record<string, string | number | boolean> = {
        ...(guard.sprite ? { sprite: guard.sprite } : {}),
        ...(guard.dialogue ? { dialogue: guard.dialogue } : {}),
        ...(guard.movement ? { movement: guard.movement } : {}),
        ...guard.properties,
      };

      objects.push({
        name: guard.name,
        type: 'npc',
        x: guard.x,
        y: guard.y,
        properties: npcProps,
      });
    }
  }

  // Resonance stone
  if (opts.resonanceStone) {
    objects.push({
      name: opts.resonanceStone.id,
      type: 'trigger',
      x: opts.resonanceStone.x,
      y: opts.resonanceStone.y,
      properties: {
        eventType: 'action',
        fragments: opts.resonanceStone.fragments,
        description:
          opts.resonanceStone.description ??
          `Outpost Resonance Stone: ${opts.resonanceStone.fragments}`,
      },
    });
  }

  // Treasure chest
  if (opts.chest) {
    objects.push({
      name: opts.chest.id,
      type: 'chest',
      x: opts.chest.x,
      y: opts.chest.y,
      properties: {
        contents: opts.chest.contents,
        ...(opts.chest.condition ? { condition: opts.chest.condition } : {}),
      },
    });
  }

  return {
    id: opts.id,
    description: opts.name,
    width: w,
    height: h,
    layers,
    collision: { width: w, height: h, data: collisionData },
    visuals,
    objects: objects.length > 0 ? objects : undefined,
    hooks: hooks.length > 0 ? hooks : undefined,
    anchors: [
      { name: 'south', x: Math.floor(w / 2), y: h - 1 },
      { name: 'north', x: Math.floor(w / 2), y: 0 },
      { name: 'east', x: w - 1, y: Math.floor(h / 2) },
      { name: 'west', x: 0, y: Math.floor(h / 2) },
    ],
  };
}
