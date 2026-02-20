import type { PaletteSpec } from '../palette-builder.ts';

const TSX_BASE = 'assets/tilesets/depths/Tiled/Tilesets';
const TMX_TO_TSX = '../../../../assets/tilesets/depths/Tiled/Tilesets';

/**
 * Dungeon Depths palette.
 * Uses the classic dungeon tileset pack for Depths L1-L5 maps.
 *
 * All TSX files from the dungeon pack are included and assigned
 * firstgids in order. Terrain tilesets get Wang set mappings for
 * auto-tiling floors, walls, and water.
 */
export const dungeonDepthsSpec: PaletteSpec = {
  name: 'dungeon-depths',
  tsxBaseDir: TSX_BASE,
  tmxToTsxRelDir: TMX_TO_TSX,

  // Include TSX files: terrain tilesets first, then detail/prop/animation sheets.
  tsxFiles: [
    'Tileset_StoneFloor.tsx',
    'Tileset_Walls.tsx',
    'Tileset_FloorWallEdges.tsx',
    'Tileset_StagnantWaterBlue.tsx',
    'Tileset_StagnantWaterGreen.tsx',
    'Tileset_StagnantWaterRed.tsx',
    'Tileset_GeneralDetail.tsx',
    'Tileset_Doors.tsx',
    'Tileset_DoorExitEnter.tsx',
    'Tileset_JailDoor.tsx',
    'Tileset_FoliageOvergrowth.tsx',
    'Tileset_SewerDetails.tsx',
    'Animation_Candles.tsx',
    'Animation_BoxChest.tsx',
    'Tileset_Fog.tsx',
  ],

  // Terrain mappings (Wang set auto-tiling)
  terrains: {
    // --- Stone floors ---
    'floor.stone': {
      tilesetName: 'Tileset_StoneFloor',
      wangSetName: 'Dungeon Floor',
      colorName: 'Stone Floor',
    },
    'floor.dirt': {
      tilesetName: 'Tileset_StoneFloor',
      wangSetName: 'Dungeon Floor',
      colorName: 'Dirt Floor',
    },

    // --- Walls ---
    'wall.stone': {
      tilesetName: 'Tileset_Walls',
      wangSetName: 'Dungeon Walls',
      colorName: 'Stone Wall',
    },
    'wall.brick': {
      tilesetName: 'Tileset_Walls',
      wangSetName: 'Dungeon Walls',
      colorName: 'Brick Wall',
    },
    'wall.dark': {
      tilesetName: 'Tileset_Walls',
      wangSetName: 'Dungeon Walls',
      colorName: 'Dark Wall',
    },

    // --- Floor-wall transition edges ---
    'edge.floor-wall': {
      tilesetName: 'Tileset_FloorWallEdges',
      wangSetName: 'Floor Wall Edge',
      colorName: 'Wall Edge',
    },

    // --- Water: stagnant pools ---
    'water.deep': {
      tilesetName: 'Tileset_StagnantWaterBlue',
      wangSetName: 'Stagnant Water',
      colorName: 'Deep Water',
    },
    'water.toxic': {
      tilesetName: 'Tileset_StagnantWaterGreen',
      wangSetName: 'Stagnant Water',
      colorName: 'Toxic Water',
    },
    'water.blood': {
      tilesetName: 'Tileset_StagnantWaterRed',
      wangSetName: 'Stagnant Water',
      colorName: 'Blood Pool',
    },

    // Convenience aliases used in assemblages
    water: {
      tilesetName: 'Tileset_StagnantWaterBlue',
      wangSetName: 'Stagnant Water',
      colorName: 'Deep Water',
    },
    'water.shallow': {
      tilesetName: 'Tileset_StagnantWaterBlue',
      wangSetName: 'Stagnant Water',
      colorName: 'Deep Water',
    },
  },

  // Fixed tile mappings (non-auto-tiled individual tiles)
  fixed: {
    // --- Statues and columns (from general detail, row 0-1) ---
    'detail.statue-1': { tilesetName: 'Tileset_GeneralDetail', localTileId: 0 },
    'detail.statue-2': { tilesetName: 'Tileset_GeneralDetail', localTileId: 1 },
    'detail.statue-3': { tilesetName: 'Tileset_GeneralDetail', localTileId: 2 },
    'detail.statue-4': { tilesetName: 'Tileset_GeneralDetail', localTileId: 3 },
    'detail.column-1': { tilesetName: 'Tileset_GeneralDetail', localTileId: 7 },
    'detail.column-2': { tilesetName: 'Tileset_GeneralDetail', localTileId: 8 },
    'detail.column-3': { tilesetName: 'Tileset_GeneralDetail', localTileId: 9 },
    'detail.column-4': { tilesetName: 'Tileset_GeneralDetail', localTileId: 10 },

    // --- Potions and items (row 2) ---
    'detail.potion-red': { tilesetName: 'Tileset_GeneralDetail', localTileId: 14 },
    'detail.potion-blue': { tilesetName: 'Tileset_GeneralDetail', localTileId: 15 },
    'detail.potion-green': { tilesetName: 'Tileset_GeneralDetail', localTileId: 16 },
    'detail.gem-1': { tilesetName: 'Tileset_GeneralDetail', localTileId: 17 },
    'detail.gem-2': { tilesetName: 'Tileset_GeneralDetail', localTileId: 18 },
    'detail.coin-pile': { tilesetName: 'Tileset_GeneralDetail', localTileId: 19 },
    'detail.key': { tilesetName: 'Tileset_GeneralDetail', localTileId: 20 },

    // --- Bones and skulls (row 3-4) ---
    'detail.skull': { tilesetName: 'Tileset_GeneralDetail', localTileId: 21 },
    'detail.bones-1': { tilesetName: 'Tileset_GeneralDetail', localTileId: 22 },
    'detail.bones-2': { tilesetName: 'Tileset_GeneralDetail', localTileId: 23 },
    'detail.bones-3': { tilesetName: 'Tileset_GeneralDetail', localTileId: 24 },
    'detail.skeleton': { tilesetName: 'Tileset_GeneralDetail', localTileId: 28 },
    'detail.chains-1': { tilesetName: 'Tileset_GeneralDetail', localTileId: 29 },
    'detail.chains-2': { tilesetName: 'Tileset_GeneralDetail', localTileId: 30 },

    // --- Crates and barrels (rows 12-14) ---
    'detail.crate-1': { tilesetName: 'Tileset_GeneralDetail', localTileId: 84 },
    'detail.crate-2': { tilesetName: 'Tileset_GeneralDetail', localTileId: 85 },
    'detail.barrel-1': { tilesetName: 'Tileset_GeneralDetail', localTileId: 86 },
    'detail.barrel-2': { tilesetName: 'Tileset_GeneralDetail', localTileId: 87 },
    'detail.crate-stack-1': { tilesetName: 'Tileset_GeneralDetail', localTileId: 91 },
    'detail.crate-stack-2': { tilesetName: 'Tileset_GeneralDetail', localTileId: 92 },
    'detail.barrel-stack-1': { tilesetName: 'Tileset_GeneralDetail', localTileId: 93 },
    'detail.barrel-stack-2': { tilesetName: 'Tileset_GeneralDetail', localTileId: 94 },

    // --- Brick/masonry details (rows 14-15) ---
    'detail.brick-pile-1': { tilesetName: 'Tileset_GeneralDetail', localTileId: 98 },
    'detail.brick-pile-2': { tilesetName: 'Tileset_GeneralDetail', localTileId: 99 },
    'detail.rubble-1': { tilesetName: 'Tileset_GeneralDetail', localTileId: 100 },
    'detail.rubble-2': { tilesetName: 'Tileset_GeneralDetail', localTileId: 101 },

    // --- Doors (closed states, 2-tile-wide entries) ---
    'door.wood-top-l': { tilesetName: 'Tileset_Doors', localTileId: 0 },
    'door.wood-top-r': { tilesetName: 'Tileset_Doors', localTileId: 1 },
    'door.wood-bot-l': { tilesetName: 'Tileset_Doors', localTileId: 8 },
    'door.wood-bot-r': { tilesetName: 'Tileset_Doors', localTileId: 9 },
    'door.iron-top-l': { tilesetName: 'Tileset_Doors', localTileId: 2 },
    'door.iron-top-r': { tilesetName: 'Tileset_Doors', localTileId: 3 },
    'door.iron-bot-l': { tilesetName: 'Tileset_Doors', localTileId: 10 },
    'door.iron-bot-r': { tilesetName: 'Tileset_Doors', localTileId: 11 },
    'door.ornate-top-l': { tilesetName: 'Tileset_Doors', localTileId: 4 },
    'door.ornate-top-r': { tilesetName: 'Tileset_Doors', localTileId: 5 },
    'door.ornate-bot-l': { tilesetName: 'Tileset_Doors', localTileId: 12 },
    'door.ornate-bot-r': { tilesetName: 'Tileset_Doors', localTileId: 13 },

    // --- Exit/enter portals ---
    'door.exit-top': { tilesetName: 'Tileset_DoorExitEnter', localTileId: 0 },
    'door.enter-top': { tilesetName: 'Tileset_DoorExitEnter', localTileId: 1 },
    'door.portal-top': { tilesetName: 'Tileset_DoorExitEnter', localTileId: 2 },
    'door.exit-bot': { tilesetName: 'Tileset_DoorExitEnter', localTileId: 3 },
    'door.enter-bot': { tilesetName: 'Tileset_DoorExitEnter', localTileId: 4 },
    'door.portal-bot': { tilesetName: 'Tileset_DoorExitEnter', localTileId: 5 },

    // --- Jail bars ---
    'door.jail-top-l': { tilesetName: 'Tileset_JailDoor', localTileId: 0 },
    'door.jail-top-r': { tilesetName: 'Tileset_JailDoor', localTileId: 1 },
    'door.jail-bot-l': { tilesetName: 'Tileset_JailDoor', localTileId: 4 },
    'door.jail-bot-r': { tilesetName: 'Tileset_JailDoor', localTileId: 5 },
    'door.jail-open-top-l': { tilesetName: 'Tileset_JailDoor', localTileId: 2 },
    'door.jail-open-top-r': { tilesetName: 'Tileset_JailDoor', localTileId: 3 },
    'door.jail-open-bot-l': { tilesetName: 'Tileset_JailDoor', localTileId: 6 },
    'door.jail-open-bot-r': { tilesetName: 'Tileset_JailDoor', localTileId: 7 },

    // --- Foliage/overgrowth ---
    'foliage.vine-1': { tilesetName: 'Tileset_FoliageOvergrowth', localTileId: 0 },
    'foliage.vine-2': { tilesetName: 'Tileset_FoliageOvergrowth', localTileId: 1 },
    'foliage.vine-3': { tilesetName: 'Tileset_FoliageOvergrowth', localTileId: 2 },
    'foliage.moss-1': { tilesetName: 'Tileset_FoliageOvergrowth', localTileId: 7 },
    'foliage.moss-2': { tilesetName: 'Tileset_FoliageOvergrowth', localTileId: 8 },
    'foliage.fern-1': { tilesetName: 'Tileset_FoliageOvergrowth', localTileId: 14 },
    'foliage.fern-2': { tilesetName: 'Tileset_FoliageOvergrowth', localTileId: 15 },
    'foliage.mushroom-1': { tilesetName: 'Tileset_FoliageOvergrowth', localTileId: 21 },
    'foliage.mushroom-2': { tilesetName: 'Tileset_FoliageOvergrowth', localTileId: 22 },

    // --- Sewer pipes and grates ---
    'sewer.pipe-h': { tilesetName: 'Tileset_SewerDetails', localTileId: 0 },
    'sewer.pipe-v': { tilesetName: 'Tileset_SewerDetails', localTileId: 1 },
    'sewer.pipe-corner-tl': { tilesetName: 'Tileset_SewerDetails', localTileId: 2 },
    'sewer.pipe-corner-tr': { tilesetName: 'Tileset_SewerDetails', localTileId: 3 },
    'sewer.pipe-corner-bl': { tilesetName: 'Tileset_SewerDetails', localTileId: 4 },
    'sewer.pipe-corner-br': { tilesetName: 'Tileset_SewerDetails', localTileId: 5 },
    'sewer.grate-1': { tilesetName: 'Tileset_SewerDetails', localTileId: 7 },
    'sewer.grate-2': { tilesetName: 'Tileset_SewerDetails', localTileId: 8 },
    'sewer.drain': { tilesetName: 'Tileset_SewerDetails', localTileId: 9 },

    // --- Candle animations (first frame of each variant) ---
    'candle.single-1': { tilesetName: 'Animation_Candles', localTileId: 0 },
    'candle.single-2': { tilesetName: 'Animation_Candles', localTileId: 5 },
    'candle.double-1': { tilesetName: 'Animation_Candles', localTileId: 10 },
    'candle.double-2': { tilesetName: 'Animation_Candles', localTileId: 15 },
    'candle.triple-1': { tilesetName: 'Animation_Candles', localTileId: 20 },
    'candle.wall-1': { tilesetName: 'Animation_Candles', localTileId: 25 },
    'candle.wall-2': { tilesetName: 'Animation_Candles', localTileId: 30 },
    'candle.sconce-1': { tilesetName: 'Animation_Candles', localTileId: 35 },
    'candle.sconce-2': { tilesetName: 'Animation_Candles', localTileId: 40 },
    'candle.candelabra-1': { tilesetName: 'Animation_Candles', localTileId: 45 },
    'candle.candelabra-2': { tilesetName: 'Animation_Candles', localTileId: 50 },
    'candle.floor-1': { tilesetName: 'Animation_Candles', localTileId: 55 },
    'candle.floor-2': { tilesetName: 'Animation_Candles', localTileId: 60 },
    'candle.brazier': { tilesetName: 'Animation_Candles', localTileId: 65 },

    // --- Chest (animated) ---
    chest: { tilesetName: 'Animation_BoxChest', localTileId: 0 },

    // --- Fog overlay ---
    'fog.light': { tilesetName: 'Tileset_Fog', localTileId: 0 },
    'fog.medium': { tilesetName: 'Tileset_Fog', localTileId: 2 },
    'fog.dense': { tilesetName: 'Tileset_Fog', localTileId: 4 },
    'fog.wisps': { tilesetName: 'Tileset_Fog', localTileId: 6 },
  },
};
