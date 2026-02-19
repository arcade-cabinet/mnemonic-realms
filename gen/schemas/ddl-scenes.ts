/**
 * Zod schemas for scene DDL — the primary data contract for the narrative-first
 * architecture. Scenes are the source of truth; maps are compiled output.
 *
 * Design principles:
 * - JSON DDL, not TypeScript. Easy to generate, parse, validate, diff.
 * - Pointers over embedding. Reference other DDL entries by string ID.
 * - The scene compiler reads these + map DDL → produces MapComposition objects.
 * - The markdown parser generates these from docs/story/act{N}-script.md.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Map contributions — what a scene REQUIRES on its map
// ---------------------------------------------------------------------------

/** Pointer to an assemblage factory. The compiler resolves the ID at build time. */
export const SceneAssemblageRefSchema = z.object({
  /** Assemblage factory ID (e.g., 'house-red', 'fountain', 'forest-border-north') */
  assemblageId: z.string(),
  /** Position on the map canvas (tiles, top-left of assemblage) */
  x: z.number().int(),
  y: z.number().int(),
  /** Only place if condition is met (e.g., 'MQ-04+', 'always'). Default: always. */
  condition: z.string().optional(),
});

/** A path segment this scene requires on the map (road, river, etc.) */
export const ScenePathRefSchema = z.object({
  /** Terrain type for auto-tiling (e.g., 'road', 'road.brick', 'river') */
  terrain: z.string(),
  /** TMX layer name (e.g., 'road', 'water') */
  layer: z.string(),
  /** Path width in tiles */
  width: z.number().int().positive(),
  /** Waypoints in tile coordinates */
  points: z.array(z.object({ x: z.number().int(), y: z.number().int() })).min(2),
});

/** A visual object (building, tree, prop) placed in a TMX object group */
export const SceneVisualRefSchema = z.object({
  /** Semantic name referencing a palette object (e.g., 'building.house-red-1') */
  objectRef: z.string(),
  /** Position on map (tiles) */
  x: z.number().int(),
  y: z.number().int(),
});

// ---------------------------------------------------------------------------
// Scene trigger — when does this scene activate?
// ---------------------------------------------------------------------------

export const SceneTriggerSchema = z.object({
  type: z.enum([
    'auto', // Fires automatically (e.g., game start, scene entry)
    'map-enter', // Player enters the map for the first time
    'area-enter', // Player enters a specific tile area
    'npc-talk', // Player talks to an NPC
    'quest-state', // A quest reaches a specific state
    'item-pickup', // Player picks up a specific item
    'cutscene', // Triggered by a cutscene system
    'combat-end', // After a combat encounter resolves
  ]),
  /** Map ID where this trigger fires */
  map: z.string(),
  /** Tile position for area triggers (format: "x,y") */
  position: z.string().optional(),
  /** Additional condition (e.g., 'game-start', 'first-visit', 'MQ-04-active') */
  condition: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Scene NPCs — who appears, where, doing what
// ---------------------------------------------------------------------------

export const SceneNpcSchema = z.object({
  /** NPC DDL ID (pointer to gen/ddl/npcs/) */
  npcId: z.string(),
  /** Display name */
  name: z.string(),
  /** Sprite graphic ID */
  graphic: z.string(),
  /** Tile position on map (format: "x,y") */
  position: z.string(),
  /** Movement behavior */
  movement: z.enum(['static', 'patrol', 'wander']).default('static'),
  /** Patrol/wander bounds (format: "x1,y1 -> x2,y2") */
  patrolRange: z.string().optional(),
  /** Pointer to dialogue DDL entry ID */
  dialogueRef: z.string().optional(),
  /** Only present if condition met */
  condition: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Scene events — interactive triggers on the map
// ---------------------------------------------------------------------------

export const SceneEventTriggerSchema = z.object({
  /** Event ID (e.g., 'EV-EW-001') */
  id: z.string(),
  /** Tile position (format: "x,y") */
  position: z.string(),
  /** How the event fires */
  type: z.enum(['touch', 'action', 'auto', 'parallel']),
  /** Pointer to quest DDL entry ID */
  linkedQuest: z.string().optional(),
  /** Repeat behavior */
  repeat: z.enum(['once', 'quest', 'conditional', 'repeat']).default('once'),
  /** Human-readable description of what this event does */
  description: z.string(),
});

// ---------------------------------------------------------------------------
// Scene effects — what happens during the scene
// ---------------------------------------------------------------------------

export const SceneEffectSchema = z.object({
  type: z.enum([
    'vibrancy-change', // Zone vibrancy delta
    'companion-join', // NPC joins party
    'companion-leave', // NPC leaves party
    'item-give', // Player receives item
    'item-remove', // Item removed from inventory
    'quest-update', // Quest state change
    'combat-start', // Encounter triggers
    'cutscene-play', // Cutscene plays
    'gui-show', // GUI element appears (remix table, broadcast target, etc.)
    'system-message', // System text message
    'music-change', // BGM/ambient change
    'screen-effect', // Visual effect (desaturate, night, flash, etc.)
    'teleport', // Player teleported to new location
    'map-transition', // Transition to another map
  ]),
  /** Effect parameters — varies by type */
  params: z.record(z.string(), z.unknown()),
});

// ---------------------------------------------------------------------------
// Quest changes — state transitions during this scene
// ---------------------------------------------------------------------------

export const SceneQuestChangeSchema = z.object({
  /** Pointer to quest DDL entry ID */
  questId: z.string(),
  action: z.enum(['activate', 'advance', 'complete']),
  /** For 'advance': which objective was completed */
  objectiveIndex: z.number().int().nonnegative().optional(),
});

// ---------------------------------------------------------------------------
// Prerequisites — game state required BEFORE this scene
// ---------------------------------------------------------------------------

export const ScenePrerequisiteSchema = z.object({
  /** Quest flags that must be set */
  questFlags: z.array(z.string()).optional(),
  /** Party members that must be present (NPC IDs) */
  party: z.array(z.string()).optional(),
  /** Items that must be in inventory */
  inventory: z.array(z.string()).optional(),
  /** Minimum vibrancy levels per zone */
  vibrancy: z.record(z.string(), z.number()).optional(),
  /** Minimum player level */
  level: z.number().int().min(1).optional(),
});

// ---------------------------------------------------------------------------
// Test criteria — E2E validation after scene completion
// ---------------------------------------------------------------------------

export const SceneTestCriteriaSchema = z.object({
  /** Quest flags that should be set after scene */
  questFlags: z.array(z.string()).optional(),
  /** Locations the player should have visited */
  visitedLocations: z.array(z.string()).optional(),
  /** Dialogue IDs that should have been triggered */
  completedDialogues: z.array(z.string()).optional(),
  /** Items that should be in inventory after */
  inventory: z.array(z.string()).optional(),
  /** Expected party composition after */
  party: z.array(z.string()).optional(),
  /** Expected zone vibrancy levels after */
  vibrancy: z.record(z.string(), z.number()).optional(),
});

// ---------------------------------------------------------------------------
// Resonance stones and treasure chests — scene-specific map objects
// ---------------------------------------------------------------------------

export const SceneResonanceStoneSchema = z.object({
  /** Stone ID (e.g., 'RS-EW-01') */
  id: z.string(),
  /** Tile position (format: "x,y") */
  position: z.string(),
  /** Fragment spec (format: "emotion/element/potency") */
  fragments: z.string(),
  /** Notes (e.g., "Hidden; revealed after SQ-12 dream 5") */
  notes: z.string().optional(),
});

export const SceneTreasureChestSchema = z.object({
  /** Chest ID (e.g., 'CH-EW-01') */
  id: z.string(),
  /** Tile position */
  position: z.string(),
  /** Contents description (e.g., "Minor Potion (C-HP-01) x2") */
  contents: z.string(),
  /** Availability condition */
  condition: z.string().optional(),
});

// ---------------------------------------------------------------------------
// THE scene definition — complete DDL entry
// ---------------------------------------------------------------------------

export const SceneDdlSchema = z.object({
  // --- Identity ---
  /** Unique scene ID (e.g., 'act1-scene1-familiar-place') */
  id: z.string(),
  /** Which act this scene belongs to */
  act: z.enum(['act1', 'act2', 'act3']),
  /** Scene number within the act (1-indexed) */
  sceneNumber: z.number().int().min(1),
  /** Scene display name (e.g., 'A Familiar Place') */
  name: z.string(),
  /** One-line summary of what happens */
  summary: z.string(),

  // --- Location (pointer to map DDL) ---
  /** Map DDL ID this scene takes place on (e.g., 'everwick', 'heartfield') */
  mapId: z.string(),
  /** Sub-location within the map (e.g., "Elder's House", "Memorial Garden") */
  subLocation: z.string().optional(),
  /** Player spawn/start position for this scene (format: "x,y") */
  spawnPosition: z.string().optional(),

  // --- Scene trigger ---
  trigger: SceneTriggerSchema,

  // --- Map contributions (aggregated by compiler) ---
  /** Assemblages this scene requires on the map */
  assemblages: z.array(SceneAssemblageRefSchema).optional(),
  /** Paths this scene requires */
  paths: z.array(ScenePathRefSchema).optional(),
  /** Visual objects (buildings, trees, props) */
  visuals: z.array(SceneVisualRefSchema).optional(),

  // --- Characters ---
  npcs: z.array(SceneNpcSchema),

  // --- Events ---
  /** Event triggers added to the map for this scene */
  events: z.array(SceneEventTriggerSchema).optional(),
  /** Resonance stones */
  resonanceStones: z.array(SceneResonanceStoneSchema).optional(),
  /** Treasure chests */
  treasureChests: z.array(SceneTreasureChestSchema).optional(),

  // --- Scene effects ---
  effects: z.array(SceneEffectSchema),
  /** Quest state changes */
  questChanges: z.array(SceneQuestChangeSchema),

  // --- Cross-DDL pointers ---
  /** Dialogue DDL entry IDs used in this scene */
  dialogueRefs: z.array(z.string()).optional(),
  /** Quest DDL entry IDs relevant to this scene */
  questRefs: z.array(z.string()).optional(),
  /** Item IDs mentioned in this scene */
  itemRefs: z.array(z.string()).optional(),

  // --- Prerequisites ---
  /** Game state required before this scene can trigger */
  prerequisites: ScenePrerequisiteSchema.optional(),

  // --- Testing ---
  /** Expected state after scene completion */
  testCriteria: SceneTestCriteriaSchema.optional(),
  /** Instructions for the AI player controller */
  playerInstructions: z.array(z.string()).optional(),

  // --- Narrative metadata (extracted from markdown) ---
  /** Narrative context paragraph from the act script */
  narrativeContext: z.string().optional(),
  /** Time of day (morning, midday, afternoon, evening, night, dawn, dusk) */
  timeOfDay: z.string().optional(),
  /** Emotional beat in the story arc */
  emotionalBeat: z.string().optional(),
  /** Game mechanic being taught (for tutorial scenes) */
  mechanicTaught: z.string().optional(),

  // --- Code generation ---
  /** Output path for the generated event TypeScript file */
  targetPath: z.string(),
  /** Expected player level range (e.g., '1', '3-5', '10-15') */
  levelRange: z.string(),
});

// ---------------------------------------------------------------------------
// Container — the shape of act{N}.json files
// ---------------------------------------------------------------------------

/** A complete act DDL file is an array of scene definitions */
export const ActDdlSchema = z.array(SceneDdlSchema).min(1);

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type SceneAssemblageRef = z.infer<typeof SceneAssemblageRefSchema>;
export type ScenePathRef = z.infer<typeof ScenePathRefSchema>;
export type SceneVisualRef = z.infer<typeof SceneVisualRefSchema>;
export type SceneTrigger = z.infer<typeof SceneTriggerSchema>;
export type SceneNpc = z.infer<typeof SceneNpcSchema>;
export type SceneEventTrigger = z.infer<typeof SceneEventTriggerSchema>;
export type SceneEffect = z.infer<typeof SceneEffectSchema>;
export type SceneQuestChange = z.infer<typeof SceneQuestChangeSchema>;
export type ScenePrerequisite = z.infer<typeof ScenePrerequisiteSchema>;
export type SceneTestCriteria = z.infer<typeof SceneTestCriteriaSchema>;
export type SceneResonanceStone = z.infer<typeof SceneResonanceStoneSchema>;
export type SceneTreasureChest = z.infer<typeof SceneTreasureChestSchema>;
export type SceneDdl = z.infer<typeof SceneDdlSchema>;
