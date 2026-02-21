import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { RuntimeMapData } from '../../gen/assemblage/pipeline/runtime-types.js';
import type { Issue, ValidationReport } from './types.js';
import { logger } from './logger.js';

const MAPS_DIR = 'data/maps';
const NPC_NAMED_PATH = 'gen/ddl/npcs/named.json';
const NPC_TEMPLATES_PATH = 'gen/ddl/npcs/templates.json';

interface NamedNpc {
  id: string;
  name: string;
  type: 'named';
  sprite?: string;
  spriteId?: string;
}

interface NpcTemplate {
  id: string;
  name: string;
  type: 'template';
  spriteRef?: string;
  spritePool?: string[];
}

export class NPCValidator {
  validate(): ValidationReport {
    const startTime = Date.now();
    logger.info('Starting NPC validation...');

    const allIssues: Issue[] = [];
    let totalChecks = 0;

    // Load NPC DDL data
    const namedNpcs = this.loadJson<NamedNpc[]>(NPC_NAMED_PATH, allIssues);
    const npcTemplates = this.loadJson<NpcTemplate[]>(NPC_TEMPLATES_PATH, allIssues);

    // Build lookup of known NPC IDs
    const knownNpcIds = new Set<string>();
    if (namedNpcs) {
      for (const npc of namedNpcs) {
        knownNpcIds.add(npc.id);
      }
    }
    if (npcTemplates) {
      for (const tpl of npcTemplates) {
        knownNpcIds.add(tpl.id);
      }
    }

    // Validate NPC DDL entries
    if (namedNpcs) {
      allIssues.push(...this.validateNamedNpcs(namedNpcs));
      totalChecks += namedNpcs.length;
    }
    if (npcTemplates) {
      allIssues.push(...this.validateTemplates(npcTemplates, namedNpcs ?? []));
      totalChecks += npcTemplates.length;
    }

    // Cross-reference NPCs in map objects
    if (existsSync(MAPS_DIR)) {
      const mapFiles = readdirSync(MAPS_DIR).filter((f) => f.endsWith('.json'));
      for (const file of mapFiles) {
        const filePath = join(MAPS_DIR, file);
        try {
          const data = JSON.parse(readFileSync(filePath, 'utf-8')) as RuntimeMapData;
          const mapId = data.id ?? file.replace('.json', '');
          allIssues.push(...this.validateMapNpcObjects(mapId, data, filePath, knownNpcIds));
          totalChecks += 1;
        } catch {
          allIssues.push({
            id: `parse-${file}`,
            severity: 'error',
            category: 'parse',
            description: `Failed to parse map JSON: ${file}`,
            location: { file: filePath },
          });
        }
      }
    } else {
      allIssues.push({
        id: 'no-maps-dir',
        severity: 'warning',
        category: 'missing-data',
        description: `Maps directory not found: ${MAPS_DIR}`,
        location: { file: MAPS_DIR },
        suggestion: 'Run pnpm generate:content to generate runtime maps',
      });
    }

    const errors = allIssues.filter((i) => i.severity === 'error').length;
    const warnings = allIssues.filter((i) => i.severity === 'warning').length;
    const duration = Date.now() - startTime;

    logger.info(`NPC validation complete. ${totalChecks} checks, ${errors} errors, ${warnings} warnings in ${duration}ms`);

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
        validator: 'NPCValidator',
        version: '2.0.0',
        duration,
      },
    };
  }

  /** Named NPCs must have id, name, and sprite info. */
  private validateNamedNpcs(npcs: NamedNpc[]): Issue[] {
    const issues: Issue[] = [];
    const ids = new Set<string>();

    for (const npc of npcs) {
      if (ids.has(npc.id)) {
        issues.push({
          id: `npc-dup-${npc.id}`,
          severity: 'error',
          category: 'npc-ddl',
          description: `Duplicate named NPC ID: "${npc.id}"`,
          location: { file: NPC_NAMED_PATH },
        });
      }
      ids.add(npc.id);

      if (!npc.name || npc.name.trim() === '') {
        issues.push({
          id: `npc-noname-${npc.id}`,
          severity: 'error',
          category: 'npc-ddl',
          description: `Named NPC "${npc.id}" has empty name`,
          location: { file: NPC_NAMED_PATH },
        });
      }

      if (!npc.sprite && !npc.spriteId) {
        issues.push({
          id: `npc-nosprite-${npc.id}`,
          severity: 'warning',
          category: 'npc-ddl',
          description: `Named NPC "${npc.id}" has no sprite or spriteId`,
          location: { file: NPC_NAMED_PATH },
          suggestion: 'Add a sprite path or spriteId for rendering',
        });
      }
    }

    return issues;
  }

  /** Templates referencing named NPCs via spriteRef must point to valid IDs. */
  private validateTemplates(templates: NpcTemplate[], namedNpcs: NamedNpc[]): Issue[] {
    const issues: Issue[] = [];
    const namedIds = new Set(namedNpcs.map((n) => n.id));
    const ids = new Set<string>();

    for (const tpl of templates) {
      if (ids.has(tpl.id)) {
        issues.push({
          id: `tpl-dup-${tpl.id}`,
          severity: 'error',
          category: 'npc-template',
          description: `Duplicate NPC template ID: "${tpl.id}"`,
          location: { file: NPC_TEMPLATES_PATH },
        });
      }
      ids.add(tpl.id);

      if (tpl.spriteRef && !namedIds.has(tpl.spriteRef)) {
        issues.push({
          id: `tpl-badref-${tpl.id}`,
          severity: 'warning',
          category: 'npc-template',
          description: `Template "${tpl.id}" spriteRef "${tpl.spriteRef}" does not match any named NPC`,
          location: { file: NPC_TEMPLATES_PATH },
          suggestion: `Valid named NPC IDs: ${[...namedIds].join(', ')}`,
        });
      }

      if (tpl.spritePool) {
        for (const ref of tpl.spritePool) {
          if (!namedIds.has(ref)) {
            issues.push({
              id: `tpl-pool-badref-${tpl.id}-${ref}`,
              severity: 'warning',
              category: 'npc-template',
              description: `Template "${tpl.id}" spritePool entry "${ref}" does not match any named NPC`,
              location: { file: NPC_TEMPLATES_PATH },
            });
          }
        }
      }
    }

    return issues;
  }

  /** NPC objects in maps should reference known NPC IDs. */
  private validateMapNpcObjects(
    mapId: string,
    data: RuntimeMapData,
    file: string,
    knownNpcIds: Set<string>,
  ): Issue[] {
    const issues: Issue[] = [];

    const npcObjects = data.objects.filter((o) => o.type === 'npc');

    for (const obj of npcObjects) {
      // Check NPC is within map bounds
      if (obj.x < 0 || obj.x >= data.width || obj.y < 0 || obj.y >= data.height) {
        issues.push({
          id: `${mapId}-npc-oob-${obj.name}`,
          severity: 'error',
          category: 'npc-placement',
          description: `NPC "${obj.name}" at (${obj.x}, ${obj.y}) is outside map bounds (${data.width}×${data.height})`,
          location: { file, coordinates: { x: obj.x, y: obj.y } },
        });
      }

      // Check NPC is not on a blocked tile
      const idx = obj.y * data.width + obj.x;
      if (idx >= 0 && idx < data.collision.length && data.collision[idx] === 1) {
        issues.push({
          id: `${mapId}-npc-blocked-${obj.name}`,
          severity: 'warning',
          category: 'npc-placement',
          description: `NPC "${obj.name}" at (${obj.x}, ${obj.y}) is on a blocked collision tile`,
          location: { file, coordinates: { x: obj.x, y: obj.y } },
          suggestion: 'Move NPC to a passable tile or clear collision at this position',
        });
      }

      // Check if NPC name references a known DDL NPC (by id or name substring)
      const npcRef = obj.properties?.npcId as string | undefined;
      if (npcRef && !knownNpcIds.has(npcRef)) {
        issues.push({
          id: `${mapId}-npc-unknown-${obj.name}`,
          severity: 'warning',
          category: 'npc-reference',
          description: `NPC object "${obj.name}" references npcId "${npcRef}" not found in DDL`,
          location: { file, coordinates: { x: obj.x, y: obj.y } },
          suggestion: 'Add this NPC to gen/ddl/npcs/named.json or fix the npcId property',
        });
      }
    }

    return issues;
  }

  private loadJson<T>(path: string, issues: Issue[]): T | null {
    if (!existsSync(path)) {
      issues.push({
        id: `missing-${path}`,
        severity: 'warning',
        category: 'missing-data',
        description: `NPC data file not found: ${path}`,
        location: { file: path },
        suggestion: 'Ensure NPC DDL data exists at the expected path',
      });
      return null;
    }
    try {
      return JSON.parse(readFileSync(path, 'utf-8')) as T;
    } catch {
      issues.push({
        id: `parse-${path}`,
        severity: 'error',
        category: 'parse',
        description: `Failed to parse NPC data: ${path}`,
        location: { file: path },
      });
      return null;
    }
  }
}
