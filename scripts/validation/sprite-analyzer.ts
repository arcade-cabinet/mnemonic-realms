import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import type { Issue, ValidationReport } from './types.js';
import { Logger, logger as globalLogger } from './logger.js';
import { writeFile } from './utils.js';

interface SpriteSheet {
  path: string;
  id: string;
  width: number;
  height: number;
  frameWidth: number;
  frameHeight: number;
  framesWidth: number;
  framesHeight: number;
  totalFrames: number;
  type: 'character' | 'npc' | 'enemy-small' | 'enemy-medium' | 'boss' | 'effect' | 'unknown';
  hasWalkCycle: boolean;
  directions: number;
  usedInMaps: string[];
}

interface SpriteUsage {
  spriteId: string;
  mapName: string;
  eventType: 'npc' | 'enemy' | 'player';
}

export class SpriteAnalyzer {
  private logger: Logger;
  private sprites: SpriteSheet[] = [];
  private usage: SpriteUsage[] = [];

  constructor(logger?: Logger) {
    this.logger = logger ?? globalLogger;
  }

  /** Alias for analyze() so the CLI can call validate() uniformly. */
  async validate(): Promise<ValidationReport> {
    return this.analyze();
  }

  async analyze(): Promise<ValidationReport> {
    const startTime = Date.now();
    this.logger.info('Starting sprite analysis...');

    const issues: Issue[] = [];

    // Scan sprite directories
    await this.scanSprites('assets/sprites', issues);

    // Parse sprite usage from generated.ts
    this.parseGeneratedSprites(issues);

    // Parse sprite usage from maps
    this.parseSpriteUsage(issues);

    // Validate walk cycles
    this.validateWalkCycles(issues);

    // Validate sprite directions
    this.validateDirections(issues);

    // Generate reports
    await this.generateMarkdownReport();
    await this.generateJsonReport();

    const errorCount = issues.filter((i) => i.severity === 'error').length;
    const warnCount = issues.filter((i) => i.severity === 'warning').length;
    const passedCount = this.sprites.length - errorCount;
    const duration = Date.now() - startTime;

    this.logger.info(`Sprite analysis complete: ${this.sprites.length} sprites analyzed`);

    return {
      reportType: 'sprite',
      timestamp: new Date().toISOString(),
      summary: {
        totalChecks: this.sprites.length,
        passed: passedCount > 0 ? passedCount : 0,
        failed: errorCount,
        warnings: warnCount,
      },
      issues,
      metadata: {
        validator: 'SpriteAnalyzer',
        version: '2.0.0',
        duration,
      },
    };
  }

  private async scanSprites(dir: string, issues: Issue[]): Promise<void> {
    try {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          await this.scanSprites(fullPath, issues);
        } else if (entry.endsWith('.png')) {
          await this.analyzeSpriteFile(fullPath, issues);
        }
      }
    } catch (err) {
      issues.push(this.mkIssue('error', 'sprite-scan', `Failed to scan directory ${dir}: ${err}`, dir));
    }
  }

  private async analyzeSpriteFile(path: string, issues: Issue[]): Promise<void> {
    try {
      const metadata = await sharp(path).metadata();
      const width = metadata.width ?? 0;
      const height = metadata.height ?? 0;

      // Determine sprite type and frame dimensions
      const type = this.detectSpriteType(path, width, height);
      const { frameWidth, frameHeight, framesWidth, framesHeight } = this.detectFrameDimensions(
        type,
        width,
        height,
      );

      const sprite: SpriteSheet = {
        path,
        id: this.extractSpriteId(path),
        width,
        height,
        frameWidth,
        frameHeight,
        framesWidth,
        framesHeight,
        totalFrames: framesWidth * framesHeight,
        type,
        hasWalkCycle: this.detectWalkCycle(type, framesHeight),
        directions: this.detectDirections(type, framesHeight),
        usedInMaps: [],
      };

      this.sprites.push(sprite);
    } catch (err) {
      issues.push(this.mkIssue('error', 'sprite-analyze', `Failed to analyze sprite ${path}: ${err}`, path));
    }
  }

  private detectSpriteType(
    path: string,
    width: number,
    height: number,
  ): SpriteSheet['type'] {
    // Character/NPC: 64x496 (4 cols x 31 rows @ 16x16)
    if (width === 64 && height === 496) return 'character';

    // Small enemies: 64x128 (4 cols x 8 rows @ 16x16)
    if (width === 64 && height === 128) return 'enemy-small';

    // Medium enemies: 64x224 (4 cols x 14 rows @ 16x16)
    if (width === 64 && height === 224) return 'enemy-medium';

    // Boss dragon: 2304x96 (24 frames @ 96x96)
    if (width === 2304 && height === 96) return 'boss';

    // Effects
    if (path.includes('/effects/')) return 'effect';

    // NPCs
    if (path.includes('/npcs/')) return 'npc';

    return 'unknown';
  }

  private detectFrameDimensions(
    type: SpriteSheet['type'],
    width: number,
    height: number,
  ): { frameWidth: number; frameHeight: number; framesWidth: number; framesHeight: number } {
    switch (type) {
      case 'character':
      case 'npc':
        return { frameWidth: 16, frameHeight: 16, framesWidth: 4, framesHeight: 31 };
      case 'enemy-small':
        return { frameWidth: 16, frameHeight: 16, framesWidth: 4, framesHeight: 8 };
      case 'enemy-medium':
        return { frameWidth: 16, frameHeight: 16, framesWidth: 4, framesHeight: 14 };
      case 'boss':
        return { frameWidth: 96, frameHeight: 96, framesWidth: 24, framesHeight: 1 };
      default:
        // Assume 16x16 frames for unknown types
        return {
          frameWidth: 16,
          frameHeight: 16,
          framesWidth: Math.floor(width / 16),
          framesHeight: Math.floor(height / 16),
        };
    }
  }

  private detectWalkCycle(type: SpriteSheet['type'], framesHeight: number): boolean {
    switch (type) {
      case 'character':
      case 'npc':
        return framesHeight >= 31; // 4 directions x ~8 rows per direction
      case 'enemy-small':
        return framesHeight >= 8; // 4 directions x 2 rows per direction
      case 'enemy-medium':
        return framesHeight >= 14; // 4 directions x 3-4 rows per direction
      default:
        return false;
    }
  }

  private detectDirections(type: SpriteSheet['type'], framesHeight: number): number {
    switch (type) {
      case 'character':
      case 'npc':
        return 4; // Down, Left, Right, Up
      case 'enemy-small':
      case 'enemy-medium':
        return 4;
      case 'boss':
        return 1; // Single direction
      default:
        return 0;
    }
  }

  private extractSpriteId(path: string): string {
    const parts = path.split('/');
    const filename = parts[parts.length - 1];
    return filename.replace('.png', '').replace(/_/g, '-').toLowerCase();
  }

  private parseGeneratedSprites(issues: Issue[]): void {
    try {
      const generatedPath = 'main/client/characters/generated.ts';
      const content = readFileSync(generatedPath, 'utf-8');

      // Extract sprite IDs from makeWalkSprite calls
      const regex = /makeWalkSprite\(['"]([^'"]+)['"]/g;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(content)) !== null) {
        const spriteId = match[1];
        const sprite = this.sprites.find((s) => s.id === spriteId);
        if (sprite) {
          sprite.usedInMaps.push('generated.ts');
        }
      }
    } catch (err) {
      issues.push(this.mkIssue('error', 'sprite-generated', `Failed to parse generated.ts: ${err}`, 'generated.ts'));
    }
  }

  private parseSpriteUsage(issues: Issue[]): void {
    try {
      // Parse enemy database files for sprite usage
      const enemyDir = 'main/database/enemies';
      const enemyFiles = readdirSync(enemyDir).filter((f) => f.endsWith('.ts'));

      for (const file of enemyFiles) {
        const content = readFileSync(join(enemyDir, file), 'utf-8');
        const graphicMatch = content.match(/graphic:\s*['"]([^'"]+)['"]/);

        if (graphicMatch) {
          const spriteId = graphicMatch[1];
          this.usage.push({
            spriteId,
            mapName: file.replace('.ts', ''),
            eventType: 'enemy',
          });

          const sprite = this.sprites.find((s) => s.id === spriteId);
          if (sprite && !sprite.usedInMaps.includes(file)) {
            sprite.usedInMaps.push(file);
          }
        }
      }
    } catch (err) {
      issues.push(this.mkIssue('error', 'sprite-usage', `Failed to parse sprite usage: ${err}`, 'main/database/enemies'));
    }
  }

  private validateWalkCycles(issues: Issue[]): void {
    for (const sprite of this.sprites) {
      if (
        (sprite.type === 'character' || sprite.type === 'npc' || sprite.type === 'enemy-small' || sprite.type === 'enemy-medium') &&
        !sprite.hasWalkCycle
      ) {
        issues.push(this.mkIssue(
          'warning',
          'sprite-walk-cycle',
          `Sprite ${sprite.id} (${sprite.type}) may be missing complete walk cycle (height: ${sprite.height})`,
          sprite.path,
        ));
      }

      // Verify 4-frame walk cycle per direction
      if (sprite.type === 'character' || sprite.type === 'npc') {
        if (sprite.framesWidth !== 4) {
          issues.push(this.mkIssue(
            'error',
            'sprite-walk-cycle',
            `Sprite ${sprite.id} has ${sprite.framesWidth} columns, expected 4 for walk cycle`,
            sprite.path,
          ));
        }
      }
    }
  }

  private validateDirections(issues: Issue[]): void {
    for (const sprite of this.sprites) {
      if (sprite.directions === 4) {
        // Verify that frame height is divisible by 4 (one section per direction)
        const rowsPerDirection = sprite.framesHeight / 4;
        if (sprite.framesHeight % 4 !== 0) {
          issues.push(this.mkIssue(
            'warning',
            'sprite-directions',
            `Sprite ${sprite.id} has ${sprite.framesHeight} rows, not evenly divisible by 4 directions`,
            sprite.path,
          ));
        }

        // Verify minimum rows per direction
        if (sprite.type === 'character' || sprite.type === 'npc') {
          if (rowsPerDirection < 4) {
            issues.push(this.mkIssue(
              'warning',
              'sprite-directions',
              `Sprite ${sprite.id} has only ${rowsPerDirection} rows per direction, expected at least 4`,
              sprite.path,
            ));
          }
        }
      }
    }
  }

  private issueCounter = 0;

  private mkIssue(
    severity: Issue['severity'],
    category: string,
    description: string,
    file: string,
  ): Issue {
    this.issueCounter++;
    return {
      id: `sprite-${this.issueCounter}`,
      severity,
      category,
      description,
      location: { file },
    };
  }

  private async generateMarkdownReport(): Promise<void> {
    const lines: string[] = [
      '# Sprite Analysis Report',
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      '## Summary',
      '',
      `- Total sprites: ${this.sprites.length}`,
      `- Characters/NPCs: ${this.sprites.filter((s) => s.type === 'character' || s.type === 'npc').length}`,
      `- Enemies: ${this.sprites.filter((s) => s.type === 'enemy-small' || s.type === 'enemy-medium').length}`,
      `- Bosses: ${this.sprites.filter((s) => s.type === 'boss').length}`,
      `- Effects: ${this.sprites.filter((s) => s.type === 'effect').length}`,
      `- Unknown: ${this.sprites.filter((s) => s.type === 'unknown').length}`,
      '',
      '## Sprite Details',
      '',
    ];

    // Group by type
    const byType = new Map<string, SpriteSheet[]>();
    for (const sprite of this.sprites) {
      const sprites = byType.get(sprite.type) ?? [];
      sprites.push(sprite);
      byType.set(sprite.type, sprites);
    }

    for (const [type, sprites] of byType) {
      lines.push(`### ${type.toUpperCase()}`);
      lines.push('');

      for (const sprite of sprites) {
        lines.push(`#### ${sprite.id}`);
        lines.push('');
        lines.push(`- Path: \`${sprite.path}\``);
        lines.push(`- Dimensions: ${sprite.width}x${sprite.height}`);
        lines.push(`- Frame size: ${sprite.frameWidth}x${sprite.frameHeight}`);
        lines.push(`- Grid: ${sprite.framesWidth} cols x ${sprite.framesHeight} rows`);
        lines.push(`- Total frames: ${sprite.totalFrames}`);
        lines.push(`- Directions: ${sprite.directions}`);
        lines.push(`- Has walk cycle: ${sprite.hasWalkCycle ? 'Yes' : 'No'}`);

        if (sprite.usedInMaps.length > 0) {
          lines.push(`- Used in: ${sprite.usedInMaps.join(', ')}`);
        }

        lines.push('');
      }
    }

    lines.push('## Sprite Usage');
    lines.push('');

    for (const usage of this.usage) {
      lines.push(`- \`${usage.spriteId}\` used in \`${usage.mapName}\` as ${usage.eventType}`);
    }

    writeFile('scripts/validation/sprite-report.md', lines.join('\n'));
  }

  private async generateJsonReport(): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.sprites.length,
        byType: {
          character: this.sprites.filter((s) => s.type === 'character').length,
          npc: this.sprites.filter((s) => s.type === 'npc').length,
          'enemy-small': this.sprites.filter((s) => s.type === 'enemy-small').length,
          'enemy-medium': this.sprites.filter((s) => s.type === 'enemy-medium').length,
          boss: this.sprites.filter((s) => s.type === 'boss').length,
          effect: this.sprites.filter((s) => s.type === 'effect').length,
          unknown: this.sprites.filter((s) => s.type === 'unknown').length,
        },
      },
      sprites: this.sprites,
      usage: this.usage,
    };

    writeFile('scripts/validation/sprite-report.json', JSON.stringify(report, null, 2));
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const cliLogger = new Logger('info');
  const analyzer = new SpriteAnalyzer(cliLogger);

  analyzer
    .analyze()
    .then((report) => {
      cliLogger.info(`Analysis complete: ${report.summary.passed}/${report.summary.totalChecks} passed`);

      const errors = report.issues.filter((i) => i.severity === 'error');
      const warnings = report.issues.filter((i) => i.severity === 'warning');

      if (errors.length > 0) {
        cliLogger.error(`Found ${errors.length} errors`);
        for (const e of errors) {
          cliLogger.error(`  - ${e.description}`);
        }
      }

      if (warnings.length > 0) {
        cliLogger.warn(`Found ${warnings.length} warnings`);
        for (const w of warnings) {
          cliLogger.warn(`  - ${w.description}`);
        }
      }

      process.exit(errors.length > 0 ? 1 : 0);
    })
    .catch((err) => {
      cliLogger.error(`Fatal error: ${err}`);
      process.exit(1);
    });
}
