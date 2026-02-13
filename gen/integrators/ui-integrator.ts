/** Integrator for UI element assets — copies generated UI to game GUI assets. */

import { resolve } from 'node:path';
import { integrateCategory } from './generic-integrator';

const PROJECT_ROOT = resolve(
  import.meta.dirname ?? process.cwd(),
  import.meta.dirname ? '../..' : '.',
);

const UI_TARGET = resolve(PROJECT_ROOT, 'main/client/gui/assets');

export async function integrateUI(dryRun: boolean): Promise<number> {
  console.log('Integrating UI elements...');
  return integrateCategory('ui', UI_TARGET, dryRun);
}
