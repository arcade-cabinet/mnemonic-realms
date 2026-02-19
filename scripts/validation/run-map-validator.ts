#!/usr/bin/env tsx
import { writeFileSync } from 'node:fs';
import { MapValidator } from './map-validator.js';
import { logger } from './logger.js';

async function main() {
  logger.info('=== Map Validator ===');

  const validator = new MapValidator();
  const report = await validator.validateAllMaps();

  writeFileSync('scripts/validation/map-report.json', JSON.stringify(report, null, 2));
  logger.info('JSON report written to scripts/validation/map-report.json');

  const markdown = generateMarkdownReport(report);
  writeFileSync('scripts/validation/map-report.md', markdown);
  logger.info('Markdown report written to scripts/validation/map-report.md');

  logger.info(`\n=== Summary ===`);
  logger.info(`Total maps checked: ${report.summary.totalChecks}`);
  logger.info(`Maps passed: ${report.summary.passed}`);
  logger.info(`Maps with issues: ${report.summary.failed}`);
  logger.info(`Total issues found: ${report.issues.length}`);
}

function generateMarkdownReport(report: any): string {
  let md = '# Map Validation Report\n\n';
  md += `**Generated:** ${report.timestamp}\n\n`;
  md += `**Validator:** ${report.metadata.validator} v${report.metadata.version}\n\n`;
  md += `**Duration:** ${report.metadata.duration}ms\n\n`;

  md += '## Summary\n\n';
  md += `- Total maps checked: ${report.summary.totalChecks}\n`;
  md += `- Maps passed: ${report.summary.passed}\n`;
  md += `- Maps with issues: ${report.summary.failed}\n`;
  md += `- Total issues: ${report.issues.length}\n\n`;

  if (report.issues.length === 0) {
    md += '✅ All maps passed validation!\n\n';
    return md;
  }

  md += '## Issues by Map\n\n';

  for (const mapReport of report.maps) {
    const totalMapIssues =
      mapReport.collisionIssues.length +
      mapReport.boundaryIssues.length +
      mapReport.transitionIssues.length;

    if (totalMapIssues === 0) {
      continue;
    }

    md += `### ${mapReport.mapName}\n\n`;
    md += `**Path:** \`${mapReport.mapPath}\`\n\n`;

    if (mapReport.collisionIssues.length > 0) {
      md += `#### Collision Issues (${mapReport.collisionIssues.length})\n\n`;
      for (const issue of mapReport.collisionIssues) {
        md += `- **[${issue.type}]** at (${issue.location.x}, ${issue.location.y}): ${issue.description}\n`;
      }
      md += '\n';
    }

    if (mapReport.boundaryIssues.length > 0) {
      md += `#### Boundary Issues (${mapReport.boundaryIssues.length})\n\n`;
      for (const issue of mapReport.boundaryIssues) {
        md += `- **[${issue.type}]** at (${issue.location.x}, ${issue.location.y}): ${issue.description}\n`;
      }
      md += '\n';
    }

    if (mapReport.transitionIssues.length > 0) {
      md += `#### Transition Issues (${mapReport.transitionIssues.length})\n\n`;
      for (const issue of mapReport.transitionIssues) {
        md += `- **[${issue.type}]** ${issue.sourceMap} → ${issue.destinationMap}: ${issue.description}\n`;
      }
      md += '\n';
    }
  }

  if (report.reachability && report.reachability.unreachableMaps.length > 0) {
    md += '## Unreachable Maps\n\n';
    for (const mapName of report.reachability.unreachableMaps) {
      md += `- ${mapName}\n`;
    }
    md += '\n';
  }

  return md;
}

main().catch((error) => {
  logger.error('Map validation failed:', error);
  process.exit(1);
});
