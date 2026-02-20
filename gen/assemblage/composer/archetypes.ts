/**
 * Archetype Registry — Building Block Catalog
 *
 * Maps reference TMX files to named building archetypes. Every RPG town
 * is a permutation of the same building types — weapon shop, inn, house,
 * church, library — placed uniquely and themed by biome color.
 *
 * The reference TMX maps that ship with the premium tileset packs ARE
 * our atoms. WeaponSeller_1.tmx IS the weapon shop. House_1.tmx IS
 * the small house. This registry catalogs them.
 *
 * Architecture level: ATOMS
 * Input: TMX reference paths + metadata
 * Output: Named archetypes the composer can request by type
 */
import { resolve } from 'node:path';
import type { ParsedTmx } from './tmx-parser';
import { parseTmx } from './tmx-parser';

// --- Archetype types ---

/** Role a building plays in a town */
export type BuildingRole =
  | 'weapon-shop'
  | 'armor-shop'
  | 'general-store'
  | 'inn'
  | 'tavern'
  | 'house-small'
  | 'house-medium'
  | 'house-large'
  | 'library'
  | 'church'
  | 'butchery'
  | 'tailor'
  | 'cartographer'
  | 'fisherman-hut'
  | 'huntmaster'
  | 'castle-room'
  | 'elder-house';

/** Category of archetype */
export type ArchetypeCategory = 'interior' | 'exterior' | 'terrain';

/** Tileset pack the archetype belongs to */
export type TilesetPack = 'premium' | 'castles' | 'desert' | 'seasons' | 'snow';

export interface ArchetypeDefinition {
  /** Unique archetype ID */
  id: string;
  /** Human-readable name */
  name: string;
  /** Building role for town composition */
  role: BuildingRole | 'scene-template';
  /** Interior vs exterior vs terrain */
  category: ArchetypeCategory;
  /** Which tileset pack */
  pack: TilesetPack;
  /** Path to the reference TMX (relative to assets/tilesets/) */
  tmxPath: string;
  /** Approximate size in tiles (before parsing) */
  approxSize: { width: number; height: number };
  /** What this archetype represents narratively */
  description: string;
  /** Tags for search/filtering */
  tags: string[];
  /** Parsed TMX data (lazy-loaded) */
  parsed?: ParsedTmx;
}

// --- Registry ---

const ASSETS_ROOT = 'assets/tilesets';

/**
 * All known archetypes extracted from reference TMX maps.
 *
 * Interior archetypes are complete room layouts:
 * - WeaponSeller_1 → weapon-shop (counter, weapon racks, anvil area)
 * - House_1 → house-small (2-room cottage with furniture)
 * - House_2 → house-medium (larger house variant)
 * - Tavern_1 → tavern (bar, tables, kitchen area)
 * - Library_1 → library (bookshelves, reading tables)
 * - Butchery_1 → butchery (meat counter, storage)
 * - TailorShop_1 → tailor (fabric rolls, mannequins)
 * - Cartographer_1 → cartographer (map tables, scrolls)
 * - FishermanHut_1 → fisherman-hut (nets, fish, small quarters)
 * - Huntmaster_1 → huntmaster (trophies, weapons, pelts)
 * - Castle_1 → castle-room (throne room / great hall)
 *
 * Exterior archetypes are scene templates:
 * - Farm Shore → farmland scene (fields, fences, shore, roads)
 * - Village Bridge → village scene (houses, bridge, river, roads)
 * - Mage Tower → tower scene (isolated building, terrain)
 * - Desert Town → desert village (sandstone buildings, oasis)
 * - Mountain Village → mountain village (snow, slopes, cabins)
 * - Forest Keep → fortified forest outpost
 */
const ARCHETYPE_DEFINITIONS: ArchetypeDefinition[] = [
  // --- Interior archetypes ---
  {
    id: 'weapon-shop',
    name: 'Weapon Shop',
    role: 'weapon-shop',
    category: 'interior',
    pack: 'premium',
    tmxPath: 'interiors/premium/Tiled/Tilemaps/WeaponSeller_1.tmx',
    approxSize: { width: 25, height: 22 },
    description: 'A weapon shop with counter, display racks, forge area, and two connected rooms',
    tags: ['shop', 'combat', 'town-service', 'interior'],
  },
  {
    id: 'house-small',
    name: 'Small House',
    role: 'house-small',
    category: 'interior',
    pack: 'premium',
    tmxPath: 'interiors/premium/Tiled/Tilemaps/House_1.tmx',
    approxSize: { width: 20, height: 19 },
    description: 'A cozy 2-room cottage with bedroom, living area, and fireplace',
    tags: ['house', 'residential', 'npc-home', 'interior'],
  },
  {
    id: 'house-medium',
    name: 'Medium House',
    role: 'house-medium',
    category: 'interior',
    pack: 'premium',
    tmxPath: 'interiors/premium/Tiled/Tilemaps/House_2.tmx',
    approxSize: { width: 22, height: 20 },
    description: 'A larger house with multiple rooms, suitable for NPCs with families',
    tags: ['house', 'residential', 'npc-home', 'interior'],
  },
  {
    id: 'tavern',
    name: 'Tavern',
    role: 'tavern',
    category: 'interior',
    pack: 'premium',
    tmxPath: 'interiors/premium/Tiled/Tilemaps/Tavern_1.tmx',
    approxSize: { width: 25, height: 22 },
    description: 'A lively tavern with bar, seating area, kitchen, and upstairs rooms',
    tags: ['shop', 'inn', 'social', 'town-service', 'interior'],
  },
  {
    id: 'library',
    name: 'Library',
    role: 'library',
    category: 'interior',
    pack: 'premium',
    tmxPath: 'interiors/premium/Tiled/Tilemaps/Library_1.tmx',
    approxSize: { width: 22, height: 20 },
    description: 'A library with bookshelves, reading tables, and scroll storage',
    tags: ['knowledge', 'lore', 'town-service', 'interior'],
  },
  {
    id: 'butchery',
    name: 'Butchery',
    role: 'butchery',
    category: 'interior',
    pack: 'premium',
    tmxPath: 'interiors/premium/Tiled/Tilemaps/Butchery_1.tmx',
    approxSize: { width: 20, height: 18 },
    description: 'A butcher shop with meat counter and cold storage',
    tags: ['shop', 'food', 'town-service', 'interior'],
  },
  {
    id: 'tailor',
    name: 'Tailor Shop',
    role: 'tailor',
    category: 'interior',
    pack: 'premium',
    tmxPath: 'interiors/premium/Tiled/Tilemaps/TailorShop_1.tmx',
    approxSize: { width: 22, height: 20 },
    description: 'A tailor shop with fabric rolls, mannequins, and sewing area',
    tags: ['shop', 'armor', 'town-service', 'interior'],
  },
  {
    id: 'cartographer',
    name: 'Cartographer',
    role: 'cartographer',
    category: 'interior',
    pack: 'premium',
    tmxPath: 'interiors/premium/Tiled/Tilemaps/Cartographer_1.tmx',
    approxSize: { width: 22, height: 20 },
    description: 'A map-maker workshop with drafting tables and scroll racks',
    tags: ['knowledge', 'maps', 'town-service', 'interior'],
  },
  {
    id: 'fisherman-hut',
    name: 'Fisherman Hut',
    role: 'fisherman-hut',
    category: 'interior',
    pack: 'premium',
    tmxPath: 'interiors/premium/Tiled/Tilemaps/FishermanHut_1.tmx',
    approxSize: { width: 18, height: 16 },
    description: 'A small fishing hut with nets, tackle, and a sleeping area',
    tags: ['house', 'fishing', 'coastal', 'interior'],
  },
  {
    id: 'huntmaster',
    name: 'Huntmaster Lodge',
    role: 'huntmaster',
    category: 'interior',
    pack: 'premium',
    tmxPath: 'interiors/premium/Tiled/Tilemaps/Huntmaster_1.tmx',
    approxSize: { width: 22, height: 20 },
    description: 'A hunting lodge with trophies, weapon racks, and pelts',
    tags: ['combat', 'hunting', 'guild', 'interior'],
  },
  {
    id: 'castle-room',
    name: 'Castle Great Hall',
    role: 'castle-room',
    category: 'interior',
    pack: 'premium',
    tmxPath: 'interiors/premium/Tiled/Tilemaps/Castle_1.tmx',
    approxSize: { width: 30, height: 25 },
    description: 'A grand castle hall with throne, banquet tables, and tapestries',
    tags: ['castle', 'throne', 'boss', 'interior'],
  },

  // --- Exterior scene archetypes ---
  {
    id: 'farm-shore',
    name: 'Farm Shore',
    role: 'scene-template',
    category: 'exterior',
    pack: 'premium',
    tmxPath: 'exteriors/premium/Tiled/Tilemaps/Farm Shore.tmx',
    approxSize: { width: 40, height: 45 },
    description:
      'Professional farmland scene: fields, fences, road network, shoreline, rocks. Perfect template for Heartfield.',
    tags: ['farmland', 'scene-template', 'fields', 'shore', 'road'],
  },
  {
    id: 'village-bridge',
    name: 'Village Bridge',
    role: 'scene-template',
    category: 'exterior',
    pack: 'premium',
    tmxPath: 'exteriors/premium/Tiled/Tilemaps/Village Bridge.tmx',
    approxSize: { width: 60, height: 36 },
    description:
      'Professional village scene: buildings, bridge, river, road network. Perfect template for Everwick.',
    tags: ['village', 'scene-template', 'bridge', 'river', 'road', 'buildings'],
  },
  {
    id: 'mage-tower',
    name: 'Mage Tower',
    role: 'scene-template',
    category: 'exterior',
    pack: 'premium',
    tmxPath: 'exteriors/premium/Tiled/Tilemaps/Mage Tower.tmx',
    approxSize: { width: 40, height: 40 },
    description: 'An isolated mage tower with surrounding terrain and approach paths',
    tags: ['tower', 'scene-template', 'magic', 'isolated'],
  },
  {
    id: 'desert-town',
    name: 'Desert Town',
    role: 'scene-template',
    category: 'exterior',
    pack: 'desert',
    tmxPath: 'exteriors/desert/Tiled/Tilemaps/Desert Town.tmx',
    approxSize: { width: 50, height: 40 },
    description: 'Desert village with sandstone buildings and oasis',
    tags: ['desert', 'scene-template', 'town', 'oasis'],
  },
  {
    id: 'hidden-oasis',
    name: 'Hidden Oasis',
    role: 'scene-template',
    category: 'exterior',
    pack: 'desert',
    tmxPath: 'exteriors/desert/Tiled/Tilemaps/Hidden Oasis.tmx',
    approxSize: { width: 40, height: 40 },
    description: 'A hidden desert oasis — serene water surrounded by palms',
    tags: ['desert', 'scene-template', 'oasis', 'water'],
  },
  {
    id: 'mountain-village',
    name: 'Mountain Village',
    role: 'scene-template',
    category: 'exterior',
    pack: 'snow',
    tmxPath: 'exteriors/snow/Tiled/Tilemaps/Mountain Village.tmx',
    approxSize: { width: 50, height: 40 },
    description: 'A mountain village with snow, slopes, and warm cabins',
    tags: ['mountain', 'scene-template', 'snow', 'village'],
  },
  {
    id: 'frost-peak',
    name: 'Frost Peak',
    role: 'scene-template',
    category: 'exterior',
    pack: 'snow',
    tmxPath: 'exteriors/snow/Tiled/Tilemaps/Frost Peak.tmx',
    approxSize: { width: 40, height: 40 },
    description: 'A frozen mountain peak with ice formations and wind-swept terrain',
    tags: ['mountain', 'scene-template', 'snow', 'peak'],
  },
  {
    id: 'farmer-hold',
    name: 'Farmer Hold',
    role: 'scene-template',
    category: 'exterior',
    pack: 'castles',
    tmxPath: 'exteriors/castles/Tiled/Tilemaps/Farmer Hold.tmx',
    approxSize: { width: 50, height: 40 },
    description: 'A fortified farm estate with walls and fields',
    tags: ['castle', 'scene-template', 'farm', 'fortified'],
  },
  {
    id: 'forest-keep',
    name: 'Forest Keep',
    role: 'scene-template',
    category: 'exterior',
    pack: 'castles',
    tmxPath: 'exteriors/castles/Tiled/Tilemaps/Forest Keep.tmx',
    approxSize: { width: 50, height: 40 },
    description: 'A castle keep nestled in dense forest',
    tags: ['castle', 'scene-template', 'forest', 'fortified'],
  },
  {
    id: 'autumn-fields',
    name: 'Autumn Fields',
    role: 'scene-template',
    category: 'exterior',
    pack: 'seasons',
    tmxPath: 'exteriors/seasons/Tiled/Tilemaps/Autumn Fields.tmx',
    approxSize: { width: 50, height: 40 },
    description: 'Autumn-themed farmland with golden trees and harvest fields',
    tags: ['seasons', 'scene-template', 'autumn', 'fields'],
  },
  {
    id: 'cherry-hill',
    name: 'Cherry Hill',
    role: 'scene-template',
    category: 'exterior',
    pack: 'seasons',
    tmxPath: 'exteriors/seasons/Tiled/Tilemaps/Cherry Hill.tmx',
    approxSize: { width: 50, height: 40 },
    description: 'Spring cherry blossom hillside',
    tags: ['seasons', 'scene-template', 'spring', 'cherry'],
  },
];

// --- Archetype Registry class ---

export class ArchetypeRegistry {
  private archetypes = new Map<string, ArchetypeDefinition>();
  private assetsRoot: string;

  constructor(projectRoot: string) {
    this.assetsRoot = resolve(projectRoot, ASSETS_ROOT);

    // Register all known archetypes
    for (const def of ARCHETYPE_DEFINITIONS) {
      this.archetypes.set(def.id, def);
    }
  }

  /** Get an archetype by ID */
  get(id: string): ArchetypeDefinition | undefined {
    return this.archetypes.get(id);
  }

  /** Get all archetypes */
  all(): ArchetypeDefinition[] {
    return Array.from(this.archetypes.values());
  }

  /** Find archetypes by role */
  byRole(role: BuildingRole | 'scene-template'): ArchetypeDefinition[] {
    return this.all().filter((a) => a.role === role);
  }

  /** Find archetypes by category */
  byCategory(category: ArchetypeCategory): ArchetypeDefinition[] {
    return this.all().filter((a) => a.category === category);
  }

  /** Find archetypes by tag */
  byTag(tag: string): ArchetypeDefinition[] {
    return this.all().filter((a) => a.tags.includes(tag));
  }

  /** Find archetypes by tileset pack */
  byPack(pack: TilesetPack): ArchetypeDefinition[] {
    return this.all().filter((a) => a.pack === pack);
  }

  /**
   * Load and parse the TMX for an archetype (lazy, cached).
   */
  async load(id: string): Promise<ParsedTmx> {
    const def = this.archetypes.get(id);
    if (!def) throw new Error(`Unknown archetype: ${id}`);

    if (!def.parsed) {
      const fullPath = resolve(this.assetsRoot, def.tmxPath);
      def.parsed = await parseTmx(fullPath);
    }

    return def.parsed;
  }

  /**
   * Load all archetypes and print a summary.
   */
  async loadAll(): Promise<Map<string, ParsedTmx>> {
    const results = new Map<string, ParsedTmx>();
    for (const def of Array.from(this.archetypes.values())) {
      const parsed = await this.load(def.id);
      results.set(def.id, parsed);
    }
    return results;
  }

  /**
   * Print a summary of all registered archetypes.
   */
  summary(): string {
    const lines: string[] = [`Archetype Registry: ${this.archetypes.size} archetypes`, ''];

    const categories = ['interior', 'exterior', 'terrain'] as const;
    for (const cat of categories) {
      const items = this.byCategory(cat);
      if (items.length === 0) continue;

      lines.push(`${cat.toUpperCase()} (${items.length}):`);
      for (const item of items) {
        const size = `${item.approxSize.width}x${item.approxSize.height}`;
        lines.push(`  ${item.id.padEnd(20)} ${size.padEnd(8)} ${item.description.slice(0, 60)}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }
}
