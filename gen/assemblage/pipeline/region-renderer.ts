/**
 * Region Renderer — RegionMap → MapCanvas Bridge
 *
 * Converts the region composer's output (collision grid, placed anchors,
 * routed paths, fill, NPCs, doors) into a MapCanvas that the TMX
 * serializer can consume.
 *
 * This is the missing bridge between the DDL-driven composition system
 * and the TMX output pipeline. Without this, you'd be hand-crafting
 * MapComposition files — defeating the entire purpose of the DDL system.
 *
 * Collision grid values → semantic tiles:
 *   0 (passable) → biome.baseGround
 *   1 (blocked)  → depends on context (building footprint, edge, etc.)
 *   2 (road)     → biome.roadTerrain
 *   3 (reserved) → biome.baseGround (clearance zones, walkable but sparse)
 */

import type { BuildingColor } from '../composer/biomes';
import type { RegionMap } from '../composer/region-composer';
import type { SemanticTile } from '../types';
import { MapCanvas } from './canvas';

const LAYERS = ['ground', 'ground2', 'road', 'objects', 'objects_upper'];

/**
 * Convert a RegionMap to a MapCanvas ready for TMX serialization.
 *
 * The canvas has semantic tiles on appropriate layers:
 * - ground: base terrain + fill variants
 * - road: road terrain from routed paths
 * - objects: building visuals, scatter objects
 */
export function regionToCanvas(regionMap: RegionMap): MapCanvas {
  const { width, height, biome, collisionGrid, fill, placedAnchors, routedPaths } = regionMap;
  const tileSize = 16;

  const canvas = new MapCanvas({
    width,
    height,
    tileWidth: tileSize,
    tileHeight: tileSize,
    layers: LAYERS,
  });

  // --- Layer 1: Ground terrain from fill engine ---
  const groundLayer = canvas.layers.get('ground')!;

  for (let i = 0; i < width * height; i++) {
    // Fill engine provides semantic ground terrain per tile
    if (fill.groundTerrain[i] && fill.groundTerrain[i] !== 'void') {
      groundLayer[i] = `terrain:${fill.groundTerrain[i]}`;
    } else if (fill.groundTerrain[i] === 'void') {
      // Void = empty tile (sketch realm undrawn areas)
      groundLayer[i] = 0;
    } else {
      // Fallback: use collision grid to determine terrain
      const cell = collisionGrid.data[i];
      if (cell === 2) {
        groundLayer[i] = `terrain:${biome.roadTerrain}`;
      } else {
        groundLayer[i] = `terrain:${biome.baseGround}`;
      }
    }
  }

  // --- Layer 2: Road terrain from routed paths ---
  const roadLayer = canvas.layers.get('road')!;

  for (let i = 0; i < width * height; i++) {
    if (collisionGrid.data[i] === 2) {
      roadLayer[i] = `terrain:${biome.roadTerrain}`;
    }
  }

  // --- Layer 3: Building footprints on ground2 ---
  const ground2Layer = canvas.layers.get('ground2')!;

  for (const placed of placedAnchors) {
    // Town and hamlet building footprints get a dirt ground underneath
    if (placed.townLayout) {
      for (const building of placed.townLayout.buildings) {
        stampRect(ground2Layer, width,
          building.position.x, building.position.y,
          building.footprint.width, building.footprint.height,
          'terrain:ground.dirt');
      }
      // Central feature
      if (placed.townLayout.centralFeature) {
        const cf = placed.townLayout.centralFeature;
        stampRect(ground2Layer, width, cf.position.x - 1, cf.position.y - 1, 3, 3, 'terrain:ground.dirt');
      }
    }
    if (placed.hamletLayout) {
      for (const house of placed.hamletLayout.housePlacements) {
        stampRect(ground2Layer, width,
          house.position.x, house.position.y,
          8, 8, // hamlet building footprint
          'terrain:ground.dirt');
      }
    }
  }

  // --- Visuals: building rooftops, scatter objects ---

  // Building visuals from town/hamlet layouts — map archetypes to palette objects
  for (const placed of placedAnchors) {
    if (placed.townLayout) {
      for (const building of placed.townLayout.buildings) {
        canvas.visuals.push({
          objectRef: archetypeToPaletteObject(building.archetype, biome.buildingColor),
          x: building.position.x,
          y: building.position.y,
        });
      }
      // Central feature visual
      if (placed.townLayout.centralFeature) {
        const cf = placed.townLayout.centralFeature;
        canvas.visuals.push({
          objectRef: propToPaletteObject(cf.type, biome.buildingColor),
          x: cf.position.x,
          y: cf.position.y,
        });
      }
    }
    if (placed.hamletLayout) {
      for (const house of placed.hamletLayout.housePlacements) {
        canvas.visuals.push({
          objectRef: archetypeToPaletteObject(house.archetype, biome.buildingColor),
          x: house.position.x,
          y: house.position.y,
        });
      }
      if (placed.hamletLayout.wellPosition) {
        canvas.visuals.push({
          objectRef: propToPaletteObject('well', biome.buildingColor),
          x: placed.hamletLayout.wellPosition.x,
          y: placed.hamletLayout.wellPosition.y,
        });
      }
    }
  }

  // Fill scatter objects
  for (const scatter of fill.scatterObjects) {
    canvas.visuals.push({
      objectRef: scatter.objectRef,
      x: scatter.x,
      y: scatter.y,
    });
  }

  // Edge treatment visuals — map edge type to appropriate tree/rock objects
  const EDGE_TYPE_OBJECTS: Record<string, string[]> = {
    forest: ['tree.emerald-3', 'tree.emerald-4', 'tree.emerald-2'],
    cliff: ['rock.gray-1', 'rock.gray-2', 'rock.brown-2'],
    water: [], // Water edges use terrain tiles, not objects
    wall: [],  // Wall edges use terrain tiles, not objects
    void: [],  // Sketch realm void edges — empty
    none: [],
  };
  for (const edge of fill.edgeTiles) {
    const candidates = EDGE_TYPE_OBJECTS[edge.type] ?? [];
    if (candidates.length === 0) continue;
    // Deterministic selection based on position
    const objRef = candidates[(edge.x + edge.y) % candidates.length];
    canvas.visuals.push({
      objectRef: objRef,
      x: edge.x,
      y: edge.y,
    });
  }

  // --- Objects: NPCs, doors, spawn ---

  // NPCs from region composer
  for (const [npcId, pos] of Array.from(regionMap.npcPositions.entries())) {
    canvas.objects.push({
      name: npcId,
      type: 'npc',
      x: pos.x,
      y: pos.y,
      properties: {
        sprite: `npc_${npcId}`,
        dialogue: npcId,
      },
    });
  }

  // Door transitions to child worlds
  for (const [instanceId, pos] of Array.from(regionMap.doorTransitions.entries())) {
    canvas.objects.push({
      name: `door-${instanceId}`,
      type: 'transition',
      x: pos.x,
      y: pos.y,
      width: 1,
      height: 1,
      properties: {
        targetWorld: instanceId,
        transitionType: 'door',
      },
    });
  }

  // Region exits
  for (const exit of regionMap.regionExits) {
    canvas.objects.push({
      name: `exit-${exit.targetRegion}`,
      type: 'transition',
      x: exit.position.x,
      y: exit.position.y,
      width: 3,
      height: 3,
      properties: {
        targetRegion: exit.targetRegion,
        direction: exit.direction,
        transitionType: 'region',
        ...(exit.condition ? { condition: exit.condition } : {}),
      },
    });
  }

  // Player spawn at the first anchor's first entry point
  if (placedAnchors.length > 0 && placedAnchors[0].entryAnchors.length > 0) {
    const spawn = placedAnchors[0].entryAnchors[0];
    canvas.objects.push({
      name: 'player-spawn',
      type: 'spawn',
      x: spawn.x,
      y: spawn.y,
    });
  }

  // --- Collision layer ---
  for (let i = 0; i < width * height; i++) {
    canvas.collision[i] = collisionGrid.data[i] === 1 ? 1 : 0;
  }

  return canvas;
}

/**
 * Map a building archetype + biome color → palette object reference.
 *
 * The composer generates abstract archetypes ('weapon-shop', 'tavern', 'house-small').
 * The palette has concrete objects ('house.red-large-1', 'house.hay-small-1').
 * This function bridges the gap.
 */
function archetypeToPaletteObject(archetype: string, color: BuildingColor): string {
  // Archetype → size mapping (variant selected per color availability)
  const ARCHETYPE_SIZE: Record<string, string> = {
    'weapon-shop': 'large',
    tavern: 'large',
    library: 'medium',
    'house-medium': 'medium',
    'house-small': 'small',
    'house-large': 'large',
  };

  const size = ARCHETYPE_SIZE[archetype] ?? 'small';

  // Available variants per color+size (from palette objects)
  const MAX_VARIANTS: Record<string, Record<string, number>> = {
    red: { small: 2, medium: 2, large: 2 },
    blue: { small: 2, medium: 2, large: 4 },
    green: { small: 2, medium: 2, large: 1 },
    hay: { small: 1, medium: 1, large: 1 },
  };
  const paletteColors = ['red', 'blue', 'green', 'hay'];
  const c = paletteColors.includes(color) ? color : 'red';

  const maxVariant = MAX_VARIANTS[c]?.[size] ?? 1;
  // Use archetype string hash for variety across buildings
  const hash = archetype.split('').reduce((h, ch) => h + ch.charCodeAt(0), 0);
  const variant = (hash % maxVariant) + 1;

  return `house.${c}-${size}-${variant}`;
}

/**
 * Map a central feature type → palette object reference.
 */
function propToPaletteObject(propType: string, color: BuildingColor): string {
  const PROP_MAP: Record<string, string> = {
    well: 'well.generic',
    fountain: 'well.generic', // closest available
    signpost: 'prop.sign-south',
    statue: 'prop.bulletin-board-1', // closest available
    'bulletin-board': 'prop.bulletin-board-1',
    lamppost: 'prop.lamppost-1',
  };
  // Color-specific wells if available
  if (propType === 'well') {
    const wellColors = ['blue', 'green', 'red'];
    if (wellColors.includes(color)) return `well.${color}`;
    return 'well.generic';
  }
  return PROP_MAP[propType] ?? 'prop.bulletin-board-1';
}

/** Stamp a rectangle of semantic tiles onto a flat layer array. */
function stampRect(
  layer: SemanticTile[],
  layerWidth: number,
  x: number,
  y: number,
  w: number,
  h: number,
  tile: SemanticTile,
): void {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const tx = x + dx;
      const ty = y + dy;
      if (tx >= 0 && ty >= 0) {
        const idx = ty * layerWidth + tx;
        if (idx < layer.length) {
          layer[idx] = tile;
        }
      }
    }
  }
}
