/** CLI integrate subcommand — post-processes and copies to main/. */

import { integrateAudio } from './integrators/audio-integrator';
import { integrateCode } from './integrators/code-integrator';
import {
  integrateCategory,
  integrateSprites,
  integrateTilesets,
  integrateUI,
  TARGETS,
} from './integrators/index';

export async function runIntegrate(targets: string[], dryRun: boolean): Promise<void> {
  const all = targets.length === 0 || targets.includes('all');
  const images = all || targets.includes('images');
  const code = all || targets.includes('code');
  const audio = all || targets.includes('audio');
  let total = 0;

  if (images || targets.includes('tilesets')) total += await integrateTilesets(dryRun);
  if (images || targets.includes('sprites')) total += await integrateSprites(dryRun);
  if (images || targets.includes('portraits'))
    total += await integrateCategory('portraits', TARGETS.portraits, dryRun);
  if (images || targets.includes('items'))
    total += await integrateCategory('items', TARGETS.items, dryRun);
  if (images || targets.includes('ui')) total += await integrateUI(dryRun);

  if (audio || targets.includes('bgm') || targets.includes('ambient')) {
    total += await integrateAudio(targets, dryRun);
  }

  if (
    code ||
    targets.some((t) =>
      ['weapons', 'armor', 'consumables', 'skills', 'enemies', 'classes', 'states'].includes(t),
    )
  ) {
    const cats = code ? ['all'] : targets.filter((t) => !['images', 'all', 'audio'].includes(t));
    await integrateCode(cats, dryRun);
  }

  console.log(`\n${total} assets ${dryRun ? 'would be' : ''} processed.`);
}
