import type { PaletteSpec } from '../palette-builder.ts';

const TSX_BASE = 'assets/tilesets/village/interiors/Tiled/Tileset';
const TMX_TO_TSX = '../../../../assets/tilesets/village/interiors/Tiled/Tileset';

/**
 * Interior Premium palette — the palette for child world tilesets.
 * Uses the premium indoor tileset pack for all child world maps:
 * Khali's shop, Hark's forge, Bright Hearth inn,
 * Elder's house, libraries, and other indoor locations.
 *
 * Features floor tiles with carpet overlays (Wang-set auto-tiled),
 * wall grid tiles (no Wang sets — fixed tile IDs), and extensive
 * prop objects for furnishing rooms.
 *
 * TSX include order matches the Tavern_1 / WeaponSeller_1 reference TMX:
 *   Floor (firstgid 1) → Walls (3277) → Objects (7337) → Atlas (17837)
 *
 * Tileset tile counts:
 *   Tileset_Floor_Interiors:  3276 tiles (42 cols × 78 rows, 672×1248px)
 *   Tileset_Walls_Interiors:  4060 tiles (29 cols × 140 rows, 464×2240px)
 *   Objects_Props_Interiors:   563 tiles (collection, individual images)
 *   Atlas_Props_Interiors:   10500 tiles (35 cols × 300 rows, 560×4800px)
 */
export const interiorPremiumSpec: PaletteSpec = {
  name: 'interior-premium',
  tsxBaseDir: TSX_BASE,
  tmxToTsxRelDir: TMX_TO_TSX,

  // Include TSX files in order matching the Tavern_1 reference TMX.
  // Floor first, then walls, then object props, then atlas props.
  tsxFiles: [
    'Tileset_Floor_Interiors.tsx',
    'Tileset_Walls_Interiors.tsx',
    'Objects_Props_Interiors.tsx',
    'Atlas_Props_Interiors.tsx',
  ],

  // --- Terrain mappings (Wang set auto-tiling) ---
  // Only the Floor tileset has Wang sets (Carpets, type=mixed, 7 colors).
  // Color 1 ("Empty") is the base floor — not mapped as a terrain since
  // it represents "no carpet." Carpets 2-7 are auto-tiled overlays.
  terrains: {
    // Carpet overlays (Tileset_Floor_Interiors, wangSet="Carpets")
    'carpet.red': {
      tilesetName: 'Tileset_Floor_Interiors',
      wangSetName: 'Carpets',
      colorName: 'Red Carpet',
    },
    'carpet.green': {
      tilesetName: 'Tileset_Floor_Interiors',
      wangSetName: 'Carpets',
      colorName: 'Green Carpet',
    },
    'carpet.purple': {
      tilesetName: 'Tileset_Floor_Interiors',
      wangSetName: 'Carpets',
      colorName: 'Purple Carpet',
    },
    'carpet.blue': {
      tilesetName: 'Tileset_Floor_Interiors',
      wangSetName: 'Carpets',
      colorName: 'Blue Carpet',
    },
    'carpet.white': {
      tilesetName: 'Tileset_Floor_Interiors',
      wangSetName: 'Carpets',
      colorName: 'White Carpet',
    },
    'carpet.yellow': {
      tilesetName: 'Tileset_Floor_Interiors',
      wangSetName: 'Carpets',
      colorName: 'Yellow Carpet',
    },
    // Convenience alias — "carpet" defaults to red (most common in taverns/shops)
    carpet: {
      tilesetName: 'Tileset_Floor_Interiors',
      wangSetName: 'Carpets',
      colorName: 'Red Carpet',
    },
  },

  // --- Fixed tile mappings (non-auto-tiled grid tiles) ---
  // Floors use repeating 2×2 patterns from the Floor tileset.
  // Walls are structural tiles from the Walls tileset (columns=29, no Wang sets).
  // Reference tile IDs extracted from the 11 child world TMX files.
  fixed: {
    // ===== FLOOR PATTERNS (Tileset_Floor_Interiors) =====
    // Wood floor — 2×2 repeating (most common: taverns, houses, shops)
    // tiles 1772,1773 / 1814,1815 (0-indexed in TSX)
    'floor.wood-tl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1772 },
    'floor.wood-tr': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1773 },
    'floor.wood-bl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1814 },
    'floor.wood-br': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1815 },

    // Wood floor variant — darker plank pattern
    'floor.wood-dark-tl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1781 },
    'floor.wood-dark-tr': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1782 },
    'floor.wood-dark-bl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1823 },
    'floor.wood-dark-br': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1824 },

    // Stone floor — 2×2 repeating (libraries, castles)
    // tiles 2276,2277 / 2318,2319 (column 42 layout)
    'floor.stone-tl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2276 },
    'floor.stone-tr': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2277 },
    'floor.stone-bl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2318 },
    'floor.stone-br': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2319 },

    // Stone floor variant — mosaic accent tiles
    'floor.stone-mosaic-tl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2281 },
    'floor.stone-mosaic-tr': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2282 },
    'floor.stone-mosaic-bl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2323 },
    'floor.stone-mosaic-br': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2324 },

    // Checkered stone floor — castle variant
    'floor.stone-check-tl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2287 },
    'floor.stone-check-tr': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2288 },
    'floor.stone-check-bl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2329 },
    'floor.stone-check-br': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2330 },

    // Tavern tile floor — 2×2 warm tones
    'floor.tavern-tl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1752 },
    'floor.tavern-tr': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1753 },
    'floor.tavern-bl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1794 },
    'floor.tavern-br': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1795 },

    // Floor stairs / raised platform accents
    'floor.stairs-tl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2284 },
    'floor.stairs-tr': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2285 },
    'floor.stairs-bl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2290 },
    'floor.stairs-br': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2291 },

    // Floor rug accent tiles (from Tavern_1 floor layer — non-wang small mats)
    'floor.rug-tl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2365 },
    'floor.rug-tr': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2366 },
    'floor.rug-bl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2368 },
    'floor.rug-br': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2369 },

    // Fireplace floor tiles
    'floor.hearth-tl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1784 },
    'floor.hearth-tr': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1785 },
    'floor.hearth-bl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1826 },
    'floor.hearth-br': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 1827 },

    // Floor transition — wood to stone step tiles
    'floor.step-tl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2023 },
    'floor.step-tr': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2024 },
    'floor.step-bl': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2032 },
    'floor.step-br': { tilesetName: 'Tileset_Floor_Interiors', localTileId: 2033 },

    // ===== WALL TILES (Tileset_Walls_Interiors) =====
    // Wall style 1 — gray stone (most common: weapon shops, houses)
    // Top row (ceiling edge): 3-tile pattern TL/T/TR
    'wall.gray-tl': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 87 },
    'wall.gray-t': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 88 },
    'wall.gray-tr': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 89 },
    // Upper wall face (below ceiling)
    'wall.gray-face-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 116 },
    'wall.gray-face': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 117 },
    'wall.gray-face-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 118 },
    // Mid-wall (decorative strip)
    'wall.gray-mid-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 145 },
    'wall.gray-mid': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 146 },
    'wall.gray-mid-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 147 },
    // Bottom wall row (baseboard / shadow)
    'wall.gray-bot-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 174 },
    'wall.gray-bot': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 175 },
    'wall.gray-bot-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 176 },
    // Side walls (vertical, left/right)
    'wall.gray-side-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 203 },
    'wall.gray-side-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 205 },
    // Bottom wall (horizontal, south-facing)
    'wall.gray-south-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 348 },
    'wall.gray-south': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 349 },
    'wall.gray-south-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 350 },
    // Corners
    'wall.gray-corner-bl': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 377 },
    'wall.gray-corner-br': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 379 },

    // Wall style 2 — warm wood (taverns, inns)
    'wall.wood-tl': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1054 },
    'wall.wood-t': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1055 },
    'wall.wood-tr': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1056 },
    'wall.wood-face-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1083 },
    'wall.wood-face': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1084 },
    'wall.wood-face-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1085 },
    'wall.wood-mid-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1112 },
    'wall.wood-mid': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1113 },
    'wall.wood-mid-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1114 },
    'wall.wood-bot-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1141 },
    'wall.wood-bot': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1142 },
    'wall.wood-bot-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1143 },
    'wall.wood-side-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1170 },
    'wall.wood-side-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1172 },
    'wall.wood-south-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1315 },
    'wall.wood-south': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1316 },
    'wall.wood-south-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1317 },
    'wall.wood-corner-bl': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1344 },
    'wall.wood-corner-br': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1346 },

    // Wall style 3 — stone castle (grand halls, libraries)
    'wall.castle-tl': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2101 },
    'wall.castle-t': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2102 },
    'wall.castle-tr': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2103 },
    'wall.castle-face-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2130 },
    'wall.castle-face': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2131 },
    'wall.castle-face-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2132 },
    'wall.castle-mid-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2159 },
    'wall.castle-mid': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2160 },
    'wall.castle-mid-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2161 },
    'wall.castle-bot-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2188 },
    'wall.castle-bot': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2189 },
    'wall.castle-bot-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2190 },
    'wall.castle-side-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2217 },
    'wall.castle-side-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2219 },
    'wall.castle-south-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2362 },
    'wall.castle-south': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2363 },
    'wall.castle-south-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2364 },
    'wall.castle-corner-bl': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2391 },
    'wall.castle-corner-br': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 2393 },

    // Wall decorative elements — fireplaces, windows, alcoves
    // Shop counter wall (horizontal counter surface with backdrop)
    'wall.counter-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1624 },
    'wall.counter': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1625 },
    'wall.counter-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1626 },

    // Interior door — south-facing double door (wall cutout)
    'wall.door-l': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1396 },
    'wall.door-r': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 1397 },

    // Fireplace (3-wide wall feature)
    'wall.fireplace-tl': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 941 },
    'wall.fireplace-t': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 942 },
    'wall.fireplace-tr': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 943 },
    'wall.fireplace-bl': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 970 },
    'wall.fireplace-b': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 971 },
    'wall.fireplace-br': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 972 },

    // Interior partition wall (T-junction / room divider)
    'wall.partition-t': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 290 },
    'wall.partition-mid': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 319 },
    'wall.partition-bot': { tilesetName: 'Tileset_Walls_Interiors', localTileId: 348 },
  },

  // --- Object mappings from collection tilesets ---
  objects: {
    // ===== ARMOR STANDS =====
    'armor-stand.blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 721 },
    'armor-stand.green': { tilesetName: 'Objects_Props_Interiors', localTileId: 719 },
    'armor-stand.purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 720 },
    'armor-stand.red': { tilesetName: 'Objects_Props_Interiors', localTileId: 718 },
    'armor-stand.yellow': { tilesetName: 'Objects_Props_Interiors', localTileId: 717 },

    // ===== BANNERS (wall decorations) =====
    'banner.large-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 789 },
    'banner.large-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 791 },
    'banner.large-purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 793 },
    'banner.large-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 795 },
    'banner.large-yellow': { tilesetName: 'Objects_Props_Interiors', localTileId: 797 },
    'banner.medium-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 799 },
    'banner.medium-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 801 },
    'banner.medium-purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 803 },
    'banner.medium-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 805 },
    'banner.medium-yellow': { tilesetName: 'Objects_Props_Interiors', localTileId: 807 },

    // ===== BARRELS =====
    'barrel.empty': { tilesetName: 'Objects_Props_Interiors', localTileId: 306 },
    'barrel.water': { tilesetName: 'Objects_Props_Interiors', localTileId: 307 },
    'barrel.covered': { tilesetName: 'Objects_Props_Interiors', localTileId: 308 },
    'barrel.fish': { tilesetName: 'Objects_Props_Interiors', localTileId: 309 },
    'barrel.steel-bars': { tilesetName: 'Objects_Props_Interiors', localTileId: 310 },
    'barrel.cloth': { tilesetName: 'Objects_Props_Interiors', localTileId: 311 },
    'barrel.meat': { tilesetName: 'Objects_Props_Interiors', localTileId: 312 },
    'barrel.swords': { tilesetName: 'Objects_Props_Interiors', localTileId: 704 },
    'barrel.fishing-rod': { tilesetName: 'Objects_Props_Interiors', localTileId: 687 },
    'barrel.horizontal-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 313 },
    'barrel.horizontal-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 314 },
    'barrel.small-empty': { tilesetName: 'Objects_Props_Interiors', localTileId: 648 },
    'barrel.small-water': { tilesetName: 'Objects_Props_Interiors', localTileId: 649 },
    'barrel.small-fish': { tilesetName: 'Objects_Props_Interiors', localTileId: 650 },
    'barrel.small-meat': { tilesetName: 'Objects_Props_Interiors', localTileId: 646 },
    'barrel.small-arrows': { tilesetName: 'Objects_Props_Interiors', localTileId: 651 },
    'barrel.small-covered': { tilesetName: 'Objects_Props_Interiors', localTileId: 647 },
    'barrel.destroyed': { tilesetName: 'Objects_Props_Interiors', localTileId: 686 },

    // ===== BASKETS =====
    'basket.empty': { tilesetName: 'Objects_Props_Interiors', localTileId: 315 },
    'basket.tomatoes': { tilesetName: 'Objects_Props_Interiors', localTileId: 316 },
    'basket.eggplants': { tilesetName: 'Objects_Props_Interiors', localTileId: 317 },
    'basket.carrots': { tilesetName: 'Objects_Props_Interiors', localTileId: 318 },
    'basket.apples': { tilesetName: 'Objects_Props_Interiors', localTileId: 319 },

    // ===== BEDS =====
    'bed.simple-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 320 },
    'bed.simple-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 321 },
    'bed.fancy-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 322 },
    'bed.fancy-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 324 },
    'bed.fancy-purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 326 },
    'bed.fancy-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 328 },
    'bed.fancy-left-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 330 },
    'bed.fancy-right-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 331 },
    'bed.fancy-left-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 332 },
    'bed.fancy-right-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 333 },
    'bed.fancy-left-purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 770 },
    'bed.fancy-right-purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 335 },
    'bed.fancy-left-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 336 },
    'bed.fancy-right-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 337 },
    'bed.hay': { tilesetName: 'Objects_Props_Interiors', localTileId: 338 },
    'bed.side-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 339 },
    'bed.side-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 340 },

    // ===== BED TABLES =====
    'bedtable.small': { tilesetName: 'Objects_Props_Interiors', localTileId: 343 },
    'bedtable.medium': { tilesetName: 'Objects_Props_Interiors', localTileId: 344 },
    'bedtable.tall-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 345 },
    'bedtable.tall-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 346 },
    'bedtable.tall-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 347 },

    // ===== BENCHES =====
    'bench.front': { tilesetName: 'Objects_Props_Interiors', localTileId: 348 },
    'bench.side': { tilesetName: 'Objects_Props_Interiors', localTileId: 349 },
    'bench.small': { tilesetName: 'Objects_Props_Interiors', localTileId: 350 },
    'bench.back': { tilesetName: 'Objects_Props_Interiors', localTileId: 351 },
    'bench.long-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 352 },
    'bench.long-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 353 },
    'bench.long-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 354 },

    // ===== BOOKS & SCROLLS =====
    'book.single-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 357 },
    'book.single-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 358 },
    'book.open': { tilesetName: 'Objects_Props_Interiors', localTileId: 359 },
    'books.row-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 360 },
    'books.row-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 361 },
    'books.row-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 362 },
    'books.row-4': { tilesetName: 'Objects_Props_Interiors', localTileId: 363 },
    'books.row-5': { tilesetName: 'Objects_Props_Interiors', localTileId: 364 },
    'books.row-6': { tilesetName: 'Objects_Props_Interiors', localTileId: 365 },
    'books.row-7': { tilesetName: 'Objects_Props_Interiors', localTileId: 366 },
    'books.row-8': { tilesetName: 'Objects_Props_Interiors', localTileId: 367 },
    'books.row-9': { tilesetName: 'Objects_Props_Interiors', localTileId: 368 },
    'scroll.single': { tilesetName: 'Objects_Props_Interiors', localTileId: 484 },

    // ===== BOTTLES (tabletop & wall-hung) =====
    'bottle.red': { tilesetName: 'Objects_Props_Interiors', localTileId: 369 },
    'bottle.green': { tilesetName: 'Objects_Props_Interiors', localTileId: 371 },
    'bottle.purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 373 },
    'bottle.blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 375 },
    'bottle.small-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 377 },
    'bottle.small-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 379 },
    'bottle.small-purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 381 },
    'bottle.small-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 383 },
    'bottle.round-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 673 },
    'bottle.round-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 676 },
    'bottle.hanging-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 665 },
    'bottle.hanging-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 666 },
    'bottle.hanging-purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 667 },
    'bottle.hanging-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 668 },
    'bottle.potion-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 683 },
    'bottle.potion-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 684 },
    'bottle.potion-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 682 },

    // ===== BRAZIERS & CANDLES =====
    'brazier.large': { tilesetName: 'Objects_Props_Interiors', localTileId: 385 },
    'brazier.large-pot': { tilesetName: 'Objects_Props_Interiors', localTileId: 386 },
    'brazier.small': { tilesetName: 'Objects_Props_Interiors', localTileId: 387 },
    'brazier.small-pot': { tilesetName: 'Objects_Props_Interiors', localTileId: 388 },
    'candle.1': { tilesetName: 'Objects_Props_Interiors', localTileId: 389 },
    'candle.2': { tilesetName: 'Objects_Props_Interiors', localTileId: 390 },
    'candle.3': { tilesetName: 'Objects_Props_Interiors', localTileId: 391 },
    'candle.4': { tilesetName: 'Objects_Props_Interiors', localTileId: 392 },
    'candle.5': { tilesetName: 'Objects_Props_Interiors', localTileId: 393 },
    'candleholder.gold-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 641 },
    'candleholder.gold-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 642 },
    'candleholder.gold-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 643 },
    'candleholder.steel-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 644 },
    'candleholder.steel-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 645 },
    'candleholder.steel-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 640 },

    // ===== CARPETS (object-placed, not wang-tiled) =====
    'carpet-obj.1': { tilesetName: 'Objects_Props_Interiors', localTileId: 398 },
    'carpet-obj.2': { tilesetName: 'Objects_Props_Interiors', localTileId: 399 },
    'carpet-obj.3': { tilesetName: 'Objects_Props_Interiors', localTileId: 652 },
    'carpet-obj.4': { tilesetName: 'Objects_Props_Interiors', localTileId: 722 },
    'carpet-obj.5': { tilesetName: 'Objects_Props_Interiors', localTileId: 723 },

    // ===== CHAIRS =====
    'chair.front-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 850 },
    'chair.front-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 854 },
    'chair.front-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 852 },
    'chair.front-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 851 },
    'chair.left-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 857 },
    'chair.right-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 864 },
    'chair.back-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 849 },

    // ===== CHESTS =====
    'chest.gold-closed': { tilesetName: 'Objects_Props_Interiors', localTileId: 400 },
    'chest.gold-open': { tilesetName: 'Objects_Props_Interiors', localTileId: 401 },
    'chest.gold-full': { tilesetName: 'Objects_Props_Interiors', localTileId: 402 },
    'chest.steel-closed': { tilesetName: 'Objects_Props_Interiors', localTileId: 403 },
    'chest.steel-open': { tilesetName: 'Objects_Props_Interiors', localTileId: 404 },
    'chest.steel-full': { tilesetName: 'Objects_Props_Interiors', localTileId: 405 },
    'chest.wood-closed': { tilesetName: 'Objects_Props_Interiors', localTileId: 406 },
    'chest.wood-open': { tilesetName: 'Objects_Props_Interiors', localTileId: 407 },
    'chest.wood-full': { tilesetName: 'Objects_Props_Interiors', localTileId: 408 },

    // ===== CLOTH & DYED GOODS =====
    'cloth.red': { tilesetName: 'Objects_Props_Interiors', localTileId: 410 },
    'cloth.green': { tilesetName: 'Objects_Props_Interiors', localTileId: 411 },
    'cloth.purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 412 },
    'cloth.blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 413 },
    'cloth.rolled-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 690 },
    'cloth.rolled-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 691 },
    'cloth.rolled-purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 692 },
    'cloth.rolled-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 689 },
    'dyed-cloth.big-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 725 },
    'dyed-cloth.big-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 726 },
    'dyed-cloth.big-purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 727 },
    'dyed-cloth.big-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 728 },
    'dyed-cloth.medium-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 729 },
    'dyed-cloth.medium-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 724 },

    // ===== CRATES =====
    'crate.large-closed': { tilesetName: 'Objects_Props_Interiors', localTileId: 414 },
    'crate.large-empty': { tilesetName: 'Objects_Props_Interiors', localTileId: 415 },
    'crate.medium-closed': { tilesetName: 'Objects_Props_Interiors', localTileId: 420 },
    'crate.medium-empty': { tilesetName: 'Objects_Props_Interiors', localTileId: 421 },
    'crate.medium-right': { tilesetName: 'Objects_Props_Interiors', localTileId: 416 },
    'crate.medium-left': { tilesetName: 'Objects_Props_Interiors', localTileId: 417 },
    'crate.small-empty': { tilesetName: 'Objects_Props_Interiors', localTileId: 424 },
    'crate.small-tomatoes': { tilesetName: 'Objects_Props_Interiors', localTileId: 432 },
    'crate.small-carrots': { tilesetName: 'Objects_Props_Interiors', localTileId: 434 },
    'crate.small-eggplants': { tilesetName: 'Objects_Props_Interiors', localTileId: 433 },
    'crate.small-flowers-white': { tilesetName: 'Objects_Props_Interiors', localTileId: 427 },
    'crate.small-flowers-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 428 },
    'crate.steel-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 435 },
    'crate.steel-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 436 },
    'crate.water': { tilesetName: 'Objects_Props_Interiors', localTileId: 437 },

    // ===== DESKS =====
    'desk.simple-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 439 },
    'desk.simple-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 440 },
    'desk.tall-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 441 },
    'desk.tall-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 442 },
    'desk.corner-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 444 },
    'desk.corner-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 445 },
    'desk.corner-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 446 },
    'desk.corner-4': { tilesetName: 'Objects_Props_Interiors', localTileId: 447 },
    'desk.side-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 448 },
    'desk.side-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 449 },
    'desk.side-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 450 },

    // ===== FISH (wall-hung) =====
    'fish.hanging-white': { tilesetName: 'Objects_Props_Interiors', localTileId: 657 },
    'fish.hanging-purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 658 },
    'fish.hanging-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 659 },
    'fish.hanging-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 660 },
    'fish.hanging-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 823 },
    'fishing-net.1': { tilesetName: 'Objects_Props_Interiors', localTileId: 661 },
    'fishing-net.2': { tilesetName: 'Objects_Props_Interiors', localTileId: 662 },
    'fishing-rod.1': { tilesetName: 'Objects_Props_Interiors', localTileId: 663 },

    // ===== FOOD =====
    'food.meat': { tilesetName: 'Objects_Props_Interiors', localTileId: 453 },
    'food.steak-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 454 },
    'food.steak-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 455 },
    'food.cheese': { tilesetName: 'Objects_Props_Interiors', localTileId: 664 },
    'glass.1': { tilesetName: 'Objects_Props_Interiors', localTileId: 456 },
    'glass.2': { tilesetName: 'Objects_Props_Interiors', localTileId: 457 },
    'plate.1': { tilesetName: 'Objects_Props_Interiors', localTileId: 461 },
    'plate.2': { tilesetName: 'Objects_Props_Interiors', localTileId: 462 },

    // ===== KNIVES & WEAPONS =====
    'knife.hanging': { tilesetName: 'Objects_Props_Interiors', localTileId: 826 },
    'knife.table': { tilesetName: 'Objects_Props_Interiors', localTileId: 827 },
    'cleaver.1': { tilesetName: 'Objects_Props_Interiors', localTileId: 409 },
    'sword.wall': { tilesetName: 'Objects_Props_Interiors', localTileId: 557 },

    // ===== LANTERNS =====
    'lantern.small': { tilesetName: 'Objects_Props_Interiors', localTileId: 458 },
    'lantern.tall': { tilesetName: 'Objects_Props_Interiors', localTileId: 847 },

    // ===== LECTERNS =====
    'lectern.plain': { tilesetName: 'Objects_Props_Interiors', localTileId: 782 },
    'lectern.green': { tilesetName: 'Objects_Props_Interiors', localTileId: 784 },
    'lectern.red': { tilesetName: 'Objects_Props_Interiors', localTileId: 786 },
    'lectern.blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 783 },

    // ===== PACKAGES & SACKS =====
    'package.large': { tilesetName: 'Objects_Props_Interiors', localTileId: 459 },
    'package.small': { tilesetName: 'Objects_Props_Interiors', localTileId: 460 },
    'sack.large-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 482 },
    'sack.large-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 483 },
    'sack.small': { tilesetName: 'Objects_Props_Interiors', localTileId: 625 },
    'sack.tall': { tilesetName: 'Objects_Props_Interiors', localTileId: 626 },
    'bucket.1': { tilesetName: 'Objects_Props_Interiors', localTileId: 688 },

    // ===== POTS (ceramic & stone) =====
    'pot.ceramic-small-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 463 },
    'pot.ceramic-tall-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 464 },
    'pot.ceramic-tall-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 465 },
    'pot.ceramic-small-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 466 },
    'pot.ceramic-tall-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 467 },
    'pot.ceramic-large-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 472 },
    'pot.ceramic-large-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 473 },
    'pot.stone-small-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 474 },
    'pot.stone-tall-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 475 },
    'pot.stone-tall-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 476 },
    'pot.stone-large-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 478 },

    // ===== SHELVES =====
    // Front-facing shelves (wall-mounted, facing the player)
    'shelf.short-books-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 500 },
    'shelf.short-books-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 501 },
    'shelf.short-books-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 502 },
    'shelf.short-bottles-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 503 },
    'shelf.short-bottles-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 504 },
    'shelf.short-bottles-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 505 },
    'shelf.short-closet-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 506 },
    'shelf.short-closet-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 507 },
    'shelf.short-glass-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 509 },
    'shelf.short-glass-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 510 },
    'shelf.short-scrolls-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 512 },
    'shelf.short-scrolls-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 513 },
    'shelf.medium-books-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 486 },
    'shelf.medium-books-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 487 },
    'shelf.medium-bottles-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 489 },
    'shelf.medium-bottles-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 490 },
    'shelf.medium-closet-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 492 },
    'shelf.medium-closet-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 493 },
    'shelf.medium-glass-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 495 },
    'shelf.medium-glass-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 496 },
    'shelf.medium-scrolls-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 498 },
    'shelf.medium-scrolls-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 499 },
    'shelf.tall-books-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 533 },
    'shelf.tall-books-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 534 },
    'shelf.tall-books-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 535 },
    'shelf.tall-bottles-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 536 },
    'shelf.tall-bottles-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 537 },
    'shelf.tall-bottles-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 538 },
    'shelf.tall-closet-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 539 },
    'shelf.tall-closet-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 540 },
    'shelf.tall-glass-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 542 },
    'shelf.tall-glass-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 544 },
    'shelf.tall-scrolls-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 546 },
    'shelf.tall-scrolls-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 547 },
    // Side-facing shelves (viewed from the side, used against left/right walls)
    'shelf.side-short-left-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 521 },
    'shelf.side-short-right-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 524 },
    'shelf.side-medium-left-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 517 },
    'shelf.side-medium-right-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 520 },
    'shelf.side-tall-left-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 528 },
    'shelf.side-tall-left-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 529 },
    'shelf.side-tall-right-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 532 },
    // Wall-mounted shelves (smaller, decorative)
    'shelf.wall-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 548 },
    'shelf.wall-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 549 },
    'shelf.wall-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 550 },
    'shelf.wall-large-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 553 },
    'shelf.wall-large-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 555 },

    // ===== SHIELDS (wall-mounted) =====
    'shield.front-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 556 },
    'shield.front-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 693 },
    'shield.front-purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 694 },
    'shield.front-blue': { tilesetName: 'Objects_Props_Interiors', localTileId: 695 },
    'shield.side-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 696 },
    'shield.side-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 697 },
    'shield.side-purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 698 },
    'shield.swords-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 700 },
    'shield.swords-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 701 },
    'shield.swords-purple': { tilesetName: 'Objects_Props_Interiors', localTileId: 702 },

    // ===== SKULL =====
    'skull.animal': { tilesetName: 'Objects_Props_Interiors', localTileId: 677 },

    // ===== TABLES =====
    'table.large-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 558 },
    'table.large-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 559 },
    'table.large-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 560 },
    'table.large-white-stripe': { tilesetName: 'Objects_Props_Interiors', localTileId: 563 },
    'table.large-red-stripe': { tilesetName: 'Objects_Props_Interiors', localTileId: 564 },
    'table.medium-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 568 },
    'table.medium-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 570 },
    'table.medium-white-stripe': { tilesetName: 'Objects_Props_Interiors', localTileId: 573 },
    'table.medium-white': { tilesetName: 'Objects_Props_Interiors', localTileId: 814 },
    'table.small-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 578 },
    'table.small-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 579 },
    'table.small-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 580 },
    'table.small-white-stripe': { tilesetName: 'Objects_Props_Interiors', localTileId: 583 },
    'table.small-white': { tilesetName: 'Objects_Props_Interiors', localTileId: 810 },
    'table.vertical-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 833 },
    'table.vertical-green': { tilesetName: 'Objects_Props_Interiors', localTileId: 837 },
    'table.vertical-red': { tilesetName: 'Objects_Props_Interiors', localTileId: 841 },
    'table.vertical-yellow': { tilesetName: 'Objects_Props_Interiors', localTileId: 845 },

    // ===== VASES =====
    'vase.small': { tilesetName: 'Objects_Props_Interiors', localTileId: 588 },
    'vase.tall': { tilesetName: 'Objects_Props_Interiors', localTileId: 589 },
    'vase.medium-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 590 },
    'vase.medium-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 591 },
    'vase.large': { tilesetName: 'Objects_Props_Interiors', localTileId: 592 },

    // ===== WALL DECORATIONS =====
    'wall-art.bow-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 593 },
    'wall-art.bow-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 594 },
    'wall-art.map-large': { tilesetName: 'Objects_Props_Interiors', localTileId: 595 },
    'wall-art.map-medium': { tilesetName: 'Objects_Props_Interiors', localTileId: 596 },
    'wall-art.map-small': { tilesetName: 'Objects_Props_Interiors', localTileId: 597 },
    'wall-art.painting-large-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 598 },
    'wall-art.painting-large-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 599 },
    'wall-art.painting-medium-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 600 },
    'wall-art.painting-medium-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 601 },
    'wall-art.painting-small-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 602 },
    'wall-art.painting-small-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 603 },

    // ===== WARDROBES =====
    'wardrobe.1': { tilesetName: 'Objects_Props_Interiors', localTileId: 604 },
    'wardrobe.2': { tilesetName: 'Objects_Props_Interiors', localTileId: 605 },
    'wardrobe.3': { tilesetName: 'Objects_Props_Interiors', localTileId: 606 },
    'wardrobe.side': { tilesetName: 'Objects_Props_Interiors', localTileId: 609 },

    // ===== WEAPONS STANDS =====
    'weapon-stand.basic-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 610 },
    'weapon-stand.basic-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 611 },
    'weapon-stand.tall-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 612 },
    'weapon-stand.tall-6': { tilesetName: 'Objects_Props_Interiors', localTileId: 615 },
    'weapon-stand.purple-4': { tilesetName: 'Objects_Props_Interiors', localTileId: 707 },
    'weapon-stand.red-4': { tilesetName: 'Objects_Props_Interiors', localTileId: 708 },
    'weapon-stand.green-4': { tilesetName: 'Objects_Props_Interiors', localTileId: 706 },
    'weapon-stand.purple-5': { tilesetName: 'Objects_Props_Interiors', localTileId: 711 },
    'weapon-stand.green-5': { tilesetName: 'Objects_Props_Interiors', localTileId: 710 },
    'weapon-stand.red-7': { tilesetName: 'Objects_Props_Interiors', localTileId: 716 },
    'weapon-stand.green-7': { tilesetName: 'Objects_Props_Interiors', localTileId: 714 },
    'weapon-stand.purple-7': { tilesetName: 'Objects_Props_Interiors', localTileId: 715 },

    // ===== WINDOWS =====
    'window.wood-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 633 },
    'window.wood-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 634 },
    'window.wood-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 635 },
    'window.wood-4': { tilesetName: 'Objects_Props_Interiors', localTileId: 636 },
    'window.wood-6': { tilesetName: 'Objects_Props_Interiors', localTileId: 638 },
    'window.stone-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 774 },
    'window.stone-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 775 },
    'window.stone-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 776 },
    'window.stone-6': { tilesetName: 'Objects_Props_Interiors', localTileId: 779 },

    // ===== WRITING DESKS =====
    'writing-desk.1': { tilesetName: 'Objects_Props_Interiors', localTileId: 617 },
    'writing-desk.book-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 620 },
    'writing-desk.book-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 621 },
    'writing-desk.book-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 622 },
    'writing-desk.map-1': { tilesetName: 'Objects_Props_Interiors', localTileId: 623 },
    'writing-desk.map-2': { tilesetName: 'Objects_Props_Interiors', localTileId: 624 },
    'writing-desk.map-3': { tilesetName: 'Objects_Props_Interiors', localTileId: 305 },

    // ===== BLOOD / DEBRIS =====
    'blood.small': { tilesetName: 'Objects_Props_Interiors', localTileId: 355 },
    'blood.large': { tilesetName: 'Objects_Props_Interiors', localTileId: 356 },
  },
};
