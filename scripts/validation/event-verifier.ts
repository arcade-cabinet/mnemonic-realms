// Event Verifier — validates event objects in runtime map JSON (data/maps/*.json)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from './logger.js';
import { formatTimestamp, calculateDuration } from './utils.js';
import type { ValidationReport, Issue } from './types.js';

// --- Runtime map JSON shapes (matches RuntimeMapData) ---

interface MapObject {
  name: string;
  type: 'npc' | 'chest' | 'transition' | 'trigger' | 'spawn';
  x: number;
  y: number;
  width?: number;
  height?: number;
  properties?: Record<string, string | number | boolean>;
}

interface RuntimeMapJson {
  id?: string;
  width: number;
  height: number;
  objects: MapObject[];
}

// --- Constants ---

const MAPS_DIR = 'data/maps';

export class EventVerifier {
  constructor() {
    // No configuration needed — reads from data/maps/
  }

  // --- Per-object validation ---

  private validateNpc(obj: MapObject, mapFile: string): Issue[] {
    const issues: Issue[] = [];
    const props = obj.properties ?? {};

    if (!props.sprite && !props.graphic) {
      issues.push({
        id: `npc-no-sprite-${obj.name}`,
        severity: 'error',
        category: 'npc-missing-sprite',
        description: `NPC "${obj.name}" has no sprite or graphic property`,
        location: { file: mapFile, coordinates: { x: obj.x, y: obj.y } },
        suggestion: 'Add a "sprite" or "graphic" property to this NPC object',
      });
    }

    if (!props.dialogue && !props.dialogueId && !props.text) {
      issues.push({
        id: `npc-no-dialogue-${obj.name}`,
        severity: 'warning',
        category: 'npc-missing-dialogue',
        description: `NPC "${obj.name}" has no dialogue, dialogueId, or text property`,
        location: { file: mapFile, coordinates: { x: obj.x, y: obj.y } },
        suggestion: 'Add a "dialogue" or "dialogueId" property to this NPC object',
      });
    }

    return issues;
  }

  private validateTransition(obj: MapObject, mapFile: string): Issue[] {
    const issues: Issue[] = [];
    const props = obj.properties ?? {};

    if (!props.target && !props.targetMap && !props.targetWorld) {
      issues.push({
        id: `transition-no-target-${obj.name}`,
        severity: 'error',
        category: 'transition-missing-target',
        description: `Transition "${obj.name}" has no target, targetMap, or targetWorld property`,
        location: { file: mapFile, coordinates: { x: obj.x, y: obj.y } },
        suggestion: 'Add a "target" property specifying the destination world/map',
      });
    }

    return issues;
  }

  private validateTrigger(obj: MapObject, mapFile: string): Issue[] {
    const issues: Issue[] = [];
    const props = obj.properties ?? {};

    if (!props.eventId && !props.event && !props.action) {
      issues.push({
        id: `trigger-no-event-${obj.name}`,
        severity: 'error',
        category: 'trigger-missing-event',
        description: `Trigger "${obj.name}" has no eventId, event, or action property`,
        location: { file: mapFile, coordinates: { x: obj.x, y: obj.y } },
        suggestion: 'Add an "eventId" or "action" property to this trigger object',
      });
    }

    return issues;
  }

  private validateChest(obj: MapObject, mapFile: string): Issue[] {
    const issues: Issue[] = [];
    const props = obj.properties ?? {};

    if (!props.contents && !props.itemId && !props.items) {
      issues.push({
        id: `chest-no-contents-${obj.name}`,
        severity: 'warning',
        category: 'chest-missing-contents',
        description: `Chest "${obj.name}" has no contents, itemId, or items property`,
        location: { file: mapFile, coordinates: { x: obj.x, y: obj.y } },
        suggestion: 'Add a "contents" or "itemId" property to this chest object',
      });
    }

    return issues;
  }

  // --- Main validation ---

  private validateMapObjects(mapFile: string, mapData: RuntimeMapJson): Issue[] {
    const issues: Issue[] = [];
    const objects = mapData.objects ?? [];

    for (const obj of objects) {
      // Common checks: every object needs a name and valid type
      if (!obj.name) {
        issues.push({
          id: `obj-no-name-${obj.type}-${obj.x}-${obj.y}`,
          severity: 'error',
          category: 'object-missing-name',
          description: `${obj.type} object at (${obj.x}, ${obj.y}) has no name`,
          location: { file: mapFile, coordinates: { x: obj.x, y: obj.y } },
        });
      }

      // Type-specific validation
      switch (obj.type) {
        case 'npc':
          issues.push(...this.validateNpc(obj, mapFile));
          break;
        case 'transition':
          issues.push(...this.validateTransition(obj, mapFile));
          break;
        case 'trigger':
          issues.push(...this.validateTrigger(obj, mapFile));
          break;
        case 'chest':
          issues.push(...this.validateChest(obj, mapFile));
          break;
        case 'spawn':
          // Spawn points just need a name (already checked above)
          break;
        default:
          issues.push({
            id: `obj-unknown-type-${obj.name}`,
            severity: 'warning',
            category: 'unknown-object-type',
            description: `Object "${obj.name}" has unknown type "${obj.type}"`,
            location: { file: mapFile, coordinates: { x: obj.x, y: obj.y } },
          });
      }
    }

    return issues;
  }

  public async validate(): Promise<ValidationReport> {
    const startTime = Date.now();
    logger.info('Starting event verification...');

    const allIssues: Issue[] = [];
    let totalChecks = 0;

    if (!existsSync(MAPS_DIR)) {
      logger.warn(`Maps directory not found: ${MAPS_DIR}`);
      return {
        reportType: 'event',
        timestamp: formatTimestamp(new Date()),
        summary: { totalChecks: 0, passed: 0, failed: 0, warnings: 0 },
        issues: [{
          id: 'no-maps-dir',
          severity: 'warning',
          category: 'missing-data',
          description: `Runtime maps directory not found: ${MAPS_DIR}. Run "pnpm generate:content" first.`,
          location: { file: MAPS_DIR },
        }],
        metadata: {
          validator: 'EventVerifier',
          version: '2.0.0',
          duration: calculateDuration(startTime),
        },
      };
    }

    const mapFiles = readdirSync(MAPS_DIR).filter((f) => f.endsWith('.json'));

    if (mapFiles.length === 0) {
      logger.warn('No runtime map JSON files found');
      return {
        reportType: 'event',
        timestamp: formatTimestamp(new Date()),
        summary: { totalChecks: 0, passed: 0, failed: 0, warnings: 0 },
        issues: [{
          id: 'no-map-files',
          severity: 'warning',
          category: 'missing-data',
          description: `No .json files in ${MAPS_DIR}. Run "pnpm generate:content" first.`,
          location: { file: MAPS_DIR },
        }],
        metadata: {
          validator: 'EventVerifier',
          version: '2.0.0',
          duration: calculateDuration(startTime),
        },
      };
    }

    for (const file of mapFiles) {
      const filePath = join(MAPS_DIR, file);
      try {
        const mapData: RuntimeMapJson = JSON.parse(readFileSync(filePath, 'utf-8'));
        const objectCount = (mapData.objects ?? []).length;
        totalChecks += objectCount;

        const mapIssues = this.validateMapObjects(filePath, mapData);
        allIssues.push(...mapIssues);

        logger.info(
          `${file}: ${objectCount} objects, ${mapIssues.length} issues`,
        );
      } catch (err) {
        allIssues.push({
          id: `parse-error-${file}`,
          severity: 'error',
          category: 'parse-error',
          description: `Failed to parse map JSON: ${filePath} — ${err}`,
          location: { file: filePath },
        });
        totalChecks++;
      }
    }

    const errors = allIssues.filter((i) => i.severity === 'error').length;
    const warnings = allIssues.filter((i) => i.severity === 'warning').length;

    logger.info(
      `Event verification complete: ${totalChecks} objects checked, ${errors} errors, ${warnings} warnings`,
    );

    return {
      reportType: 'event',
      timestamp: formatTimestamp(new Date()),
      summary: {
        totalChecks,
        passed: totalChecks - errors,
        failed: errors,
        warnings,
      },
      issues: allIssues,
      metadata: {
        validator: 'EventVerifier',
        version: '2.0.0',
        duration: calculateDuration(startTime),
      },
    };
  }
}
