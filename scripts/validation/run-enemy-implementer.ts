#!/usr/bin/env tsx

import { join } from 'node:path';
import { EnemyImplementer } from './enemy-implementer.js';
import { logger } from './logger.js';

const catalogPath = join(process.cwd(), 'docs/design/enemies-catalog.md');
const outputDir = join(process.cwd(), 'main/database/enemies');

async function main() {
  logger.info('Starting Enemy Implementer...');

  const implementer = new EnemyImplementer(catalogPath, outputDir);

  // Parse catalog
  logger.info('Parsing enemies catalog...');
  const enemies = implementer.parseCatalog();
  logger.info(`Found ${enemies.length} enemies in catalog`);

  // Generate implementations
  logger.info('Generating enemy implementations...');
  let generated = 0;
  let validated = 0;

  for (const enemy of enemies) {
    const impl = implementer.generateImplementation(enemy);

    // Create file
    implementer.createEnemyFile(impl);
    generated++;

    // Validate
    if (implementer.validateImplementation(impl, enemy)) {
      validated++;
    }
  }

  logger.info(`Generated ${generated} enemy files`);
  logger.info(`Validated ${validated} implementations`);

  if (validated < generated) {
    logger.warn(`${generated - validated} implementations failed validation`);
    process.exit(1);
  }

  logger.info('Enemy implementation complete!');
}

main().catch((error) => {
  logger.error(`Fatal error: ${error}`);
  process.exit(1);
});
