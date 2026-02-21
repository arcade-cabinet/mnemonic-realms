import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { RuntimeMapData } from '../../gen/assemblage/pipeline/runtime-types.js';
import type { Issue, ValidationReport } from './types.js';
import { logger } from './logger.js';

const MAPS_DIR = 'data/maps';

export class MapValidator {
  async validateAllMaps(): Promise<ValidationReport> {
    const startTime = Date.now();
    logger.info('Starting map validation...');

    if (!existsSync(MAPS_DIR)) {
      logger.warn(`Maps directory not found: ${MAPS_DIR}`);
      return emptyReport(Date.now() - startTime);
    }

    const mapFiles = readdirSync(MAPS_DIR).filter((f) => f.endsWith('.json'));
    const allIssues: Issue[] = [];
    let totalChecks = 0;

    // Load all maps for cross-referencing transitions
    const maps = new Map<string, { data: RuntimeMapData; file: string }>();
    for (const file of mapFiles) {
      const filePath = join(MAPS_DIR, file);
      try {
        const raw = readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw) as RuntimeMapData;
        const mapId = data.id ?? file.replace('.json', '');
        maps.set(mapId, { data, file: filePath });
      } catch (err) {
        allIssues.push({
          id: `parse-${file}`,
          severity: 'error',
          category: 'parse',
          description: `Failed to parse map JSON: ${file}`,
          location: { file: filePath },
          suggestion: 'Regenerate with pnpm generate:content',
        });
      }
    }

    for (const [mapId, { data, file }] of maps) {
      const issues = this.validateMap(mapId, data, file, maps);
      allIssues.push(...issues);
      totalChecks += 1;
    }

    const errors = allIssues.filter((i) => i.severity === 'error').length;
    const warnings = allIssues.filter((i) => i.severity === 'warning').length;
    const duration = Date.now() - startTime;

    logger.info(`Map validation complete. ${totalChecks} maps, ${errors} errors, ${warnings} warnings in ${duration}ms`);

    return {
      reportType: 'map',
      timestamp: new Date().toISOString(),
      summary: {
        totalChecks,
        passed: totalChecks - errors,
        failed: errors,
        warnings,
      },
      issues: allIssues,
      metadata: {
        validator: 'MapValidator',
        version: '2.0.0',
        duration,
      },
    };
  }

  private validateMap(
    mapId: string,
    data: RuntimeMapData,
    file: string,
    allMaps: Map<string, { data: RuntimeMapData; file: string }>,
  ): Issue[] {
    const issues: Issue[] = [];

    issues.push(...this.validateCollision(mapId, data, file));
    issues.push(...this.validateBoundaries(mapId, data, file));
    issues.push(...this.validateSpawnPoints(mapId, data, file));
    issues.push(...this.validateTransitions(mapId, data, file, allMaps));
    issues.push(...this.validateVibrancyAreas(mapId, data, file));

    return issues;
  }

  /** Collision grid must match width * height and contain only 0 | 1. */
  private validateCollision(mapId: string, data: RuntimeMapData, file: string): Issue[] {
    const issues: Issue[] = [];
    const expected = data.width * data.height;

    if (data.collision.length !== expected) {
      issues.push({
        id: `${mapId}-collision-size`,
        severity: 'error',
        category: 'collision',
        description: `Collision grid length ${data.collision.length} does not match width*height (${expected})`,
        location: { file },
        expected,
        actual: data.collision.length,
      });
    }

    for (let i = 0; i < data.collision.length; i++) {
      const v = data.collision[i];
      if (v !== 0 && v !== 1) {
        issues.push({
          id: `${mapId}-collision-value-${i}`,
          severity: 'error',
          category: 'collision',
          description: `Invalid collision value ${v} at index ${i} (expected 0 or 1)`,
          location: { file, coordinates: { x: i % data.width, y: Math.floor(i / data.width) } },
        });
        break; // report only the first bad value to avoid flooding
      }
    }

    return issues;
  }

  /** Map edges should be blocked unless a transition exists there. */
  private validateBoundaries(mapId: string, data: RuntimeMapData, file: string): Issue[] {
    const issues: Issue[] = [];
    const { width, height, collision, transitions } = data;

    // Build a set of edge tiles covered by transitions
    const transitionEdgeTiles = new Set<string>();
    for (const t of transitions) {
      for (let dx = 0; dx < t.width; dx++) {
        for (let dy = 0; dy < t.height; dy++) {
          transitionEdgeTiles.add(`${t.x + dx},${t.y + dy}`);
        }
      }
    }

    const checkEdge = (x: number, y: number, edge: string) => {
      const idx = y * width + x;
      if (idx < collision.length && collision[idx] === 0 && !transitionEdgeTiles.has(`${x},${y}`)) {
        issues.push({
          id: `${mapId}-boundary-${x}-${y}`,
          severity: 'warning',
          category: 'boundary',
          description: `${edge} edge tile (${x}, ${y}) is walkable with no transition`,
          location: { file, coordinates: { x, y } },
          suggestion: 'Add collision or a transition zone at this edge tile',
        });
      }
    };

    for (let x = 0; x < width; x++) {
      checkEdge(x, 0, 'Top');
      checkEdge(x, height - 1, 'Bottom');
    }
    for (let y = 1; y < height - 1; y++) {
      checkEdge(0, y, 'Left');
      checkEdge(width - 1, y, 'Right');
    }

    return issues;
  }

  /** Every map should have at least one spawn point. */
  private validateSpawnPoints(mapId: string, data: RuntimeMapData, file: string): Issue[] {
    const issues: Issue[] = [];

    if (data.spawnPoints.length === 0) {
      issues.push({
        id: `${mapId}-no-spawn`,
        severity: 'error',
        category: 'spawn',
        description: `Map "${mapId}" has no spawn points`,
        location: { file },
        suggestion: 'Add at least one spawn point (e.g., player-spawn)',
      });
    }

    for (const sp of data.spawnPoints) {
      if (sp.x < 0 || sp.x >= data.width || sp.y < 0 || sp.y >= data.height) {
        issues.push({
          id: `${mapId}-spawn-oob-${sp.id}`,
          severity: 'error',
          category: 'spawn',
          description: `Spawn "${sp.id}" at (${sp.x}, ${sp.y}) is outside map bounds (${data.width}x${data.height})`,
          location: { file, coordinates: { x: sp.x, y: sp.y } },
        });
      }

      const idx = sp.y * data.width + sp.x;
      if (idx >= 0 && idx < data.collision.length && data.collision[idx] === 1) {
        issues.push({
          id: `${mapId}-spawn-blocked-${sp.id}`,
          severity: 'error',
          category: 'spawn',
          description: `Spawn "${sp.id}" at (${sp.x}, ${sp.y}) is on a blocked collision tile`,
          location: { file, coordinates: { x: sp.x, y: sp.y } },
          suggestion: 'Move spawn to a passable tile or clear collision at this position',
        });
      }
    }

    return issues;
  }

  /** Transition targets should reference existing maps. */
  private validateTransitions(
    mapId: string,
    data: RuntimeMapData,
    file: string,
    allMaps: Map<string, { data: RuntimeMapData; file: string }>,
  ): Issue[] {
    const issues: Issue[] = [];

    for (const t of data.transitions) {
      // Check target map exists
      if (!allMaps.has(t.target)) {
        issues.push({
          id: `${mapId}-transition-target-${t.id}`,
          severity: 'warning',
          category: 'transition',
          description: `Transition "${t.id}" targets map "${t.target}" which is not in data/maps/`,
          location: { file, coordinates: { x: t.x, y: t.y } },
          suggestion: 'Generate the target map or fix the transition target ID',
        });
      }

      // Check transition is within map bounds
      if (t.x < 0 || t.y < 0 || t.x + t.width > data.width || t.y + t.height > data.height) {
        issues.push({
          id: `${mapId}-transition-oob-${t.id}`,
          severity: 'error',
          category: 'transition',
          description: `Transition "${t.id}" extends outside map bounds`,
          location: { file, coordinates: { x: t.x, y: t.y } },
        });
      }
    }

    return issues;
  }

  /** Vibrancy areas must be within bounds and have valid initial state. */
  private validateVibrancyAreas(mapId: string, data: RuntimeMapData, file: string): Issue[] {
    const issues: Issue[] = [];
    const validStates = new Set(['forgotten', 'partial', 'remembered']);

    for (const area of data.vibrancyAreas) {
      if (!validStates.has(area.initialState)) {
        issues.push({
          id: `${mapId}-vibrancy-state-${area.id}`,
          severity: 'error',
          category: 'vibrancy',
          description: `Vibrancy area "${area.id}" has invalid state "${area.initialState}"`,
          location: { file },
          expected: 'forgotten | partial | remembered',
          actual: area.initialState,
        });
      }

      if (
        area.x < 0 ||
        area.y < 0 ||
        area.x + area.width > data.width ||
        area.y + area.height > data.height
      ) {
        issues.push({
          id: `${mapId}-vibrancy-oob-${area.id}`,
          severity: 'error',
          category: 'vibrancy',
          description: `Vibrancy area "${area.id}" extends outside map bounds`,
          location: { file, coordinates: { x: area.x, y: area.y } },
        });
      }
    }

    return issues;
  }
}

function emptyReport(duration: number): ValidationReport {
  return {
    reportType: 'map',
    timestamp: new Date().toISOString(),
    summary: { totalChecks: 0, passed: 0, failed: 0, warnings: 0 },
    issues: [],
    metadata: { validator: 'MapValidator', version: '2.0.0', duration },
  };
}
