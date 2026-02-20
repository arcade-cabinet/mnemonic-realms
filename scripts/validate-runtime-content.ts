#!/usr/bin/env tsx
/**
 * Runtime Content Validator — checks data/maps/*.json + data/encounters/*.json
 *
 * Validates that all generated runtime JSON conforms to the expected structure
 * and cross-references are consistent.
 *
 * Usage: pnpm validate:content
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { RuntimeMapData } from '../gen/assemblage/pipeline/runtime-types.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const MAPS_DIR = path.join(DATA_DIR, 'maps');
const ENCOUNTERS_DIR = path.join(DATA_DIR, 'encounters');

interface ValidationError {
  file: string;
  field: string;
  message: string;
}

const errors: ValidationError[] = [];
const warnings: string[] = [];

function addError(file: string, field: string, message: string): void {
  errors.push({ file, field, message });
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

function validateMap(filePath: string, mapIds: Set<string>): void {
  const fileName = path.basename(filePath);
  let data: RuntimeMapData;
  try {
    data = readJson<RuntimeMapData>(filePath);
  } catch {
    addError(fileName, 'parse', 'Failed to parse JSON');
    return;
  }

  if (!data.id) addError(fileName, 'id', 'Missing map id');
  if (!data.width || data.width <= 0) addError(fileName, 'width', 'Invalid width');
  if (!data.height || data.height <= 0) addError(fileName, 'height', 'Invalid height');
  if (data.tileWidth !== 16) addError(fileName, 'tileWidth', `Expected 16, got ${data.tileWidth}`);
  if (data.tileHeight !== 16) {
    addError(fileName, 'tileHeight', `Expected 16, got ${data.tileHeight}`);
  }
  if (!data.layerOrder || data.layerOrder.length === 0) {
    addError(fileName, 'layerOrder', 'Missing or empty layerOrder');
  }
  if (data.layers) {
    const expectedSize = data.width * data.height;
    for (const layerName of data.layerOrder ?? []) {
      const layer = data.layers[layerName];
      if (!layer) {
        addError(fileName, `layers.${layerName}`, 'Layer missing from layers record');
      } else if (layer.length !== expectedSize) {
        addError(fileName, `layers.${layerName}`, `Expected ${expectedSize} tiles, got ${layer.length}`);
      }
    }
  } else {
    addError(fileName, 'layers', 'Missing layers');
  }
  if (data.collision) {
    const expectedSize = data.width * data.height;
    if (data.collision.length !== expectedSize) {
      addError(fileName, 'collision', `Expected ${expectedSize} entries, got ${data.collision.length}`);
    }
    for (let i = 0; i < data.collision.length; i++) {
      if (data.collision[i] !== 0 && data.collision[i] !== 1) {
        addError(fileName, `collision[${i}]`, `Invalid value: ${data.collision[i]}`);
        break;
      }
    }
  } else {
    addError(fileName, 'collision', 'Missing collision array');
  }
  if (!data.spawnPoints || data.spawnPoints.length === 0) {
    addError(fileName, 'spawnPoints', 'No spawn points defined');
  }
  if (!data.vibrancyAreas || data.vibrancyAreas.length === 0) {
    addError(fileName, 'vibrancyAreas', 'No vibrancy areas defined');
  } else {
    for (const area of data.vibrancyAreas) {
      const validStates = ['forgotten', 'partial', 'remembered'];
      if (!validStates.includes(area.initialState)) {
        addError(fileName, `vibrancyAreas.${area.id}`, `Invalid state: ${area.initialState}`);
      }
    }
  }
  if (data.transitions) {
    for (const t of data.transitions) {
      if (!mapIds.has(t.target)) {
        warnings.push(`${fileName}: transition ${t.id} targets unknown map '${t.target}'`);
      }
    }
  }
  if (data.id) mapIds.add(data.id);
}

// ── Encounter Validation ────────────────────────────────────────────────────

interface EncounterFile {
  encounters: Array<{
    id: string;
    name: string;
    type: string;
    enemies: Array<{ enemyId: string; count: number; position: string }>;
    rewards: { xp: number; gold: number };
    escapeAllowed: boolean;
  }>;
  pools?: Array<{
    regionId: string;
    encounters: string[];
    stepsBetween: number;
    levelRange: [number, number];
  }>;
}

function validateEncounterFile(filePath: string): void {
  const fileName = path.basename(filePath);
  let data: EncounterFile;
  try {
    data = readJson<EncounterFile>(filePath);
  } catch {
    addError(fileName, 'parse', 'Failed to parse JSON');
    return;
  }
  if (!data.encounters || !Array.isArray(data.encounters)) {
    addError(fileName, 'encounters', 'Missing or invalid encounters array');
    return;
  }
  const encIds = new Set<string>();
  for (const enc of data.encounters) {
    if (!enc.id) addError(fileName, 'encounter.id', 'Missing encounter id');
    if (!enc.name) addError(fileName, 'encounter.name', 'Missing encounter name');
    if (!enc.enemies || enc.enemies.length === 0) {
      addError(fileName, `encounter.${enc.id}.enemies`, 'No enemies defined');
    }
    if (!enc.rewards) addError(fileName, `encounter.${enc.id}.rewards`, 'Missing rewards');
    if (typeof enc.escapeAllowed !== 'boolean') {
      addError(fileName, `encounter.${enc.id}.escapeAllowed`, 'Missing escapeAllowed');
    }
    encIds.add(enc.id);
  }
  if (data.pools) {
    for (const pool of data.pools) {
      if (!pool.regionId) addError(fileName, 'pool.regionId', 'Missing regionId');
      if (!pool.encounters || pool.encounters.length === 0) {
        addError(fileName, `pool.${pool.regionId}`, 'Empty encounter pool');
      }
      for (const encId of pool.encounters ?? []) {
        if (!encIds.has(encId)) {
          addError(fileName, `pool.${pool.regionId}`, `References unknown encounter '${encId}'`);
        }
      }
    }
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

function main(): void {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  Runtime Content Validator                                  ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(DATA_DIR)) {
    console.error('  ERROR: data/ directory does not exist. Run generate:content first.');
    process.exit(1);
  }

  const mapIds = new Set<string>();
  if (fs.existsSync(MAPS_DIR)) {
    const mapFiles = fs.readdirSync(MAPS_DIR).filter((f) => f.endsWith('.json'));
    console.log(`  Validating ${mapFiles.length} map files...`);
    for (const file of mapFiles) {
      validateMap(path.join(MAPS_DIR, file), mapIds);
    }
  } else {
    console.log('  WARNING: data/maps/ does not exist');
  }
  if (fs.existsSync(ENCOUNTERS_DIR)) {
    const encFiles = fs.readdirSync(ENCOUNTERS_DIR).filter((f) => f.endsWith('.json'));
    console.log(`  Validating ${encFiles.length} encounter files...`);
    for (const file of encFiles) {
      validateEncounterFile(path.join(ENCOUNTERS_DIR, file));
    }
  } else {
    console.log('  WARNING: data/encounters/ does not exist');
  }

  console.log('');
  if (warnings.length > 0) {
    console.log(`  ⚠ ${warnings.length} warnings:`);
    for (const w of warnings) console.log(`    - ${w}`);
    console.log('');
  }
  if (errors.length > 0) {
    console.log(`  ✗ ${errors.length} errors:`);
    for (const e of errors) console.log(`    [${e.file}] ${e.field}: ${e.message}`);
    console.log('');
    process.exit(1);
  }
  console.log(`  ✓ All ${mapIds.size} maps and encounter files are valid\n`);
}

main();

