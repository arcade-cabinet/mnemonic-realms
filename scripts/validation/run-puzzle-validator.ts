import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PuzzleValidator } from './puzzle-validator.js';
import { logger } from './logger.js';

const validator = new PuzzleValidator();
const report = validator.validate();

// Write JSON report
const jsonPath = join(process.cwd(), 'scripts/validation/puzzle-report.json');
writeFileSync(jsonPath, JSON.stringify(report, null, 2));
logger.info(`JSON report written to ${jsonPath}`);

// Write Markdown report
const mdPath = join(process.cwd(), 'scripts/validation/puzzle-report.md');
const puzzles = validator.getPuzzles();

let markdown = `# Puzzle Validation Report

**Generated:** ${report.timestamp}
**Validator:** ${report.validator}
**Duration:** ${report.metadata?.duration}ms

## Summary

- **Total Puzzles:** ${report.totalChecked}
- **Dungeon Puzzles:** ${report.metadata?.dungeonPuzzles}
- **Stagnation Zone Puzzles:** ${report.metadata?.stagnationPuzzles}
- **Overworld Puzzles:** ${report.metadata?.overworldPuzzles}
- **Passed:** ${report.passed}
- **Failed:** ${report.failed}
- **Warnings:** ${report.warnings}

## Puzzle Catalog

### Dungeon Puzzles

| Puzzle | Map | Events | Mechanic | Fail Penalty |
|--------|-----|--------|----------|-------------|
`;

for (const puzzle of puzzles.filter((p) => p.category === 'dungeon')) {
  markdown += `| ${puzzle.name} | ${puzzle.map} | ${puzzle.events.join(', ')} | ${puzzle.mechanic} | ${puzzle.failPenalty} |\n`;
}

markdown += `
### Stagnation Zone Puzzles

| Puzzle | Map | Unlock Condition | Fail Penalty |
|--------|-----|-----------------|-------------|
`;

for (const puzzle of puzzles.filter((p) => p.category === 'stagnation')) {
  markdown += `| ${puzzle.name} | ${puzzle.map} | ${puzzle.mechanic} | ${puzzle.failPenalty} |\n`;
}

markdown += `
### Overworld Puzzles

| Puzzle | Map | Events | Mechanic |
|--------|-----|--------|----------|
`;

for (const puzzle of puzzles.filter((p) => p.category === 'overworld')) {
  markdown += `| ${puzzle.name} | ${puzzle.map} | ${puzzle.events.join(', ')} | ${puzzle.mechanic} |\n`;
}

if (report.errors.length > 0) {
  markdown += `\n## Errors\n\n`;
  for (const error of report.errors) {
    markdown += `- ${error}\n`;
  }
}

if (report.warningMessages && report.warningMessages.length > 0) {
  markdown += `\n## Warnings\n\n`;
  for (const warning of report.warningMessages) {
    markdown += `- ${warning}\n`;
  }
}

writeFileSync(mdPath, markdown);
logger.info(`Markdown report written to ${mdPath}`);

console.log('\n=== Puzzle Validation Summary ===');
console.log(`Total Puzzles: ${report.totalChecked}`);
console.log(`Dungeon: ${report.metadata?.dungeonPuzzles}`);
console.log(`Stagnation: ${report.metadata?.stagnationPuzzles}`);
console.log(`Overworld: ${report.metadata?.overworldPuzzles}`);
console.log(`Passed: ${report.passed}`);
console.log(`Failed: ${report.failed}`);
console.log(`Warnings: ${report.warnings}`);
