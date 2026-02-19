import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const reportPath = join(process.cwd(), 'scripts/validation/event-report.json');
const docPath = join(process.cwd(), 'docs/maps/event-placement.md');

const report = JSON.parse(readFileSync(reportPath, 'utf-8'));
const doc = readFileSync(docPath, 'utf-8');

// Group undocumented events by map
const eventsByMap: Record<string, Array<{ id: string; x: number; y: number }>> = {};

for (const issue of report.issues) {
  if (issue.category === 'undocumented-event') {
    const match = issue.location.file.match(/\/([^/]+)\.tmx$/);
    if (!match) continue;
    
    const mapName = match[1];
    const eventId = issue.id.replace('undocumented-', '');
    const { x, y } = issue.location.coordinates;
    
    if (!eventsByMap[mapName]) eventsByMap[mapName] = [];
    eventsByMap[mapName].push({ id: eventId, x, y });
  }
}

// Determine event type and description
function getEventInfo(id: string): { trigger: string; repeat: string; desc: string } {
  if (id.includes('-Up') || id.includes('-Down') || id.includes('-North') || id.includes('-South') || id.includes('-East') || id.includes('-West')) {
    return { trigger: 'touch', repeat: 'repeat', desc: 'Map transition' };
  }
  if (id.includes('-Boss') || id.includes('-Climax') || id.includes('-Return')) {
    return { trigger: 'touch', repeat: 'once', desc: 'Boss encounter trigger' };
  }
  if (id.includes('-Fortress')) {
    return { trigger: 'touch', repeat: 'repeat', desc: 'Fortress entrance' };
  }
  return { trigger: 'action', repeat: 'repeat', desc: 'Chest or stone' };
}

// Append new sections to doc
let newDoc = doc;

// Add Section 2: Map Transitions if not exists
if (!newDoc.includes('## Section 2: Map Transitions')) {
  newDoc += '\n\n## Section 2: Map Transitions\n\nAll map transition events. Sorted by map.\n\n';
}

// Add Section 3: Chests and Stones if not exists
if (!newDoc.includes('## Section 3: Chests and Stones')) {
  newDoc += '\n\n## Section 3: Chests and Stones\n\nAll chest and memory stone events. Sorted by map.\n\n';
}

// Generate entries for each map
for (const [mapName, events] of Object.entries(eventsByMap)) {
  const mapTitle = mapName.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  
  // Group by type
  const transitions = events.filter(e => e.id.includes('-Up') || e.id.includes('-Down') || e.id.includes('-North') || e.id.includes('-South') || e.id.includes('-East') || e.id.includes('-West') || e.id.includes('-Fortress'));
  const bosses = events.filter(e => e.id.includes('-Boss') || e.id.includes('-Climax') || e.id.includes('-Return'));
  const others = events.filter(e => !transitions.includes(e) && !bosses.includes(e));
  
  // Add transitions
  if (transitions.length > 0) {
    const sectionStart = newDoc.indexOf('## Section 2: Map Transitions');
    const sectionEnd = newDoc.indexOf('## Section 3:', sectionStart);
    const insertPos = sectionEnd > 0 ? sectionEnd : newDoc.length;
    
    let table = `\n### ${mapTitle} Transitions\n\n`;
    table += '| Event ID | Position | Trigger | Repeat | Description |\n';
    table += '|----------|----------|---------|--------|-------------|\n';
    
    for (const e of transitions) {
      const info = getEventInfo(e.id);
      table += `| ${e.id} | (${e.x}, ${e.y}) | ${info.trigger} | ${info.repeat} | ${info.desc} |\n`;
    }
    
    newDoc = newDoc.slice(0, insertPos) + table + newDoc.slice(insertPos);
  }
  
  // Add bosses
  if (bosses.length > 0) {
    const sectionStart = newDoc.indexOf('## Section 2: Map Transitions');
    const sectionEnd = newDoc.indexOf('## Section 3:', sectionStart);
    const insertPos = sectionEnd > 0 ? sectionEnd : newDoc.length;
    
    let table = `\n### ${mapTitle} Boss Encounters\n\n`;
    table += '| Event ID | Position | Trigger | Repeat | Description |\n';
    table += '|----------|----------|---------|--------|-------------|\n';
    
    for (const e of bosses) {
      const info = getEventInfo(e.id);
      table += `| ${e.id} | (${e.x}, ${e.y}) | ${info.trigger} | ${info.repeat} | ${info.desc} |\n`;
    }
    
    newDoc = newDoc.slice(0, insertPos) + table + newDoc.slice(insertPos);
  }
  
  // Add others
  if (others.length > 0) {
    const sectionStart = newDoc.indexOf('## Section 3: Chests and Stones');
    const insertPos = newDoc.length;
    
    let table = `\n### ${mapTitle} Chests and Stones\n\n`;
    table += '| Event ID | Position | Trigger | Repeat | Description |\n';
    table += '|----------|----------|---------|--------|-------------|\n';
    
    for (const e of others) {
      const info = getEventInfo(e.id);
      table += `| ${e.id} | (${e.x}, ${e.y}) | ${info.trigger} | ${info.repeat} | ${info.desc} |\n`;
    }
    
    newDoc = newDoc.slice(0, insertPos) + table + newDoc.slice(insertPos);
  }
}

writeFileSync(docPath, newDoc);
console.log(`✓ Documented ${report.issues.filter((i: any) => i.category === 'undocumented-event').length} undocumented events`);
