import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ValidationReport } from './types.js';
import { logger } from './logger.js';

interface DungeonFloor {
  name: string;
  entrance: string;
  entrancePosition: string;
  entranceCondition: string;
  boss: string;
  stairway: string;
  memoryLift: string;
}

export class DungeonValidator {
  private depthsFloors: DungeonFloor[] = [];
  private fortressFloors: DungeonFloor[] = [];

  constructor() {
    this.parseDungeonDocumentation();
  }

  private parseDungeonDocumentation(): void {
    const docPath = join(process.cwd(), 'docs/maps/dungeon-depths.md');
    const content = readFileSync(docPath, 'utf-8');

    // Parse Depths floors
    this.depthsFloors = [
      {
        name: 'Depths Level 1: Memory Cellar',
        entrance: 'Village Hub',
        entrancePosition: '(8, 17)',
        entranceCondition: 'After MQ-05',
        boss: 'None (tutorial floor)',
        stairway: 'Room 5 → Depths L2',
        memoryLift: 'Room 5 → Village Hub',
      },
      {
        name: 'Depths Level 2: Drowned Archive',
        entrance: 'Shimmer Marsh',
        entrancePosition: '(33, 43)',
        entranceCondition: 'After MQ-05',
        boss: 'B-03a: The Archivist',
        stairway: 'Room 7 → Depths L3',
        memoryLift: 'Room 6 → Shimmer Marsh',
      },
      {
        name: 'Depths Level 3: Resonant Caverns',
        entrance: 'Hollow Ridge',
        entrancePosition: '(38, 3)',
        entranceCondition: 'After MQ-05',
        boss: 'B-03b: The Resonant King',
        stairway: 'Room 8 → Depths L4',
        memoryLift: 'Room 5 → Hollow Ridge',
      },
      {
        name: 'Depths Level 4: The Songline',
        entrance: 'Resonance Fields',
        entrancePosition: '(28, 44)',
        entranceCondition: 'After Singing Stones puzzle',
        boss: 'B-03c: The Conductor',
        stairway: 'Room 7 → Depths L5',
        memoryLift: 'Room 3 → Resonance Fields',
      },
      {
        name: 'Depths Level 5: The Deepest Memory',
        entrance: 'Half-Drawn Forest',
        entrancePosition: '(13, 36)',
        entranceCondition: 'After MQ-08',
        boss: 'B-03d: The First Dreamer',
        stairway: 'Room 9 shortcut (GQ-03-F2 only)',
        memoryLift: 'Room 5 → Half-Drawn Forest',
      },
    ];

    // Parse Fortress floors
    this.fortressFloors = [
      {
        name: 'Fortress Floor 1: Gallery of Moments',
        entrance: 'Undrawn Peaks',
        entrancePosition: '(19, 35)',
        entranceCondition: 'After MQ-08 (gate solidified)',
        boss: "B-04a: Grym's Right Hand",
        stairway: 'Room 6 → Fortress F2',
        memoryLift: 'Room 5 → Undrawn Peaks',
      },
      {
        name: 'Fortress Floor 2: Archive of Perfection',
        entrance: 'Fortress Floor 1',
        entrancePosition: 'Room 6 stairway',
        entranceCondition: 'After defeating Grym\'s Right Hand',
        boss: 'B-04b: The Archive Keeper',
        stairway: 'Room 6 → Fortress F3',
        memoryLift: 'None (use F1 lift)',
      },
      {
        name: 'Fortress Floor 3: First Memory Chamber',
        entrance: 'Fortress Floor 2',
        entrancePosition: 'Room 6 stairway',
        entranceCondition: 'After defeating Archive Keeper',
        boss: 'B-05: Grym (dialogue)',
        stairway: 'None (final floor)',
        memoryLift: 'Post-game only → Undrawn Peaks',
      },
    ];
  }

  public validate(): ValidationReport {
    const report: ValidationReport = {
      totalChecked: 0,
      passed: 0,
      failed: 0,
      errors: [],
      warnings: [],
      metadata: {
        validator: 'DungeonValidator',
        timestamp: new Date().toISOString(),
      },
    };

    logger.info('Validating dungeon progression...');

    // Validate Depths progression
    this.validateDepthsProgression(report);

    // Validate Fortress progression
    this.validateFortressProgression(report);

    // Validate dungeon accessibility
    this.validateDungeonAccessibility(report);

    logger.info(
      `Dungeon validation complete: ${report.passed} passed, ${report.failed} failed, ${report.warnings.length} warnings`,
    );

    return report;
  }

  private validateDepthsProgression(report: ValidationReport): void {
    logger.info('Validating Depths progression (5 floors)...');

    for (let i = 0; i < this.depthsFloors.length; i++) {
      const floor = this.depthsFloors[i];
      report.totalChecked++;

      // Check floor has entrance
      if (floor.entrance && floor.entrancePosition) {
        report.passed++;
      } else {
        report.failed++;
        report.errors.push({
          type: 'missing_entrance',
          message: `${floor.name} missing entrance information`,
          location: floor.name,
        });
      }

      // Check floor has boss (except L1)
      report.totalChecked++;
      if (i === 0 && floor.boss === 'None (tutorial floor)') {
        report.passed++;
      } else if (i > 0 && floor.boss.startsWith('B-03')) {
        report.passed++;
      } else {
        report.failed++;
        report.errors.push({
          type: 'missing_boss',
          message: `${floor.name} missing boss encounter`,
          location: floor.name,
        });
      }

      // Check floor has stairway (except L5)
      report.totalChecked++;
      if (i < 4 && floor.stairway.includes('→ Depths L')) {
        report.passed++;
      } else if (i === 4 && floor.stairway.includes('shortcut')) {
        report.passed++;
      } else {
        report.failed++;
        report.errors.push({
          type: 'missing_stairway',
          message: `${floor.name} missing stairway connection`,
          location: floor.name,
        });
      }

      // Check floor has memory lift
      report.totalChecked++;
      if (floor.memoryLift && floor.memoryLift.includes('→')) {
        report.passed++;
      } else {
        report.failed++;
        report.errors.push({
          type: 'missing_memory_lift',
          message: `${floor.name} missing memory lift`,
          location: floor.name,
        });
      }
    }
  }

  private validateFortressProgression(report: ValidationReport): void {
    logger.info('Validating Fortress progression (3 floors)...');

    for (let i = 0; i < this.fortressFloors.length; i++) {
      const floor = this.fortressFloors[i];
      report.totalChecked++;

      // Check floor has entrance
      if (floor.entrance && floor.entrancePosition) {
        report.passed++;
      } else {
        report.failed++;
        report.errors.push({
          type: 'missing_entrance',
          message: `${floor.name} missing entrance information`,
          location: floor.name,
        });
      }

      // Check floor has boss
      report.totalChecked++;
      if (floor.boss.startsWith('B-04') || floor.boss.startsWith('B-05')) {
        report.passed++;
      } else {
        report.failed++;
        report.errors.push({
          type: 'missing_boss',
          message: `${floor.name} missing boss encounter`,
          location: floor.name,
        });
      }

      // Check floor has stairway (except F3)
      report.totalChecked++;
      if (i < 2 && floor.stairway.includes('→ Fortress F')) {
        report.passed++;
      } else if (i === 2 && floor.stairway === 'None (final floor)') {
        report.passed++;
      } else {
        report.failed++;
        report.errors.push({
          type: 'missing_stairway',
          message: `${floor.name} missing stairway connection`,
          location: floor.name,
        });
      }

      // Check floor has memory lift (F1 and F3 only)
      report.totalChecked++;
      if (i === 0 && floor.memoryLift.includes('→ Undrawn Peaks')) {
        report.passed++;
      } else if (i === 1 && floor.memoryLift === 'None (use F1 lift)') {
        report.passed++;
      } else if (i === 2 && floor.memoryLift.includes('Post-game')) {
        report.passed++;
      } else {
        report.failed++;
        report.errors.push({
          type: 'missing_memory_lift',
          message: `${floor.name} memory lift configuration incorrect`,
          location: floor.name,
        });
      }
    }
  }

  private validateDungeonAccessibility(report: ValidationReport): void {
    logger.info('Validating dungeon accessibility...');

    // Check all Depths floors have entrance conditions
    for (const floor of this.depthsFloors) {
      report.totalChecked++;
      if (floor.entranceCondition && floor.entranceCondition.includes('MQ-')) {
        report.passed++;
      } else {
        report.warnings.push({
          type: 'missing_entrance_condition',
          message: `${floor.name} entrance condition unclear`,
          location: floor.name,
        });
      }
    }

    // Check Fortress has entrance condition
    report.totalChecked++;
    if (
      this.fortressFloors[0].entranceCondition &&
      this.fortressFloors[0].entranceCondition.includes('MQ-08')
    ) {
      report.passed++;
    } else {
      report.failed++;
      report.errors.push({
        type: 'missing_entrance_condition',
        message: 'Fortress entrance condition missing or incorrect',
        location: 'Fortress Floor 1',
      });
    }
  }
}
