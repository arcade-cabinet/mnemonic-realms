#!/usr/bin/env npx tsx
/**
 * Assemblage System CLI.
 *
 * Usage:
 *   pnpm assemblage build [mapId|all]          # Generate TMX + events from compositions
 *   pnpm assemblage parse [act|all]            # Parse act scripts → scene DDL JSON
 *   pnpm assemblage compile [mapId|all]        # Compile scene DDL → TMX + events
 *   pnpm assemblage scenes [mapId|all]         # List scenes per map
 *   pnpm assemblage preview [mapId]            # ASCII rendering for quick check
 *   pnpm assemblage validate [mapId|all]       # Check overlaps, gaps, missing hooks
 *   pnpm assemblage list                       # List available map compositions
 *   pnpm assemblage test [all|ddl|organisms|region|world]  # Run assemblage tests
 *   pnpm assemblage snapshot [regionId|all]    # Generate visual PNG snapshots
 *   pnpm assemblage build-region [regionId|all] # DDL → region compose → TMX (the real pipeline)
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { compileMap, getScenesForMap, listCompiledMaps } from './compiler/scene-compiler.ts';
import { parseActScript } from './parser/act-script-parser.ts';
import { composeMap } from './pipeline/canvas.ts';
import { generateEventsFile, generateMapClass } from './pipeline/event-codegen.ts';
import { serializeToTmx } from './pipeline/tmx-serializer.ts';
import { buildPalette, type TilesetPalette } from './tileset/palette-builder.ts';
import type { MapComposition } from './types.ts';

const ROOT = resolve(import.meta.dirname, '../..');
const MAPS_DIR = resolve(import.meta.dirname, 'maps');
const DOCS_DIR = resolve(ROOT, 'docs/story');
const DDL_SCENES_DIR = resolve(ROOT, 'gen/ddl/scenes');
const TMX_OUT = resolve(ROOT, 'main/server/maps/tmx');
const EVENTS_OUT = resolve(ROOT, 'main/server/maps/events');
const MAP_CLASS_OUT = resolve(ROOT, 'main/server/maps');

const args = process.argv.slice(2);
const command = args[0];
const target = args[1] ?? 'all';

async function main() {
  console.log('Mnemonic Realms — Assemblage System\n');

  switch (command) {
    case 'build':
      await runBuild(target);
      break;
    case 'parse':
      await runParse(target);
      break;
    case 'compile':
      await runCompile(target);
      break;
    case 'scenes':
      await runScenes(target);
      break;
    case 'preview':
      await runPreview(target);
      break;
    case 'validate':
      await runValidate(target);
      break;
    case 'list':
      await runList();
      break;
    case 'test':
      await runTest(target);
      break;
    case 'snapshot':
      await runSnapshot(target);
      break;
    case 'build-region':
      await runBuildRegion(target);
      break;
    default:
      printUsage();
  }
}

// --- Commands ---

async function runParse(target: string) {
  const acts = target === 'all' ? ['act1', 'act2', 'act3'] : [target];

  mkdirSync(DDL_SCENES_DIR, { recursive: true });

  for (const act of acts) {
    const actNum = parseInt(act.replace('act', ''), 10);
    const scriptPath = resolve(DOCS_DIR, `${act}-script.md`);

    if (!existsSync(scriptPath)) {
      console.log(`  Skipping ${act}: ${scriptPath} not found`);
      continue;
    }

    console.log(`Parsing ${act}-script.md...`);
    const result = parseActScript(scriptPath, actNum);

    // Write scene DDL JSON
    const outPath = resolve(DDL_SCENES_DIR, `${act}.json`);
    writeFileSync(outPath, `${JSON.stringify(result.scenes, null, 2)}\n`, 'utf-8');
    console.log(`  Wrote ${result.scenes.length} scenes → ${outPath}`);

    // Report warnings
    if (result.warnings.length > 0) {
      console.log('  Warnings:');
      for (const w of result.warnings) {
        console.log(`    ⚠ ${w}`);
      }
    }

    // Summary
    const maps = new Set(result.scenes.map((s) => s.mapId));
    const npcs = new Set(result.scenes.flatMap((s) => s.npcs.map((n) => n.npcId)));
    console.log(`  Maps: ${[...maps].join(', ')}`);
    console.log(`  NPCs: ${[...npcs].join(', ')}`);
    console.log(
      `  Quest refs: ${[...new Set(result.scenes.flatMap((s) => s.questRefs ?? []))].join(', ')}`,
    );
    console.log('');
  }
}

async function runCompile(target: string) {
  const mapIds = target === 'all' ? listCompiledMaps(ROOT) : [target];

  if (mapIds.length === 0) {
    console.log('No maps referenced in scene DDL. Run "pnpm assemblage parse all" first.');
    return;
  }

  const paletteCache = new Map<string, TilesetPalette>();

  for (const mapId of mapIds) {
    console.log(`Compiling ${mapId} from scene DDL...`);

    try {
      const result = compileMap(mapId, ROOT);
      const comp = result.composition;

      // Report scene coverage
      console.log(`  Scenes: ${result.sceneMeta.length}`);
      for (const s of result.sceneMeta) {
        console.log(`    ${s.act} #${s.sceneNumber}: ${s.name}`);
      }

      // Report objects
      const npcCount = (comp.objects ?? []).filter((o) => o.type === 'npc').length;
      const eventCount = (comp.objects ?? []).filter((o) => o.type === 'trigger').length;
      const chestCount = (comp.objects ?? []).filter((o) => o.type === 'chest').length;
      const transitionCount = (comp.objects ?? []).filter((o) => o.type === 'transition').length;
      console.log(
        `  Objects: ${npcCount} NPCs, ${eventCount} events, ${chestCount} chests, ${transitionCount} transitions`,
      );
      console.log(`  Assemblages: ${comp.placements.length}`);
      console.log(`  Canvas: ${comp.width}x${comp.height} @ ${comp.tileWidth}px`);

      // Report warnings
      if (result.warnings.length > 0) {
        console.log('  Warnings:');
        for (const w of result.warnings) {
          console.log(`    ⚠ ${w}`);
        }
      }

      // Generate outputs if assemblages are present (skip TMX for maps without assemblages)
      if (comp.placements.length > 0) {
        let palette = paletteCache.get(comp.paletteName);
        if (!palette) {
          palette = await loadPalette(comp.paletteName);
          paletteCache.set(comp.paletteName, palette);
        }

        const canvas = composeMap(comp);
        const tmx = serializeToTmx(canvas, palette, comp.id);
        mkdirSync(TMX_OUT, { recursive: true });
        writeFileSync(resolve(TMX_OUT, `${comp.id}.tmx`), tmx, 'utf-8');
        console.log(`  TMX: ${comp.id}.tmx`);
      } else {
        console.log(
          '  (No assemblages — skipping TMX generation. Fill scene DDL assemblage refs first.)',
        );
      }

      // Always generate events file (NPCs, transitions work without assemblages)
      if ((comp.objects ?? []).length > 0) {
        mkdirSync(EVENTS_OUT, { recursive: true });
        const canvas = composeMap(comp);
        const eventsCode = generateEventsFile(comp.id, canvas, comp.tileWidth);
        writeFileSync(resolve(EVENTS_OUT, `${comp.id}-events.ts`), eventsCode, 'utf-8');
        console.log(`  Events: ${comp.id}-events.ts`);
      }

      // Generate map class
      const mapClass = generateMapClass(comp.id, comp.tileWidth);
      mkdirSync(MAP_CLASS_OUT, { recursive: true });
      writeFileSync(resolve(MAP_CLASS_OUT, `${comp.id}.ts`), mapClass, 'utf-8');
      console.log(`  Map class: ${comp.id}.ts`);

      // Write scene metadata JSON (for test scaffolding)
      const metaPath = resolve(ROOT, `gen/ddl/compiled/${mapId}-scenes.json`);
      mkdirSync(resolve(ROOT, 'gen/ddl/compiled'), { recursive: true });
      writeFileSync(metaPath, `${JSON.stringify(result.sceneMeta, null, 2)}\n`, 'utf-8');
      console.log(`  Scene meta: ${metaPath}`);
    } catch (err) {
      console.error(`  ERROR: ${(err as Error).message}`);
    }
    console.log('');
  }
}

async function runScenes(target: string) {
  if (target === 'all') {
    // List all maps and their scene counts
    const mapIds = listCompiledMaps(ROOT);
    if (mapIds.length === 0) {
      console.log('No scenes found. Run "pnpm assemblage parse all" first.');
      return;
    }
    console.log('Maps referenced by scenes:');
    for (const mapId of mapIds) {
      const scenes = getScenesForMap(mapId, ROOT);
      console.log(`  ${mapId}: ${scenes.length} scene(s)`);
      for (const s of scenes) {
        console.log(`    ${s.act} #${s.sceneNumber}: ${s.name}`);
      }
    }
  } else {
    // Show scenes for a specific map
    const scenes = getScenesForMap(target, ROOT);
    if (scenes.length === 0) {
      console.log(`No scenes found for map '${target}'.`);
      return;
    }
    console.log(`Scenes on map '${target}':`);
    for (const s of scenes) {
      console.log(`\n  ${s.act} Scene ${s.sceneNumber}: ${s.name}`);
      console.log(`    Summary: ${s.summary.slice(0, 100)}...`);
      console.log(`    NPCs: ${s.npcs.map((n) => n.name).join(', ') || 'none'}`);
      console.log(`    Trigger: ${s.trigger.type} on ${s.trigger.map}`);
      if (s.playerInstructions?.length) {
        console.log('    Player instructions:');
        for (const inst of s.playerInstructions) {
          console.log(`      - ${inst}`);
        }
      }
    }
  }
}

async function runBuild(target: string) {
  const maps = await loadMaps(target);
  const paletteCache = new Map<string, TilesetPalette>();

  for (const comp of maps) {
    console.log(`Building ${comp.id}...`);

    // Get or build palette
    let palette = paletteCache.get(comp.paletteName);
    if (!palette) {
      palette = await loadPalette(comp.paletteName);
      paletteCache.set(comp.paletteName, palette);
    }

    // Compose map
    const canvas = composeMap(comp);

    // Generate TMX
    const tmx = serializeToTmx(canvas, palette, comp.id);
    mkdirSync(TMX_OUT, { recursive: true });
    const tmxPath = resolve(TMX_OUT, `${comp.id}.tmx`);
    writeFileSync(tmxPath, tmx, 'utf-8');
    console.log(`  TMX: ${tmxPath}`);

    // Generate events file
    mkdirSync(EVENTS_OUT, { recursive: true });
    const eventsCode = generateEventsFile(comp.id, canvas, comp.tileWidth);
    const eventsPath = resolve(EVENTS_OUT, `${comp.id}-events.ts`);
    writeFileSync(eventsPath, eventsCode, 'utf-8');
    console.log(`  Events: ${eventsPath}`);

    // Generate map class
    const mapClass = generateMapClass(comp.id, comp.tileWidth);
    const mapClassPath = resolve(MAP_CLASS_OUT, `${comp.id}.ts`);
    writeFileSync(mapClassPath, mapClass, 'utf-8');
    console.log(`  Map class: ${mapClassPath}`);

    console.log(`  Done: ${comp.width}x${comp.height} tiles, ${canvas.objects.length} objects`);
    console.log('');
  }

  console.log(`Built ${maps.length} map(s) successfully.`);
}

async function runPreview(target: string) {
  const maps = await loadMaps(target);

  for (const comp of maps) {
    console.log(`Preview: ${comp.id} (${comp.width}x${comp.height})\n`);

    const canvas = composeMap(comp);
    const groundLayer = canvas.layers.get(comp.layers[0])!;

    // ASCII preview of ground layer
    const charMap = new Map<string, string>();
    charMap.set('0', '.');
    let nextChar = 'A'.charCodeAt(0);

    for (let y = 0; y < comp.height; y++) {
      let row = '';
      for (let x = 0; x < comp.width; x++) {
        const tile = groundLayer[y * comp.width + x];
        if (tile === 0) {
          row += '.';
        } else {
          const key = String(tile);
          if (!charMap.has(key)) {
            charMap.set(key, String.fromCharCode(nextChar++));
            if (nextChar > 'Z'.charCodeAt(0)) nextChar = 'a'.charCodeAt(0);
          }
          row += charMap.get(key)!;
        }
      }
      console.log(row);
    }

    // Legend
    console.log('\nLegend:');
    for (const [tile, char] of charMap) {
      if (tile !== '0') {
        const terrain = tile.startsWith('terrain:') ? tile.slice(8) : tile;
        console.log(`  ${char} = ${terrain}`);
      }
    }

    // Objects
    if (canvas.objects.length > 0) {
      console.log('\nObjects:');
      for (const obj of canvas.objects) {
        console.log(`  [${obj.type}] ${obj.name} at (${obj.x}, ${obj.y})`);
      }
    }
    console.log('');
  }
}

async function runValidate(target: string) {
  const maps = await loadMaps(target);
  let totalErrors = 0;

  for (const comp of maps) {
    console.log(`Validating ${comp.id}...`);
    const errors: string[] = [];

    // Check map dimensions
    if (comp.width <= 0 || comp.height <= 0) {
      errors.push(`Invalid map dimensions: ${comp.width}x${comp.height}`);
    }

    // Check placement bounds
    for (const p of comp.placements) {
      const a = p.assemblage;
      if (p.x < 0 || p.y < 0) {
        errors.push(`${a.id}: negative position (${p.x}, ${p.y})`);
      }
      if (p.x + a.width > comp.width || p.y + a.height > comp.height) {
        errors.push(
          `${a.id}: exceeds canvas at (${p.x}, ${p.y}) ` +
            `size ${a.width}x${a.height} on ${comp.width}x${comp.height}`,
        );
      }
    }

    // Check for overlapping assemblages (same layer, same position)
    for (let i = 0; i < comp.placements.length; i++) {
      for (let j = i + 1; j < comp.placements.length; j++) {
        const a = comp.placements[i];
        const b = comp.placements[j];
        if (rectsOverlap(a, b)) {
          errors.push(
            `Overlap: ${a.assemblage.id} at (${a.x},${a.y}) and ` +
              `${b.assemblage.id} at (${b.x},${b.y})`,
          );
        }
      }
    }

    // Check that all objects have unique names
    const objNames = new Set<string>();
    const allObjects = [
      ...comp.placements.flatMap((p) =>
        (p.assemblage.objects ?? []).map((o) => `${p.assemblage.id}_${o.name}`),
      ),
      ...(comp.objects ?? []).map((o) => o.name),
    ];
    for (const name of allObjects) {
      if (objNames.has(name)) {
        errors.push(`Duplicate object name: ${name}`);
      }
      objNames.add(name);
    }

    // Check that hooks reference existing objects
    const allHooks = [
      ...comp.placements.flatMap((p) =>
        (p.assemblage.hooks ?? []).map((h) => ({
          ...h,
          objectName: `${p.assemblage.id}_${h.objectName}`,
        })),
      ),
      ...(comp.hooks ?? []),
    ];
    for (const hook of allHooks) {
      if (!objNames.has(hook.objectName)) {
        errors.push(`Hook references missing object: ${hook.objectName}`);
      }
    }

    // Check player spawn exists
    const hasSpawn =
      allObjects.some((name) => name.includes('spawn')) ||
      (comp.objects ?? []).some((o) => o.type === 'spawn');
    if (!hasSpawn) {
      errors.push('No player spawn point defined');
    }

    if (errors.length === 0) {
      console.log('  PASS');
    } else {
      for (const err of errors) {
        console.log(`  ERROR: ${err}`);
      }
      totalErrors += errors.length;
    }
    console.log('');
  }

  if (totalErrors > 0) {
    console.log(`Validation failed: ${totalErrors} error(s)`);
    process.exit(1);
  } else {
    console.log('All maps validated successfully.');
  }
}

async function runList() {
  if (!existsSync(MAPS_DIR)) {
    console.log('No map compositions found. Create them in gen/assemblage/maps/');
    return;
  }

  const files = readdirSync(MAPS_DIR).filter((f) => f.endsWith('.ts'));
  if (files.length === 0) {
    console.log('No map compositions found. Create them in gen/assemblage/maps/');
    return;
  }

  console.log('Available maps:');
  for (const file of files) {
    const id = basename(file, '.ts');
    try {
      const mod = await import(resolve(MAPS_DIR, file));
      const comp = mod.default ?? mod.composition ?? mod[Object.keys(mod)[0]];
      if (comp?.id) {
        console.log(`  ${comp.id} (${comp.width}x${comp.height}) — ${comp.name}`);
      } else {
        console.log(`  ${id} — (could not read composition)`);
      }
    } catch {
      console.log(`  ${id} — (load error)`);
    }
  }
}

async function runTest(target: string) {
  const testDir = 'gen/assemblage/testing';
  let testPath = testDir;

  if (target !== 'all') {
    const fileMap: Record<string, string> = {
      ddl: 'ddl-integrity.test.ts',
      organisms: 'organisms.test.ts',
      region: 'region-composer.test.ts',
      world: 'world-composer.test.ts',
    };
    const file = fileMap[target];
    if (file) {
      testPath = join(testDir, file);
    } else {
      console.log(`Unknown test target: ${target}`);
      console.log(`Available: all, ddl, organisms, region, world`);
      return;
    }
  }

  console.log(`Running assemblage tests${target !== 'all' ? ` (${target})` : ''}...`);
  console.log(`> npx vitest run ${testPath}\n`);

  try {
    execFileSync('npx', ['vitest', 'run', testPath], { stdio: 'inherit', cwd: ROOT });
  } catch {
    process.exit(1);
  }
}

async function runSnapshot(target: string) {
  const { ArchetypeRegistry } = await import('./composer/archetypes.ts');
  const { composeRegion } = await import('./composer/region-composer.ts');
  const { loadWorldDDL } = await import('./composer/world-loader.ts');
  const { saveSnapshot } = await import('./testing/visual-renderer.ts');
  const { formatDDLReport, validateDDL } = await import('./testing/ddl-validator.ts');

  const ddlRoot = join(ROOT, 'gen', 'ddl');
  const loaded = loadWorldDDL(ddlRoot);
  const registry = new ArchetypeRegistry(ROOT);

  const regions = target === 'all'
    ? loaded.world.regions
    : loaded.world.regions.filter((r) => r.id === target);

  if (regions.length === 0) {
    console.log(`Region '${target}' not found. Available: ${loaded.world.regions.map((r) => r.id).join(', ')}`);
    return;
  }

  // DDL validation first
  console.log('Validating DDL integrity...');
  const ddlReport = validateDDL(ddlRoot);
  console.log(formatDDLReport(ddlReport));
  console.log('');

  // Compose each region and save snapshots
  const seed = 42;
  for (const region of regions) {
    console.log(`Composing ${region.id}...`);
    const regionMap = await composeRegion(region, registry, { seed });

    const overlays = [
      ...regionMap.placedAnchors.flatMap((a) =>
        a.entryAnchors.map((p) => ({
          position: p,
          color: 'entry' as const,
          size: 3,
        })),
      ),
      ...Array.from(regionMap.doorTransitions.values()).map((p) => ({
        position: p,
        color: 'door' as const,
        size: 2,
      })),
      ...Array.from(regionMap.npcPositions.values()).map((p) => ({
        position: p,
        color: 'npc' as const,
      })),
    ];

    const path = saveSnapshot(regionMap.collisionGrid, 'region', region.id, {
      overlays,
    });
    console.log(`  Snapshot: ${path}`);
    console.log(`  Size: ${regionMap.width}x${regionMap.height} tiles`);
    console.log(`  Anchors: ${regionMap.placedAnchors.length}`);
    console.log(`  Paths: ${regionMap.routedPaths.length}`);
    console.log(`  Doors: ${regionMap.doorTransitions.size}`);
    console.log(`  NPCs: ${regionMap.npcPositions.size}`);
    console.log('');
  }

  console.log(`Generated ${regions.length} snapshot(s).`);
}

async function runBuildRegion(target: string) {
  const { ArchetypeRegistry } = await import('./composer/archetypes.ts');
  const { composeRegion } = await import('./composer/region-composer.ts');
  const { loadWorldDDL } = await import('./composer/world-loader.ts');
  const { regionToCanvas } = await import('./pipeline/region-renderer.ts');
  const { saveSnapshot } = await import('./testing/visual-renderer.ts');

  const ddlRoot = join(ROOT, 'gen', 'ddl');
  const loaded = loadWorldDDL(ddlRoot);
  const registry = new ArchetypeRegistry(ROOT);

  const regions = target === 'all'
    ? loaded.world.regions
    : loaded.world.regions.filter((r) => r.id === target);

  if (regions.length === 0) {
    console.log(`Region '${target}' not found. Available: ${loaded.world.regions.map((r) => r.id).join(', ')}`);
    return;
  }

  const seed = 42;

  for (const region of regions) {
    console.log(`\n=== Building region: ${region.id} ===`);
    console.log(`Composing from DDL (${region.anchors.length} anchors)...`);

    // Step 1: DDL → RegionMap (collision grid, placed anchors, paths, NPCs, doors)
    const regionMap = await composeRegion(region, registry, { seed });
    console.log(`  Composed: ${regionMap.width}x${regionMap.height} tiles`);
    console.log(`  Anchors: ${regionMap.placedAnchors.length}`);
    console.log(`  Paths: ${regionMap.routedPaths.length}`);
    console.log(`  Doors: ${regionMap.doorTransitions.size}`);
    console.log(`  NPCs: ${regionMap.npcPositions.size}`);

    // Step 2: RegionMap → MapCanvas (semantic tiles on layers)
    const canvas = regionToCanvas(regionMap);
    console.log(`  Canvas: ${canvas.layerOrder.length} layers, ${canvas.visuals.length} visuals, ${canvas.objects.length} objects`);

    // Step 3: MapCanvas → TMX (via palette)
    try {
      const palette = await loadPalette('village-premium');
      const tmx = serializeToTmx(canvas, palette, region.id);
      mkdirSync(TMX_OUT, { recursive: true });
      writeFileSync(resolve(TMX_OUT, `${region.id}.tmx`), tmx, 'utf-8');
      console.log(`  TMX: ${region.id}.tmx`);
    } catch (err) {
      console.log(`  TMX: SKIPPED — palette error: ${(err as Error).message}`);
      console.log('  (TMX generation requires palette with tile GID mappings. Collision snapshots still generated.)');
    }

    // Step 4: Generate events file
    const eventsCode = generateEventsFile(region.id, canvas, 16);
    mkdirSync(EVENTS_OUT, { recursive: true });
    writeFileSync(resolve(EVENTS_OUT, `${region.id}-events.ts`), eventsCode, 'utf-8');
    console.log(`  Events: ${region.id}-events.ts`);

    // Step 5: Generate map class
    const mapClass = generateMapClass(region.id, 16);
    mkdirSync(MAP_CLASS_OUT, { recursive: true });
    writeFileSync(resolve(MAP_CLASS_OUT, `${region.id}.ts`), mapClass, 'utf-8');
    console.log(`  Map class: ${region.id}.ts`);

    // Step 6: Visual snapshot (always works — no palette needed)
    const overlays = [
      ...regionMap.placedAnchors.flatMap((a) =>
        a.entryAnchors.map((p) => ({
          position: p,
          color: 'entry' as const,
          size: 3,
        })),
      ),
      ...Array.from(regionMap.doorTransitions.values()).map((p) => ({
        position: p,
        color: 'door' as const,
        size: 2,
      })),
      ...Array.from(regionMap.npcPositions.values()).map((p) => ({
        position: p,
        color: 'npc' as const,
      })),
    ];

    const snapshotPath = saveSnapshot(regionMap.collisionGrid, 'region', region.id, { overlays });
    console.log(`  Snapshot: ${snapshotPath}`);
  }

  console.log(`\nBuilt ${regions.length} region(s) from DDL.`);
}

function printUsage() {
  console.log('Usage:');
  console.log(
    '  pnpm assemblage build [mapId|all]          Generate TMX + events from TS compositions',
  );
  console.log('  pnpm assemblage parse [act1|act2|act3|all] Parse act scripts → scene DDL JSON');
  console.log('  pnpm assemblage compile [mapId|all]        Compile scene DDL → TMX + events');
  console.log('  pnpm assemblage scenes [mapId|all]         List scenes per map');
  console.log('  pnpm assemblage preview [mapId]             ASCII rendering for quick check');
  console.log('  pnpm assemblage validate [mapId|all]        Check overlaps, gaps, missing hooks');
  console.log('  pnpm assemblage list                        List available TS compositions');
  console.log('  pnpm assemblage test [all|ddl|organisms|region|world]');
  console.log('                                              Run assemblage system tests');
  console.log('  pnpm assemblage snapshot [regionId|all]     Generate visual PNG snapshots');
  console.log('  pnpm assemblage build-region [regionId|all] DDL → compose → TMX + events (the real pipeline)');
}

// --- Helpers ---

async function loadMaps(target: string): Promise<MapComposition[]> {
  if (!existsSync(MAPS_DIR)) {
    console.log('No map compositions found. Create them in gen/assemblage/maps/');
    return [];
  }

  const files = readdirSync(MAPS_DIR).filter((f) => f.endsWith('.ts'));
  const maps: MapComposition[] = [];

  for (const file of files) {
    const id = basename(file, '.ts');
    if (target !== 'all' && target !== id) continue;

    const mod = await import(resolve(MAPS_DIR, file));
    const comp = mod.default ?? mod.composition ?? mod[Object.keys(mod)[0]];
    if (comp?.id) {
      maps.push(comp);
    } else {
      console.warn(`Warning: ${file} does not export a MapComposition`);
    }
  }

  if (maps.length === 0 && target !== 'all') {
    console.error(`Map '${target}' not found. Use 'pnpm assemblage list' to see available maps.`);
    process.exit(1);
  }

  return maps;
}

async function loadPalette(name: string): Promise<TilesetPalette> {
  const palettesDir = resolve(import.meta.dirname, 'tileset/palettes');
  const files = readdirSync(palettesDir).filter((f) => f.endsWith('.ts'));

  for (const file of files) {
    const mod = await import(resolve(palettesDir, file));
    for (const exp of Object.values(mod)) {
      const spec = exp as { name?: string };
      if (spec?.name === name) {
        return buildPalette(spec as any);
      }
    }
  }

  throw new Error(`Palette '${name}' not found. Available palette files: ${files.join(', ')}`);
}

function rectsOverlap(
  a: { x: number; y: number; assemblage: { width: number; height: number } },
  b: { x: number; y: number; assemblage: { width: number; height: number } },
): boolean {
  return !(
    a.x + a.assemblage.width <= b.x ||
    b.x + b.assemblage.width <= a.x ||
    a.y + a.assemblage.height <= b.y ||
    b.y + b.assemblage.height <= a.y
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
