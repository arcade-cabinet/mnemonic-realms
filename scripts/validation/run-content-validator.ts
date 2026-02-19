import { ContentValidator } from './content-validator.js';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

async function main() {
  const validator = new ContentValidator();
  const report = await validator.validate();

  // Generate JSON report
  const jsonPath = join('scripts', 'validation', 'content-report.json');
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`JSON report written to ${jsonPath}`);

  // Generate Markdown report
  const mdPath = join('scripts', 'validation', 'content-report.md');
  const markdown = generateMarkdownReport(report);
  writeFileSync(mdPath, markdown);
  console.log(`Markdown report written to ${mdPath}`);

  // Print summary
  console.log('\n=== Content Validation Summary ===');
  console.log(`Total checks: ${report.summary.totalChecks}`);
  console.log(`Passed: ${report.summary.passed}`);
  console.log(`Failed: ${report.summary.failed}`);
  console.log(`Warnings: ${report.summary.warnings}`);

  if (report.issues.length > 0) {
    console.log('\n=== Errors ===');
    for (const issue of report.issues.slice(0, 10)) {
      console.log(`[${issue.category}] ${issue.message}`);
      console.log(`  Location: ${issue.location}`);
    }
    if (report.issues.length > 10) {
      console.log(`... and ${report.issues.length - 10} more errors`);
    }
  }

  if (report.warnings.length > 0) {
    console.log('\n=== Warnings ===');
    for (const warning of report.warnings.slice(0, 10)) {
      console.log(`[${warning.category}] ${warning.message}`);
      console.log(`  Location: ${warning.location}`);
    }
    if (report.warnings.length > 10) {
      console.log(`... and ${report.warnings.length - 10} more warnings`);
    }
  }
}

function generateMarkdownReport(report: any): string {
  let md = '# Content Validation Report\n\n';
  md += `**Generated:** ${report.timestamp}\n\n`;
  md += '## Summary\n\n';
  md += `- Total checks: ${report.summary.totalChecks}\n`;
  md += `- Passed: ${report.summary.passed}\n`;
  md += `- Failed: ${report.summary.failed}\n`;
  md += `- Warnings: ${report.summary.warnings}\n\n`;

  if (report.issues.length > 0) {
    md += '## Errors\n\n';
    for (const issue of report.issues) {
      md += `### ${issue.category}\n\n`;
      md += `**Message:** ${issue.message}\n\n`;
      md += `**Location:** \`${issue.location}\`\n\n`;
    }
  }

  if (report.warnings.length > 0) {
    md += '## Warnings\n\n';
    for (const warning of report.warnings) {
      md += `### ${warning.category}\n\n`;
      md += `**Message:** ${warning.message}\n\n`;
      md += `**Location:** \`${warning.location}\`\n\n`;
    }
  }

  return md;
}

main().catch(console.error);
