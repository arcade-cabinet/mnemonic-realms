#!/usr/bin/env tsx
import { parseArgs } from 'node:util';
import { VisualValidator } from './visual-validator.js';
import { SpriteAnalyzer } from './sprite-analyzer.js';
import { MapValidator } from './map-validator.js';
import { EventVerifier } from './event-verifier.js';
import { ContentValidator } from './content-validator.js';
import { ValidationOrchestrator } from './validation-orchestrator.js';
import { logger } from './logger.js';
import { writeFileSync } from 'node:fs';

const VALIDATORS = {
  visual: VisualValidator,
  sprite: SpriteAnalyzer,
  map: MapValidator,
  event: EventVerifier,
  content: ContentValidator,
  all: ValidationOrchestrator,
};

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      strict: { type: 'boolean', short: 's', default: false },
      output: { type: 'string', short: 'o' },
      help: { type: 'boolean', short: 'h' },
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length === 0) {
    printHelp();
    process.exit(0);
  }

  const validatorName = positionals[0];
  if (!VALIDATORS[validatorName as keyof typeof VALIDATORS]) {
    logger.error(`Unknown validator: ${validatorName}`);
    logger.info('Available validators: visual, sprite, map, event, content, all');
    process.exit(1);
  }

  const ValidatorClass = VALIDATORS[validatorName as keyof typeof VALIDATORS];
  const validator = new ValidatorClass();

  logger.info(`Running ${validatorName} validator...`);
  const report = validatorName === 'all' 
    ? await (validator as ValidationOrchestrator).runAll()
    : await validator.validate();

  if (values.output) {
    writeFileSync(values.output, JSON.stringify(report, null, 2));
    logger.info(`Report written to ${values.output}`);
  }

  const summary = report.summary;
  const failed = summary.failed || summary.totalFailed || 0;
  const warnings = summary.warnings || summary.totalWarnings || 0;

  if (values.strict && (failed > 0 || warnings > 0)) {
    logger.error('Validation failed in strict mode');
    process.exit(1);
  } else if (failed > 0) {
    logger.error('Validation failed');
    process.exit(1);
  }

  logger.info('Validation passed');
}

function printHelp() {
  console.log(`
Usage: pnpm validate <validator> [options]

Validators:
  visual    - Validate visual consistency (layers, alignment, tiers)
  sprite    - Analyze sprite sheets (walk cycles, usage)
  map       - Validate maps (collision, boundaries, transitions)
  event     - Verify event placement (NPCs, chests, stones)
  content   - Validate content completeness (enemies, equipment, quests)
  all       - Run all validators

Options:
  -s, --strict    Fail on warnings (default: false)
  -o, --output    Write JSON report to file
  -h, --help      Show this help message

Examples:
  pnpm validate visual
  pnpm validate all --strict
  pnpm validate map --output map-report.json
`);
}

main().catch((error) => {
  logger.error('CLI failed:', error);
  process.exit(1);
});
