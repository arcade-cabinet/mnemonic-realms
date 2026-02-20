/**
 * World DDL — Top-Down Compositional Hierarchy
 *
 * The world is the LARGEST compositional unit. Not scenes, not acts —
 * the world. Everything decomposes downward from here.
 *
 * In Pokemon, you never "transition" between outdoor areas. The world
 * is one continuous composition. You only transition exterior ↔ interior
 * or into random encounters. That means:
 *
 *   WORLD
 *     └── REGIONS (biome zones — theme, weather, ambient, fills, encounters)
 *          ├── ANCHORS (towns, dungeons, special features — give region purpose)
 *          ├── CONNECTIVE TISSUE (paths, wild areas, roadside stops between anchors)
 *          └── TIME BUDGET (play hours → map tiles → encounter count → step count)
 *               └── TOWNS (services + NPCs + quest triggers → composer generates layout)
 *                    └── INTERIORS (archetype + theme — THE ONLY REAL TRANSITIONS)
 *
 * The scene/act narrative model maps ONTO this structure:
 * - Acts correspond to region unlocks (Act 1 = Settled Lands, Act 2 = Frontier, etc.)
 * - Scenes correspond to quest progressions within regions
 * - But the COMPOSITION is geographic, not narrative
 *
 * Working backwards from the world:
 * 1. World defines regions and their connections
 * 2. Each region defines anchors, connective tissue, and time budget
 * 3. The composer generates outdoor maps from region specs
 * 4. Towns generate from anchor specs
 * 5. Interiors stamp from reference TMX archetypes
 */

// ─────────────────────────────────────────────────────
// WORLD — The largest compositional unit
// ─────────────────────────────────────────────────────

export interface WorldDefinition {
  /** Game title */
  name: string;
  /** World-level properties */
  properties: {
    /** Starting region */
    startRegion: string;
    /** Starting anchor (town) within that region */
    startAnchor: string;
    /** Global vibrancy system enabled? */
    vibrancySystem: boolean;
  };
  /** All regions in the world */
  regions: RegionDefinition[];
  /** How regions connect to each other */
  regionConnections: RegionConnection[];
}

export interface RegionConnection {
  /** Source region */
  from: string;
  /** Target region */
  to: string;
  /** How they connect geographically */
  connectionType: 'adjacent' | 'gate' | 'ferry' | 'portal';
  /** Quest/story condition to unlock */
  condition?: string;
  /** Which direction from the source region */
  direction?: 'north' | 'south' | 'east' | 'west';
}

// ─────────────────────────────────────────────────────
// REGION — Biome zone with time budget
// ─────────────────────────────────────────────────────

export interface RegionDefinition {
  /** Unique region ID */
  id: string;
  /** Human-readable name */
  name: string;
  /** Biome ID — sets theme, weather, ambient, fills, encounter tables */
  biome: string;
  /** Which act(s) this region is active during */
  acts: number[];

  // --- Time Budget ---
  /** Estimated play time in minutes for full traversal */
  playTimeMinutes: number;
  /** Difficulty tier (affects encounter rate, enemy levels) */
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';

  // --- Anchors ---
  /** Towns, dungeons, and special features that anchor this region */
  anchors: AnchorDefinition[];

  // --- Connective Tissue ---
  /** Rules for auto-generating outdoor paths between anchors */
  connectiveTissue: ConnectiveTissueRules;

  // --- Regional Properties ---
  /** Ambient music track */
  ambientMusic?: string;
  /** Weather patterns */
  weather?: WeatherConfig;
  /** Region-wide encounter table */
  encounters?: EncounterConfig;
  /** Starting vibrancy level for this region */
  startVibrancy?: number;
}

export interface WeatherConfig {
  /** Default weather */
  default: 'clear' | 'rain' | 'snow' | 'fog' | 'storm';
  /** Can weather change during gameplay? */
  dynamic: boolean;
}

export interface EncounterConfig {
  /** Enemy pool for random encounters */
  enemies: string[];
  /** Level range for enemies */
  levelRange: [number, number];
  /** Steps between encounters (average) */
  averageStepsBetweenEncounters: number;
  /** Encounter rate modifier (1.0 = normal) */
  rateModifier?: number;
}

// ─────────────────────────────────────────────────────
// ANCHOR — Things that give a region purpose
// ─────────────────────────────────────────────────────

export type AnchorType = 'town' | 'dungeon' | 'shrine' | 'fortress' | 'camp' | 'landmark' | 'gate';

export interface AnchorDefinition {
  /** Unique anchor ID (becomes map ID for generated maps) */
  id: string;
  /** Display name */
  name: string;
  /** What kind of anchor */
  type: AnchorType;
  /** Approximate position within region (for layout) */
  position: 'start' | 'middle' | 'end' | 'side' | [number, number];
  /** How important is this anchor? (affects road quality, sign posting) */
  importance: 'major' | 'minor' | 'hidden';

  // --- Town-specific (when type = 'town') ---
  town?: TownDefinition;

  // --- Dungeon-specific (when type = 'dungeon') ---
  dungeon?: DungeonDefinition;

  // --- Quest anchoring ---
  /** Quest chains that start/progress/end here */
  quests?: string[];
  /** NPCs that live at this anchor */
  npcs?: AnchorNpc[];
  /** Story events triggered at this anchor */
  events?: AnchorEvent[];

  // --- Interiors ---
  /** Interior map IDs accessible from this anchor (string refs in split DDL) */
  interiors?: string[];
}

// ─────────────────────────────────────────────────────
// TOWN — Compositional town definition
// ─────────────────────────────────────────────────────

export interface TownDefinition {
  /** Town size category */
  size: 'hamlet' | 'village' | 'town' | 'city';
  /** Map dimensions in tiles */
  mapSize?: [number, number];
  /** Buildings/services this town offers */
  services: TownService[];
  /** Number of residential buildings (non-service) */
  houses: number;
  /** Central feature (well, fountain, statue, market) */
  centralFeature?: string;
  /** Does the town have walls/gates? */
  walled?: boolean;
  /** Road style override (defaults to biome) */
  roadStyle?: string;
}

export type TownServiceType =
  | 'weapon-shop'
  | 'armor-shop'
  | 'general-store'
  | 'inn'
  | 'tavern'
  | 'library'
  | 'church'
  | 'blacksmith'
  | 'tailor'
  | 'cartographer'
  | 'fishmonger'
  | 'huntmaster'
  | 'guild-hall'
  | 'elder-house';

export interface TownService {
  /** What service this building provides */
  type: TownServiceType;
  /** NPC who runs it */
  keeperNpc?: string;
  /** Custom name for the building (e.g., "Khali's Curios") */
  buildingName?: string;
  /** Quest triggers in this building */
  quests?: string[];
}

// ─────────────────────────────────────────────────────
// DUNGEON — Self-contained interior complex
// ─────────────────────────────────────────────────────

export interface DungeonDefinition {
  /** Number of floors */
  floors: number;
  /** Dungeon theme (crystal, water, fire, etc.) */
  theme: string;
  /** Boss at the bottom */
  boss?: string;
  /** Key item or unlock at the end */
  reward?: string;
  /** Interior map IDs for each floor (string refs in split DDL) */
  interiors?: string[];
}

// ─────────────────────────────────────────────────────
// INTERIOR — The only real transitions
// ─────────────────────────────────────────────────────

export interface InteriorDefinition {
  /** Interior map ID */
  id: string;
  /** Building archetype (from ArchetypeRegistry) */
  archetype: string;
  /** Custom name */
  name?: string;
  /** NPCs inside */
  npcs?: AnchorNpc[];
  /** Items/objects of interest */
  objects?: string[];
}

// ─────────────────────────────────────────────────────
// CONNECTIVE TISSUE — Auto-generated outdoor areas
// ─────────────────────────────────────────────────────

export interface ConnectiveTissueRules {
  /** How dense should paths between anchors be? */
  pathDensity: 'sparse' | 'moderate' | 'dense';
  /** Should there be safe zones (roadside inns, camps) on long stretches? */
  safeZoneInterval?: number; // Every N minutes of walk time
  /** Ratio of path area vs wild encounter area (0-1) */
  safePathRatio: number;
  /** Special features that appear in the wild (shrines, hidden chests, etc.) */
  wildFeatures?: WildFeature[];
  /** Gate/barrier between sub-regions */
  barriers?: BarrierDefinition[];
}

export interface WildFeature {
  /** Feature type */
  type: 'hidden-chest' | 'resonance-stone' | 'mini-shrine' | 'camp-spot' | 'fishing-spot';
  /** How many in the region */
  count: number;
  /** Placement preference */
  placement: 'near-path' | 'off-path' | 'hidden';
}

export interface BarrierDefinition {
  /** Between which anchors */
  between: [string, string];
  /** What blocks passage */
  type: 'quest-gate' | 'level-gate' | 'item-gate' | 'story-gate';
  /** Condition to pass */
  condition: string;
}

// ─────────────────────────────────────────────────────
// NPCs and Events (shared across anchor types)
// ─────────────────────────────────────────────────────

export interface AnchorNpc {
  /** NPC ID (references NPC DDL) */
  id: string;
  /** Role in this anchor */
  role: string;
  /** Where they stand/patrol */
  placement: 'entrance' | 'center' | 'shop' | 'patrol' | 'hidden' | string;
}

export interface AnchorEvent {
  /** Event ID */
  id: string;
  /** Trigger type */
  trigger: 'auto' | 'action' | 'touch';
  /** Quest linkage */
  quest?: string;
  /** One-time or repeatable */
  repeat: 'once' | 'quest' | 'always';
  /** Description */
  description: string;
}

// ─────────────────────────────────────────────────────
// Chronometer — Time/Distance calculations
// ─────────────────────────────────────────────────────

/**
 * Calculate region dimensions from time budget.
 *
 * Given a play time budget, difficulty, and anchor count, estimate
 * how large the region's outdoor maps need to be.
 */
export function calculateRegionMetrics(region: RegionDefinition): RegionMetrics {
  // Base walking speed: ~4 tiles/second at 16px tiles
  const WALK_SPEED_TPS = 4;
  const SECONDS_PER_MINUTE = 60;

  // Time allocation
  const totalSeconds = region.playTimeMinutes * SECONDS_PER_MINUTE;
  const combatPercent =
    region.difficulty === 'easy'
      ? 0.2
      : region.difficulty === 'medium'
        ? 0.3
        : region.difficulty === 'hard'
          ? 0.4
          : 0.5;
  const dialoguePercent = 0.15;
  const explorationPercent = 1 - combatPercent - dialoguePercent;

  const walkingSeconds = totalSeconds * explorationPercent;
  const totalWalkingTiles = Math.round(walkingSeconds * WALK_SPEED_TPS);

  // Number of outdoor "screens" needed (each screen ~80x80 tiles at 16px)
  const SCREEN_TRAVERSAL = 120; // Average tiles to cross a screen (not straight line)
  const outdoorScreens = Math.max(1, Math.ceil(totalWalkingTiles / SCREEN_TRAVERSAL));

  // Encounter count
  const encounterSteps = region.encounters?.averageStepsBetweenEncounters ?? 200;
  const estimatedEncounters = Math.round(totalWalkingTiles / encounterSteps);

  // Safe zone needs
  const safeZoneCount = region.connectiveTissue.safeZoneInterval
    ? Math.floor(region.playTimeMinutes / region.connectiveTissue.safeZoneInterval)
    : 0;

  return {
    totalWalkingTiles,
    outdoorScreens,
    estimatedEncounters,
    safeZoneCount,
    anchorCount: region.anchors.length,
    // Average connective tissue maps between anchors
    avgMapsPerConnection: Math.max(
      1,
      Math.round(outdoorScreens / Math.max(1, region.anchors.length - 1)),
    ),
  };
}

export interface RegionMetrics {
  totalWalkingTiles: number;
  outdoorScreens: number;
  estimatedEncounters: number;
  safeZoneCount: number;
  anchorCount: number;
  avgMapsPerConnection: number;
}
