#!/usr/bin/env tsx

import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from './logger.js';

const enemiesDir = join(process.cwd(), 'main/database/enemies');
const indexPath = join(enemiesDir, 'index.ts');

function generateClassName(fileName: string): string {
  return fileName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function updateEnemyIndex() {
  logger.info('Updating enemy database index...');

  // Read all enemy files
  const files = readdirSync(enemiesDir)
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
    .sort();

  logger.info(`Found ${files.length} enemy files`);

  // Generate exports
  const exports = files.map((file) => {
    const baseName = file.replace('.ts', '');
    const className = generateClassName(baseName);
    return `export { default as ${className} } from './${baseName}';`;
  });

  // Write index file
  const content = `/** All enemy database entries. */\n\n${exports.join('\n')}\n`;
  writeFileSync(indexPath, content, 'utf-8');

  logger.info(`Updated ${indexPath} with ${exports.length} exports`);
}

updateEnemyIndex();
