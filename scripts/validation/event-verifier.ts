// Event Verifier - validates event placement and wiring across all maps
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
  objectgroup?: Array<{ '@_name': string; object?: TMXObject | TMXObject[] }> | { '@_name': string; object?: TMXObject | TMXObject[] };
}

interface TMXObject {
  '@_id': number;
  '@_name': string;
  '@_type'?: string;
  '@_x': number;
  '@_y': number;
  '@_width'?: number;
  '@_height'?: number;
  properties?: { property: Array<{ '@_name': string; '@_value': string }> | { '@_name': string; '@_value': string } };
}

interface EventDoc {
  eventId: string;
  mapName: string;
  position: { x: number; y: number };
  trigger: 'touch' | 'action' | 'auto' | 'parallel';
  repeat: 'once' | 'repeat' | 'quest' | 'conditional';
  linkedQuest?: string;
  npc?: string;
  graphic?: string;
  description: string;
}

interface EventAnalysis {
  file: string;
  mapName: string;
  documentedEvents: number;
  foundEvents: number;
  missingEvents: string[];
  undocumentedEvents: string[];
  issues: Issue[];
}

export class EventVerifier {
  private parser: XMLParser;
  private mapsDir = 'main/server/maps/tmx';
  private docsPath = 'docs/maps/event-placement.md';

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
  }

  private parseProperty(prop: { '@_name': string; '@_value': string } | Array<{ '@_name': string; '@_value': string }>, name: string): string | null {
    const props = Array.isArray(prop) ? prop : [prop];
    const found = props.find(p => p['@_name'] === name);
    return found ? found['@_value'] : null;
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

  private parseEventDocs(): Map<string, EventDoc[]> {
    const eventsByMap = new Map<string, EventDoc[]>();
    
    if (!fileExists(this.docsPath)) {
      logger.warn(`Event documentation not found: ${this.docsPath}`);
      return eventsByMap;
    }

    const content = readFile(this.docsPath);
    const lines = content.split('\n');
    
    let currentMap = '';
    const mapLabelToName: Record<string, string> = {
      'Village Hub': 'village-hub',
      'Heartfield': 'heartfield',
      'Ambergrove': 'ambergrove',
      'Millbrook': 'millbrook',
      'Sunridge': 'sunridge',
      'Shimmer Marsh': 'shimmer-marsh',
      'Hollow Ridge': 'hollow-ridge',
      'Flickerveil': 'flickerveil',
      'Resonance Fields': 'resonance-fields',
      'Luminous Wastes': 'luminous-wastes',
      'Undrawn Peaks': 'undrawn-peaks',
      'Half-Drawn Forest': 'half-drawn-forest',
      'Half Drawn Forest': 'half-drawn-forest',
      'Depths Level 1': 'depths-l1',
      'Depths L1': 'depths-l1',
      'Depths L1 R1': 'depths-l1',
      'Depths L1 R2': 'depths-l1',
      'Depths L1 R3': 'depths-l1',
      'Depths L1 R4': 'depths-l1',
      'Depths Level 2': 'depths-l2',
      'Depths L2': 'depths-l2',
      'Depths L2 R1': 'depths-l2',
      'Depths L2 R2': 'depths-l2',
      'Depths L2 R3': 'depths-l2',
      'Depths L2 R4': 'depths-l2',
      'Depths L2 R5': 'depths-l2',
      'Depths L2 R6': 'depths-l2',
      'Depths L2 R7': 'depths-l2',
      'Depths Level 3': 'depths-l3',
      'Depths L3': 'depths-l3',
      'Depths L3 R1': 'depths-l3',
      'Depths L3 R2': 'depths-l3',
      'Depths L3 R3': 'depths-l3',
      'Depths L3 R5': 'depths-l3',
      'Depths L3 R6': 'depths-l3',
      'Depths L3 R8': 'depths-l3',
      'Depths Level 4': 'depths-l4',
      'Depths L4': 'depths-l4',
      'Depths L4 R1': 'depths-l4',
      'Depths L4 R2': 'depths-l4',
      'Depths L4 R3': 'depths-l4',
      'Depths L4 R4': 'depths-l4',
      'Depths L4 R5': 'depths-l4',
      'Depths L4 R6': 'depths-l4',
      'Depths L4 R7': 'depths-l4',
      'Depths Level 5': 'depths-l5',
      'Depths L5': 'depths-l5',
      'Depths L5 R1': 'depths-l5',
      'Depths L5 R2': 'depths-l5',
      'Depths L5 R3': 'depths-l5',
      'Depths L5 R5': 'depths-l5',
      'Depths L5 R6': 'depths-l5',
      'Depths L5 R7': 'depths-l5',
      'Depths L5 R8': 'depths-l5',
      'Depths L5 R9': 'depths-l5',
      'Depths L5 R10': 'depths-l5',
      'Fortress Floor 1': 'fortress-f1',
      'Fortress F1': 'fortress-f1',
      'Fortress F1 R2': 'fortress-f1',
      'Fortress F1 R3': 'fortress-f1',
      'Fortress F1 R5': 'fortress-f1',
      'Fortress F1 R6': 'fortress-f1',
      'Fortress Floor 2': 'fortress-f2',
      'Fortress F2': 'fortress-f2',
      'Fortress F2 R4': 'fortress-f2',
      'Fortress F2 R5': 'fortress-f2',
      'Fortress F2 R6': 'fortress-f2',
      'Fortress Floor 3': 'fortress-f3',
      'Fortress F3': 'fortress-f3',
      'Fortress F3 R1': 'fortress-f3',
      'Fortress F3 R2': 'fortress-f3',
      'SQ-03 sites': 'ambergrove',
    };

    for (const line of lines) {
      // Detect map section headers - match any section with a map name
      if (line.startsWith('### ')) {
        // Try to extract map name from section header
        // Format: "### Map Name [optional suffix]"
        const headerText = line.substring(4).trim();
        
        // Try each known map label to see if it's in the header
        for (const [label, name] of Object.entries(mapLabelToName)) {
          if (headerText.startsWith(label)) {
            currentMap = name;
            break;
          }
        }
      }

      // Parse table rows (event data)
      if (line.startsWith('| EV-')) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p);
        
        // Detect table format by checking if second column is a map name or position
        const secondCol = parts[1];
        const hasMapColumn = !secondCol.match(/\(\d+,\s*\d+\)/);
        
        if (hasMapColumn) {
          // Format 2: Map name in table (e.g., | EV-VH-016 | Village Hub | (0, 0) | ...)
          const eventId = parts[0];
          const mapLabel = parts[1];
          const mapName = mapLabelToName[mapLabel] || '';
          
          if (mapName) {
            const posMatch = parts[2].match(/\((\d+),\s*(\d+)\)/);
            if (posMatch) {
              const event: EventDoc = {
                eventId,
                mapName,
                position: { x: Number.parseInt(posMatch[1], 10), y: Number.parseInt(posMatch[2], 10) },
                trigger: parts[4] as EventDoc['trigger'],
                repeat: parts[parts.length - 1] as EventDoc['repeat'],
                linkedQuest: parts.length >= 6 && parts[5] !== '—' ? parts[5] : undefined,
                description: parts.length >= 7 ? parts[6] : '',
              };

              if (!eventsByMap.has(mapName)) {
                eventsByMap.set(mapName, []);
              }
              eventsByMap.get(mapName)?.push(event);
            }
          }
        } else if (currentMap) {
          // Format 1: Map name in section header (e.g., ### Village Hub NPCs)
          const eventId = parts[0];
          const posMatch = parts[1].match(/\((\d+),\s*(\d+)\)/);
          if (posMatch) {
            const event: EventDoc = {
              eventId,
              mapName: currentMap,
              position: { x: Number.parseInt(posMatch[1], 10), y: Number.parseInt(posMatch[2], 10) },
              trigger: parts[2] as EventDoc['trigger'],
              repeat: parts[3] as EventDoc['repeat'],
              linkedQuest: parts.length >= 7 && parts[4] !== '—' ? parts[4] : undefined,
              npc: parts.length >= 7 && parts[5] !== '—' ? parts[5] : undefined,
              graphic: parts.length >= 7 && parts[6] !== '—' ? parts[6] : undefined,
              description: parts[parts.length - 1] || '',
            };

            if (!eventsByMap.has(currentMap)) {
              eventsByMap.set(currentMap, []);
            }
            eventsByMap.get(currentMap)?.push(event);
          }
        }
      }
    }

    return eventsByMap;
  }

  private extractMapEvents(map: TMXMap): TMXObject[] {
    const events: TMXObject[] = [];
    
    if (!map.objectgroup) return events;

    const objectGroups = Array.isArray(map.objectgroup) ? map.objectgroup : [map.objectgroup];
    
    for (const group of objectGroups) {
      if (group['@_name'] === 'events' && group.object) {
        const objects = Array.isArray(group.object) ? group.object : [group.object];
        events.push(...objects);
      }
    }

    return events;
  }

  private verifyEvents(mapFile: string, mapName: string, documentedEvents: EventDoc[]): EventAnalysis {
    const analysis: EventAnalysis = {
      file: mapFile,
      mapName,
      documentedEvents: documentedEvents.length,
      foundEvents: 0,
      missingEvents: [],
      undocumentedEvents: [],
      issues: [],
    };

    const map = this.parseTMX(mapFile);
    if (!map) {
      analysis.issues.push({
        id: 'parse-error',
        severity: 'error',
        category: 'parse',
        description: `Failed to parse TMX file: ${mapFile}`,
        location: { file: mapFile },
      });
      return analysis;
    }

    const mapEvents = this.extractMapEvents(map);
    const tileWidth = Number(map['@_tilewidth']);
    const tileHeight = Number(map['@_tileheight']);

    // Track which documented events were found
    const foundEventIds = new Set<string>();

    // Check each documented event
    for (const docEvent of documentedEvents) {
      const expectedX = docEvent.position.x * tileWidth;
      const expectedY = docEvent.position.y * tileHeight;

      const matchingEvent = mapEvents.find(e => {
        const eventX = Number(e['@_x']);
        const eventY = Number(e['@_y']);
        return Math.abs(eventX - expectedX) < tileWidth && Math.abs(eventY - expectedY) < tileHeight;
      });

      if (matchingEvent) {
        foundEventIds.add(docEvent.eventId);
        analysis.foundEvents++;
      } else {
        analysis.missingEvents.push(docEvent.eventId);
        analysis.issues.push({
          id: `missing-${docEvent.eventId}`,
          severity: 'error',
          category: 'missing-event',
          description: `Event ${docEvent.eventId} not found at documented position`,
          location: {
            file: mapFile,
            coordinates: docEvent.position,
          },
          expected: docEvent,
          suggestion: `Add event at tile coordinates (${docEvent.position.x}, ${docEvent.position.y})`,
        });
      }
    }

    // Check for undocumented events
    for (const mapEvent of mapEvents) {
      const eventName = mapEvent['@_name'];
      if (!foundEventIds.has(eventName) && eventName.startsWith('EV-')) {
        analysis.undocumentedEvents.push(eventName);
        analysis.issues.push({
          id: `undocumented-${eventName}`,
          severity: 'warning',
          category: 'undocumented-event',
          description: `Event ${eventName} found in map but not documented`,
          location: {
            file: mapFile,
            coordinates: {
              x: Math.floor(Number(mapEvent['@_x']) / tileWidth),
              y: Math.floor(Number(mapEvent['@_y']) / tileHeight),
            },
          },
          suggestion: 'Add event to event-placement.md or remove from map',
        });
      }
    }

    return analysis;
  }

  public async validate(): Promise<ValidationReport> {
    const startTime = Date.now();
    logger.info('Starting event verification...');

    const eventsByMap = this.parseEventDocs();
    logger.info(`Parsed ${eventsByMap.size} maps from event documentation`);

    const analyses: EventAnalysis[] = [];
    let totalDocumented = 0;
    let totalFound = 0;
    let totalMissing = 0;
    let totalUndocumented = 0;

    if (!fileExists(this.mapsDir)) {
      logger.error(`Maps directory not found: ${this.mapsDir}`);
      return {
        reportType: 'event',
        timestamp: formatTimestamp(new Date()),
        summary: {
          totalChecks: 0,
          passed: 0,
          failed: 0,
          warnings: 0,
        },
        issues: [],
        metadata: {
          validator: 'EventVerifier',
          version: '1.0.0',
          duration: calculateDuration(startTime),
        },
      };
    }

    const mapFiles = readdirSync(this.mapsDir).filter(f => f.endsWith('.tmx'));

    for (const mapFile of mapFiles) {
      const mapPath = join(this.mapsDir, mapFile);
      const mapName = mapFile.replace('.tmx', '');
      const documentedEvents = eventsByMap.get(mapName) || [];

      const analysis = this.verifyEvents(mapPath, mapName, documentedEvents);
      analyses.push(analysis);

      totalDocumented += analysis.documentedEvents;
      totalFound += analysis.foundEvents;
      totalMissing += analysis.missingEvents.length;
      totalUndocumented += analysis.undocumentedEvents.length;

      logger.info(`${mapName}: ${analysis.foundEvents}/${analysis.documentedEvents} events found`);
    }

    const allIssues = analyses.flatMap(a => a.issues);
    const errors = allIssues.filter(i => i.severity === 'error').length;
    const warnings = allIssues.filter(i => i.severity === 'warning').length;

    const report: ValidationReport = {
      reportType: 'event',
      timestamp: formatTimestamp(new Date()),
      summary: {
        totalChecks: totalDocumented,
        passed: totalFound,
        failed: errors,
        warnings,
      },
      issues: allIssues,
      metadata: {
        validator: 'EventVerifier',
        version: '1.0.0',
        duration: calculateDuration(startTime),
      },
    };

    logger.info(`Event verification complete: ${totalFound}/${totalDocumented} events found, ${totalMissing} missing, ${totalUndocumented} undocumented`);

    return report;
  }

  public async generateReports(): Promise<void> {
    const report = await this.validate();

    // Write JSON report
    writeJsonReport('scripts/validation/event-report.json', report);

    // Write Markdown report
    const markdown = this.formatMarkdownReport(report);
    writeMarkdownReport('scripts/validation/event-report.md', markdown);

    logger.info('Event reports generated successfully');
  }

  private formatMarkdownReport(report: ValidationReport): string {
    const lines: string[] = [];

    lines.push('# Event Verification Report');
    lines.push('');
    lines.push(`**Generated:** ${report.timestamp}`);
    lines.push(`**Validator:** ${report.metadata.validator} v${report.metadata.version}`);
    lines.push(`**Duration:** ${report.metadata.duration}ms`);
    lines.push('');

    lines.push('## Summary');
    lines.push('');
    lines.push(`- **Total Documented Events:** ${report.summary.totalChecks}`);
    lines.push(`- **Events Found:** ${report.summary.passed}`);
    lines.push(`- **Missing Events:** ${report.summary.failed}`);
    lines.push(`- **Undocumented Events:** ${report.summary.warnings}`);
    lines.push('');

    if (report.issues.length === 0) {
      lines.push('✅ **All events verified successfully!**');
      lines.push('');
      return lines.join('\n');
    }

    const errors = report.issues.filter(i => i.severity === 'error');
    const warnings = report.issues.filter(i => i.severity === 'warning');

    if (errors.length > 0) {
      lines.push('## Missing Events');
      lines.push('');
      for (const issue of errors) {
        lines.push(`### ${issue.id}`);
        lines.push('');
        lines.push(`- **File:** ${issue.location.file}`);
        if (issue.location.coordinates) {
          lines.push(`- **Expected Position:** (${issue.location.coordinates.x}, ${issue.location.coordinates.y})`);
        }
        lines.push(`- **Description:** ${issue.description}`);
        if (issue.suggestion) {
          lines.push(`- **Suggestion:** ${issue.suggestion}`);
        }
        lines.push('');
      }
    }

    if (warnings.length > 0) {
      lines.push('## Undocumented Events');
      lines.push('');
      for (const issue of warnings) {
        lines.push(`### ${issue.id}`);
        lines.push('');
        lines.push(`- **File:** ${issue.location.file}`);
        if (issue.location.coordinates) {
          lines.push(`- **Position:** (${issue.location.coordinates.x}, ${issue.location.coordinates.y})`);
        }
        lines.push(`- **Description:** ${issue.description}`);
        if (issue.suggestion) {
          lines.push(`- **Suggestion:** ${issue.suggestion}`);
        }
        lines.push('');
      }
    }

    return lines.join('\n');
  }
}
