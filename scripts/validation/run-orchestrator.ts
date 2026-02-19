#!/usr/bin/env tsx
import { writeFileSync } from 'node:fs';
import { ValidationOrchestrator } from './validation-orchestrator.js';
import { logger } from './logger.js';

async function main() {
  const orchestrator = new ValidationOrchestrator();
  const report = await orchestrator.runAll();

  writeFileSync('scripts/validation/orchestrator-report.json', JSON.stringify(report, null, 2));
  logger.info('\nJSON report written to scripts/validation/orchestrator-report.json');

  const markdown = generateMarkdownReport(report);
  writeFileSync('scripts/validation/orchestrator-report.md', markdown);
  logger.info('Markdown report written to scripts/validation/orchestrator-report.md');
}

function generateMarkdownReport(report: any): string {
  let md = '# Validation Orchestrator Report\n\n';
  md += `**Generated:** ${report.timestamp}\n\n`;
  md += `**Duration:** ${report.duration}ms\n\n`;

  md += '## Summary\n\n';
  md += `- Total validators: ${report.summary.totalValidators}\n`;
  md += `- Total checks: ${report.summary.totalChecks}\n`;
  md += `- Total passed: ${report.summary.totalPassed}\n`;
  md += `- Total failed: ${report.summary.totalFailed}\n`;
  md += `- Total warnings: ${report.summary.totalWarnings}\n\n`;

  md += '## Validator Results\n\n';

  for (const [name, validatorReport] of Object.entries(report.validators)) {
    const vr = validatorReport as any;
    md += `### ${name.charAt(0).toUpperCase() + name.slice(1)} Validator\n\n`;
    md += `- Checks: ${vr.summary?.totalChecks || vr.summary?.totalChecked || 0}\n`;
    md += `- Passed: ${vr.summary?.passed || 0}\n`;
    md += `- Failed: ${vr.summary?.failed || 0}\n`;
    md += `- Warnings: ${vr.summary?.warnings || 0}\n`;
    md += `- Duration: ${vr.metadata?.duration || 'N/A'}ms\n\n`;
  }

  return md;
}

main().catch((error) => {
  logger.error('Orchestrator failed:', error);
  console.error('Full error:', error);
  console.error('Error message:', error?.message);
  console.error('Error stack:', error?.stack);
  process.exit(1);
});
