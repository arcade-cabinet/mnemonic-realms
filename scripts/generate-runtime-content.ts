#!/usr/bin/env tsx
/**
 * Runtime Content Generator — DDL → data/maps/*.json + data/encounters/*.json
 *
 * Reads all DDL definitions and generates structurally valid runtime JSON
 * that the MnemonicEngine can load. Map content is placeholder (filled ground
 * layer, basic collision) — the full assemblage pipeline replaces it later.
 *
 * Usage: pnpm generate:content
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { AssemblageObject, EventHook } from '../gen/assemblage/types.ts';
import type {
  RuntimeEncounter,
  RuntimeEncounterPool,
  RuntimeMapData,
  RuntimeSpawnPoint,
  RuntimeTransition,
  RuntimeVibrancyArea,
  RuntimeVisual,
} from '../gen/assemblage/pipeline/runtime-types.ts';
import {
  serializeEncounter,
  serializeEncounterPool,
} from '../gen/assemblage/pipeline/encounter-serializer.ts';
import type {
  EncounterDdl,
  EncounterFileDdl,
  EncounterPoolDdl,
} from '../gen/schemas/ddl-encounters.ts';

// ── Paths ────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(import.meta.dirname, '..');
const DDL_DIR = path.join(ROOT, 'gen', 'ddl');
const DATA_DIR = path.join(ROOT, 'data');
const MAPS_OUT = path.join(DATA_DIR, 'maps');
const ENCOUNTERS_OUT = path.join(DATA_DIR, 'encounters');

// ── Helpers ──────────────────────────────────────────────────────────────────

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/** Parse "x,y" tile position string to numbers. */
function parseTilePos(pos: string): { x: number; y: number } {
  const [x, y] = pos.split(',').map(Number);
  return { x: x ?? 0, y: y ?? 0 };
}

// ── DDL type interfaces ──────────────────────────────────────────────────────

interface MapDdlEntry {
  id: string;
  name: string;
  width: number;
  height: number;
  tileSize: number;
  biome: string;
  startVibrancy?: number;
  connections?: Array<{
    fromTile: string;
    direction: string;
    toMap: string;
    toTile: string;
    condition: string;
  }>;
  npcSpawns?: Array<{
    npcId: string;
    name: string;
    position: string;
    graphic: string;
    movement: string;
  }>;
  resonanceStones?: Array<{
    id: string;
    position: string;
    fragments: string;
  }>;
  treasureChests?: Array<{
    id: string;
    position: string;
    contents: string;
  }>;
}

interface RegionAnchorBuilding {
  id: string;
  name: string;
  objectRef: string;
  x: number;
  y: number;
  width: number;
  height: number;
  door?: { x: number; y: number; targetWorld: string };
}

interface RegionAnchor {
  id: string;
  name: string;
  mapLayout?: {
    defaultGround?: string;
    mapSize?: [number, number];
    buildings?: RegionAnchorBuilding[];
    npcSpawns?: Array<{
      id: string;
      sprite: string;
      x: number;
      y: number;
      dialogue: string;
    }>;
    transitions?: Array<{
      id: string;
      x: number;
      y: number;
      targetMap: string;
      targetX: number;
      targetY: number;
      condition?: string;
    }>;
    resonanceStones?: Array<{
      id: string;
      x: number;
      y: number;
      fragment: string;
    }>;
    treasureChests?: Array<{
      id: string;
      x: number;
      y: number;
      item: string;
      quantity: number;
    }>;
    playerSpawn?: { x: number; y: number };
  };
}

interface RegionDdl {
  id: string;
  name: string;
  startVibrancy?: number;
  encounters?: {
    enemies: string[];
    levelRange: [number, number];
    averageStepsBetweenEncounters: number;
  };
  anchors?: RegionAnchor[];
}

interface WorldDdl {
  id: string;
  name: string;
  templateId: string;
  parentAnchor: string;
}

interface EnemyDdlEntry {
  id: string;
  name: string;
  zone: string;
  category: string;
  hp: number;
  atk: number;
  def: number;
  agi: number;
  baseLevel: number;
  xp: number;
  gold: number;
}

// ── Index Builders ──────────────────────────────────────────────────────────

/** Build an anchor lookup: mapId -> RegionAnchor from all region DDL files. */
function buildAnchorIndex(regionsDir: string): Map<string, RegionAnchor> {
  const index = new Map<string, RegionAnchor>();
  const files = fs.readdirSync(regionsDir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const region = readJson<RegionDdl>(path.join(regionsDir, file));
    if (region.anchors) {
      for (const anchor of region.anchors) {
        index.set(anchor.id, anchor);
      }
    }
  }
  return index;
}

/** Build a region lookup: regionId -> RegionDdl. */
function buildRegionIndex(regionsDir: string): Map<string, RegionDdl> {
  const index = new Map<string, RegionDdl>();
  const files = fs.readdirSync(regionsDir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const region = readJson<RegionDdl>(path.join(regionsDir, file));
    index.set(region.id, region);
  }
  return index;
}


// ── Map Generation ──────────────────────────────────────────────────────────

/**
 * Generate a RuntimeMapData from a map DDL entry + optional region anchor.
 * Creates placeholder tile data with correct structure.
 */
function generateMapRuntime(
  mapEntry: MapDdlEntry,
  anchor?: RegionAnchor,
): RuntimeMapData {
  const w = mapEntry.width;
  const h = mapEntry.height;
  const totalTiles = w * h;
  const defaultGround = anchor?.mapLayout?.defaultGround ?? 'ground.grass';

  // Ground layer: filled with default terrain
  const groundLayer: (string | 0)[] = new Array(totalTiles).fill(defaultGround);
  // Detail + overlay layers: empty
  const detailLayer: (string | 0)[] = new Array(totalTiles).fill(0);
  const overlayLayer: (string | 0)[] = new Array(totalTiles).fill(0);

  // Collision: border tiles blocked, interior passable
  const collision: (0 | 1)[] = new Array(totalTiles).fill(0 as 0 | 1);
  for (let x = 0; x < w; x++) {
    collision[x] = 1;
    collision[(h - 1) * w + x] = 1;
  }
  for (let y = 0; y < h; y++) {
    collision[y * w] = 1;
    collision[y * w + (w - 1)] = 1;
  }

  // Block building footprints
  const buildings = anchor?.mapLayout?.buildings ?? [];
  for (const bld of buildings) {
    for (let by = bld.y; by < bld.y + bld.height && by < h; by++) {
      for (let bx = bld.x; bx < bld.x + bld.width && bx < w; bx++) {
        collision[by * w + bx] = 1;
      }
    }
  }

  // Visuals from buildings
  const visuals: RuntimeVisual[] = buildings.map((b) => ({
    objectRef: b.objectRef,
    x: b.x,
    y: b.y,
  }));

  const objects: AssemblageObject[] = [];
  const hooks: EventHook[] = [];

  // NPC objects from anchor mapLayout (primary) or map DDL (fallback)
  const anchorNpcs = anchor?.mapLayout?.npcSpawns ?? [];
  if (anchorNpcs.length > 0) {
    for (const npc of anchorNpcs) {
      objects.push({
        name: npc.id,
        type: 'npc',
        x: npc.x,
        y: npc.y,
        properties: { sprite: npc.sprite, dialogue: npc.dialogue },
      });
    }
  } else if (mapEntry.npcSpawns) {
    for (const npc of mapEntry.npcSpawns) {
      const pos = parseTilePos(npc.position);
      objects.push({
        name: npc.npcId,
        type: 'npc',
        x: pos.x,
        y: pos.y,
        properties: { sprite: npc.graphic, dialogue: npc.npcId },
      });
    }
  }

  // Treasure chests from anchor (primary) or map DDL (fallback)
  const anchorChests = anchor?.mapLayout?.treasureChests ?? [];
  if (anchorChests.length > 0) {
    for (const chest of anchorChests) {
      objects.push({
        name: chest.id,
        type: 'chest',
        x: chest.x,
        y: chest.y,
        properties: { item: chest.item, quantity: chest.quantity },
      });
    }
  } else if (mapEntry.treasureChests) {
    for (const chest of mapEntry.treasureChests) {
      const pos = parseTilePos(chest.position);
      objects.push({
        name: chest.id,
        type: 'chest',
        x: pos.x,
        y: pos.y,
        properties: { contents: chest.contents },
      });
    }
  }

  // Resonance stones from anchor (primary) or map DDL (fallback)
  const anchorStones = anchor?.mapLayout?.resonanceStones ?? [];
  if (anchorStones.length > 0) {
    for (const stone of anchorStones) {
      objects.push({
        name: stone.id,
        type: 'trigger',
        x: stone.x,
        y: stone.y,
        properties: { resonanceStone: true, fragment: stone.fragment },
      });
    }
  } else if (mapEntry.resonanceStones) {
    for (const stone of mapEntry.resonanceStones) {
      const pos = parseTilePos(stone.position);
      objects.push({
        name: stone.id,
        type: 'trigger',
        x: pos.x,
        y: pos.y,
        properties: { resonanceStone: true, fragment: stone.fragments },
      });
    }
  }

  // Transitions from anchor (primary) or map DDL connections (fallback)
  const transitions: RuntimeTransition[] = [];
  const anchorTransitions = anchor?.mapLayout?.transitions ?? [];
  if (anchorTransitions.length > 0) {
    for (const t of anchorTransitions) {
      objects.push({
        name: t.id,
        type: 'transition',
        x: t.x,
        y: t.y,
        width: 2,
        height: 2,
        properties: {
          targetWorld: t.targetMap,
          targetX: t.targetX,
          targetY: t.targetY,
          transitionType: 'region',
          ...(t.condition ? { condition: t.condition } : {}),
        },
      });
      transitions.push({
        id: t.id,
        x: t.x,
        y: t.y,
        width: 2,
        height: 2,
        target: t.targetMap,
        type: 'region',
        properties: {
          targetX: t.targetX,
          targetY: t.targetY,
          ...(t.condition ? { condition: t.condition } : {}),
        },
      });
    }
  } else if (mapEntry.connections) {
    for (const conn of mapEntry.connections) {
      const fromPos = parseTilePos(conn.fromTile);
      const toPos = parseTilePos(conn.toTile);
      const id = `${mapEntry.id}-to-${conn.toMap}`;
      objects.push({
        name: id,
        type: 'transition',
        x: fromPos.x,
        y: fromPos.y,
        width: 2,
        height: 2,
        properties: {
          targetWorld: conn.toMap,
          targetX: toPos.x,
          targetY: toPos.y,
          transitionType: 'region',
          condition: conn.condition,
        },
      });
      transitions.push({
        id,
        x: fromPos.x,
        y: fromPos.y,
        width: 2,
        height: 2,
        target: conn.toMap,
        type: 'region',
        properties: {
          targetX: toPos.x,
          targetY: toPos.y,
          condition: conn.condition,
        },
      });
    }
  }

  // Door transitions from buildings
  for (const bld of buildings) {
    if (bld.door) {
      const doorId = `door-${bld.id}`;
      const doorX = bld.x + bld.door.x;
      const doorY = bld.y + bld.door.y;
      if (doorY < h && doorX < w) {
        collision[doorY * w + doorX] = 0;
      }
      objects.push({
        name: doorId,
        type: 'transition',
        x: doorX,
        y: doorY,
        width: 1,
        height: 1,
        properties: { targetWorld: bld.door.targetWorld, transitionType: 'door' },
      });
      transitions.push({
        id: doorId,
        x: doorX,
        y: doorY,
        width: 1,
        height: 1,
        target: bld.door.targetWorld,
        type: 'door',
      });
    }
  }

  // Spawn points
  const spawnPoints: RuntimeSpawnPoint[] = [];
  const playerSpawn = anchor?.mapLayout?.playerSpawn;
  if (playerSpawn) {
    spawnPoints.push({ id: 'player-spawn', x: playerSpawn.x, y: playerSpawn.y });
    objects.push({ name: 'player-spawn', type: 'spawn', x: playerSpawn.x, y: playerSpawn.y });
  } else {
    const cx = Math.floor(w / 2);
    const cy = Math.floor(h / 2);
    spawnPoints.push({ id: 'player-spawn', x: cx, y: cy });
    objects.push({ name: 'player-spawn', type: 'spawn', x: cx, y: cy });
  }

  // Vibrancy areas: one area covering the whole map
  const vibrancy = mapEntry.startVibrancy ?? 50;
  const vibrancyState: 'forgotten' | 'partial' | 'remembered' =
    vibrancy >= 70 ? 'remembered' : vibrancy >= 30 ? 'partial' : 'forgotten';
  const vibrancyAreas: RuntimeVibrancyArea[] = [
    {
      id: `${mapEntry.id}-main`,
      x: 0,
      y: 0,
      width: w,
      height: h,
      initialState: vibrancyState,
    },
  ];

  return {
    id: mapEntry.id,
    width: w,
    height: h,
    tileWidth: 16,
    tileHeight: 16,
    layerOrder: ['ground', 'detail', 'overlay'],
    layers: { ground: groundLayer, detail: detailLayer, overlay: overlayLayer },
    collision,
    visuals,
    objects,
    hooks,
    spawnPoints,
    transitions,
    vibrancyAreas,
  };
}

// ── Child World Generation ──────────────────────────────────────────────────

/** Template sizes for interior worlds. */
const TEMPLATE_SIZES: Record<string, [number, number]> = {
  inn: [20, 15],
  shop: [15, 12],
  'shop-single': [15, 12],
  house: [12, 10],
  residence: [12, 10],
  forge: [18, 14],
  dungeon: [30, 20],
  fortress: [40, 30],
  cellar: [20, 15],
};

/** Generate a small interior RuntimeMapData for a child world. */
function generateChildWorldRuntime(world: WorldDdl): RuntimeMapData {
  const [w, h] = TEMPLATE_SIZES[world.templateId] ?? [20, 15];
  const totalTiles = w * h;

  const groundLayer: (string | 0)[] = new Array(totalTiles).fill('ground.wood-floor');
  const detailLayer: (string | 0)[] = new Array(totalTiles).fill(0);
  const overlayLayer: (string | 0)[] = new Array(totalTiles).fill(0);

  // All border tiles blocked
  const collision: (0 | 1)[] = new Array(totalTiles).fill(0 as 0 | 1);
  for (let x = 0; x < w; x++) {
    collision[x] = 1;
    collision[(h - 1) * w + x] = 1;
  }
  for (let y = 0; y < h; y++) {
    collision[y * w] = 1;
    collision[y * w + (w - 1)] = 1;
  }

  // Exit door at bottom center
  const exitX = Math.floor(w / 2);
  const exitY = h - 1;
  collision[exitY * w + exitX] = 0;

  const objects: AssemblageObject[] = [
    { name: 'player-spawn', type: 'spawn', x: exitX, y: exitY - 1 },
    {
      name: `exit-to-${world.parentAnchor}`,
      type: 'transition',
      x: exitX,
      y: exitY,
      width: 1,
      height: 1,
      properties: { targetWorld: world.parentAnchor, transitionType: 'door' },
    },
  ];

  const transitions: RuntimeTransition[] = [
    {
      id: `exit-to-${world.parentAnchor}`,
      x: exitX,
      y: exitY,
      width: 1,
      height: 1,
      target: world.parentAnchor,
      type: 'door',
    },
  ];

  return {
    id: world.id,
    width: w,
    height: h,
    tileWidth: 16,
    tileHeight: 16,
    layerOrder: ['ground', 'detail', 'overlay'],
    layers: { ground: groundLayer, detail: detailLayer, overlay: overlayLayer },
    collision,
    visuals: [],
    objects,
    hooks: [],
    spawnPoints: [{ id: 'player-spawn', x: exitX, y: exitY - 1 }],
    transitions,
    vibrancyAreas: [
      { id: `${world.id}-main`, x: 0, y: 0, width: w, height: h, initialState: 'remembered' },
    ],
  };
}

// ── Encounter Generation ────────────────────────────────────────────────────

/** Generate placeholder encounters for a region that has no encounter DDL. */
function generatePlaceholderEncounters(
  regionId: string,
  enemies: EnemyDdlEntry[],
  levelRange: [number, number],
  stepsBetween: number,
): { encounters: RuntimeEncounter[]; pool: RuntimeEncounterPool } {
  const runtimeEncounters: RuntimeEncounter[] = [];
  const encounterIds: string[] = [];

  // Create one encounter per enemy type
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const encId = `ENC-${regionId.toUpperCase()}-${String(i + 1).padStart(2, '0')}`;
    encounterIds.push(encId);
    runtimeEncounters.push({
      id: encId,
      name: `${enemy.name} Encounter`,
      type: 'random',
      enemies: [{ enemyId: enemy.id, count: 2, position: 'front' }],
      rewards: { xp: enemy.xp * 2, gold: enemy.gold * 2 },
      escapeAllowed: true,
    });
  }

  const pool: RuntimeEncounterPool = {
    regionId,
    encounters: encounterIds,
    stepsBetween,
    levelRange,
  };

  return { encounters: runtimeEncounters, pool };
}

// ── Main ────────────────────────────────────────────────────────────────────

function main(): void {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  Runtime Content Generator — DDL → data/maps + encounters  ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  ensureDir(MAPS_OUT);
  ensureDir(ENCOUNTERS_OUT);

  const regionsDir = path.join(DDL_DIR, 'regions');
  const mapsDir = path.join(DDL_DIR, 'maps');
  const encountersDir = path.join(DDL_DIR, 'encounters');
  const enemiesDir = path.join(DDL_DIR, 'enemies');
  const worldsDir = path.join(DDL_DIR, 'worlds');

  // Build indexes
  const anchorIndex = buildAnchorIndex(regionsDir);
  const regionIndex = buildRegionIndex(regionsDir);
  console.log(`  Indexed ${anchorIndex.size} anchors from ${regionIndex.size} regions\n`);

  // ── Generate overworld maps ──
  let mapCount = 0;
  const mapFiles = fs.readdirSync(mapsDir).filter((f) => f.endsWith('.json'));
  for (const file of mapFiles) {
    const entries = readJson<MapDdlEntry[]>(path.join(mapsDir, file));
    for (const entry of entries) {
      const anchor = anchorIndex.get(entry.id);
      const runtime = generateMapRuntime(entry, anchor);
      const outPath = path.join(MAPS_OUT, `${entry.id}.json`);
      writeJson(outPath, runtime);
      mapCount++;
      console.log(
        `  [Map] ${entry.id.padEnd(25)} ${entry.width}×${entry.height}  ${runtime.objects.length} objects  ${runtime.transitions.length} transitions`,
      );
    }
  }
  console.log(`\n  Generated ${mapCount} overworld maps\n`);

  // ── Generate child world maps ──
  let childCount = 0;
  if (fs.existsSync(worldsDir)) {
    const worldFiles = fs.readdirSync(worldsDir).filter((f) => f.endsWith('.json'));
    for (const file of worldFiles) {
      const world = readJson<WorldDdl>(path.join(worldsDir, file));
      const runtime = generateChildWorldRuntime(world);
      const outPath = path.join(MAPS_OUT, `${world.id}.json`);
      writeJson(outPath, runtime);
      childCount++;
      console.log(
        `  [Interior] ${world.id.padEnd(25)} ${runtime.width}×${runtime.height}  template=${world.templateId}`,
      );
    }
  }
  console.log(`\n  Generated ${childCount} interior maps\n`);

  // ── Generate encounters ──
  let encFileCount = 0;

  // Process existing encounter DDL files
  if (fs.existsSync(encountersDir)) {
    const encFiles = fs.readdirSync(encountersDir).filter((f) => f.endsWith('.json'));
    for (const file of encFiles) {
      const fileDdl = readJson<EncounterFileDdl>(path.join(encountersDir, file));
      const regionId = file.replace('.json', '');
      const allEncounters: RuntimeEncounter[] = fileDdl.encounters.map(serializeEncounter);
      const pools: RuntimeEncounterPool[] = [];

      if (fileDdl.pools) {
        for (const poolDdl of fileDdl.pools) {
          const { pool } = serializeEncounterPool(poolDdl, fileDdl.encounters);
          pools.push(pool);
        }
      }

      const outPath = path.join(ENCOUNTERS_OUT, `${regionId}.json`);
      writeJson(outPath, { encounters: allEncounters, pools });
      encFileCount++;
      console.log(
        `  [Encounter] ${regionId.padEnd(25)} ${allEncounters.length} encounters  ${pools.length} pools`,
      );
    }
  }

  // Generate placeholder encounters for regions without encounter DDL
  for (const [regionId, region] of regionIndex) {
    const existingFile = path.join(ENCOUNTERS_OUT, `${regionId}.json`);
    if (fs.existsSync(existingFile)) continue;
    if (!region.encounters) continue;

    // Load enemy data for this region
    const enemies: EnemyDdlEntry[] = [];
    if (fs.existsSync(enemiesDir)) {
      const enemyFiles = fs.readdirSync(enemiesDir).filter((f) => f.endsWith('.json'));
      for (const ef of enemyFiles) {
        const data = readJson<EnemyDdlEntry[] | { enemies: EnemyDdlEntry[] }>(
          path.join(enemiesDir, ef),
        );
        const list = Array.isArray(data) ? data : data.enemies ?? [];
        enemies.push(...list);
      }
    }

    // Filter to enemies referenced by this region
    const regionEnemyIds = new Set(region.encounters.enemies);
    const regionEnemies = enemies.filter((e) => regionEnemyIds.has(e.id));

    if (regionEnemies.length > 0) {
      const { encounters, pool } = generatePlaceholderEncounters(
        regionId,
        regionEnemies,
        region.encounters.levelRange,
        region.encounters.averageStepsBetweenEncounters,
      );
      writeJson(existingFile, { encounters, pools: [pool] });
      encFileCount++;
      console.log(
        `  [Encounter] ${regionId.padEnd(25)} ${encounters.length} placeholder encounters (generated)`,
      );
    }
  }

  console.log(`\n  Generated ${encFileCount} encounter files\n`);

  // Summary
  const totalMaps = mapCount + childCount;
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log(`║  Done! ${totalMaps} maps + ${encFileCount} encounter files → data/          ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝');
}

main();