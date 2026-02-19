#!/usr/bin/env tsx

import { readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

interface TilesetInfo {
  name: string;
  path: string;
  hasTMX: boolean;
  hasTSX: boolean;
  hasRules: boolean;
  tmxFiles: string[];
  tsxFiles: string[];
  rulesFiles: string[];
  suggestedZone: string;
  priority: 'high' | 'medium' | 'low';
}

const TILESET_ROOT = 'assets/tilesets';

// Map tileset names to game zones based on naming and content
function suggestZone(tilesetName: string): string {
  const name = tilesetName.toLowerCase();
  
  if (name.includes('dungeon') || name.includes('cave') || name.includes('natural-interior')) {
    return 'Depths / Dungeons';
  }
  if (name.includes('castle') || name.includes('fortress')) {
    return 'Fortress / Castle';
  }
  if (name.includes('interior')) {
    return 'Village / Interiors';
  }
  if (name.includes('town') || name.includes('village')) {
    return 'Village Hub';
  }
  if (name.includes('forest') || name.includes('lonesome')) {
    return 'Forgotten Realm';
  }
  if (name.includes('snow') || name.includes('winter')) {
    return 'Sketch Realm (Winter)';
  }
  if (name.includes('desert') || name.includes('sand')) {
    return 'Sketch Realm (Desert)';
  }
  if (name.includes('season') || name.includes('premium') || name.includes('free')) {
    return 'Multiple Zones (Versatile)';
  }
  if (name.includes('world-map')) {
    return 'Overworld Map';
  }
  if (name.includes('backterria') || name.includes('32px')) {
    return 'Custom 32px (Mnemonic Realms style)';
  }
  
  return 'Unassigned';
}

function findFiles(dir: string, extension: string): string[] {
  const results: string[] = [];
  
  function scan(currentDir: string) {
    try {
      const entries = readdirSync(currentDir);
      
      for (const entry of entries) {
        const fullPath = join(currentDir, entry);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          scan(fullPath);
        } else if (entry.endsWith(extension)) {
          results.push(relative(TILESET_ROOT, fullPath));
        }
      }
    } catch (err) {
      // Skip directories we can't read
    }
  }
  
  scan(dir);
  return results;
}

function auditTilesets(): TilesetInfo[] {
  const tilesets: TilesetInfo[] = [];
  const tilesetDirs = readdirSync(TILESET_ROOT);
  
  for (const dir of tilesetDirs) {
    const fullPath = join(TILESET_ROOT, dir);
    const stat = statSync(fullPath);
    
    if (!stat.isDirectory()) continue;
    
    const tmxFiles = findFiles(fullPath, '.tmx');
    const tsxFiles = findFiles(fullPath, '.tsx');
    const rulesFiles = tmxFiles.filter(f => f.toLowerCase().includes('rules'));
    
    const hasTMX = tmxFiles.length > 0;
    const hasTSX = tsxFiles.length > 0;
    const hasRules = rulesFiles.length > 0;
    
    // Priority: High if has TMX+TSX+Rules, Medium if has TMX+TSX, Low otherwise
    let priority: 'high' | 'medium' | 'low' = 'low';
    if (hasTMX && hasTSX && hasRules) {
      priority = 'high';
    } else if (hasTMX && hasTSX) {
      priority = 'medium';
    }
    
    tilesets.push({
      name: dir,
      path: relative(process.cwd(), fullPath),
      hasTMX,
      hasTSX,
      hasRules,
      tmxFiles,
      tsxFiles,
      rulesFiles,
      suggestedZone: suggestZone(dir),
      priority
    });
  }
  
  // Sort by priority (high first) then by name
  tilesets.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return a.name.localeCompare(b.name);
  });
  
  return tilesets;
}

function generateReport(tilesets: TilesetInfo[]): string {
  let report = '# Tileset Asset Inventory\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  
  report += '## Summary\n\n';
  report += `- Total tilesets: ${tilesets.length}\n`;
  report += `- High priority (TMX+TSX+Rules): ${tilesets.filter(t => t.priority === 'high').length}\n`;
  report += `- Medium priority (TMX+TSX): ${tilesets.filter(t => t.priority === 'medium').length}\n`;
  report += `- Low priority (no TMX/TSX): ${tilesets.filter(t => t.priority === 'low').length}\n\n`;
  
  report += '## Tilesets by Priority\n\n';
  
  for (const priority of ['high', 'medium', 'low'] as const) {
    const filtered = tilesets.filter(t => t.priority === priority);
    if (filtered.length === 0) continue;
    
    report += `### ${priority.toUpperCase()} Priority\n\n`;
    
    for (const tileset of filtered) {
      report += `#### ${tileset.name}\n\n`;
      report += `- **Path:** \`${tileset.path}\`\n`;
      report += `- **Suggested Zone:** ${tileset.suggestedZone}\n`;
      report += `- **TMX Files:** ${tileset.tmxFiles.length}\n`;
      report += `- **TSX Files:** ${tileset.tsxFiles.length}\n`;
      report += `- **Rules Files:** ${tileset.rulesFiles.length}\n`;
      
      if (tileset.tmxFiles.length > 0) {
        report += `- **Example TMX:** \`${tileset.tmxFiles[0]}\`\n`;
      }
      
      report += '\n';
    }
  }
  
  report += '## Zone Mapping\n\n';
  
  const zoneMap = new Map<string, TilesetInfo[]>();
  for (const tileset of tilesets) {
    const zone = tileset.suggestedZone;
    if (!zoneMap.has(zone)) {
      zoneMap.set(zone, []);
    }
    zoneMap.get(zone)!.push(tileset);
  }
  
  for (const [zone, tilesetList] of Array.from(zoneMap.entries()).sort()) {
    report += `### ${zone}\n\n`;
    for (const tileset of tilesetList) {
      report += `- **${tileset.name}** (${tileset.priority} priority)\n`;
    }
    report += '\n';
  }
  
  return report;
}

function generateJSON(tilesets: TilesetInfo[]): string {
  return JSON.stringify({
    generated: new Date().toISOString(),
    summary: {
      total: tilesets.length,
      highPriority: tilesets.filter(t => t.priority === 'high').length,
      mediumPriority: tilesets.filter(t => t.priority === 'medium').length,
      lowPriority: tilesets.filter(t => t.priority === 'low').length
    },
    tilesets
  }, null, 2);
}

// Main execution
console.log('🔍 Auditing tileset assets...\n');

const tilesets = auditTilesets();

console.log(`Found ${tilesets.length} tilesets:\n`);
console.log(`  ✅ High priority (TMX+TSX+Rules): ${tilesets.filter(t => t.priority === 'high').length}`);
console.log(`  ⚠️  Medium priority (TMX+TSX): ${tilesets.filter(t => t.priority === 'medium').length}`);
console.log(`  ℹ️  Low priority (no TMX/TSX): ${tilesets.filter(t => t.priority === 'low').length}\n`);

// Write reports
const reportMd = generateReport(tilesets);
const reportJson = generateJSON(tilesets);

writeFileSync('scripts/validation/tileset-inventory.md', reportMd);
writeFileSync('scripts/validation/tileset-inventory.json', reportJson);

console.log('📄 Reports generated:');
console.log('  - scripts/validation/tileset-inventory.md');
console.log('  - scripts/validation/tileset-inventory.json\n');

console.log('✅ Audit complete!');
