import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { NPCValidator } from './npc-validator.js';

const validator = new NPCValidator();
const report = validator.validate();

// Write JSON report
const jsonPath = join(process.cwd(), 'scripts/validation/npc-report.json');
writeFileSync(jsonPath, JSON.stringify(report, null, 2));

// Write Markdown report
const mdPath = join(process.cwd(), 'scripts/validation/npc-report.md');
const markdown = `# NPC Validation Report

**Validator**: ${report.validator}
**Timestamp**: ${report.timestamp}
**Duration**: ${report.metadata?.duration}ms

## Summary

- **Total NPCs Checked**: ${report.totalChecked}
- **Passed**: ${report.passed}
- **Failed**: ${report.failed}
- **Warnings**: ${report.warnings}

## Errors

${report.errors.length > 0 ? report.errors.map((e) => `- ${e}`).join('\n') : '_No errors found._'}

## Warnings

${report.warningMessages.length > 0 ? report.warningMessages.map((w) => `- ${w}`).join('\n') : '_No warnings._'}

## Metadata

- **NPCs Checked**: ${report.metadata?.npcsChecked}
- **Execution Time**: ${report.metadata?.duration}ms
`;

writeFileSync(mdPath, markdown);

console.log(`✅ NPC validation complete`);
console.log(`   Total NPCs: ${report.totalChecked}`);
console.log(`   Passed: ${report.passed}`);
console.log(`   Failed: ${report.failed}`);
console.log(`   Warnings: ${report.warnings}`);
console.log(`\n📄 Reports generated:`);
console.log(`   - ${jsonPath}`);
console.log(`   - ${mdPath}`);
