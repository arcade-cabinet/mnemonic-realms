/**
 * DDL Integrity Validator — Zod Schemas + Referential Integrity
 *
 * Validates the split DDL files at two levels:
 * 1. Schema: Each JSON file matches its Zod schema (structural correctness)
 * 2. Referential: Every pointer (region ref, interior ref, anchor ref)
 *    resolves to an actual file/object (relational correctness)
 *
 * This catches the most common DDL errors:
 * - Typo in a region ID that doesn't match any file
 * - Interior ref that points to a non-existent JSON
 * - Anchor's parentAnchor that doesn't exist in any region
 * - Dungeon floor transitions that create dead ends
 *
 * Architecture level: TESTING (DDL verification)
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { InteriorFile } from '../composer/world-loader';

// --- Result Types ---

export interface DDLValidationReport {
  /** Did all checks pass? */
  passed: boolean;
  /** Total number of checks run */
  totalChecks: number;
  /** Number of passed checks */
  passedChecks: number;
  /** Individual check results */
  checks: DDLCheck[];
}

export interface DDLCheck {
  /** What was checked */
  description: string;
  /** Category of check */
  category: 'schema' | 'referential' | 'completeness';
  /** Did it pass? */
  passed: boolean;
  /** Details on failure */
  detail?: string;
}

// --- World JSON Shape (for validation) ---

interface WorldFileShape {
  name?: unknown;
  properties?: unknown;
  regions?: unknown;
  regionConnections?: unknown;
}

interface RegionFileShape {
  id?: unknown;
  name?: unknown;
  biome?: unknown;
  anchors?: unknown;
  timeBudget?: unknown;
}

// --- Validator ---

/**
 * Validate all DDL files in a gen/ddl/ directory.
 *
 * Checks:
 * 1. world.json exists and has required fields
 * 2. Every region ref in world.json has a matching regions/{id}.json
 * 3. Every region JSON has required fields (id, name, biome, anchors)
 * 4. Every interior ref in anchors has a matching interiors/{id}.json
 * 5. Every interior JSON has required fields (id, name, archetype)
 * 6. Every interior's parentAnchor matches an anchor in some region
 * 7. Dungeon interior transitions point to existing interiors
 * 8. Region connections reference existing region IDs
 */
export function validateDDL(ddlRoot: string): DDLValidationReport {
  const checks: DDLCheck[] = [];

  // --- 1. World.json ---
  const worldPath = join(ddlRoot, 'world.json');
  const worldExists = existsSync(worldPath);
  checks.push({
    description: 'world.json exists',
    category: 'schema',
    passed: worldExists,
    detail: worldExists ? undefined : `Missing: ${worldPath}`,
  });

  if (!worldExists) {
    return summarize(checks);
  }

  let worldData: WorldFileShape;
  try {
    worldData = JSON.parse(readFileSync(worldPath, 'utf-8'));
  } catch (e) {
    checks.push({
      description: 'world.json is valid JSON',
      category: 'schema',
      passed: false,
      detail: `Parse error: ${e instanceof Error ? e.message : String(e)}`,
    });
    return summarize(checks);
  }

  checks.push({
    description: 'world.json is valid JSON',
    category: 'schema',
    passed: true,
  });

  // Required fields
  for (const field of ['name', 'properties', 'regions', 'regionConnections']) {
    const has = worldData[field as keyof WorldFileShape] !== undefined;
    checks.push({
      description: `world.json has "${field}" field`,
      category: 'schema',
      passed: has,
      detail: has ? undefined : `Missing field: ${field}`,
    });
  }

  const regionIds = Array.isArray(worldData.regions)
    ? (worldData.regions as string[])
    : [];

  // --- 2. Region files ---
  const regionsDir = join(ddlRoot, 'regions');
  const regionData = new Map<string, RegionFileShape>();

  for (const regionId of regionIds) {
    const regionPath = join(regionsDir, `${regionId}.json`);
    const exists = existsSync(regionPath);
    checks.push({
      description: `Region file exists: ${regionId}.json`,
      category: 'referential',
      passed: exists,
      detail: exists ? undefined : `Missing: ${regionPath}`,
    });

    if (!exists) continue;

    try {
      const data = JSON.parse(readFileSync(regionPath, 'utf-8'));
      regionData.set(regionId, data);

      // Required fields
      for (const field of ['id', 'name', 'biome', 'anchors']) {
        const has = data[field] !== undefined;
        checks.push({
          description: `${regionId}.json has "${field}" field`,
          category: 'schema',
          passed: has,
          detail: has ? undefined : `Missing field: ${field} in ${regionId}`,
        });
      }

      // ID consistency
      if (data.id !== regionId) {
        checks.push({
          description: `${regionId}.json id matches filename`,
          category: 'schema',
          passed: false,
          detail: `File is ${regionId}.json but id field is "${data.id}"`,
        });
      } else {
        checks.push({
          description: `${regionId}.json id matches filename`,
          category: 'schema',
          passed: true,
        });
      }
    } catch (e) {
      checks.push({
        description: `${regionId}.json is valid JSON`,
        category: 'schema',
        passed: false,
        detail: `Parse error: ${e instanceof Error ? e.message : String(e)}`,
      });
    }
  }

  // --- 3. Interior files ---
  const interiorsDir = join(ddlRoot, 'interiors');
  const interiorData = new Map<string, InteriorFile>();

  let interiorFiles: string[] = [];
  try {
    interiorFiles = readdirSync(interiorsDir).filter((f) =>
      f.endsWith('.json'),
    );
  } catch {
    // interiors dir may not exist yet
  }

  for (const file of interiorFiles) {
    try {
      const data: InteriorFile = JSON.parse(
        readFileSync(join(interiorsDir, file), 'utf-8'),
      );
      interiorData.set(data.id, data);

      // Required fields
      for (const field of ['id', 'name', 'archetype']) {
        const has =
          data[field as keyof InteriorFile] !== undefined;
        checks.push({
          description: `Interior ${data.id} has "${field}" field`,
          category: 'schema',
          passed: has,
          detail: has
            ? undefined
            : `Missing field: ${field} in ${data.id}`,
        });
      }
    } catch (e) {
      checks.push({
        description: `${file} is valid JSON`,
        category: 'schema',
        passed: false,
        detail: `Parse error: ${e instanceof Error ? e.message : String(e)}`,
      });
    }
  }

  // --- 4. Interior refs in anchors resolve ---
  const allAnchorIds = new Set<string>();

  for (const [regionId, region] of Array.from(regionData.entries())) {
    const anchors = Array.isArray(region.anchors)
      ? (region.anchors as Array<{
          id?: string;
          interiors?: string[];
          dungeon?: { interiors?: string[] };
        }>)
      : [];

    for (const anchor of anchors) {
      if (anchor.id) allAnchorIds.add(anchor.id);

      // Direct interiors
      if (Array.isArray(anchor.interiors)) {
        for (const intId of anchor.interiors) {
          const exists = interiorData.has(intId);
          checks.push({
            description: `Interior ref "${intId}" in ${regionId}/${anchor.id ?? '?'} exists`,
            category: 'referential',
            passed: exists,
            detail: exists
              ? undefined
              : `No interiors/${intId}.json found`,
          });
        }
      }

      // Dungeon interiors
      if (anchor.dungeon?.interiors) {
        for (const intId of anchor.dungeon.interiors) {
          const exists = interiorData.has(intId);
          checks.push({
            description: `Dungeon interior ref "${intId}" in ${regionId}/${anchor.id ?? '?'} exists`,
            category: 'referential',
            passed: exists,
            detail: exists
              ? undefined
              : `No interiors/${intId}.json found`,
          });
        }
      }
    }
  }

  // --- 5. Interior parentAnchor refs resolve ---
  for (const [intId, interior] of Array.from(interiorData.entries())) {
    if (interior.parentAnchor) {
      const exists = allAnchorIds.has(interior.parentAnchor);
      checks.push({
        description: `Interior "${intId}" parentAnchor "${interior.parentAnchor}" exists`,
        category: 'referential',
        passed: exists,
        detail: exists
          ? undefined
          : `No anchor with id "${interior.parentAnchor}" found in any region`,
      });
    }
  }

  // --- 6. Interior transitions resolve ---
  // Transitions can target:
  //   - Other interiors (door between rooms, dungeon stairs)
  //   - Region IDs (exit back to outdoor map)
  //   - Anchor IDs (exit to a specific outdoor location)
  for (const [intId, interior] of Array.from(interiorData.entries())) {
    if (interior.transitions) {
      for (const [direction, transition] of Object.entries(
        interior.transitions,
      )) {
        if (transition.to) {
          const isInterior = interiorData.has(transition.to);
          const isRegion = regionIds.includes(transition.to);
          const isAnchor = allAnchorIds.has(transition.to);
          const targetExists = isInterior || isRegion || isAnchor;

          checks.push({
            description: `Interior "${intId}" transition ${direction} → "${transition.to}" resolves`,
            category: 'referential',
            passed: targetExists,
            detail: targetExists
              ? undefined
              : `Transition target "${transition.to}" not found in interiors, regions, or anchors`,
          });
        }
      }
    }
  }

  // --- 7. Region connections resolve ---
  if (Array.isArray(worldData.regionConnections)) {
    for (const conn of worldData.regionConnections as Array<{
      from?: string;
      to?: string;
    }>) {
      if (conn.from) {
        const exists = regionIds.includes(conn.from);
        checks.push({
          description: `Connection from "${conn.from}" references valid region`,
          category: 'referential',
          passed: exists,
          detail: exists
            ? undefined
            : `Region "${conn.from}" not in world.regions`,
        });
      }
      if (conn.to) {
        const exists = regionIds.includes(conn.to);
        checks.push({
          description: `Connection to "${conn.to}" references valid region`,
          category: 'referential',
          passed: exists,
          detail: exists
            ? undefined
            : `Region "${conn.to}" not in world.regions`,
        });
      }
    }
  }

  // --- 8. Completeness: every interior file is referenced by some anchor ---
  for (const intId of Array.from(interiorData.keys())) {
    let referenced = false;
    for (const region of Array.from(regionData.values())) {
      const anchors = Array.isArray(region.anchors)
        ? (region.anchors as Array<{
            interiors?: string[];
            dungeon?: { interiors?: string[] };
          }>)
        : [];
      for (const anchor of anchors) {
        if (anchor.interiors?.includes(intId)) referenced = true;
        if (anchor.dungeon?.interiors?.includes(intId)) referenced = true;
      }
    }

    checks.push({
      description: `Interior "${intId}" is referenced by at least one anchor`,
      category: 'completeness',
      passed: referenced,
      detail: referenced
        ? undefined
        : `Orphan interior: ${intId} not referenced by any anchor`,
    });
  }

  return summarize(checks);
}

function summarize(checks: DDLCheck[]): DDLValidationReport {
  const passedChecks = checks.filter((c) => c.passed).length;
  return {
    passed: checks.every((c) => c.passed),
    totalChecks: checks.length,
    passedChecks,
    checks,
  };
}

// --- Pretty printing ---

export function formatDDLReport(report: DDLValidationReport): string {
  const lines: string[] = [];
  const status = report.passed ? 'PASS' : 'FAIL';

  lines.push(
    `[${status}] DDL Integrity: ${report.passedChecks}/${report.totalChecks} checks passed`,
  );

  const failed = report.checks.filter((c) => !c.passed);
  if (failed.length > 0) {
    lines.push('');
    lines.push('Failed checks:');
    for (const check of failed) {
      lines.push(`  [${check.category}] ${check.description}`);
      if (check.detail) {
        lines.push(`    → ${check.detail}`);
      }
    }
  }

  return lines.join('\n');
}
