import { DungeonValidator } from './dungeon-validator.js';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const validator = new DungeonValidator();
const report = validator.validate();

// Generate JSON report
const jsonPath = join(process.cwd(), 'scripts/validation/dungeon-report.json');
writeFileSync(jsonPath, JSON.stringify(report, null, 2));

// Generate Markdown report
const mdPath = join(process.cwd(), 'scripts/validation/dungeon-report.md');
const mdContent = `# Dungeon Progression Validation Report

**Generated**: ${report.metadata.timestamp}
**Validator**: ${report.metadata.validator}

## Summary

- **Total Checks**: ${report.totalChecked}
- **Passed**: ${report.passed}
- **Failed**: ${report.failed}
- **Warnings**: ${report.warnings.length}

## Errors

${report.errors.length === 0 ? '_No errors found._' : report.errors.map((e) => `- **${e.type}**: ${e.message} (${e.location})`).join('\n')}

## Warnings

${report.warnings.length === 0 ? '_No warnings._' : report.warnings.map((w) => `- **${w.type}**: ${w.message} (${w.location})`).join('\n')}

## Validation Details

### Depths Progression (5 Floors)

All Depths floors validated for:
- Entrance information (map, position, condition)
- Boss encounters (except L1 tutorial floor)
- Stairway connections (L1→L2→L3→L4→L5)
- Memory lift fast-travel points

### Fortress Progression (3 Floors)

All Fortress floors validated for:
- Entrance information (F1 from Undrawn Peaks, F2/F3 from previous floor)
- Boss encounters (Grym's Right Hand, Archive Keeper, Grym)
- Stairway connections (F1→F2→F3)
- Memory lift configuration (F1 and F3 only)

### Dungeon Accessibility

All dungeon entrances validated for:
- Quest-gated access conditions (MQ-05, MQ-08, etc.)
- Surface entrance locations
- Entrance unlock requirements
`;

writeFileSync(mdPath, mdContent);

console.log(`\nDungeon validation complete!`);
console.log(`JSON report: ${jsonPath}`);
console.log(`Markdown report: ${mdPath}`);
console.log(`\nSummary: ${report.passed}/${report.totalChecked} checks passed`);

if (report.failed > 0) {
  console.error(`\n❌ ${report.failed} checks failed`);
  process.exit(1);
}

if (report.warnings.length > 0) {
  console.warn(`\n⚠️  ${report.warnings.length} warnings`);
}

console.log('\n✅ All dungeon progression checks passed!');
