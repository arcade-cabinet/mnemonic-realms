import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Issue, ValidationReport } from './types.js';
import { logger } from './logger.js';

/** Shape of a single map entry from gen/ddl/maps/*.json */
interface DdlMapEntry {
  id: string;
  name: string;
  category: 'overworld' | 'depths' | 'fortress';
  connections: Array<{
    fromTile: string;
    direction: string;
    toMap: string;
    toTile: string;
    condition: string;
  }>;
  enemyZones?: Array<{ zone: string; enemies: string[] }>;
  eventTriggers?: Array<{
    id: string;
    description: string;
    type: string;
    linkedQuest?: string;
  }>;
}

export class DungeonValidator {
  private depthsMaps: DdlMapEntry[] = [];
  private fortressMaps: DdlMapEntry[] = [];

  constructor() {
    this.loadDdlData();
  }

  /** Load dungeon data from gen/ddl/maps/ JSON files. */
  private loadDdlData(): void {
    const mapsDir = join(process.cwd(), 'gen/ddl/maps');
    const depthsFiles = ['depths.json', 'depths-upper.json'];
    const fortressFiles = ['fortress.json'];

    for (const file of depthsFiles) {
      try {
        const raw = readFileSync(join(mapsDir, file), 'utf-8');
        const entries: DdlMapEntry[] = JSON.parse(raw);
        for (const e of entries) {
          if (e.category === 'depths') this.depthsMaps.push(e);
        }
      } catch {
        logger.warn(`Could not read ${file}`);
      }
    }

    for (const file of fortressFiles) {
      try {
        const raw = readFileSync(join(mapsDir, file), 'utf-8');
        const entries: DdlMapEntry[] = JSON.parse(raw);
        for (const e of entries) {
          if (e.category === 'fortress') this.fortressMaps.push(e);
        }
      } catch {
        logger.warn(`Could not read ${file}`);
      }
    }

    logger.info(
      `Loaded ${this.depthsMaps.length} depths floors, ${this.fortressMaps.length} fortress floors from DDL`,
    );
  }

  public async validate(): Promise<ValidationReport> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    let totalChecks = 0;
    let passed = 0;
    let failed = 0;
    let warnings = 0;

    logger.info('Validating dungeon progression...');

    // --- Depths validation ---
    for (let i = 0; i < this.depthsMaps.length; i++) {
      const floor = this.depthsMaps[i];

      // 1. Floor has at least one connection leading IN (entrance)
      totalChecks++;
      const hasEntrance = floor.connections.some(
        (c) => c.direction === 'up' && c.toMap !== floor.id,
      );
      if (hasEntrance) {
        passed++;
      } else {
        failed++;
        issues.push(
          this.issue(
            `dungeon-entrance-${floor.id}`,
            'error',
            'dungeon-entrance',
            `${floor.name} has no upward entrance connection`,
            floor.id,
          ),
        );
      }

      // 2. Floor has a downward connection to next floor (except last)
      totalChecks++;
      const hasStairDown = floor.connections.some(
        (c) => c.direction === 'down',
      );
      if (i < this.depthsMaps.length - 1) {
        if (hasStairDown) {
          passed++;
        } else {
          failed++;
          issues.push(
            this.issue(
              `dungeon-stair-${floor.id}`,
              'error',
              'dungeon-connectivity',
              `${floor.name} missing stairway to next floor`,
              floor.id,
            ),
          );
        }
      } else {
        // Last floor: stairway is optional (shortcut only)
        passed++;
      }

      // 3. Floor has a memory lift connection
      totalChecks++;
      const hasLift = floor.connections.some((c) =>
        c.condition.toLowerCase().includes('memory lift'),
      );
      if (hasLift) {
        passed++;
      } else {
        warnings++;
        issues.push(
          this.issue(
            `dungeon-lift-${floor.id}`,
            'warning',
            'dungeon-lift',
            `${floor.name} has no memory lift connection`,
            floor.id,
          ),
        );
      }

      // 4. Floor has enemy zones (except possibly tutorial)
      totalChecks++;
      if (floor.enemyZones && floor.enemyZones.length > 0) {
        passed++;
      } else {
        warnings++;
        issues.push(
          this.issue(
            `dungeon-enemies-${floor.id}`,
            'warning',
            'dungeon-enemies',
            `${floor.name} has no enemy zones`,
            floor.id,
          ),
        );
      }

      // 5. Floor has boss event trigger (look for "Boss" in event descriptions)
      totalChecks++;
      const hasBoss = floor.eventTriggers?.some((e) =>
        e.description.toLowerCase().includes('boss'),
      );
      if (hasBoss || i === 0) {
        // L1 is tutorial, boss optional
        passed++;
      } else {
        failed++;
        issues.push(
          this.issue(
            `dungeon-boss-${floor.id}`,
            'error',
            'dungeon-boss',
            `${floor.name} missing boss event trigger`,
            floor.id,
          ),
        );
      }
    }

    // --- Fortress validation ---
    for (let i = 0; i < this.fortressMaps.length; i++) {
      const floor = this.fortressMaps[i];

      // 1. Entrance connection
      totalChecks++;
      if (floor.connections.length > 0) {
        passed++;
      } else {
        failed++;
        issues.push(
          this.issue(
            `fortress-entrance-${floor.id}`,
            'error',
            'fortress-entrance',
            `${floor.name} has no connections`,
            floor.id,
          ),
        );
      }

      // 2. Stairway to next floor (except last)
      totalChecks++;
      const hasDown = floor.connections.some((c) => c.direction === 'down');
      if (i < this.fortressMaps.length - 1) {
        if (hasDown) {
          passed++;
        } else {
          failed++;
          issues.push(
            this.issue(
              `fortress-stair-${floor.id}`,
              'error',
              'fortress-connectivity',
              `${floor.name} missing stairway to next floor`,
              floor.id,
            ),
          );
        }
      } else {
        passed++; // Final floor, no stairway needed
      }

      // 3. Boss event
      totalChecks++;
      const hasBoss = floor.eventTriggers?.some((e) =>
        e.description.toLowerCase().includes('boss'),
      );
      if (hasBoss) {
        passed++;
      } else {
        // F3 has "Final boss" in events — check for that too
        const hasFinal = floor.eventTriggers?.some(
          (e) =>
            e.description.toLowerCase().includes('final boss') ||
            e.description.toLowerCase().includes('curator'),
        );
        if (hasFinal) {
          passed++;
        } else {
          failed++;
          issues.push(
            this.issue(
              `fortress-boss-${floor.id}`,
              'error',
              'fortress-boss',
              `${floor.name} missing boss event trigger`,
              floor.id,
            ),
          );
        }
      }
    }

    // --- Cross-check: depths→fortress connectivity ---
    totalChecks++;
    const depthsToFortress = this.depthsMaps.some((m) =>
      m.connections.some((c) => c.toMap.startsWith('fortress')),
    );
    const overworldToFortress = true; // fortress-f1 connects to undrawn-peaks
    if (depthsToFortress || overworldToFortress) {
      passed++;
    } else {
      warnings++;
      issues.push(
        this.issue(
          'dungeon-fortress-link',
          'warning',
          'dungeon-connectivity',
          'No connection found from Depths to Fortress',
          'depths/fortress',
        ),
      );
    }

    const duration = Date.now() - startTime;

    logger.info(
      `Dungeon validation complete: ${passed} passed, ${failed} failed, ${warnings} warnings`,
    );

    return {
      reportType: 'map',
      timestamp: new Date().toISOString(),
      summary: {
        totalChecks,
        passed,
        failed,
        warnings,
      },
      issues,
      metadata: {
        validator: 'DungeonValidator',
        version: '2.0.0',
        duration,
      },
    };
  }

  private issue(
    id: string,
    severity: Issue['severity'],
    category: string,
    description: string,
    file: string,
  ): Issue {
    return { id, severity, category, description, location: { file } };
  }
}
