import type { PaletteSpec } from '../palette-builder.ts';

const TSX_BASE = 'assets/tilesets/exteriors/premium/Tiled/Tilesets';
const TMX_TO_TSX = '../../../assets/tilesets/exteriors/premium/Tiled/Tilesets';

/**
 * Village Premium palette.
 * Uses the fantasy-premium exterior tileset pack for Everwick,
 * Heartfield, Ambergrove, Millbrook, and Sunridge maps.
 *
 * All TSX files from the premium pack are included and assigned
 * firstgids in order. Only the ones with Wang sets get terrain mappings.
 */
export const villagePremiumSpec: PaletteSpec = {
  name: 'village-premium',
  tsxBaseDir: TSX_BASE,
  tmxToTsxRelDir: TMX_TO_TSX,

  // Include TSX files in the same order as the reference Village Bridge TMX.
  // Object collections first (lower firstgids), then grid tilesets.
  tsxFiles: [
    'Objects_Buildings.tsx',
    'Objects_Props.tsx',
    'Objects_Trees.tsx',
    'Objects_Rocks.tsx',
    'Objects_Shadows.tsx',
    'Objects_CityWalls.tsx',
    'Atlas_Buildings_Bridges.tsx',
    'Atlas_Buildings_Hay.tsx',
    'Atlas_Buildings_Wood_Blue.tsx',
    'Atlas_Buildings_Wood_Green.tsx',
    'Atlas_Buildings_Wood_Indigo.tsx',
    'Atlas_Buildings_Wood_LightGreen.tsx',
    'Atlas_Buildings_Wood_Orange.tsx',
    'Atlas_Buildings_Wood_Pink.tsx',
    'Atlas_Buildings_Wood_Purple.tsx',
    'Atlas_Buildings_Wood_Red.tsx',
    'Atlas_Buildings_Wood_Violet.tsx',
    'Atlas_Buildings_Wood_Yellow.tsx',
    'Atlas_MapBackgrounds.tsx',
    'Atlas_Props.tsx',
    'Atlas_Rocks.tsx',
    'Atlas_Trees_Bushes.tsx',
    'Tileset_Ground.tsx',
    'Tileset_Water.tsx',
    'Tileset_Road.tsx',
    'Tileset_Sand.tsx',
    'Tileset_TallGrass.tsx',
    'Tileset_FarmField.tsx',
    'Tileset_Shadow.tsx',
    'Tileset_Wall_1.tsx',
    'Tileset_CityWalls.tsx',
    'Tileset_Fence_1.tsx',
    'Tileset_Fence_2.tsx',
    'Tileset_RockSlope_1_Brown.tsx',
    'Tileset_RockSlope_1_Gray.tsx',
    'Tileset_RockSlope_2_Brown.tsx',
    'Tileset_RockSlope_2_Gray.tsx',
    'Animation_Campfire.tsx',
    'Animation_Fountain_1.tsx',
    'Animation_Flowers.tsx',
    'Animation_Waterfall.tsx',
    'Animation_Torch_1.tsx',
    'Animation_Banner_1.tsx',
    'Animation_Banner_3.tsx',
    'Animation_MagicCrystal.tsx',
    'Animation_MarketStand_1.tsx',
    'Animation_MarketStand_2.tsx',
    'Animation_CandleHolder_Gold_4.tsx',
    'Animation_CandleHolder_Gold_Short_4.tsx',
    'Animation_CandleHolder_Steel_4.tsx',
    'Animation_CandleHolder_Steel_Short_4.tsx',
  ],

  // Terrain mappings (Wang set auto-tiling)
  terrains: {
    // Ground terrains
    'ground.grass': { tilesetName: 'Tileset_Ground', wangSetName: 'Grounds', colorName: 'Grass' },
    'ground.light-grass': {
      tilesetName: 'Tileset_Ground',
      wangSetName: 'Grounds',
      colorName: 'Light Grass',
    },
    'ground.dark-grass': {
      tilesetName: 'Tileset_Ground',
      wangSetName: 'Grounds',
      colorName: 'Dark Grass',
    },
    'ground.dirt': { tilesetName: 'Tileset_Ground', wangSetName: 'Grounds', colorName: 'Dirt' },
    'ground.autumn': {
      tilesetName: 'Tileset_Ground',
      wangSetName: 'Grounds',
      colorName: 'Autumns Grass',
    },
    'ground.cherry': {
      tilesetName: 'Tileset_Ground',
      wangSetName: 'Grounds',
      colorName: 'Cherry Grass',
    },

    // Water
    water: { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },

    // Roads
    road: { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Road' },
    'road.brick': { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Brick Road' },
    'road.dark-brick': {
      tilesetName: 'Tileset_Road',
      wangSetName: 'Road',
      colorName: 'Dark Brick Road',
    },

    // Tall grass / vegetation
    tallgrass: {
      tilesetName: 'Tileset_TallGrass',
      wangSetName: 'Tall Grass',
      colorName: 'Tall Grass',
    },
    'tallgrass.flower': {
      tilesetName: 'Tileset_TallGrass',
      wangSetName: 'Tall Grass',
      colorName: 'Flower Grass',
    },
    'tallgrass.hay': {
      tilesetName: 'Tileset_TallGrass',
      wangSetName: 'Tall Grass',
      colorName: 'Hay',
    },

    // Farm fields
    farm: { tilesetName: 'Tileset_FarmField', wangSetName: 'Farm Fields', colorName: 'Farm Field' },

    // Shadows
    'shadow.light': {
      tilesetName: 'Tileset_Shadow',
      wangSetName: 'Shadow',
      colorName: 'Shadow (25%)',
    },
    'shadow.full': {
      tilesetName: 'Tileset_Shadow',
      wangSetName: 'Shadow',
      colorName: 'Shadow (100%)',
    },

    // Fences
    fence: { tilesetName: 'Tileset_Fence_1', wangSetName: 'Fence', colorName: 'Fence 1' },
    'fence.2': { tilesetName: 'Tileset_Fence_2', wangSetName: 'Fence 2', colorName: 'Fence 2' },

    // Walls
    wall: { tilesetName: 'Tileset_Wall_1', wangSetName: 'Wall 1', colorName: 'Wall 1' },

    // Rock slopes (cliffs/elevation)
    'cliff.brown': {
      tilesetName: 'Tileset_RockSlope_1_Brown',
      wangSetName: 'Rock Slope 1',
      colorName: 'Rock Slope',
    },
    'cliff.gray': {
      tilesetName: 'Tileset_RockSlope_1_Gray',
      wangSetName: 'Rock Slope 1',
      colorName: 'Rock Slope',
    },

    // Beach/sand
    sand: { tilesetName: 'Tileset_Sand', wangSetName: 'Beach', colorName: 'Sand' },
    sea: { tilesetName: 'Tileset_Sand', wangSetName: 'Beach', colorName: 'Sea' },
  },

  // Object mappings (buildings, trees, props from collection tilesets)
  objects: {
    // --- Houses: BlueWood ---
    'house.blue-small-1': { tilesetName: 'Objects_Buildings', localTileId: 341 },
    'house.blue-small-2': { tilesetName: 'Objects_Buildings', localTileId: 342 },
    'house.blue-medium-1': { tilesetName: 'Objects_Buildings', localTileId: 346 },
    'house.blue-medium-2': { tilesetName: 'Objects_Buildings', localTileId: 347 },
    'house.blue-medium-alt-1': { tilesetName: 'Objects_Buildings', localTileId: 349 },
    'house.blue-large-1': { tilesetName: 'Objects_Buildings', localTileId: 352 },
    'house.blue-large-2': { tilesetName: 'Objects_Buildings', localTileId: 353 },
    'house.blue-large-3': { tilesetName: 'Objects_Buildings', localTileId: 354 },
    'house.blue-large-4': { tilesetName: 'Objects_Buildings', localTileId: 355 },

    // --- Houses: RedWood ---
    'house.red-small-1': { tilesetName: 'Objects_Buildings', localTileId: 449 },
    'house.red-small-2': { tilesetName: 'Objects_Buildings', localTileId: 450 },
    'house.red-medium-1': { tilesetName: 'Objects_Buildings', localTileId: 454 },
    'house.red-medium-2': { tilesetName: 'Objects_Buildings', localTileId: 455 },
    'house.red-medium-alt-1': { tilesetName: 'Objects_Buildings', localTileId: 457 },
    'house.red-large-1': { tilesetName: 'Objects_Buildings', localTileId: 460 },
    'house.red-large-2': { tilesetName: 'Objects_Buildings', localTileId: 461 },

    // --- Houses: GreenWood ---
    'house.green-small-1': { tilesetName: 'Objects_Buildings', localTileId: 373 },
    'house.green-small-2': { tilesetName: 'Objects_Buildings', localTileId: 374 },
    'house.green-medium-1': { tilesetName: 'Objects_Buildings', localTileId: 378 },
    'house.green-medium-2': { tilesetName: 'Objects_Buildings', localTileId: 379 },
    'house.green-medium-alt-1': { tilesetName: 'Objects_Buildings', localTileId: 381 },
    'house.green-large-1': { tilesetName: 'Objects_Buildings', localTileId: 384 },

    // --- Houses: Hay ---
    'house.hay-small-1': { tilesetName: 'Objects_Buildings', localTileId: 310 },
    'house.hay-medium-1': { tilesetName: 'Objects_Buildings', localTileId: 315 },
    'house.hay-large-1': { tilesetName: 'Objects_Buildings', localTileId: 321 },

    // --- Wells ---
    'well.generic': { tilesetName: 'Objects_Buildings', localTileId: 291 },
    'well.blue': { tilesetName: 'Objects_Buildings', localTileId: 293 },
    'well.green': { tilesetName: 'Objects_Buildings', localTileId: 294 },
    'well.red': { tilesetName: 'Objects_Buildings', localTileId: 296 },

    // --- Market Stands ---
    'market.stand-1': { tilesetName: 'Objects_Buildings', localTileId: 285 },
    'market.stand-2': { tilesetName: 'Objects_Buildings', localTileId: 286 },

    // --- Shelters ---
    'shelter.hay': { tilesetName: 'Objects_Buildings', localTileId: 304 },
    'shelter.blue': { tilesetName: 'Objects_Buildings', localTileId: 305 },

    // --- Trees: Emerald ---
    'tree.emerald-1': { tilesetName: 'Objects_Trees', localTileId: 32 }, // 64x63
    'tree.emerald-2': { tilesetName: 'Objects_Trees', localTileId: 0 }, // 46x63
    'tree.emerald-3': { tilesetName: 'Objects_Trees', localTileId: 1 }, // 52x92
    'tree.emerald-4': { tilesetName: 'Objects_Trees', localTileId: 2 }, // 48x93
    'tree.emerald-5': { tilesetName: 'Objects_Trees', localTileId: 82 }, // 97x124 (large)
    'tree.emerald-6': { tilesetName: 'Objects_Trees', localTileId: 103 }, // 80x110

    // --- Trees: Light ---
    'tree.light-1': { tilesetName: 'Objects_Trees', localTileId: 3 },
    'tree.light-2': { tilesetName: 'Objects_Trees', localTileId: 4 },
    'tree.light-3': { tilesetName: 'Objects_Trees', localTileId: 5 },

    // --- Trees: Dark ---
    'tree.dark-1': { tilesetName: 'Objects_Trees', localTileId: 28 },
    'tree.dark-2': { tilesetName: 'Objects_Trees', localTileId: 29 },
    'tree.dark-3': { tilesetName: 'Objects_Trees', localTileId: 30 },

    // --- Bushes ---
    'bush.emerald-1': { tilesetName: 'Objects_Trees', localTileId: 14 }, // 40x29
    'bush.emerald-2': { tilesetName: 'Objects_Trees', localTileId: 15 },
    'bush.emerald-3': { tilesetName: 'Objects_Trees', localTileId: 16 },
    'bush.emerald-large': { tilesetName: 'Objects_Trees', localTileId: 52 },

    // --- Props ---
    'prop.bulletin-board-1': { tilesetName: 'Objects_Props', localTileId: 928 }, // 44x42
    'prop.bulletin-board-2': { tilesetName: 'Objects_Props', localTileId: 929 },
    'prop.sign-south': { tilesetName: 'Objects_Props', localTileId: 1029 },
    'prop.sign-north': { tilesetName: 'Objects_Props', localTileId: 1030 },
    'prop.board': { tilesetName: 'Objects_Props', localTileId: 911 },
    'prop.lamppost-1': { tilesetName: 'Objects_Props', localTileId: 958 },
    'prop.lamppost-2': { tilesetName: 'Objects_Props', localTileId: 959 },
    'prop.crate-medium': { tilesetName: 'Objects_Props', localTileId: 420 },
    'prop.barrel-empty': { tilesetName: 'Objects_Props', localTileId: 306 },
    'prop.barrel-water': { tilesetName: 'Objects_Props', localTileId: 307 },
  },
};
