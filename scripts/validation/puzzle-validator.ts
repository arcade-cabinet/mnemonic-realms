import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ValidationReport } from './types.js';
import { logger } from './logger.js';

interface PuzzleDefinition {
  name: string;
  map: string;
  events: string[];
  mechanic: string;
  failPenalty: string;
  solution: string;
  category: 'dungeon' | 'stagnation' | 'overworld';
}

export class PuzzleValidator {
  private puzzles: PuzzleDefinition[] = [];

  constructor() {
    this.parsePuzzleDocumentation();
  }

  private parsePuzzleDocumentation(): void {
    const docPath = join(process.cwd(), 'docs/maps/event-placement.md');
    const content = readFileSync(docPath, 'utf-8');

    // Parse dungeon puzzles
    const dungeonMatch = content.match(
      /### Dungeon Puzzles\s+\|[^\n]+\n\|[-|]+\n((?:\|[^\n]+\n)+)/,
    );
    if (dungeonMatch) {
      const rows = dungeonMatch[1].trim().split('\n');
      for (const row of rows) {
        const cols = row.split('|').map((c) => c.trim());
        if (cols.length >= 7) {
          this.puzzles.push({
            name: cols[1],
            map: cols[2],
            events: cols[3].split(',').map((e) => e.trim()),
            mechanic: cols[4],
            failPenalty: cols[5],
            solution: cols[6],
            category: 'dungeon',
          });
        }
      }
    }

    // Parse stagnation zone puzzles
    const stagnationMatch = content.match(
      /### Stagnation Zone Puzzles\s+\|[^\n]+\n\|[-|]+\n((?:\|[^\n]+\n)+)/,
    );
    if (stagnationMatch) {
      const rows = stagnationMatch[1].trim().split('\n');
      for (const row of rows) {
        const cols = row.split('|').map((c) => c.trim());
        if (cols.length >= 6) {
          this.puzzles.push({
            name: cols[1],
            map: cols[2],
            events: [], // Stagnation puzzles don't have explicit event IDs
            mechanic: cols[3],
            failPenalty: cols[4],
            solution: '',
            category: 'stagnation',
          });
        }
      }
    }

    // Parse overworld puzzles
    const overworldMatch = content.match(
      /### Overworld Puzzles\s+\|[^\n]+\n\|[-|]+\n((?:\|[^\n]+\n)+)/,
    );
    if (overworldMatch) {
      const rows = overworldMatch[1].trim().split('\n');
      for (const row of rows) {
        const cols = row.split('|').map((c) => c.trim());
        if (cols.length >= 5) {
          this.puzzles.push({
            name: cols[1],
            map: cols[2],
            events: cols[3].split(',').map((e) => e.trim()),
            mechanic: cols[4],
            failPenalty: '',
            solution: '',
            category: 'overworld',
          });
        }
      }
    }

    logger.info(`Parsed ${this.puzzles.length} puzzle definitions`);
  }

  public validate(): ValidationReport {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    logger.info('Validating puzzle mechanics...');

    for (const puzzle of this.puzzles) {
      // Check if puzzle events are documented
      if (puzzle.events.length > 0) {
        for (const eventId of puzzle.events) {
          if (!eventId || eventId === '—') continue;
          // Note: We can't verify event implementation without parsing TMX files
          // This would require integrating with the Event Verifier
          logger.debug(`Puzzle "${puzzle.name}" uses event ${eventId}`);
        }
      }

      // Validate puzzle has required fields
      if (!puzzle.mechanic || puzzle.mechanic === '—') {
        warnings.push(`Puzzle "${puzzle.name}" on ${puzzle.map} has no mechanic description`);
      }

      // Check for puzzles with no fail penalty (might be intentional)
      if (puzzle.category === 'dungeon' && (!puzzle.failPenalty || puzzle.failPenalty === 'None')) {
        logger.debug(`Puzzle "${puzzle.name}" has no fail penalty (might be intentional)`);
      }
    }

    // Summary
    const dungeonPuzzles = this.puzzles.filter((p) => p.category === 'dungeon').length;
    const stagnationPuzzles = this.puzzles.filter((p) => p.category === 'stagnation').length;
    const overworldPuzzles = this.puzzles.filter((p) => p.category === 'overworld').length;

    logger.info(`Found ${dungeonPuzzles} dungeon puzzles`);
    logger.info(`Found ${stagnationPuzzles} stagnation zone puzzles`);
    logger.info(`Found ${overworldPuzzles} overworld puzzles`);

    const duration = Date.now() - startTime;

    return {
      validator: 'PuzzleValidator',
      timestamp: new Date().toISOString(),
      totalChecked: this.puzzles.length,
      passed: this.puzzles.length - errors.length - warnings.length,
      failed: errors.length,
      warnings: warnings.length,
      errors,
      warningMessages: warnings,
      metadata: {
        duration,
        dungeonPuzzles,
        stagnationPuzzles,
        overworldPuzzles,
      },
    };
  }

  public getPuzzles(): PuzzleDefinition[] {
    return this.puzzles;
  }
}
