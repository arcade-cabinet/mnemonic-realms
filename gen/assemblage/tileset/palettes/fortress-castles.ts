import type { PaletteSpec } from '../palette-builder.ts';

const TSX_BASE = 'assets/tilesets/fortress/Tiled/Tilesets';
const TMX_TO_TSX = '../../../../assets/tilesets/fortress/Tiled/Tilesets';

/**
 * Fortress Castles palette.
 * Uses the castle outdoor tileset pack for the Preserver Fortress F1-F3 maps.
 *
 * Castle-specific terrains: stone floors (slab, mid-slab), castle grass overlay,
 * castle walls (Wang auto-tiling), plus shared ground/road/water from the pack.
 *
 * All TSX files from the castles pack are included and assigned firstgids in order.
 * Object collections first, then atlas sheets, then grid tilesets, then animations.
 */
export const fortressCastlesSpec: PaletteSpec = {
  name: 'fortress-castles',
  tsxBaseDir: TSX_BASE,
  tmxToTsxRelDir: TMX_TO_TSX,

  // Include TSX files in a stable order: object collections -> atlases -> grid tilesets -> animations.
  tsxFiles: [
    // Object collections (columns=0, individual images per tile)
    'Objects_Buildings.tsx',
    'Objects_Props_Castle.tsx',
    'Objects_Trees_Castle.tsx',
    // Atlas grid sheets (large sprite atlases with collision data)
    'Atlas_Props_Castle.tsx',
    'Atlas_Trees_Bushes_Castle.tsx',
    // Castle-specific grid sheets
    'Castle_Building.tsx',
    'Castle_Details.tsx',
    'Castle_Floor.tsx',
    'Character.tsx',
    // Terrain grid sheets with Wang sets
    'Tileset_Castle_Grass.tsx',
    'Tileset_Ground_Castle.tsx',
    'Tileset_Road.tsx',
    'Tileset_RockSlope.tsx',
    'Tileset_Shadow.tsx',
    'Tileset_Water.tsx',
    'Tileset_FarmField.tsx',
    // Animations
    'Animation_MarketStand_2.tsx',
    'Animation_MarketStand_1.tsx',
    'Animation_Torch_1.tsx',
    'Animation_Waterfall.tsx',
    'Animation_Banner_1.tsx',
    'Animation_Banner_2.tsx',
    'Animation_Banner_3.tsx',
    'Animation_Flowers.tsx',
    'Animation_Fountain_1.tsx',
  ],

  // ─── Terrain mappings (Wang set auto-tiling) ───────────────────────────

  terrains: {
    // Ground terrains (Tileset_Ground_Castle, name="Tileset_Ground", wang="Grounds")
    // 6 colors: Grass, Light Grass, Dark Grass, Autumn Grass, Snow Grass, Dirt
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
      colorName: 'Autumn Grass',
    },
    'ground.snow': {
      tilesetName: 'Tileset_Ground',
      wangSetName: 'Grounds',
      colorName: 'Snow Grass',
    },

    // Ground fallbacks for biome compatibility
    'ground.mud': { tilesetName: 'Tileset_Ground', wangSetName: 'Grounds', colorName: 'Dirt' },
    'ground.stone': { tilesetName: 'Tileset_Ground', wangSetName: 'Grounds', colorName: 'Dirt' },
    'ground.dark-stone': {
      tilesetName: 'Tileset_Ground',
      wangSetName: 'Grounds',
      colorName: 'Dark Grass',
    },

    // Castle grass overlay (Tileset_Castle_Grass, name="Castle_Grass", wang="Castle_Grass")
    // Emerald grass patches that overlay on top of stone/dirt ground
    'ground.castle-grass': {
      tilesetName: 'Castle_Grass',
      wangSetName: 'Castle_Grass',
      colorName: 'Emerald Grass',
    },

    // Castle floor (Castle_Floor, wang="Castle Floor")
    // 2 colors: Slab Floor (light stone), Mid Slab Floor (darker stone)
    'floor.slab': {
      tilesetName: 'Castle_Floor',
      wangSetName: 'Castle Floor',
      colorName: 'Slab Floor',
    },
    'floor.mid-slab': {
      tilesetName: 'Castle_Floor',
      wangSetName: 'Castle Floor',
      colorName: 'Mid Slab Floor',
    },

    // Castle walls (Castle_Building, wang="Castle Walls")
    // Auto-tiled castle wall tops with battlements
    'wall.castle': {
      tilesetName: 'Castle_Building',
      wangSetName: 'Castle Walls',
      colorName: 'Castle Walls Top',
    },

    // Water (Tileset_Water, wang="Water")
    water: { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },
    'water.shallow': { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },
    'water.deep': { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },
    'water.moat': { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },

    // Roads (Tileset_Road, name="Road", wang="Road")
    // 4 colors: Road (dirt), Brick Road, Dark Brick Road, Light Brick Road
    road: { tilesetName: 'Road', wangSetName: 'Road', colorName: 'Road' },
    'road.dirt': { tilesetName: 'Road', wangSetName: 'Road', colorName: 'Road' },
    'road.brick': { tilesetName: 'Road', wangSetName: 'Road', colorName: 'Brick Road' },
    'road.dark-brick': {
      tilesetName: 'Road',
      wangSetName: 'Road',
      colorName: 'Dark Brick Road',
    },
    'road.light-brick': {
      tilesetName: 'Road',
      wangSetName: 'Road',
      colorName: 'Light Brick Road',
    },
    'road.stone': {
      tilesetName: 'Road',
      wangSetName: 'Road',
      colorName: 'Dark Brick Road',
    },

    // Rock slopes / cliffs (Tileset_RockSlope, wang="Rock Slope 1", corner type)
    'cliff.rock': {
      tilesetName: 'Tileset_RockSlope',
      wangSetName: 'Rock Slope 1',
      colorName: 'Rock Slope',
    },

    // Farm fields (FarmField, wang="Farm Fields")
    farm: { tilesetName: 'FarmField', wangSetName: 'Farm Fields', colorName: 'Farm Field' },

    // Shadows (Tileset_Shadow, wang="Shadow", corner type)
    // 2 colors: Light, Shadow
    'shadow.light': {
      tilesetName: 'Tileset_Shadow',
      wangSetName: 'Shadow',
      colorName: 'Shadow',
    },
  },

  // ─── Object mappings (collection tilesets with individual images) ──────

  objects: {
    // --- Towers (Objects_Buildings, name="Objects_Buildings") ---
    // Tower_Hay_Stone: 80x215px rustic stone tower with hay roof
    'tower.hay-stone': { tilesetName: 'Objects_Buildings', localTileId: 42 },
    // Tower_BlueBricks_Wood: 80x215px blue brick tower
    'tower.blue-brick': { tilesetName: 'Objects_Buildings', localTileId: 54 },
    // Tower_RedWood_Stone: 80x215px red wood and stone tower
    'tower.red-stone': { tilesetName: 'Objects_Buildings', localTileId: 55 },

    // --- Watch Towers ---
    // WatchTower_Wood_Stone: 68x149px wooden watchtower
    'watchtower.wood-stone': { tilesetName: 'Objects_Buildings', localTileId: 58 },
    // WatchTower_BlueBricks_Wood: 68x149px blue brick watchtower
    'watchtower.blue-brick': { tilesetName: 'Objects_Buildings', localTileId: 56 },
    // WatchTower_RedWood_Stone: 68x149px red wood watchtower
    'watchtower.red-stone': { tilesetName: 'Objects_Buildings', localTileId: 57 },

    // --- Bridges ---
    // Bridge_Stone_1: 58x72px stone bridge
    'bridge.stone-1': { tilesetName: 'Objects_Buildings', localTileId: 52 },
    // Bridge_Stone_2: 64x44px smaller stone bridge
    'bridge.stone-2': { tilesetName: 'Objects_Buildings', localTileId: 53 },

    // --- Wells ---
    // Well_Hay_Stone: 52x73px stone well with hay roof
    'well.hay-stone': { tilesetName: 'Objects_Buildings', localTileId: 15 },
    // Well_BlueBricks_Stone: 52x73px blue brick well
    'well.blue-brick': { tilesetName: 'Objects_Buildings', localTileId: 59 },
    // Well_RedWood_Stone: 52x73px red wood well
    'well.red-stone': { tilesetName: 'Objects_Buildings', localTileId: 60 },

    // --- Market Stands ---
    'market.small-1': { tilesetName: 'Objects_Buildings', localTileId: 47 },
    'market.small-2': { tilesetName: 'Objects_Buildings', localTileId: 48 },
    'market.small-4': { tilesetName: 'Objects_Buildings', localTileId: 49 },
    'market.large-1': { tilesetName: 'Objects_Buildings', localTileId: 44 },
    'market.large-2': { tilesetName: 'Objects_Buildings', localTileId: 50 },
    'market.large-4': { tilesetName: 'Objects_Buildings', localTileId: 51 },

    // --- Castle Props (Objects_Props_Castle, name="Objects_Props") ---
    'prop.archery-target': { tilesetName: 'Objects_Props', localTileId: 86 },
    'prop.barrel-1': { tilesetName: 'Objects_Props', localTileId: 87 },
    'prop.barrel-2': { tilesetName: 'Objects_Props', localTileId: 115 },
    'prop.bench-side': { tilesetName: 'Objects_Props', localTileId: 88 },
    'prop.bench-front': { tilesetName: 'Objects_Props', localTileId: 89 },
    'prop.bench-small': { tilesetName: 'Objects_Props', localTileId: 90 },
    'prop.table-small': { tilesetName: 'Objects_Props', localTileId: 133 },
    'prop.table-large': { tilesetName: 'Objects_Props', localTileId: 134 },
    'prop.bulletin-board': { tilesetName: 'Objects_Props', localTileId: 91 },
    'prop.board': { tilesetName: 'Objects_Props', localTileId: 187 },
    'prop.chopped-tree': { tilesetName: 'Objects_Props', localTileId: 92 },
    'prop.chopped-stump': { tilesetName: 'Objects_Props', localTileId: 186 },
    'prop.crate-small-1': { tilesetName: 'Objects_Props', localTileId: 181 },
    'prop.crate-small-2': { tilesetName: 'Objects_Props', localTileId: 180 },
    'prop.crate-medium-1': { tilesetName: 'Objects_Props', localTileId: 113 },
    'prop.crate-medium-2': { tilesetName: 'Objects_Props', localTileId: 111 },
    'prop.crate-tall-1': { tilesetName: 'Objects_Props', localTileId: 95 },
    'prop.crate-tall-2': { tilesetName: 'Objects_Props', localTileId: 96 },
    'prop.crate-wide': { tilesetName: 'Objects_Props', localTileId: 120 },
    'prop.crate-narrow': { tilesetName: 'Objects_Props', localTileId: 121 },
    'prop.crate-flat': { tilesetName: 'Objects_Props', localTileId: 171 },
    'prop.crate-water-1': { tilesetName: 'Objects_Props', localTileId: 183 },
    'prop.crate-water-2': { tilesetName: 'Objects_Props', localTileId: 182 },
    'prop.crate-hay-1': { tilesetName: 'Objects_Props', localTileId: 185 },
    'prop.crate-hay-2': { tilesetName: 'Objects_Props', localTileId: 184 },
    'prop.lamp-1': { tilesetName: 'Objects_Props', localTileId: 100 },
    'prop.lamp-2': { tilesetName: 'Objects_Props', localTileId: 101 },
    'prop.banner-standing': { tilesetName: 'Objects_Props', localTileId: 114 },
    'prop.banner-flying-large': { tilesetName: 'Objects_Props', localTileId: 178 },
    'prop.banner-flying-small': { tilesetName: 'Objects_Props', localTileId: 179 },
    'prop.sign-1': { tilesetName: 'Objects_Props', localTileId: 107 },
    'prop.sign-2': { tilesetName: 'Objects_Props', localTileId: 108 },
    'prop.sign-post-1': { tilesetName: 'Objects_Props', localTileId: 109 },
    'prop.sign-post-2': { tilesetName: 'Objects_Props', localTileId: 110 },
    'prop.weapon-stand': { tilesetName: 'Objects_Props', localTileId: 157 },

    // --- Trees (Objects_Trees_Castle, name="Objects_Trees") ---
    // Emerald trees
    'tree.emerald-1': { tilesetName: 'Objects_Trees', localTileId: 32 },
    'tree.emerald-2': { tilesetName: 'Objects_Trees', localTileId: 0 },
    'tree.emerald-3': { tilesetName: 'Objects_Trees', localTileId: 1 },
    'tree.emerald-4': { tilesetName: 'Objects_Trees', localTileId: 2 },
    'tree.emerald-5': { tilesetName: 'Objects_Trees', localTileId: 82 },
    // Light trees
    'tree.light-1': { tilesetName: 'Objects_Trees', localTileId: 3 },
    'tree.light-2': { tilesetName: 'Objects_Trees', localTileId: 4 },
    'tree.light-3': { tilesetName: 'Objects_Trees', localTileId: 5 },
    'tree.light-4': { tilesetName: 'Objects_Trees', localTileId: 6 },
    'tree.light-5': { tilesetName: 'Objects_Trees', localTileId: 83 },
    // Dark trees
    'tree.dark-1': { tilesetName: 'Objects_Trees', localTileId: 28 },
    'tree.dark-2': { tilesetName: 'Objects_Trees', localTileId: 29 },
    'tree.dark-3': { tilesetName: 'Objects_Trees', localTileId: 30 },
    'tree.dark-4': { tilesetName: 'Objects_Trees', localTileId: 31 },
    'tree.dark-5': { tilesetName: 'Objects_Trees', localTileId: 81 },
    // Palms
    'tree.palm-emerald-1': { tilesetName: 'Objects_Trees', localTileId: 66 },
    'tree.palm-emerald-2': { tilesetName: 'Objects_Trees', localTileId: 67 },
    'tree.palm-light-1': { tilesetName: 'Objects_Trees', localTileId: 68 },
    'tree.palm-dark-1': { tilesetName: 'Objects_Trees', localTileId: 64 },

    // --- Bushes ---
    'bush.emerald-1': { tilesetName: 'Objects_Trees', localTileId: 14 },
    'bush.emerald-2': { tilesetName: 'Objects_Trees', localTileId: 15 },
    'bush.emerald-3': { tilesetName: 'Objects_Trees', localTileId: 16 },
    'bush.emerald-small': { tilesetName: 'Objects_Trees', localTileId: 18 },
    'bush.light-1': { tilesetName: 'Objects_Trees', localTileId: 21 },
    'bush.light-2': { tilesetName: 'Objects_Trees', localTileId: 22 },
    'bush.light-3': { tilesetName: 'Objects_Trees', localTileId: 23 },
    'bush.dark-1': { tilesetName: 'Objects_Trees', localTileId: 7 },
    'bush.dark-2': { tilesetName: 'Objects_Trees', localTileId: 8 },
    'bush.dark-3': { tilesetName: 'Objects_Trees', localTileId: 9 },

    // --- Leafy Bushes ---
    'bush.leafy-emerald-1': { tilesetName: 'Objects_Trees', localTileId: 52 },
    'bush.leafy-emerald-2': { tilesetName: 'Objects_Trees', localTileId: 53 },
    'bush.leafy-emerald-3': { tilesetName: 'Objects_Trees', localTileId: 54 },
    'bush.leafy-light-1': { tilesetName: 'Objects_Trees', localTileId: 56 },
    'bush.leafy-dark-1': { tilesetName: 'Objects_Trees', localTileId: 48 },
  },
};
