import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Issue, ValidationReport } from './types.js';
import { logger } from './logger.js';

/** Shape of event triggers found in gen/ddl/maps/*.json */
interface DdlEventTrigger {
  id: string;
  position: string;
  type: string;
  repeat: string;
  description: string;
  linkedQuest?: string;
}

/** Shape of a map entry from gen/ddl/maps/*.json */
interface DdlMapEntry {
  id: string;
  name: string;
  category: string;
  eventTriggers?: DdlEventTrigger[];
}

/** Shape of a quest from gen/ddl/quests/*.json */
interface DdlQuest {
  id: string;
  name: string;
  objectives?: Array<{ description: string }>;
}

/** Puzzle-like event extracted from DDL */
interface PuzzleEvent {
  eventId: string;
  mapId: string;
  mapName: string;
  description: string;
  linkedQuest?: string;
  category: 'dungeon' | 'fortress' | 'overworld';
}

export class PuzzleValidator {
  private puzzleEvents: PuzzleEvent[] = [];
  private questIds = new Set<string>();

  constructor() {
    this.loadDdlData();
  }

  /** Load puzzle-related events from gen/ddl/maps/ and quests from gen/ddl/quests/ */
  private loadDdlData(): void {
    const mapsDir = join(process.cwd(), 'gen/ddl/maps');
    const questsDir = join(process.cwd(), 'gen/ddl/quests');

    // Load all map files and extract puzzle-like event triggers
    const mapFiles = readdirSync(mapsDir).filter(
      (f) => f.endsWith('.json') && !f.startsWith('_'),
    );

    for (const file of mapFiles) {
      try {
        const raw = readFileSync(join(mapsDir, file), 'utf-8');
        const entries: DdlMapEntry[] = JSON.parse(raw);
        for (const entry of entries) {
          if (!entry.eventTriggers) continue;
          for (const evt of entry.eventTriggers) {
            if (this.isPuzzleEvent(evt)) {
              const cat =
                entry.category === 'depths' || entry.category === 'fortress'
                  ? (entry.category as 'fortress')
                  : 'overworld';
              this.puzzleEvents.push({
                eventId: evt.id,
                mapId: entry.id,
                mapName: entry.name,
                description: evt.description,
                linkedQuest: evt.linkedQuest,
                category: cat === 'depths' ? 'dungeon' : cat,
              });
            }
          }
        }
      } catch {
        logger.warn(`Could not read map file ${file}`);
      }
    }

    // Load quest IDs for cross-referencing
    const questFiles = readdirSync(questsDir).filter((f) =>
      f.endsWith('.json'),
    );
    for (const file of questFiles) {
      try {
        const raw = readFileSync(join(questsDir, file), 'utf-8');
        const quests: DdlQuest[] = JSON.parse(raw);
        for (const q of quests) {
          this.questIds.add(q.id);
        }
      } catch {
        logger.warn(`Could not read quest file ${file}`);
      }
    }

    logger.info(
      `Loaded ${this.puzzleEvents.length} puzzle events from DDL, ${this.questIds.size} quest IDs`,
    );
  }

  /** Detect if an event trigger is puzzle-related based on description keywords. */
  private isPuzzleEvent(evt: DdlEventTrigger): boolean {
    const desc = evt.description.toLowerCase();
    const puzzleKeywords = [
      'puzzle',
      'valve',
      'pillar',
      'receptacle',
      'dilemma',
      'sound puzzle',
      'paradox',
      'bridge',
      'crystal barrier',
      'loop',
    ];
    return puzzleKeywords.some((kw) => desc.includes(kw));
  }

  public async validate(): Promise<ValidationReport> {
    const startTime = Date.now();
    const issues: Issue[] = [];
    let totalChecks = 0;
    let passed = 0;
    let failed = 0;
    let warnings = 0;

    logger.info('Validating puzzle mechanics...');

    for (const puzzle of this.puzzleEvents) {
      // 1. Puzzle event has a non-empty description
      totalChecks++;
      if (puzzle.description && puzzle.description.length > 0) {
        passed++;
      } else {
        failed++;
        issues.push(
          this.issue(
            `puzzle-desc-${puzzle.eventId}`,
            'error',
            'puzzle-description',
            `Puzzle event ${puzzle.eventId} on ${puzzle.mapId} has no description`,
            puzzle.mapId,
          ),
        );
      }

      // 2. If puzzle references a quest, that quest should exist
      totalChecks++;
      if (puzzle.linkedQuest) {
        if (this.questIds.has(puzzle.linkedQuest)) {
          passed++;
        } else {
          // Quest references like "GQ-02-S1" may be sub-objectives; check prefix
          const prefix = puzzle.linkedQuest.split('-').slice(0, 2).join('-');
          const hasPrefix = [...this.questIds].some((qid) =>
            qid.startsWith(prefix),
          );
          if (hasPrefix) {
            passed++;
          } else {
            warnings++;
            issues.push(
              this.issue(
                `puzzle-quest-${puzzle.eventId}`,
                'warning',
                'puzzle-quest-link',
                `Puzzle ${puzzle.eventId} references quest ${puzzle.linkedQuest} which was not found in DDL`,
                puzzle.mapId,
              ),
            );
          }
        }
      } else {
        passed++; // No quest link required
      }
    }

    // 3. Check that dungeon maps have at least one puzzle event
    const dungeonMapsWithPuzzles = new Set(
      this.puzzleEvents
        .filter((p) => p.category === 'dungeon' || p.category === 'fortress')
        .map((p) => p.mapId),
    );

    totalChecks++;
    if (dungeonMapsWithPuzzles.size > 0) {
      passed++;
    } else {
      warnings++;
      issues.push(
        this.issue(
          'puzzle-dungeon-coverage',
          'warning',
          'puzzle-coverage',
          'No puzzle events found in any dungeon maps',
          'gen/ddl/maps',
        ),
      );
    }

    const duration = Date.now() - startTime;
    const dungeonCount = this.puzzleEvents.filter(
      (p) => p.category === 'dungeon',
    ).length;
    const fortressCount = this.puzzleEvents.filter(
      (p) => p.category === 'fortress',
    ).length;
    const overworldCount = this.puzzleEvents.filter(
      (p) => p.category === 'overworld',
    ).length;

    logger.info(
      `Puzzle validation complete: ${dungeonCount} dungeon, ${fortressCount} fortress, ${overworldCount} overworld`,
    );
    logger.info(
      `Results: ${passed} passed, ${failed} failed, ${warnings} warnings`,
    );

    return {
      reportType: 'event',
      timestamp: new Date().toISOString(),
      summary: { totalChecks, passed, failed, warnings },
      issues,
      metadata: {
        validator: 'PuzzleValidator',
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
