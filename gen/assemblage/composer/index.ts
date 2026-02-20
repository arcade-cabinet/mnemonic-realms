/**
 * Smart Compositional Map Generation — Public API
 *
 * Worlds all the way down — fractal composition:
 *
 *   WORLD (the whole game — one continuous outdoor composition)
 *     └── REGIONS (biome zones: theme, weather, fills, encounters, time budget)
 *          ├── TOWN ORGANISMS (building clusters embedded in outdoor map)
 *          ├── CONNECTIVE TISSUE (paths, wild areas between anchors)
 *          └── WORLD SLOTS → child WorldInstances (shops, dungeons, etc.)
 *               Each child world has its own regions (floors, rooms, wings)
 *               Same algebra recursively
 *
 * Towns are outdoor organisms, NOT separate maps.
 * Everything else (shops, dungeons, fortresses, markets) are child worlds.
 * Same compositional algebra all the way down.
 *
 * Usage:
 *   const world = await loadWorldDDL(projectRoot);
 *   const output = await composeWorld(world, registry);
 */

export type {
  ArchetypeCategory,
  ArchetypeDefinition,
  BuildingRole,
  TilesetPack,
} from './archetypes';
// Archetype registry
export { ArchetypeRegistry } from './archetypes';
export type {
  BiomeDefinition,
  BuildingColor,
  EdgeTreatment,
  GroundVariant,
  PathDressRule,
  ScatterRule,
} from './biomes';
// Biome system
export { BIOMES, colorToAtlas, getBiome } from './biomes';
export type {
  ComposedMap,
  ConnectionSpec,
  FeatureDeclaration,
  PlacedFeature,
  PositionHint,
  SceneDeclaration,
  TransitionZone,
  ValidationResult,
} from './composer';
// Core composer
export { composeMap } from './composer';
export type { EdgePlacement, FillResult, ScatterPlacement } from './fill-engine';
// Fill engine
export { runFillEngine, SeededRNG } from './fill-engine';
export type { HamletConfig, HamletLayout } from './organisms/hamlet';
// Organisms
export { layoutHamlet } from './organisms/hamlet';
export type { BuildingPlacement, TownLayout } from './organisms/town';
// Organisms — Town
export { estimateTownSize, layoutTown } from './organisms/town';
export type {
  CollisionGrid,
  PathRequest,
  Point,
  RoutedPath,
} from './path-router';
// Path router
export {
  createCollisionGrid,
  findPath,
  markArea,
  markClearance,
  routeAll,
  simplifyPath,
} from './path-router';
export type { PlacedAnchor, RegionExit, RegionMap } from './region-composer';
// Region composer
export { composeRegion } from './region-composer';
export type {
  ParsedTmx,
  TmxLayer,
  TmxObject,
  TmxObjectGroup,
  TmxTilesetRef,
} from './tmx-parser';
// TMX parser
export { getLayerBounds, parseTmx, resolveGid, tmxSummary } from './tmx-parser';
export type {
  ComposedWorldInstance,
  ComposedWorld,
  ResolvedConnection,
} from './world-composer';
// World composer
export { composeSingleRegion, composeWorld } from './world-composer';
export type {
  AnchorDefinition,
  ConnectiveTissueRules,
  DungeonDefinition,
  RegionConnection,
  RegionDefinition,
  RegionMetrics,
  TownDefinition,
  WorldDefinition,
} from './world-ddl';
// World DDL types
export { calculateRegionMetrics } from './world-ddl';
export type { LoadedWorld } from './world-loader';
// World DDL loader
export { getAnchorWorldSlotIds, loadWorldDDL } from './world-loader';
// World template types
export type {
  WorldTemplate,
  WorldInstance,
  WorldSlot,
  TemplateLayout,
  TemplateSlot,
} from './world-template';
export { getWorldTemplate, validateWorldInstance, WORLD_TEMPLATES } from './world-template';
