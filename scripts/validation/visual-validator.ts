// Visual Validator - validates visual consistency across maps and sprites
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import { logger } from './logger.js';
import { fileExists, readFile, writeJsonReport, writeMarkdownReport, formatTimestamp, calculateDuration } from './utils.js';
import type { ValidationReport, Issue } from './types.js';

interface TMXMap {
  '@_width': number;
  '@_height': number;
  '@_tilewidth': number;
  '@_tileheight': number;
  properties?: { property: Array<{ '@_name': string; '@_value': string; '@_type'?: string }> | { '@_name': string; '@_value': string; '@_type'?: string } };
  tileset?: Array<{ '@_firstgid': number; '@_source': string }> | { '@_firstgid': number; '@_source': string };
  layer?: Array<{ '@_id': string; '@_name': string; '@_width': number; '@_height': number; data: { '#text': string } }> | { '@_id': string; '@_name': string; '@_width': number; '@_height': number; data: { '#text': string } };
}

interface MapAnalysis {
  file: string;
  mapName: string;
  vibrancy: number;
  layers: string[];
  tilesets: string[];
  issues: Issue[];
}

export class VisualValidator {
  private parser: XMLParser;
  private mapsDir = 'main/server/maps/tmx';

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
  }

  private parseProperty(prop: { '@_name': string; '@_value': string; '@_type'?: string } | Array<{ '@_name': string; '@_value': string; '@_type'?: string }>, name: string): string | number | null {
    const props = Array.isArray(prop) ? prop : [prop];
    const found = props.find(p => p['@_name'] === name);
    if (!found) return null;
    if (found['@_type'] === 'int') return Number.parseInt(found['@_value'], 10);
    return found['@_value'];
  }

  private parseTMX(path: string): TMXMap | null {
    try {
      const content = readFile(path);
      const parsed = this.parser.parse(content);
      return parsed.map as TMXMap;
    } catch (error) {
      logger.error(`Failed to parse TMX file: ${path}`, { error });
      return null;
    }
  }

  private validateLayerOrder(layers: string[], file: string): Issue[] {
    const issues: Issue[] = [];
    const expectedOrder = ['ground', 'ground2', 'objects', 'collision'];
    
    for (let i = 0; i < layers.length - 1; i++) {
      const currentIdx = expectedOrder.indexOf(layers[i]);
      const nextIdx = expectedOrder.indexOf(layers[i + 1]);
      
      if (currentIdx !== -1 && nextIdx !== -1 && currentIdx > nextIdx) {
        issues.push({
          id: `layer-order-${i}`,
          severity: 'warning',
          category: 'layer-order',
          description: `Layer '${layers[i]}' appears after '${layers[i + 1]}' but should come before`,
          location: { file },
          expected: expectedOrder,
          actual: layers,
          suggestion: 'Reorder layers to match expected sequence: ground, ground2, objects, collision',
        });
      }
    }
    
    return issues;
  }

  private validateTileAlignment(map: TMXMap, file: string): Issue[] {
    const issues: Issue[] = [];
    const tileWidth = Number(map['@_tilewidth']);
    const tileHeight = Number(map['@_tileheight']);
    
    if (tileWidth !== 32 || tileHeight !== 32) {
      issues.push({
        id: 'tile-size',
        severity: 'error',
        category: 'tile-alignment',
        description: `Map uses non-standard tile size: ${tileWidth}x${tileHeight}`,
        location: { file },
        expected: { width: 32, height: 32 },
        actual: { width: tileWidth, height: tileHeight },
        suggestion: 'Use 32x32 tile size for consistency',
      });
    }
    
    return issues;
  }

  private validateVibrancyTier(vibrancy: number, file: string): Issue[] {
    const issues: Issue[] = [];
    
    if (vibrancy < 0 || vibrancy > 100) {
      issues.push({
        id: 'vibrancy-range',
        severity: 'error',
        category: 'visual-tier',
        description: `Vibrancy value ${vibrancy} is out of valid range`,
        location: { file },
        expected: 'Value between 0 and 100',
        actual: vibrancy,
        suggestion: 'Set vibrancy to a value between 0 (Muted) and 100 (Vivid)',
      });
    }
    
    return issues;
  }

  private analyzeMap(file: string): MapAnalysis | null {
    const fullPath = join(this.mapsDir, file);
    
    if (!fileExists(fullPath)) {
      logger.warn(`Map file not found: ${fullPath}`);
      return null;
    }
    
    const map = this.parseTMX(fullPath);
    if (!map) return null;
    
    const mapName = this.parseProperty(map.properties?.property || [], 'mapName') as string || file;
    const vibrancy = this.parseProperty(map.properties?.property || [], 'vibrancy') as number || 50;
    
    const layers = Array.isArray(map.layer) 
      ? map.layer.map(l => l['@_name']) 
      : map.layer ? [map.layer['@_name']] : [];
    
    const tilesets = Array.isArray(map.tileset)
      ? map.tileset.map(t => t['@_source'])
      : map.tileset ? [map.tileset['@_source']] : [];
    
    const issues: Issue[] = [
      ...this.validateLayerOrder(layers, file),
      ...this.validateTileAlignment(map, file),
      ...this.validateVibrancyTier(vibrancy, file),
    ];
    
    return {
      file,
      mapName,
      vibrancy,
      layers,
      tilesets,
      issues,
    };
  }

  async validate(): Promise<ValidationReport> {
    const startTime = Date.now();
    logger.info('Starting visual validation...');
    
    if (!fileExists(this.mapsDir)) {
      logger.error(`Maps directory not found: ${this.mapsDir}`);
      return {
        reportType: 'visual',
        timestamp: formatTimestamp(),
        summary: { totalChecks: 0, passed: 0, failed: 0, warnings: 0 },
        issues: [],
        metadata: { validator: 'VisualValidator', version: '1.0.0', duration: 0 },
      };
    }
    
    const mapFiles = readdirSync(this.mapsDir).filter(f => f.endsWith('.tmx'));
    logger.info(`Found ${mapFiles.length} map files`);
    
    const analyses: MapAnalysis[] = [];
    const allIssues: Issue[] = [];
    
    for (const [idx, file] of mapFiles.entries()) {
      logger.progress(idx + 1, mapFiles.length, `Analyzing ${file}`);
      const analysis = this.analyzeMap(file);
      if (analysis) {
        analyses.push(analysis);
        allIssues.push(...analysis.issues);
      }
    }
    
    const errors = allIssues.filter(i => i.severity === 'error').length;
    const warnings = allIssues.filter(i => i.severity === 'warning').length;
    const passed = analyses.length - analyses.filter(a => a.issues.length > 0).length;
    
    const report: ValidationReport = {
      reportType: 'visual',
      timestamp: formatTimestamp(),
      summary: {
        totalChecks: analyses.length,
        passed,
        failed: errors,
        warnings,
      },
      issues: allIssues,
      metadata: {
        validator: 'VisualValidator',
        version: '1.0.0',
        duration: calculateDuration(startTime),
      },
    };
    
    this.generateReports(report, analyses);
    
    logger.info(`Visual validation complete: ${passed} passed, ${errors} errors, ${warnings} warnings`);
    return report;
  }

  private generateReports(report: ValidationReport, analyses: MapAnalysis[]): void {
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
    
    markdown += '## Map Details\n\n';
    for (const analysis of analyses) {
      markdown += `### ${analysis.mapName} (${analysis.file})\n\n`;
      markdown += `- **Vibrancy:** ${analysis.vibrancy}\n`;
      markdown += `- **Layers:** ${analysis.layers.join(', ')}\n`;
      markdown += `- **Tilesets:** ${analysis.tilesets.length}\n`;
      markdown += `- **Issues:** ${analysis.issues.length}\n\n`;
    }
    
    writeMarkdownReport(mdPath, markdown);
    logger.info(`Reports written to ${jsonPath} and ${mdPath}`);
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new VisualValidator();
  validator.validate().catch(error => {
    logger.error('Visual validation failed', { error });
    process.exit(1);
  });
}
