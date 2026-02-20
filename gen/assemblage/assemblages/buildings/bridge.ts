/**
 * Bridge assemblage factory.
 *
 * Creates a bridge structure spanning a river or chasm. Bridges run
 * either east-west or north-south across the assemblage, with stone
 * or wood decking, railings as collision barriers, and optional
 * decorative elements (keystone Resonance Stone, lanterns).
 *
 * Used across the world:
 * - Millbrook: Brightwater Bridge (6x3 stone, RS-MB-01 in keystone)
 * - Flickerveil: Canopy bridge segments (wood, elevated)
 * - Various frontier zones: river/chasm crossings
 *
 * Features:
 * - Stone or wood deck on the road layer
 * - Railing collision on the long edges (blocks falling off)
 * - Walkable center path
 * - Optional Resonance Stone embedded in the keystone
 * - Optional guard NPC stationed on the bridge
 * - Anchors at both ends for path connections
 */
import type {
  AssemblageDefinition,
  AssemblageObject,
  EventHook,
  VisualObject,
} from '../../types.ts';

interface BridgeOptions {
  /** Unique assemblage ID (e.g., 'bridge-brightwater') */
  id: string;
  /** Human-readable name (e.g., 'Brightwater Bridge') */
  name: string;
  /** Bridge span in tiles (length along the crossing direction) */
  span: number;
  /** Bridge width in tiles (perpendicular to crossing; includes railings) */
  width: number;
  /** Crossing direction: 'east-west' or 'north-south' */
  direction?: 'east-west' | 'north-south';
  /** Deck material terrain ref (default: 'terrain:ground.stone') */
  deckTerrain?: string;
  /** Optional building visual for a decorative bridge sprite overlay */
  objectRef?: string;
  /** Optional Resonance Stone in the bridge keystone */
  keystoneStone?: {
    id: string;
    x: number;
    y: number;
    fragments: string;
    description?: string;
  };
  /** Optional guard NPC stationed on the bridge */
  guard?: {
    name: string;
    x: number;
    y: number;
    sprite?: string;
    dialogue?: string;
    properties?: Record<string, string | number | boolean>;
  };
}

export function createBridge(opts: BridgeOptions): AssemblageDefinition {
  const dir = opts.direction ?? 'east-west';
  // For east-west bridges: width = span (horizontal), height = opts.width (vertical)
  // For north-south bridges: width = opts.width (horizontal), height = span (vertical)
  const w = dir === 'east-west' ? opts.span : opts.width;
  const h = dir === 'east-west' ? opts.width : opts.span;
  const deckTerrain = opts.deckTerrain ?? 'terrain:ground.stone';

  const layers: Record<string, { width: number; height: number; tiles: (string | 0)[] }> = {};

  // Road layer: bridge deck
  const roadTiles: (string | 0)[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      roadTiles.push(deckTerrain);
    }
  }
  layers.road = { width: w, height: h, tiles: roadTiles };

  // Collision: railings on the long edges, walkable center
  const collisionData = new Array(w * h).fill(0) as (0 | 1)[];

  if (dir === 'east-west') {
    // Railings on top and bottom rows
    for (let x = 0; x < w; x++) {
      collisionData[0 * w + x] = 1; // top railing
      collisionData[(h - 1) * w + x] = 1; // bottom railing
    }
  } else {
    // Railings on left and right columns
    for (let y = 0; y < h; y++) {
      collisionData[y * w + 0] = 1; // left railing
      collisionData[y * w + (w - 1)] = 1; // right railing
    }
  }

  // Visuals
  const visuals: VisualObject[] = [];
  if (opts.objectRef) {
    visuals.push({ objectRef: opts.objectRef, x: 0, y: 0 });
  }

  // Objects
  const objects: AssemblageObject[] = [];
  const hooks: EventHook[] = [];

  if (opts.keystoneStone) {
    objects.push({
      name: opts.keystoneStone.id,
      type: 'trigger',
      x: opts.keystoneStone.x,
      y: opts.keystoneStone.y,
      properties: {
        eventType: 'action',
        fragments: opts.keystoneStone.fragments,
        description:
          opts.keystoneStone.description ??
          `Bridge Resonance Stone: ${opts.keystoneStone.fragments}`,
      },
    });
  }

  if (opts.guard) {
    const npcProps: Record<string, string | number | boolean> = {
      ...(opts.guard.sprite ? { sprite: opts.guard.sprite } : {}),
      ...(opts.guard.dialogue ? { dialogue: opts.guard.dialogue } : {}),
      ...opts.guard.properties,
    };

    objects.push({
      name: opts.guard.name,
      type: 'npc',
      x: opts.guard.x,
      y: opts.guard.y,
      properties: npcProps,
    });
  }

  // Anchors at both ends of the bridge
  const anchors =
    dir === 'east-west'
      ? [
          { name: 'west', x: 0, y: Math.floor(h / 2) },
          { name: 'east', x: w - 1, y: Math.floor(h / 2) },
        ]
      : [
          { name: 'north', x: Math.floor(w / 2), y: 0 },
          { name: 'south', x: Math.floor(w / 2), y: h - 1 },
        ];

  return {
    id: opts.id,
    description: opts.name,
    width: w,
    height: h,
    layers,
    collision: { width: w, height: h, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    hooks: hooks.length > 0 ? hooks : undefined,
    anchors,
  };
}
