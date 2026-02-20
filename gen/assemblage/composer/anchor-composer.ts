/**
 * Anchor Composer — Single Anchor DDL → MapComposition
 *
 * Reads a single anchor's `mapLayout` from the region DDL and produces
 * a complete MapComposition that feeds the existing pipeline:
 *   MapComposition → composeMap() → MapCanvas → serializeToTmx() → TMX
 *
 * This is the bridge between rule #6 ("NEVER hand-craft individual map
 * compositions") and the existing assemblage pipeline. The DDL data in
 * settled-lands.json drives everything; this code just reads it and
 * calls the factories.
 *
 * Architecture level: ANCHOR (single map from region DDL)
 */

import { createHouse } from '../assemblages/buildings/house';
import { createForestBorder } from '../assemblages/terrain/forest-border';
import type {
  AssemblageObject,
  EventHook,
  MapComposition,
  PathSegment,
  PlacedAssemblage,
  VisualObject,
} from '../types';
import type { AnchorDefinition } from './world-ddl';

// ---------------------------------------------------------------------------
// DDL mapLayout types (matches the JSON structure in region DDL)
// ---------------------------------------------------------------------------

interface MapLayoutBuilding {
  id: string;
  name: string;
  objectRef: string;
  x: number;
  y: number;
  width: number;
  height: number;
  door?: {
    x: number;
    y: number;
    targetWorld?: string;
    targetMap?: string;
    targetX?: number;
    targetY?: number;
  };
  keeperNpc?: string;
  keeperSprite?: string;
  keeperDialogue?: string;
}

interface MapLayoutArea {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  terrain: string;
}

interface MapLayoutPath {
  id: string;
  terrain: string;
  layer: string;
  width: number;
  points: { x: number; y: number }[];
}

interface MapLayoutVisual {
  objectRef: string;
  x: number;
  y: number;
}

interface MapLayoutNpcSpawn {
  id: string;
  sprite: string;
  x: number;
  y: number;
  dialogue?: string;
}

interface MapLayoutTransition {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  targetMap: string;
  targetX: number;
  targetY: number;
  condition?: string;
  hidden?: boolean;
}

interface MapLayoutResonanceStone {
  id: string;
  x: number;
  y: number;
  fragment: string;
  hidden?: boolean;
  condition?: string;
}

interface MapLayoutTreasureChest {
  id: string;
  x: number;
  y: number;
  item: string;
  quantity: number;
  condition?: string;
}

interface MapLayoutTrigger {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  type: string;
  scene?: string;
  condition?: string;
}

interface ForestBorderConfig {
  depth: number;
  gates: Record<string, { start: number; end: number }>;
}

export interface MapLayout {
  biome: string;
  palette: string;
  defaultGround: string;
  music?: string;
  tileSize: number;
  mapSize: [number, number];
  forestBorder?: ForestBorderConfig;
  buildings?: MapLayoutBuilding[];
  areas?: MapLayoutArea[];
  paths?: MapLayoutPath[];
  visuals?: MapLayoutVisual[];
  npcSpawns?: MapLayoutNpcSpawn[];
  transitions?: MapLayoutTransition[];
  resonanceStones?: MapLayoutResonanceStone[];
  treasureChests?: MapLayoutTreasureChest[];
  triggers?: MapLayoutTrigger[];
  playerSpawn?: { x: number; y: number };
}

// ---------------------------------------------------------------------------
// Anchor → MapComposition
// ---------------------------------------------------------------------------

const LAYERS = ['ground', 'ground2', 'road', 'objects', 'objects_upper'];

/**
 * Compose a MapComposition from a single anchor's mapLayout DDL.
 *
 * This replaces hand-crafted gen/assemblage/maps/*.ts files. The DDL
 * in the region JSON is the source of truth.
 */
export function composeAnchorMap(anchor: AnchorDefinition): MapComposition {
  const layout = (anchor as AnchorDefinition & { mapLayout?: MapLayout }).mapLayout;
  if (!layout) {
    throw new Error(`Anchor '${anchor.id}' has no mapLayout. Add mapLayout to the region DDL.`);
  }

  const [mapW, mapH] = layout.mapSize;
  const tileSize = layout.tileSize;
  const placements: PlacedAssemblage[] = [];
  const paths: PathSegment[] = [];
  const visuals: VisualObject[] = [];
  const objects: AssemblageObject[] = [];
  const hooks: EventHook[] = [];

  // --- 1. Forest border assemblages ---
  if (layout.forestBorder) {
    const fb = layout.forestBorder;
    const depth = fb.depth;

    // North border (full width)
    placements.push({
      assemblage: createForestBorder({
        edge: 'north',
        length: mapW,
        depth,
        gap: fb.gates.north,
      }),
      x: 0,
      y: 0,
    });

    // South border (full width)
    placements.push({
      assemblage: createForestBorder({
        edge: 'south',
        length: mapW,
        depth,
        gap: fb.gates.south,
      }),
      x: 0,
      y: mapH - depth,
    });

    // West border (skip corners)
    const vertLen = mapH - depth * 2;
    placements.push({
      assemblage: createForestBorder({
        edge: 'west',
        length: vertLen,
        depth,
        gap: fb.gates.west
          ? { start: fb.gates.west.start - depth, end: fb.gates.west.end - depth }
          : undefined,
      }),
      x: 0,
      y: depth,
    });

    // East border (skip corners)
    placements.push({
      assemblage: createForestBorder({
        edge: 'east',
        length: vertLen,
        depth,
        gap: fb.gates.east
          ? { start: fb.gates.east.start - depth, end: fb.gates.east.end - depth }
          : undefined,
      }),
      x: mapW - depth,
      y: depth,
    });
  }

  // --- 2. Named terrain areas (ground2 layer stamps) ---
  if (layout.areas) {
    for (const area of layout.areas) {
      const tiles = new Array(area.width * area.height).fill(`terrain:${area.terrain}`);
      placements.push({
        assemblage: {
          id: `area-${area.id}`,
          description: area.name,
          width: area.width,
          height: area.height,
          layers: {
            ground2: { width: area.width, height: area.height, tiles },
          },
        },
        x: area.x,
        y: area.y,
      });
    }
  }

  // --- 3. Buildings ---
  if (layout.buildings) {
    for (const bldg of layout.buildings) {
      const house = createHouse({
        id: bldg.id,
        name: bldg.name,
        objectRef: bldg.objectRef,
        width: bldg.width,
        height: bldg.height,
        door: bldg.door
          ? {
              x: bldg.door.x,
              y: bldg.door.y,
              targetMap: bldg.door.targetWorld ?? bldg.door.targetMap,
              targetX: bldg.door.targetX,
              targetY: bldg.door.targetY,
            }
          : undefined,
        npc: bldg.keeperNpc
          ? {
              name: bldg.keeperNpc,
              x: bldg.door ? bldg.door.x : Math.floor(bldg.width / 2),
              y: bldg.door ? bldg.door.y : bldg.height - 1,
              type: 'npc',
              properties: {
                dialogue: bldg.keeperDialogue ?? bldg.keeperNpc,
                sprite: bldg.keeperSprite ?? `npc_${bldg.keeperNpc}`,
              },
            }
          : undefined,
      });
      placements.push({ assemblage: house, x: bldg.x, y: bldg.y });
    }
  }

  // --- 4. Paths ---
  if (layout.paths) {
    for (const p of layout.paths) {
      paths.push({
        terrain: p.terrain,
        layer: p.layer,
        width: p.width,
        points: p.points,
      });
    }
  }

  // --- 5. Visuals ---
  if (layout.visuals) {
    for (const v of layout.visuals) {
      visuals.push({ objectRef: v.objectRef, x: v.x, y: v.y });
    }
  }

  // --- 6. Player spawn ---
  if (layout.playerSpawn) {
    objects.push({
      name: 'player-spawn',
      type: 'spawn',
      x: layout.playerSpawn.x,
      y: layout.playerSpawn.y,
    });
  }

  // --- 7. NPC spawns (wandering villagers, etc.) ---
  if (layout.npcSpawns) {
    for (const npc of layout.npcSpawns) {
      objects.push({
        name: npc.id,
        type: 'npc',
        x: npc.x,
        y: npc.y,
        properties: {
          dialogue: npc.dialogue ?? npc.id,
          sprite: npc.sprite,
        },
      });
    }
  }

  // --- 8. Transitions ---
  if (layout.transitions) {
    for (const t of layout.transitions) {
      objects.push({
        name: t.id,
        type: 'transition',
        x: t.x,
        y: t.y,
        width: t.width ?? 1,
        height: t.height ?? 1,
        properties: {
          map: t.targetMap,
          x: t.targetX,
          y: t.targetY,
          ...(t.condition ? { condition: t.condition } : {}),
          ...(t.hidden ? { hidden: true } : {}),
        },
      });
    }
  }

  // --- 9. Resonance stones ---
  if (layout.resonanceStones) {
    for (const rs of layout.resonanceStones) {
      objects.push({
        name: rs.id,
        type: 'trigger',
        x: rs.x,
        y: rs.y,
        properties: {
          type: 'resonance-stone',
          fragment: rs.fragment,
          ...(rs.hidden ? { hidden: true } : {}),
          ...(rs.condition ? { condition: rs.condition } : {}),
        },
      });
    }
  }

  // --- 10. Treasure chests ---
  if (layout.treasureChests) {
    for (const ch of layout.treasureChests) {
      objects.push({
        name: ch.id,
        type: 'chest',
        x: ch.x,
        y: ch.y,
        properties: {
          item: ch.item,
          quantity: ch.quantity,
          ...(ch.condition ? { condition: ch.condition } : {}),
        },
      });
    }
  }

  // --- 11. Triggers ---
  if (layout.triggers) {
    for (const trig of layout.triggers) {
      objects.push({
        name: trig.id,
        type: 'trigger',
        x: trig.x,
        y: trig.y,
        width: trig.width ?? 1,
        height: trig.height ?? 1,
        properties: {
          type: trig.type,
          ...(trig.scene ? { scene: trig.scene } : {}),
          ...(trig.condition ? { condition: trig.condition } : {}),
        },
      });
    }
  }

  // --- Build the MapComposition ---
  return {
    id: anchor.id,
    name: anchor.name,
    width: mapW,
    height: mapH,
    tileWidth: tileSize,
    tileHeight: tileSize,
    paletteName: layout.palette,
    defaultGround: layout.defaultGround,
    layers: LAYERS,
    placements,
    paths: paths.length > 0 ? paths : undefined,
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    hooks: hooks.length > 0 ? hooks : undefined,
  };
}

/**
 * Find an anchor by ID across all regions in the loaded world DDL.
 *
 * Returns both the anchor and its parent region ID so the caller
 * can load the correct palette/biome.
 */
export function findAnchorInRegions(
  regions: { id: string; anchors: AnchorDefinition[] }[],
  anchorId: string,
): { anchor: AnchorDefinition; regionId: string } | null {
  for (const region of regions) {
    const anchor = region.anchors.find((a) => a.id === anchorId);
    if (anchor) {
      return { anchor, regionId: region.id };
    }
  }
  return null;
}
