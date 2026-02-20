/**
 * Shrine assemblage factory.
 *
 * Creates memorial gardens, wind shrines, resonance altars, and other
 * sacred or commemorative structures. Shrines are open-air assemblages
 * (no child world transition) centered on one or more Resonance Stones.
 *
 * Used across the world:
 * - Everwick: Memorial Garden (3 Resonance Stones, MQ-02 tutorial)
 * - Sunridge: Wind Shrine (ruined, vibrating stone, Kinesis hint)
 * - Shimmer Marsh: Verdance's Hollow pedestals
 * - Hollow Ridge: Kinesis Spire base pedestals
 * - Flickerveil: Luminos Grove prism
 *
 * Features:
 * - Decorative ground (light-grass or stone circle)
 * - Optional stone/pillar visual objects arranged in a pattern
 * - Resonance stone trigger objects for fragment collection
 * - No collision on walkable areas; stones themselves may be blocked
 * - Anchors for path connections
 */
import type {
  AssemblageDefinition,
  AssemblageObject,
  EventHook,
  VisualObject,
} from '../../types.ts';

interface ShrineStone {
  /** Resonance stone ID (e.g., 'rs-ew-02') */
  id: string;
  /** Position relative to assemblage origin */
  x: number;
  y: number;
  /** Fragment data string (e.g., 'calm/earth/1') */
  fragments: string;
  /** Optional visual ref for the stone model */
  objectRef?: string;
  /** Descriptive text shown on interaction */
  description?: string;
}

interface ShrineOptions {
  /** Unique assemblage ID (e.g., 'shrine-memorial-garden') */
  id: string;
  /** Human-readable name (e.g., 'Memorial Garden') */
  name: string;
  /** Assemblage footprint in tiles */
  width: number;
  height: number;
  /** Ground terrain style: 'garden' (light-grass), 'stone' (cobblestone), 'ruins' (dirt + stone mix) */
  groundStyle?: 'garden' | 'stone' | 'ruins';
  /** Central visual object (fountain, pillar, altar, etc.) */
  centerpiece?: {
    objectRef: string;
    x: number;
    y: number;
  };
  /** Decorative border visual objects (pillars, hedges, statues) */
  decorations?: Array<{
    objectRef: string;
    x: number;
    y: number;
  }>;
  /** Resonance stones placed within the shrine */
  stones?: ShrineStone[];
  /** Optional NPC (guardian, caretaker, ghost) */
  npc?: {
    name: string;
    x: number;
    y: number;
    sprite?: string;
    dialogue?: string;
    properties?: Record<string, string | number | boolean>;
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

export function createShrine(opts: ShrineOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const style = opts.groundStyle ?? 'garden';
  const layers: Record<string, { width: number; height: number; tiles: (string | 0)[] }> = {};

  // Ground layer based on style
  const groundTiles: (string | 0)[] = [];
  const cx = Math.floor(w / 2);
  const cy = Math.floor(h / 2);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isEdge = x === 0 || x === w - 1 || y === 0 || y === h - 1;

      if (style === 'garden') {
        groundTiles.push(isEdge ? 'terrain:ground.grass' : 'terrain:ground.light-grass');
      } else if (style === 'stone') {
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const radius = Math.min(cx, cy);
        groundTiles.push(dist <= radius ? 'terrain:ground.stone' : 'terrain:ground.dirt');
      } else {
        // ruins: scattered stone among dirt
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        if (dist <= 2) {
          groundTiles.push('terrain:ground.stone');
        } else if (isEdge) {
          groundTiles.push('terrain:ground.grass');
        } else {
          groundTiles.push('terrain:ground.dirt');
        }
      }
    }
  }
  layers.ground = { width: w, height: h, tiles: groundTiles };

  // Collision: mostly walkable, block only stone and centerpiece positions
  const collisionData = new Array(w * h).fill(0) as (0 | 1)[];

  // Block centerpiece position
  if (opts.centerpiece) {
    const px = opts.centerpiece.x;
    const py = opts.centerpiece.y;
    if (px >= 0 && px < w && py >= 0 && py < h) {
      collisionData[py * w + px] = 1;
    }
  }

  // Block resonance stone positions (players interact from adjacent tile)
  if (opts.stones) {
    for (const stone of opts.stones) {
      if (stone.x >= 0 && stone.x < w && stone.y >= 0 && stone.y < h) {
        collisionData[stone.y * w + stone.x] = 1;
      }
    }
  }

  // Visuals
  const visuals: VisualObject[] = [];

  if (opts.centerpiece) {
    visuals.push({
      objectRef: opts.centerpiece.objectRef,
      x: opts.centerpiece.x,
      y: opts.centerpiece.y,
    });
  }

  if (opts.decorations) {
    for (const deco of opts.decorations) {
      visuals.push({ objectRef: deco.objectRef, x: deco.x, y: deco.y });
    }
  }

  // Stone visuals (if they have visual refs)
  if (opts.stones) {
    for (const stone of opts.stones) {
      if (stone.objectRef) {
        visuals.push({ objectRef: stone.objectRef, x: stone.x, y: stone.y });
      }
    }
  }

  // Objects
  const objects: AssemblageObject[] = [];
  const hooks: EventHook[] = [];

  // Resonance stone trigger objects
  if (opts.stones) {
    for (const stone of opts.stones) {
      objects.push({
        name: stone.id,
        type: 'trigger',
        x: stone.x,
        y: stone.y,
        properties: {
          eventType: 'action',
          fragments: stone.fragments,
          description: stone.description ?? `Resonance Stone: ${stone.fragments}`,
        },
      });
    }
  }

  if (opts.npc) {
    const npcProps: Record<string, string | number | boolean> = {
      ...(opts.npc.sprite ? { sprite: opts.npc.sprite } : {}),
      ...(opts.npc.dialogue ? { dialogue: opts.npc.dialogue } : {}),
      ...opts.npc.properties,
    };

    objects.push({
      name: opts.npc.name,
      type: 'npc',
      x: opts.npc.x,
      y: opts.npc.y,
      properties: npcProps,
    });
  }

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
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    hooks: hooks.length > 0 ? hooks : undefined,
    anchors: [
      { name: 'south', x: cx, y: h - 1 },
      { name: 'north', x: cx, y: 0 },
      { name: 'center', x: cx, y: cy },
    ],
  };
}
