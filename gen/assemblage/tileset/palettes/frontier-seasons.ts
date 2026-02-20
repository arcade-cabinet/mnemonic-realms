import type { PaletteSpec } from '../palette-builder.ts';

const TSX_BASE = 'assets/tilesets/frontier/Tiled/Tilesets';
const TMX_TO_TSX = '../../../../assets/tilesets/frontier/Tiled/Tilesets';

/**
 * Frontier Seasons palette.
 * Uses the seasons outdoor tileset pack for Shimmer Marsh,
 * Hollow Ridge, Flickerveil, and Resonance Fields maps (Act 2 Frontier).
 *
 * Features seasonal variety: autumn leaves, cherry blossoms, snow grass,
 * and colored tall grass variants ideal for mystical frontier zones.
 * The frontier is a half-remembered place, so seasonal mixing (autumn trees
 * beside cherry blossoms beside snow) conveys the world's instability.
 *
 * All TSX files from the seasons pack are included and assigned
 * firstgids in order. Object collections first, then atlas/grid tilesets,
 * then animations. Only tilesets with Wang sets get terrain mappings.
 */
export const frontierSeasonsSpec: PaletteSpec = {
  name: 'frontier-seasons',
  tsxBaseDir: TSX_BASE,
  tmxToTsxRelDir: TMX_TO_TSX,

  // Include TSX files in firstgid order:
  // Object collections first, then atlas sheets, then grid tilesets, then animations.
  tsxFiles: [
    'Objects_Buildings_Seasons.tsx',
    'Objects_Props_Seasons.tsx',
    'Objects_Rocks_Seasons.tsx',
    'Objects_Shadows.tsx',
    'Objects_Trees_Seasons.tsx',
    'Atlas_Buildings_Bridges.tsx',
    'Atlas_Buildings_Hay.tsx',
    'Atlas_MapBackgrounds.tsx',
    'Tileset_Ground_Seasons.tsx',
    'Tileset_Water.tsx',
    'Tileset_Road.tsx',
    'Tileset_Sand.tsx',
    'Tileset_TallGrass.tsx',
    'Tileset_FarmField.tsx',
    'Tileset_Leaves_Seasons.tsx',
    'Tileset_Shadow.tsx',
    'Tileset_Fence_1.tsx',
    'Tileset_Fence_2.tsx',
    'Tileset_RockSlope_1_Brown.tsx',
    'Tileset_RockSlope_2_Gray.tsx',
    'Animation_Campfire.tsx',
    'Animation_Flowers.tsx',
    'Animation_Torch_1.tsx',
    'Animation_Waterfall.tsx',
    'Animation_Banner_1.tsx',
  ],

  // Terrain mappings (Wang set auto-tiling)
  terrains: {
    // --- Ground terrains (Tileset_Ground_Seasons, WangSet "Grounds", 9 colors) ---
    'ground.grass': {
      tilesetName: 'Tileset_Ground_Seasons',
      wangSetName: 'Grounds',
      colorName: 'Grass',
    },
    'ground.light-grass': {
      tilesetName: 'Tileset_Ground_Seasons',
      wangSetName: 'Grounds',
      colorName: 'Light Grass',
    },
    'ground.dark-grass': {
      tilesetName: 'Tileset_Ground_Seasons',
      wangSetName: 'Grounds',
      colorName: 'Dark Grass',
    },
    'ground.dirt': {
      tilesetName: 'Tileset_Ground_Seasons',
      wangSetName: 'Grounds',
      colorName: 'Dirt',
    },
    'ground.autumn': {
      tilesetName: 'Tileset_Ground_Seasons',
      wangSetName: 'Grounds',
      colorName: 'Autumns Grass',
    },
    'ground.dark-autumn': {
      tilesetName: 'Tileset_Ground_Seasons',
      wangSetName: 'Grounds',
      colorName: 'Dark Autumn Grass',
    },
    'ground.cherry': {
      tilesetName: 'Tileset_Ground_Seasons',
      wangSetName: 'Grounds',
      colorName: 'Cherry Grass',
    },
    'ground.snow': {
      tilesetName: 'Tileset_Ground_Seasons',
      wangSetName: 'Grounds',
      colorName: 'Snow Grass',
    },

    // Ground fallbacks (map to closest seasons color)
    'ground.mud': {
      tilesetName: 'Tileset_Ground_Seasons',
      wangSetName: 'Grounds',
      colorName: 'Dirt',
    },
    'ground.stone': {
      tilesetName: 'Tileset_Ground_Seasons',
      wangSetName: 'Grounds',
      colorName: 'Dirt',
    },
    'ground.marsh': {
      tilesetName: 'Tileset_Ground_Seasons',
      wangSetName: 'Grounds',
      colorName: 'Dark Grass',
    },
    'ground.ice': {
      tilesetName: 'Tileset_Ground_Seasons',
      wangSetName: 'Grounds',
      colorName: 'Snow Grass',
    },

    // --- Water (Tileset_Water, WangSet "Water", 1 terrain color) ---
    water: { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },
    'water.shallow': { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },
    'water.deep': { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },

    // --- Roads (Tileset_Road, WangSet "Road", 3 usable colors) ---
    road: { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Road' },
    'road.dirt': { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Road' },
    'road.brick': { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Brick Road' },
    'road.dark-brick': {
      tilesetName: 'Tileset_Road',
      wangSetName: 'Road',
      colorName: 'Dark Brick Road',
    },
    // Frontier road aliases (overgrown paths are just faint dirt roads)
    'road.faint': { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Road' },
    'road.overgrown': { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Road' },
    'road.plank': { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Road' },

    // --- Sand / Beach (Tileset_Sand, WangSet "Beach", 5 terrain colors) ---
    sand: { tilesetName: 'Tileset_Sand', wangSetName: 'Beach', colorName: 'Sand' },
    'ground.sand': { tilesetName: 'Tileset_Sand', wangSetName: 'Beach', colorName: 'Sand' },
    'ground.dark-sand': {
      tilesetName: 'Tileset_Sand',
      wangSetName: 'Beach',
      colorName: 'Dark Sand',
    },
    sea: { tilesetName: 'Tileset_Sand', wangSetName: 'Beach', colorName: 'Sea' },
    'sea.mid': { tilesetName: 'Tileset_Sand', wangSetName: 'Beach', colorName: 'Mid Sea' },
    'sea.deep': { tilesetName: 'Tileset_Sand', wangSetName: 'Beach', colorName: 'Dark Sea' },

    // --- Tall grass (Tileset_TallGrass, WangSet "Tall Grass", 5 terrain colors) ---
    tallgrass: {
      tilesetName: 'Tileset_TallGrass',
      wangSetName: 'Tall Grass',
      colorName: 'Tall Grass',
    },
    'tallgrass.hay': {
      tilesetName: 'Tileset_TallGrass',
      wangSetName: 'Tall Grass',
      colorName: 'Hay',
    },
    'tallgrass.snow': {
      tilesetName: 'Tileset_TallGrass',
      wangSetName: 'Tall Grass',
      colorName: 'Snow Grass',
    },
    'tallgrass.autumn': {
      tilesetName: 'Tileset_TallGrass',
      wangSetName: 'Tall Grass',
      colorName: 'Autumn Grass',
    },
    'tallgrass.flower': {
      tilesetName: 'Tileset_TallGrass',
      wangSetName: 'Tall Grass',
      colorName: 'Flower Grass',
    },

    // --- Seasonal leaves overlay (Tileset_Leaves_Seasons, WangSet "Leaves", 3 colors) ---
    'leaves.red': {
      tilesetName: 'Tileset_Leaves_Seasons',
      wangSetName: 'Leaves',
      colorName: 'Red Leaves',
    },
    'leaves.yellow': {
      tilesetName: 'Tileset_Leaves_Seasons',
      wangSetName: 'Leaves',
      colorName: 'Yellow Leaves',
    },
    'leaves.green': {
      tilesetName: 'Tileset_Leaves_Seasons',
      wangSetName: 'Leaves',
      colorName: 'Light Green Leaves',
    },

    // --- Farm fields (Tileset_FarmField, WangSet "Farm Fields", 1 color) ---
    farm: {
      tilesetName: 'Tileset_FarmField',
      wangSetName: 'Farm Fields',
      colorName: 'Farm Field',
    },

    // --- Fences (corner-type Wang sets) ---
    fence: { tilesetName: 'Tileset_Fence_1', wangSetName: 'Fence', colorName: 'Fence 1' },
    'fence.2': { tilesetName: 'Tileset_Fence_2', wangSetName: 'Fence 2', colorName: 'Fence 2' },

    // --- Rock slopes / cliffs (Tileset_RockSlope_1_Brown, WangSet "Rock Slope 1") ---
    'cliff.brown': {
      tilesetName: 'Tileset_RockSlope_1_Brown',
      wangSetName: 'Rock Slope 1',
      colorName: 'Rock Slope',
    },

    // --- Shadows (Tileset_Shadow, WangSet "Shadow") ---
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
  },

  // Object mappings from collection tilesets
  // All tile IDs verified against parsed TSX data.
  objects: {
    // --- Houses: Hay-roof (frontier rustic architecture) ---
    // Objects_Buildings_Seasons (name="Objects_Buildings_Seasons")
    'house.hay-small': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 271 }, // 89x91
    'house.hay-medium': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 272 }, // 157x112
    'house.hay-large': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 273 }, // 175x128
    'house.hay-blue': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 274 }, // 128x128
    'house.hay-green': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 53 }, // 128x128
    'house.hay-purple': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 54 }, // 128x128
    'house.hay-red': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 55 }, // 128x128
    'house.hay-white': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 56 }, // 128x128
    'house.hay-yellow': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 57 }, // 128x128
    'house.hay-cottage': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 58 }, // 94x111
    'house.hay-manor-blue': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 59 }, // 173x142
    'house.hay-manor-green': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 60 }, // 173x142
    'house.hay-manor-red': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 62 }, // 173x142
    'house.hay-manor-white': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 63 }, // 173x142
    'house.hay-farmstead': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 65 }, // 157x136

    // --- Towers & Watchtowers ---
    'tower.hay': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 275 }, // 80x215
    'watchtower.hay-blue': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 293 }, // 68x149
    'watchtower.hay-green': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 294 }, // 68x149
    'watchtower.hay-red': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 296 }, // 68x149
    'watchtower.wood-stone': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 299 }, // 68x149

    // --- Bridges (stone) ---
    'bridge.stone-narrow': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 13 }, // 58x72
    'bridge.stone-flat': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 14 }, // 64x44
    'bridge.stone-tall': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 277 }, // 58x92
    'bridge.stone-wide': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 278 }, // 80x44
    'bridge.stone-long': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 276 }, // 95x44

    // --- Market stands ---
    'market.stand-blue': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 279 }, // 62x57
    'market.stand-green': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 280 }, // 62x57
    'market.stand-red': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 282 }, // 62x57
    'market.stall-blue': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 285 }, // 88x57
    'market.stall-green': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 286 }, // 88x57

    // --- Wells ---
    'well.generic': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 291 }, // 42x36
    'well.hay': { tilesetName: 'Objects_Buildings_Seasons', localTileId: 292 }, // 56x74

    // --- Trees: Emerald (standard green) ---
    // Objects_Trees_Seasons (name="Objects_Trees")
    'tree.emerald-1': { tilesetName: 'Objects_Trees', localTileId: 32 }, // 64x63
    'tree.emerald-2': { tilesetName: 'Objects_Trees', localTileId: 0 }, // 46x63
    'tree.emerald-3': { tilesetName: 'Objects_Trees', localTileId: 1 }, // 52x92
    'tree.emerald-4': { tilesetName: 'Objects_Trees', localTileId: 2 }, // 48x93
    'tree.emerald-5': { tilesetName: 'Objects_Trees', localTileId: 82 }, // 97x124 (large)
    'tree.emerald-6': { tilesetName: 'Objects_Trees', localTileId: 103 }, // 80x110
    'tree.emerald-7': { tilesetName: 'Objects_Trees', localTileId: 104 }, // 38x77

    // --- Trees: Red (autumn) ---
    'tree.red-1': { tilesetName: 'Objects_Trees', localTileId: 3 }, // 64x63
    'tree.red-2': { tilesetName: 'Objects_Trees', localTileId: 4 }, // 46x63
    'tree.red-3': { tilesetName: 'Objects_Trees', localTileId: 5 }, // 52x92
    'tree.red-4': { tilesetName: 'Objects_Trees', localTileId: 6 }, // 48x93
    'tree.red-5': { tilesetName: 'Objects_Trees', localTileId: 83 }, // 97x124 (large)
    'tree.red-6': { tilesetName: 'Objects_Trees', localTileId: 105 }, // 80x110

    // --- Trees: Yellow (autumn variant) ---
    'tree.yellow-1': { tilesetName: 'Objects_Trees', localTileId: 28 }, // 64x63
    'tree.yellow-2': { tilesetName: 'Objects_Trees', localTileId: 29 }, // 46x63
    'tree.yellow-3': { tilesetName: 'Objects_Trees', localTileId: 30 }, // 52x92
    'tree.yellow-4': { tilesetName: 'Objects_Trees', localTileId: 31 }, // 48x93
    'tree.yellow-5': { tilesetName: 'Objects_Trees', localTileId: 81 }, // 97x124 (large)
    'tree.yellow-6': { tilesetName: 'Objects_Trees', localTileId: 107 }, // 80x110

    // --- Trees: Light (pale, washed-out — dream-like frontier) ---
    'tree.light-1': { tilesetName: 'Objects_Trees', localTileId: 144 }, // 64x63
    'tree.light-2': { tilesetName: 'Objects_Trees', localTileId: 145 }, // 46x63
    'tree.light-3': { tilesetName: 'Objects_Trees', localTileId: 146 }, // 52x92
    'tree.light-4': { tilesetName: 'Objects_Trees', localTileId: 147 }, // 48x93
    'tree.light-5': { tilesetName: 'Objects_Trees', localTileId: 148 }, // 97x124

    // --- Trees: Pink (cherry blossom) ---
    'tree.pink-1': { tilesetName: 'Objects_Trees', localTileId: 171 }, // 64x63
    'tree.pink-2': { tilesetName: 'Objects_Trees', localTileId: 172 }, // 46x63
    'tree.pink-3': { tilesetName: 'Objects_Trees', localTileId: 173 }, // 52x92
    'tree.pink-4': { tilesetName: 'Objects_Trees', localTileId: 174 }, // 48x93
    'tree.pink-5': { tilesetName: 'Objects_Trees', localTileId: 175 }, // 97x124

    // --- Birch trees ---
    'birch.emerald-1': { tilesetName: 'Objects_Trees', localTileId: 113 }, // 52x92
    'birch.emerald-2': { tilesetName: 'Objects_Trees', localTileId: 114 }, // 48x93
    'birch.emerald-3': { tilesetName: 'Objects_Trees', localTileId: 115 }, // 46x63
    'birch.red-1': { tilesetName: 'Objects_Trees', localTileId: 117 }, // 52x92
    'birch.red-2': { tilesetName: 'Objects_Trees', localTileId: 118 }, // 48x93
    'birch.yellow-1': { tilesetName: 'Objects_Trees', localTileId: 109 }, // 52x92
    'birch.yellow-2': { tilesetName: 'Objects_Trees', localTileId: 110 }, // 48x93
    'birch.pink-1': { tilesetName: 'Objects_Trees', localTileId: 152 }, // 52x92

    // --- Palms ---
    'palm.emerald-1': { tilesetName: 'Objects_Trees', localTileId: 66 }, // 47x63
    'palm.emerald-2': { tilesetName: 'Objects_Trees', localTileId: 67 }, // 64x77
    'palm.red-1': { tilesetName: 'Objects_Trees', localTileId: 68 }, // 47x63
    'palm.yellow-1': { tilesetName: 'Objects_Trees', localTileId: 64 }, // 47x63

    // --- Bushes: Emerald ---
    'bush.emerald-1': { tilesetName: 'Objects_Trees', localTileId: 14 }, // 40x29
    'bush.emerald-2': { tilesetName: 'Objects_Trees', localTileId: 15 }, // 48x16
    'bush.emerald-3': { tilesetName: 'Objects_Trees', localTileId: 16 }, // 28x28
    'bush.emerald-large': { tilesetName: 'Objects_Trees', localTileId: 120 }, // 39x41

    // --- Bushes: Red (autumn) ---
    'bush.red-1': { tilesetName: 'Objects_Trees', localTileId: 21 }, // 40x29
    'bush.red-2': { tilesetName: 'Objects_Trees', localTileId: 22 }, // 48x16
    'bush.red-3': { tilesetName: 'Objects_Trees', localTileId: 23 }, // 28x28
    'bush.red-large': { tilesetName: 'Objects_Trees', localTileId: 122 }, // 39x41

    // --- Bushes: Yellow ---
    'bush.yellow-1': { tilesetName: 'Objects_Trees', localTileId: 7 }, // 40x29
    'bush.yellow-2': { tilesetName: 'Objects_Trees', localTileId: 8 }, // 48x16
    'bush.yellow-3': { tilesetName: 'Objects_Trees', localTileId: 9 }, // 28x28
    'bush.yellow-large': { tilesetName: 'Objects_Trees', localTileId: 124 }, // 39x41

    // --- Bushes: Pink ---
    'bush.pink-1': { tilesetName: 'Objects_Trees', localTileId: 156 }, // 40x29
    'bush.pink-2': { tilesetName: 'Objects_Trees', localTileId: 157 }, // 48x16

    // --- Rocks: Brown ---
    // Objects_Rocks_Seasons (name="Objects_Rocks")
    'rock.brown-1': { tilesetName: 'Objects_Rocks', localTileId: 4 }, // 33x27
    'rock.brown-2': { tilesetName: 'Objects_Rocks', localTileId: 1 }, // 15x29
    'rock.brown-3': { tilesetName: 'Objects_Rocks', localTileId: 2 }, // 30x28
    'rock.brown-small': { tilesetName: 'Objects_Rocks', localTileId: 0 }, // 28x13
    'rock.brown-large': { tilesetName: 'Objects_Rocks', localTileId: 41 }, // 52x68

    // --- Rocks: Brown with moss ---
    'rock.moss-1': { tilesetName: 'Objects_Rocks', localTileId: 9 }, // 38x27
    'rock.moss-2': { tilesetName: 'Objects_Rocks', localTileId: 10 }, // 16x29
    'rock.moss-3': { tilesetName: 'Objects_Rocks', localTileId: 39 }, // 31x28
    'rock.moss-large': { tilesetName: 'Objects_Rocks', localTileId: 51 }, // 31x45

    // --- Rocks: Gray ---
    'rock.gray-1': { tilesetName: 'Objects_Rocks', localTileId: 20 }, // 33x27
    'rock.gray-2': { tilesetName: 'Objects_Rocks', localTileId: 21 }, // 15x29
    'rock.gray-3': { tilesetName: 'Objects_Rocks', localTileId: 22 }, // 30x28
    'rock.gray-small': { tilesetName: 'Objects_Rocks', localTileId: 24 }, // 28x13
    'rock.gray-large': { tilesetName: 'Objects_Rocks', localTileId: 42 }, // 52x68

    // --- Rocks: Gray with grass (seasonal variants) ---
    'rock.gray-grass-1': { tilesetName: 'Objects_Rocks', localTileId: 65 }, // 38x27
    'rock.gray-grass-large': { tilesetName: 'Objects_Rocks', localTileId: 70 }, // 57x68
    'rock.gray-autumn-1': { tilesetName: 'Objects_Rocks', localTileId: 77 }, // 38x27
    'rock.gray-autumn-large': { tilesetName: 'Objects_Rocks', localTileId: 82 }, // 57x68
    'rock.gray-yellow-1': { tilesetName: 'Objects_Rocks', localTileId: 89 }, // 38x27
    'rock.gray-yellow-large': { tilesetName: 'Objects_Rocks', localTileId: 94 }, // 57x68

    // --- Rocks: Gray in water (marsh rocks) ---
    'rock.water-1': { tilesetName: 'Objects_Rocks', localTileId: 29 }, // 34x26
    'rock.water-2': { tilesetName: 'Objects_Rocks', localTileId: 30 }, // 17x28
    'rock.water-3': { tilesetName: 'Objects_Rocks', localTileId: 31 }, // 32x27
    'rock.water-small': { tilesetName: 'Objects_Rocks', localTileId: 33 }, // 29x12
    'rock.water-large': { tilesetName: 'Objects_Rocks', localTileId: 43 }, // 28x45

    // --- Water flora (marsh decoration) ---
    // Objects_Props_Seasons (name="Objects_Props")
    'lilypad.green-1': { tilesetName: 'Objects_Props', localTileId: 968 }, // 14x10
    'lilypad.green-2': { tilesetName: 'Objects_Props', localTileId: 969 }, // 20x17
    'lilypad.green-large': { tilesetName: 'Objects_Props', localTileId: 972 }, // 31x25
    'lilypad.red-1': { tilesetName: 'Objects_Props', localTileId: 1117 }, // 14x10
    'lilypad.red-large': { tilesetName: 'Objects_Props', localTileId: 1125 }, // 31x25
    'lilypad.yellow-1': { tilesetName: 'Objects_Props', localTileId: 1118 }, // 14x10
    'cattail.green-1': { tilesetName: 'Objects_Props', localTileId: 931 }, // 24x28
    'cattail.green-2': { tilesetName: 'Objects_Props', localTileId: 932 }, // 16x28
    'cattail.red-1': { tilesetName: 'Objects_Props', localTileId: 1105 }, // 24x28
    'cattail.yellow-1': { tilesetName: 'Objects_Props', localTileId: 1106 }, // 24x28
    'lotus.blue': { tilesetName: 'Objects_Props', localTileId: 974 }, // 19x15
    'lotus.red': { tilesetName: 'Objects_Props', localTileId: 975 }, // 19x15
    'lotus.white': { tilesetName: 'Objects_Props', localTileId: 976 }, // 19x15
    'lotus.yellow': { tilesetName: 'Objects_Props', localTileId: 977 }, // 19x15

    // --- Floating debris (marsh surface dressing) ---
    'floating.planks-1': { tilesetName: 'Objects_Props', localTileId: 1099 }, // 15x24
    'floating.planks-2': { tilesetName: 'Objects_Props', localTileId: 1100 }, // 25x16
    'floating.planks-3': { tilesetName: 'Objects_Props', localTileId: 1101 }, // 28x24
    'floating.grass-green-1': { tilesetName: 'Objects_Props', localTileId: 949 }, // 7x9
    'floating.grass-green-2': { tilesetName: 'Objects_Props', localTileId: 950 }, // 14x12
    'floating.grass-autumn-1': { tilesetName: 'Objects_Props', localTileId: 1109 }, // 7x9
    'floating.grass-autumn-2': { tilesetName: 'Objects_Props', localTileId: 1110 }, // 14x12
    'floating.leaves-green': { tilesetName: 'Objects_Props', localTileId: 955 }, // 15x9
    'floating.leaves-autumn': { tilesetName: 'Objects_Props', localTileId: 1115 }, // 15x9

    // --- Tree stumps / Logs (frontier wilderness) ---
    'stump.big': { tilesetName: 'Objects_Props', localTileId: 1080 }, // 32x31
    'stump.axe': { tilesetName: 'Objects_Props', localTileId: 1079 }, // 32x32
    'stump.lantern': { tilesetName: 'Objects_Props', localTileId: 1081 }, // 32x36
    'stump.mushroom': { tilesetName: 'Objects_Props', localTileId: 1135 }, // 32x48
    'stump.small': { tilesetName: 'Objects_Props', localTileId: 1083 }, // 16x13
    'stump.small-lantern': { tilesetName: 'Objects_Props', localTileId: 1084 }, // 16x22
    'log.horizontal': { tilesetName: 'Objects_Props', localTileId: 1068 }, // 30x15
    'log.vertical': { tilesetName: 'Objects_Props', localTileId: 1070 }, // 12x30
    'log.long': { tilesetName: 'Objects_Props', localTileId: 1071 }, // 46x15
    'log.mushroom': { tilesetName: 'Objects_Props', localTileId: 1131 }, // 32x32
    'log.hollow': { tilesetName: 'Objects_Props', localTileId: 1072 }, // 12x29

    // --- Tree roots ---
    'root.1': { tilesetName: 'Objects_Props', localTileId: 1073 }, // 30x14
    'root.2': { tilesetName: 'Objects_Props', localTileId: 1074 }, // 30x14
    'root.wide': { tilesetName: 'Objects_Props', localTileId: 1075 }, // 38x11

    // --- Mushrooms ---
    'mushroom.1': { tilesetName: 'Objects_Props', localTileId: 1010 }, // 16x12
    'mushroom.2': { tilesetName: 'Objects_Props', localTileId: 1011 }, // 10x13
    'mushroom.3': { tilesetName: 'Objects_Props', localTileId: 1012 }, // 12x13
    'mushroom.4': { tilesetName: 'Objects_Props', localTileId: 1127 }, // 15x16
    'mushroom.5': { tilesetName: 'Objects_Props', localTileId: 1128 }, // 16x15

    // --- Ruins / Ancient structures ---
    'ruin.pillar-1': { tilesetName: 'Objects_Props', localTileId: 1001 }, // 19x54
    'ruin.pillar-2': { tilesetName: 'Objects_Props', localTileId: 1002 }, // 21x54
    'ruin.wall-large': { tilesetName: 'Objects_Props', localTileId: 1085 }, // 77x61
    'ruin.wall-small': { tilesetName: 'Objects_Props', localTileId: 1086 }, // 44x26
    'ruin.block': { tilesetName: 'Objects_Props', localTileId: 1020 }, // 30x45

    // --- Tombstones / Memorials ---
    'tombstone.intact': { tilesetName: 'Objects_Props', localTileId: 1063 }, // 26x31
    'tombstone.broken': { tilesetName: 'Objects_Props', localTileId: 1064 }, // 26x31
    'cross.intact': { tilesetName: 'Objects_Props', localTileId: 934 }, // 18x29
    'cross.broken': { tilesetName: 'Objects_Props', localTileId: 935 }, // 18x29

    // --- Props: Signs & Boards ---
    'prop.bulletin-board-1': { tilesetName: 'Objects_Props', localTileId: 928 }, // 44x42
    'prop.bulletin-board-2': { tilesetName: 'Objects_Props', localTileId: 929 }, // 44x42
    'prop.sign-1': { tilesetName: 'Objects_Props', localTileId: 1027 }, // 24x22
    'prop.sign-2': { tilesetName: 'Objects_Props', localTileId: 1028 }, // 24x22
    'prop.sign-post-south': { tilesetName: 'Objects_Props', localTileId: 1029 }, // 7x23
    'prop.sign-post-north': { tilesetName: 'Objects_Props', localTileId: 1030 }, // 7x23
    'prop.board': { tilesetName: 'Objects_Props', localTileId: 911 }, // 16x29

    // --- Props: Lighting ---
    'prop.lamppost-1': { tilesetName: 'Objects_Props', localTileId: 958 }, // 30x62
    'prop.lamppost-2': { tilesetName: 'Objects_Props', localTileId: 959 }, // 30x62
    'prop.lamppost-3': { tilesetName: 'Objects_Props', localTileId: 960 }, // 46x62
    'prop.lamppost-tall-1': { tilesetName: 'Objects_Props', localTileId: 961 }, // 46x78
    'prop.lamppost-tall-2': { tilesetName: 'Objects_Props', localTileId: 962 }, // 46x78
    'prop.fireplace': { tilesetName: 'Objects_Props', localTileId: 938 }, // 30x26

    // --- Props: Containers ---
    'prop.crate-closed': { tilesetName: 'Objects_Props', localTileId: 420 }, // 16x32
    'prop.crate-large': { tilesetName: 'Objects_Props', localTileId: 414 }, // 32x32
    'prop.barrel-empty': { tilesetName: 'Objects_Props', localTileId: 306 }, // 32x32
    'prop.barrel-water': { tilesetName: 'Objects_Props', localTileId: 307 }, // 32x32
    'prop.barrel-covered': { tilesetName: 'Objects_Props', localTileId: 308 }, // 32x32
    'prop.sack-large': { tilesetName: 'Objects_Props', localTileId: 482 }, // 32x32
    'prop.sack-small': { tilesetName: 'Objects_Props', localTileId: 625 }, // 16x16
    'prop.bucket': { tilesetName: 'Objects_Props', localTileId: 688 }, // 16x32

    // --- Props: Farm/Rural ---
    'prop.haystack-1': { tilesetName: 'Objects_Props', localTileId: 1095 }, // 16x32
    'prop.haystack-2': { tilesetName: 'Objects_Props', localTileId: 1096 }, // 30x32
    'prop.haystack-flat': { tilesetName: 'Objects_Props', localTileId: 1097 }, // 31x15
    'prop.woodcart': { tilesetName: 'Objects_Props', localTileId: 885 }, // 56x46
    'prop.woodcart-hay': { tilesetName: 'Objects_Props', localTileId: 887 }, // 56x46
    'prop.woodcart-flowers': { tilesetName: 'Objects_Props', localTileId: 886 }, // 56x46
    'prop.woodstack': { tilesetName: 'Objects_Props', localTileId: 897 }, // 28x32
    'prop.woodlogs-1': { tilesetName: 'Objects_Props', localTileId: 889 }, // 21x26
    'prop.woodlogs-axe': { tilesetName: 'Objects_Props', localTileId: 892 }, // 27x22
    'prop.wheelcart': { tilesetName: 'Objects_Props', localTileId: 930 }, // 25x27
    'prop.toolstand': { tilesetName: 'Objects_Props', localTileId: 1067 }, // 35x44

    // --- Chests ---
    'chest.wood-closed': { tilesetName: 'Objects_Props', localTileId: 406 }, // 32x32
    'chest.wood-open': { tilesetName: 'Objects_Props', localTileId: 407 }, // 32x32
    'chest.steel-closed': { tilesetName: 'Objects_Props', localTileId: 403 }, // 32x32
    'chest.gold-closed': { tilesetName: 'Objects_Props', localTileId: 400 }, // 32x32

    // --- Plants / Vegetables ---
    'plant.sunflower': { tilesetName: 'Objects_Props', localTileId: 1018 }, // 16x42
    'plant.pumpkin-1': { tilesetName: 'Objects_Props', localTileId: 1014 }, // 29x31
    'plant.pumpkin-2': { tilesetName: 'Objects_Props', localTileId: 1015 }, // 24x21
    'plant.cabbage': { tilesetName: 'Objects_Props', localTileId: 1007 }, // 14x12
    'plant.generic-1': { tilesetName: 'Objects_Props', localTileId: 1005 }, // 16x25
    'plant.generic-2': { tilesetName: 'Objects_Props', localTileId: 1006 }, // 15x11

    // --- Street arches (frontier gate structures) ---
    'arch.blue': { tilesetName: 'Objects_Props', localTileId: 1043 }, // 80x63
    'arch.green': { tilesetName: 'Objects_Props', localTileId: 1044 }, // 80x63
    'arch.red': { tilesetName: 'Objects_Props', localTileId: 1046 }, // 80x63
    'arch.white': { tilesetName: 'Objects_Props', localTileId: 1047 }, // 80x63

    // --- Banners ---
    'banner.blue': { tilesetName: 'Objects_Props', localTileId: 1089 }, // 24x59
    'banner.green': { tilesetName: 'Objects_Props', localTileId: 1090 }, // 24x59
    'banner.red': { tilesetName: 'Objects_Props', localTileId: 1092 }, // 24x59

    // --- Seating ---
    'bench.tall': { tilesetName: 'Objects_Props', localTileId: 348 }, // 16x32
    'bench.wide': { tilesetName: 'Objects_Props', localTileId: 349 }, // 32x16

    // --- Weapons (frontier defense) ---
    'weapons.stand-1': { tilesetName: 'Objects_Props', localTileId: 610 }, // 26x17
    'weapons.rack-small': { tilesetName: 'Objects_Props', localTileId: 611 }, // 32x48
    'weapons.rack-tall': { tilesetName: 'Objects_Props', localTileId: 612 }, // 32x64

    // --- Vases (indoor dressing, resonance point pedestals) ---
    'vase.small': { tilesetName: 'Objects_Props', localTileId: 588 }, // 16x16
    'vase.medium': { tilesetName: 'Objects_Props', localTileId: 589 }, // 16x32
    'vase.large': { tilesetName: 'Objects_Props', localTileId: 590 }, // 32x32

    // --- Shadows ---
    // Objects_Shadows (name="Objects_Shadows")
    'shadow.round-16': { tilesetName: 'Objects_Shadows', localTileId: 30 }, // 16x16
    'shadow.round-24': { tilesetName: 'Objects_Shadows', localTileId: 34 }, // 24x24
    'shadow.round-32': { tilesetName: 'Objects_Shadows', localTileId: 38 }, // 32x32
    'shadow.round-40': { tilesetName: 'Objects_Shadows', localTileId: 42 }, // 40x40
    'shadow.round-48': { tilesetName: 'Objects_Shadows', localTileId: 46 }, // 48x48
  },
};
