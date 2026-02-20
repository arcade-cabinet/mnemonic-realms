import type { PaletteSpec } from '../palette-builder.ts';

const TSX_BASE = 'assets/tilesets/sketch-realm/Tiled/Tilesets';
const TMX_TO_TSX = '../../../../assets/tilesets/sketch-realm/Tiled/Tilesets';

/**
 * Desert Sketch palette.
 * Uses the desert outdoor tileset pack for Luminous Wastes,
 * Undrawn Peaks, and Half-Drawn Forest maps (Act 3 Sketch Realm).
 *
 * The Sketch Realm is the most surreal zone in Mnemonic Realms --
 * structures are literally "sketched" and incomplete, trailing off
 * into void at the edges of the drawn world. This palette provides
 * sand terrains, oasis water, desert flora, and crumbling ruins
 * that convey the half-finished aesthetic.
 *
 * All TSX files from the desert pack are included and assigned
 * firstgids in order. Only the ones with Wang sets get terrain mappings.
 */
export const desertSketchSpec: PaletteSpec = {
  name: 'desert-sketch',
  tsxBaseDir: TSX_BASE,
  tmxToTsxRelDir: TMX_TO_TSX,

  // Include TSX files: object collections first, then atlas sheets,
  // then grid tilesets, then animations.
  tsxFiles: [
    'Objects_Buildings_Desert.tsx',
    'Objects_Props_Desert.tsx',
    'Objects_Rocks_Desert.tsx',
    'Objects_Trees_Desert.tsx',
    'Atlas_Building_Props_Desert.tsx',
    'Atlas_Buildings_Desert.tsx',
    'Atlas_Props_Desert.tsx',
    'Atlas_Rocks_Desert.tsx',
    'Atlas_Trees_Bushes_Desert.tsx',
    'Tileset_Fence.tsx',
    'Tileset_Ground.tsx',
    'Tileset_Road.tsx',
    'Tileset_Sand.tsx',
    'Tileset_Shadow.tsx',
    'Tileset_TallGrass_Desert.tsx',
    'Tileset_Water.tsx',
    'Tileset_RockSlope2.tsx',
    'Tileset_RockSlope_Sand.tsx',
    'Tileset_Wall.tsx',
    'Animation_Banner_1.tsx',
    'Animation_Banner_3.tsx',
    'Animation_Campfire.tsx',
    'Animation_Door.tsx',
    'Animation_Flowers.tsx',
    'Animation_Magic_Crystal_Purple.tsx',
    'Animation_MarketStand_1.tsx',
    'Animation_MarketStand_2.tsx',
    'Animation_Torch_1.tsx',
    'Animation_Waterfall.tsx',
  ],

  // --- Terrain mappings (Wang set auto-tiling) ---
  terrains: {
    // Ground terrains (Tileset_Ground, wang="Grounds", type="mixed")
    // 9 colors: Empty, Grass, Light Grass, Dark Grass, Winter Grass,
    //           Autumn Grass, Dirt, Dark Autumn Grass, Cherry Grass
    'ground.grass': {
      tilesetName: 'Tileset_Ground',
      wangSetName: 'Grounds',
      colorName: 'Grass',
    },
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
    'ground.dirt': {
      tilesetName: 'Tileset_Ground',
      wangSetName: 'Grounds',
      colorName: 'Dirt',
    },
    'ground.autumn': {
      tilesetName: 'Tileset_Ground',
      wangSetName: 'Grounds',
      colorName: 'Autumn Grass',
    },
    'ground.winter': {
      tilesetName: 'Tileset_Ground',
      wangSetName: 'Grounds',
      colorName: 'Winter Grass',
    },
    'ground.dark-autumn': {
      tilesetName: 'Tileset_Ground',
      wangSetName: 'Grounds',
      colorName: 'Dark Autumn Grass',
    },
    'ground.cherry': {
      tilesetName: 'Tileset_Ground',
      wangSetName: 'Grounds',
      colorName: 'Cherry Grass',
    },

    // Ground fallbacks for sketch-realm biomes
    'ground.mud': { tilesetName: 'Tileset_Ground', wangSetName: 'Grounds', colorName: 'Dirt' },
    'ground.stone': { tilesetName: 'Tileset_Ground', wangSetName: 'Grounds', colorName: 'Dirt' },
    'ground.void': {
      tilesetName: 'Tileset_Ground',
      wangSetName: 'Grounds',
      colorName: 'Dark Grass',
    },

    // Sand terrains (Tileset_Sand, wang="Beach", type="mixed")
    // 6 colors: Empty, Sand, Sea, Dark Sand, Mid Sea, Dark Sea
    sand: { tilesetName: 'Tileset_Sand', wangSetName: 'Beach', colorName: 'Sand' },
    'ground.sand': { tilesetName: 'Tileset_Sand', wangSetName: 'Beach', colorName: 'Sand' },
    'ground.light-sand': { tilesetName: 'Tileset_Sand', wangSetName: 'Beach', colorName: 'Sand' },
    'ground.dark-sand': {
      tilesetName: 'Tileset_Sand',
      wangSetName: 'Beach',
      colorName: 'Dark Sand',
    },
    sea: { tilesetName: 'Tileset_Sand', wangSetName: 'Beach', colorName: 'Sea' },
    'sea.mid': { tilesetName: 'Tileset_Sand', wangSetName: 'Beach', colorName: 'Mid Sea' },
    'sea.dark': { tilesetName: 'Tileset_Sand', wangSetName: 'Beach', colorName: 'Dark Sea' },

    // Water (Tileset_Water, wang="Water", type="mixed")
    // 2 colors: Empty, Water -- used for oases and springs
    water: { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },
    'water.shallow': { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },
    'water.deep': { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },
    'water.oasis': { tilesetName: 'Tileset_Water', wangSetName: 'Water', colorName: 'Water' },

    // Roads (Tileset_Road, wang="Road", type="mixed")
    // 4 usable colors: Empty, Road, Brick Road, Dark Brick Road (+ WIP)
    road: { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Road' },
    'road.dirt': { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Road' },
    'road.brick': { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Brick Road' },
    'road.dark-brick': {
      tilesetName: 'Tileset_Road',
      wangSetName: 'Road',
      colorName: 'Dark Brick Road',
    },
    'road.sand': { tilesetName: 'Tileset_Road', wangSetName: 'Road', colorName: 'Road' },

    // Tall grass / desert vegetation (Tileset_TallGrass_Desert, wang="Tall Grass", type="mixed")
    // 4 colors: Empty, Tall Grass, Hay, Orange Grass
    tallgrass: {
      tilesetName: 'Tileset_TallGrass_Desert',
      wangSetName: 'Tall Grass',
      colorName: 'Tall Grass',
    },
    'tallgrass.hay': {
      tilesetName: 'Tileset_TallGrass_Desert',
      wangSetName: 'Tall Grass',
      colorName: 'Hay',
    },
    'tallgrass.orange': {
      tilesetName: 'Tileset_TallGrass_Desert',
      wangSetName: 'Tall Grass',
      colorName: 'Orange Grass',
    },

    // Fence (name="Fence", wang="Fence", type="corner")
    // 2 colors: Empty, Fence
    fence: { tilesetName: 'Fence', wangSetName: 'Fence', colorName: 'Fence' },

    // Small wall (name="Wall", wang="Small wall", type="corner")
    // 2 colors: Empty, Wall
    wall: { tilesetName: 'Wall', wangSetName: 'Small wall', colorName: 'Wall' },

    // Shadows (Tileset_Shadow, wang="Shadow", type="corner")
    // 2 colors: Light, Shadow
    'shadow.light': {
      tilesetName: 'Tileset_Shadow',
      wangSetName: 'Shadow',
      colorName: 'Shadow',
    },
  },

  // --- Object mappings from collection tilesets ---
  objects: {
    // --- Desert Buildings (Objects_Buildings_Desert) ---
    'building.redstone-1': { tilesetName: 'Objects_Buildings_Desert', localTileId: 42 },
    'building.redstone-2': { tilesetName: 'Objects_Buildings_Desert', localTileId: 43 },
    'building.redstone-3': { tilesetName: 'Objects_Buildings_Desert', localTileId: 44 },
    'building.redstone-4': { tilesetName: 'Objects_Buildings_Desert', localTileId: 45 },
    'building.redstone-5': { tilesetName: 'Objects_Buildings_Desert', localTileId: 46 },
    'building.redstone-6': { tilesetName: 'Objects_Buildings_Desert', localTileId: 47 },
    'building.redstone-7': { tilesetName: 'Objects_Buildings_Desert', localTileId: 48 },
    'building.tower-redstone': { tilesetName: 'Objects_Buildings_Desert', localTileId: 51 },
    'building.watchtower-desert': { tilesetName: 'Objects_Buildings_Desert', localTileId: 53 },
    'building.market-large': { tilesetName: 'Objects_Buildings_Desert', localTileId: 49 },
    'building.market-small': { tilesetName: 'Objects_Buildings_Desert', localTileId: 50 },
    'building.well-stone': { tilesetName: 'Objects_Buildings_Desert', localTileId: 12 },
    'building.well-desert': { tilesetName: 'Objects_Buildings_Desert', localTileId: 52 },
    'building.bridge-stone-1': { tilesetName: 'Objects_Buildings_Desert', localTileId: 13 },
    'building.bridge-stone-2': { tilesetName: 'Objects_Buildings_Desert', localTileId: 14 },

    // --- Palm Trees (Objects_Trees_Desert) ---
    'tree.palm-emerald-1': { tilesetName: 'Objects_Trees_Desert', localTileId: 66 },
    'tree.palm-emerald-2': { tilesetName: 'Objects_Trees_Desert', localTileId: 67 },
    'tree.palm-dark-1': { tilesetName: 'Objects_Trees_Desert', localTileId: 64 },
    'tree.palm-dark-2': { tilesetName: 'Objects_Trees_Desert', localTileId: 65 },
    'tree.palm-light-1': { tilesetName: 'Objects_Trees_Desert', localTileId: 111 },
    'tree.palm-light-2': { tilesetName: 'Objects_Trees_Desert', localTileId: 110 },
    'tree.palm-red-1': { tilesetName: 'Objects_Trees_Desert', localTileId: 70 },
    'tree.palm-red-2': { tilesetName: 'Objects_Trees_Desert', localTileId: 63 },
    'tree.palm-yellow-1': { tilesetName: 'Objects_Trees_Desert', localTileId: 117 },
    'tree.palm-yellow-2': { tilesetName: 'Objects_Trees_Desert', localTileId: 116 },

    // --- Leafy Bushes (Objects_Trees_Desert) ---
    'bush.emerald-1': { tilesetName: 'Objects_Trees_Desert', localTileId: 52 },
    'bush.emerald-2': { tilesetName: 'Objects_Trees_Desert', localTileId: 53 },
    'bush.emerald-3': { tilesetName: 'Objects_Trees_Desert', localTileId: 54 },
    'bush.dark-1': { tilesetName: 'Objects_Trees_Desert', localTileId: 48 },
    'bush.dark-2': { tilesetName: 'Objects_Trees_Desert', localTileId: 49 },
    'bush.dark-3': { tilesetName: 'Objects_Trees_Desert', localTileId: 50 },
    'bush.red-1': { tilesetName: 'Objects_Trees_Desert', localTileId: 60 },
    'bush.red-2': { tilesetName: 'Objects_Trees_Desert', localTileId: 61 },

    // --- Desert Rocks (Objects_Rocks_Desert) ---
    'rock.gray-1': { tilesetName: 'Objects_Rocks_Desert', localTileId: 20 },
    'rock.gray-2': { tilesetName: 'Objects_Rocks_Desert', localTileId: 21 },
    'rock.gray-3': { tilesetName: 'Objects_Rocks_Desert', localTileId: 22 },
    'rock.gray-4': { tilesetName: 'Objects_Rocks_Desert', localTileId: 23 },
    'rock.gray-large': { tilesetName: 'Objects_Rocks_Desert', localTileId: 42 },
    'rock.gray-tall-1': { tilesetName: 'Objects_Rocks_Desert', localTileId: 53 },
    'rock.gray-tall-2': { tilesetName: 'Objects_Rocks_Desert', localTileId: 65 },
    'rock.gray-tall-3': { tilesetName: 'Objects_Rocks_Desert', localTileId: 66 },
    'rock.sand-1': { tilesetName: 'Objects_Rocks_Desert', localTileId: 44 },
    'rock.sand-2': { tilesetName: 'Objects_Rocks_Desert', localTileId: 45 },
    'rock.sand-3': { tilesetName: 'Objects_Rocks_Desert', localTileId: 46 },
    'rock.sand-4': { tilesetName: 'Objects_Rocks_Desert', localTileId: 47 },
    'rock.sand-large': { tilesetName: 'Objects_Rocks_Desert', localTileId: 43 },
    'rock.sand-tall-1': { tilesetName: 'Objects_Rocks_Desert', localTileId: 57 },
    'rock.sand-tall-2': { tilesetName: 'Objects_Rocks_Desert', localTileId: 67 },
    'rock.sand-tall-3': { tilesetName: 'Objects_Rocks_Desert', localTileId: 68 },
    'rock.water-1': { tilesetName: 'Objects_Rocks_Desert', localTileId: 29 },
    'rock.water-2': { tilesetName: 'Objects_Rocks_Desert', localTileId: 30 },
    'rock.water-3': { tilesetName: 'Objects_Rocks_Desert', localTileId: 31 },

    // --- Desert Props (Objects_Props_Desert) ---
    'prop.cart-sand': { tilesetName: 'Objects_Props_Desert', localTileId: 192 },
    'prop.barrel-sand-1': { tilesetName: 'Objects_Props_Desert', localTileId: 165 },
    'prop.barrel-sand-2': { tilesetName: 'Objects_Props_Desert', localTileId: 166 },
    'prop.bench-sand-1': { tilesetName: 'Objects_Props_Desert', localTileId: 167 },
    'prop.bench-sand-2': { tilesetName: 'Objects_Props_Desert', localTileId: 168 },
    'prop.crate-sand-1': { tilesetName: 'Objects_Props_Desert', localTileId: 195 },
    'prop.crate-sand-2': { tilesetName: 'Objects_Props_Desert', localTileId: 196 },
    'prop.crate-small-1': { tilesetName: 'Objects_Props_Desert', localTileId: 160 },
    'prop.crate-small-2': { tilesetName: 'Objects_Props_Desert', localTileId: 161 },
    'prop.crate-water-1': { tilesetName: 'Objects_Props_Desert', localTileId: 176 },
    'prop.crate-water-2': { tilesetName: 'Objects_Props_Desert', localTileId: 177 },
    'prop.table-sand-1': { tilesetName: 'Objects_Props_Desert', localTileId: 193 },
    'prop.table-sand-2': { tilesetName: 'Objects_Props_Desert', localTileId: 194 },
    'prop.portal-sand': { tilesetName: 'Objects_Props_Desert', localTileId: 173 },
    'prop.portal': { tilesetName: 'Objects_Props_Desert', localTileId: 159 },
    'prop.banner-sand': { tilesetName: 'Objects_Props_Desert', localTileId: 164 },
    'prop.banner': { tilesetName: 'Objects_Props_Desert', localTileId: 158 },
    'prop.bulletin-board-sand': { tilesetName: 'Objects_Props_Desert', localTileId: 171 },
    'prop.sign-1': { tilesetName: 'Objects_Props_Desert', localTileId: 107 },
    'prop.sign-2': { tilesetName: 'Objects_Props_Desert', localTileId: 108 },
    'prop.sign-post-1': { tilesetName: 'Objects_Props_Desert', localTileId: 109 },
    'prop.sign-post-2': { tilesetName: 'Objects_Props_Desert', localTileId: 110 },
    'prop.sack': { tilesetName: 'Objects_Props_Desert', localTileId: 106 },
    'prop.shovel': { tilesetName: 'Objects_Props_Desert', localTileId: 139 },
    'prop.board': { tilesetName: 'Objects_Props_Desert', localTileId: 119 },
    'prop.beached-boat': { tilesetName: 'Objects_Props_Desert', localTileId: 142 },
    'prop.chest-sand-1': { tilesetName: 'Objects_Props_Desert', localTileId: 172 },
    'prop.chest-sand-2': { tilesetName: 'Objects_Props_Desert', localTileId: 170 },
    'prop.fireplace': { tilesetName: 'Objects_Props_Desert', localTileId: 178 },
    'prop.lamp-sand-1': { tilesetName: 'Objects_Props_Desert', localTileId: 179 },
    'prop.lamp-sand-2': { tilesetName: 'Objects_Props_Desert', localTileId: 180 },
    'prop.logs': { tilesetName: 'Objects_Props_Desert', localTileId: 181 },

    // --- Ruins & Decay (Objects_Props_Desert) ---
    'ruin.wall-1': { tilesetName: 'Objects_Props_Desert', localTileId: 186 },
    'ruin.wall-2': { tilesetName: 'Objects_Props_Desert', localTileId: 182 },
    'ruin.pillar-1': { tilesetName: 'Objects_Props_Desert', localTileId: 184 },
    'ruin.pillar-2': { tilesetName: 'Objects_Props_Desert', localTileId: 185 },
    'ruin.rock-block': { tilesetName: 'Objects_Props_Desert', localTileId: 183 },
    'ruin.bricks-broken-1': { tilesetName: 'Objects_Props_Desert', localTileId: 199 },
    'ruin.bricks-broken-2': { tilesetName: 'Objects_Props_Desert', localTileId: 200 },
    'ruin.bricks-broken-3': { tilesetName: 'Objects_Props_Desert', localTileId: 201 },
    'ruin.bricks-broken-4': { tilesetName: 'Objects_Props_Desert', localTileId: 202 },
    'ruin.bricks-broken-5': { tilesetName: 'Objects_Props_Desert', localTileId: 203 },
    'ruin.bricks-cracked-1': { tilesetName: 'Objects_Props_Desert', localTileId: 204 },
    'ruin.bricks-cracked-2': { tilesetName: 'Objects_Props_Desert', localTileId: 205 },
    'ruin.bricks-cracked-3': { tilesetName: 'Objects_Props_Desert', localTileId: 206 },
    'ruin.bricks-cracked-4': { tilesetName: 'Objects_Props_Desert', localTileId: 207 },
    'ruin.bricks-cracked-5': { tilesetName: 'Objects_Props_Desert', localTileId: 208 },

    // --- Bones & Atmosphere (Objects_Props_Desert) ---
    'prop.skull-1': { tilesetName: 'Objects_Props_Desert', localTileId: 187 },
    'prop.skull-2': { tilesetName: 'Objects_Props_Desert', localTileId: 198 },
    'prop.skeleton': { tilesetName: 'Objects_Props_Desert', localTileId: 197 },

    // --- Vases (Objects_Props_Desert) ---
    'prop.vase-1': { tilesetName: 'Objects_Props_Desert', localTileId: 189 },
    'prop.vase-2': { tilesetName: 'Objects_Props_Desert', localTileId: 190 },
    'prop.vase-3': { tilesetName: 'Objects_Props_Desert', localTileId: 191 },
    'prop.vase-large': { tilesetName: 'Objects_Props_Desert', localTileId: 188 },

    // --- Magic Crystals (Objects_Props_Desert) ---
    'crystal.small': { tilesetName: 'Objects_Props_Desert', localTileId: 209 },
    'crystal.medium': { tilesetName: 'Objects_Props_Desert', localTileId: 210 },
    'crystal.large': { tilesetName: 'Objects_Props_Desert', localTileId: 211 },
  },
};
