/**
 * DDL Integrity Validator — Zod Schemas + Referential Integrity
 *
 * Validates the split DDL files at two levels:
 * 1. Schema: Each JSON file matches its expected shape (structural correctness)
 * 2. Referential: Every pointer (region ref, world instance ref, anchor ref)
 *    resolves to an actual file/object (relational correctness)
 *
 * This catches the most common DDL errors:
 * - Typo in a region ID that doesn't match any file
 * - WorldSlot instanceId that points to a non-existent world instance
 * - World instance's parentAnchor that doesn't exist in any region
 * - World instance's templateId that doesn't match any template
 * - Region connections that reference non-existent regions
 *
 * Architecture level: TESTING (DDL verification)
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { WorldInstance, WorldTemplate } from '../composer/world-template';

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
 * 4. Every worldSlot instanceId in anchors has a matching worlds/{id}.json
 * 5. Every world instance has required fields (id, name, templateId, parentAnchor)
 * 6. Every world instance's templateId matches a template in templates/
 * 7. Every world instance's parentAnchor matches an anchor in some region
 * 8. Region connections reference existing region IDs
 * 9. Every world instance file is referenced by some anchor's worldSlots
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

  const regionIds = Array.isArray(worldData.regions) ? (worldData.regions as string[]) : [];

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

  // --- 3. World instance files ---
  const worldsDir = join(ddlRoot, 'worlds');
  const worldInstanceData = new Map<string, WorldInstance>();

  let worldFiles: string[] = [];
  try {
    worldFiles = readdirSync(worldsDir).filter((f) => f.endsWith('.json'));
  } catch {
    // worlds dir may not exist yet
  }

  for (const file of worldFiles) {
    try {
      const data: WorldInstance = JSON.parse(readFileSync(join(worldsDir, file), 'utf-8'));
      worldInstanceData.set(data.id, data);

      // Required fields
      for (const field of ['id', 'name', 'templateId', 'parentAnchor']) {
        const has = data[field as keyof WorldInstance] !== undefined;
        checks.push({
          description: `World instance ${data.id} has "${field}" field`,
          category: 'schema',
          passed: has,
          detail: has ? undefined : `Missing field: ${field} in ${data.id}`,
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

  // --- 4. Template files ---
  const templatesDir = join(ddlRoot, 'templates');
  const templateData = new Map<string, WorldTemplate>();

  let templateFiles: string[] = [];
  try {
    templateFiles = readdirSync(templatesDir).filter((f) => f.endsWith('.json'));
  } catch {
    // templates dir may not exist yet
  }

  for (const file of templateFiles) {
    try {
      const data: WorldTemplate = JSON.parse(readFileSync(join(templatesDir, file), 'utf-8'));
      templateData.set(data.id, data);
    } catch (e) {
      checks.push({
        description: `Template ${file} is valid JSON`,
        category: 'schema',
        passed: false,
        detail: `Parse error: ${e instanceof Error ? e.message : String(e)}`,
      });
    }
  }

  // --- 5. WorldSlot refs in anchors resolve to world instances ---
  const allAnchorIds = new Set<string>();

  for (const [regionId, region] of Array.from(regionData.entries())) {
    const anchors = Array.isArray(region.anchors)
      ? (region.anchors as Array<{
          id?: string;
          worldSlots?: Array<{ instanceId: string; transitionType: string }>;
          dungeon?: { worldSlots?: Array<{ instanceId: string; transitionType: string }> };
        }>)
      : [];

    for (const anchor of anchors) {
      if (anchor.id) allAnchorIds.add(anchor.id);

      // Direct world slots
      if (Array.isArray(anchor.worldSlots)) {
        for (const slot of anchor.worldSlots) {
          const exists = worldInstanceData.has(slot.instanceId);
          checks.push({
            description: `World slot "${slot.instanceId}" in ${regionId}/${anchor.id ?? '?'} exists`,
            category: 'referential',
            passed: exists,
            detail: exists ? undefined : `No worlds/${slot.instanceId}.json found`,
          });
        }
      }

      // Dungeon world slots
      if (anchor.dungeon?.worldSlots) {
        for (const slot of anchor.dungeon.worldSlots) {
          const exists = worldInstanceData.has(slot.instanceId);
          checks.push({
            description: `Dungeon world slot "${slot.instanceId}" in ${regionId}/${anchor.id ?? '?'} exists`,
            category: 'referential',
            passed: exists,
            detail: exists ? undefined : `No worlds/${slot.instanceId}.json found`,
          });
        }
      }
    }
  }

  // --- 6. World instance parentAnchor refs resolve ---
  for (const [instId, instance] of Array.from(worldInstanceData.entries())) {
    if (instance.parentAnchor) {
      const exists = allAnchorIds.has(instance.parentAnchor);
      checks.push({
        description: `World instance "${instId}" parentAnchor "${instance.parentAnchor}" exists`,
        category: 'referential',
        passed: exists,
        detail: exists
          ? undefined
          : `No anchor with id "${instance.parentAnchor}" found in any region`,
      });
    }
  }

  // --- 7. World instance templateId refs resolve ---
  for (const [instId, instance] of Array.from(worldInstanceData.entries())) {
    if (instance.templateId) {
      const exists = templateData.has(instance.templateId);
      checks.push({
        description: `World instance "${instId}" templateId "${instance.templateId}" resolves`,
        category: 'referential',
        passed: exists,
        detail: exists ? undefined : `No templates/${instance.templateId}.json found`,
      });
    }
  }

  // --- 8. Region connections resolve ---
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
          detail: exists ? undefined : `Region "${conn.from}" not in world.regions`,
        });
      }
      if (conn.to) {
        const exists = regionIds.includes(conn.to);
        checks.push({
          description: `Connection to "${conn.to}" references valid region`,
          category: 'referential',
          passed: exists,
          detail: exists ? undefined : `Region "${conn.to}" not in world.regions`,
        });
      }
    }
  }

  // --- 9. Completeness: every world instance file is referenced by some anchor ---
  // A world instance is "referenced" if:
  //   (a) Some anchor's worldSlots or dungeon.worldSlots points to it, OR
  //   (b) Its parentAnchor matches an anchor ID (it's the anchor's own world, e.g., a dungeon)
  for (const instId of Array.from(worldInstanceData.keys())) {
    let referenced = false;
    const instance = worldInstanceData.get(instId)!;

    // Check if parentAnchor links to a known anchor
    if (instance.parentAnchor && allAnchorIds.has(instance.parentAnchor)) {
      referenced = true;
    }

    for (const region of Array.from(regionData.values())) {
      const anchors = Array.isArray(region.anchors)
        ? (region.anchors as Array<{
            worldSlots?: Array<{ instanceId: string }>;
            dungeon?: { worldSlots?: Array<{ instanceId: string }> };
          }>)
        : [];
      for (const anchor of anchors) {
        if (anchor.worldSlots?.some((s) => s.instanceId === instId)) referenced = true;
        if (anchor.dungeon?.worldSlots?.some((s) => s.instanceId === instId)) referenced = true;
      }
    }

    checks.push({
      description: `World instance "${instId}" is referenced by at least one anchor`,
      category: 'completeness',
      passed: referenced,
      detail: referenced
        ? undefined
        : `Orphan world instance: ${instId} not referenced by any anchor's worldSlots`,
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
