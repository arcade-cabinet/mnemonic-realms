/**
 * Dock assemblage factory.
 *
 * Creates a waterfront dock or quay structure extending out over water.
 * Docks are L-shaped or rectangular wooden platforms with mooring posts,
 * optional fishing NPCs, and Resonance Stones near the waterline.
 *
 * Used across the world:
 * - Millbrook: Fisher's Rest dock (Fisher Tam, SQ-04, RS-MB-03)
 * - Shimmer Marsh: Stilted observation platforms over marsh pools
 *
 * Features:
 * - Wood plank deck on the road layer (no ground layer -- water beneath)
 * - Mooring post visual objects along the edges
 * - Collision on dock edges to prevent walking into water
 * - Optional fisher/watcher NPC at the end of the dock
 * - Optional Resonance Stone near the waterline
 * - Anchors at the shore connection point
 */
import type {
  AssemblageDefinition,
  AssemblageObject,
  EventHook,
  VisualObject,
} from '../../types.ts';

interface DockOptions {
  /** Unique assemblage ID (e.g., 'dock-fishers-rest') */
  id: string;
  /** Human-readable name (e.g., "Fisher's Rest") */
  name: string;
  /** Dock length in tiles (extending out over water) */
  length: number;
  /** Dock width in tiles */
  width: number;
  /** Direction the dock extends from shore: 'north', 'south', 'east', 'west' */
  facing?: 'north' | 'south' | 'east' | 'west';
  /** Deck terrain ref (default: 'terrain:ground.wood') */
  deckTerrain?: string;
  /** Optional mooring post visual refs placed along the dock edges */
  mooringPosts?: {
    objectRef: string;
    /** How many posts along each side (evenly spaced) */
    count: number;
  };
  /** Optional NPC stationed at the dock's far end */
  npc?: {
    name: string;
    sprite?: string;
    dialogue?: string;
    properties?: Record<string, string | number | boolean>;
  };
  /** Optional Resonance Stone at the waterline end */
  resonanceStone?: {
    id: string;
    fragments: string;
    description?: string;
  };
  /** Optional treasure chest (storage crates at the dock) */
  chest?: {
    id: string;
    contents: string;
    condition?: string;
  };
}

export function createDock(opts: DockOptions): AssemblageDefinition {
  const facing = opts.facing ?? 'south';
  // Dock dimensions: length extends in the facing direction
  const isVertical = facing === 'north' || facing === 'south';
  const w = isVertical ? opts.width : opts.length;
  const h = isVertical ? opts.length : opts.width;
  const deckTerrain = opts.deckTerrain ?? 'terrain:ground.wood';

  const layers: Record<string, { width: number; height: number; tiles: (string | 0)[] }> = {};

  // Road layer: wood plank deck (no ground layer -- water is beneath)
  const roadTiles: (string | 0)[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      roadTiles.push(deckTerrain);
    }
  }
  layers.road = { width: w, height: h, tiles: roadTiles };

  // Collision: block the side edges (water side), keep the deck walkable
  const collisionData = new Array(w * h).fill(0) as (0 | 1)[];

  if (isVertical) {
    // Block left and right columns (water edges)
    for (let y = 0; y < h; y++) {
      if (w > 2) {
        collisionData[y * w + 0] = 1;
        collisionData[y * w + (w - 1)] = 1;
      }
    }
    // Block the far end (can't walk off into water)
    const farY = facing === 'south' ? h - 1 : 0;
    for (let x = 0; x < w; x++) {
      collisionData[farY * w + x] = 1;
    }
  } else {
    // Block top and bottom rows (water edges)
    for (let x = 0; x < w; x++) {
      if (h > 2) {
        collisionData[0 * w + x] = 1;
        collisionData[(h - 1) * w + x] = 1;
      }
    }
    // Block the far end
    const farX = facing === 'east' ? w - 1 : 0;
    for (let y = 0; y < h; y++) {
      collisionData[y * w + farX] = 1;
    }
  }

  // Visuals: mooring posts
  const visuals: VisualObject[] = [];

  if (opts.mooringPosts) {
    const postRef = opts.mooringPosts.objectRef;
    const count = opts.mooringPosts.count;

    for (let i = 0; i < count; i++) {
      if (isVertical) {
        const py = Math.round((i + 1) * ((h - 2) / (count + 1))) + 1;
        visuals.push({ objectRef: postRef, x: 0, y: py });
        if (w > 1) {
          visuals.push({ objectRef: postRef, x: w - 1, y: py });
        }
      } else {
        const px = Math.round((i + 1) * ((w - 2) / (count + 1))) + 1;
        visuals.push({ objectRef: postRef, x: px, y: 0 });
        if (h > 1) {
          visuals.push({ objectRef: postRef, x: px, y: h - 1 });
        }
      }
    }
  }

  // Objects
  const objects: AssemblageObject[] = [];
  const hooks: EventHook[] = [];

  // NPC at the far end of the dock
  if (opts.npc) {
    let npcX: number;
    let npcY: number;

    if (facing === 'south') {
      npcX = Math.floor(w / 2);
      npcY = h - 2;
    } else if (facing === 'north') {
      npcX = Math.floor(w / 2);
      npcY = 1;
    } else if (facing === 'east') {
      npcX = w - 2;
      npcY = Math.floor(h / 2);
    } else {
      npcX = 1;
      npcY = Math.floor(h / 2);
    }

    const npcProps: Record<string, string | number | boolean> = {
      ...(opts.npc.sprite ? { sprite: opts.npc.sprite } : {}),
      ...(opts.npc.dialogue ? { dialogue: opts.npc.dialogue } : {}),
      ...opts.npc.properties,
    };

    objects.push({
      name: opts.npc.name,
      type: 'npc',
      x: npcX,
      y: npcY,
      properties: npcProps,
    });
  }

  // Resonance stone near the waterline end
  if (opts.resonanceStone) {
    let stoneX: number;
    let stoneY: number;

    if (facing === 'south') {
      stoneX = w > 2 ? w - 2 : Math.floor(w / 2);
      stoneY = h - 2;
    } else if (facing === 'north') {
      stoneX = w > 2 ? w - 2 : Math.floor(w / 2);
      stoneY = 1;
    } else if (facing === 'east') {
      stoneX = w - 2;
      stoneY = h > 2 ? h - 2 : Math.floor(h / 2);
    } else {
      stoneX = 1;
      stoneY = h > 2 ? h - 2 : Math.floor(h / 2);
    }

    objects.push({
      name: opts.resonanceStone.id,
      type: 'trigger',
      x: stoneX,
      y: stoneY,
      properties: {
        eventType: 'action',
        fragments: opts.resonanceStone.fragments,
        description:
          opts.resonanceStone.description ??
          `Dock Resonance Stone: ${opts.resonanceStone.fragments}`,
      },
    });
  }

  if (opts.chest) {
    // Crates near the shore end
    const crateX = Math.floor(w / 2);
    const crateY = facing === 'south' ? 1 : facing === 'north' ? h - 2 : Math.floor(h / 2);

    objects.push({
      name: opts.chest.id,
      type: 'chest',
      x: crateX,
      y: crateY,
      properties: {
        contents: opts.chest.contents,
        ...(opts.chest.condition ? { condition: opts.chest.condition } : {}),
      },
    });
  }

  // Anchors: shore connection point (opposite to facing direction)
  const anchors = [];
  if (facing === 'south') {
    anchors.push({ name: 'shore', x: Math.floor(w / 2), y: 0 });
    anchors.push({ name: 'end', x: Math.floor(w / 2), y: h - 1 });
  } else if (facing === 'north') {
    anchors.push({ name: 'shore', x: Math.floor(w / 2), y: h - 1 });
    anchors.push({ name: 'end', x: Math.floor(w / 2), y: 0 });
  } else if (facing === 'east') {
    anchors.push({ name: 'shore', x: 0, y: Math.floor(h / 2) });
    anchors.push({ name: 'end', x: w - 1, y: Math.floor(h / 2) });
  } else {
    anchors.push({ name: 'shore', x: w - 1, y: Math.floor(h / 2) });
    anchors.push({ name: 'end', x: 0, y: Math.floor(h / 2) });
  }

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
