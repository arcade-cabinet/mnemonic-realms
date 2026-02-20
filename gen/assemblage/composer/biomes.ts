/**
 * Biome System — Theme Definitions
 *
 * Each biome defines the visual recipe for its maps. In the Pokemon/FF
 * analogy: the building SHAPE is the archetype, but the COLOR/THEME
 * is the biome. Everwick is Red wood buildings on grass with brick roads.
 * Heartfield is Hay buildings on grass with dirt roads and wheat fields.
 *
 * The 10+ building atlas color variants prove the tileset artists designed
 * for exactly this pattern:
 *   Atlas_Buildings_Wood_Red, _Yellow, _Blue, _Green, _Purple, _Pink,
 *   _Orange, _Violet, _Indigo, _LightGreen, _Hay
 *
 * Each biome picks a building color, ground terrain, road style, scatter
 * objects, and edge treatment. The composer applies the biome to every
 * archetype it places.
 *
 * Architecture level: THEME (cross-cutting)
 */

// --- Biome types ---

/** Building color variant — maps to Atlas_Buildings_* tilesets */
export type BuildingColor =
  | 'red'
  | 'yellow'
  | 'blue'
  | 'green'
  | 'light-green'
  | 'purple'
  | 'violet'
  | 'pink'
  | 'orange'
  | 'indigo'
  | 'hay';

/** Scatter object definition for fill */
export interface ScatterRule {
  /** Object reference (e.g., 'tree.emerald-3', 'bush.emerald-1', 'rock.gray-2') */
  objectRef: string;
  /** Average count per 100 tiles */
  frequency: number;
  /** Minimum distance from other scatter objects (in tiles) */
  exclusionRadius: number;
  /** More likely near map edges? */
  preferEdges?: boolean;
  /** More likely near paths? */
  preferPaths?: boolean;
}

/** Path dressing rule */
export interface PathDressRule {
  /** Object to place alongside path */
  objectRef: string;
  /** Where to place relative to path */
  placement: 'alongside' | 'at-junctions' | 'at-ends';
  /** Spacing between objects (in tiles) */
  spacing: number;
}

/** Ground variant patch */
export interface GroundVariant {
  /** Terrain type for auto-tiling */
  terrain: string;
  /** 0-1 probability of appearing per candidate tile */
  frequency: number;
  /** Min/max patch size in tiles */
  clusterSize: [number, number];
}

/** Edge treatment for map borders */
export interface EdgeTreatment {
  /** What forms the edge */
  type: 'forest' | 'cliff' | 'water' | 'void' | 'wall' | 'none';
  /** Depth of the edge in tiles */
  depth: number;
  /** Whether connections cut gaps in the edge */
  gapForConnections: boolean;
}

/** Complete biome definition */
export interface BiomeDefinition {
  /** Unique biome ID */
  id: string;
  /** Human-readable name */
  name: string;

  // --- Buildings ---
  /** Primary building color for this biome */
  buildingColor: BuildingColor;
  /** Atlas TSX name for buildings */
  buildingAtlas: string;

  // --- Ground ---
  /** Default ground terrain (Wang set auto-tiled) */
  baseGround: string;
  /** Occasional terrain patches */
  groundVariants: GroundVariant[];

  // --- Roads ---
  /** Road terrain type */
  roadTerrain: string;
  /** Road width in tiles */
  roadWidth: number;
  /** Decorations along roads */
  pathDress: PathDressRule[];

  // --- Fill scatter ---
  /** Objects scattered across empty space */
  scatter: ScatterRule[];

  // --- Edges ---
  /** Edge treatment per direction (default applied to all) */
  defaultEdge: EdgeTreatment;

  // --- Scene template ---
  /** Reference archetype to use as base layout template */
  sceneTemplate?: string;
}

// --- Biome definitions ---

export const BIOMES: Record<string, BiomeDefinition> = {
  farmland: {
    id: 'farmland',
    name: 'Farmland',
    buildingColor: 'hay',
    buildingAtlas: 'Atlas_Buildings_Hay',
    baseGround: 'ground.grass',
    groundVariants: [
      { terrain: 'ground.dark-grass', frequency: 0.15, clusterSize: [3, 8] },
      { terrain: 'ground.light-grass', frequency: 0.05, clusterSize: [2, 4] },
    ],
    roadTerrain: 'road.dirt',
    roadWidth: 3,
    pathDress: [
      { objectRef: 'fence.wood-1', placement: 'alongside', spacing: 1 },
      { objectRef: 'prop.lamppost-1', placement: 'at-junctions', spacing: 8 },
    ],
    scatter: [
      { objectRef: 'tree.emerald-3', frequency: 4, exclusionRadius: 3, preferEdges: true },
      { objectRef: 'tree.emerald-2', frequency: 2, exclusionRadius: 3, preferEdges: true },
      { objectRef: 'bush.emerald-1', frequency: 3, exclusionRadius: 2 },
      { objectRef: 'flower.wild-1', frequency: 2, exclusionRadius: 1 },
      { objectRef: 'rock.gray-1', frequency: 1, exclusionRadius: 4 },
    ],
    defaultEdge: { type: 'forest', depth: 3, gapForConnections: true },
    sceneTemplate: 'farm-shore',
  },

  village: {
    id: 'village',
    name: 'Village',
    buildingColor: 'red',
    buildingAtlas: 'Atlas_Buildings_Wood_Red',
    baseGround: 'ground.grass',
    groundVariants: [{ terrain: 'ground.light-grass', frequency: 0.1, clusterSize: [2, 5] }],
    roadTerrain: 'road.brick',
    roadWidth: 3,
    pathDress: [
      { objectRef: 'prop.lamppost-1', placement: 'alongside', spacing: 8 },
      { objectRef: 'prop.signpost-1', placement: 'at-junctions', spacing: 0 },
    ],
    scatter: [
      { objectRef: 'tree.emerald-3', frequency: 3, exclusionRadius: 3 },
      { objectRef: 'bush.emerald-1', frequency: 2, exclusionRadius: 2 },
      { objectRef: 'flower.garden-1', frequency: 3, exclusionRadius: 1, preferPaths: true },
    ],
    defaultEdge: { type: 'forest', depth: 4, gapForConnections: true },
    sceneTemplate: 'village-bridge',
  },

  forest: {
    id: 'forest',
    name: 'Forest',
    buildingColor: 'green',
    buildingAtlas: 'Atlas_Buildings_Wood_Green',
    baseGround: 'ground.dark-grass',
    groundVariants: [
      { terrain: 'ground.grass', frequency: 0.2, clusterSize: [3, 6] },
      { terrain: 'ground.dirt', frequency: 0.05, clusterSize: [2, 3] },
    ],
    roadTerrain: 'road.dirt',
    roadWidth: 2,
    pathDress: [],
    scatter: [
      { objectRef: 'tree.emerald-4', frequency: 12, exclusionRadius: 2 },
      { objectRef: 'tree.emerald-3', frequency: 8, exclusionRadius: 2 },
      { objectRef: 'tree.emerald-2', frequency: 5, exclusionRadius: 2 },
      { objectRef: 'bush.emerald-2', frequency: 6, exclusionRadius: 1 },
      { objectRef: 'mushroom.red-1', frequency: 2, exclusionRadius: 3 },
      { objectRef: 'rock.moss-1', frequency: 2, exclusionRadius: 4 },
    ],
    defaultEdge: { type: 'forest', depth: 5, gapForConnections: true },
  },

  mountain: {
    id: 'mountain',
    name: 'Mountain',
    buildingColor: 'blue',
    buildingAtlas: 'Atlas_Buildings_Wood_Blue',
    baseGround: 'ground.light-grass',
    groundVariants: [
      { terrain: 'ground.grass', frequency: 0.15, clusterSize: [3, 6] },
      { terrain: 'ground.dirt', frequency: 0.1, clusterSize: [2, 4] },
    ],
    roadTerrain: 'road.stone',
    roadWidth: 2,
    pathDress: [{ objectRef: 'prop.signpost-1', placement: 'at-junctions', spacing: 0 }],
    scatter: [
      { objectRef: 'rock.gray-2', frequency: 6, exclusionRadius: 3 },
      { objectRef: 'rock.gray-1', frequency: 4, exclusionRadius: 2 },
      { objectRef: 'tree.pine-2', frequency: 3, exclusionRadius: 3, preferEdges: true },
      { objectRef: 'bush.dry-1', frequency: 2, exclusionRadius: 2 },
    ],
    defaultEdge: { type: 'cliff', depth: 4, gapForConnections: true },
    sceneTemplate: 'mountain-village',
  },

  marsh: {
    id: 'marsh',
    name: 'Marsh',
    buildingColor: 'purple',
    buildingAtlas: 'Atlas_Buildings_Wood_Purple',
    baseGround: 'ground.dark-grass',
    groundVariants: [
      { terrain: 'water.shallow', frequency: 0.2, clusterSize: [3, 8] },
      { terrain: 'ground.mud', frequency: 0.15, clusterSize: [2, 5] },
    ],
    roadTerrain: 'road.plank',
    roadWidth: 2,
    pathDress: [],
    scatter: [
      { objectRef: 'tree.dead-1', frequency: 4, exclusionRadius: 3 },
      { objectRef: 'reed.tall-1', frequency: 6, exclusionRadius: 1 },
      { objectRef: 'mushroom.purple-1', frequency: 2, exclusionRadius: 3 },
      { objectRef: 'marsh-grass.1', frequency: 4, exclusionRadius: 1 },
    ],
    defaultEdge: { type: 'water', depth: 3, gapForConnections: true },
  },

  desert: {
    id: 'desert',
    name: 'Desert',
    buildingColor: 'yellow',
    buildingAtlas: 'Atlas_Buildings_Wood_Yellow',
    baseGround: 'ground.sand',
    groundVariants: [{ terrain: 'ground.light-sand', frequency: 0.1, clusterSize: [3, 6] }],
    roadTerrain: 'road.sand',
    roadWidth: 3,
    pathDress: [],
    scatter: [
      { objectRef: 'cactus.1', frequency: 2, exclusionRadius: 5 },
      { objectRef: 'rock.sandstone-1', frequency: 3, exclusionRadius: 4 },
      { objectRef: 'bush.dry-1', frequency: 2, exclusionRadius: 3 },
    ],
    defaultEdge: { type: 'cliff', depth: 3, gapForConnections: true },
    sceneTemplate: 'desert-town',
  },

  snow: {
    id: 'snow',
    name: 'Snow',
    buildingColor: 'indigo',
    buildingAtlas: 'Atlas_Buildings_Wood_Indigo',
    baseGround: 'ground.snow',
    groundVariants: [
      { terrain: 'ground.ice', frequency: 0.1, clusterSize: [2, 5] },
      { terrain: 'ground.snow-light', frequency: 0.1, clusterSize: [3, 6] },
    ],
    roadTerrain: 'road.stone',
    roadWidth: 2,
    pathDress: [],
    scatter: [
      { objectRef: 'tree.snow-pine-2', frequency: 5, exclusionRadius: 3 },
      { objectRef: 'rock.snow-1', frequency: 3, exclusionRadius: 3 },
      { objectRef: 'snowdrift.1', frequency: 4, exclusionRadius: 2 },
    ],
    defaultEdge: { type: 'cliff', depth: 4, gapForConnections: true },
    sceneTemplate: 'frost-peak',
  },

  dungeon: {
    id: 'dungeon',
    name: 'Dungeon',
    buildingColor: 'violet',
    buildingAtlas: 'Atlas_Buildings_Wood_Violet',
    baseGround: 'ground.stone',
    groundVariants: [
      { terrain: 'ground.dark-stone', frequency: 0.15, clusterSize: [2, 4] },
      { terrain: 'water.deep', frequency: 0.05, clusterSize: [3, 6] },
    ],
    roadTerrain: 'road.stone',
    roadWidth: 3,
    pathDress: [],
    scatter: [
      { objectRef: 'crystal.blue-1', frequency: 1, exclusionRadius: 6 },
      { objectRef: 'rubble.1', frequency: 3, exclusionRadius: 3 },
      { objectRef: 'bone.1', frequency: 1, exclusionRadius: 5 },
    ],
    defaultEdge: { type: 'wall', depth: 2, gapForConnections: false },
  },

  sketch: {
    id: 'sketch',
    name: 'Sketch Realm',
    buildingColor: 'orange',
    buildingAtlas: 'Atlas_Buildings_Wood_Orange',
    baseGround: 'ground.sand',
    groundVariants: [
      { terrain: 'void', frequency: 0.1, clusterSize: [2, 6] },
      { terrain: 'ground.light-sand', frequency: 0.1, clusterSize: [3, 5] },
    ],
    roadTerrain: 'road.faint',
    roadWidth: 2,
    pathDress: [],
    scatter: [
      { objectRef: 'outline.tree-1', frequency: 2, exclusionRadius: 4 },
      { objectRef: 'outline.rock-1', frequency: 2, exclusionRadius: 4 },
      { objectRef: 'sketch.fragment-1', frequency: 1, exclusionRadius: 5 },
    ],
    defaultEdge: { type: 'void', depth: 3, gapForConnections: true },
  },
};

/**
 * Get a biome definition by ID.
 */
export function getBiome(id: string): BiomeDefinition {
  const biome = BIOMES[id];
  if (!biome) {
    throw new Error(`Unknown biome: ${id}. Available: ${Object.keys(BIOMES).join(', ')}`);
  }
  return biome;
}

/**
 * Get the building atlas TSX path for a biome.
 */
export function getBuildingAtlasPath(biome: BiomeDefinition): string {
  return `exteriors/premium/Tiled/Tilesets/${biome.buildingAtlas}.tsx`;
}

/**
 * Map a building color to the corresponding atlas name.
 */
export function colorToAtlas(color: BuildingColor): string {
  if (color === 'hay') return 'Atlas_Buildings_Hay';
  const cap = color
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return `Atlas_Buildings_Wood_${cap}`;
}
