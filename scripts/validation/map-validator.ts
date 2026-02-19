import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import type { ValidationReport } from './types.js';
import { logger } from './logger.js';

interface CollisionIssue {
  type: 'missing_collision' | 'incorrect_collision' | 'collision_mismatch';
  location: { x: number; y: number };
  description: string;
  visualTile: string;
  collisionValue: boolean;
}

interface BoundaryIssue {
  type: 'missing_boundary_collision' | 'walkable_edge';
  location: { x: number; y: number };
  description: string;
}

interface TransitionIssue {
  transitionId: string;
  type: 'missing_reverse' | 'wrong_destination' | 'missing_prerequisite';
  sourceMap: string;
  destinationMap: string;
  description: string;
}

interface MapReport {
  mapName: string;
  mapPath: string;
  collisionIssues: CollisionIssue[];
  boundaryIssues: BoundaryIssue[];
  transitionIssues: TransitionIssue[];
  reachable: boolean;
}

export class MapValidator {
  private parser: XMLParser;
  private mapsDir = 'dist/assets';

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
  }

  async validateAllMaps(): Promise<ValidationReport> {
    const startTime = Date.now();
    logger.info('Starting map validation...');

    const mapFiles = readdirSync(this.mapsDir).filter((f) => f.endsWith('.tmx'));
    const reports: MapReport[] = [];

    for (const mapFile of mapFiles) {
      const mapPath = join(this.mapsDir, mapFile);
      logger.info(`Validating map: ${mapFile}`);
      const report = await this.validateMap(mapPath);
      reports.push(report);
    }

    const reachabilityReport = this.validateMapReachability(reports);

    const totalIssues =
      reports.reduce((sum, r) => sum + r.collisionIssues.length, 0) +
      reports.reduce((sum, r) => sum + r.boundaryIssues.length, 0) +
      reports.reduce((sum, r) => sum + r.transitionIssues.length, 0);

    const duration = Date.now() - startTime;
    logger.info(`Map validation complete. Found ${totalIssues} issues in ${duration}ms`);

    return {
      reportType: 'map',
      timestamp: new Date().toISOString(),
      summary: {
        totalChecks: reports.length,
        passed: reports.filter((r) => r.collisionIssues.length === 0 && r.boundaryIssues.length === 0).length,
        failed: reports.filter((r) => r.collisionIssues.length > 0 || r.boundaryIssues.length > 0).length,
        warnings: 0,
      },
      issues: this.convertToIssues(reports),
      metadata: {
        validator: 'MapValidator',
        version: '1.0.0',
        duration,
      },
      maps: reports,
      reachability: reachabilityReport,
    };
  }

  private async validateMap(mapPath: string): Promise<MapReport> {
    const mapName = mapPath.split('/').pop()?.replace('.tmx', '') || 'unknown';
    const xmlContent = readFileSync(mapPath, 'utf-8');
    const mapData = this.parser.parse(xmlContent);

    const map = mapData.map;
    const width = Number(map['@_width']);
    const height = Number(map['@_height']);

    const collisionIssues = this.validateCollisionLayer(map, width, height);
    const boundaryIssues = this.validateBoundaries(map, width, height);
    const transitionIssues: TransitionIssue[] = [];

    return {
      mapName,
      mapPath,
      collisionIssues,
      boundaryIssues,
      transitionIssues,
      reachable: true,
    };
  }

  private validateCollisionLayer(map: any, width: number, height: number): CollisionIssue[] {
    const issues: CollisionIssue[] = [];
    const layers = Array.isArray(map.layer) ? map.layer : [map.layer];
    const collisionLayer = layers.find((l: any) => l['@_name'] === 'collision');

    if (!collisionLayer) {
      logger.warn('No collision layer found in map');
      return issues;
    }

    const collisionData = this.parseLayerData(collisionLayer.data);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const hasCollision = collisionData[index] > 0;
      }
    }

    return issues;
  }

  private validateBoundaries(map: any, width: number, height: number): BoundaryIssue[] {
    const issues: BoundaryIssue[] = [];
    const layers = Array.isArray(map.layer) ? map.layer : [map.layer];
    const collisionLayer = layers.find((l: any) => l['@_name'] === 'collision');

    if (!collisionLayer) {
      return issues;
    }

    const collisionData = this.parseLayerData(collisionLayer.data);

    for (let x = 0; x < width; x++) {
      const topIndex = x;
      const bottomIndex = (height - 1) * width + x;

      if (collisionData[topIndex] === 0) {
        issues.push({
          type: 'walkable_edge',
          location: { x, y: 0 },
          description: `Top edge tile at (${x}, 0) is walkable - player could walk off map`,
        });
      }

      if (collisionData[bottomIndex] === 0) {
        issues.push({
          type: 'walkable_edge',
          location: { x, y: height - 1 },
          description: `Bottom edge tile at (${x}, ${height - 1}) is walkable - player could walk off map`,
        });
      }
    }

    for (let y = 0; y < height; y++) {
      const leftIndex = y * width;
      const rightIndex = y * width + (width - 1);

      if (collisionData[leftIndex] === 0) {
        issues.push({
          type: 'walkable_edge',
          location: { x: 0, y },
          description: `Left edge tile at (0, ${y}) is walkable - player could walk off map`,
        });
      }

      if (collisionData[rightIndex] === 0) {
        issues.push({
          type: 'walkable_edge',
          location: { x: width - 1, y },
          description: `Right edge tile at (${width - 1}, ${y}) is walkable - player could walk off map`,
        });
      }
    }

    return issues;
  }

  private validateMapReachability(reports: MapReport[]): { unreachableMaps: string[] } {
    return { unreachableMaps: [] };
  }

  private parseLayerData(data: any): number[] {
    if (typeof data === 'string') {
      return data
        .trim()
        .split(',')
        .map((v) => Number(v.trim()));
    }
    if (data['#text']) {
      return data['#text']
        .trim()
        .split(',')
        .map((v: string) => Number(v.trim()));
    }
    return [];
  }

  private convertToIssues(reports: MapReport[]): any[] {
    const issues: any[] = [];

    for (const report of reports) {
      for (const issue of report.collisionIssues) {
        issues.push({
          id: `${report.mapName}-collision-${issue.location.x}-${issue.location.y}`,
          severity: 'error',
          category: 'collision',
          description: issue.description,
          location: {
            file: report.mapPath,
            coordinates: issue.location,
          },
        });
      }

      for (const issue of report.boundaryIssues) {
        issues.push({
          id: `${report.mapName}-boundary-${issue.location.x}-${issue.location.y}`,
          severity: 'error',
          category: 'boundary',
          description: issue.description,
          location: {
            file: report.mapPath,
            coordinates: issue.location,
          },
        });
      }
    }

    return issues;
  }
}
