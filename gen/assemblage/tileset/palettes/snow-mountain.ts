import type { PaletteSpec } from '../palette-builder.ts';

const TSX_BASE = 'assets/tilesets/mountain/Tiled/Tilesets';
const TMX_TO_TSX = '../../../../assets/tilesets/mountain/Tiled/Tilesets';

/**
 * Snow Mountain palette.
 * Uses the snow/winter outdoor tileset pack for Sunridge,
 * Hollow Ridge, and any mountain/snow zone maps.
 *
 * Features snow-covered terrain, ice rock slopes, frozen water,
 * snow-dusted buildings and fences, and winter vegetation.
 *
 * All TSX files from the snow pack are included and assigned
 * firstgids in order. Only the ones with Wang sets get terrain mappings.
 *
 * Tileset contents verified by parsing all 32 TSX files:
 *   - 11 grid tilesets (5 with Wang sets for auto-tiling)
 *   - 5 object collections (buildings, props, trees, rocks, shadows)
 *   - 6 atlas grid tilesets (buildings, bridges, backgrounds, props, rocks, trees)
 *   - 10 animation tilesets (campfire, flowers, crystals, waterfall, door, banners, etc.)
 */
export const snowMountainSpec: PaletteSpec = {
  name: 'snow-mountain',
  tsxBaseDir: TSX_BASE,
  tmxToTsxRelDir: TMX_TO_TSX,

  // Include TSX files in order: object collections first, then atlas sheets,
  // then grid tilesets, then animations. Matches the reference TMX ordering.
  tsxFiles: [
    // Object collections
    'Objects_Buildings_Snow.tsx',
    'Objects_Props_Snow.tsx',
    'Objects_Trees_Snow.tsx',
    'Objects_Rocks_Snow.tsx',
    'Objects_Shadows.tsx',
    // Atlas grid tilesets
    'Atlas_Buildings_Bridges_Snow.tsx',
    'Atlas_Buildings_Snow.tsx',
    'Atlas_MapBackgrounds_Snow.tsx',
    'Atlas_Props_Snow.tsx',
    'Atlas_Rocks_Snow.tsx',
    'Atlas_Trees_Bushes_Snow.tsx',
    // Grid tilesets (terrain + auto-tiling)
    'Tileset_Ground_Snow.tsx',
    'Tileset_Water.tsx',
    'Tileset_Road.tsx',
    'Tileset_Snow.tsx',
    'Tileset_TallGrass.tsx',
    'Tileset_Shadow.tsx',
    'Tileset_Fence_1_Snow.tsx',
    'Tileset_Fence_2_Snow.tsx',
    'Tileset_RockSlope_2_Brown.tsx',
    'Tileset_RockSlope_2_Brown_Snow.tsx',
    'Tileset_RockSlope_2_Ice.tsx',
    // Animations
    'Animation_Banner_1.tsx',
    'Animation_Banner_3.tsx',
    'Animation_Campfire.tsx',
    'Animation_Door.tsx',
    'Animation_Flowers.tsx',
    'Animation_MagicCrystal_Snow.tsx',
    'Animation_MarketStand_1.tsx',
    'Animation_MarketStand_2.tsx',
    'Animation_Torch_1.tsx',
    'Animation_Waterfall.tsx',
  ],

  // ──────────────────────────────────────────────────────────
  // Terrain mappings (Wang set auto-tiling)
  // ──────────────────────────────────────────────────────────
  terrains: {
    // Ground terrains — Tileset_Ground_Snow wang="Grounds" (9 colors)
    'ground.grass': {
      tilesetName: 'Tileset_Ground_Snow',
      wangSetName: 'Grounds',
      colorName: 'Grass',
    },
    'ground.light-grass': {
      tilesetName: 'Tileset_Ground_Snow',
      wangSetName: 'Grounds',
      colorName: 'Light Grass',
    },
    'ground.dark-grass': {
      tilesetName: 'Tileset_Ground_Snow',
      wangSetName: 'Grounds',
      colorName: 'Dark Grass',
    },
    'ground.winter': {
      tilesetName: 'Tileset_Ground_Snow',
      wangSetName: 'Grounds',
      colorName: 'Winter Grass',
    },
    'ground.autumn': {
      tilesetName: 'Tileset_Ground_Snow',
      wangSetName: 'Grounds',
      colorName: 'Autumns Grass',
    },
    'ground.dark-autumn': {
      tilesetName: 'Tileset_Ground_Snow',
      wangSetName: 'Grounds',
      colorName: 'Dark Autumn Grass',
    },
    'ground.cherry': {
      tilesetName: 'Tileset_Ground_Snow',
      wangSetName: 'Grounds',
      colorName: 'Cherry Grass',
    },
    'ground.dirt': {
      tilesetName: 'Tileset_Ground_Snow',
      wangSetName: 'Grounds',
      colorName: 'Dirt',
    },

    // Ground fallbacks for biome references
    'ground.snow': {
      tilesetName: 'Tileset_Ground_Snow',
      wangSetName: 'Grounds',
      colorName: 'Winter Grass',
    },
    'ground.ice': {
      tilesetName: 'Tileset_Ground_Snow',
      wangSetName: 'Grounds',
      colorName: 'Winter Grass',
    },
    'ground.mud': {
      tilesetName: 'Tileset_Ground_Snow',
      wangSetName: 'Grounds',
      colorName: 'Dirt',
    },
    'ground.stone': {
      tilesetName: 'Tileset_Ground_Snow',
      wangSetName: 'Grounds',
      colorName: 'Dark Grass',
    },

    // Snow overlay — Tileset_Snow wang="Snow" (2 colors: Empty, Snow)
    snow: { tilesetName: 'Tileset_Snow', wangSetName: 'Snow', colorName: 'Snow' },
    'snow.cover': { tilesetName: 'Tileset_Snow', wangSetName: 'Snow', colorName: 'Snow' },

    // Water — Tileset_Water wang="Water" (2 colors: Empty, Water)
    water: { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },
    'water.shallow': { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },
    'water.deep': { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },

    // Roads — Tileset_Road wang="Road" (4 colors: Road, Brick Road, Dark Brick Road, WIP)
    road: { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Road' },
    'road.dirt': { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Road' },
    'road.brick': { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Brick Road' },
    'road.dark-brick': {
      tilesetName: 'Tileset_Road',
      wangSetName: 'Road',
      colorName: 'Dark Brick Road',
    },
    'road.stone': {
      tilesetName: 'Tileset_Road',
      wangSetName: 'Road',
      colorName: 'Dark Brick Road',
    },

    // Tall grass — Tileset_TallGrass wang="Tall Grass" (6 colors inc Snow Grass, Autumn Grass)
    tallgrass: {
      tilesetName: 'Tileset_TallGrass',
      wangSetName: 'Tall Grass',
      colorName: 'Tall Grass',
    },
    'tallgrass.snow': {
      tilesetName: 'Tileset_TallGrass',
      wangSetName: 'Tall Grass',
      colorName: 'Snow Grass',
    },
    'tallgrass.hay': {
      tilesetName: 'Tileset_TallGrass',
      wangSetName: 'Tall Grass',
      colorName: 'Hay',
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

    // Shadows — Tileset_Shadow wang="Shadow" (corner type: Light, 25%, 100%)
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

    // Snow fences — Tileset_Fence_1_Snow wang="Fence 1 Snow" (corner type)
    fence: {
      tilesetName: 'Tileset_Fence_1_Snow',
      wangSetName: 'Fence 1 Snow',
      colorName: 'Fence 1 Snow',
    },
    'fence.snow': {
      tilesetName: 'Tileset_Fence_1_Snow',
      wangSetName: 'Fence 1 Snow',
      colorName: 'Fence 1 Snow',
    },
    'fence.2': {
      tilesetName: 'Tileset_Fence_2_Snow',
      wangSetName: 'Fence 2',
      colorName: 'Fence 2',
    },

    // Rock slopes / cliffs — Tileset_RockSlope_2_Brown wang="Rock Slope 1" (corner type)
    // Note: RockSlope_2_Brown_Snow and RockSlope_2_Ice have NO Wang sets —
    // they use the same tile layout as RockSlope_2_Brown but with snow/ice textures.
    // Use fixed tile mappings for those if needed.
    'cliff.brown': {
      tilesetName: 'Tileset_RockSlope_2_Brown',
      wangSetName: 'Rock Slope 1',
      colorName: 'Rock Slope',
    },
  },

  // ──────────────────────────────────────────────────────────
  // Object mappings (buildings, trees, rocks, props)
  // All local tile IDs verified against parsed TSX data.
  // ──────────────────────────────────────────────────────────
  objects: {
    // ── Snow Houses (Objects_Buildings_Snow) ──
    'house.snow-1': { tilesetName: 'Objects_Buildings_Snow', localTileId: 42 }, // 87x91
    'house.snow-2': { tilesetName: 'Objects_Buildings_Snow', localTileId: 43 }, // 158x112
    'house.snow-3': { tilesetName: 'Objects_Buildings_Snow', localTileId: 44 }, // 175x128
    'house.snow-4-blue': { tilesetName: 'Objects_Buildings_Snow', localTileId: 45 }, // 128x128
    'house.snow-4-green': { tilesetName: 'Objects_Buildings_Snow', localTileId: 54 },
    'house.snow-4-purple': { tilesetName: 'Objects_Buildings_Snow', localTileId: 55 },
    'house.snow-4-red': { tilesetName: 'Objects_Buildings_Snow', localTileId: 56 },
    'house.snow-4-white': { tilesetName: 'Objects_Buildings_Snow', localTileId: 57 },
    'house.snow-4-yellow': { tilesetName: 'Objects_Buildings_Snow', localTileId: 58 },
    'house.snow-5': { tilesetName: 'Objects_Buildings_Snow', localTileId: 46 }, // 94x112
    'house.snow-6-blue': { tilesetName: 'Objects_Buildings_Snow', localTileId: 47 }, // 173x142
    'house.snow-6-green': { tilesetName: 'Objects_Buildings_Snow', localTileId: 59 },
    'house.snow-6-purple': { tilesetName: 'Objects_Buildings_Snow', localTileId: 60 },
    'house.snow-6-red': { tilesetName: 'Objects_Buildings_Snow', localTileId: 61 },
    'house.snow-6-white': { tilesetName: 'Objects_Buildings_Snow', localTileId: 62 },
    'house.snow-6-yellow': { tilesetName: 'Objects_Buildings_Snow', localTileId: 63 },
    'house.snow-7': { tilesetName: 'Objects_Buildings_Snow', localTileId: 48 }, // 158x136

    // ── Towers ──
    'tower.snow': { tilesetName: 'Objects_Buildings_Snow', localTileId: 50 }, // 80x215
    'watchtower.snow-blue': { tilesetName: 'Objects_Buildings_Snow', localTileId: 53 }, // 68x150
    'watchtower.snow-green': { tilesetName: 'Objects_Buildings_Snow', localTileId: 64 },
    'watchtower.snow-purple': { tilesetName: 'Objects_Buildings_Snow', localTileId: 65 },
    'watchtower.snow-red': { tilesetName: 'Objects_Buildings_Snow', localTileId: 66 },
    'watchtower.snow-white': { tilesetName: 'Objects_Buildings_Snow', localTileId: 67 },
    'watchtower.snow-yellow': { tilesetName: 'Objects_Buildings_Snow', localTileId: 68 },

    // ── Wells ──
    'well.generic': { tilesetName: 'Objects_Buildings_Snow', localTileId: 12 }, // 42x36
    'well.snow': { tilesetName: 'Objects_Buildings_Snow', localTileId: 69 }, // 56x74

    // ── Bridges ──
    'bridge.stone-1': { tilesetName: 'Objects_Buildings_Snow', localTileId: 13 }, // 58x72
    'bridge.stone-2': { tilesetName: 'Objects_Buildings_Snow', localTileId: 14 }, // 64x44

    // ── Market Stands ──
    'market.stand-1-snow': { tilesetName: 'Objects_Buildings_Snow', localTileId: 52 }, // 62x58
    'market.stand-2-snow': { tilesetName: 'Objects_Buildings_Snow', localTileId: 51 }, // 88x57

    // ── Trees: Snow (heavy snow on canopy) ──
    'tree.snow-1': { tilesetName: 'Objects_Trees', localTileId: 3 }, // 64x63
    'tree.snow-2': { tilesetName: 'Objects_Trees', localTileId: 4 }, // 46x63
    'tree.snow-3': { tilesetName: 'Objects_Trees', localTileId: 5 }, // 52x92
    'tree.snow-4': { tilesetName: 'Objects_Trees', localTileId: 6 }, // 48x93
    'tree.snow-5': { tilesetName: 'Objects_Trees', localTileId: 83 }, // 97x124 (large)
    'tree.snow-6': { tilesetName: 'Objects_Trees', localTileId: 105 }, // 80x110
    'tree.snow-7': { tilesetName: 'Objects_Trees', localTileId: 106 }, // 38x77

    // ── Trees: Winter (bare branches, frost-dusted) ──
    'tree.winter-1': { tilesetName: 'Objects_Trees', localTileId: 28 }, // 64x63
    'tree.winter-2': { tilesetName: 'Objects_Trees', localTileId: 29 }, // 46x63
    'tree.winter-3': { tilesetName: 'Objects_Trees', localTileId: 30 }, // 52x92
    'tree.winter-4': { tilesetName: 'Objects_Trees', localTileId: 31 }, // 48x93
    'tree.winter-5': { tilesetName: 'Objects_Trees', localTileId: 81 }, // 97x124 (large)
    'tree.winter-6': { tilesetName: 'Objects_Trees', localTileId: 107 }, // 80x110
    'tree.winter-7': { tilesetName: 'Objects_Trees', localTileId: 102 }, // 38x77

    // ── Trees: Dead (snowy stumps and trunks) ──
    'tree.dead-snow-2': { tilesetName: 'Objects_Trees', localTileId: 131 }, // 42x61
    'tree.dead-snow-3': { tilesetName: 'Objects_Trees', localTileId: 132 }, // 45x80
    'tree.dead-snow-4': { tilesetName: 'Objects_Trees', localTileId: 133 }, // 43x87
    'tree.dead-snow-5': { tilesetName: 'Objects_Trees', localTileId: 134 }, // 91x115 (large)
    'tree.dead-snow-6': { tilesetName: 'Objects_Trees', localTileId: 135 }, // 69x74
    'tree.dead-snow-7': { tilesetName: 'Objects_Trees', localTileId: 126 }, // 31x72

    // ── Trees: Birch (snowy) ──
    'birch.snow-1': { tilesetName: 'Objects_Trees', localTileId: 117 }, // 52x92
    'birch.snow-2': { tilesetName: 'Objects_Trees', localTileId: 118 }, // 48x93
    'birch.snow-3': { tilesetName: 'Objects_Trees', localTileId: 119 }, // 46x63
    'birch.snow-4': { tilesetName: 'Objects_Trees', localTileId: 108 }, // 38x77
    'birch.winter-1': { tilesetName: 'Objects_Trees', localTileId: 109 }, // 52x92
    'birch.winter-2': { tilesetName: 'Objects_Trees', localTileId: 110 }, // 48x93
    'birch.winter-3': { tilesetName: 'Objects_Trees', localTileId: 111 }, // 46x63
    'birch.winter-4': { tilesetName: 'Objects_Trees', localTileId: 112 }, // 38x77
    'birch.dead-snow-1': { tilesetName: 'Objects_Trees', localTileId: 127 }, // 45x80
    'birch.dead-snow-2': { tilesetName: 'Objects_Trees', localTileId: 128 }, // 43x87

    // ── Bushes: Snow ──
    'bush.snow-1': { tilesetName: 'Objects_Trees', localTileId: 21 }, // 40x29
    'bush.snow-2': { tilesetName: 'Objects_Trees', localTileId: 22 }, // 48x16
    'bush.snow-3': { tilesetName: 'Objects_Trees', localTileId: 23 }, // 28x28
    'bush.snow-4': { tilesetName: 'Objects_Trees', localTileId: 24 }, // 16x28
    'bush.snow-8': { tilesetName: 'Objects_Trees', localTileId: 121 }, // 26x26
    'bush.snow-9': { tilesetName: 'Objects_Trees', localTileId: 122 }, // 39x41

    // ── Bushes: Winter ──
    'bush.winter-1': { tilesetName: 'Objects_Trees', localTileId: 7 }, // 40x29
    'bush.winter-2': { tilesetName: 'Objects_Trees', localTileId: 8 }, // 48x16
    'bush.winter-3': { tilesetName: 'Objects_Trees', localTileId: 9 }, // 28x28
    'bush.winter-4': { tilesetName: 'Objects_Trees', localTileId: 10 }, // 16x28

    // ── Rocks: Brown with snow cap ──
    'rock.brown-snow-1': { tilesetName: 'Objects_Rocks', localTileId: 79 }, // 33x28
    'rock.brown-snow-2': { tilesetName: 'Objects_Rocks', localTileId: 80 }, // 15x29
    'rock.brown-snow-3': { tilesetName: 'Objects_Rocks', localTileId: 81 }, // 30x28
    'rock.brown-snow-4': { tilesetName: 'Objects_Rocks', localTileId: 82 }, // 27x26
    'rock.brown-snow-5': { tilesetName: 'Objects_Rocks', localTileId: 83 }, // 28x13
    'rock.brown-snow-10': { tilesetName: 'Objects_Rocks', localTileId: 88 }, // 52x68 (large)
    'rock.brown-snow-11': { tilesetName: 'Objects_Rocks', localTileId: 89 }, // 26x45 (tall)

    // ── Rocks: Ice ──
    'rock.ice-1': { tilesetName: 'Objects_Rocks', localTileId: 95 }, // 33x27
    'rock.ice-2': { tilesetName: 'Objects_Rocks', localTileId: 96 }, // 15x29
    'rock.ice-3': { tilesetName: 'Objects_Rocks', localTileId: 97 }, // 30x28
    'rock.ice-4': { tilesetName: 'Objects_Rocks', localTileId: 98 }, // 27x26
    'rock.ice-10': { tilesetName: 'Objects_Rocks', localTileId: 104 }, // 52x68 (large)
    'rock.ice-11': { tilesetName: 'Objects_Rocks', localTileId: 105 }, // 26x45 (tall)

    // ── Rocks: Brown (bare) ──
    'rock.brown-1': { tilesetName: 'Objects_Rocks', localTileId: 0 }, // 33x27
    'rock.brown-2': { tilesetName: 'Objects_Rocks', localTileId: 1 }, // 15x29
    'rock.brown-3': { tilesetName: 'Objects_Rocks', localTileId: 2 }, // 30x28
    'rock.brown-10': { tilesetName: 'Objects_Rocks', localTileId: 41 }, // 52x68 (large)

    // ── Signs (Objects_Props_Snow) ──
    'prop.sign-1-snow': { tilesetName: 'Objects_Props_Snow', localTileId: 1027 }, // 24x22
    'prop.sign-2-snow': { tilesetName: 'Objects_Props_Snow', localTileId: 1028 }, // 24x22
    'prop.sign-south-snow': { tilesetName: 'Objects_Props_Snow', localTileId: 1029 }, // 7x23
    'prop.sign-north-snow': { tilesetName: 'Objects_Props_Snow', localTileId: 1030 }, // 7x23
    'prop.sign-job-tavern': { tilesetName: 'Objects_Props_Snow', localTileId: 1040 },
    'prop.sign-job-blacksmith': { tilesetName: 'Objects_Props_Snow', localTileId: 1032 },

    // ── Bulletin Boards ──
    'prop.bulletin-board-1': { tilesetName: 'Objects_Props_Snow', localTileId: 928 }, // 44x42
    'prop.bulletin-board-2': { tilesetName: 'Objects_Props_Snow', localTileId: 929 }, // 44x42

    // ── Chests ──
    'chest.gold-1': { tilesetName: 'Objects_Props_Snow', localTileId: 400 }, // 32x32
    'chest.gold-2': { tilesetName: 'Objects_Props_Snow', localTileId: 401 },
    'chest.steel-1': { tilesetName: 'Objects_Props_Snow', localTileId: 403 },
    'chest.wood-1': { tilesetName: 'Objects_Props_Snow', localTileId: 406 },

    // ── Lamp Posts ──
    'prop.lamppost-1': { tilesetName: 'Objects_Props_Snow', localTileId: 958 }, // 30x62
    'prop.lamppost-2': { tilesetName: 'Objects_Props_Snow', localTileId: 959 }, // 30x62
    'prop.lamppost-3': { tilesetName: 'Objects_Props_Snow', localTileId: 960 }, // 46x62
    'prop.lamppost-4': { tilesetName: 'Objects_Props_Snow', localTileId: 961 }, // 46x78

    // ── Magic Crystals ──
    'crystal.blue': { tilesetName: 'Objects_Props_Snow', localTileId: 978 }, // 16x15
    'crystal.green': { tilesetName: 'Objects_Props_Snow', localTileId: 979 },
    'crystal.purple': { tilesetName: 'Objects_Props_Snow', localTileId: 980 },
    'crystal.red': { tilesetName: 'Objects_Props_Snow', localTileId: 981 },
    'crystal.white': { tilesetName: 'Objects_Props_Snow', localTileId: 982 },
    'crystal.large-blue': { tilesetName: 'Objects_Props_Snow', localTileId: 984 }, // 16x30
    'crystal.large-purple': { tilesetName: 'Objects_Props_Snow', localTileId: 986 },
    'crystal.cluster-blue': { tilesetName: 'Objects_Props_Snow', localTileId: 990 }, // 35x59
    'crystal.cluster-purple': { tilesetName: 'Objects_Props_Snow', localTileId: 992 },

    // ── Barrels & Crates ──
    'prop.barrel-empty': { tilesetName: 'Objects_Props_Snow', localTileId: 306 }, // 32x32
    'prop.barrel-water': { tilesetName: 'Objects_Props_Snow', localTileId: 307 },
    'prop.crate-large': { tilesetName: 'Objects_Props_Snow', localTileId: 414 }, // 32x32
    'prop.crate-medium': { tilesetName: 'Objects_Props_Snow', localTileId: 420 }, // 16x32

    // ── Tombstones ──
    'prop.tombstone': { tilesetName: 'Objects_Props_Snow', localTileId: 1063 }, // 26x31

    // ── Mausoleums ──
    'mausoleum.blue': { tilesetName: 'Objects_Props_Snow', localTileId: 996 },
    'mausoleum.purple': { tilesetName: 'Objects_Props_Snow', localTileId: 998 },

    // ── Benches ──
    'prop.bench-vertical': { tilesetName: 'Objects_Props_Snow', localTileId: 348 }, // 16x32
    'prop.bench-horizontal': { tilesetName: 'Objects_Props_Snow', localTileId: 349 }, // 32x16

    // ── Tree stumps & logs ──
    'prop.treestump-axe': { tilesetName: 'Objects_Props_Snow', localTileId: 1079 },
    'prop.treestump-big': { tilesetName: 'Objects_Props_Snow', localTileId: 1080 },
    'prop.treelog-1': { tilesetName: 'Objects_Props_Snow', localTileId: 1068 },
    'prop.treelog-2': { tilesetName: 'Objects_Props_Snow', localTileId: 1069 },
    'prop.woodstack': { tilesetName: 'Objects_Props_Snow', localTileId: 897 },

    // ── Forge & Anvil ──
    'prop.anvil': { tilesetName: 'Objects_Props_Snow', localTileId: 898 },
    'prop.forge': { tilesetName: 'Objects_Props_Snow', localTileId: 1098 },

    // ── Archery Targets ──
    'prop.archery-target-blue': { tilesetName: 'Objects_Props_Snow', localTileId: 899 },
    'prop.archery-target-red': { tilesetName: 'Objects_Props_Snow', localTileId: 902 },

    // ── Banners ──
    'banner.large-blue': { tilesetName: 'Objects_Props_Snow', localTileId: 789 },
    'banner.large-red': { tilesetName: 'Objects_Props_Snow', localTileId: 795 },
    'banner.large-purple': { tilesetName: 'Objects_Props_Snow', localTileId: 793 },
    'banner.medium-blue': { tilesetName: 'Objects_Props_Snow', localTileId: 799 },
    'banner.medium-red': { tilesetName: 'Objects_Props_Snow', localTileId: 805 },

    // ── Street Arches ──
    'prop.street-arch-blue': { tilesetName: 'Objects_Props_Snow', localTileId: 1043 },
    'prop.street-arch-red': { tilesetName: 'Objects_Props_Snow', localTileId: 1046 },

    // ── Misc Props ──
    'prop.board': { tilesetName: 'Objects_Props_Snow', localTileId: 911 }, // 16x29
    'prop.woodcart': { tilesetName: 'Objects_Props_Snow', localTileId: 885 },
    'prop.woodcart-hay': { tilesetName: 'Objects_Props_Snow', localTileId: 887 },
    'prop.haystack-1': { tilesetName: 'Objects_Props_Snow', localTileId: 1095 },
    'prop.haystack-2': { tilesetName: 'Objects_Props_Snow', localTileId: 1096 },
    'prop.skull': { tilesetName: 'Objects_Props_Snow', localTileId: 1042 },
    'prop.skull-animal': { tilesetName: 'Objects_Props_Snow', localTileId: 677 },
    'prop.cross-1': { tilesetName: 'Objects_Props_Snow', localTileId: 934 },
    'prop.pillar-ruined-1': { tilesetName: 'Objects_Props_Snow', localTileId: 1001 },
    'prop.pillar-ruined-2': { tilesetName: 'Objects_Props_Snow', localTileId: 1002 },
    'prop.wall-ruined-1': { tilesetName: 'Objects_Props_Snow', localTileId: 1085 },
    'prop.wall-ruined-2': { tilesetName: 'Objects_Props_Snow', localTileId: 1086 },
  },
};
