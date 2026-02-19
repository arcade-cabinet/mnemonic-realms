import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const reportPath = join(process.cwd(), 'scripts/validation/event-report.json');
const docPath = join(process.cwd(), 'docs/maps/event-placement.md');

const report = JSON.parse(readFileSync(reportPath, 'utf-8'));
const doc = readFileSync(docPath, 'utf-8');

// Get list of missing event IDs
const missingIds = report.issues
  .filter((i: any) => i.category === 'missing-event')
  .map((i: any) => i.id.replace('missing-', ''));

console.log(`Found ${missingIds.length} missing events to remove from documentation`);

// Remove lines containing these event IDs
const lines = doc.split('\n');
const filteredLines = lines.filter(line => {
  if (!line.startsWith('| EV-')) return true;
  const eventId = line.split('|')[1]?.trim();
  return !missingIds.includes(eventId);
});

writeFileSync(docPath, filteredLines.join('\n'));
console.log(`✓ Removed ${lines.length - filteredLines.length} incorrectly documented events`);
