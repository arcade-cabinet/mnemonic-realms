import type { PaletteSpec } from '../palette-builder.ts';

const TSX_BASE = 'assets/tilesets/world/tiles/Tiled/Tilesets';
const TMX_TO_TSX = '../../../../assets/tilesets/world/tiles/Tiled/Tilesets';

/**
 * World Map palette.
 * Uses the world map tileset pack for the overworld / region map.
 * Includes summer and winter terrain variants, a merger tileset
 * for seasonal transition tiles, clouds/fog-of-war overlay,
 * animated water, and boat/wagon unit sprites.
 *
 * Terrain mappings are placeholders -- the world map tiles
 * are simple grid-based sheets without Wang set auto-tiling.
 * Wang sets should be defined in the TSX files after visual
 * inspection to enable auto-tiling for terrain transitions.
 */
export const worldMapSpec: PaletteSpec = {
  name: 'world-map',
  tsxBaseDir: TSX_BASE,
  tmxToTsxRelDir: TMX_TO_TSX,

  tsxFiles: [
    'Tileset_WorldMap_Summer.tsx',
    'Tileset_WorldMap_Winter.tsx',
    'Tileset_WorldMap_Merger.tsx',
    'Tileset_Clouds_FogOfWar.tsx',
    'Objects_Boat_Wagon.tsx',
    'Animation_SimpleWater.tsx',
  ],

  // Terrain mappings placeholder -- requires Wang set definitions in TSX.
  terrains: {},

  // Fixed tile mappings for world map terrain types.
  // The summer and winter sheets are 7 columns wide (112px / 16px).
  // localTileId values are representative; refine after visual inspection.
  fixed: {
    // Summer terrain (112x320, 7 columns, 20 rows)
    'terrain.summer-grass': { tilesetName: 'Tileset_WorldMap_Summer', localTileId: 0 },
    'terrain.summer-forest': { tilesetName: 'Tileset_WorldMap_Summer', localTileId: 1 },
    'terrain.summer-mountain': { tilesetName: 'Tileset_WorldMap_Summer', localTileId: 2 },
    'terrain.summer-water': { tilesetName: 'Tileset_WorldMap_Summer', localTileId: 3 },
    'terrain.summer-desert': { tilesetName: 'Tileset_WorldMap_Summer', localTileId: 4 },
    'terrain.summer-road': { tilesetName: 'Tileset_WorldMap_Summer', localTileId: 5 },
    'terrain.summer-village': { tilesetName: 'Tileset_WorldMap_Summer', localTileId: 6 },

    // Winter terrain (112x320, 7 columns, 20 rows)
    'terrain.winter-snow': { tilesetName: 'Tileset_WorldMap_Winter', localTileId: 0 },
    'terrain.winter-forest': { tilesetName: 'Tileset_WorldMap_Winter', localTileId: 1 },
    'terrain.winter-mountain': { tilesetName: 'Tileset_WorldMap_Winter', localTileId: 2 },
    'terrain.winter-ice': { tilesetName: 'Tileset_WorldMap_Winter', localTileId: 3 },
    'terrain.winter-tundra': { tilesetName: 'Tileset_WorldMap_Winter', localTileId: 4 },
    'terrain.winter-road': { tilesetName: 'Tileset_WorldMap_Winter', localTileId: 5 },
    'terrain.winter-village': { tilesetName: 'Tileset_WorldMap_Winter', localTileId: 6 },

    // Merger tiles for summer/winter transitions (112x112, 7 columns)
    'terrain.merger-1': { tilesetName: 'Tileset_WorldMap_Merger', localTileId: 0 },
    'terrain.merger-2': { tilesetName: 'Tileset_WorldMap_Merger', localTileId: 1 },
    'terrain.merger-3': { tilesetName: 'Tileset_WorldMap_Merger', localTileId: 2 },

    // Clouds / fog-of-war overlay (112x112, 7 columns)
    'fog.cloud-1': { tilesetName: 'Tileset_Clouds_FogOfWar', localTileId: 0 },
    'fog.cloud-2': { tilesetName: 'Tileset_Clouds_FogOfWar', localTileId: 1 },
    'fog.cloud-edge-n': { tilesetName: 'Tileset_Clouds_FogOfWar', localTileId: 7 },
    'fog.cloud-edge-s': { tilesetName: 'Tileset_Clouds_FogOfWar', localTileId: 14 },
    'fog.cloud-full': { tilesetName: 'Tileset_Clouds_FogOfWar', localTileId: 8 },

    // Boat and wagon units (64x48, 4 columns)
    'unit.boat-1': { tilesetName: 'Objects_Boat_Wagon', localTileId: 0 },
    'unit.boat-2': { tilesetName: 'Objects_Boat_Wagon', localTileId: 1 },
    'unit.wagon-1': { tilesetName: 'Objects_Boat_Wagon', localTileId: 4 },
    'unit.wagon-2': { tilesetName: 'Objects_Boat_Wagon', localTileId: 5 },
  },
};
