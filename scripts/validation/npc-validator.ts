import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import type { ValidationReport } from './types.js';

interface NPCEntry {
  eventId: string;
  map: string;
  position: { x: number; y: number };
  npc: string;
  graphic: string;
  linkedQuest: string;
  description: string;
}

interface TMXObject {
  '@_name': string;
  '@_x': string;
  '@_y': string;
  '@_type'?: string;
}

export class NPCValidator {
  private npcs: NPCEntry[] = [];
  private errors: string[] = [];
  private warnings: string[] = [];

  validate(): ValidationReport {
    const startTime = Date.now();

    this.parseNPCDocumentation();
    this.validateNPCPlacements();

    return {
      validator: 'NPC Validator',
      timestamp: new Date().toISOString(),
      totalChecked: this.npcs.length,
      passed: this.npcs.length - this.errors.length,
      failed: this.errors.length,
      warnings: this.warnings.length,
      errors: this.errors,
      warningMessages: this.warnings,
      metadata: {
        duration: Date.now() - startTime,
        npcsChecked: this.npcs.length,
      },
    };
  }

  private parseNPCDocumentation(): void {
    const docPath = join(process.cwd(), 'docs/maps/event-placement.md');
    const content = readFileSync(docPath, 'utf-8');

    const lines = content.split('\n');
    let currentMap = '';
    let inNPCSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Detect section header for NPC events
      if (line.startsWith('### ') && line.includes('NPC')) {
        // Skip "NPC Movement Patterns" section (reference table, not event placements)
        if (line.includes('Movement Patterns')) {
          inNPCSection = false;
          continue;
        }
        currentMap = line.replace('### ', '').replace(' NPCs', '').trim();
        inNPCSection = true;
        continue;
      }

      // Exit NPC section when we hit a new section
      if (line.startsWith('## Section') || line.startsWith('---')) {
        inNPCSection = false;
        continue;
      }

      // Parse table rows (skip header and separator)
      if (inNPCSection && line.startsWith('| EV-') && !line.includes('Event ID')) {
        const parts = line.split('|').map((p) => p.trim());
        if (parts.length >= 8) {
          const eventId = parts[1];
          const position = this.parsePosition(parts[2]);
          const npc = parts[6];
          const graphic = parts[7].replace(/`/g, '');
          const linkedQuest = parts[5];
          const description = parts[8];

          if (position && npc && npc !== '—' && npc !== 'Quest Board') {
            this.npcs.push({
              eventId,
              map: this.normalizeMapName(currentMap),
              position,
              npc,
              graphic,
              linkedQuest,
              description,
            });
          }
        }
      }
    }
  }

  private parsePosition(posStr: string): { x: number; y: number } | null {
    const match = posStr.match(/\((\d+),\s*(\d+)\)/);
    if (match) {
      return { x: Number.parseInt(match[1]), y: Number.parseInt(match[2]) };
    }
    return null;
  }

  private normalizeMapName(name: string): string {
    const mapNames: Record<string, string> = {
      'Everwick': 'everwick',
      Heartfield: 'heartfield',
      Ambergrove: 'ambergrove',
      Millbrook: 'millbrook',
      Sunridge: 'sunridge',
      'Shimmer Marsh': 'shimmer-marsh',
      'Ridgewalker Camp': 'ridgewalker-camp',
      'Resonance Fields': 'resonance-fields',
      'Flickering Village': 'flickering-village',
      "Listener's Camp": 'listeners-camp',
    };
    return mapNames[name] || name.toLowerCase().replace(/\s+/g, '-');
  }

  private validateNPCPlacements(): void {
    const mapsDir = join(process.cwd(), 'dist/assets');
    const parser = new XMLParser({ ignoreAttributes: false });

    for (const npc of this.npcs) {
      const mapPath = join(mapsDir, `${npc.map}.tmx`);

      try {
        const tmxContent = readFileSync(mapPath, 'utf-8');
        const tmxData = parser.parse(tmxContent);
        const map = tmxData.map;

        if (!map) {
          this.errors.push(`${npc.eventId}: Map file ${npc.map}.tmx has invalid structure`);
          continue;
        }

        const tileWidth = Number(map['@_tilewidth']);
        const tileHeight = Number(map['@_tileheight']);

        // Find NPC in object groups
        const objectGroups = Array.isArray(map.objectgroup)
          ? map.objectgroup
          : [map.objectgroup].filter(Boolean);

        let found = false;
        for (const group of objectGroups) {
          if (!group?.object) continue;

          const objects = Array.isArray(group.object) ? group.object : [group.object];

          for (const obj of objects) {
            const objName = obj['@_name'];
            const objX = Number(obj['@_x']) / tileWidth;
            const objY = Number(obj['@_y']) / tileHeight;

            // Match by event ID or NPC name
            if (objName === npc.eventId || objName.includes(npc.npc)) {
              // Check position match (allow 1 tile tolerance)
              const xDiff = Math.abs(objX - npc.position.x);
              const yDiff = Math.abs(objY - npc.position.y);

              if (xDiff <= 1 && yDiff <= 1) {
                found = true;
                break;
              }
            }
          }

          if (found) break;
        }

        if (!found) {
          this.warnings.push(
            `${npc.eventId}: NPC "${npc.npc}" not found at documented position (${npc.position.x}, ${npc.position.y}) on map ${npc.map}`,
          );
        }
      } catch (error) {
        this.warnings.push(
          `${npc.eventId}: Could not validate NPC "${npc.npc}" on map ${npc.map} (map file may not exist yet)`,
        );
      }
    }
  }
}
