/**
 * Scene Compiler — reads scene DDL + map DDL → produces MapComposition objects.
 *
 * The compiler aggregates all scenes targeting the same map, merges their
 * assemblage placements, NPCs, events, and objects into a unified
 * MapComposition that feeds the existing pipeline (canvas → TMX → events).
 *
 * Architecture:
 *   1. Read map DDL (gen/ddl/maps/{mapId}.json) for canvas config
 *   2. Read all scene DDL files, filter to scenes on this map
 *   3. Merge assemblage placements (de-duplicate by assemblageId+position)
 *   4. Merge NPCs, events, resonance stones, treasure chests
 *   5. Output MapComposition + scene metadata for event codegen
 *
 * The compiler works incrementally: empty assemblage arrays in scene DDL
 * are fine — the map just won't have assemblage-sourced tiles until they're
 * populated. NPCs and events work regardless.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { SceneDdl } from '../../schemas/ddl-scenes.ts';
import type {
  AssemblageObject,
  MapComposition,
  PathSegment,
  PlacedAssemblage,
  VisualObject,
} from '../types.ts';

// ---------------------------------------------------------------------------
// Map DDL types (matches gen/ddl/maps/*.json structure)
// ---------------------------------------------------------------------------

interface MapDdlConnection {
  fromTile: string;
  direction: string;
  toMap: string;
  toTile: string;
  condition: string;
}

interface MapDdlEntry {
  id: string;
  name: string;
  filename: string;
  width: number;
  height: number;
  tileSize: number;
  biome: string;
  tilesetRefs: string[];
  startVibrancy: number;
  category: string;
  act: string;
  connections: MapDdlConnection[];
}

// ---------------------------------------------------------------------------
// Compilation result
// ---------------------------------------------------------------------------

export interface CompilationResult {
  /** The MapComposition ready for the assemblage pipeline */
  composition: MapComposition;
  /** Scene metadata for event codegen (organized by scene) */
  sceneMeta: SceneMeta[];
  /** Warnings about missing data or conflicts */
  warnings: string[];
}

export interface SceneMeta {
  sceneId: string;
  act: string;
  sceneNumber: number;
  name: string;
  summary: string;
  narrativeContext?: string;
  playerInstructions?: string[];
  prerequisites?: Record<string, unknown>;
  testCriteria?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Palette name resolver
// ---------------------------------------------------------------------------

const BIOME_TO_PALETTE: Record<string, string> = {
  village: 'village-premium',
  farmland: 'village-premium',
  forest: 'village-premium',
  river: 'village-premium',
  mountain: 'village-premium',
  dungeon: 'dungeon-depths',
  depths: 'dungeon-depths',
  marsh: 'frontier-seasons',
  snow: 'frontier-seasons',
  veil: 'frontier-seasons',
  resonance: 'frontier-seasons',
  sketch: 'desert-sketch',
  desert: 'desert-sketch',
  void: 'desert-sketch',
  fortress: 'fortress-castles',
};

// ---------------------------------------------------------------------------
// Main compiler
// ---------------------------------------------------------------------------

/**
 * Compile a map from scene DDL + map DDL.
 *
 * @param mapId - Target map ID (e.g., 'everwick')
 * @param rootDir - Project root directory
 * @param assemblageResolver - Optional function to resolve assemblage IDs to definitions
 */
export function compileMap(
  mapId: string,
  rootDir: string,
  assemblageResolver?: (assemblageId: string) => PlacedAssemblage | null,
): CompilationResult {
  const warnings: string[] = [];

  // 1. Load map DDL
  const mapDdl = loadMapDdl(mapId, rootDir);
  if (!mapDdl) {
    throw new Error(`Map DDL not found for '${mapId}'. Expected: gen/ddl/maps/${mapId}.json`);
  }

  // 2. Load all scene DDL files and filter to this map
  const allScenes = loadAllScenes(rootDir);
  const mapScenes = allScenes.filter((s) => s.mapId === mapId);

  if (mapScenes.length === 0) {
    warnings.push(`No scenes found for map '${mapId}'. The map will have no scene-driven content.`);
  }

  // 3. Merge assemblage placements (de-duplicate by assemblageId + position)
  const placements: PlacedAssemblage[] = [];
  const placementKeys = new Set<string>();

  for (const scene of mapScenes) {
    for (const ref of scene.assemblages ?? []) {
      const key = `${ref.assemblageId}@${ref.x},${ref.y}`;
      if (placementKeys.has(key)) continue;
      placementKeys.add(key);

      if (assemblageResolver) {
        const placed = assemblageResolver(ref.assemblageId);
        if (placed) {
          placements.push({ ...placed, x: ref.x, y: ref.y });
        } else {
          warnings.push(
            `Scene ${scene.id}: assemblage '${ref.assemblageId}' not found. ` +
            `Create it in gen/assemblage/assemblages/ and register it.`,
          );
        }
      } else {
        warnings.push(
          `Scene ${scene.id}: assemblage '${ref.assemblageId}' referenced but no resolver provided.`,
        );
      }
    }
  }

  // 4. Merge paths from all scenes
  const paths: PathSegment[] = [];
  for (const scene of mapScenes) {
    for (const pathRef of scene.paths ?? []) {
      paths.push({
        terrain: pathRef.terrain,
        layer: pathRef.layer,
        width: pathRef.width,
        points: pathRef.points,
      });
    }
  }

  // 5. Merge visuals from all scenes
  const visuals: VisualObject[] = [];
  const visualKeys = new Set<string>();
  for (const scene of mapScenes) {
    for (const vis of scene.visuals ?? []) {
      const key = `${vis.objectRef}@${vis.x},${vis.y}`;
      if (!visualKeys.has(key)) {
        visualKeys.add(key);
        visuals.push({ objectRef: vis.objectRef, x: vis.x, y: vis.y });
      }
    }
  }

  // 6. Merge NPCs and events as AssemblageObjects
  const objects: AssemblageObject[] = [];
  const objectNames = new Set<string>();

  // Add NPCs from scenes
  for (const scene of mapScenes) {
    for (const npc of scene.npcs) {
      const name = `${npc.npcId}-s${scene.sceneNumber}`;
      if (objectNames.has(name)) continue;
      objectNames.add(name);

      const [x, y] = (npc.position || '0,0').split(',').map(Number);
      objects.push({
        name: npc.npcId,
        type: 'npc',
        x,
        y,
        properties: {
          sprite: npc.graphic,
          graphic: npc.graphic,
          dialogueId: npc.dialogueRef ?? '',
          movement: npc.movement ?? 'static',
          ...(npc.patrolRange ? { patrolRange: npc.patrolRange } : {}),
          ...(npc.condition ? { condition: npc.condition } : {}),
          scene: scene.id,
        },
      });
    }
  }

  // Add event triggers from scenes
  for (const scene of mapScenes) {
    for (const evt of scene.events ?? []) {
      if (objectNames.has(evt.id)) continue;
      objectNames.add(evt.id);

      const [x, y] = (evt.position || '0,0').split(',').map(Number);
      objects.push({
        name: evt.id,
        type: 'trigger',
        x,
        y,
        properties: {
          eventType: evt.type,
          repeat: evt.repeat ?? 'once',
          description: evt.description,
          ...(evt.linkedQuest ? { linkedQuest: evt.linkedQuest } : {}),
          scene: scene.id,
        },
      });
    }
  }

  // Add resonance stones
  for (const scene of mapScenes) {
    for (const stone of scene.resonanceStones ?? []) {
      if (objectNames.has(stone.id)) continue;
      objectNames.add(stone.id);

      const [x, y] = (stone.position || '0,0').split(',').map(Number);
      objects.push({
        name: stone.id,
        type: 'trigger',
        x,
        y,
        properties: {
          eventType: 'action',
          fragments: stone.fragments,
          description: `Resonance Stone: ${stone.fragments}`,
          ...(stone.notes ? { notes: stone.notes } : {}),
          scene: scene.id,
        },
      });
    }
  }

  // Add treasure chests
  for (const scene of mapScenes) {
    for (const chest of scene.treasureChests ?? []) {
      if (objectNames.has(chest.id)) continue;
      objectNames.add(chest.id);

      const [x, y] = (chest.position || '0,0').split(',').map(Number);
      objects.push({
        name: chest.id,
        type: 'chest',
        x,
        y,
        properties: {
          contents: chest.contents,
          ...(chest.condition ? { condition: chest.condition } : {}),
          scene: scene.id,
        },
      });
    }
  }

  // Add connections from map DDL as transition objects
  for (const conn of mapDdl.connections) {
    const name = `transition-${conn.direction}-${conn.toMap}`;
    if (objectNames.has(name)) continue;
    objectNames.add(name);

    const [x, y] = conn.fromTile.split(',').map(Number);
    const [tx, ty] = conn.toTile.split(',').map(Number);
    objects.push({
      name,
      type: 'transition',
      x,
      y,
      properties: {
        map: conn.toMap,
        targetMap: conn.toMap,
        targetX: tx,
        targetY: ty,
        condition: conn.condition,
      },
    });
  }

  // Add player spawn from first scene
  const firstScene = mapScenes.find((s) => s.spawnPosition);
  if (firstScene?.spawnPosition) {
    const [sx, sy] = firstScene.spawnPosition.split(',').map(Number);
    if (!objectNames.has('player-spawn')) {
      objectNames.add('player-spawn');
      objects.push({
        name: 'player-spawn',
        type: 'spawn',
        x: sx,
        y: sy,
      });
    }
  }

  // 7. Determine tile size and palette
  // Use 16px for premium tilesets (default), map DDL overrides
  const tileSize = mapDdl.tileSize === 32 ? 32 : 16;
  const scale = tileSize === 16 ? 2 : 1; // 16px maps are 2x the design doc dimensions
  const width = mapDdl.width * scale;
  const height = mapDdl.height * scale;

  const paletteName = BIOME_TO_PALETTE[mapDdl.biome] ?? 'village-premium';

  // 8. Build MapComposition
  const composition: MapComposition = {
    id: mapId,
    name: mapDdl.name,
    width,
    height,
    tileWidth: tileSize,
    tileHeight: tileSize,
    paletteName,
    defaultGround: `terrain:ground.${mapDdl.biome === 'village' ? 'grass' : mapDdl.biome}`,
    layers: ['ground', 'ground2', 'road', 'objects', 'objects_upper'],
    placements,
    paths: paths.length > 0 ? paths : undefined,
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    hooks: [],
  };

  // 9. Build scene metadata
  const sceneMeta: SceneMeta[] = mapScenes.map((s) => ({
    sceneId: s.id,
    act: s.act,
    sceneNumber: s.sceneNumber,
    name: s.name,
    summary: s.summary,
    narrativeContext: s.narrativeContext,
    playerInstructions: s.playerInstructions,
    prerequisites: s.prerequisites as Record<string, unknown> | undefined,
    testCriteria: s.testCriteria as Record<string, unknown> | undefined,
  }));

  return { composition, sceneMeta, warnings };
}

// ---------------------------------------------------------------------------
// DDL loaders
// ---------------------------------------------------------------------------

function loadMapDdl(mapId: string, rootDir: string): MapDdlEntry | null {
  const filePath = resolve(rootDir, `gen/ddl/maps/${mapId}.json`);
  if (!existsSync(filePath)) return null;

  const raw = JSON.parse(readFileSync(filePath, 'utf-8'));
  // Map DDL files are arrays with one entry
  return Array.isArray(raw) ? raw[0] : raw;
}

function loadAllScenes(rootDir: string): SceneDdl[] {
  const scenes: SceneDdl[] = [];
  const ddlDir = resolve(rootDir, 'gen/ddl/scenes');

  if (!existsSync(ddlDir)) return scenes;

  for (const act of ['act1', 'act2', 'act3']) {
    const filePath = resolve(ddlDir, `${act}.json`);
    if (!existsSync(filePath)) continue;

    const raw = JSON.parse(readFileSync(filePath, 'utf-8'));
    if (Array.isArray(raw)) {
      scenes.push(...(raw as SceneDdl[]));
    }
  }

  return scenes;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * List all unique map IDs referenced across all scene DDL files.
 */
export function listCompiledMaps(rootDir: string): string[] {
  const scenes = loadAllScenes(rootDir);
  return [...new Set(scenes.map((s) => s.mapId))].sort();
}

/**
 * Get all scenes for a specific map, sorted by act and scene number.
 */
export function getScenesForMap(mapId: string, rootDir: string): SceneDdl[] {
  return loadAllScenes(rootDir)
    .filter((s) => s.mapId === mapId)
    .sort((a, b) => {
      if (a.act !== b.act) return a.act.localeCompare(b.act);
      return a.sceneNumber - b.sceneNumber;
    });
}
