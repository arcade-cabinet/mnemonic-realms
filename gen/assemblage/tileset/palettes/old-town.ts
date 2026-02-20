import type { PaletteSpec } from '../palette-builder.ts';

const EXT_TSX_BASE = 'assets/tilesets/old-town/exteriors/Tiled/Tilesets';
const INT_TSX_BASE = 'assets/tilesets/old-town/interiors/Tiled/Tilesets';
const TMX_TO_EXT_TSX = '../../../../assets/tilesets/old-town/exteriors/Tiled/Tilesets';
const TMX_TO_INT_TSX = '../../../../assets/tilesets/old-town/interiors/Tiled/Tilesets';

/**
 * Old Town Outdoor palette.
 * Uses the old-town outdoor tileset pack for rustic stone, stucco,
 * and wood building facades. Suitable for aged village districts,
 * market quarters, and working-class neighborhoods within Everwick
 * or other settlements.
 *
 * These tilesets lack Wang set auto-tiling data. Terrain mappings
 * will need to be added once the tileset contents are visually
 * inspected and Wang colors are defined in the TSX files.
 */
export const oldTownExteriorSpec: PaletteSpec = {
  name: 'old-town-exterior',
  tsxBaseDir: EXT_TSX_BASE,
  tmxToTsxRelDir: TMX_TO_EXT_TSX,

  tsxFiles: [
    'Old_Town_STONE_BUILDING.tsx',
    'Old_Town_STUCCO_BUILDING.tsx',
    'Old_Town_WOOD_BUILDING.tsx',
    'Old_Town_EXTRAS.tsx',
  ],

  // Terrain mappings placeholder -- requires Wang set definitions in TSX.
  // These are the expected semantic terrains once Wang data is added:
  terrains: {},

  // Fixed tile mappings for individual building tiles.
  // localTileId values below are representative starting points;
  // refine after visual inspection of the PNG grid layout.
  fixed: {
    // Stone building tiles (row-major from 128x272 grid, 8 columns)
    'building.stone-wall-tl': { tilesetName: 'Old_Town_STONE_BUILDING', localTileId: 0 },
    'building.stone-wall-tc': { tilesetName: 'Old_Town_STONE_BUILDING', localTileId: 1 },
    'building.stone-wall-tr': { tilesetName: 'Old_Town_STONE_BUILDING', localTileId: 2 },
    'building.stone-wall-ml': { tilesetName: 'Old_Town_STONE_BUILDING', localTileId: 8 },
    'building.stone-wall-mc': { tilesetName: 'Old_Town_STONE_BUILDING', localTileId: 9 },
    'building.stone-wall-mr': { tilesetName: 'Old_Town_STONE_BUILDING', localTileId: 10 },

    // Stucco building tiles
    'building.stucco-wall-tl': { tilesetName: 'Old_Town_STUCCO_BUILDING', localTileId: 0 },
    'building.stucco-wall-tc': { tilesetName: 'Old_Town_STUCCO_BUILDING', localTileId: 1 },
    'building.stucco-wall-tr': { tilesetName: 'Old_Town_STUCCO_BUILDING', localTileId: 2 },
    'building.stucco-wall-ml': { tilesetName: 'Old_Town_STUCCO_BUILDING', localTileId: 8 },
    'building.stucco-wall-mc': { tilesetName: 'Old_Town_STUCCO_BUILDING', localTileId: 9 },
    'building.stucco-wall-mr': { tilesetName: 'Old_Town_STUCCO_BUILDING', localTileId: 10 },

    // Wood building tiles
    'building.wood-wall-tl': { tilesetName: 'Old_Town_WOOD_BUILDING', localTileId: 0 },
    'building.wood-wall-tc': { tilesetName: 'Old_Town_WOOD_BUILDING', localTileId: 1 },
    'building.wood-wall-tr': { tilesetName: 'Old_Town_WOOD_BUILDING', localTileId: 2 },
    'building.wood-wall-ml': { tilesetName: 'Old_Town_WOOD_BUILDING', localTileId: 8 },
    'building.wood-wall-mc': { tilesetName: 'Old_Town_WOOD_BUILDING', localTileId: 9 },
    'building.wood-wall-mr': { tilesetName: 'Old_Town_WOOD_BUILDING', localTileId: 10 },

    // Extras (props, decorations, rooftops from 112x480 grid, 7 columns)
    'extra.chimney': { tilesetName: 'Old_Town_EXTRAS', localTileId: 0 },
    'extra.window-1': { tilesetName: 'Old_Town_EXTRAS', localTileId: 7 },
    'extra.window-2': { tilesetName: 'Old_Town_EXTRAS', localTileId: 8 },
    'extra.door-1': { tilesetName: 'Old_Town_EXTRAS', localTileId: 14 },
    'extra.sign-1': { tilesetName: 'Old_Town_EXTRAS', localTileId: 21 },
  },
};

/**
 * Old Town Child World palette — the palette for old-town child world tilesets.
 * Uses the old-town indoor tileset pack for child world maps:
 * floors (wood, stone, carpet), walls, wall tops, detail objects,
 * and water channels. Suitable for shops, inns, houses, and
 * underground passages.
 *
 * Terrain mappings are placeholders -- requires Wang set definitions
 * in TSX files after visual inspection.
 */
export const oldTownInteriorSpec: PaletteSpec = {
  name: 'old-town-interior',
  tsxBaseDir: INT_TSX_BASE,
  tmxToTsxRelDir: TMX_TO_INT_TSX,

  tsxFiles: [
    'Tileset_Floor_Wood.tsx',
    'Tileset_Floor_Stone.tsx',
    'Tileset_Floor_Carpet.tsx',
    'Tileset_Floor_Carpet_Grey.tsx',
    'Tileset_Wall_Tiles.tsx',
    'Tileset_Wall_Tops.tsx',
    'Tileset_Detail_Objects.tsx',
    'Tileset_Water_Channel.tsx',
    'Animation_Water_Tiles.tsx',
  ],

  // Terrain mappings placeholder -- requires Wang set definitions in TSX.
  terrains: {},

  // Fixed tile mappings for individual child world tiles.
  fixed: {
    // Wood floor tiles (112x240, 7 columns)
    'floor.wood-plain': { tilesetName: 'Tileset_Floor_Wood', localTileId: 0 },
    'floor.wood-plank': { tilesetName: 'Tileset_Floor_Wood', localTileId: 1 },
    'floor.wood-dark': { tilesetName: 'Tileset_Floor_Wood', localTileId: 7 },

    // Stone floor tiles (112x240, 7 columns)
    'floor.stone-plain': { tilesetName: 'Tileset_Floor_Stone', localTileId: 0 },
    'floor.stone-cracked': { tilesetName: 'Tileset_Floor_Stone', localTileId: 1 },
    'floor.stone-mossy': { tilesetName: 'Tileset_Floor_Stone', localTileId: 7 },

    // Carpet tiles (112x112, 7 columns)
    'floor.carpet-red': { tilesetName: 'Tileset_Floor_Carpet', localTileId: 0 },
    'floor.carpet-grey': { tilesetName: 'Tileset_Floor_Carpet_Grey', localTileId: 0 },

    // Wall tiles (96x384, 6 columns)
    'wall.interior-plain': { tilesetName: 'Tileset_Wall_Tiles', localTileId: 0 },
    'wall.interior-brick': { tilesetName: 'Tileset_Wall_Tiles', localTileId: 6 },

    // Wall tops (112x256, 7 columns)
    'wall.top-plain': { tilesetName: 'Tileset_Wall_Tops', localTileId: 0 },
    'wall.top-ornate': { tilesetName: 'Tileset_Wall_Tops', localTileId: 7 },

    // Detail objects (112x592, 7 columns -- furniture, shelves, etc.)
    'detail.table': { tilesetName: 'Tileset_Detail_Objects', localTileId: 0 },
    'detail.chair': { tilesetName: 'Tileset_Detail_Objects', localTileId: 1 },
    'detail.shelf': { tilesetName: 'Tileset_Detail_Objects', localTileId: 7 },
    'detail.barrel': { tilesetName: 'Tileset_Detail_Objects', localTileId: 14 },
    'detail.crate': { tilesetName: 'Tileset_Detail_Objects', localTileId: 15 },
    'detail.bed': { tilesetName: 'Tileset_Detail_Objects', localTileId: 21 },

    // Water channel (112x112, 7 columns)
    'water.channel': { tilesetName: 'Tileset_Water_Channel', localTileId: 0 },
  },
};
