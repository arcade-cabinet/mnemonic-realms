// Visual Validator — validates visual consistency across runtime map JSON
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { RuntimeMapData } from '../../gen/assemblage/pipeline/runtime-types.js';
import { logger } from './logger.js';
import {
  writeJsonReport,
  writeMarkdownReport,
  formatTimestamp,
  calculateDuration,
} from './utils.js';
import type { Issue, ValidationReport } from './types.js';

const MAPS_DIR = 'data/maps';
const TILE_SIZE = 16;

export class VisualValidator {
  async validate(): Promise<ValidationReport> {
    const startTime = Date.now();
    logger.info('Starting visual validation...');

    if (!existsSync(MAPS_DIR)) {
      logger.warn(`Maps directory not found: ${MAPS_DIR}`);
      return emptyReport(formatTimestamp(), calculateDuration(startTime));
    }

    const mapFiles = readdirSync(MAPS_DIR).filter((f) => f.endsWith('.json'));
    logger.info(`Found ${mapFiles.length} map files`);

    const allIssues: Issue[] = [];
    let mapsAnalyzed = 0;

    for (const [idx, file] of mapFiles.entries()) {
      logger.progress(idx + 1, mapFiles.length, `Analyzing ${file}`);
      const filePath = join(MAPS_DIR, file);

      let data: RuntimeMapData;
      try {
        data = JSON.parse(readFileSync(filePath, 'utf-8')) as RuntimeMapData;
      } catch {
        allIssues.push({
          id: `parse-${file}`,
          severity: 'error',
          category: 'parse',
          description: `Failed to parse map JSON: ${file}`,
          location: { file: filePath },
          suggestion: 'Regenerate with pnpm generate:content',
        });
        continue;
      }

      const mapId = data.id ?? file.replace('.json', '');
      allIssues.push(...this.validateLayerOrder(mapId, data, filePath));
      allIssues.push(...this.validateTileSize(mapId, data, filePath));
      allIssues.push(...this.validateLayerDimensions(mapId, data, filePath));
      allIssues.push(...this.validateVisualObjectRefs(mapId, data, filePath));
      allIssues.push(...this.validateTileStringConsistency(mapId, data, filePath));
      mapsAnalyzed += 1;
    }

    const errors = allIssues.filter((i) => i.severity === 'error').length;
    const warnings = allIssues.filter((i) => i.severity === 'warning').length;

    const report: ValidationReport = {
      reportType: 'visual',
      timestamp: formatTimestamp(),
      summary: {
        totalChecks: mapsAnalyzed,
        passed: mapsAnalyzed - errors,
        failed: errors,
        warnings,
      },
      issues: allIssues,
      metadata: {
        validator: 'VisualValidator',
        version: '2.0.0',
        duration: calculateDuration(startTime),
      },
    };

    this.generateReports(report);

    logger.info(
      `Visual validation complete: ${mapsAnalyzed} maps, ${errors} errors, ${warnings} warnings`,
    );
    return report;
  }

  /** layerOrder entries must match the keys in layers. */
  private validateLayerOrder(mapId: string, data: RuntimeMapData, file: string): Issue[] {
    const issues: Issue[] = [];
    const layerKeys = new Set(Object.keys(data.layers));

    for (const name of data.layerOrder) {
      if (!layerKeys.has(name)) {
        issues.push({
          id: `${mapId}-layer-missing-${name}`,
          severity: 'error',
          category: 'layer-order',
          description: `layerOrder references "${name}" but no matching layer data exists`,
          location: { file },
          suggestion: `Add layer data for "${name}" or remove it from layerOrder`,
        });
      }
    }

    for (const key of layerKeys) {
      if (!data.layerOrder.includes(key)) {
        issues.push({
          id: `${mapId}-layer-unlisted-${key}`,
          severity: 'warning',
          category: 'layer-order',
          description: `Layer "${key}" exists in data but is not listed in layerOrder`,
          location: { file },
          suggestion: `Add "${key}" to layerOrder or remove the layer data`,
        });
      }
    }

    return issues;
  }

  /** Tile size must be 16×16 per project rules. */
  private validateTileSize(mapId: string, data: RuntimeMapData, file: string): Issue[] {
    const issues: Issue[] = [];

    if (data.tileWidth !== TILE_SIZE || data.tileHeight !== TILE_SIZE) {
      issues.push({
        id: `${mapId}-tile-size`,
        severity: 'error',
        category: 'tile-alignment',
        description: `Map uses tile size ${data.tileWidth}×${data.tileHeight}, expected ${TILE_SIZE}×${TILE_SIZE}`,
        location: { file },
        expected: { width: TILE_SIZE, height: TILE_SIZE },
        actual: { width: data.tileWidth, height: data.tileHeight },
        suggestion: `Use ${TILE_SIZE}×${TILE_SIZE} tile size`,
      });
    }

    return issues;
  }

  /** Each layer array must have exactly width * height entries. */
  private validateLayerDimensions(mapId: string, data: RuntimeMapData, file: string): Issue[] {
    const issues: Issue[] = [];
    const expected = data.width * data.height;

    for (const [name, tiles] of Object.entries(data.layers)) {
      if (tiles.length !== expected) {
        issues.push({
          id: `${mapId}-layer-dim-${name}`,
          severity: 'error',
          category: 'layer-dimensions',
          description: `Layer "${name}" has ${tiles.length} tiles, expected ${expected} (${data.width}×${data.height})`,
          location: { file },
          expected,
          actual: tiles.length,
        });
      }
    }

    return issues;
  }

  /** Visual objects must have non-empty objectRef strings. */
  private validateVisualObjectRefs(mapId: string, data: RuntimeMapData, file: string): Issue[] {
    const issues: Issue[] = [];

    for (let i = 0; i < data.visuals.length; i++) {
      const v = data.visuals[i];
      if (!v.objectRef || typeof v.objectRef !== 'string' || v.objectRef.trim() === '') {
        issues.push({
          id: `${mapId}-visual-ref-${i}`,
          severity: 'error',
          category: 'visual-ref',
          description: `Visual object at index ${i} has empty or invalid objectRef`,
          location: { file, coordinates: { x: v.x, y: v.y } },
          suggestion: 'Set a valid semantic object reference (e.g., "building.house-red-1")',
        });
      }
    }

    return issues;
  }

  /** Tile strings in layers should follow semantic format (category:name or category.name) or be 0. */
  private validateTileStringConsistency(
    mapId: string,
    data: RuntimeMapData,
    file: string,
  ): Issue[] {
    const issues: Issue[] = [];
    const badTiles = new Set<string>();

    for (const [layerName, tiles] of Object.entries(data.layers)) {
      for (const tile of tiles) {
        if (tile === 0) continue;
        if (typeof tile !== 'string') {
          const key = `${layerName}-type-${typeof tile}`;
          if (!badTiles.has(key)) {
            badTiles.add(key);
            issues.push({
              id: `${mapId}-tile-type-${key}`,
              severity: 'error',
              category: 'tile-format',
              description: `Layer "${layerName}" contains non-string, non-zero tile value (type: ${typeof tile})`,
              location: { file },
              suggestion: 'Tile values must be semantic strings or 0 (empty)',
            });
          }
          continue;
        }
        // Semantic tiles should contain a separator (: or .)
        if (!tile.includes(':') && !tile.includes('.')) {
          const key = `${layerName}-${tile}`;
          if (!badTiles.has(key)) {
            badTiles.add(key);
            issues.push({
              id: `${mapId}-tile-format-${key}`,
              severity: 'warning',
              category: 'tile-format',
              description: `Layer "${layerName}" has tile "${tile}" without semantic separator (: or .)`,
              location: { file },
              suggestion: 'Use semantic format like "terrain:grass" or "ground.dirt"',
            });
          }
        }
      }
    }

    return issues;
  }

  private generateReports(report: ValidationReport): void {
    const jsonPath = join('scripts', 'validation', 'visual-report.json');
    const mdPath = join('scripts', 'validation', 'visual-report.md');

    writeJsonReport(jsonPath, report);

    let markdown = '# Visual Validation Report\n\n';
    markdown += `**Generated:** ${report.timestamp}\n\n`;
    markdown += `**Duration:** ${report.metadata.duration}ms\n\n`;
    markdown += '## Summary\n\n';
    markdown += `- Total maps analyzed: ${report.summary.totalChecks}\n`;
    markdown += `- Passed: ${report.summary.passed}\n`;
    markdown += `- Errors: ${report.summary.failed}\n`;
    markdown += `- Warnings: ${report.summary.warnings}\n\n`;

    if (report.issues.length > 0) {
      markdown += '## Issues\n\n';
      for (const issue of report.issues) {
        markdown += `### ${issue.severity.toUpperCase()}: ${issue.description}\n\n`;
        markdown += `- **File:** ${issue.location.file}\n`;
        markdown += `- **Category:** ${issue.category}\n`;
        if (issue.expected) markdown += `- **Expected:** ${JSON.stringify(issue.expected)}\n`;
        if (issue.actual) markdown += `- **Actual:** ${JSON.stringify(issue.actual)}\n`;
        if (issue.suggestion) markdown += `- **Suggestion:** ${issue.suggestion}\n`;
        markdown += '\n';
      }
    }

    writeMarkdownReport(mdPath, markdown);
    logger.info(`Reports written to ${jsonPath} and ${mdPath}`);
  }
}

function emptyReport(timestamp: string, duration: number): ValidationReport {
  return {
    reportType: 'visual',
    timestamp,
    summary: { totalChecks: 0, passed: 0, failed: 0, warnings: 0 },
    issues: [],
    metadata: { validator: 'VisualValidator', version: '2.0.0', duration },
  };
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new VisualValidator();
  validator.validate().catch((error) => {
    logger.error('Visual validation failed', { error });
    process.exit(1);
  });
}
