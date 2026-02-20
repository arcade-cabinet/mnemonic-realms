/**
 * World Templates — Worlds All The Way Down
 *
 * THE CORE INSIGHT: There are only WORLDS. A shop is a world. A dungeon
 * is a world. A fortress is a world. The outdoor game map is also a world.
 *
 * Every world follows the same fractal algebra:
 *   World = { regions[], connections[], properties }
 *   Region = { anchors[], tissue, biome }
 *   Anchor = { features, slots[] }
 *   Slot → WorldInstance (another world, configured)
 *
 * A slot is a connection point where one world nests inside another.
 * When the player walks through a door, they transition from a region
 * in the parent world to a region in the child world.
 *
 * WORLD TEMPLATES define the SHAPE of a world:
 *   - How many regions (floors, rooms, sections)
 *   - How they connect (linear, branching, hub-and-spoke)
 *   - What slots are available (what can be customized)
 *   - What archetype TMX to stamp for each region
 *
 * WORLD INSTANCES fill the slots with specifics:
 *   - Which template to use
 *   - What enables to activate (armorer, herbalist, etc.)
 *   - What NPCs to place
 *   - What flavor/theme to apply
 *
 * EXAMPLES:
 *
 *   shop-single (template):
 *     1 region: "floor" (archetype: weapon-shop | fisherman-hut | etc.)
 *     slots: keeper-npc, inventory-type, decor-theme
 *     → Instance: "Khali's Curios" { keeper: khali, inventory: general, theme: curiosity }
 *     → Instance: "River's Bounty" { keeper: lissa, inventory: fish, theme: riverside }
 *
 *   inn (template):
 *     2 regions: "ground-floor" (tavern archetype), "upper-floor" (house archetype)
 *     connection: stairs between ground and upper
 *     slots: innkeeper-npc, room-count, tavern-style
 *     → Instance: "The Bright Hearth" { innkeeper: nyro, rooms: 4, style: cozy }
 *     → Instance: "The Millstone" { innkeeper: oram, rooms: 3, style: rustic }
 *
 *   dungeon (template):
 *     N regions: "floor-1", "floor-2", ... (dungeon-room archetype)
 *     connection: stairs-down between each pair
 *     slots: floor-count, theme, boss, encounters
 *     → Instance: "Memory Cellar" { floors: 1, theme: crystal, boss: memory-guardian }
 *     → Instance: "The Depths L2-L5" { floors: 4, theme: water-to-crystal, boss: depth-lord }
 *
 *   fortress (template):
 *     N regions in branching layout: gallery, archive, throne-room, boss-arena
 *     connections: hallways (some gated by keys/puzzles)
 *     slots: level-count, theme, guards, boss
 *     → Instance: "Preserver Fortress" { levels: 3, theme: preserver, boss: sovereign }
 *
 *   market (template):
 *     1 hub region + N wing regions
 *     connections: archways from hub to each wing
 *     slots: wing-count, wing-types (armorer, herbalist, tailor, etc.)
 *     → Instance: "Capital Market Hall" { wings: [armorer, herbalist, tailor, jeweler, bookshop] }
 *
 * Architecture level: DDL TYPES (world-first fractal model)
 */

// --- World Template (the shape) ---

export interface WorldTemplate {
  /** Template ID (e.g., "shop-single", "inn", "dungeon", "fortress", "market") */
  id: string;
  /** Display name for the template category */
  category: string;
  /** Description */
  description: string;
  /** Region layout — how many regions and how they connect */
  layout: TemplateLayout;
  /** Available slots that instances can customize */
  slots: TemplateSlot[];
  /** Default properties */
  defaults: Record<string, unknown>;
}

export type TemplateLayout =
  | LinearLayout
  | HubAndSpokeLayout
  | BranchingLayout
  | SingleLayout;

/** Single region (shops, residences, small spaces) */
export interface SingleLayout {
  type: 'single';
  /** Archetype for the one region */
  archetype: string;
  /** Size category */
  size: 'tiny' | 'small' | 'medium' | 'large';
}

/** Linear sequence of regions (dungeons — floor 1 → 2 → 3) */
export interface LinearLayout {
  type: 'linear';
  /** Archetype for each region (or a single one reused) */
  archetype: string;
  /** Connection type between regions */
  connectionType: 'stairs' | 'door' | 'portal' | 'corridor';
  /** Min/max region count (instances choose within range) */
  regionCount: { min: number; max: number };
}

/** Hub with spokes (markets, guild halls — central hall + wings) */
export interface HubAndSpokeLayout {
  type: 'hub-and-spoke';
  /** Archetype for the hub */
  hubArchetype: string;
  /** Archetype for each spoke */
  spokeArchetype: string;
  /** Connection from hub to each spoke */
  connectionType: 'archway' | 'door' | 'corridor';
  /** Min/max spoke count */
  spokeCount: { min: number; max: number };
}

/** Branching layout (fortresses — some paths gated) */
export interface BranchingLayout {
  type: 'branching';
  /** Named regions with their archetypes */
  regions: Array<{
    id: string;
    name: string;
    archetype: string;
  }>;
  /** Connections between named regions */
  connections: Array<{
    from: string;
    to: string;
    type: 'door' | 'corridor' | 'stairs' | 'gate';
    /** Condition to traverse (key, puzzle, boss defeated) */
    condition?: string;
  }>;
}

/** A customizable slot in the template */
export interface TemplateSlot {
  /** Slot ID */
  id: string;
  /** Human-readable name */
  name: string;
  /** What this slot configures */
  type: 'npc' | 'inventory' | 'theme' | 'feature' | 'count' | 'enemy-set' | 'boss';
  /** Is this slot required? */
  required: boolean;
  /** Default value */
  default?: unknown;
  /** Allowed values (if constrained) */
  options?: string[];
}

// --- World Instance (a configured world from a template) ---

export interface WorldInstance {
  /** Unique instance ID (e.g., "everwick-khali", "memory-cellar") */
  id: string;
  /** Display name (e.g., "Khali's Curios", "Memory Cellar") */
  name: string;
  /** Which template this instantiates */
  templateId: string;
  /** Parent anchor — what outdoor anchor connects to this world */
  parentAnchor: string;
  /** Slot values — fills the template's customizable slots */
  slotValues: Record<string, unknown>;
  /** Biome override (otherwise inherits from parent region) */
  biome?: string;
  /** Additional properties */
  properties?: Record<string, unknown>;
}

// --- Connection from parent world to child world ---

/**
 * A WorldSlot is how an anchor in a parent world connects to a child world.
 * The anchor says "I have a door here, and it connects to this world instance."
 */
export interface WorldSlot {
  /** The world instance ID to connect to */
  instanceId: string;
  /** How the player transitions in */
  transitionType: 'door' | 'stairs' | 'portal' | 'gate' | 'archway';
  /** Entry region in the child world (defaults to first region) */
  entryRegion?: string;
  /** Condition to enter */
  condition?: string;
}

// --- Built-in Templates ---

export const WORLD_TEMPLATES: WorldTemplate[] = [
  {
    id: 'shop-single',
    category: 'Commerce',
    description: 'Single-room shop — one keeper, one inventory, one door',
    layout: {
      type: 'single',
      archetype: 'weapon-shop',
      size: 'small',
    },
    slots: [
      { id: 'keeper', name: 'Shopkeeper', type: 'npc', required: true },
      {
        id: 'shop-type',
        name: 'Shop Type',
        type: 'inventory',
        required: true,
        options: [
          'weapons', 'armor', 'general', 'magic', 'fish', 'herbs',
          'tailor', 'cartographer', 'huntmaster',
        ],
      },
      { id: 'theme', name: 'Decor Theme', type: 'theme', required: false, default: 'standard' },
    ],
    defaults: {},
  },
  {
    id: 'inn',
    category: 'Hospitality',
    description: 'Inn/tavern — ground floor (tavern) + optional upper floor (rooms)',
    layout: {
      type: 'linear',
      archetype: 'tavern',
      connectionType: 'stairs',
      regionCount: { min: 1, max: 2 },
    },
    slots: [
      { id: 'innkeeper', name: 'Innkeeper', type: 'npc', required: true },
      { id: 'rooms', name: 'Room Count', type: 'count', required: false, default: 3 },
      { id: 'style', name: 'Tavern Style', type: 'theme', required: false, default: 'rustic' },
    ],
    defaults: {},
  },
  {
    id: 'residence',
    category: 'Residential',
    description: 'Private home — one or two rooms, personal belongings, dialogue triggers',
    layout: {
      type: 'single',
      archetype: 'house-small',
      size: 'small',
    },
    slots: [
      { id: 'resident', name: 'Resident', type: 'npc', required: true },
      { id: 'theme', name: 'Home Style', type: 'theme', required: false, default: 'humble' },
    ],
    defaults: {},
  },
  {
    id: 'dungeon',
    category: 'Dungeon',
    description: 'Linear dungeon — N floors connected by stairs, progressive difficulty',
    layout: {
      type: 'linear',
      archetype: 'dungeon-room',
      connectionType: 'stairs',
      regionCount: { min: 1, max: 10 },
    },
    slots: [
      { id: 'floor-count', name: 'Number of Floors', type: 'count', required: true },
      { id: 'theme', name: 'Dungeon Theme', type: 'theme', required: true,
        options: ['crystal', 'water', 'shadow', 'fire', 'void'] },
      { id: 'boss', name: 'Boss Enemy', type: 'boss', required: false },
      { id: 'encounters', name: 'Encounter Set', type: 'enemy-set', required: false },
    ],
    defaults: {},
  },
  {
    id: 'fortress',
    category: 'Fortress',
    description: 'Branching fortress — named areas connected by corridors, some gated',
    layout: {
      type: 'branching',
      regions: [
        { id: 'entrance', name: 'Entrance Hall', archetype: 'castle-room' },
        { id: 'gallery', name: 'Gallery', archetype: 'castle-room' },
        { id: 'archive', name: 'Archive', archetype: 'library' },
        { id: 'throne', name: 'Throne Room', archetype: 'castle-room' },
        { id: 'arena', name: 'Boss Arena', archetype: 'castle-room' },
      ],
      connections: [
        { from: 'entrance', to: 'gallery', type: 'corridor' },
        { from: 'entrance', to: 'archive', type: 'corridor' },
        { from: 'gallery', to: 'throne', type: 'gate', condition: 'gallery-key' },
        { from: 'archive', to: 'throne', type: 'gate', condition: 'archive-key' },
        { from: 'throne', to: 'arena', type: 'door', condition: 'throne-cleared' },
      ],
    },
    slots: [
      { id: 'theme', name: 'Fortress Theme', type: 'theme', required: true },
      { id: 'boss', name: 'Final Boss', type: 'boss', required: true },
      { id: 'guards', name: 'Guard Set', type: 'enemy-set', required: false },
    ],
    defaults: {},
  },
  {
    id: 'market',
    category: 'Commerce',
    description: 'Multi-wing market hall — central hub + N shop wings, each a different vendor',
    layout: {
      type: 'hub-and-spoke',
      hubArchetype: 'house-medium',
      spokeArchetype: 'weapon-shop',
      connectionType: 'archway',
      spokeCount: { min: 2, max: 8 },
    },
    slots: [
      { id: 'greeter', name: 'Market Greeter', type: 'npc', required: false },
      {
        id: 'wings',
        name: 'Market Wings',
        type: 'feature',
        required: true,
        options: [
          'armorer', 'herbalist', 'tailor', 'jeweler', 'bookshop',
          'enchanter', 'alchemist', 'weaponsmith',
        ],
      },
    ],
    defaults: {},
  },
];

/**
 * Get a world template by ID.
 */
export function getWorldTemplate(id: string): WorldTemplate | undefined {
  return WORLD_TEMPLATES.find((t) => t.id === id);
}

/**
 * Validate a world instance against its template.
 * Returns an array of validation errors (empty = valid).
 */
export function validateWorldInstance(
  instance: WorldInstance,
  template: WorldTemplate,
): string[] {
  const errors: string[] = [];

  // Check all required slots are filled
  for (const slot of template.slots) {
    if (slot.required && !(slot.id in instance.slotValues)) {
      errors.push(`Required slot "${slot.id}" not provided in instance "${instance.id}"`);
    }

    // Check options constraint
    if (
      slot.options &&
      slot.id in instance.slotValues
    ) {
      const value = instance.slotValues[slot.id];
      if (typeof value === 'string' && !slot.options.includes(value)) {
        errors.push(
          `Slot "${slot.id}" value "${value}" not in allowed options: ${slot.options.join(', ')}`,
        );
      }
    }
  }

  // Validate region count for linear/hub layouts
  if (template.layout.type === 'linear') {
    const count = instance.slotValues['floor-count'] ?? instance.slotValues['region-count'];
    if (typeof count === 'number') {
      if (count < template.layout.regionCount.min) {
        errors.push(
          `Region count ${count} below minimum ${template.layout.regionCount.min}`,
        );
      }
      if (count > template.layout.regionCount.max) {
        errors.push(
          `Region count ${count} above maximum ${template.layout.regionCount.max}`,
        );
      }
    }
  }

  return errors;
}
